"""
Posts a video to TikTok via the Content Posting API (Direct Post, FILE_UPLOAD).

Reads TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN from the
environment (set as GitHub Actions secrets), refreshes a fresh access token,
uploads the given video file in one chunk, and posts it.

privacy_level defaults to PUBLIC_TO_EVERYONE now that the app has passed
TikTok's review (previously it was pinned to SELF_ONLY, since TikTok
restricts unaudited clients to private viewing regardless of what is
requested here).

A successful upload only means TikTok *accepted the file*, not that it was
actually published - that happens asynchronously, and for apps without the
stricter "direct post" audit tier TikTok silently routes the content to the
creator's in-app inbox for manual confirmation instead of publishing it
(status SEND_TO_USER_INBOX), which used to look identical to a real success
in these logs. check_publish_status() polls the real status after upload so
that case (and genuine failures) actually show up as a failed CI step
instead of a silent no-op.

Usage:
    python post_tiktok.py <video_path.mp4> "<caption text>"
"""

import os
import sys
import time
from pathlib import Path

import requests

TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/"
INIT_URL = "https://open.tiktokapis.com/v2/post/publish/video/init/"
STATUS_URL = "https://open.tiktokapis.com/v2/post/publish/status/fetch/"


def refresh_access_token() -> str:
    resp = requests.post(
        TOKEN_URL,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "client_key": os.environ["TIKTOK_CLIENT_KEY"],
            "client_secret": os.environ["TIKTOK_CLIENT_SECRET"],
            "grant_type": "refresh_token",
            "refresh_token": os.environ["TIKTOK_REFRESH_TOKEN"],
        },
    )
    resp.raise_for_status()
    data = resp.json()
    if "access_token" not in data:
        raise RuntimeError(f"Token refresh failed: {data}")
    return data["access_token"]


def post_video(access_token: str, video_path: Path, caption: str, privacy_level: str = "PUBLIC_TO_EVERYONE") -> str:
    video_size = video_path.stat().st_size

    init_resp = requests.post(
        INIT_URL,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json; charset=UTF-8",
        },
        json={
            "post_info": {
                "title": caption,
                "privacy_level": privacy_level,
            },
            "source_info": {
                "source": "FILE_UPLOAD",
                "video_size": video_size,
                "chunk_size": video_size,
                "total_chunk_count": 1,
            },
        },
    )
    if not init_resp.ok:
        print(f"Init failed ({init_resp.status_code}): {init_resp.text}")
    init_resp.raise_for_status()
    init_data = init_resp.json()
    if init_data.get("error", {}).get("code") not in (None, "ok"):
        raise RuntimeError(f"Init failed: {init_data}")

    publish_id = init_data["data"]["publish_id"]
    upload_url = init_data["data"]["upload_url"]

    with open(video_path, "rb") as f:
        video_bytes = f.read()

    upload_resp = requests.put(
        upload_url,
        headers={
            "Content-Type": "video/mp4",
            "Content-Length": str(video_size),
            "Content-Range": f"bytes 0-{video_size - 1}/{video_size}",
        },
        data=video_bytes,
    )
    if not upload_resp.ok:
        print(f"Upload failed ({upload_resp.status_code}): {upload_resp.text}")
    upload_resp.raise_for_status()

    print(f"Uploaded. publish_id={publish_id}")
    return publish_id


def check_publish_status(access_token: str, publish_id: str, attempts: int = 6, delay_seconds: int = 5) -> tuple[str, str | None]:
    """Polls TikTok's status endpoint a handful of times (TikTok's docs note
    processing can take longer than that, so this isn't meant to wait it out
    fully - just long enough to distinguish "clearly failed" or "landed in
    the inbox instead of publishing" from "still processing, check later")."""
    status = "UNKNOWN"
    fail_reason = None
    for attempt in range(attempts):
        resp = requests.post(
            STATUS_URL,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json; charset=UTF-8",
            },
            json={"publish_id": publish_id},
        )
        resp.raise_for_status()
        data = resp.json().get("data", {})
        status = data.get("status", "UNKNOWN")
        fail_reason = data.get("fail_reason")
        print(f"Status check {attempt + 1}/{attempts}: {status}" + (f" ({fail_reason})" if fail_reason else ""))
        if status in ("PUBLISH_COMPLETE", "FAILED", "SEND_TO_USER_INBOX"):
            break
        time.sleep(delay_seconds)
    return status, fail_reason


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print('Usage: python post_tiktok.py <video_path.mp4> "<caption text>"')
        sys.exit(1)

    video_arg = Path(sys.argv[1])
    caption_arg = sys.argv[2]

    token = refresh_access_token()
    published_id = post_video(token, video_arg, caption_arg)
    final_status, reason = check_publish_status(token, published_id)

    if final_status == "FAILED":
        raise RuntimeError(f"TikTok rejected the post: {reason or 'no reason given'}")
    if final_status == "SEND_TO_USER_INBOX":
        print(
            "FAILED (effectively): TikTok sent this post to the creator's "
            "in-app inbox instead of publishing it directly - this app/token "
            "isn't approved for direct posting without manual confirmation. "
            "Open the TikTok app and confirm/publish it from the inbox, or "
            "check this app's audit status in the TikTok developer portal."
        )
        sys.exit(1)
    if final_status != "PUBLISH_COMPLETE":
        print(f"WARNING: TikTok hadn't finished processing yet (status={final_status}) after polling - it may still publish on its own; check the account later.")

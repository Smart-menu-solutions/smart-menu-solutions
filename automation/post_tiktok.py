"""
Posts a video to TikTok via the Content Posting API (Direct Post, FILE_UPLOAD).

Reads TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN from the
environment (set as GitHub Actions secrets), refreshes a fresh access token,
uploads the given video file in one chunk, and posts it.

privacy_level defaults to SELF_ONLY (private) -- while this app is unaudited,
TikTok restricts unaudited clients to private viewing anyway, so this makes
the actual intent explicit rather than relying on that safeguard silently.

Usage:
    python post_tiktok.py <video_path.mp4> "<caption text>"
"""

import os
import sys
from pathlib import Path

import requests

TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/"
INIT_URL = "https://open.tiktokapis.com/v2/post/publish/video/init/"


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


def post_video(access_token: str, video_path: Path, caption: str, privacy_level: str = "SELF_ONLY") -> str:
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

    print(f"Posted. publish_id={publish_id}")
    return publish_id


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print('Usage: python post_tiktok.py <video_path.mp4> "<caption text>"')
        sys.exit(1)

    video_arg = Path(sys.argv[1])
    caption_arg = sys.argv[2]

    token = refresh_access_token()
    post_video(token, video_arg, caption_arg)

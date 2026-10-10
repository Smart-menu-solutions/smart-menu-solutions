"""
Publishes a single IMAGE post to Instagram via the Instagram API with
Instagram Login (graph.instagram.com).

Instagram's media container needs a publicly reachable image_url (no direct
file upload), so the image must already be hosted somewhere before calling
this script -- see the GitHub Actions workflow, which pushes the rendered
JPEG to the repo and uses its raw.githubusercontent.com URL.

Reads INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN from the environment.

Usage:
    python post_instagram.py <public_image_url> "<caption text>"
"""

import os
import sys
import time

import requests

API_VERSION = "v21.0"
BASE = f"https://graph.instagram.com/{API_VERSION}"


def create_container(ig_id: str, access_token: str, image_url: str, caption: str) -> str:
    resp = requests.post(
        f"{BASE}/{ig_id}/media",
        data={"image_url": image_url, "caption": caption, "access_token": access_token},
    )
    if not resp.ok:
        print(f"Create container failed ({resp.status_code}): {resp.text}")
    resp.raise_for_status()
    return resp.json()["id"]


def wait_until_ready(container_id: str, access_token: str, timeout: int = 60) -> None:
    elapsed = 0
    while elapsed < timeout:
        resp = requests.get(
            f"{BASE}/{container_id}",
            params={"fields": "status_code", "access_token": access_token},
        )
        resp.raise_for_status()
        status = resp.json().get("status_code")
        if status == "FINISHED":
            return
        if status == "ERROR":
            raise RuntimeError(f"Container processing failed: {resp.json()}")
        time.sleep(3)
        elapsed += 3
    raise TimeoutError("Container was not ready in time")


def publish(ig_id: str, access_token: str, creation_id: str) -> str:
    resp = requests.post(
        f"{BASE}/{ig_id}/media_publish",
        data={"creation_id": creation_id, "access_token": access_token},
    )
    if not resp.ok:
        print(f"Publish failed ({resp.status_code}): {resp.text}")
    resp.raise_for_status()
    return resp.json()["id"]


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print('Usage: python post_instagram.py <public_image_url> "<caption text>"')
        sys.exit(1)

    image_url_arg = sys.argv[1]
    caption_arg = sys.argv[2]

    ig_user_id = os.environ["INSTAGRAM_USER_ID"]
    token = os.environ["INSTAGRAM_ACCESS_TOKEN"]

    container_id = create_container(ig_user_id, token, image_url_arg, caption_arg)
    wait_until_ready(container_id, token)
    media_id = publish(ig_user_id, token, container_id)
    print(f"Published. media_id={media_id}")

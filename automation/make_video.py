"""
Turns a still PNG card into a short silent MP4 (still image, no motion) so it
can be posted via TikTok's FILE_UPLOAD video path, which is far simpler than
the PULL_FROM_URL-only photo endpoint (no public hosting / domain
verification needed).

Usage:
    python make_video.py <input_png> <output_mp4> [duration_seconds]
"""

import subprocess
import sys
from pathlib import Path


def make_video(png_path: Path, mp4_path: Path, duration: int = 6) -> None:
    mp4_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", str(png_path),
        "-c:v", "libx264",
        "-t", str(duration),
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1080:1080",
        str(mp4_path),
    ]
    subprocess.run(cmd, check=True)
    print(f"{png_path} -> {mp4_path} ({duration}s)")


if __name__ == "__main__":
    if len(sys.argv) not in (3, 4):
        print("Usage: python make_video.py <input_png> <output_mp4> [duration_seconds]")
        sys.exit(1)

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    secs = int(sys.argv[3]) if len(sys.argv) == 4 else 6
    make_video(src, dst, secs)

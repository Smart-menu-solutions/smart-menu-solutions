"""
Computes today's day number (1-180) in the content calendar, matching the
Datum column in content_calendar.csv (which starts 2026-09-21).

Prints the day number to stdout, or nothing (and exits 1) if today falls
outside the 180-day range.
"""

import csv
import datetime
import sys
from pathlib import Path

CALENDAR_PATH = Path(__file__).resolve().parent / "content_calendar.csv"


def today_day_number() -> int | None:
    today = datetime.date.today().isoformat()
    with open(CALENDAR_PATH, newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            if row["Datum"] == today:
                return int(row["Tag"])
    return None


if __name__ == "__main__":
    day = today_day_number()
    if day is None:
        print("No content scheduled for today.", file=sys.stderr)
        sys.exit(1)
    print(day)

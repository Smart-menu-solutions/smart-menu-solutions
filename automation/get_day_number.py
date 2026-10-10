"""
Computes today's day number (1-180) in the content calendar.

The calendar repeats in a continuous 180-day loop starting from
START_DATE (2026-09-21, day 1) -- so day 181 reuses day 1's content,
day 182 reuses day 2's, and so on, forever. Since the 60 underlying
posts already only recur every ~60 days within one pass, a full-cycle
repeat every 180 days is unnoticeable and needs no manual extension.

Prints the day number (1-180) to stdout.
"""

import datetime

START_DATE = datetime.date(2026, 9, 21)
CYCLE_LENGTH = 180


def today_day_number() -> int:
    elapsed_days = (datetime.date.today() - START_DATE).days
    return (elapsed_days % CYCLE_LENGTH) + 1


if __name__ == "__main__":
    print(today_day_number())

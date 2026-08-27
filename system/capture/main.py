"""Caught capture — Layer 0 skeleton.

Capture produces flow records and never classifies (``architecture.md``
Boundaries). Layer 0 ships an idle skeleton so the container is part of the
topology from the first slice. The CSV-replay adapter — read labeled CICIDS rows
and emit flow records to the Redis ``flows`` channel — lands in the keystone (K1),
replay before live (``foundation.md`` Section 4).
"""

import time

IDLE_SECONDS = 30


def main() -> None:
    print("[capture] skeleton up; idle until the CSV-replay adapter (K1).", flush=True)
    while True:
        time.sleep(IDLE_SECONDS)


if __name__ == "__main__":
    main()

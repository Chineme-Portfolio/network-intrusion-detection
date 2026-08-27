"""Make capture/main.py importable on the host for unit tests."""

import sys
from pathlib import Path

CAPTURE = Path(__file__).resolve().parents[1]  # system/capture
if str(CAPTURE) not in sys.path:
    sys.path.insert(0, str(CAPTURE))

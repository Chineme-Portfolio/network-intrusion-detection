"""Caught capture — CSV replay adapter (K1, spec 0002, AC-1).

Reads a labeled CICIDS CSV and publishes one flow record per row to the Redis
`flows` channel, at a fixed configurable rate, so the stream is watchable. Capture
stays dumb (architecture.md Boundaries): it never featurizes and never classifies;
the ml-service owns all of that. The v1 MachineLearningCVE CSVs are feature only
(no source or destination IP), so the 5 tuple is synthesized; the real Destination
Port and the row Label are carried through.

Replay before live (foundation.md Section 4): the live and PCAP adapters (F4 to F6)
sit behind the same flow-record contract and replace this one without touching the
rest of the system.
"""

from __future__ import annotations

import json
import logging
import math
import os
import re
import time
import urllib.request
import uuid
from datetime import datetime, timezone

import pandas as pd
import redis

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
log = logging.getLogger("caught.capture")

FLOWS_CHANNEL = "flows"
SCHEMA_VERSION = "1.0.0"

REDIS_URL = os.environ.get("REDIS_URL", "redis://redis:6379")
ML_SERVICE_URL = os.environ.get("ML_SERVICE_URL", "http://ml-service:8000")
REPLAY_CSV = os.environ.get("REPLAY_CSV", "/data/replay.csv")
REPLAY_RATE = float(os.environ.get("REPLAY_RATE", "10"))  # flows per second
REPLAY_LOOP = os.environ.get("REPLAY_LOOP", "false").lower() in ("1", "true", "yes")
# Shuffle the rows once so benign and malicious interleave in the stream (CICIDS files
# group long benign stretches then attack bursts). On by default for a lively demo; set
# false to replay in file order. Replay is not real-time faithful anyway (F5/F6 are live).
REPLAY_SHUFFLE = os.environ.get("REPLAY_SHUFFLE", "true").lower() in ("1", "true", "yes")


def clean_name(name: str) -> str:
    """The 02 header normalization: collapse non alphanumerics to `_`, lowercase.

    Matches the featurizer's own key cleaning, so capture emits the snake_case keys the
    flow-record contract names (for example `destination_port`) while staying dumb about
    the actual feature transforms (which the featurizer owns).
    """
    return re.sub(r"[^0-9a-zA-Z]+", "_", str(name).strip()).strip("_").lower()


def json_safe(value):
    """Make one cell JSON serializable and keep the wire valid JSON.

    pandas hands back numpy scalars (not JSON serializable) and non-finite floats
    (Infinity/NaN, which are invalid JSON and would break the backend's JSON.parse).
    Encode a non-finite float as a sentinel string; the ml-service decodes it back to a
    real float before featurizing (spec 0002).
    """
    if isinstance(value, str):
        return value
    number = float(value)
    if math.isnan(number):
        return "NaN"
    if math.isinf(number):
        return "Infinity" if number > 0 else "-Infinity"
    # Keep whole numbers as ints (cleaner JSON, and destination_port must be an integer).
    if float(value).is_integer() and not isinstance(value, float):
        return int(value)
    return number


def synthesize_five_tuple(index: int, dst_port: int) -> dict:
    """A plausible, deterministic placeholder 5 tuple (the CSV has no addresses).

    Honest for replay (real addresses arrive with live capture); enough for the UI to
    show a flow. The featurizer never sees these (it buckets only on destination_port).
    """
    return {
        "src_ip": f"10.0.{(index >> 8) & 255}.{index & 255}",
        "src_port": 1024 + (index % 64000),
        "dst_ip": "192.168.10.50",
        "dst_port": dst_port,
        "protocol": 6,  # TCP; MachineLearningCVE carries no protocol column
    }


def row_to_flow_record(index: int, row: pd.Series, label_col: str, dport_col: str) -> dict:
    """Map one raw CICFlowMeter row to a flow-record (the L0.2 contract)."""
    features = {
        clean_name(col): json_safe(row[col])
        for col in row.index
        if col != label_col  # Label is ground_truth, not a feature
    }
    dst_port = int(row[dport_col])
    ground_truth = row[label_col]
    ground_truth = str(ground_truth) if pd.notna(ground_truth) else None
    return {
        "schema_version": SCHEMA_VERSION,
        "flow_id": str(uuid.uuid4()),
        "ts": datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"),
        **synthesize_five_tuple(index, dst_port),
        "features": features,
        "ground_truth": ground_truth,
    }


def wait_for_ml_ready(timeout_s: float = 120.0) -> None:
    """Block until the ml-service /ready returns 200 (its `flows` subscription is live).

    Redis pub/sub does not redeliver, so a flow published before the ml-service
    subscribes is lost. Waiting here makes the cold `docker compose up` demo reliable (AC-6).
    """
    url = f"{ML_SERVICE_URL.rstrip('/')}/ready"
    deadline = time.monotonic() + timeout_s
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=3) as resp:
                if resp.status == 200:
                    log.info("[capture] ml-service is ready; starting replay")
                    return
        except Exception:  # noqa: BLE001 - not ready yet (connection refused, 503); keep waiting
            pass
        time.sleep(1.0)
    raise TimeoutError(f"[capture] ml-service never became ready at {url}")


def find_columns(columns) -> tuple[str, str]:
    """Locate the Label and Destination Port columns by their cleaned names."""
    cleaned = {clean_name(c): c for c in columns}
    if "label" not in cleaned:
        raise ValueError("[capture] CSV has no Label column")
    if "destination_port" not in cleaned:
        raise ValueError("[capture] CSV has no Destination Port column")
    return cleaned["label"], cleaned["destination_port"]


def replay_once(client: redis.Redis, frame: pd.DataFrame, label_col: str, dport_col: str) -> int:
    """Publish every row once, paced at REPLAY_RATE. Returns the count published."""
    delay = 1.0 / REPLAY_RATE if REPLAY_RATE > 0 else 0.0
    published = 0
    for index, row in frame.iterrows():
        record = row_to_flow_record(index, row, label_col, dport_col)
        client.publish(FLOWS_CHANNEL, json.dumps(record))
        published += 1
        if delay:
            time.sleep(delay)
    return published


def main() -> None:
    log.info("[capture] CSV replay: %s at %.1f flows/s (loop=%s)", REPLAY_CSV, REPLAY_RATE, REPLAY_LOOP)
    frame = pd.read_csv(REPLAY_CSV)
    label_col, dport_col = find_columns(frame.columns)
    if REPLAY_SHUFFLE:
        frame = frame.sample(frac=1.0, random_state=42).reset_index(drop=True)
        log.info("[capture] shuffled rows for an interleaved demo stream (REPLAY_SHUFFLE)")
    log.info("[capture] loaded %d rows; label=%r dport=%r", len(frame), label_col, dport_col)

    wait_for_ml_ready()
    client = redis.from_url(REDIS_URL)

    total = 0
    while True:
        total += replay_once(client, frame, label_col, dport_col)
        log.info("[capture] replay pass done; %d flows published so far", total)
        if not REPLAY_LOOP:
            break
    log.info("[capture] replay finished (%d flows). Idle.", total)
    while True:  # stay alive so the container does not exit and restart-loop
        time.sleep(30)


if __name__ == "__main__":
    main()

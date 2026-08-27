"""The flows -> verdicts streaming loop (AC-2, AC-6).

An async redis-py subscriber on the `flows` channel, run as a FastAPI lifespan
background task. Each flow is featurized + classified in a threadpool, so the
synchronous pandas + sklearn work never blocks the event loop (spec 0002). A
malformed flow is logged and skipped; the loop keeps consuming
(code-standards.md Section 5: a dropped flow must not crash the stream).
"""

from __future__ import annotations

import asyncio
import json
import logging

import redis.asyncio as aioredis

from featurizer.featurizer import Featurizer

from . import pipeline
from .registry import LoadedModel

log = logging.getLogger("caught.ml.stream")

FLOWS_CHANNEL = "flows"
VERDICTS_CHANNEL = "verdicts"


async def run_stream(
    redis_url: str,
    featurizer: Featurizer,
    model: LoadedModel,
    ready: asyncio.Event,
    stop: asyncio.Event,
) -> None:
    """Subscribe `flows`, classify each flow, publish to `verdicts`, until `stop` is set."""
    client = aioredis.from_url(redis_url, decode_responses=True)
    pubsub = client.pubsub()
    await pubsub.subscribe(FLOWS_CHANNEL)
    # The subscription is live: flip readiness. Capture waits for /ready before it
    # replays, because Redis pub/sub does not redeliver (AC-6).
    ready.set()
    log.info("[ml-service] subscribed to '%s'; ready to classify", FLOWS_CHANNEL)

    loop = asyncio.get_running_loop()
    published = 0
    try:
        while not stop.is_set():
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message is None:
                continue
            try:
                flow = json.loads(message["data"])
            except (ValueError, TypeError) as exc:
                log.warning("[ml-service] dropping unparseable flow message: %s", exc)
                continue

            flow_id = flow.get("flow_id", "?")
            try:
                # featurize + classify together in ONE threadpool submission (both are
                # synchronous), keeping the loop free for /health, /ready, /predict.
                verdict = await loop.run_in_executor(
                    None, pipeline.flow_to_verdict, flow, featurizer, model
                )
            except ValueError as exc:
                # a featurizer rejection (bad port, missing/negative field): skip, never classify
                log.warning("[ml-service] skipping flow %s: %s", flow_id, exc)
                continue
            except Exception as exc:  # noqa: BLE001 - never let one flow kill the loop
                log.error("[ml-service] inference error on flow %s: %s", flow_id, exc)
                continue

            await client.publish(VERDICTS_CHANNEL, json.dumps(verdict))
            published += 1
            if published % 100 == 0:
                log.info("[ml-service] published %d verdicts", published)
    except asyncio.CancelledError:
        log.info("[ml-service] stream cancelled; shutting down after %d verdicts", published)
        raise
    finally:
        await pubsub.unsubscribe(FLOWS_CHANNEL)
        await pubsub.aclose()
        await client.aclose()

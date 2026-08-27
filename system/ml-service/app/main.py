"""Caught ml-service — the keystone inference service (spec 0002).

Loads the featurizer and one model ONCE at startup (lifespan, code-standards.md
Section 4), runs the flows -> verdicts streaming loop as a background task, and
serves /health (liveness), /ready (subscription live), and /predict (isolated
inference for testing). Layer 0 shipped only /health; K1 fills the rest in.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import Body, FastAPI, HTTPException
from fastapi.responses import JSONResponse

from featurizer.featurizer import Featurizer

from . import config, pipeline
from .registry import load_model
from .stream import run_stream

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s"
)
log = logging.getLogger("caught.ml")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Load once at startup. A failure raises here, so startup fails and the container is
    # unhealthy: the service never comes up half broken and silently classifying nothing (AC-6).
    app.state.featurizer = Featurizer(config.FEATURIZER_META)
    app.state.model = load_model(config.MANIFEST_PATH, config.MODELS_DIR, config.MODEL_ID)

    app.state.ready = asyncio.Event()
    app.state.stop = asyncio.Event()
    # Hold the task reference and cancel + await it on shutdown, so no task or Redis
    # connection leaks (spec 0002).
    app.state.stream_task = asyncio.create_task(
        run_stream(
            config.REDIS_URL,
            app.state.featurizer,
            app.state.model,
            app.state.ready,
            app.state.stop,
        )
    )

    try:
        yield
    finally:
        app.state.stop.set()
        app.state.stream_task.cancel()
        try:
            await app.state.stream_task
        except asyncio.CancelledError:
            pass


app = FastAPI(title="Caught ml-service", version="1.0.0", lifespan=lifespan)


@app.get("/health")
def health() -> dict[str, str]:
    """Liveness only (unchanged from Layer 0): the process is up."""
    return {"status": "ok"}


@app.get("/ready")
def ready() -> JSONResponse:
    """Readiness: the model is loaded and the `flows` subscription is live.

    Capture waits for this before it replays, so no early flows are lost to Redis
    pub/sub (AC-6). Returns 503 until ready so a compose healthcheck can gate on it.
    """
    event = getattr(app.state, "ready", None)
    if event is not None and event.is_set():
        return JSONResponse({"ready": True, "model_id": app.state.model.model_id})
    return JSONResponse({"ready": False}, status_code=503)


@app.post("/predict")
async def predict(flow: dict = Body(...)) -> dict:
    """Classify one flow record directly, without Redis (isolated inference, AC-2, AC-3)."""
    loop = asyncio.get_running_loop()
    try:
        return await loop.run_in_executor(
            None, pipeline.flow_to_verdict, flow, app.state.featurizer, app.state.model
        )
    except ValueError as exc:  # featurizer rejected the flow
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except KeyError as exc:  # malformed flow record (missing flow_id / features)
        raise HTTPException(status_code=422, detail=f"malformed flow record: missing {exc}") from exc

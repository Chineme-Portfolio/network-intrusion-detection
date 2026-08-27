"""Caught ml-service — Layer 0 skeleton.

At Layer 0 this service only proves it is alive: ``GET /health`` returns 200
(AC-1). Nothing is loaded and nothing is classified yet. The model registry, the
v1 featurizer, and ``POST /predict`` arrive with the keystone (K1); see
``system/docs/specs/0001-layer-0-foundation`` and ``build-graph.md``.

The registry will be loaded **once, at startup**, in the FastAPI ``lifespan``
handler and held in app state (``code-standards.md`` Section 4), never per
request. The handler is stubbed here so K1 slots in without reshaping the app.
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    # K1 loads the model registry + featurizer into ``_app.state`` here, once at
    # startup. Layer 0 has nothing to load; the hook exists so the shape is set.
    yield


app = FastAPI(title="Caught ml-service", version="0.0.0", lifespan=lifespan)


@app.get("/health")
def health() -> dict[str, str]:
    """Liveness only — deliberately does not touch Redis or any model.

    A skeleton container must report healthy before there is anything to serve
    (AC-1). Readiness (registry loaded, Redis reachable) becomes a separate
    signal in K1.
    """
    return {"status": "ok"}

"""Model loading + the family-aware verdict score (AC-2, AC-3).

K1 loads a SINGLE model, the one the manifest names as `default_model_id`, through a
model-generic loader so F1 widens it to all five without a rewrite. The score is
driven by the manifest's own `supports_proba` flag, not a re-derived family string
(registry-manifest.schema.json: supports_proba "Drives score semantics").

scikit-learn MUST be 1.8.0 here (the version the v1 models were pickled under);
unpickling under another version can silently shift behavior (library-docs.md).
"""

from __future__ import annotations

import json
import logging
import math
from dataclasses import dataclass
from pathlib import Path

import joblib
import numpy as np

log = logging.getLogger("caught.ml.registry")


@dataclass
class LoadedModel:
    """One loaded model plus the facts the score computation needs."""

    model_id: str
    display_name: str
    supports_proba: bool
    estimator: object  # the joblib pipeline (scaler + model bundled)
    malicious_index: int  # index into estimator.classes_ for the malicious class
    malicious_label: object  # the class value that means "malicious"
    positive_is_malicious: bool  # is malicious the sklearn "positive" class (last)?


def _malicious_index(classes: list) -> int:
    """Which class index is malicious, robust to the v1 label encoding.

    Binary CICIDS is benign vs malicious. Prefer an explicit non-benign string; else
    the numeric 1 (the standard benign=0 / malicious=1 encoding); else the positive
    class (sklearn's last index). Logged at load so the real encoding is visible.
    """
    lowered = [str(c).strip().lower() for c in classes]
    non_benign = [
        i
        for i, c in enumerate(lowered)
        if "benign" not in c and c not in ("0", "0.0", "false")
    ]
    if len(non_benign) == 1:
        return non_benign[0]
    try:
        vals = [float(c) for c in classes]
        if set(vals) == {0.0, 1.0}:
            return vals.index(1.0)
    except (TypeError, ValueError):
        pass
    return len(classes) - 1  # sklearn's positive class for a binary estimator


def load_model(manifest_path: Path, models_dir: Path, model_id: str | None = None) -> LoadedModel:
    """Load one model from the manifest. Raises on any failure, so startup fails fast."""
    manifest = json.loads(Path(manifest_path).read_text())
    wanted = model_id or manifest["default_model_id"]
    entry = next((m for m in manifest["models"] if m["model_id"] == wanted), None)
    if entry is None:
        raise ValueError(f"[ml-service] model_id {wanted!r} not found in manifest {manifest_path}")

    # The manifest path is a filename resolved against MODELS_DIR (the mount).
    path = Path(models_dir) / Path(entry["path"]).name
    if not path.exists():
        raise FileNotFoundError(f"[ml-service] model artifact missing: {path}")

    estimator = joblib.load(path)  # sklearn 1.8.0 pipeline (scaler + model)
    classes = list(getattr(estimator, "classes_", [0, 1]))
    idx = _malicious_index(classes)
    log.info(
        "[ml-service] loaded model %s (%s): classes_=%s, malicious=%r, supports_proba=%s",
        wanted,
        entry["family"],
        classes,
        classes[idx],
        entry["supports_proba"],
    )
    return LoadedModel(
        model_id=wanted,
        display_name=entry["display_name"],
        supports_proba=bool(entry["supports_proba"]),
        estimator=estimator,
        malicious_index=idx,
        malicious_label=classes[idx],
        positive_is_malicious=(idx == len(classes) - 1),
    )


def _sigmoid(x: float) -> float:
    """Logistic squash, overflow safe for large |x| (SVM margins can be large)."""
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    z = math.exp(x)
    return z / (1.0 + z)


def score_flow(model: LoadedModel, X) -> tuple[str, float, str]:
    """Classify one featurized flow (a 1 row DataFrame). Returns (verdict, score, score_kind).

    verdict is benign|malicious. score is malicious confidence in 0..1. score_kind is
    calibrated for a probability model (the tree), uncalibrated for the SVMs.
    """
    predicted = model.estimator.predict(X)[0]
    verdict = "malicious" if predicted == model.malicious_label else "benign"

    if model.supports_proba:
        proba = float(model.estimator.predict_proba(X)[0][model.malicious_index])
        score, kind = proba, "calibrated"
    else:
        margin = float(np.ravel(model.estimator.decision_function(X))[0])
        # decision_function is signed toward the sklearn positive class; orient it to malicious.
        signed = margin if model.positive_is_malicious else -margin
        score, kind = _sigmoid(signed), "uncalibrated"

    return verdict, max(0.0, min(1.0, score)), kind

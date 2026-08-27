"""ml-service configuration, from the environment only (code-standards.md Section 6).

No hostnames, URLs, or paths are hardcoded; every setting has an env var with a
sensible container default. spec 0002 Configuration required.
"""

from __future__ import annotations

import os
from pathlib import Path

# The pub/sub spine.
REDIS_URL: str = os.environ.get("REDIS_URL", "redis://redis:6379")

# Where the v1 joblib models live (git ignored, mounted read only in compose).
MODELS_DIR: Path = Path(os.environ.get("MODELS_DIR", "/models"))

# The registry manifest (names default_model_id and each model's path/supports_proba).
MANIFEST_PATH: Path = Path(os.environ.get("MANIFEST_PATH", "/app/registry.manifest.json"))

# The frozen featurizer artifact (train max, the 67 column order, dtypes).
FEATURIZER_META: Path = Path(
    os.environ.get("FEATURIZER_META", "/app/featurizer/featurizer_meta.json")
)

# Optional override: which single model K1 loads. Defaults to the manifest's
# default_model_id (the decision tree). F1 widens this to the full registry.
MODEL_ID: str | None = os.environ.get("CAUGHT_MODEL_ID") or None

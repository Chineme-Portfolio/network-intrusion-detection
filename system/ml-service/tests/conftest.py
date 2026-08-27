"""Make the ml-service app importable on the host for unit tests.

Adds system/ml-service (so `import app.*` and `import featurizer.*` resolve) and
system/shared/generated/python (the generated `caught_contracts`, produced by codegen
at image build; regenerate on the host with `bash system/shared/codegen/generate.sh`).
"""

import sys
from pathlib import Path

ML_SERVICE = Path(__file__).resolve().parents[1]  # system/ml-service
SHARED_GENERATED = ML_SERVICE.parents[0] / "shared" / "generated" / "python"

for path in (str(ML_SERVICE), str(SHARED_GENERATED)):
    if path not in sys.path:
        sys.path.insert(0, path)

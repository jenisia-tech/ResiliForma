import sys
from pathlib import Path

# Add backend directory to Python sys.path so all submodules (analysis, models, etc.) resolve cleanly
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from main import app

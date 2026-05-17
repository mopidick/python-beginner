import json
from pathlib import Path

from app.levels import LEVELS


ROOT = Path(__file__).resolve().parents[2]
SHARED_LEVELS = ROOT / "shared" / "levels.json"
FRONTEND_LEVELS = ROOT / "frontend" / "src" / "levels" / "levels.ts"


def test_backend_levels_are_loaded_from_shared_source():
    shared = json.loads(SHARED_LEVELS.read_text(encoding="utf-8"))

    assert list(LEVELS) == [level["id"] for level in shared]
    for level in shared:
        assert LEVELS[level["id"]]["checks"] == level["checks"]


def test_frontend_imports_shared_level_data():
    source = FRONTEND_LEVELS.read_text(encoding="utf-8")

    assert "../../../shared/levels.json" in source

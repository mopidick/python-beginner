import re
from pathlib import Path

from app.levels import LEVELS


ROOT = Path(__file__).resolve().parents[2]
FRONTEND_LEVELS = ROOT / "frontend" / "src" / "levels" / "levels.ts"


def test_frontend_level_ids_and_check_counts_match_backend():
    source = FRONTEND_LEVELS.read_text(encoding="utf-8")

    for level_id, level in LEVELS.items():
        assert f'id: "{level_id}"' in source
        for check in level["checks"]:
            assert check["label"] in source

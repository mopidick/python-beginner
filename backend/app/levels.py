import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
LEVELS_FILE = ROOT / "shared" / "levels.json"


def _load_levels() -> dict[str, dict[str, Any]]:
    levels = json.loads(LEVELS_FILE.read_text(encoding="utf-8"))
    return {level["id"]: level for level in levels}


LEVELS = _load_levels()


def get_level(level_id: str) -> dict[str, Any] | None:
    return LEVELS.get(level_id)


def list_level_summaries() -> list[dict[str, Any]]:
    return [
        {
            "id": level["id"],
            "title": level["title"],
            "checks": [
                {"id": check["id"], "label": check["label"]}
                for check in level["checks"]
            ],
        }
        for level in LEVELS.values()
    ]

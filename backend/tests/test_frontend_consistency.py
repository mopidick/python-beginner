import json
import re
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


def test_every_check_has_specific_failure_hint():
    shared = json.loads(SHARED_LEVELS.read_text(encoding="utf-8"))

    missing = [
        f"{level['id']}:{check['id']}"
        for level in shared
        for check in level["checks"]
        if not check.get("hint")
    ]

    assert missing == []


def test_chapter_numbers_are_unique_and_ordered():
    shared = json.loads(SHARED_LEVELS.read_text(encoding="utf-8"))
    chapters = []
    for level in shared:
        if level["chapter"] not in chapters:
            chapters.append(level["chapter"])

    numbers = [int(re.search(r"第 (\d+) 章", chapter).group(1)) for chapter in chapters]

    assert numbers == list(range(1, len(numbers) + 1))

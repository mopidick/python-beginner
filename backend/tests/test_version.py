import json
import re
from pathlib import Path

from app.main import VERSION


ROOT = Path(__file__).resolve().parents[2]


def test_version_is_consistent_for_current_release():
    frontend_package = json.loads((ROOT / "frontend" / "package.json").read_text(encoding="utf-8"))
    frontend_lock = json.loads((ROOT / "frontend" / "package-lock.json").read_text(encoding="utf-8"))
    app_source = (ROOT / "frontend" / "src" / "App.tsx").read_text(encoding="utf-8")
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    deployment = (ROOT / "DEPLOYMENT.md").read_text(encoding="utf-8")

    assert VERSION == "0.6.0"
    assert frontend_package["version"] == VERSION
    assert frontend_lock["version"] == VERSION
    assert frontend_lock["packages"][""]["version"] == VERSION
    assert re.search(r'const VERSION = "0\.6\.0"', app_source)
    assert f"版本：v{VERSION}" in readme
    assert f"## v{VERSION}" in changelog
    assert f'"version": "{VERSION}"' in deployment

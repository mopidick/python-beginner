import json
import os
import subprocess
import sys
from pathlib import Path

from app.levels import get_level
from app.feedback import diagnostic_for_error


RUNNER = Path(__file__).with_name("runner.py")
BACKEND_ROOT = RUNNER.parent.parent


def timeout_result():
    error = {
        "type": "TimeoutError",
        "message": "Code timed out. Check for an infinite loop.",
        "line": None,
    }
    return {
        "stdout": "",
        "stderr": "",
        "error": error,
        "variables": {},
        "checks": [],
        "diagnostics": diagnostic_for_error(error),
        "passed": False,
    }


def runner_error(message: str, stderr: str = ""):
    error = {
        "type": "RunnerError",
        "message": message,
        "line": None,
    }
    return {
        "stdout": "",
        "stderr": stderr,
        "error": error,
        "variables": {},
        "checks": [],
        "diagnostics": diagnostic_for_error(error),
        "passed": False,
    }


def run_python(level_id: str, code: str, timeout_seconds: float = 3.0):
    level = get_level(level_id)
    checks = level["checks"] if level else []
    payload = json.dumps({"code": code, "checks": checks}, ensure_ascii=False)

    try:
        env = os.environ.copy()
        env["PYTHONPATH"] = str(BACKEND_ROOT)
        completed = subprocess.run(
            [sys.executable, str(RUNNER)],
            input=payload,
            text=True,
            capture_output=True,
            timeout=timeout_seconds,
            cwd=str(BACKEND_ROOT),
            env=env,
        )
    except subprocess.TimeoutExpired:
        return timeout_result()

    if completed.returncode != 0:
        return runner_error(completed.stderr or "Runner failed to start.", completed.stderr)

    try:
        return json.loads(completed.stdout)
    except json.JSONDecodeError:
        return runner_error("Runner returned an invalid response.", completed.stderr)

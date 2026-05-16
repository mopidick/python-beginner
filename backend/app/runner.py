import contextlib
import io
import json
import math
import sys
import traceback

from app.checks import evaluate_checks
from app.feedback import diagnostic_for_error


SIMPLE_TYPES = (type(None), bool, int, float, str)
MAX_TEXT_LENGTH = 500
MAX_OUTPUT_LENGTH = 65536

SAFE_BUILTINS = {
    "__build_class__": __build_class__,
    "abs": abs,
    "all": all,
    "any": any,
    "bool": bool,
    "dict": dict,
    "enumerate": enumerate,
    "Exception": Exception,
    "float": float,
    "int": int,
    "len": len,
    "list": list,
    "max": max,
    "min": min,
    "None": None,
    "print": print,
    "range": range,
    "round": round,
    "str": str,
    "sum": sum,
    "True": True,
    "False": False,
    "tuple": tuple,
    "type": type,
    "ValueError": ValueError,
    "ZeroDivisionError": ZeroDivisionError,
}


def truncate_text(text, limit=MAX_TEXT_LENGTH):
    if len(text) <= limit:
        return text
    return f"{text[:limit]}...[truncated]"


def truncate_output(text):
    if len(text) <= MAX_OUTPUT_LENGTH:
        return text
    return f"{text[:MAX_OUTPUT_LENGTH]}...[output truncated]"


def safe_repr(value):
    try:
        return truncate_text(repr(value))
    except Exception:
        return f"<unrepresentable {type(value).__name__}>"


def serialize_value(value, depth=0):
    if isinstance(value, float) and not math.isfinite(value):
        return safe_repr(value)
    if isinstance(value, SIMPLE_TYPES):
        return truncate_text(value) if isinstance(value, str) else value
    if depth >= 3:
        return safe_repr(value)
    if isinstance(value, (list, tuple)):
        return [serialize_value(item, depth + 1) for item in list(value)[:50]]
    if isinstance(value, dict):
        result = {}
        for key, item in list(value.items())[:50]:
            if isinstance(key, str):
                result[key] = serialize_value(item, depth + 1)
        return result
    return safe_repr(value)


def serialize_variables(namespace):
    variables = {}
    for name, value in namespace.items():
        if name.startswith("_") or callable(value) or name == "__builtins__":
            continue
        variables[name] = {
            "type": type(value).__name__,
            "value": serialize_value(value),
        }
    return variables


def error_payload(exc):
    line = None
    if isinstance(exc, SyntaxError):
        line = exc.lineno
    else:
        tb = traceback.extract_tb(exc.__traceback__)
        user_frames = [frame for frame in tb if frame.filename == "<user_code>"]
        if user_frames:
            line = user_frames[-1].lineno

    return {
        "type": type(exc).__name__,
        "message": str(exc),
        "line": line,
    }


def run_payload(payload):
    stdout_buffer = io.StringIO()
    stderr_buffer = io.StringIO()
    namespace = {"__builtins__": SAFE_BUILTINS, "__name__": "__user_code__"}
    error = None

    with contextlib.redirect_stdout(stdout_buffer), contextlib.redirect_stderr(stderr_buffer):
        try:
            compiled = compile(payload["code"], "<user_code>", "exec")
            exec(compiled, namespace, namespace)
        except Exception as exc:
            error = error_payload(exc)
            traceback.print_exc(file=stderr_buffer)

    variables = {} if error else serialize_variables(namespace)
    checks = [] if error else evaluate_checks(payload.get("checks", []), variables)
    return {
        "stdout": truncate_output(stdout_buffer.getvalue()),
        "stderr": truncate_output(stderr_buffer.getvalue()),
        "error": error,
        "variables": variables,
        "checks": checks,
        "diagnostics": diagnostic_for_error(error),
        "passed": bool(checks) and all(check["passed"] for check in checks),
    }


def main():
    payload = json.loads(sys.stdin.read())
    print(json.dumps(run_payload(payload), ensure_ascii=False, allow_nan=False))


if __name__ == "__main__":
    main()

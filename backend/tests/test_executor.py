from app.executor import run_python


def test_run_python_captures_stdout_and_variables():
    result = run_python(
        "variables-01",
        "x = 10\nname = 'Ada'\nprint(x)",
    )

    assert result["stdout"] == "10\n"
    assert result["stderr"] == ""
    assert result["error"] is None
    assert result["variables"]["x"] == {"type": "int", "value": 10}
    assert result["variables"]["name"] == {"type": "str", "value": "Ada"}


def test_run_python_reports_syntax_errors():
    result = run_python("variables-01", "x =")

    assert result["stdout"] == ""
    assert result["error"] is not None
    assert result["error"]["type"] == "SyntaxError"
    assert "invalid syntax" in result["error"]["message"]
    assert result["diagnostics"] == [
        {
            "severity": "error",
            "line": 1,
            "title": "语法错误",
            "explanation": "Python 没有读懂这一行代码，通常是少了值、括号、冒号或引号。",
            "suggestion": "回到标出的行，检查表达式是否写完整。",
        }
    ]
    assert result["passed"] is False


def test_run_python_reports_runtime_errors():
    result = run_python("variables-01", "answer = 1 / 0")

    assert result["error"] is not None
    assert result["error"]["type"] == "ZeroDivisionError"
    assert "division by zero" in result["error"]["message"]
    assert result["diagnostics"][0]["title"] == "除数不能为 0"
    assert result["diagnostics"][0]["suggestion"] == "在除法前判断分母，或者为 0 的情况返回 None。"
    assert result["variables"] == {}


def test_run_python_explains_name_errors():
    result = run_python("variables-01", "print(total)")

    assert result["error"]["type"] == "NameError"
    assert result["diagnostics"][0]["title"] == "名称未定义"
    assert result["diagnostics"][0]["suggestion"] == "确认变量名拼写一致，并且在使用前已经赋值。"


def test_run_python_times_out_infinite_loops():
    result = run_python("variables-01", "while True:\n    pass", timeout_seconds=0.2)

    assert result["error"] is not None
    assert result["error"]["type"] == "TimeoutError"
    assert result["passed"] is False


def test_run_python_blocks_imports():
    result = run_python("variables-01", "import os\nx = 10")

    assert result["error"] is not None
    assert result["error"]["type"] == "ImportError"
    assert result["passed"] is False


def test_run_python_truncates_large_stdout():
    result = run_python("variables-01", "print('x' * 70000)")

    assert len(result["stdout"]) < 70000
    assert "[output truncated]" in result["stdout"]


def test_run_python_handles_runner_protocol_errors(monkeypatch):
    class Completed:
        returncode = 0
        stdout = "not-json"
        stderr = ""

    monkeypatch.setattr("app.executor.subprocess.run", lambda *args, **kwargs: Completed())
    result = run_python("variables-01", "x = 10")

    assert result["error"]["type"] == "RunnerError"
    assert result["passed"] is False


def test_run_python_serializes_common_containers():
    result = run_python(
        "lists-01",
        "items = [1, 'two', True]\nprofile = {'name': 'Lin', 'score': 3}",
    )

    assert result["variables"]["items"] == {
        "type": "list",
        "value": [1, "two", True],
    }
    assert result["variables"]["profile"] == {
        "type": "dict",
        "value": {"name": "Lin", "score": 3},
    }


def test_run_python_handles_bad_repr_objects():
    result = run_python(
        "variables-01",
        "class Broken:\n    def __repr__(self):\n        raise RuntimeError('boom')\nobj = Broken()\nx = 10",
    )

    assert result["error"] is None
    assert result["variables"]["obj"]["value"] == "<unrepresentable Broken>"


def test_failed_checks_explain_expected_and_actual_values():
    result = run_python("variables-01", "x = 9")

    assert result["passed"] is False
    assert result["checks"][0]["passed"] is False
    assert result["checks"][0]["actual"] == 9
    assert result["checks"][0]["expected"] == 10
    assert result["checks"][0]["reason"] == "x 当前是 9，目标是 10。"


def test_bool_checks_do_not_accept_integer_standin():
    result = run_python("types-01", "count = 3\nname = 'Python'\nactive = 1")

    assert result["passed"] is False
    active_check = next(check for check in result["checks"] if check["id"] == "active-is-true")
    assert active_check["passed"] is False
    assert active_check["reason"] == "active 当前是 1，目标是 true。"

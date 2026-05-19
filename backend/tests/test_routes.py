from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_run_endpoint_returns_checks_for_known_level():
    response = client.post(
        "/api/run",
        json={"levelId": "variables-01", "code": "x = 10\nprint(x)"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["stdout"] == "10\n"
    assert body["variables"]["x"] == {"type": "int", "value": 10}
    assert body["checks"] == [
        {
            "id": "x-is-10",
            "label": "创建变量 x，并让它等于 10",
            "passed": True,
            "hint": "检查变量名是否是 x，并确认它的值是整数 10。",
            "actual": 10,
            "expected": 10,
            "reason": "x 已达到目标值。",
        }
    ]
    assert body["passed"] is True


def test_run_endpoint_keeps_failed_checks_false():
    response = client.post(
        "/api/run",
        json={"levelId": "variables-01", "code": "x = 9"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["checks"][0]["passed"] is False
    assert body["checks"][0]["hint"] == "检查变量名是否是 x，并确认它的值是整数 10。"
    assert body["checks"][0]["actual"] == 9
    assert body["checks"][0]["expected"] == 10
    assert body["checks"][0]["reason"] == "x 当前是 9，目标是 10。"
    assert body["checks"][0]["failureType"] == "value_mismatch"
    assert "x" in body["checks"][0]["nextStep"]
    assert body["passed"] is False


def test_run_endpoint_rejects_unknown_level():
    response = client.post(
        "/api/run",
        json={"levelId": "missing", "code": "x = 10"},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Level not found"


def test_run_endpoint_rejects_too_large_code():
    response = client.post(
        "/api/run",
        json={"levelId": "variables-01", "code": "x" * 50001},
    )

    assert response.status_code == 422


def test_health_endpoint_returns_current_version():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"version": "0.4.1", "status": "ok"}


def test_levels_endpoint_returns_backend_level_metadata():
    response = client.get("/api/levels")

    assert response.status_code == 200
    body = response.json()
    assert len(body["levels"]) >= 40
    assert body["levels"][0] == {
        "id": "variables-01",
        "title": "变量与执行状态",
        "checks": [{"id": "x-is-10", "label": "创建变量 x，并让它等于 10"}],
    }
    for level in body["levels"]:
        for check in level["checks"]:
            assert set(check) == {"id", "label"}


def test_run_endpoint_response_contract_for_error_result():
    response = client.post(
        "/api/run",
        json={"levelId": "variables-01", "code": "1 / 0"},
    )

    assert response.status_code == 200
    body = response.json()
    assert set(body.keys()) == {"stdout", "stderr", "error", "variables", "checks", "diagnostics", "passed"}
    assert body["error"]["type"] == "ZeroDivisionError"
    assert body["diagnostics"][0]["severity"] == "error"
    assert body["passed"] is False

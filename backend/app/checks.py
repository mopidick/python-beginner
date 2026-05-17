import json


def format_value(value):
    return json.dumps(value, ensure_ascii=False)


def values_equal(actual, expected):
    if isinstance(actual, bool) or isinstance(expected, bool):
        return type(actual) is bool and type(expected) is bool and actual == expected
    if isinstance(actual, (int, float)) and isinstance(expected, (int, float)):
        return abs(actual - expected) < 0.000001
    return actual == expected


def explain_variable_check(check, variable, passed):
    name = check["name"]
    expected = check["expected"]
    if variable is None:
        return f"没有找到变量 {name}，请先创建并赋值。"
    if passed:
        return f"{name} 已达到目标值。"
    actual = variable.get("value")
    return f"{name} 当前是 {format_value(actual)}，目标是 {format_value(expected)}。"


def evaluate_checks(checks, variables):
    results = []
    for check in checks:
        passed = False
        variable = None
        if check["type"] == "variable_equals":
            variable = variables.get(check["name"])
            passed = variable is not None and values_equal(variable.get("value"), check["expected"])

        result = {
            "id": check["id"],
            "label": check["label"],
            "passed": passed,
            "hint": check.get("hint", "对照关卡目标检查变量名和值。"),
        }
        if check["type"] == "variable_equals":
            result.update(
                {
                    "actual": None if variable is None else variable.get("value"),
                    "expected": check["expected"],
                    "reason": explain_variable_check(check, variable, passed),
                }
            )
        results.append(result)
    return results

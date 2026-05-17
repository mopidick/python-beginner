def values_equal(actual, expected):
    if isinstance(actual, (int, float)) and isinstance(expected, (int, float)):
        return abs(actual - expected) < 0.000001
    return actual == expected


def evaluate_checks(checks, variables):
    results = []
    for check in checks:
        passed = False
        if check["type"] == "variable_equals":
            variable = variables.get(check["name"])
            passed = variable is not None and values_equal(variable.get("value"), check["expected"])

        results.append(
            {
                "id": check["id"],
                "label": check["label"],
                "passed": passed,
                "hint": check.get("hint", "对照关卡目标检查变量名和值。"),
            }
        )
    return results

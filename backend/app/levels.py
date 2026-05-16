LEVELS = {
    "variables-01": {
        "id": "variables-01",
        "title": "变量与执行状态",
        "checks": [
            {
                "id": "x-is-10",
                "label": "创建变量 x，并让它等于 10",
                "type": "variable_equals",
                "name": "x",
                "expected": 10,
                "hint": "检查变量名是否是 x，并确认它的值是整数 10。",
            }
        ],
    },
    "types-01": {
        "id": "types-01",
        "title": "基础类型",
        "checks": [
            {"id": "count-is-3", "label": "count 等于 3", "type": "variable_equals", "name": "count", "expected": 3},
            {"id": "name-is-python", "label": "name 等于 Python", "type": "variable_equals", "name": "name", "expected": "Python"},
            {"id": "active-is-true", "label": "active 为 True", "type": "variable_equals", "name": "active", "expected": True},
        ],
    },
    "strings-01": {
        "id": "strings-01",
        "title": "字符串格式化",
        "checks": [
            {"id": "message-is-hello", "label": "message 等于 Hello, Ada!", "type": "variable_equals", "name": "message", "expected": "Hello, Ada!"},
        ],
    },
    "lists-01": {
        "id": "lists-01",
        "title": "列表与索引",
        "checks": [
            {"id": "numbers-1-to-5", "label": "numbers 等于 [1, 2, 3, 4, 5]", "type": "variable_equals", "name": "numbers", "expected": [1, 2, 3, 4, 5]},
            {"id": "middle-slice", "label": "middle 等于 [2, 3, 4]", "type": "variable_equals", "name": "middle", "expected": [2, 3, 4]},
        ],
    },
    "dicts-01": {
        "id": "dicts-01",
        "title": "字典与结构化数据",
        "checks": [
            {"id": "summary-name", "label": "summary.name 等于 Lin", "type": "variable_equals", "name": "summary", "expected": {"name": "Lin", "passed": True}},
        ],
    },
    "conditionals-01": {
        "id": "conditionals-01",
        "title": "条件分支",
        "checks": [
            {"id": "grade-is-b", "label": "score 为 86 时 grade 等于 B", "type": "variable_equals", "name": "grade", "expected": "B"},
        ],
    },
    "loops-01": {
        "id": "loops-01",
        "title": "循环与过滤",
        "checks": [
            {"id": "evens-list", "label": "evens 等于 [2, 4, 6]", "type": "variable_equals", "name": "evens", "expected": [2, 4, 6]},
        ],
    },
    "functions-01": {
        "id": "functions-01",
        "title": "函数",
        "checks": [
            {"id": "result-tax", "label": "result 等于 110.0", "type": "variable_equals", "name": "result", "expected": 110.0},
        ],
    },
    "errors-01": {
        "id": "errors-01",
        "title": "异常与防御",
        "checks": [
            {"id": "result-none", "label": "result 为 None", "type": "variable_equals", "name": "result", "expected": None},
        ],
    },
    "challenge-01": {
        "id": "challenge-01",
        "title": "综合挑战：日志统计",
        "checks": [
            {"id": "error-count", "label": "error_count 等于 2", "type": "variable_equals", "name": "error_count", "expected": 2},
        ],
    },
    "string-methods-01": {
        "id": "string-methods-01",
        "title": "字符串方法",
        "checks": [
            {"id": "topics-title", "label": "topics 等于 ['Python', 'Testing', 'Debugging']", "type": "variable_equals", "name": "topics", "expected": ["Python", "Testing", "Debugging"]},
        ],
    },
    "comprehensions-01": {
        "id": "comprehensions-01",
        "title": "列表推导式",
        "checks": [
            {"id": "even-squares", "label": "squares 等于 [4, 16, 36]", "type": "variable_equals", "name": "squares", "expected": [4, 16, 36]},
        ],
    },
    "nested-data-01": {
        "id": "nested-data-01",
        "title": "嵌套数据",
        "checks": [
            {"id": "top-student", "label": "summary 记录最高分学生", "type": "variable_equals", "name": "summary", "expected": {"name": "Ada", "score": 9}},
        ],
    },
    "file-lines-01": {
        "id": "file-lines-01",
        "title": "模拟文件行处理",
        "checks": [
            {"id": "errors-list", "label": "errors 只包含 ERROR 行", "type": "variable_equals", "name": "errors", "expected": ["ERROR disk", "ERROR timeout"]},
            {"id": "error-count-lines", "label": "error_count 等于 2", "type": "variable_equals", "name": "error_count", "expected": 2},
        ],
    },
    "challenge-02": {
        "id": "challenge-02",
        "title": "综合挑战：订单汇总",
        "checks": [
            {"id": "order-total", "label": "total 等于 80", "type": "variable_equals", "name": "total", "expected": 80},
            {"id": "order-labels", "label": "labels 描述每个订单数量", "type": "variable_equals", "name": "labels", "expected": ["book x2", "pen x4"]},
        ],
    },
}


def get_level(level_id: str):
    return LEVELS.get(level_id)


def list_level_summaries():
    return [
        {
            "id": level["id"],
            "title": level["title"],
            "checks": [{"id": check["id"], "label": check["label"]} for check in level["checks"]],
        }
        for level in LEVELS.values()
    ]

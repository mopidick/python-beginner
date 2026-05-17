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
    "operators-01": {
        "id": "operators-01",
        "title": "数值运算：折扣价",
        "checks": [
            {"id": "final-price", "label": "final_price 等于 96.0", "type": "variable_equals", "name": "final_price", "expected": 96.0},
        ],
    },
    "rounding-01": {
        "id": "rounding-01",
        "title": "四舍五入：平均分",
        "checks": [
            {"id": "average-rounded", "label": "average 等于 86.3", "type": "variable_equals", "name": "average", "expected": 86.3},
        ],
    },
    "strings-index-01": {
        "id": "strings-index-01",
        "title": "字符串索引：提取代号",
        "checks": [
            {"id": "region-cn", "label": "region 等于 CN", "type": "variable_equals", "name": "region", "expected": "CN"},
        ],
    },
    "strings-cleanup-02": {
        "id": "strings-cleanup-02",
        "title": "字符串清洗：用户名",
        "checks": [
            {"id": "username-clean", "label": "username 等于 ada_lovelace", "type": "variable_equals", "name": "username", "expected": "ada_lovelace"},
        ],
    },
    "conditionals-02": {
        "id": "conditionals-02",
        "title": "条件分支：免运费",
        "checks": [
            {"id": "shipping-12", "label": "shipping 等于 12", "type": "variable_equals", "name": "shipping", "expected": 12},
        ],
    },
    "conditionals-boss-01": {
        "id": "conditionals-boss-01",
        "title": "Boss：成绩评级器",
        "checks": [
            {"id": "grade-c", "label": "grade 等于 C", "type": "variable_equals", "name": "grade", "expected": "C"},
        ],
    },
    "list-append-01": {
        "id": "list-append-01",
        "title": "列表追加：任务清单",
        "checks": [
            {"id": "tasks-appended", "label": "tasks 等于 ['review', 'deploy']", "type": "variable_equals", "name": "tasks", "expected": ["review", "deploy"]},
        ],
    },
    "list-sort-01": {
        "id": "list-sort-01",
        "title": "列表排序：排行榜",
        "checks": [
            {"id": "ranked-desc", "label": "ranked 等于 [95, 88, 72]", "type": "variable_equals", "name": "ranked", "expected": [95, 88, 72]},
        ],
    },
    "loop-sum-01": {
        "id": "loop-sum-01",
        "title": "循环累计：购物车",
        "checks": [
            {"id": "total-55", "label": "total 等于 55", "type": "variable_equals", "name": "total", "expected": 55},
        ],
    },
    "loop-boss-01": {
        "id": "loop-boss-01",
        "title": "Boss：猜数字结果",
        "checks": [
            {"id": "found-at-2", "label": "found_at 等于 2", "type": "variable_equals", "name": "found_at", "expected": 2},
        ],
    },
    "dict-update-01": {
        "id": "dict-update-01",
        "title": "字典更新：库存入库",
        "checks": [
            {"id": "stock-pen-15", "label": "stock.pen 等于 15", "type": "variable_equals", "name": "stock", "expected": {"pen": 15, "book": 4}},
        ],
    },
    "dict-counting-01": {
        "id": "dict-counting-01",
        "title": "字典计数：标签统计",
        "checks": [
            {"id": "tag-counts", "label": "counts 正确统计标签", "type": "variable_equals", "name": "counts", "expected": {"python": 2, "web": 1, "data": 1}},
        ],
    },
    "function-params-01": {
        "id": "function-params-01",
        "title": "函数参数：欢迎语",
        "checks": [
            {"id": "message-welcome", "label": "message 等于 Welcome, Ada!", "type": "variable_equals", "name": "message", "expected": "Welcome, Ada!"},
        ],
    },
    "function-return-02": {
        "id": "function-return-02",
        "title": "函数返回值：订单小计",
        "checks": [
            {"id": "subtotal-result", "label": "result 等于 45", "type": "variable_equals", "name": "result", "expected": 45},
        ],
    },
    "project-calculator-01": {
        "id": "project-calculator-01",
        "title": "项目：命令行计算器核心",
        "checks": [
            {"id": "calculator-result", "label": "result 等于 42", "type": "variable_equals", "name": "result", "expected": 42},
        ],
    },
    "project-word-count-01": {
        "id": "project-word-count-01",
        "title": "项目：单词统计器",
        "checks": [
            {"id": "word-counts", "label": "counts 统计单词频次", "type": "variable_equals", "name": "counts", "expected": {"python": 2, "is": 2, "fun": 1, "and": 1, "useful": 1}},
        ],
    },
    "project-students-01": {
        "id": "project-students-01",
        "title": "项目：学生成绩管理",
        "checks": [
            {"id": "passed-names", "label": "passed_names 等于 ['Ada', 'Max']", "type": "variable_equals", "name": "passed_names", "expected": ["Ada", "Max"]},
            {"id": "average-score", "label": "average_score 等于 75.0", "type": "variable_equals", "name": "average_score", "expected": 75.0},
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

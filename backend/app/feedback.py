def diagnostic_for_error(error: dict | None) -> list[dict]:
    if not error:
        return []

    error_type = error.get("type", "Error")
    line = error.get("line")
    mappings = {
        "SyntaxError": {
            "title": "语法错误",
            "explanation": "Python 没有读懂这一行代码，通常是少了值、括号、冒号或引号。",
            "suggestion": "回到标出的行，检查表达式是否写完整。",
        },
        "IndentationError": {
            "title": "缩进错误",
            "explanation": "Python 用缩进表示代码块，缩进层级不一致会让代码无法运行。",
            "suggestion": "检查 if、for、def、try 后面的代码是否统一缩进。",
        },
        "NameError": {
            "title": "名称未定义",
            "explanation": "代码使用了一个当前命名空间里不存在的名字。",
            "suggestion": "确认变量名拼写一致，并且在使用前已经赋值。",
        },
        "TypeError": {
            "title": "类型不匹配",
            "explanation": "某个操作拿到了不适合的值类型，比如把字符串当数字计算。",
            "suggestion": "查看变量快照或相关代码，确认参与运算的值类型符合预期。",
        },
        "ZeroDivisionError": {
            "title": "除数不能为 0",
            "explanation": "Python 不允许用 0 做除数，这会让结果没有定义。",
            "suggestion": "在除法前判断分母，或者为 0 的情况返回 None。",
        },
        "TimeoutError": {
            "title": "运行超时",
            "explanation": "代码运行时间太长，常见原因是循环条件永远不会结束。",
            "suggestion": "检查 while 或 for 循环，确认循环变量会向结束条件推进。",
        },
        "ImportError": {
            "title": "当前关卡不支持导入模块",
            "explanation": "MVP 执行器只开放少量 Python 内置能力，避免学习代码访问本机环境。",
            "suggestion": "先用关卡提供的数据和内置函数完成目标。",
        },
    }
    fallback = {
        "title": "运行错误",
        "explanation": "代码运行时遇到了异常，程序在完成关卡检查前停止了。",
        "suggestion": "从错误行开始检查变量值、函数调用和表达式。",
    }

    return [
        {
            "severity": "error",
            "line": line,
            **mappings.get(error_type, fallback),
        }
    ]

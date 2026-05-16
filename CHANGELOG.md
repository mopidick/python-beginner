# Changelog

## v0.2.5

新增学习概览：展示已通关、已尝试、已用提示、当前关卡，并支持清空本地进度。

## v0.2.4

课程从 10 关扩展到 15 关，新增字符串方法、列表推导式、嵌套数据、模拟文件行处理和第二个综合挑战。

## v0.2.3

变量快照升级为结构化可视化。列表按索引展示，字典按 key/value 展示，标量值以代码样式展示。

## v0.2.2

新增每关 3 层递进提示，并把提示使用数写入 localStorage，方便后续复盘。

## v0.2.1

后端 `/api/run` 增加 `diagnostics` 字段，把 SyntaxError、NameError、TypeError、ZeroDivisionError、TimeoutError、ImportError 等错误映射为中文解释和修复建议；前端状态面板展示“诊断反馈”。

## v0.2.0

编辑器从 textarea 升级到 CodeMirror 6，支持 Python 语法高亮、行号、括号匹配、自动缩进、基础补全和 Ctrl/Command + Enter 运行。新增补全核心测试和编辑器组件测试。

## v0.1.1

补丁迭代，增强反馈闭环和接口可靠性。

- 后端新增 `/api/health` 和 `/api/levels`。
- `/api/run` 增加 Pydantic 响应模型。
- 检查结果增加 `hint` 字段。
- 状态面板增加运行摘要。
- 关卡列表增加“尝试中”状态。
- 前端 HTTP 错误提示改为稳定中文文案。

## v0.1.0

首个可运行 MVP。

- React + TypeScript + Vite 前端学习界面。
- FastAPI 后端 `/api/run` 执行接口。
- 子进程执行 Python，捕获 stdout、stderr、异常和变量快照。
- 10 个核心语法关卡。
- localStorage 保存通关进度和最近代码。

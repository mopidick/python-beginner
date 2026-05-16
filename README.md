# Python 可视化闯关学习工具

版本：v0.2.5

这是一个面向有技术基础程序员的 Python 核心语法闯关工具。用户在浏览器中编写 Python 代码，由本地 FastAPI 后端执行，前端展示输出、错误诊断、变量结构、检查结果、递进提示和学习进度。

快速部署和新环境启动请看：[DEPLOYMENT.md](DEPLOYMENT.md)

## 功能

- 15 个核心关卡：变量、类型、字符串、列表、字典、条件、循环、函数、异常、列表推导式、嵌套数据、文本行处理和综合挑战。
- CodeMirror Python 编辑器：语法高亮、行号、自动缩进、括号匹配、快捷运行和基础补全。
- 本地执行 API：`POST /api/run` 返回 stdout、stderr、变量快照、检查结果、中文诊断和通关状态。
- 结构化变量可视化：列表按索引展示，字典按 key/value 展示。
- 递进提示：每关 3 层提示，提示使用数保存在本地进度。
- 学习概览：已通关、已尝试、已用提示、当前关卡，以及清空本地进度。
- `GET /api/health` 和 `GET /api/levels` 用于版本检查和关卡一致性校验。

## 快速启动

后端：

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

前端另开一个终端：

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

打开 `http://127.0.0.1:5173`。

macOS / Linux 用户请参考 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 测试

后端：

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pytest -q
```

前端：

```powershell
cd frontend
npm.cmd test
npm.cmd run build
```

## 本地执行说明

v0.2.5 只面向本地可信环境。后端会用子进程执行用户代码并设置超时，也会限制 import、代码长度和超长输出，但这仍然不是生产级安全沙箱；不要运行不可信代码。

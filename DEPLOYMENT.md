# 快速部署与启动指南

本文面向刚拉下仓库的新环境，目标是在本机快速启动 Python 可视化闯关学习工具。

## 1. 环境要求

必需：

- Git
- Python 3.11 或更高版本
- Node.js 20 或更高版本
- npm

推荐端口：

- 后端：`127.0.0.1:8000`
- 前端：`127.0.0.1:5173`

> 注意：当前版本只面向本地可信环境。后端会执行用户输入的 Python 代码，虽然有子进程、超时和 import 限制，但不是公网生产级安全沙箱。

## 2. 拉取仓库

```powershell
git clone <your-repo-url> python-beginner
cd python-beginner
```

如果你已经在项目目录里：

```powershell
git pull
```

## 3. 启动后端

Windows PowerShell：

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

macOS / Linux：

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

验证后端：

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

预期返回类似：

```json
{
  "version": "0.4.1",
  "status": "ok"
}
```

## 4. 启动前端

另开一个终端：

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

macOS / Linux：

```bash
cd frontend
npm install
npm run dev
```

浏览器打开：

```text
http://127.0.0.1:5173
```

## 5. 一次性冒烟检查

后端运行第一关：

```powershell
Invoke-RestMethod `
  http://127.0.0.1:8000/api/run `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"levelId":"variables-01","code":"x = 10\nprint(x)"}'
```

关键字段应包含：

```json
{
  "stdout": "10\n",
  "passed": true
}
```

前端页面：

```powershell
Invoke-WebRequest http://127.0.0.1:5173/ -UseBasicParsing
```

状态码应为 `200`。

## 6. 运行测试

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

macOS / Linux 把 `npm.cmd` 换成 `npm`。

## 7. 生产构建说明

前端构建：

```powershell
cd frontend
npm.cmd run build
```

构建产物在：

```text
frontend/dist
```

当前后端没有内置静态文件托管。若要部署到内网服务器，推荐：

- 前端 `dist` 交给 Nginx、Caddy 或静态托管服务。
- 后端用 `uvicorn app.main:app --host 127.0.0.1 --port 8000` 启动，并由反向代理转发 `/api/*`。
- 不要直接开放给不可信公网用户，除非先补充真正的代码执行沙箱。

## 8. 常见问题

### PowerShell 无法激活虚拟环境

如果出现执行策略错误，可以在当前用户范围允许本地脚本：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

然后重新执行：

```powershell
.\.venv\Scripts\Activate.ps1
```

### 端口被占用

查看占用端口：

```powershell
Get-NetTCPConnection -LocalPort 8000 -State Listen
Get-NetTCPConnection -LocalPort 5173 -State Listen
```

如果你只是本地调试，也可以换端口：

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8010
npm.cmd run dev -- --host 127.0.0.1 --port 5174
```

注意：前端开发代理默认指向 `8000`，如果后端改端口，需要同步调整 `frontend/vite.config.ts`。

### 健康检查版本不是最新

如果 `http://127.0.0.1:8000/api/health` 返回的版本号不是 README 中的当前版本，通常说明旧的 `uvicorn` 进程还在占用端口。先停止旧后端，再重新执行启动命令。

### npm install 很慢

可以配置 npm 镜像或使用公司内部源。仓库提交了 `package-lock.json`，正常情况下建议用：

```powershell
npm.cmd ci
```

它会按锁文件安装，更适合部署环境。

### 前端构建提示 chunk 偏大

当前 CodeMirror 会增加前端包体，Vite 构建可能给出 chunk size warning。这个警告不影响本地启动；后续可通过动态导入编辑器做分包优化。

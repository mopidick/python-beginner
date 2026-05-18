from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.executor import run_python
from app.levels import get_level, list_level_summaries


VERSION = "0.3.5"


class RunRequest(BaseModel):
    levelId: str = Field(min_length=1, max_length=80, pattern=r"^[a-z0-9-]+$")
    code: str = Field(max_length=50000)


class RunError(BaseModel):
    type: str
    message: str
    line: int | None


class SerializedVariable(BaseModel):
    type: str
    value: Any


class CheckResult(BaseModel):
    id: str
    label: str
    passed: bool
    hint: str
    actual: Any | None = None
    expected: Any | None = None
    reason: str | None = None


class Diagnostic(BaseModel):
    severity: str
    line: int | None
    title: str
    explanation: str
    suggestion: str


class RunResponse(BaseModel):
    stdout: str
    stderr: str
    error: RunError | None
    variables: dict[str, SerializedVariable]
    checks: list[CheckResult]
    diagnostics: list[Diagnostic]
    passed: bool


app = FastAPI(title="Python Beginner API", version=VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"version": VERSION, "status": "ok"}


@app.get("/api/levels")
def levels():
    return {"levels": list_level_summaries()}


@app.post("/api/run", response_model=RunResponse)
def run_code(request: RunRequest):
    if get_level(request.levelId) is None:
        raise HTTPException(status_code=404, detail="Level not found")
    return run_python(request.levelId, request.code)

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import App from "./App";

const successResponse = {
  stdout: "10\n",
  stderr: "",
  error: null,
  variables: {
    x: { type: "int", value: 10 },
  },
  checks: [
    {
      id: "x-is-10",
      label: "创建变量 x，并让它等于 10",
      passed: true,
      hint: "检查变量名是否是 x，并确认它的值是整数 10。",
    },
  ],
  diagnostics: [],
  passed: true,
};

describe("Python beginner app", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders the learning workspace and first level", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /Python 可视化闯关/ })).toBeInTheDocument();
  expect(screen.getByText(/v0\.2\.5/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /变量与执行状态/ })).toBeInTheDocument();
    expect((screen.getByLabelText("Python 代码编辑器") as HTMLTextAreaElement).value).toContain("x = 0");
    expect(screen.getByText("创建变量 x，并让它等于 10")).toBeInTheDocument();
  });

  test("runs code and renders summary stdout variables and passed checks", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => successResponse,
    } as Response);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "运行代码" }));

    await waitFor(() => expect(screen.getAllByText("通过").length).toBeGreaterThan(0));
    expect(screen.getByText("x")).toBeInTheDocument();
    expect(screen.getByText("int")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("python-beginner-progress") || "{}").completed).toContain("variables-01");
  });

  test("reset restores starter code", async () => {
    render(<App />);
    const editor = screen.getByLabelText("Python 代码编辑器");

    await userEvent.clear(editor);
    await userEvent.type(editor, "x = 999");
    expect(editor).toHaveValue("x = 999");

    await userEvent.click(screen.getByRole("button", { name: "重置代码" }));
    expect((editor as HTMLTextAreaElement).value).toContain("x = 0");
  });

  test("shows runtime errors without marking level complete", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        stdout: "",
        stderr: "ZeroDivisionError",
        error: { type: "ZeroDivisionError", message: "division by zero", line: 1 },
        variables: {},
        checks: [],
        diagnostics: [
          {
            severity: "error",
            line: 1,
            title: "除数不能为 0",
            explanation: "Python 不允许用 0 做除数，这会让结果没有定义。",
            suggestion: "在除法前判断分母，或者为 0 的情况返回 None。",
          },
        ],
        passed: false,
      }),
    } as Response);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "运行代码" }));

    await waitFor(() => expect(screen.getByText("运行错误")).toBeInTheDocument());
    expect(screen.getByText("ZeroDivisionError")).toBeInTheDocument();
    const progress = JSON.parse(localStorage.getItem("python-beginner-progress") || "{}");
    expect(progress.completed).toEqual([]);
    expect(progress.codeByLevel["variables-01"]).toContain("x = 0");
  });

  test("shows failed check hints and marks level as attempted", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        ...successResponse,
        stdout: "",
        variables: { x: { type: "int", value: 9 } },
        checks: [{ ...successResponse.checks[0], passed: false }],
        passed: false,
      }),
    } as Response);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "运行代码" }));

    await waitFor(() => expect(screen.getByText("还差 1 项")).toBeInTheDocument());
    expect(screen.getByText("检查变量名是否是 x，并确认它的值是整数 10。")).toBeInTheDocument();
    expect(screen.getByText("尝试中")).toBeInTheDocument();
  });

  test("moves to the next level after passing", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => successResponse,
    } as Response);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "运行代码" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "进入下一关" })).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: "进入下一关" }));
    expect(screen.getByRole("heading", { name: "基础类型" })).toBeInTheDocument();
  });

  test("restores current level and draft code from localStorage", () => {
    localStorage.setItem(
      "python-beginner-progress",
      JSON.stringify({
        completed: ["variables-01"],
        currentLevelId: "types-01",
        codeByLevel: { "types-01": "count = 3" },
      }),
    );

    render(<App />);

    expect(screen.getByRole("heading", { name: "基础类型" })).toBeInTheDocument();
    expect(screen.getByLabelText("Python 代码编辑器")).toHaveValue("count = 3");
  });

  test("reveals progressive hints and stores the hint count", async () => {
    render(<App />);

    expect(screen.getByText("提示 0/3")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "显示下一条提示" }));

    expect(screen.getByText("这一关只需要改变量的值。")).toBeInTheDocument();
    const progress = JSON.parse(localStorage.getItem("python-beginner-progress") || "{}");
    expect(progress.hintStepsByLevel["variables-01"]).toBe(1);
  });

  test("shows structured http errors without completing progress", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ detail: "code is too long" }),
    } as Response);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "运行代码" }));

    await waitFor(() => expect(screen.getByText("请求无效：code is too long")).toBeInTheDocument());
    expect(localStorage.getItem("python-beginner-progress")).toBeNull();
  });
});

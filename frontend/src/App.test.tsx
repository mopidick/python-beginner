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
  expect(screen.getByText(/v0\.5\.1/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^01变量与执行状态/ })).toBeInTheDocument();
    expect((screen.getByLabelText("Python 代码编辑器") as HTMLTextAreaElement).value).toContain("x = 0");
    expect(screen.getByText("创建变量 x，并让它等于 10")).toBeInTheDocument();
    expect(screen.getByText("学习目标")).toBeInTheDocument();
    expect(screen.getByText("解题套路")).toBeInTheDocument();
    expect(screen.getByText("继续学习")).toBeInTheDocument();
    expect(screen.getByText("薄弱知识点")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "继续基础类型" })).toBeInTheDocument();
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

  test("awards three stars when a level passes without hints", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => successResponse,
    } as Response);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "运行代码" }));

    await waitFor(() => expect(screen.getByText(/获得 3 星/)).toBeInTheDocument());
    const progress = JSON.parse(localStorage.getItem("python-beginner-progress") || "{}");
    expect(progress.starsByLevel["variables-01"]).toBe(3);
    expect(progress.practiceDates.length).toBe(1);
  });

  test("shows star upgrade feedback when reviewing a low-star level", async () => {
    localStorage.setItem(
      "python-beginner-progress",
      JSON.stringify({
        completed: ["variables-01"],
        attempted: ["variables-01"],
        currentLevelId: "variables-01",
        starsByLevel: { "variables-01": 1 },
        hintStepsByLevel: { "variables-01": 0 },
      }),
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => successResponse,
    } as Response);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "运行代码" }));

    await waitFor(() => expect(screen.getByText(/星级从 1 提升到 3/)).toBeInTheDocument());
    const progress = JSON.parse(localStorage.getItem("python-beginner-progress") || "{}");
    expect(progress.starsByLevel["variables-01"]).toBe(3);
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
        checks: [
          {
            ...successResponse.checks[0],
            passed: false,
            actual: 9,
            expected: 10,
            reason: "x 当前是 9，目标是 10。",
          },
        ],
        passed: false,
      }),
    } as Response);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "运行代码" }));

    await waitFor(() => expect(screen.getByText("已完成 0/1 项")).toBeInTheDocument());
    expect(screen.getByText("下一步：创建变量 x，并让它等于 10")).toBeInTheDocument();
    expect(screen.getByText("本次要修正")).toBeInTheDocument();
    expect(screen.getByText("x 当前是 9，目标是 10。")).toBeInTheDocument();
    expect(screen.getAllByText("检查变量名是否是 x，并确认它的值是整数 10。").length).toBeGreaterThan(0);
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

  test("asks for confirmation before clearing local progress", async () => {
    localStorage.setItem(
      "python-beginner-progress",
      JSON.stringify({
        completed: ["variables-01"],
        currentLevelId: "types-01",
        codeByLevel: { "types-01": "count = 3" },
      }),
    );
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "清空进度" }));

    expect(window.confirm).toHaveBeenCalledWith("确定要清空所有通关记录、草稿和星级吗？这个操作不能撤销。");
    expect(JSON.parse(localStorage.getItem("python-beginner-progress") || "{}").completed).toEqual(["variables-01"]);
    expect(screen.getByRole("heading", { name: "基础类型" })).toBeInTheDocument();
  });

  test("keeps unsent draft code when switching levels", async () => {
    render(<App />);
    const editor = screen.getByLabelText("Python 代码编辑器");

    await userEvent.clear(editor);
    await userEvent.type(editor, "x = 42");
    await userEvent.click(screen.getByRole("button", { name: /^02基础类型/ }));
    await userEvent.click(screen.getByRole("button", { name: /^01变量与执行状态/ }));

    expect(screen.getByLabelText("Python 代码编辑器")).toHaveValue("x = 42");
    expect(JSON.parse(localStorage.getItem("python-beginner-progress") || "{}").codeByLevel["variables-01"]).toBe(
      "x = 42",
    );
  });

  test("jumps to the recommended review level", async () => {
    localStorage.setItem(
      "python-beginner-progress",
      JSON.stringify({
        completed: ["variables-01"],
        attempted: ["variables-01", "types-01"],
        currentLevelId: "variables-01",
        starsByLevel: { "variables-01": 3 },
      }),
    );

    render(<App />);
    await userEvent.click(screen.getAllByRole("button", { name: "收口基础类型" })[0]);

    expect(screen.getByRole("heading", { name: "基础类型" })).toBeInTheDocument();
  });

  test("jumps from a weak tag to its highest-risk level", async () => {
    localStorage.setItem(
      "python-beginner-progress",
      JSON.stringify({
        completed: ["types-01"],
        attempted: ["types-01"],
        currentLevelId: "variables-01",
        starsByLevel: { "types-01": 1 },
        hintStepsByLevel: { "types-01": 2 },
      }),
    );

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /^类型基础类型$/ }));

    expect(screen.getByRole("heading", { name: "基础类型" })).toBeInTheDocument();
  });

  test("shows a chapter milestone with a low-star review action", () => {
    localStorage.setItem(
      "python-beginner-progress",
      JSON.stringify({
        completed: ["variables-01", "types-01", "operators-01", "rounding-01"],
        attempted: ["variables-01", "types-01", "operators-01", "rounding-01"],
        currentLevelId: "rounding-01",
        starsByLevel: { "variables-01": 3, "types-01": 2, "operators-01": 3, "rounding-01": 3 },
      }),
    );

    render(<App />);

    expect(screen.getByText("章节里程碑")).toBeInTheDocument();
    expect(screen.getByText("第 1 章：运行状态 已完成")).toBeInTheDocument();
    expect(screen.getByText(/平均 2\.8 星/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "回刷 基础类型" })).toBeInTheDocument();
  });
});

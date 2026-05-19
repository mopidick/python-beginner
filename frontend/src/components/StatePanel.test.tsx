import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import type { RunResponse } from "../api/types";
import { StatePanel } from "./StatePanel";

describe("StatePanel", () => {
  test("shows diagnostics with explanation and next action", () => {
    const result: RunResponse = {
      stdout: "",
      stderr: "",
      error: { type: "NameError", message: "name 'total' is not defined", line: 2 },
      variables: {},
      checks: [],
      diagnostics: [
        {
          severity: "error",
          line: 2,
          title: "名称未定义",
          explanation: "代码使用了一个当前命名空间里不存在的名字。",
          suggestion: "确认变量名拼写一致，并且在使用前已经赋值。",
        },
      ],
      passed: false,
    };

    render(<StatePanel result={result} />);

    expect(screen.getByText("诊断反馈")).toBeInTheDocument();
    expect(screen.getAllByText("第 2 行").length).toBeGreaterThan(0);
    expect(screen.getByText("名称未定义")).toBeInTheDocument();
    expect(screen.getByText("代码使用了一个当前命名空间里不存在的名字。")).toBeInTheDocument();
    expect(screen.getByText("确认变量名拼写一致，并且在使用前已经赋值。")).toBeInTheDocument();
  });

  test("shows failed check correction details with actual and expected values", () => {
    const result: RunResponse = {
      stdout: "",
      stderr: "",
      error: null,
      variables: {
        x: { type: "int", value: 9 },
      },
      checks: [
        {
          id: "x-is-10",
          label: "创建变量 x，并让它等于 10",
          passed: false,
          hint: "检查变量名是否是 x，并确认它的值是整数 10。",
          actual: 9,
          expected: 10,
          reason: "x 当前是 9，目标是 10。",
          failureType: "value_mismatch",
          nextStep: "保留变量 x，把它的值调整到目标值。",
        },
      ],
      diagnostics: [],
      passed: false,
    };

    render(<StatePanel result={result} />);

    expect(screen.getByText("本次要修正")).toBeInTheDocument();
    expect(screen.getByText("x 当前是 9，目标是 10。")).toBeInTheDocument();
    expect(screen.getByText("值不对")).toBeInTheDocument();
    expect(screen.getByText("保留变量 x，把它的值调整到目标值。")).toBeInTheDocument();
    expect(screen.getByText("当前值")).toBeInTheDocument();
    expect(screen.getByText("目标值")).toBeInTheDocument();
    expect(screen.getAllByText("9").length).toBeGreaterThan(0);
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
  });

  test("summarizes partial progress and keeps passed checks visible", () => {
    const result: RunResponse = {
      stdout: "",
      stderr: "",
      error: null,
      variables: {
        username: { type: "str", value: "Ada" },
        score: { type: "int", value: 80 },
      },
      checks: [
        {
          id: "username",
          label: "创建用户名 username",
          passed: true,
          hint: "username 应该保存字符串。",
        },
        {
          id: "score",
          label: "创建分数 score",
          passed: true,
          hint: "score 应该保存整数。",
        },
        {
          id: "passed",
          label: "创建 passed 并让它为 True",
          passed: false,
          hint: "passed 应该是布尔值 True。",
          actual: undefined,
          expected: true,
          reason: "没有找到变量 passed。",
          failureType: "missing",
          nextStep: "先创建变量 passed，再把它赋值为目标值。",
        },
      ],
      diagnostics: [],
      passed: false,
    };

    render(<StatePanel result={result} />);

    expect(screen.getByText("已完成 2/3 项")).toBeInTheDocument();
    expect(screen.getByText("下一步：创建 passed 并让它为 True")).toBeInTheDocument();
    expect(screen.getByText("已通过的检查")).toBeInTheDocument();
    expect(screen.getByText("创建用户名 username")).toBeInTheDocument();
    expect(screen.getByText("创建分数 score")).toBeInTheDocument();
  });
});

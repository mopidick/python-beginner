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
        },
      ],
      diagnostics: [],
      passed: false,
    };

    render(<StatePanel result={result} />);

    expect(screen.getByText("本次要修正")).toBeInTheDocument();
    expect(screen.getByText("x 当前是 9，目标是 10。")).toBeInTheDocument();
    expect(screen.getByText("当前值")).toBeInTheDocument();
    expect(screen.getByText("目标值")).toBeInTheDocument();
    expect(screen.getAllByText("9").length).toBeGreaterThan(0);
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
  });
});

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
});

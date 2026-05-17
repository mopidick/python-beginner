import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import App from "./App";

describe("readable Chinese interface text", () => {
  test("renders the core workspace labels without mojibake", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Python 可视化闯关" })).toBeInTheDocument();
    expect(screen.getByText("学习概览")).toBeInTheDocument();
    expect(screen.getByText("关卡")).toBeInTheDocument();
    expect(screen.getByText("递进提示")).toBeInTheDocument();
    expect(screen.getByText("Python 智能编辑器")).toBeInTheDocument();
    expect(screen.getByText("执行状态")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "运行代码" })).toBeInTheDocument();
  });
});

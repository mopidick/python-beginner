import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { EditorPanel } from "./EditorPanel";

describe("EditorPanel", () => {
  test("describes the smart Python editor capabilities", () => {
    render(<EditorPanel code="pri" running={false} onChange={vi.fn()} onRun={vi.fn()} onReset={vi.fn()} />);

    expect(screen.getByText("Python 智能编辑器")).toBeInTheDocument();
    expect(screen.getByText("语法高亮")).toBeInTheDocument();
    expect(screen.getByText("代码提示")).toBeInTheDocument();
    expect(screen.getByText("自动缩进")).toBeInTheDocument();
  });

  test("keeps editing, reset and run controls available", async () => {
    const onChange = vi.fn();
    const onRun = vi.fn();
    const onReset = vi.fn();

    render(<EditorPanel code="pri" running={false} onChange={onChange} onRun={onRun} onReset={onReset} />);

    await userEvent.type(screen.getByLabelText("Python 代码编辑器"), "nt");
    expect(onChange).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "运行代码" }));
    expect(onRun).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "重置代码" }));
    expect(onReset).toHaveBeenCalled();
  });
});

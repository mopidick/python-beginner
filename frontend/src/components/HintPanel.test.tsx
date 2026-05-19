import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { HintPanel } from "./HintPanel";

describe("HintPanel", () => {
  test("reveals hints one step at a time", async () => {
    const onReveal = vi.fn();

    render(
      <HintPanel
        hints={["先确认变量名。", "再确认值。", "最后运行检查。"]}
        revealedCount={0}
        solution="x = 10"
        onReveal={onReveal}
      />,
    );

    expect(screen.getByText("提示 0/3")).toBeInTheDocument();
    expect(screen.queryByText("先确认变量名。")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "显示下一条提示" }));

    expect(onReveal).toHaveBeenCalledWith(1);
  });

  test("shows revealed hints and disables the button after all hints are visible", () => {
    render(<HintPanel hints={["先确认变量名。"]} revealedCount={1} solution="x = 10" onReveal={vi.fn()} />);

    expect(screen.getByText("提示 1/1")).toBeInTheDocument();
    expect(screen.getByText("先确认变量名。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "提示已全部显示" })).toBeDisabled();
  });

  test("unlocks reference solution only after all hints are visible", async () => {
    const onUseSolution = vi.fn();
    render(
      <HintPanel
        hints={["先确认变量名。", "再确认值。"]}
        revealedCount={1}
        solution={"x = 10\nprint(x)"}
        onReveal={vi.fn()}
        onUseSolution={onUseSolution}
      />,
    );

    expect(screen.queryByText("参考答案")).not.toBeInTheDocument();

    render(
      <HintPanel
        hints={["先确认变量名。", "再确认值。"]}
        revealedCount={2}
        solution={"x = 10\nprint(x)"}
        onReveal={vi.fn()}
        onUseSolution={onUseSolution}
      />,
    );

    expect(screen.getByText("参考答案")).toBeInTheDocument();
    expect(screen.queryByText("x = 10\nprint(x)")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "查看参考答案" }));

    expect(screen.getByText((_, element) => element?.tagName.toLowerCase() === "pre" && element.textContent?.includes("print(x)") === true)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "使用参考答案" }));

    expect(onUseSolution).toHaveBeenCalledWith("x = 10\nprint(x)");
  });
});

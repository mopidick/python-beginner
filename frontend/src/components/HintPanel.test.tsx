import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { HintPanel } from "./HintPanel";

describe("HintPanel", () => {
  test("reveals hints one step at a time", async () => {
    const onReveal = vi.fn();

    render(<HintPanel hints={["先确认变量名。", "再确认值。", "最后运行检查。"]} revealedCount={0} onReveal={onReveal} />);

    expect(screen.getByText("提示 0/3")).toBeInTheDocument();
    expect(screen.queryByText("先确认变量名。")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "显示下一条提示" }));

    expect(onReveal).toHaveBeenCalledWith(1);
  });

  test("shows revealed hints and disables the button after all hints are visible", () => {
    render(<HintPanel hints={["先确认变量名。"]} revealedCount={1} onReveal={vi.fn()} />);

    expect(screen.getByText("提示 1/1")).toBeInTheDocument();
    expect(screen.getByText("先确认变量名。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "提示已全部显示" })).toBeDisabled();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ProgressSummary } from "./ProgressSummary";

describe("ProgressSummary", () => {
  test("shows learning progress totals", () => {
    render(
      <ProgressSummary
        completedCount={3}
        attemptedCount={5}
        hintCount={2}
        totalCount={30}
        chapterCount={6}
        totalMinutes={210}
        currentLevelTitle="变量与执行状态"
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByText("学习概览")).toBeInTheDocument();
    expect(screen.getByText("3/30")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("210 分钟")).toBeInTheDocument();
    expect(screen.getByText(/变量与执行状态/)).toBeInTheDocument();
  });

  test("can reset local progress", async () => {
    const onReset = vi.fn();

    render(
      <ProgressSummary
        completedCount={0}
        attemptedCount={0}
        hintCount={0}
        totalCount={30}
        chapterCount={6}
        totalMinutes={210}
        currentLevelTitle="变量与执行状态"
        onReset={onReset}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "清空进度" }));

    expect(onReset).toHaveBeenCalled();
  });
});

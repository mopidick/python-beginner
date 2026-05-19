import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ProgressSummary } from "./ProgressSummary";

const recommendation = {
  kind: "continue" as const,
  levelId: "types-01",
  title: "继续基础类型",
  reason: "下一关会把刚学过的变量继续用起来。",
};

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
        recommendation={recommendation}
        reviewCount={1}
        reviewCandidates={[recommendation]}
        assistedReviewLevels={[{ levelId: "variables-01", title: "???????" }]}
        weakTags={[{ tag: "列表", score: 4, reason: "有未通关尝试", levelId: "lists-01", levelTitle: "列表练习" }]}
        practiceCount={7}
        studyGoal="完成 1 个新关卡，并尽量少用提示拿高星。"
        streakDays={3}
        onGoToRecommendation={vi.fn()}
        onGoToLevel={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByText("学习概览")).toBeInTheDocument();
    expect(screen.getByText("3/30")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("210 分钟")).toBeInTheDocument();
    expect(screen.getByText(/变量与执行状态/)).toBeInTheDocument();
    expect(screen.getByText("继续学习")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "继续基础类型" })).toHaveLength(2);
    expect(screen.getByText("复习队列")).toBeInTheDocument();
    expect(screen.getByText("今日目标")).toBeInTheDocument();
    expect(screen.getByText("连续学习 3 天")).toBeInTheDocument();
    expect(screen.getByText("薄弱知识点")).toBeInTheDocument();
    expect(screen.getByText("列表")).toBeInTheDocument();
    expect(screen.getByText("列表练习")).toBeInTheDocument();
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
        recommendation={recommendation}
        reviewCount={0}
        reviewCandidates={[]}
        assistedReviewLevels={[]}
        weakTags={[]}
        practiceCount={0}
        studyGoal="完成 1 个新关卡，并尽量少用提示拿高星。"
        streakDays={0}
        onGoToRecommendation={vi.fn()}
        onGoToLevel={vi.fn()}
        onReset={onReset}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "清空进度" }));

    expect(onReset).toHaveBeenCalled();
  });

  test("shows a completed review queue state", () => {
    render(
      <ProgressSummary
        completedCount={30}
        attemptedCount={30}
        hintCount={0}
        totalCount={30}
        chapterCount={6}
        totalMinutes={210}
        currentLevelTitle="项目回顾"
        recommendation={{ kind: "complete", levelId: "done", title: "课程已完成", reason: "全部完成。" }}
        reviewCount={0}
        reviewCandidates={[]}
        assistedReviewLevels={[]}
        weakTags={[]}
        practiceCount={40}
        studyGoal="今天做 1 个项目关回顾，保持手感。"
        streakDays={5}
        onGoToRecommendation={vi.fn()}
        onGoToLevel={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByText("复习队列已清空")).toBeInTheDocument();
    expect(screen.getByText("全部关卡已满星，可以回顾项目关保持手感。")).toBeInTheDocument();
  });
});

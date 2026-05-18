import { describe, expect, test } from "vitest";

import { addPracticeDate, calculateStudyStreak, getLocalDateKey, getStudyGoal } from "./session";

describe("study session helpers", () => {
  test("formats local date keys", () => {
    expect(getLocalDateKey(new Date("2026-05-08T12:30:00"))).toBe("2026-05-08");
  });

  test("adds practice dates once and keeps them sorted", () => {
    expect(addPracticeDate(["2026-05-17"], "2026-05-17")).toEqual(["2026-05-17"]);
    expect(addPracticeDate(["2026-05-17"], "2026-05-18")).toEqual(["2026-05-17", "2026-05-18"]);
  });

  test("calculates a streak ending today", () => {
    expect(calculateStudyStreak(["2026-05-16", "2026-05-17", "2026-05-18"], "2026-05-18")).toBe(3);
    expect(calculateStudyStreak(["2026-05-16"], "2026-05-18")).toBe(0);
  });

  test("chooses a focused study goal", () => {
    expect(getStudyGoal({ kind: "stuck", levelId: "x", title: "收口", reason: "" }, 3)).toContain("收口");
    expect(getStudyGoal({ kind: "continue", levelId: "x", title: "继续", reason: "" }, 2)).toContain("回刷 2 个");
    expect(getStudyGoal({ kind: "continue", levelId: "x", title: "继续", reason: "" }, 0)).toContain("新关卡");
  });
});

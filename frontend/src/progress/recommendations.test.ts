import { describe, expect, test } from "vitest";

import type { Level } from "../levels/levels";
import { getLearningRecommendation, getReviewCandidates } from "./recommendations";

const sampleLevels = [
  { id: "one", title: "第一关", estimatedMinutes: 5 },
  { id: "two", title: "第二关", estimatedMinutes: 6 },
  { id: "three", title: "第三关", estimatedMinutes: 7 },
] as Level[];

describe("learning recommendations", () => {
  test("recommends the first unfinished level by default", () => {
    const recommendation = getLearningRecommendation(sampleLevels, {
      completed: ["one"],
      attempted: ["one"],
      currentLevelId: "one",
      hintStepsByLevel: {},
      starsByLevel: {},
    });

    expect(recommendation).toEqual({
      kind: "continue",
      levelId: "two",
      title: "继续第二关",
      reason: "下一关预计 6 分钟，适合保持学习节奏。",
    });
  });

  test("prioritizes attempted but unfinished levels before new content", () => {
    const recommendation = getLearningRecommendation(sampleLevels, {
      completed: ["one"],
      attempted: ["one", "three"],
      currentLevelId: "one",
      hintStepsByLevel: {},
      starsByLevel: {},
    });

    expect(recommendation.kind).toBe("stuck");
    expect(recommendation.levelId).toBe("three");
  });

  test("returns review candidates sorted by unfinished attempts then low stars", () => {
    const candidates = getReviewCandidates(sampleLevels, {
      completed: ["one", "two"],
      attempted: ["one", "two", "three"],
      currentLevelId: "one",
      hintStepsByLevel: { one: 2 },
      starsByLevel: { one: 1, two: 3 },
    });

    expect(candidates.map((candidate) => candidate.levelId)).toEqual(["three", "one"]);
    expect(candidates[0].reason).toBe("已经尝试过但还没有通关，适合优先回到这里收口。");
  });

  test("reports completion when everything is finished with three stars", () => {
    const recommendation = getLearningRecommendation(sampleLevels, {
      completed: ["one", "two", "three"],
      attempted: ["one", "two", "three"],
      currentLevelId: "three",
      hintStepsByLevel: {},
      starsByLevel: { one: 3, two: 3, three: 3 },
    });

    expect(recommendation).toEqual({
      kind: "complete",
      levelId: "three",
      title: "课程已完成",
      reason: "所有关卡都已通关，接下来可以从项目关开始回刷巩固。",
    });
  });
});

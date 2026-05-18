import { describe, expect, test } from "vitest";

import type { Level } from "../levels/levels";
import { getChapterMilestone, getChapterStatus } from "./chapters";

const sampleLevels = [
  { id: "one", title: "第一关", chapter: "第 1 章" },
  { id: "two", title: "第二关", chapter: "第 1 章" },
  { id: "three", title: "第三关", chapter: "第 2 章" },
] as Level[];

describe("chapter milestones", () => {
  test("summarizes completed chapters and low-star review targets", () => {
    const milestone = getChapterMilestone(sampleLevels, "第 1 章", {
      completed: ["one", "two"],
      starsByLevel: { one: 3, two: 2 },
    });

    expect(milestone).toMatchObject({
      completed: true,
      completedCount: 2,
      totalCount: 2,
      averageStars: 2.5,
      lowStarLevelId: "two",
      lowStarLevelTitle: "第二关",
      nextLevelId: "three",
    });
  });

  test("returns human-readable chapter status", () => {
    expect(getChapterStatus({ completedCount: 0, totalCount: 2 })).toBe("未开始");
    expect(getChapterStatus({ completedCount: 1, totalCount: 2 })).toBe("进行中");
    expect(getChapterStatus({ completedCount: 2, totalCount: 2 })).toBe("已完成");
  });

  test("chooses the next unfinished level after the completed chapter", () => {
    const milestone = getChapterMilestone(sampleLevels, "第 1 章", {
      completed: ["two"],
      starsByLevel: { one: 0, two: 3 },
    });

    expect(milestone.nextLevelId).toBe("three");
  });
});

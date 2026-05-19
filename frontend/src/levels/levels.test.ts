import { describe, expect, test } from "vitest";

import { levels } from "./levels";

describe("course content", () => {
  test("contains a substantial learning path", () => {
    expect(levels.length).toBeGreaterThanOrEqual(52);
    expect(new Set(levels.map((level) => level.chapter)).size).toBeGreaterThanOrEqual(10);
  });

  test("each level has visible learning metadata and progressive hints", () => {
    for (const level of levels) {
      expect(level.chapter.length).toBeGreaterThan(0);
      expect(["基础", "进阶", "挑战"]).toContain(level.difficulty);
      expect(level.estimatedMinutes).toBeGreaterThanOrEqual(3);
      expect(level.hints).toHaveLength(3);
      expect(level.story.length).toBeGreaterThan(0);
      expect(level.goal.length).toBeGreaterThan(0);
      expect(level.pattern.length).toBeGreaterThan(0);
      expect(level.recap.length).toBeGreaterThan(0);
      expect(["lesson", "review", "project"]).toContain(level.mode);
      expect(level.tags.length).toBeGreaterThan(0);
    }
  });
});

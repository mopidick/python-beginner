import { describe, expect, test } from "vitest";

import type { Level } from "../levels/levels";
import { getWeakTags } from "./mastery";

const sampleLevels = [
  { id: "lists-01", title: "列表练习", tags: ["列表", "循环"] },
  { id: "dicts-01", title: "字典练习", tags: ["字典", "循环"] },
] as Level[];

describe("getWeakTags", () => {
  test("prioritizes unfinished attempts and low-star completed levels", () => {
    const weakTags = getWeakTags(sampleLevels, {
      completed: ["lists-01"],
      attempted: ["lists-01", "dicts-01"],
      hintStepsByLevel: { "lists-01": 1 },
      starsByLevel: { "lists-01": 2 },
    });

    expect(weakTags[0]).toMatchObject({ tag: "循环", levelId: "dicts-01", levelTitle: "字典练习" });
    expect(weakTags.map((item) => item.tag)).toContain("字典");
    expect(weakTags.find((item) => item.tag === "列表")?.reason).toContain("2 星通关");
  });

  test("returns an empty list when there is no weak signal", () => {
    expect(
      getWeakTags(sampleLevels, {
        completed: ["lists-01"],
        attempted: ["lists-01"],
        hintStepsByLevel: {},
        starsByLevel: { "lists-01": 3 },
      }),
    ).toEqual([]);
  });
});

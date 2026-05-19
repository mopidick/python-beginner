import { afterEach, describe, expect, test } from "vitest";

import { CURRENT_PROGRESS_SCHEMA_VERSION, loadProgress, saveProgress, STORAGE_KEY } from "./storage";

afterEach(() => {
  localStorage.clear();
});

describe("progress storage", () => {
  test("migrates old progress without schema fields", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completed: ["variables-01"],
        attempted: ["variables-01", "types-01"],
        currentLevelId: "types-01",
        codeByLevel: { "types-01": "count = 3" },
      }),
    );

    const progress = loadProgress();

    expect(progress.schemaVersion).toBe(CURRENT_PROGRESS_SCHEMA_VERSION);
    expect(progress.completed).toEqual(["variables-01"]);
    expect(progress.attempted).toEqual(["variables-01", "types-01"]);
    expect(progress.attemptCountByLevel).toEqual({});
    expect(progress.lastPracticedAtByLevel).toEqual({});
    expect(progress.passedAtByLevel).toEqual({});
    expect(progress.practiceDates).toEqual([]);
    expect(progress.solutionUsedByLevel).toEqual({});
  });

  test("falls back to empty progress for broken JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{broken");

    const progress = loadProgress();

    expect(progress.currentLevelId).toBe("variables-01");
    expect(progress.completed).toEqual([]);
  });

  test("saves schema v4 fields", () => {
    const progress = loadProgress();
    saveProgress({
      ...progress,
      attemptCountByLevel: { "variables-01": 2 },
      lastPracticedAtByLevel: { "variables-01": "2026-05-17T00:00:00.000Z" },
      solutionUsedByLevel: { "variables-01": true },
    });

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")).toMatchObject({
      schemaVersion: 4,
      attemptCountByLevel: { "variables-01": 2 },
      solutionUsedByLevel: { "variables-01": true },
    });
  });
});

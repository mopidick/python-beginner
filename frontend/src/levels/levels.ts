import sharedLevels from "../../../shared/levels.json";

export type LevelDifficulty = "基础" | "进阶" | "挑战";

export type LevelCheck = {
  id: string;
  label: string;
  type: "variable_equals";
  name: string;
  expected: unknown;
  hint?: string;
};

export type Level = {
  id: string;
  title: string;
  chapter: string;
  difficulty: LevelDifficulty;
  estimatedMinutes: number;
  story: string;
  concept: string;
  instructions: string;
  starterCode: string;
  checks: LevelCheck[];
  hints: string[];
  visualizer: "variables" | "sequence" | "mapping" | "output";
  successMessage: string;
};

export const levels = sharedLevels as Level[];

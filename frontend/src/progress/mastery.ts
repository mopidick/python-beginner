import type { Level } from "../levels/levels";

export type WeakTag = {
  tag: string;
  score: number;
  reason: string;
};

export type MasteryProgress = {
  completed: string[];
  attempted: string[];
  hintStepsByLevel: Record<string, number>;
  starsByLevel: Record<string, number>;
};

export function getWeakTags(levels: Level[], progress: MasteryProgress): WeakTag[] {
  const completed = new Set(progress.completed);
  const attempted = new Set(progress.attempted);
  const tagScores = new Map<string, { score: number; reasons: Set<string> }>();

  function add(tag: string, score: number, reason: string) {
    const current = tagScores.get(tag) || { score: 0, reasons: new Set<string>() };
    current.score += score;
    current.reasons.add(reason);
    tagScores.set(tag, current);
  }

  for (const level of levels) {
    const stars = progress.starsByLevel[level.id] || 0;
    const hints = progress.hintStepsByLevel[level.id] || 0;
    const isCompleted = completed.has(level.id);
    const isAttempted = attempted.has(level.id);

    for (const tag of level.tags) {
      if (isAttempted && !isCompleted) {
        add(tag, 4, "有未通关尝试");
      }
      if (isCompleted && stars > 0 && stars < 3) {
        add(tag, 3, `${stars} 星通关`);
      }
      if (hints > 0) {
        add(tag, hints, "使用过提示");
      }
    }
  }

  return Array.from(tagScores.entries())
    .map(([tag, value]) => ({
      tag,
      score: value.score,
      reason: Array.from(value.reasons).join("、"),
    }))
    .sort((a, b) => b.score - a.score || a.tag.localeCompare(b.tag))
    .slice(0, 3);
}

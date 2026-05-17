import type { Level } from "../levels/levels";

export type RecommendationProgress = {
  completed: string[];
  attempted: string[];
  currentLevelId: string;
  hintStepsByLevel: Record<string, number>;
  starsByLevel: Record<string, number>;
  attemptCountByLevel?: Record<string, number>;
};

export type LearningRecommendation = {
  kind: "continue" | "stuck" | "review" | "complete";
  levelId: string;
  title: string;
  reason: string;
};

export function getReviewCandidates(levels: Level[], progress: RecommendationProgress): LearningRecommendation[] {
  const completed = new Set(progress.completed);
  const attempted = new Set(progress.attempted);
  const unfinishedAttempts = levels
    .filter((level) => attempted.has(level.id) && !completed.has(level.id))
    .sort((a, b) => (progress.attemptCountByLevel?.[b.id] || 0) - (progress.attemptCountByLevel?.[a.id] || 0))
    .map((level) => ({
      kind: "stuck" as const,
      levelId: level.id,
      title: `收口${level.title}`,
      reason: "已经尝试过但还没有通关，适合优先回到这里收口。",
    }));

  const lowStarReviews = levels
    .filter((level) => completed.has(level.id) && (progress.starsByLevel[level.id] || 0) < 3)
    .sort((a, b) => (progress.starsByLevel[a.id] || 0) - (progress.starsByLevel[b.id] || 0))
    .map((level) => ({
      kind: "review" as const,
      levelId: level.id,
      title: `复习${level.title}`,
      reason:
        (progress.hintStepsByLevel[level.id] || 0) > 0
          ? "这关通关时使用过提示，回刷一次更容易变成长期记忆。"
          : "这关还没有拿到 3 星，适合回刷提升熟练度。",
    }));

  return [...unfinishedAttempts, ...lowStarReviews];
}

export function getLearningRecommendation(
  levels: Level[],
  progress: RecommendationProgress,
): LearningRecommendation {
  const reviewCandidates = getReviewCandidates(levels, progress);
  const stuck = reviewCandidates.find((candidate) => candidate.kind === "stuck");
  if (stuck) {
    return stuck;
  }

  const completed = new Set(progress.completed);
  const currentIndex = levels.findIndex((level) => level.id === progress.currentLevelId);
  const orderedLevels =
    currentIndex >= 0 ? [...levels.slice(currentIndex + 1), ...levels.slice(0, currentIndex + 1)] : levels;
  const nextLevel = orderedLevels.find((level) => !completed.has(level.id));
  if (nextLevel) {
    return {
      kind: "continue",
      levelId: nextLevel.id,
      title: `继续${nextLevel.title}`,
      reason: `下一关预计 ${nextLevel.estimatedMinutes} 分钟，适合保持学习节奏。`,
    };
  }

  const review = reviewCandidates[0];
  if (review) {
    return review;
  }

  return {
    kind: "complete",
    levelId: progress.currentLevelId,
    title: "课程已完成",
    reason: "所有关卡都已通关，接下来可以从项目关开始回刷巩固。",
  };
}

import type { Level } from "../levels/levels";

export type ChapterMilestone = {
  chapter: string;
  completedCount: number;
  totalCount: number;
  averageStars: number;
  lowStarLevelId?: string;
  lowStarLevelTitle?: string;
  nextLevelId?: string;
  nextLevelTitle?: string;
  completed: boolean;
};

export type ChapterProgressInput = {
  completed: string[];
  starsByLevel: Record<string, number>;
};

export function getChapterMilestone(
  levels: Level[],
  chapter: string,
  progress: ChapterProgressInput,
): ChapterMilestone {
  const chapterLevels = levels.filter((level) => level.chapter === chapter);
  const completed = new Set(progress.completed);
  const completedLevels = chapterLevels.filter((level) => completed.has(level.id));
  const lowStarLevel = completedLevels.find((level) => (progress.starsByLevel[level.id] || 0) < 3);
  const lastChapterIndex = Math.max(...chapterLevels.map((level) => levels.findIndex((item) => item.id === level.id)));
  const nextLevel = levels.slice(lastChapterIndex + 1).find((level) => !completed.has(level.id));
  const totalStars = completedLevels.reduce((total, level) => total + (progress.starsByLevel[level.id] || 0), 0);

  return {
    chapter,
    completedCount: completedLevels.length,
    totalCount: chapterLevels.length,
    averageStars: completedLevels.length > 0 ? Number((totalStars / completedLevels.length).toFixed(1)) : 0,
    lowStarLevelId: lowStarLevel?.id,
    lowStarLevelTitle: lowStarLevel?.title,
    nextLevelId: nextLevel?.id,
    nextLevelTitle: nextLevel?.title,
    completed: chapterLevels.length > 0 && completedLevels.length === chapterLevels.length,
  };
}

export function getChapterStatus(milestone: Pick<ChapterMilestone, "completedCount" | "totalCount">) {
  if (milestone.completedCount === 0) {
    return "未开始";
  }
  if (milestone.completedCount === milestone.totalCount) {
    return "已完成";
  }
  return "进行中";
}

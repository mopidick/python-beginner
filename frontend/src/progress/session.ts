import type { LearningRecommendation } from "./recommendations";

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addPracticeDate(dates: string[], dateKey: string): string[] {
  return Array.from(new Set([...dates, dateKey])).sort();
}

export function calculateStudyStreak(dates: string[], todayKey = getLocalDateKey()): number {
  const practiced = new Set(dates);
  let streak = 0;
  const cursor = new Date(`${todayKey}T00:00:00`);

  while (practiced.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getStudyGoal(recommendation: LearningRecommendation, reviewCount: number): string {
  if (recommendation.kind === "stuck") {
    return "先收口 1 个卡住关，再继续新内容。";
  }
  if (reviewCount > 0) {
    return `先回刷 ${Math.min(reviewCount, 2)} 个复习关，把薄弱点补稳。`;
  }
  if (recommendation.kind === "complete") {
    return "今天做 1 个项目关回顾，保持手感。";
  }
  return "完成 1 个新关卡，并尽量少用提示拿高星。";
}

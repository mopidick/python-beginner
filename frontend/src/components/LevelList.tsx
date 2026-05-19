import { useMemo, useState } from "react";

import type { Level } from "../levels/levels";
import { getChapterMilestone, getChapterStatus } from "../progress/chapters";

type Props = {
  levels: Level[];
  currentId: string;
  completed: string[];
  attempted: string[];
  starsByLevel?: Record<string, number>;
  solutionUsedByLevel?: Record<string, boolean>;
  onSelect: (level: Level) => void;
};

const modeLabels: Record<Level["mode"], string> = {
  lesson: "新课",
  review: "复习",
  project: "项目",
};

const modeFilters = [
  { label: "全部", value: "all" },
  { label: "只看新课", value: "lesson" },
  { label: "只看复习", value: "review" },
  { label: "只看项目", value: "project" },
] as const;

type ModeFilter = (typeof modeFilters)[number]["value"];

export function LevelList({ levels, currentId, completed, attempted, starsByLevel = {}, solutionUsedByLevel = {}, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredLevels = useMemo(
    () =>
      levels.filter((level) => {
        const matchesMode = modeFilter === "all" || level.mode === modeFilter;
        const searchable = [level.title, level.chapter, level.concept, level.difficulty, ...level.tags].join(" ").toLowerCase();
        return matchesMode && (!normalizedQuery || searchable.includes(normalizedQuery));
      }),
    [levels, modeFilter, normalizedQuery],
  );
  const chapters = Array.from(new Set(filteredLevels.map((level) => level.chapter)));

  function statusFor(levelId: string) {
    if (completed.includes(levelId)) {
      return "通过";
    }
    if (attempted.includes(levelId)) {
      return "尝试中";
    }
    return "";
  }

  function chapterProgress(chapter: string) {
    const milestone = getChapterMilestone(levels, chapter, { completed, starsByLevel });
    return `${chapter} · ${milestone.completedCount}/${milestone.totalCount} · ${getChapterStatus(milestone)}`;
  }

  function starsFor(level: Level) {
    const count = starsByLevel[level.id] || 0;
    if (count === 0) {
      return null;
    }
    return (
      <span className="level-stars" aria-label={`${level.title}，已获得 ${count} 星`}>
        {"★".repeat(count)}
      </span>
    );
  }

  function solutionBadgeFor(levelId: string) {
    if (!solutionUsedByLevel[levelId]) {
      return null;
    }
    return <small className="solution-used-badge">参考答案</small>;
  }

  return (
    <aside className="level-list" aria-label="课程地图">
      <div className="panel-title">关卡</div>
      <div className="level-filters">
        <label>
          <span>搜索关卡</span>
          <input
            aria-label="搜索关卡"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="标题、章节、知识点"
            type="search"
            value={query}
          />
        </label>
        <div className="mode-filter" aria-label="关卡类型筛选">
          {modeFilters.map((filter) => (
            <button
              className={modeFilter === filter.value ? "active" : ""}
              key={filter.value}
              onClick={() => setModeFilter(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
        <strong>筛选结果：{filteredLevels.length}/{levels.length} 关</strong>
      </div>
      {chapters.map((chapter) => (
        <div className="level-row" key={chapter}>
          <div className="chapter-label">{chapterProgress(chapter)}</div>
          {filteredLevels
            .filter((level) => level.chapter === chapter)
            .map((level) => {
              const index = levels.findIndex((item) => item.id === level.id);
              return (
                <button
                  className={`level-item ${level.id === currentId ? "active" : ""}`}
                  key={level.id}
                  onClick={() => onSelect(level)}
                  type="button"
                >
                  <span className="level-index">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <strong>{level.title}</strong>
                    <small>
                      <b className={`mode-badge ${level.mode}`}>{modeLabels[level.mode]}</b>
                      {level.difficulty} · {level.estimatedMinutes} 分钟 · {level.concept}
                    </small>
                  </span>
                  <span className="level-status">
                    {starsFor(level)}
                    {solutionBadgeFor(level.id)}
                    {statusFor(level.id)}
                  </span>
                </button>
              );
            })}
        </div>
      ))}
    </aside>
  );
}

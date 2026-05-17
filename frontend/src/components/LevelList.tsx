import type { Level } from "../levels/levels";

type Props = {
  levels: Level[];
  currentId: string;
  completed: string[];
  attempted: string[];
  starsByLevel?: Record<string, number>;
  onSelect: (level: Level) => void;
};

export function LevelList({ levels, currentId, completed, attempted, starsByLevel = {}, onSelect }: Props) {
  const chapters = Array.from(new Set(levels.map((level) => level.chapter)));

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
    const chapterLevels = levels.filter((level) => level.chapter === chapter);
    const completedCount = chapterLevels.filter((level) => completed.includes(level.id)).length;
    return `${chapter} · ${completedCount}/${chapterLevels.length}`;
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

  return (
    <aside className="level-list" aria-label="课程地图">
      <div className="panel-title">关卡</div>
      {chapters.map((chapter) => (
        <div className="level-row" key={chapter}>
          <div className="chapter-label">{chapterProgress(chapter)}</div>
          {levels
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
                      {level.difficulty} · {level.estimatedMinutes} 分钟 · {level.concept}
                    </small>
                  </span>
                  <span className="level-status">
                    {starsFor(level)}
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

import type { Level } from "../levels/levels";

type Props = {
  levels: Level[];
  currentId: string;
  completed: string[];
  attempted: string[];
  onSelect: (level: Level) => void;
};

export function LevelList({ levels, currentId, completed, attempted, onSelect }: Props) {
  function statusFor(levelId: string) {
    if (completed.includes(levelId)) {
      return "通过";
    }
    if (attempted.includes(levelId)) {
      return "尝试中";
    }
    return "";
  }

  return (
    <aside className="level-list" aria-label="关卡列表">
      <div className="panel-title">关卡</div>
      {levels.map((level, index) => (
        <button
          className={`level-item ${level.id === currentId ? "active" : ""}`}
          key={level.id}
          onClick={() => onSelect(level)}
          type="button"
        >
          <span className="level-index">{String(index + 1).padStart(2, "0")}</span>
          <span>
            <strong>{level.title}</strong>
            <small>{level.concept}</small>
          </span>
          <span className="level-status">{statusFor(level.id)}</span>
        </button>
      ))}
    </aside>
  );
}

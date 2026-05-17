import { Trash2 } from "lucide-react";

type Props = {
  completedCount: number;
  attemptedCount: number;
  hintCount: number;
  totalCount: number;
  chapterCount: number;
  totalMinutes: number;
  currentLevelTitle: string;
  onReset: () => void;
};

export function ProgressSummary({
  completedCount,
  attemptedCount,
  hintCount,
  totalCount,
  chapterCount,
  totalMinutes,
  currentLevelTitle,
  onReset,
}: Props) {
  return (
    <section className="progress-summary">
      <div className="summary-heading">
        <div>
          <div className="panel-title">学习概览</div>
          <p>当前关卡：{currentLevelTitle}</p>
        </div>
        <button type="button" className="icon-button secondary" title="清空进度" aria-label="清空进度" onClick={onReset}>
          <Trash2 size={17} />
        </button>
      </div>
      <div className="summary-metrics">
        <div>
          <span>已通关</span>
          <strong>
            {completedCount}/{totalCount}
          </strong>
        </div>
        <div>
          <span>已尝试</span>
          <strong>{attemptedCount}</strong>
        </div>
        <div>
          <span>已用提示</span>
          <strong>{hintCount}</strong>
        </div>
        <div>
          <span>章节</span>
          <strong>{chapterCount}</strong>
        </div>
        <div>
          <span>预计时长</span>
          <strong>{totalMinutes} 分钟</strong>
        </div>
      </div>
    </section>
  );
}

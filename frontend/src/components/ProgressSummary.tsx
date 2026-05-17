import { Trash2 } from "lucide-react";

import type { LearningRecommendation } from "../progress/recommendations";

type Props = {
  completedCount: number;
  attemptedCount: number;
  hintCount: number;
  totalCount: number;
  chapterCount: number;
  totalMinutes: number;
  currentLevelTitle: string;
  recommendation: LearningRecommendation;
  reviewCount: number;
  onGoToRecommendation: () => void;
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
  recommendation,
  reviewCount,
  onGoToRecommendation,
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
      <div className="recommendation-card">
        <div>
          <span>下一步建议</span>
          <strong>{recommendation.title}</strong>
          <p>{recommendation.reason}</p>
          <small>{reviewCount > 0 ? `建议复习 ${reviewCount} 关` : "当前没有需要优先复习的关卡"}</small>
        </div>
        <button type="button" onClick={onGoToRecommendation}>
          {recommendation.title}
        </button>
      </div>
    </section>
  );
}

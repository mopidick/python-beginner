import { Trash2 } from "lucide-react";

import type { WeakTag } from "../progress/mastery";
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
  reviewCandidates: LearningRecommendation[];
  weakTags: WeakTag[];
  practiceCount: number;
  studyGoal: string;
  streakDays: number;
  onGoToRecommendation: () => void;
  onGoToLevel: (levelId: string) => void;
  onReset: () => void;
};

const recommendationLabels: Record<LearningRecommendation["kind"], string> = {
  continue: "继续学习",
  stuck: "收口卡住关",
  review: "复习低星关",
  complete: "完成回顾",
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
  reviewCandidates,
  weakTags,
  practiceCount,
  studyGoal,
  streakDays,
  onGoToRecommendation,
  onGoToLevel,
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
          <span>练习次数</span>
          <strong title={`已尝试 ${attemptedCount} 关`}>{practiceCount}</strong>
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
          <span>{recommendationLabels[recommendation.kind]}</span>
          <strong>{recommendation.title}</strong>
          <p>{recommendation.reason}</p>
          <small>{reviewCount > 0 ? `建议复习 ${reviewCount} 关` : "当前没有需要优先复习的关卡"}</small>
        </div>
        <button type="button" onClick={onGoToRecommendation}>
          {recommendation.title}
        </button>
      </div>
      <div className="study-goal-card">
        <div>
          <span>今日目标</span>
          <strong>{studyGoal}</strong>
        </div>
        <small>{streakDays > 0 ? `连续学习 ${streakDays} 天` : "今天运行一次代码就会开始记录连续学习"}</small>
      </div>
      {reviewCandidates.length > 0 && (
        <div className="review-queue">
          <span>复习队列</span>
          <div>
            {reviewCandidates.map((candidate) => (
              <button type="button" key={candidate.levelId} onClick={() => onGoToLevel(candidate.levelId)}>
                {candidate.title}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="weak-tags">
        <span>薄弱知识点</span>
        {weakTags.length > 0 ? (
          <div>
            {weakTags.map((item) => (
              <button type="button" key={item.tag} title={item.reason} onClick={() => onGoToLevel(item.levelId)}>
                {item.tag}
                <small>{item.levelTitle}</small>
              </button>
            ))}
          </div>
        ) : (
          <strong>暂时没有明显薄弱点</strong>
        )}
      </div>
    </section>
  );
}

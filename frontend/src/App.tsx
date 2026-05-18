import { useMemo, useState } from "react";

import { runCode } from "./api/client";
import type { RunResponse } from "./api/types";
import { EditorPanel } from "./components/EditorPanel";
import { HintPanel } from "./components/HintPanel";
import { LevelList } from "./components/LevelList";
import { ProgressSummary } from "./components/ProgressSummary";
import { StatePanel } from "./components/StatePanel";
import { levels, type Level } from "./levels/levels";
import { getChapterMilestone } from "./progress/chapters";
import { getWeakTags } from "./progress/mastery";
import { getLearningRecommendation, getReviewCandidates } from "./progress/recommendations";
import { addPracticeDate, calculateStudyStreak, getLocalDateKey, getStudyGoal } from "./progress/session";
import { emptyProgress, loadProgress, saveProgress, type Progress } from "./progress/storage";
import "./styles/global.css";

const VERSION = "0.3.5";

type StarGain = {
  levelId: string;
  previous: number;
  current: number;
};

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const currentLevel = useMemo(
    () => levels.find((level) => level.id === progress.currentLevelId) || levels[0],
    [progress.currentLevelId],
  );
  const [code, setCode] = useState(progress.codeByLevel[currentLevel.id] || currentLevel.starterCode);
  const [result, setResult] = useState<RunResponse | null>(null);
  const [networkError, setNetworkError] = useState("");
  const [running, setRunning] = useState(false);
  const [starGain, setStarGain] = useState<StarGain | null>(null);
  const currentIndex = levels.findIndex((level) => level.id === currentLevel.id);
  const nextLevel = currentIndex >= 0 ? levels[currentIndex + 1] : undefined;
  const usedHintCount = Object.values(progress.hintStepsByLevel).reduce((total, count) => total + count, 0);
  const chapterCount = new Set(levels.map((level) => level.chapter)).size;
  const totalMinutes = levels.reduce((total, level) => total + level.estimatedMinutes, 0);
  const currentStars = progress.starsByLevel[currentLevel.id] || 0;
  const recommendation = getLearningRecommendation(levels, progress);
  const reviewCandidates = getReviewCandidates(levels, progress);
  const weakTags = getWeakTags(levels, progress);
  const practiceCount = Object.values(progress.attemptCountByLevel).reduce((total, count) => total + count, 0);
  const studyGoal = getStudyGoal(recommendation, reviewCandidates.length);
  const streakDays = calculateStudyStreak(progress.practiceDates);
  const chapterMilestone = getChapterMilestone(levels, currentLevel.chapter, progress);

  function starsFor(levelId: string) {
    const hintCount = progress.hintStepsByLevel[levelId] || 0;
    if (hintCount === 0) {
      return 3;
    }
    if (hintCount === 1) {
      return 2;
    }
    return 1;
  }

  function updateProgress(next: Progress) {
    setProgress(next);
    saveProgress(next);
  }

  function selectLevel(level: Level) {
    const codeByLevel = { ...progress.codeByLevel, [currentLevel.id]: code };
    const next = { ...progress, currentLevelId: level.id, codeByLevel };
    updateProgress(next);
    setCode(codeByLevel[level.id] || level.starterCode);
    setResult(null);
    setStarGain(null);
    setNetworkError("");
  }

  function resetCode() {
    setCode(currentLevel.starterCode);
    setResult(null);
    setStarGain(null);
    setNetworkError("");
  }

  function goToNextLevel() {
    if (nextLevel) {
      selectLevel(nextLevel);
    }
  }

  function goToRecommendation() {
    goToLevelId(recommendation.levelId);
  }

  function goToLevelId(levelId: string) {
    const level = levels.find((item) => item.id === levelId);
    if (level) {
      selectLevel(level);
    }
  }

  function revealHint(count: number) {
    updateProgress({
      ...progress,
      hintStepsByLevel: {
        ...progress.hintStepsByLevel,
        [currentLevel.id]: count,
      },
    });
  }

  function resetProgress() {
    const confirmed = window.confirm("确定要清空所有通关记录、草稿和星级吗？这个操作不能撤销。");
    if (!confirmed) {
      return;
    }
    const next = emptyProgress();
    updateProgress(next);
    setCode(levels[0].starterCode);
    setResult(null);
    setStarGain(null);
    setNetworkError("");
  }

  async function handleRun() {
    setRunning(true);
    setNetworkError("");
    try {
      const response = await runCode(currentLevel.id, code);
      setResult(response);
      const now = new Date().toISOString();
      const today = getLocalDateKey();
      const baseProgress = {
        ...progress,
        attempted: Array.from(new Set([...progress.attempted, currentLevel.id])),
        codeByLevel: { ...progress.codeByLevel, [currentLevel.id]: code },
        attemptCountByLevel: {
          ...progress.attemptCountByLevel,
          [currentLevel.id]: (progress.attemptCountByLevel[currentLevel.id] || 0) + 1,
        },
        lastPracticedAtByLevel: {
          ...progress.lastPracticedAtByLevel,
          [currentLevel.id]: now,
        },
        practiceDates: addPracticeDate(progress.practiceDates, today),
      };

      if (response.passed) {
        const stars = starsFor(currentLevel.id);
        const previousStars = progress.starsByLevel[currentLevel.id] || 0;
        const nextStars = Math.max(previousStars, stars);
        setStarGain({ levelId: currentLevel.id, previous: previousStars, current: nextStars });
        updateProgress({
          ...baseProgress,
          completed: Array.from(new Set([...progress.completed, currentLevel.id])),
          starsByLevel: {
            ...progress.starsByLevel,
            [currentLevel.id]: nextStars,
          },
          passedAtByLevel: {
            ...progress.passedAtByLevel,
            [currentLevel.id]: progress.passedAtByLevel[currentLevel.id] || now,
          },
        });
      } else {
        setStarGain(null);
        updateProgress(baseProgress);
      }
    } catch (error) {
      setNetworkError(error instanceof Error ? error.message : "运行服务不可用，请确认后端已经启动。");
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Python 可视化闯关</h1>
          <p>{`面向程序员的 Python 核心语法训练场 · v${VERSION}`}</p>
        </div>
        <div className="progress-pill">
          {progress.completed.length}/{levels.length} 关
        </div>
      </header>

      <div className="workspace">
        <LevelList
          levels={levels}
          currentId={currentLevel.id}
          completed={progress.completed}
          attempted={progress.attempted}
          starsByLevel={progress.starsByLevel}
          onSelect={selectLevel}
        />
        <section className="lesson-panel">
          <ProgressSummary
            completedCount={progress.completed.length}
            attemptedCount={progress.attempted.length}
            hintCount={usedHintCount}
            totalCount={levels.length}
            chapterCount={chapterCount}
            totalMinutes={totalMinutes}
            currentLevelTitle={currentLevel.title}
            recommendation={recommendation}
            reviewCount={reviewCandidates.length}
            reviewCandidates={reviewCandidates.slice(0, 3)}
            weakTags={weakTags}
            practiceCount={practiceCount}
            studyGoal={studyGoal}
            streakDays={streakDays}
            onGoToRecommendation={goToRecommendation}
            onGoToLevel={goToLevelId}
            onReset={resetProgress}
          />
          <div className="lesson-copy">
            <span>
              {currentLevel.chapter} · {currentLevel.difficulty} · {currentLevel.estimatedMinutes} 分钟
            </span>
            <h2>{currentLevel.title}</h2>
            <p>{currentLevel.story}</p>
            <div className="lesson-notes">
              <article>
                <strong>学习目标</strong>
                <p>{currentLevel.goal}</p>
              </article>
              <article>
                <strong>解题套路</strong>
                <p>{currentLevel.pattern}</p>
              </article>
            </div>
            <p>{currentLevel.instructions}</p>
            <ul>
              {currentLevel.checks.map((check) => (
                <li key={check.id}>{check.label}</li>
              ))}
            </ul>
          </div>
          {chapterMilestone.completed && (
            <div className="chapter-milestone">
              <div>
                <span>章节里程碑</span>
                <strong>{chapterMilestone.chapter} 已完成</strong>
                <p>
                  本章 {chapterMilestone.completedCount}/{chapterMilestone.totalCount} 关通过，平均{" "}
                  {chapterMilestone.averageStars} 星。
                </p>
              </div>
              {chapterMilestone.lowStarLevelId ? (
                <button type="button" onClick={() => goToLevelId(chapterMilestone.lowStarLevelId!)}>
                  回刷 {chapterMilestone.lowStarLevelTitle}
                </button>
              ) : (
                chapterMilestone.nextLevelId && (
                  <button type="button" onClick={() => goToLevelId(chapterMilestone.nextLevelId!)}>
                    进入 {chapterMilestone.nextLevelTitle}
                  </button>
                )
              )}
            </div>
          )}
          <HintPanel
            hints={currentLevel.hints}
            revealedCount={progress.hintStepsByLevel[currentLevel.id] || 0}
            onReveal={revealHint}
          />
          <EditorPanel code={code} running={running} onChange={setCode} onRun={handleRun} onReset={resetCode} />
        </section>
        <StatePanel result={result} />
      </div>

      {networkError && <div className="toast error">{networkError}</div>}
      {result?.passed && (
        <div className="toast success">
          <span>
            {starGain && starGain.levelId === currentLevel.id && starGain.previous > 0 && starGain.current > starGain.previous
              ? `星级从 ${starGain.previous} 提升到 ${starGain.current} · ${currentLevel.recap}`
              : `获得 ${currentStars || starsFor(currentLevel.id)} 星 · ${currentLevel.recap}`}
          </span>
          {nextLevel && (
            <button type="button" onClick={goToNextLevel}>
              进入下一关
            </button>
          )}
        </div>
      )}
    </main>
  );
}

import { useMemo, useState } from "react";

import { runCode } from "./api/client";
import type { RunResponse } from "./api/types";
import { EditorPanel } from "./components/EditorPanel";
import { HintPanel } from "./components/HintPanel";
import { LevelList } from "./components/LevelList";
import { ProgressSummary } from "./components/ProgressSummary";
import { StatePanel } from "./components/StatePanel";
import { levels, type Level } from "./levels/levels";
import "./styles/global.css";

type Progress = {
  completed: string[];
  attempted: string[];
  currentLevelId: string;
  codeByLevel: Record<string, string>;
  hintStepsByLevel: Record<string, number>;
  starsByLevel: Record<string, number>;
};

const VERSION = "0.2.5";
const STORAGE_KEY = "python-beginner-progress";

function emptyProgress(): Progress {
  return {
    completed: [],
    attempted: [],
    currentLevelId: levels[0].id,
    codeByLevel: {},
    hintStepsByLevel: {},
    starsByLevel: {},
  };
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyProgress();
    }
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      attempted: Array.isArray(parsed.attempted) ? parsed.attempted : [],
      currentLevelId: parsed.currentLevelId || levels[0].id,
      codeByLevel: parsed.codeByLevel || {},
      hintStepsByLevel: parsed.hintStepsByLevel || {},
      starsByLevel: parsed.starsByLevel || {},
    };
  } catch {
    return emptyProgress();
  }
}

function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

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
  const currentIndex = levels.findIndex((level) => level.id === currentLevel.id);
  const nextLevel = currentIndex >= 0 ? levels[currentIndex + 1] : undefined;
  const usedHintCount = Object.values(progress.hintStepsByLevel).reduce((total, count) => total + count, 0);
  const chapterCount = new Set(levels.map((level) => level.chapter)).size;
  const totalMinutes = levels.reduce((total, level) => total + level.estimatedMinutes, 0);
  const currentStars = progress.starsByLevel[currentLevel.id] || 0;

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
    const next = { ...progress, currentLevelId: level.id };
    updateProgress(next);
    setCode(progress.codeByLevel[level.id] || level.starterCode);
    setResult(null);
    setNetworkError("");
  }

  function resetCode() {
    setCode(currentLevel.starterCode);
    setResult(null);
    setNetworkError("");
  }

  function goToNextLevel() {
    if (nextLevel) {
      selectLevel(nextLevel);
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
    const next = emptyProgress();
    updateProgress(next);
    setCode(levels[0].starterCode);
    setResult(null);
    setNetworkError("");
  }

  async function handleRun() {
    setRunning(true);
    setNetworkError("");
    try {
      const response = await runCode(currentLevel.id, code);
      setResult(response);
      const baseProgress = {
        ...progress,
        attempted: Array.from(new Set([...progress.attempted, currentLevel.id])),
        codeByLevel: { ...progress.codeByLevel, [currentLevel.id]: code },
      };

      if (response.passed) {
        const stars = starsFor(currentLevel.id);
        updateProgress({
          ...baseProgress,
          completed: Array.from(new Set([...progress.completed, currentLevel.id])),
          starsByLevel: {
            ...progress.starsByLevel,
            [currentLevel.id]: Math.max(progress.starsByLevel[currentLevel.id] || 0, stars),
          },
        });
      } else {
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
            onReset={resetProgress}
          />
          <div className="lesson-copy">
            <span>
              {currentLevel.chapter} · {currentLevel.difficulty} · {currentLevel.estimatedMinutes} 分钟
            </span>
            <h2>{currentLevel.title}</h2>
            <p>{currentLevel.story}</p>
            <p>{currentLevel.instructions}</p>
            <ul>
              {currentLevel.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </div>
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
            获得 {currentStars || starsFor(currentLevel.id)} 星 · {currentLevel.successMessage}
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

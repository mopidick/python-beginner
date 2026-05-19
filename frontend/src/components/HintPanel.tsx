import { Eye, Lightbulb } from "lucide-react";
import { useState } from "react";

type Props = {
  hints: string[];
  revealedCount: number;
  solution?: string;
  onReveal: (count: number) => void;
};

export function HintPanel({ hints, revealedCount, solution, onReveal }: Props) {
  const [solutionVisible, setSolutionVisible] = useState(false);
  const safeCount = Math.min(revealedCount, hints.length);
  const allVisible = safeCount >= hints.length;
  const canShowSolution = allVisible && Boolean(solution);

  return (
    <section className="hint-panel">
      <div className="hint-header">
        <div>
          <div className="panel-title">递进提示</div>
          <p>卡住时一层层打开提示，不会直接跳到答案。</p>
        </div>
        <span>提示 {safeCount}/{hints.length}</span>
      </div>
      {safeCount > 0 && (
        <ol>
          {hints.slice(0, safeCount).map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ol>
      )}
      <button type="button" className="hint-button" disabled={allVisible} onClick={() => onReveal(safeCount + 1)}>
        <Lightbulb size={16} />
        {allVisible ? "提示已全部显示" : "显示下一条提示"}
      </button>
      {canShowSolution && (
        <div className="solution-panel">
          <div>
            <strong>参考答案</strong>
            <button type="button" onClick={() => setSolutionVisible((visible) => !visible)}>
              <Eye size={16} />
              {solutionVisible ? "隐藏参考答案" : "查看参考答案"}
            </button>
          </div>
          {solutionVisible && <pre>{solution}</pre>}
        </div>
      )}
    </section>
  );
}

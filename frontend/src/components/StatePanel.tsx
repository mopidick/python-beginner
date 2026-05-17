import type { RunResponse } from "../api/types";
import { VariableInspector } from "./VariableInspector";

type Props = {
  result: RunResponse | null;
};

function summaryFor(result: RunResponse) {
  if (result.error) {
    return "运行错误";
  }
  if (result.passed) {
    return "通过";
  }
  const failed = result.checks.filter((check) => !check.passed).length;
  return `还差 ${failed} 项`;
}

function formatValue(value: unknown) {
  if (value === undefined) {
    return "未提供";
  }
  return typeof value === "string" ? value : JSON.stringify(value);
}

export function StatePanel({ result }: Props) {
  const failedChecks = result?.checks.filter((check) => !check.passed) ?? [];

  return (
    <section className="state-panel">
      <div className="panel-title">执行状态</div>
      {!result && <p className="empty-state">运行代码后，这里会显示 stdout、变量快照和检查结果。</p>}

      {result && <div className={`result-summary ${result.passed ? "passed" : "failed"}`}>{summaryFor(result)}</div>}

      {result?.error && (
        <div className="error-box">
          <strong>{result.error.type}</strong>
          <span>{result.error.message}</span>
          {result.error.line && <small>第 {result.error.line} 行</small>}
        </div>
      )}

      {result && (
        <>
          {result.diagnostics.length > 0 && (
            <div className="state-section">
              <h3>诊断反馈</h3>
              <ul className="diagnostics">
                {result.diagnostics.map((diagnostic) => (
                  <li key={`${diagnostic.title}-${diagnostic.line ?? "global"}`}>
                    <div>
                      <strong>{diagnostic.title}</strong>
                      {diagnostic.line && <span>第 {diagnostic.line} 行</span>}
                    </div>
                    <p>{diagnostic.explanation}</p>
                    <small>{diagnostic.suggestion}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!result.error && failedChecks.length > 0 && (
            <div className="state-section correction-section">
              <h3>本次要修正</h3>
              <div className="correction-list">
                {failedChecks.map((check) => (
                  <article className="correction-card" key={check.id}>
                    <strong>{check.label}</strong>
                    {check.reason && <p>{check.reason}</p>}
                    <div className="value-compare">
                      <div>
                        <span>当前值</span>
                        <code>{formatValue(check.actual)}</code>
                      </div>
                      <div>
                        <span>目标值</span>
                        <code>{formatValue(check.expected)}</code>
                      </div>
                    </div>
                    <small>{check.hint}</small>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="state-section">
            <h3>stdout</h3>
            <pre>{result.stdout || "(无输出)"}</pre>
          </div>

          <div className="state-section">
            <h3>变量快照</h3>
            <VariableInspector variables={result.variables} />
          </div>

          <div className="state-section">
            <h3>检查结果</h3>
            {result.checks.length === 0 ? (
              <p className="muted">没有检查结果</p>
            ) : (
              <ul className="checks">
                {result.checks.map((check) => (
                  <li className={check.passed ? "passed" : "failed"} key={check.id}>
                    <span>{check.passed ? "通过" : "未通过"}</span>
                    <div>
                      <strong>{check.label}</strong>
                      {!check.passed && <small>{check.hint}</small>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}

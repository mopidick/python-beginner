import type { SerializedVariable } from "../api/types";

type Props = {
  variables: Record<string, SerializedVariable>;
};

function formatValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value);
}

function renderStructuredValue(variable: SerializedVariable) {
  if (Array.isArray(variable.value)) {
    return (
      <div className="array-view">
        {variable.value.map((item, index) => (
          <div className="array-cell" key={`${index}-${formatValue(item)}`}>
            <span>{index}</span>
            <strong>{formatValue(item)}</strong>
          </div>
        ))}
      </div>
    );
  }

  if (variable.value && typeof variable.value === "object") {
    return (
      <div className="dict-view">
        {Object.entries(variable.value as Record<string, unknown>).map(([key, item]) => (
          <div className="dict-row" key={key}>
            <span>{key}</span>
            <strong>{formatValue(item)}</strong>
          </div>
        ))}
      </div>
    );
  }

  return <code>{formatValue(variable.value)}</code>;
}

export function VariableInspector({ variables }: Props) {
  if (Object.keys(variables).length === 0) {
    return <p className="muted">暂无可展示变量</p>;
  }

  return (
    <div className="variable-grid">
      {Object.entries(variables).map(([name, variable]) => (
        <article className="variable-card" key={name}>
          <div>
            <strong>{name}</strong>
            <span>{variable.type}</span>
          </div>
          {renderStructuredValue(variable)}
        </article>
      ))}
    </div>
  );
}

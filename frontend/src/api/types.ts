export type SerializedVariable = {
  type: string;
  value: unknown;
};

export type CheckResult = {
  id: string;
  label: string;
  passed: boolean;
  hint: string;
};

export type RunError = {
  type: string;
  message: string;
  line: number | null;
};

export type Diagnostic = {
  severity: "error" | "warning" | "info";
  line: number | null;
  title: string;
  explanation: string;
  suggestion: string;
};

export type RunResponse = {
  stdout: string;
  stderr: string;
  error: RunError | null;
  variables: Record<string, SerializedVariable>;
  checks: CheckResult[];
  diagnostics: Diagnostic[];
  passed: boolean;
};

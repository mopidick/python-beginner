import type { Completion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";

const KEYWORD_COMPLETIONS: Completion[] = [
  { label: "def", type: "keyword", apply: "def function_name():\n    " },
  { label: "for", type: "keyword", apply: "for item in items:\n    " },
  { label: "if", type: "keyword", apply: "if condition:\n    " },
  { label: "elif", type: "keyword", apply: "elif condition:\n    " },
  { label: "else", type: "keyword", apply: "else:\n    " },
  { label: "return", type: "keyword" },
  { label: "while", type: "keyword", apply: "while condition:\n    " },
  { label: "try", type: "keyword", apply: "try:\n    \nexcept Exception:\n    " },
  { label: "None", type: "constant" },
  { label: "True", type: "constant" },
  { label: "False", type: "constant" },
];

const BUILTIN_COMPLETIONS: Completion[] = [
  { label: "print", type: "function", apply: "print()" },
  { label: "range", type: "function", apply: "range()" },
  { label: "len", type: "function", apply: "len()" },
  { label: "str", type: "function", apply: "str()" },
  { label: "int", type: "function", apply: "int()" },
  { label: "float", type: "function", apply: "float()" },
  { label: "list", type: "function", apply: "list()" },
  { label: "dict", type: "function", apply: "dict()" },
  { label: "enumerate", type: "function", apply: "enumerate()" },
  { label: "sum", type: "function", apply: "sum()" },
];

function isInsideStringOrComment(text: string, position: number) {
  const lineStart = text.lastIndexOf("\n", Math.max(0, position - 1)) + 1;
  const beforeCursor = text.slice(lineStart, position);
  const commentIndex = beforeCursor.indexOf("#");

  if (commentIndex >= 0) {
    return true;
  }

  const singleQuotes = (beforeCursor.match(/'/g) || []).length;
  const doubleQuotes = (beforeCursor.match(/"/g) || []).length;
  return singleQuotes % 2 === 1 || doubleQuotes % 2 === 1;
}

function currentToken(text: string, position: number) {
  const beforeCursor = text.slice(0, position);
  const match = beforeCursor.match(/[A-Za-z_][A-Za-z0-9_]*$/);
  return match?.[0] || "";
}

function contextCompletions(text: string, position: number): Completion[] {
  const beforeCursor = text.slice(0, position);
  const names = new Set<string>();
  const assignmentPattern = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/gm;
  const functionPattern = /^\s*def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/gm;

  for (const match of beforeCursor.matchAll(assignmentPattern)) {
    names.add(match[1]);
  }
  for (const match of beforeCursor.matchAll(functionPattern)) {
    names.add(match[1]);
  }

  return Array.from(names).map((label) => ({ label, type: "variable" }));
}

function completionsFor(text: string, position: number): Completion[] {
  if (isInsideStringOrComment(text, position)) {
    return [];
  }

  const token = currentToken(text, position).toLowerCase();
  if (!token) {
    return [];
  }

  const byLabel = new Map<string, Completion>();
  for (const option of [...contextCompletions(text, position), ...KEYWORD_COMPLETIONS, ...BUILTIN_COMPLETIONS]) {
    if (option.label.toLowerCase().startsWith(token)) {
      byLabel.set(option.label, option);
    }
  }

  return Array.from(byLabel.values());
}

export function getPythonCompletionLabels(text: string, position: number) {
  return completionsFor(text, position).map((completion) => completion.label);
}

export function pythonCompletionSource(context: CompletionContext): CompletionResult | null {
  const text = context.state.doc.toString();
  const token = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*/);

  if (!token || (token.from === token.to && !context.explicit)) {
    return null;
  }

  const options = completionsFor(text, context.pos);
  if (options.length === 0) {
    return null;
  }

  return {
    from: token.from,
    options,
    validFor: /^[A-Za-z_][A-Za-z0-9_]*$/,
  };
}

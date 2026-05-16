import { describe, expect, test } from "vitest";

import { getPythonCompletionLabels } from "./pythonCompletions";

describe("Python completions", () => {
  test("suggests common Python builtins from the current token", () => {
    expect(getPythonCompletionLabels("pri", 3)).toContain("print");
    expect(getPythonCompletionLabels("ran", 3)).toContain("range");
  });

  test("suggests snippet-style keywords", () => {
    expect(getPythonCompletionLabels("fo", 2)).toContain("for");
    expect(getPythonCompletionLabels("de", 2)).toContain("def");
  });

  test("suggests variables and functions defined earlier in the code", () => {
    const code = "total = 0\n\ndef add_tax(price):\n    return price * 1.1\nprint(to";

    expect(getPythonCompletionLabels(code, code.length)).toContain("total");

    const functionCode = "total = 0\n\ndef add_tax(price):\n    return price * 1.1\nad";
    expect(getPythonCompletionLabels(functionCode, functionCode.length)).toContain("add_tax");
  });

  test("does not show completions inside comments or strings", () => {
    expect(getPythonCompletionLabels("# pri", 5)).toEqual([]);
    expect(getPythonCompletionLabels('message = "pri', 14)).toEqual([]);
  });
});

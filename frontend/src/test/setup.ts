import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("@uiw/react-codemirror", () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) =>
    React.createElement("textarea", {
      "aria-label": "Python 代码编辑器",
      className: "code-editor",
      spellCheck: false,
      value,
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value),
    }),
}));

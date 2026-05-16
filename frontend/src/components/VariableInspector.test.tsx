import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { VariableInspector } from "./VariableInspector";

describe("VariableInspector", () => {
  test("renders scalar variables", () => {
    render(<VariableInspector variables={{ x: { type: "int", value: 10 } }} />);

    expect(screen.getByText("x")).toBeInTheDocument();
    expect(screen.getByText("int")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("renders list variables as indexed chips", () => {
    render(<VariableInspector variables={{ numbers: { type: "list", value: [1, 2, 3] } }} />);

    expect(screen.getByText("numbers")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("renders dictionary variables as key value rows", () => {
    render(<VariableInspector variables={{ profile: { type: "dict", value: { name: "Lin", score: 8 } } }} />);

    expect(screen.getByText("profile")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("Lin")).toBeInTheDocument();
    expect(screen.getByText("score")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { levels } from "../levels/levels";
import { LevelList } from "./LevelList";

describe("LevelList", () => {
  test("shows chapter progress and earned stars", () => {
    render(
      <LevelList
        levels={levels}
        currentId="types-01"
        completed={["variables-01"]}
        attempted={["variables-01", "types-01"]}
        starsByLevel={{ "variables-01": 3 }}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("第 1 章：运行状态 · 1/4 · 进行中")).toBeInTheDocument();
    expect(screen.getByLabelText("变量与执行状态，已获得 3 星")).toBeInTheDocument();
    expect(screen.getByText("★★★")).toBeInTheDocument();
    expect(screen.getAllByText("新课").length).toBeGreaterThan(0);
    expect(screen.getAllByText("复习").length).toBeGreaterThan(0);
    expect(screen.getAllByText("项目").length).toBeGreaterThan(0);
  });
});

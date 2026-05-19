import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
        solutionUsedByLevel={{ "variables-01": true }}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("第 1 章：运行状态 · 1/4 · 进行中")).toBeInTheDocument();
    expect(screen.getByLabelText("变量与执行状态，已获得 3 星")).toBeInTheDocument();
    expect(screen.getByText("★★★")).toBeInTheDocument();
    expect(screen.getByText("参考答案")).toBeInTheDocument();
    expect(screen.getAllByText("新课").length).toBeGreaterThan(0);
    expect(screen.getAllByText("复习").length).toBeGreaterThan(0);
    expect(screen.getAllByText("项目").length).toBeGreaterThan(0);
  });

  test("filters levels by search keyword", async () => {
    render(
      <LevelList
        levels={levels}
        currentId="variables-01"
        completed={[]}
        attempted={[]}
        starsByLevel={{}}
        onSelect={vi.fn()}
      />,
    );

    await userEvent.type(screen.getByLabelText("搜索关卡"), "库存");

    expect(screen.getByText((_, element) => element?.textContent === "筛选结果：2/52 关")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /字典更新：库存入库/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /项目：库存预警/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /变量与执行状态/ })).not.toBeInTheDocument();
  });

  test("filters levels by mode", async () => {
    render(
      <LevelList
        levels={levels}
        currentId="variables-01"
        completed={[]}
        attempted={[]}
        starsByLevel={{}}
        onSelect={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "只看项目" }));

    expect(screen.getByText("筛选结果：10/52 关")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /项目：订单税费汇总/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /基础类型/ })).not.toBeInTheDocument();
  });
});

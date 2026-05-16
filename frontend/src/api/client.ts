import type { RunResponse } from "./types";

function detailToText(detail: unknown) {
  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg || JSON.stringify(item)).join("；");
  }
  if (detail && typeof detail === "object") {
    return JSON.stringify(detail);
  }
  return "";
}

export async function runCode(levelId: string, code: string): Promise<RunResponse> {
  let response: Response;
  try {
    response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ levelId, code }),
    });
  } catch {
    throw new Error("运行服务不可用，请确认后端已经启动。");
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = detailToText(body.detail);
    } catch {
      detail = "";
    }
    const prefix = response.status === 422 ? "请求无效" : `运行服务返回 ${response.status}`;
    throw new Error(detail ? `${prefix}：${detail}` : prefix);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("运行服务返回了无法解析的结果。");
  }
}

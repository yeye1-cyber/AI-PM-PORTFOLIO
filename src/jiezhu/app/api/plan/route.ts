import { NextResponse } from "next/server";
import {
  DEFAULT_PLAN_PROMPT,
  DEFAULT_SPLIT_PROMPT,
  MAX_EDITABLE_PROMPT_LENGTH,
} from "@jiezhu/lib/ai/prompt-config";
import { demoPlan, demoSplit } from "@jiezhu/lib/demo-responses";

type PlanRequest = {
  mode?: "plan" | "split";
  input?: string;
  adjustment?: string;
  parentContext?: string;
  customPrompt?: string;
};

function chatCompletionsUrl(baseUrl: string) {
  const normalized = baseUrl.replace(/\/+$/, "");
  return normalized.endsWith("/chat/completions") ? normalized : `${normalized}/chat/completions`;
}

function normalizeModel(model: string) {
  const normalized = model.trim().toLowerCase();
  if (normalized === "4.6v") return "glm-4.6v";
  if (normalized === "4.5-air") return "glm-4.5-air";
  return normalized;
}

function parseTasks(content: string) {
  const withoutFences = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const firstBrace = withoutFences.indexOf("{");
  const lastBrace = withoutFences.lastIndexOf("}");
  const cleaned = firstBrace >= 0 && lastBrace > firstBrace
    ? withoutFences.slice(firstBrace, lastBrace + 1)
    : withoutFences;
  const parsed = JSON.parse(cleaned) as { tasks?: unknown };
  if (!Array.isArray(parsed.tasks)) return null;
  const tasks = parsed.tasks
    .filter((task): task is string => typeof task === "string")
    .map((task) => task.trim())
    .filter(Boolean)
    .slice(0, 8);
  return tasks.length ? tasks : null;
}

export async function POST(request: Request) {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const configuredModel = process.env.AI_MODEL;
  let body: PlanRequest;
  try {
    body = await request.json() as PlanRequest;
  } catch {
    return NextResponse.json({ error: "请求格式不正确。" }, { status: 400 });
  }
  const input = body.input?.trim();
  if (!input || input.length > 4000 || (body.mode !== "plan" && body.mode !== "split")) {
    return NextResponse.json({ error: "计划内容为空或超出限制。" }, { status: 400 });
  }

  if (!apiKey || !baseUrl || !configuredModel) {
    const tasks = body.mode === "plan" ? demoPlan(input) : demoSplit(input);
    return NextResponse.json({ tasks, demoMode: true });
  }

  const customPrompt = body.customPrompt?.trim() || "";
  if (customPrompt.length > MAX_EDITABLE_PROMPT_LENGTH) {
    return NextResponse.json({ error: "提示词超出长度限制。" }, { status: 400 });
  }
  const systemPrompt = customPrompt || (body.mode === "plan" ? DEFAULT_PLAN_PROMPT : DEFAULT_SPLIT_PROMPT);

  const userPrompt = body.mode === "plan"
    ? `用户原话：${input}\n调整要求：${body.adjustment?.trim() || "无"}`
    : `要拆解的任务：${input}\n上级任务：${body.parentContext?.trim() || "无"}`;

  try {
    const upstream = await fetch(chatCompletionsUrl(baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: normalizeModel(configuredModel),
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!upstream.ok) {
      return NextResponse.json({ error: "AI 暂时没有回应，请稍后再试。" }, { status: 502 });
    }
    const result = await upstream.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const content = result.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return NextResponse.json({ error: "AI 返回了无法识别的内容。" }, { status: 502 });
    }
    const tasks = parseTasks(content);
    if (!tasks) {
      return NextResponse.json({ error: "AI 没有生成有效任务，请换一种说法再试。" }, { status: 502 });
    }
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ error: "连接 AI 服务超时，请稍后再试。" }, { status: 504 });
  }
}

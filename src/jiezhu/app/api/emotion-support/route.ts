import { NextResponse } from "next/server";
import {
  DEFAULT_ADVICE_PROMPT,
  DEFAULT_COMFORT_PROMPT,
  MAX_EDITABLE_PROMPT_LENGTH,
} from "@jiezhu/lib/ai/prompt-config";
import { demoEmotionAdvice, demoEmotionAnalysis } from "@jiezhu/lib/demo-responses";

const MAX_TEXT = 4000;
const MAX_CONTEXT_ITEMS = 8;

function cleanString(value: unknown, max = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanStrings(value: unknown, maxItems = MAX_CONTEXT_ITEMS) {
  return Array.isArray(value)
    ? value.map((item) => cleanString(item, 1200)).filter(Boolean).slice(0, maxItems)
    : [];
}

function chatCompletionsUrl(baseUrl: string) {
  const normalized = baseUrl.replace(/\/+$/, "");
  return normalized.endsWith("/chat/completions")
    ? normalized
    : `${normalized}/chat/completions`;
}

function normalizeModel(model: string) {
  const normalized = model.trim().toLowerCase();
  if (normalized === "4.6v") return "glm-4.6v";
  if (normalized === "4.5-air") return "glm-4.5-air";
  return normalized;
}

function parseJson(content: string): Record<string, unknown> {
  const normalized = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = normalized.indexOf("{");
  const end = normalized.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("missing_json");
  return JSON.parse(normalized.slice(start, end + 1)) as Record<string, unknown>;
}

function validAnalysis(value: Record<string, unknown>) {
  const heard = cleanString(value.heard, 700);
  const core = cleanString(value.core, 700);
  const comfort = cleanString(value.comfort, 700);
  return heard && core && comfort ? { heard, core, comfort } : null;
}

function validAdvice(value: Record<string, unknown>) {
  const suggestion = cleanString(value.suggestion, 700);
  const firstStep = cleanString(value.firstStep, 500);
  return suggestion && firstStep ? { suggestion, firstStep } : null;
}

export async function POST(request: Request) {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const configuredModel = process.env.AI_MODEL;
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "请求内容格式不正确。" }, { status: 400 });
  }

  const kind = body.kind === "advice" ? "advice" : body.kind === "analysis" ? "analysis" : null;
  const emotion = body.emotion && typeof body.emotion === "object"
    ? body.emotion as Record<string, unknown>
    : {};
  const selectedTags = cleanStrings(emotion.selectedTags, 15);
  const text = cleanString(emotion.text);
  if (!kind || (!selectedTags.length && !text)) {
    return NextResponse.json({ error: "请至少选择一个情绪标签或写下一点感受。" }, { status: 400 });
  }

  if (!apiKey || !baseUrl || !configuredModel) {
    const result = kind === "analysis"
      ? demoEmotionAnalysis({ selectedTags, text })
      : demoEmotionAdvice();
    return NextResponse.json({ kind, result, demoMode: true });
  }

  const knowledgeContext = cleanStrings(body.knowledgeContext);
  const feedback = cleanStrings(body.feedback, 10);
  const adjustments = cleanStrings(body.adjustments, 10);
  const previousAnalysis = body.previousAnalysis ?? body.analysis ?? null;
  const previousAdvice = body.previousAdvice ?? null;
  const customPrompt = cleanString(body.customPrompt, MAX_EDITABLE_PROMPT_LENGTH + 1);
  if (customPrompt.length > MAX_EDITABLE_PROMPT_LENGTH) {
    return NextResponse.json({ error: "提示词超出长度限制。" }, { status: 400 });
  }
  const emotionPriority = [
    `情绪标签：${selectedTags.length ? selectedTags.join("、") : "未选择"}`,
    `用户补充：${text || "未填写"}`,
  ].join("\n");

  const systemPrompt = customPrompt || (kind === "analysis" ? DEFAULT_COMFORT_PROMPT : DEFAULT_ADVICE_PROMPT);

  const userPayload = {
    highestPriorityEmotionInput: emotionPriority,
    analysis: previousAnalysis,
    analysisCorrections: feedback,
    previousAdvice,
    adviceAdjustments: adjustments,
    optionalKnowledgeContext: knowledgeContext,
  };

  try {
    const upstream = await fetch(chatCompletionsUrl(baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: normalizeModel(configuredModel),
        temperature: 0.55,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(userPayload) },
        ],
      }),
      signal: AbortSignal.timeout(90_000),
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: upstream.status === 429 ? "现在找咪的人有点多，请稍后再试。" : "AI 服务暂时没有回应，请稍后再试。" },
        { status: upstream.status === 429 ? 429 : 502 },
      );
    }
    const response = await upstream.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const content = response.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("empty_content");
    const parsed = parseJson(content);
    const result = kind === "analysis" ? validAnalysis(parsed) : validAdvice(parsed);
    if (!result) throw new Error("invalid_shape");
    return NextResponse.json({ kind, result });
  } catch (error) {
    console.error("Emotion support request failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      {
        error: error instanceof Error && error.name === "TimeoutError"
          ? "这次思考有点久，咪没有及时回来，请再试一次。"
          : "咪没有顺利整理好这次回应，请再试一次。",
      },
      { status: error instanceof Error && error.name === "TimeoutError" ? 504 : 502 },
    );
  }
}

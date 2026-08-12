import type { EmotionAdvice, EmotionAnalysis, EmotionRecord } from "@jiezhu/types/dashboard";
import {
  DEFAULT_ADVICE_PROMPT,
  DEFAULT_COMFORT_PROMPT,
  PROMPT_STORAGE_KEYS,
} from "@jiezhu/lib/ai/prompt-config";
import { readLocal } from "@jiezhu/lib/local-store";

type EmotionSupportResponse =
  | { kind: "analysis"; result: EmotionAnalysis }
  | { kind: "advice"; result: EmotionAdvice };

async function requestEmotionSupport(body: Record<string, unknown>): Promise<EmotionSupportResponse> {
  const response = await fetch("/api/emotion-support", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    kind?: unknown;
    result?: unknown;
  };
  if (!response.ok) throw new Error(data.error || "咪暂时没能完成分析，请再试一次。");
  return data as EmotionSupportResponse;
}

export async function analyzeEmotion(
  record: EmotionRecord,
  correction?: string,
  knowledgeContext: string[] = [],
): Promise<EmotionAnalysis> {
  const response = await requestEmotionSupport({
    kind: "analysis",
    emotion: {
      selectedTags: record.selectedTags,
      text: record.text,
    },
    previousAnalysis: record.analysisResult,
    feedback: [...record.analysisFeedback, ...(correction ? [correction] : [])],
    knowledgeContext,
    customPrompt: readLocal(PROMPT_STORAGE_KEYS.comfort, DEFAULT_COMFORT_PROMPT),
  });
  if (response.kind !== "analysis") throw new Error("AI 返回了错误的分析类型。");
  return response.result;
}

export async function generateEmotionAdvice(
  record: EmotionRecord,
  adjustment?: string,
  knowledgeContext: string[] = [],
): Promise<EmotionAdvice> {
  const response = await requestEmotionSupport({
    kind: "advice",
    emotion: {
      selectedTags: record.selectedTags,
      text: record.text,
    },
    analysis: record.analysisResult,
    feedback: record.analysisFeedback,
    previousAdvice: record.adviceResult,
    adjustments: [...record.adviceAdjustments, ...(adjustment ? [adjustment] : [])],
    knowledgeContext,
    customPrompt: readLocal(PROMPT_STORAGE_KEYS.advice, DEFAULT_ADVICE_PROMPT),
  });
  if (response.kind !== "advice") throw new Error("AI 返回了错误的建议类型。");
  return response.result;
}

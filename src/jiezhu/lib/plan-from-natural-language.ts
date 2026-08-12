import type { TodoItem } from "@jiezhu/types/dashboard";
import {
  DEFAULT_PLAN_PROMPT,
  DEFAULT_SPLIT_PROMPT,
  PROMPT_STORAGE_KEYS,
} from "@jiezhu/lib/ai/prompt-config";
import { readLocal } from "@jiezhu/lib/local-store";

export type PlanFromNaturalLanguage = (input: string) => Promise<TodoItem[]>;

type PlanApiResponse = {
  tasks?: string[];
  error?: string;
};

async function requestTasks(body: Record<string, unknown>) {
  const response = await fetch("/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json() as PlanApiResponse;
  if (!response.ok || !result.tasks?.length) {
    throw new Error(result.error || "咪暂时没能整理出计划，请再试一次。");
  }
  return result.tasks;
}

export const planFromNaturalLanguage: PlanFromNaturalLanguage = async (input) => {
  const [request, adjustment = ""] = input.split(/\n调整要求：/);
  const tasks = await requestTasks({
    mode: "plan",
    input: request,
    adjustment,
    customPrompt: readLocal(PROMPT_STORAGE_KEYS.plan, DEFAULT_PLAN_PROMPT),
  });

  return tasks.map((title) => ({
    id: crypto.randomUUID(),
    title,
    description: "",
    source: "ai" as const,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    depth: 0 as const,
    archived: true,
  }));
};

export async function splitTaskWithAi(task: string, parentContext?: string) {
  return requestTasks({
    mode: "split",
    input: task,
    parentContext,
    customPrompt: readLocal(PROMPT_STORAGE_KEYS.split, DEFAULT_SPLIT_PROMPT),
  });
}

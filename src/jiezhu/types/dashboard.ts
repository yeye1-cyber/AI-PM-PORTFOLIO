export type WorkspaceMode =
  | "initial" | "listening" | "analysis" | "actionSelection"
  | "adviceLoading" | "advice" | "planReview" | "planAdded" | "splitLevel1" | "splitLevel2" | "empty";

export type TodoItem = {
  id: string;
  title: string;
  description: string;
  source: "manual" | "ai" | "split";
  status: "pending" | "completed";
  createdAt: string;
  completedAt?: string;
  parentTaskId?: string;
  splitPlanTitle?: string;
  splitTasks?: string[];
  secondarySplits?: Record<string, string[]>;
  selectedSplit?: string;
  depth: 0 | 1 | 2;
  archived: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  status: "sent" | "streaming" | "failed";
};

export type EmotionAnalysis = {
  heard: string;
  core: string;
  comfort: string;
};

export type EmotionAdvice = {
  suggestion: string;
  firstStep: string;
};

export type EmotionRecord = {
  id: string;
  selectedTags: string[];
  text: string;
  createdAt: string;
  analysisStatus: "pending" | "completed" | "failed";
  analysisResult: EmotionAnalysis | null;
  analysisFeedback: string[];
  adviceResult: EmotionAdvice | null;
  adviceAdjustments: string[];
};

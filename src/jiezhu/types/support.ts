export type FlowScreen =
  | "input"
  | "understanding"
  | "response"
  | "action"
  | "refine"
  | "completed"
  | "paused";

export type SupportResponse = {
  heard: string;
  hardest: string;
  evidence: string;
};

export type MicroAction = {
  text: string;
  minutes: number;
  reason: string;
};

import type { FlowScreen } from "@jiezhu/types/support";

export type SessionState = {
  screen: FlowScreen;
  input: string;
  emotion: string | null;
  understandingIndex: number;
  responseIndex: number;
  correction: string;
  showCorrection: boolean;
  confirmed: boolean;
  companionVisible: boolean;
  actionIndex: number;
  actionStarted: boolean;
  refineIndex: number;
  resumeScreen: "response" | "action" | "refine";
};

export type SessionEvent =
  | { type: "SET_INPUT"; value: string }
  | { type: "SET_EMOTION"; value: string }
  | { type: "SUBMIT" }
  | { type: "ADVANCE_UNDERSTANDING" }
  | { type: "SHOW_RESPONSE" }
  | { type: "CONFIRM_RESPONSE" }
  | { type: "OPEN_CORRECTION" }
  | { type: "SET_CORRECTION"; value: string }
  | { type: "SUBMIT_CORRECTION" }
  | { type: "SHOW_COMPANION" }
  | { type: "SHOW_ACTION" }
  | { type: "START_ACTION" }
  | { type: "COMPLETE_ACTION" }
  | { type: "REPLACE_ACTION"; count: number }
  | { type: "SHOW_REFINE" }
  | { type: "REFINE_MORE"; count: number }
  | { type: "PAUSE"; from: "response" | "action" | "refine" }
  | { type: "RESUME" }
  | { type: "RESTART" };

export const initialSessionState: SessionState = {
  screen: "input",
  input: "",
  emotion: null,
  understandingIndex: -1,
  responseIndex: 0,
  correction: "",
  showCorrection: false,
  confirmed: false,
  companionVisible: false,
  actionIndex: 0,
  actionStarted: false,
  refineIndex: 0,
  resumeScreen: "response",
};

export function sessionReducer(
  state: SessionState,
  event: SessionEvent,
): SessionState {
  switch (event.type) {
    case "SET_INPUT":
      return { ...state, input: event.value };
    case "SET_EMOTION":
      return {
        ...state,
        emotion: state.emotion === event.value ? null : event.value,
      };
    case "SUBMIT":
      return { ...state, screen: "understanding", understandingIndex: 0 };
    case "ADVANCE_UNDERSTANDING":
      return {
        ...state,
        understandingIndex: Math.min(state.understandingIndex + 1, 3),
      };
    case "SHOW_RESPONSE":
      return { ...state, screen: "response" };
    case "CONFIRM_RESPONSE":
      return { ...state, confirmed: true, showCorrection: false };
    case "OPEN_CORRECTION":
      return { ...state, showCorrection: true, confirmed: false };
    case "SET_CORRECTION":
      return { ...state, correction: event.value };
    case "SUBMIT_CORRECTION":
      return {
        ...state,
        responseIndex: 1,
        showCorrection: false,
        correction: "",
        confirmed: false,
        companionVisible: false,
      };
    case "SHOW_COMPANION":
      return { ...state, companionVisible: true };
    case "SHOW_ACTION":
      return { ...state, screen: "action" };
    case "START_ACTION":
      return { ...state, actionStarted: true };
    case "COMPLETE_ACTION":
      return { ...state, screen: "completed" };
    case "REPLACE_ACTION":
      return {
        ...state,
        actionIndex: (state.actionIndex + 1) % event.count,
        actionStarted: false,
      };
    case "SHOW_REFINE":
      return { ...state, screen: "refine", refineIndex: 0 };
    case "REFINE_MORE":
      return {
        ...state,
        refineIndex: Math.min(state.refineIndex + 1, event.count - 1),
      };
    case "PAUSE":
      return { ...state, screen: "paused", resumeScreen: event.from };
    case "RESUME":
      return { ...state, screen: state.resumeScreen };
    case "RESTART":
      return initialSessionState;
    default:
      return state;
  }
}

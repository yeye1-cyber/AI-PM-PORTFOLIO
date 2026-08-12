"use client";

import { useEffect, useReducer } from "react";
import { AppHeader } from "@jiezhu/components/app-header";
import { ContextDrawer } from "@jiezhu/components/context-drawer";
import { EmotionInput } from "@jiezhu/components/emotion-input";
import { EmotionSelector } from "@jiezhu/components/emotion-selector";
import { IllustrationSlot } from "@jiezhu/components/illustration-slot";
import { MicroActionCard } from "@jiezhu/components/micro-action-card";
import { PauseMessage } from "@jiezhu/components/pause-message";
import { RefineActionCard } from "@jiezhu/components/refine-action-card";
import { ResponseActions } from "@jiezhu/components/response-actions";
import { SupportSection } from "@jiezhu/components/support-section";
import { UnderstandingSteps } from "@jiezhu/components/understanding-steps";
import {
  companionMessage,
  microActions,
  refinedActions,
  supportResponses,
} from "@jiezhu/data/mock-data";
import {
  initialSessionState,
  sessionReducer,
} from "@jiezhu/features/support-session/session-reducer";

export function SupportFlow() {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);

  useEffect(() => {
    if (state.screen !== "understanding") return;

    const timers = [
      window.setTimeout(
        () => dispatch({ type: "ADVANCE_UNDERSTANDING" }),
        500,
      ),
      window.setTimeout(
        () => dispatch({ type: "ADVANCE_UNDERSTANDING" }),
        1000,
      ),
      window.setTimeout(
        () => dispatch({ type: "ADVANCE_UNDERSTANDING" }),
        1500,
      ),
      window.setTimeout(() => dispatch({ type: "SHOW_RESPONSE" }), 2100),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [state.screen]);

  const showContext = !["input", "understanding"].includes(state.screen);

  return (
    <div className="app-shell">
      <AppHeader onRestart={() => dispatch({ type: "RESTART" })} />
      <main className="main-content">
        {state.screen === "input" && (
          <section className="page-panel input-page">
            <IllustrationSlot />
            <div className="page-heading">
              <span className="eyebrow">先从此刻开始</span>
              <h1>现在是什么让你有点撑不住？</h1>
              <p>不用整理好再说。这里没有标准答案。</p>
            </div>
            <EmotionSelector
              selected={state.emotion}
              onSelect={(value) => dispatch({ type: "SET_EMOTION", value })}
            />
            <EmotionInput
              value={state.input}
              onChange={(value) => dispatch({ type: "SET_INPUT", value })}
            />
            <button
              className="button primary full-width"
              type="button"
              disabled={!state.input.trim()}
              onClick={() => dispatch({ type: "SUBMIT" })}
            >
              让接住听听
            </button>
          </section>
        )}

        {state.screen === "understanding" && (
          <section className="page-panel understanding-page">
            <div className="page-heading">
              <span className="eyebrow">正在理解</span>
              <h1>我在听，也在慢慢理清。</h1>
            </div>
            <UnderstandingSteps activeIndex={state.understandingIndex} />
            <p className="understanding-note">
              我不会急着让你振作或列一张计划。
            </p>
          </section>
        )}

        {state.screen === "response" && (
          <section className="page-panel response-page">
            <div className="page-heading compact">
              <span className="eyebrow">先接住情绪</span>
              <h1>让我确认一下，我有没有听懂。</h1>
            </div>
            <SupportSection response={supportResponses[state.responseIndex]} />
            {state.companionVisible && (
              <p className="companion-message" role="status">
                {companionMessage}
              </p>
            )}
            <ResponseActions
              confirmed={state.confirmed}
              showCorrection={state.showCorrection}
              correction={state.correction}
              onConfirm={() => dispatch({ type: "CONFIRM_RESPONSE" })}
              onCorrectionOpen={() => dispatch({ type: "OPEN_CORRECTION" })}
              onCorrectionChange={(value) =>
                dispatch({ type: "SET_CORRECTION", value })
              }
              onCorrectionSubmit={() =>
                dispatch({ type: "SUBMIT_CORRECTION" })
              }
              onCompanion={() => dispatch({ type: "SHOW_COMPANION" })}
              onAction={() => dispatch({ type: "SHOW_ACTION" })}
            />
          </section>
        )}

        {state.screen === "action" && (
          <div className="page-panel">
            <MicroActionCard
              action={microActions[state.actionIndex]}
              started={state.actionStarted}
              completed={false}
              onStart={() => dispatch({ type: "START_ACTION" })}
              onComplete={() => dispatch({ type: "COMPLETE_ACTION" })}
              onTooHard={() => dispatch({ type: "SHOW_REFINE" })}
              onReplace={() =>
                dispatch({ type: "REPLACE_ACTION", count: microActions.length })
              }
              onPause={() => dispatch({ type: "PAUSE", from: "action" })}
            />
          </div>
        )}

        {state.screen === "refine" && (
          <div className="page-panel">
            <RefineActionCard
              originalAction={microActions[state.actionIndex].text}
              currentAction={refinedActions[state.refineIndex]}
              atMinimum={state.refineIndex === refinedActions.length - 1}
              onTry={() => dispatch({ type: "SHOW_ACTION" })}
              onRefine={() =>
                dispatch({ type: "REFINE_MORE", count: refinedActions.length })
              }
              onPause={() => dispatch({ type: "PAUSE", from: "refine" })}
            />
          </div>
        )}

        {state.screen === "completed" && (
          <section className="page-panel state-card">
            <span className="state-icon" aria-hidden="true">✓</span>
            <h1>这一步完成了。</h1>
            <p>不用顺势做更多。你已经让自己重新动了一小步。</p>
            <button
              className="button primary"
              type="button"
              onClick={() => dispatch({ type: "RESTART" })}
            >
              回到开始
            </button>
          </section>
        )}

        {state.screen === "paused" && (
          <div className="page-panel">
            <PauseMessage
              onResume={() => dispatch({ type: "RESUME" })}
              onRestart={() => dispatch({ type: "RESTART" })}
            />
          </div>
        )}

        {showContext && (
          <ContextDrawer emotion={state.emotion} input={state.input} />
        )}
      </main>
    </div>
  );
}

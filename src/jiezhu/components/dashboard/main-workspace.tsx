"use client";

import { useEffect, useState } from "react";
import { listeningCopy, workspaceActions } from "@jiezhu/data/dashboard-config";
import { analyzeEmotion, generateEmotionAdvice } from "@jiezhu/lib/emotion-support";
import { splitTaskWithAi } from "@jiezhu/lib/plan-from-natural-language";
import type { EmotionRecord, TodoItem, WorkspaceMode } from "@jiezhu/types/dashboard";

type Props = {
  mode: WorkspaceMode;
  setMode: (mode: WorkspaceMode) => void;
  activeEmotion: EmotionRecord | null;
  onUpdateEmotion: (record: EmotionRecord) => void;
  onAddTodo: (todo: TodoItem) => void;
  splitTarget: TodoItem | null;
  initialSplitTasks: string[] | null;
  initialSecondarySplits: Record<string, string[]>;
  initialSelectedSplit: string | null;
  planDraft: TodoItem[];
  onConfirmPlan: () => void;
  onClearPlan: () => void;
  onReplan: (adjustment: string) => Promise<void>;
  onStartAdviceSplit: (todo: TodoItem) => void;
  onSaveSplitDetails: (title: string, tasks: string[], secondary: Record<string, string[]>, selected: string | null) => void;
};

export function MainWorkspace({ mode, setMode, activeEmotion, onUpdateEmotion, onAddTodo, splitTarget, initialSplitTasks, initialSecondarySplits, initialSelectedSplit, planDraft, onConfirmPlan, onClearPlan, onReplan, onStartAdviceSplit, onSaveSplitDetails }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typedAnalysis, setTypedAnalysis] = useState(["", "", ""]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisRound, setAnalysisRound] = useState(0);
  const [analysisFeedback, setAnalysisFeedback] = useState("");
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [aiError, setAiError] = useState("");
  const [advice, setAdvice] = useState<string[]>([]);
  const [typedAdvice, setTypedAdvice] = useState(["", ""]);
  const [adviceComplete, setAdviceComplete] = useState(false);
  const [adviceRound, setAdviceRound] = useState(0);
  const [showAdviceAdjustment, setShowAdviceAdjustment] = useState(false);
  const [adviceAdjustment, setAdviceAdjustment] = useState("");
  const [correction, setCorrection] = useState("");
  const [planAdjustment, setPlanAdjustment] = useState("");
  const [isReplanning, setIsReplanning] = useState(false);
  const [planAdjustmentError, setPlanAdjustmentError] = useState("");
  const [splitLoading, setSplitLoading] = useState(false);
  const [splitError, setSplitError] = useState("");
  const [split, setSplit] = useState<string[]>([]);
  const [splitOwnerId, setSplitOwnerId] = useState<string | null>(null);
  const [secondarySplits, setSecondarySplits] = useState<Record<string, string[]>>({});
  const [selectedSplit, setSelectedSplit] = useState<string | null>(null);
  const [splitContextMenu, setSplitContextMenu] = useState<{ item: string; x: number; y: number } | null>(null);
  const [completedSplits, setCompletedSplits] = useState<Set<string>>(() => new Set());
  const [addedSplitSignature, setAddedSplitSignature] = useState("");
  const [addedAdviceTodo, setAddedAdviceTodo] = useState<TodoItem | null>(null);
  const currentAnalysisCopy = analysis;
  const analysisOutputComplete = analysisComplete
    && currentAnalysisCopy.length === 3
    && visibleCount === currentAnalysisCopy.length
    && currentAnalysisCopy.every((text, index) => typedAnalysis[index] === text);
  useEffect(() => {
    if (mode !== "listening" || !activeEmotion) return;
    let cancelled = false;
    setAiError("");
    void analyzeEmotion(activeEmotion, analysisFeedback || undefined)
      .then((result) => {
        if (cancelled) return;
        const next = {
          ...activeEmotion,
          analysisStatus: "completed" as const,
          analysisResult: result,
          analysisFeedback: analysisFeedback
            ? [...activeEmotion.analysisFeedback, analysisFeedback]
            : activeEmotion.analysisFeedback,
        };
        setAnalysis([result.heard, result.core, result.comfort]);
        onUpdateEmotion(next);
        setAnalysisFeedback("");
        setMode("analysis");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setAiError(error instanceof Error ? error.message : "咪暂时没能完成分析。");
        onUpdateEmotion({ ...activeEmotion, analysisStatus: "failed" });
      });
    return () => {
      cancelled = true;
    };
  }, [activeEmotion?.id, analysisRound, mode]);

  useEffect(() => {
    if (!splitTarget) return;
    let cancelled = false;
    setSplitLoading(true);
    setSplitError("");
    setSelectedSplit(initialSelectedSplit);
    setSecondarySplits(initialSecondarySplits);
    setCompletedSplits(new Set());
    if (initialSplitTasks !== null) {
      setSplit(initialSplitTasks);
      setSplitOwnerId(splitTarget.id);
      setSplitLoading(false);
      return;
    }
    void splitTaskWithAi(splitTarget.title)
      .then((tasks) => {
        if (!cancelled) {
          setSplit(tasks);
          setSplitOwnerId(splitTarget.id);
          onSaveSplitDetails(splitTarget.title, tasks, {}, null);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setSplitError(error instanceof Error ? error.message : "咪暂时没能拆解这个任务。");
      })
      .finally(() => {
        if (!cancelled) setSplitLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialSecondarySplits, initialSelectedSplit, initialSplitTasks, splitTarget]);

  useEffect(() => {
    if (!splitContextMenu) return;
    const dismissContextMenu = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".split-context-menu")) return;
      setSplitContextMenu(null);
    };
    window.addEventListener("pointerdown", dismissContextMenu);
    return () => window.removeEventListener("pointerdown", dismissContextMenu);
  }, [splitContextMenu]);

  useEffect(() => {
    setVisibleCount(0);
    setTypedAnalysis(["", "", ""]);
    setAnalysisComplete(false);
    setTypedAdvice(["", ""]);
    setAdviceComplete(false);
    if (mode === "listening") {
      const timers = listeningCopy.map((_, i) => window.setTimeout(() => setVisibleCount(i + 1), (i + 1) * 450));
      return () => timers.forEach(window.clearTimeout);
    }
    if (mode === "analysis") {
      const timers: number[] = [];
      let frameIndex = 0;
      let charIndex = 0;
      const schedule = (callback: () => void, delay: number) => {
        timers.push(window.setTimeout(callback, delay));
      };
      const typeNextCharacter = () => {
        if (frameIndex >= currentAnalysisCopy.length) {
          setAnalysisComplete(true);
          return;
        }
        if (charIndex === 0) setVisibleCount(frameIndex + 1);
        charIndex += 1;
        const currentFrame = frameIndex;
        const currentLength = charIndex;
        setTypedAnalysis((items) => items.map((item, index) => (
          index === currentFrame ? currentAnalysisCopy[currentFrame].slice(0, currentLength) : item
        )));
        if (charIndex < currentAnalysisCopy[frameIndex].length) {
          schedule(typeNextCharacter, 38);
        } else {
          frameIndex += 1;
          charIndex = 0;
          schedule(typeNextCharacter, 520);
        }
      };
      schedule(typeNextCharacter, 260);
      return () => timers.forEach(window.clearTimeout);
    }
    if (mode === "advice") {
      const timers: number[] = [];
      let frameIndex = 0;
      let charIndex = 0;
      const typeNextCharacter = () => {
        if (frameIndex >= advice.length) {
          setAdviceComplete(true);
          return;
        }
        if (charIndex === 0) setVisibleCount(frameIndex + 1);
        charIndex += 1;
        const currentFrame = frameIndex;
        const currentLength = charIndex;
        setTypedAdvice((items) => items.map((item, index) => (
          index === currentFrame ? advice[currentFrame].slice(0, currentLength) : item
        )));
        if (charIndex < advice[frameIndex].length) {
          timers.push(window.setTimeout(typeNextCharacter, 38));
        } else {
          frameIndex += 1;
          charIndex = 0;
          timers.push(window.setTimeout(typeNextCharacter, 520));
        }
      };
      timers.push(window.setTimeout(typeNextCharacter, 260));
      return () => timers.forEach(window.clearTimeout);
    }
    if (mode === "empty") {
      const timer = window.setTimeout(() => setMode("initial"), 20000);
      return () => window.clearTimeout(timer);
    }
  }, [mode, setMode, analysisRound, adviceRound]);

  const requestAdvice = async (adjustment?: string) => {
    if (!activeEmotion?.analysisResult) return;
    setAiError("");
    setMode("adviceLoading");
    try {
      const result = await generateEmotionAdvice(activeEmotion, adjustment);
      const next = {
        ...activeEmotion,
        adviceResult: result,
        adviceAdjustments: adjustment
          ? [...activeEmotion.adviceAdjustments, adjustment]
          : activeEmotion.adviceAdjustments,
      };
      onUpdateEmotion(next);
      setAdvice([result.suggestion, result.firstStep]);
      setAdviceRound((round) => round + 1);
      setMode("advice");
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "咪暂时没能生成建议。");
    }
  };

  const regenerateAdvice = () => {
    const adjustment = adviceAdjustment.trim();
    if (!adjustment) return;
    setAdviceAdjustment("");
    setShowAdviceAdjustment(false);
    void requestAdvice(adjustment);
  };

  const addPlan = () => {
    const title = advice[0] || "整理一条岗位要求";
    const todo: TodoItem = {
      id: crypto.randomUUID(),
      title,
      description: advice.join("\n"),
      source: "ai",
      status: "pending",
      createdAt: new Date().toISOString(),
      depth: 0,
      archived: true,
    };
    onAddTodo(todo);
    setAddedAdviceTodo(todo);
    setMode("planAdded");
  };

  const startAdviceSplit = () => {
    if (!addedAdviceTodo) return;
    setSplit([]);
    setSplitOwnerId(null);
    setSecondarySplits({});
    setSelectedSplit(null);
    setCompletedSplits(new Set());
    setSplitError("");
    setSplitLoading(true);
    onStartAdviceSplit(addedAdviceTodo);
    setMode("splitLevel1");
  };

  const replan = async () => {
    const adjustment = planAdjustment.trim();
    if (!adjustment || isReplanning) return;
    setIsReplanning(true);
    setPlanAdjustmentError("");
    try {
      await onReplan(adjustment);
      setPlanAdjustment("");
    } catch (error) {
      setPlanAdjustmentError(error instanceof Error ? error.message : "咪暂时没能重新安排。");
    } finally {
      setIsReplanning(false);
    }
  };

  const openSecondarySplit = async (item: string, regenerate = false) => {
    setSelectedSplit(item);
    setMode("splitLevel2");
    if (secondarySplits[item] && !regenerate) {
      onSaveSplitDetails(splitTarget?.title || advice[0], split, secondarySplits, item);
    }
    if (!secondarySplits[item] || regenerate) {
      setSplitLoading(true);
      setSplitError("");
      try {
        const tasks = await splitTaskWithAi(item, splitTarget?.title);
        const nextSecondary = { ...secondarySplits, [item]: tasks };
        setSecondarySplits(nextSecondary);
        onSaveSplitDetails(splitTarget?.title || advice[0], split, nextSecondary, item);
      } catch (error) {
        setSplitError(error instanceof Error ? error.message : "咪暂时没能继续拆解。");
        return;
      } finally {
        setSplitLoading(false);
      }
    }
  };

  const regeneratePrimarySplit = async () => {
    const target = splitTarget?.title || advice[0];
    setSplitLoading(true);
    setSplitError("");
    try {
      const tasks = await splitTaskWithAi(target);
      setSplit(tasks);
      setSplitOwnerId(splitTarget?.id || null);
      setSecondarySplits({});
      setSelectedSplit(null);
      onSaveSplitDetails(target, tasks, {}, null);
    } catch (error) {
      setSplitError(error instanceof Error ? error.message : "咪暂时没能重新拆解。");
    } finally {
      setSplitLoading(false);
    }
  };

  const archiveSplit = (_level: 1 | 2) => {
    // 阶段一仅保留归档接口，待确定保存位置后接入。
  };

  const addPrimarySplitToPlan = () => {
    const title = splitTarget?.title || advice[0];
    const currentSplit = splitOwnerId === splitTarget?.id ? split : [];
    const signature = `${title}\n${currentSplit.join("\n")}`;
    const splitPlanId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    currentSplit.forEach((task) => {
      onAddTodo({
        id: crypto.randomUUID(),
        title: task,
        description: `来自拆解：${title}`,
        source: "split",
        status: "pending",
        createdAt,
        parentTaskId: splitPlanId,
        splitPlanTitle: title,
        splitTasks: currentSplit,
        secondarySplits,
        selectedSplit: selectedSplit || undefined,
        depth: 0,
        archived: true,
      });
    });
    setAddedSplitSignature(signature);
  };

  const visibleSplit = splitOwnerId === splitTarget?.id ? split : [];

  const toggleSplitCompleted = (key: string) => {
    setCompletedSplits((items) => {
      const next = new Set(items);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section className={`main-workspace mode-${mode}`}>
      <div className="workspace-surface">
        <img className="workspace-home-background" src="/ui/workspace-home-background.png" alt="" />
        {mode === "initial" && (
          <img className="workspace-home-cat" src="/ui/workspace-home-cat.png" alt="" />
        )}
        {mode !== "initial" && (
          <button
            type="button"
            className="workspace-home-button"
            onClick={() => {
              setAiError("");
              setMode("initial");
            }}
          >
            返回工作区首页
          </button>
        )}
        <div className="workspace-content">
          {mode === "initial" && <div className="workspace-intro"><button onClick={() => setMode("actionSelection")} aria-label="看看咪能做什么">人,这里是咪的主要工作区哦</button></div>}
          {mode === "listening" && <div className="listening-copy"><h2>咪咪加急办理中</h2>{listeningCopy.slice(0, visibleCount).map((text) => <p key={text}>✓ {text}</p>)}{aiError && <><p role="alert">{aiError}</p><button onClick={() => setAnalysisRound((round) => round + 1)}>再试一次</button></>}</div>}
          {mode === "analysis" && <div className="analysis-stack">
            {currentAnalysisCopy.slice(0, visibleCount).map((text, index) => <article className={`cat-frame frame-${index + 1}`} key={`${analysisRound}-${index}`}><p>{typedAnalysis[index]}{!analysisComplete && index === visibleCount - 1 && <span className="typing-cursor" aria-hidden="true" />}</p><img src={`/ui/workspace-analysis-cat-${index + 1}.png`} alt="" /></article>)}
            {analysisOutputComplete && <div className="feedback"><span>人，咪说得对吗？</span><button onClick={() => setMode("actionSelection")}>对</button><button onClick={() => setMode("actionSelection")}>差不多</button><button onClick={() => document.getElementById("correction")?.focus()}>不对</button><input id="correction" aria-label="需要咪调整的地方" placeholder="写下需要调整的地方，按 Enter" value={correction} onChange={(e) => setCorrection(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && correction.trim()) { setAnalysisFeedback(correction.trim()); setCorrection(""); setMode("listening"); setAnalysisRound((round) => round + 1); } }} /></div>}
          </div>}
          {mode === "actionSelection" && <div className="workspace-actions"><h2>人想要咪做些什么捏？</h2><div>{workspaceActions.map((action, index) => <button key={action.id} onClick={() => action.enabled && void requestAdvice()} aria-disabled={!action.enabled}><img className="action-image" src={`/ui/workspace-action-${index + 1}.png`} alt="" /><b>{action.label}</b></button>)}</div></div>}
          {mode === "adviceLoading" && <div className="listening-copy"><h2>咪正在认真想一个适合人的建议</h2>{aiError && <><p role="alert">{aiError}</p><button onClick={() => void requestAdvice()}>再试一次</button></>}</div>}
          {mode === "advice" && <div className="analysis-stack advice-stack">
            {advice.slice(0, visibleCount).map((text, index) => <article className={`cat-frame frame-${index + 1}`} key={`${adviceRound}-${index}`}><p>{typedAdvice[index]}{!adviceComplete && index === visibleCount - 1 && <span className="typing-cursor" aria-hidden="true" />}</p><img src={`/ui/workspace-analysis-cat-${index + 1}.png`} alt="" /></article>)}
            {adviceComplete && <div className="advice-actions"><span>人觉得咪的建议怎么样？</span><button onClick={addPlan}>加到计划里吧</button><button onClick={() => setShowAdviceAdjustment(true)}>调整</button>{showAdviceAdjustment && <div className="advice-adjustment"><input autoFocus aria-label="告诉咪需要怎样调整建议" placeholder="告诉咪哪里不合适…" value={adviceAdjustment} onChange={(event) => setAdviceAdjustment(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") regenerateAdvice(); }} /><button onClick={regenerateAdvice} disabled={!adviceAdjustment.trim()} aria-label="发送调整内容">➤</button></div>}</div>}
          </div>}
          {mode === "planAdded" && <div className="plan-added"><h2>已经放进今天的计划啦</h2><p>需要咪把它继续拆小一点吗？</p><div className="plan-added-actions"><button onClick={() => setMode("initial")}>不需要</button><button onClick={startAdviceSplit} disabled={!addedAdviceTodo}>需要</button></div></div>}
          {mode === "planReview" && <div className="split-workspace plan-review-split">
            <section className="split-column split-primary">
              <h2>人，你觉得咪的安排怎么样？</h2>
              <div className="split-list">
                {planDraft.map((todo) => {
                  const key = `plan-review:${todo.id}`;
                  return <div className={`split-task ${completedSplits.has(key) ? "completed" : ""}`} key={todo.id}>
                    <button className="split-check" onClick={() => toggleSplitCompleted(key)} aria-label={completedSplits.has(key) ? `取消选择：${todo.title}` : `选择：${todo.title}`}>{completedSplits.has(key) ? "✓" : ""}</button>
                    <div className="split-task-content"><b>{todo.title}</b></div>
                  </div>;
                })}
              </div>
              <div className="plan-review-controls">
                <div className="plan-review-action-row">
                  <button type="button" onClick={() => document.getElementById("plan-adjustment")?.focus()}>重新安排</button>
                  <button type="button" onClick={onConfirmPlan}>加入计划</button>
                  <button type="button" onClick={onClearPlan}>清除</button>
                  <div className="plan-review-adjustment">
                    <input id="plan-adjustment" value={planAdjustment} onChange={(event) => setPlanAdjustment(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void replan(); }} placeholder="告诉咪应该怎么调整计划…" />
                    <button type="button" onClick={() => void replan()} disabled={!planAdjustment.trim() || isReplanning} aria-label="发送调整要求">{isReplanning ? "…" : "➤"}</button>
                  </div>
                </div>
                {planAdjustmentError && <p className="plan-review-error" role="alert">{planAdjustmentError}</p>}
              </div>
            </section>
            <aside className="split-cat-panel"><p>人要是觉得哪里不合适<br />咪还可以继续调整哦</p><img src="/ui/workspace-split-cat.png" alt="" /></aside>
          </div>}
          {(mode === "splitLevel1" || mode === "splitLevel2") && <div className={`split-workspace ${mode === "splitLevel2" ? "has-secondary" : ""}`}>
            <section className="split-column split-primary">
              <h2>{splitTarget?.title || advice[0]}</h2>
              <div className="split-list">{splitLoading && mode === "splitLevel1" && <p className="split-loading">咪正在认真拆解任务……</p>}{splitError && mode === "splitLevel1" && <p className="split-error">{splitError}</p>}{(mode === "splitLevel2" || !splitLoading) && visibleSplit.map((item) => <div className={`split-task ${selectedSplit === item ? "selected" : ""} ${completedSplits.has(`primary:${item}`) ? "completed" : ""}`} key={item} onContextMenu={(event) => { event.preventDefault(); setSplitContextMenu({ item, x: event.clientX, y: event.clientY }); }}><button className="split-check" onClick={() => toggleSplitCompleted(`primary:${item}`)} aria-label={completedSplits.has(`primary:${item}`) ? `取消完成：${item}` : `完成：${item}`}>{completedSplits.has(`primary:${item}`) ? "✓" : ""}</button><button className="split-task-content" onClick={() => secondarySplits[item] && void openSecondarySplit(item)}><b>{item}</b>{secondarySplits[item] && <small className={`split-status-arrow ${selectedSplit === item && mode === "splitLevel2" ? "points-right" : "points-up"}`} aria-hidden="true" />}</button></div>)}</div>
              <div className="split-actions"><button onClick={() => void regeneratePrimarySplit()} disabled={splitLoading}>重新生成</button><button onClick={() => archiveSplit(1)}>归档</button><button onClick={() => { onSaveSplitDetails(splitTarget?.title || advice[0], visibleSplit, {}, null); setSplit([]); setSplitOwnerId(splitTarget?.id || null); setSecondarySplits({}); setSelectedSplit(null); setMode("empty"); }}>清除</button><button onClick={addPrimarySplitToPlan} disabled={splitLoading || !visibleSplit.length || addedSplitSignature === `${splitTarget?.title || advice[0]}\n${visibleSplit.join("\n")}`}>{addedSplitSignature === `${splitTarget?.title || advice[0]}\n${visibleSplit.join("\n")}` ? "已加入" : "加入计划"}</button></div>
            </section>
            {mode === "splitLevel1" && <aside className="split-cat-panel"><p>人要是还觉得困难<br />咪还可以帮人继续拆哦</p><img src="/ui/workspace-split-cat.png" alt="" /></aside>}
            {mode === "splitLevel2" && selectedSplit && <section className="split-column split-secondary">
              <h2>{selectedSplit}</h2>
              <div className="split-list">{splitLoading && <p className="split-loading">咪正在继续拆解任务……</p>}{splitError && <p className="split-error">{splitError}</p>}{!splitLoading && (secondarySplits[selectedSplit] || []).map((item) => { const key = `secondary:${selectedSplit}:${item}`; return <div className={`split-task ${completedSplits.has(key) ? "completed" : ""}`} key={item}><button className="split-check" onClick={() => toggleSplitCompleted(key)} aria-label={completedSplits.has(key) ? `取消完成：${item}` : `完成：${item}`}>{completedSplits.has(key) ? "✓" : ""}</button><div className="split-task-content"><b>{item}</b></div></div>; })}</div>
              <div className="split-actions"><button onClick={() => void openSecondarySplit(selectedSplit, true)} disabled={splitLoading}>重新生成</button><button onClick={() => archiveSplit(2)}>归档</button><button onClick={() => { const next = { ...secondarySplits }; delete next[selectedSplit]; onSaveSplitDetails(splitTarget?.title || advice[0], split, next, null); setSecondarySplits(next); setSelectedSplit(null); setMode("splitLevel1"); }}>清除</button></div>
            </section>}
            {splitContextMenu && <div className="split-context-menu" style={{ left: splitContextMenu.x, top: splitContextMenu.y }}><button onClick={() => { void openSecondarySplit(splitContextMenu.item); setSplitContextMenu(null); }}>继续拆解</button></div>}
          </div>}
        </div>
      </div>
      <img className="workspace-home-title" src="/ui/workspace-home-title.png" alt="" />
    </section>
  );
}

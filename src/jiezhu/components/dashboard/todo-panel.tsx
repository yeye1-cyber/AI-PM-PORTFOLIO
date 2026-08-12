"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TodoItem } from "@jiezhu/types/dashboard";

type Props = {
  todos: TodoItem[];
  onChange: (todos: TodoItem[]) => void;
  onOpen: (todo: TodoItem) => void;
  onSplit: (todo: TodoItem) => void;
  onPlanRequest: (input: string) => Promise<void>;
};

export function TodoPanel({ todos, onChange, onOpen, onSplit, onPlanRequest }: Props) {
  const [draft, setDraft] = useState("");
  const [planPrompt, setPlanPrompt] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);
  const [planError, setPlanError] = useState("");
  const [contextMenu, setContextMenu] = useState<{ todo: TodoItem; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const dismiss = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".todo-context-menu")) return;
      setContextMenu(null);
    };
    window.addEventListener("pointerdown", dismiss);
    return () => window.removeEventListener("pointerdown", dismiss);
  }, [contextMenu]);

  const add = () => {
    if (!draft.trim()) return;
    onChange([...todos, { id: crypto.randomUUID(), title: draft.trim(), description: "", source: "manual", status: "pending", createdAt: new Date().toISOString(), depth: 0, archived: true }]);
    setDraft("");
  };

  const requestPlan = async () => {
    const input = planPrompt.trim();
    if (!input || isPlanning) return;
    setIsPlanning(true);
    setPlanError("");
    try {
      await onPlanRequest(input);
      setPlanPrompt("");
    } catch (error) {
      setPlanError(error instanceof Error ? error.message : "咪暂时没能安排计划。");
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <section className="cozy-panel todo-panel">
      <div className="todo-title"><h2>今日计划</h2><span>{todos.filter((t) => t.status === "completed").length}/{todos.length} 完成</span></div>
      <div className="todo-list">
        {todos.map((todo) => (
          <div className="todo-item" key={todo.id} onContextMenu={(event) => {
            event.preventDefault();
            setContextMenu({ todo, x: event.clientX, y: event.clientY });
          }}>
            <button className={`todo-check ${todo.status}`} onClick={() => onChange(todos.map((item) => item.id === todo.id ? { ...item, status: item.status === "completed" ? "pending" : "completed", completedAt: item.status === "pending" ? new Date().toISOString() : undefined } : item))}>✓</button>
            <button className="todo-content" onClick={() => onOpen(todo)}>{todo.title}</button>
            <button className="todo-delete" onClick={() => onChange(todos.filter((item) => item.id !== todo.id))}>×</button>
          </div>
        ))}
        {!todos.length && <p className="empty-copy">今天还没有计划，慢慢来。</p>}
      </div>
      <div className="todo-planner">
        <textarea
          value={planPrompt}
          placeholder="人，你也可以告诉咪，咪来帮你安排哦"
          aria-label="告诉咪你想安排的事情"
          onChange={(event) => setPlanPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void requestPlan();
            }
          }}
        />
        <button
          type="button"
          aria-label="发送给计划助手"
          disabled={!planPrompt.trim() || isPlanning}
          onClick={() => void requestPlan()}
        >
          {isPlanning ? "…" : "↑"}
        </button>
        <img src="/ui/todo-cat.png" alt="" aria-hidden="true" />
      </div>
      {planError && <p className="todo-plan-error" role="alert">{planError}</p>}
      <div className="todo-add"><input value={draft} placeholder="新增一件小事" onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} /><button onClick={add}>＋</button></div>
      {contextMenu && createPortal(
        <div className="todo-context-menu" style={{ left: contextMenu.x, top: contextMenu.y }}>
          <button type="button" onClick={() => {
            onSplit(contextMenu.todo);
            setContextMenu(null);
          }}>
            拆解
          </button>
        </div>,
        document.body,
      )}
    </section>
  );
}

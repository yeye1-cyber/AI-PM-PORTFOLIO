"use client";

import { useEffect, useState } from "react";
import { BottomToolbar } from "@jiezhu/components/dashboard/bottom-toolbar";
import { CalendarPanel } from "@jiezhu/components/dashboard/calendar-panel";
import { CatKnowledgePage } from "@jiezhu/components/dashboard/cat-knowledge-page";
import { ChatPanel } from "@jiezhu/components/dashboard/chat-panel";
import { ConnectKnowledgeDialog } from "@jiezhu/components/dashboard/connect-knowledge-dialog";
import { EmotionPanel } from "@jiezhu/components/dashboard/emotion-panel";
import { HumanKnowledgePage } from "@jiezhu/components/dashboard/human-knowledge-page";
import { MainWorkspace } from "@jiezhu/components/dashboard/main-workspace";
import { MusicPlayerPanel } from "@jiezhu/components/dashboard/music-player-panel";
import { SideNavigation } from "@jiezhu/components/dashboard/side-navigation";
import { TodoPanel } from "@jiezhu/components/dashboard/todo-panel";
import { WelcomePanel } from "@jiezhu/components/dashboard/welcome-panel";
import { readLocal, writeLocal } from "@jiezhu/lib/local-store";
import { planFromNaturalLanguage } from "@jiezhu/lib/plan-from-natural-language";
import {
  chooseKnowledgeFolder,
  getDirectoryHandle,
  removeDirectoryHandle,
  saveDirectoryHandle,
  scanKnowledgeFolder,
  type KnowledgeVault,
} from "@jiezhu/features/knowledge/obsidian-folder";
import type { EmotionRecord, TodoItem, WorkspaceMode } from "@jiezhu/types/dashboard";

export function CozyDashboard({ demoMode = false }: { demoMode?: boolean }) {
  const [activePage, setActivePage] = useState<"home" | "cat" | "human">("home");
  const [mode, setMode] = useState<WorkspaceMode>("initial");
  const [activeEmotion, setActiveEmotion] = useState<EmotionRecord | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [planDraft, setPlanDraft] = useState<TodoItem[]>([]);
  const [planSourcePrompt, setPlanSourcePrompt] = useState("");
  const [splitTarget, setSplitTarget] = useState<TodoItem | null>(null);
  const [initialSplitTasks, setInitialSplitTasks] = useState<string[] | null>(null);
  const [initialSecondarySplits, setInitialSecondarySplits] = useState<Record<string, string[]>>({});
  const [initialSelectedSplit, setInitialSelectedSplit] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [knowledgeVaults, setKnowledgeVaults] = useState<KnowledgeVault[]>([]);
  const [knowledgeDialogOpen, setKnowledgeDialogOpen] = useState(false);
  const [knowledgeError, setKnowledgeError] = useState("");
  const [knowledgeBusy, setKnowledgeBusy] = useState(false);
  const [busyVaultId, setBusyVaultId] = useState<string | null>(null);
  useEffect(() => {
    setTodos(readLocal("todos", []));
    setKnowledgeVaults(readLocal("knowledgeVaults", []));
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const changeTodos = (next: TodoItem[]) => {
    writeLocal("todos", next);
    setTodos(next);
  };

  const addTodo = (todo: TodoItem) => {
    setTodos((items) => {
      const next = [...items, todo];
      writeLocal("todos", next);
      return next;
    });
  };

  const saveKnowledgeVaults = (next: KnowledgeVault[]) => {
    writeLocal("knowledgeVaults", next);
    setKnowledgeVaults(next);
  };

  const connectKnowledgeFolder = async () => {
    setKnowledgeError("");
    setKnowledgeBusy(true);
    try {
      const handle = await chooseKnowledgeFolder();
      let existing: KnowledgeVault | undefined;
      for (const vault of knowledgeVaults) {
        const savedHandle = await getDirectoryHandle(vault.id);
        if (savedHandle && await handle.isSameEntry(savedHandle)) {
          existing = vault;
          break;
        }
      }
      const id = existing?.id || crypto.randomUUID();
      const scanned = await scanKnowledgeFolder(id, handle);
      await saveDirectoryHandle(id, handle);
      saveKnowledgeVaults(existing
        ? knowledgeVaults.map((vault) => vault.id === id ? scanned : vault)
        : [...knowledgeVaults, scanned]);
      setKnowledgeDialogOpen(false);
      setActivePage("human");
      setNotice(`已连接“${scanned.name}”，找到 ${scanned.noteCount} 篇笔记`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setKnowledgeError(error instanceof Error ? error.message : "知识库连接失败，请重试。");
    } finally {
      setKnowledgeBusy(false);
    }
  };

  const refreshKnowledgeFolder = async (vault: KnowledgeVault) => {
    setBusyVaultId(vault.id);
    try {
      const handle = await getDirectoryHandle(vault.id);
      if (!handle) throw new Error("没有找到原文件夹授权，请重新连接。");
      const scanned = await scanKnowledgeFolder(vault.id, handle);
      saveKnowledgeVaults(knowledgeVaults.map((item) => item.id === vault.id ? scanned : item));
      setNotice(`“${vault.name}”目录已刷新`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "刷新失败，请重新连接。");
    } finally {
      setBusyVaultId(null);
    }
  };

  const disconnectKnowledgeFolder = async (vault: KnowledgeVault) => {
    await removeDirectoryHandle(vault.id);
    saveKnowledgeVaults(knowledgeVaults.filter((item) => item.id !== vault.id));
    setNotice(`已取消连接“${vault.name}”，本地文件未被修改`);
  };

  return (
    <main className="cozy-app">
      {demoMode && <div className="demo-mode-badge">作品集演示 · 预设内容</div>}
      <SideNavigation activeNavigation={activePage} onNavigate={setActivePage} />
      <div className="dashboard-stage">
        {activePage === "home" ? <div className="dashboard-grid">
          <WelcomePanel />
          <CalendarPanel />
          <EmotionPanel onSubmit={(tags, text) => {
            const record: EmotionRecord = {
              id: crypto.randomUUID(),
              selectedTags: tags,
              text: text.trim(),
              createdAt: new Date().toISOString(),
              analysisStatus: "pending",
              analysisResult: null,
              analysisFeedback: [],
              adviceResult: null,
              adviceAdjustments: [],
            };
            const records = readLocal<EmotionRecord[]>("emotions", []);
            writeLocal("emotions", [...records, record]);
            setActiveEmotion(record);
            setMode("listening");
          }} />
          <MusicPlayerPanel onNotice={setNotice} />
          <ChatPanel />
          <MainWorkspace
            mode={mode}
            setMode={setMode}
            activeEmotion={activeEmotion}
            onUpdateEmotion={(next) => {
              setActiveEmotion(next);
              const records = readLocal<EmotionRecord[]>("emotions", []);
              writeLocal("emotions", records.map((item) => item.id === next.id ? next : item));
            }}
            splitTarget={splitTarget}
            initialSplitTasks={initialSplitTasks}
            initialSecondarySplits={initialSecondarySplits}
            initialSelectedSplit={initialSelectedSplit}
            planDraft={planDraft}
            onAddTodo={addTodo}
            onSaveSplitDetails={(title, tasks, secondary, selected) => {
              setTodos((items) => {
                const next = items.map((todo) => (
                  todo.id === splitTarget?.id
                  || (
                    todo.splitPlanTitle === title
                    && todo.splitTasks?.length === tasks.length
                    && todo.splitTasks.every((task, index) => task === tasks[index])
                  )
                    ? { ...todo, secondarySplits: secondary, selectedSplit: selected || undefined }
                    : todo
                ));
                const withPrimarySplit = next.map((todo) => (
                  todo.id === splitTarget?.id
                    ? { ...todo, splitPlanTitle: title, splitTasks: tasks }
                    : todo
                ));
                writeLocal("todos", withPrimarySplit);
                return withPrimarySplit;
              });
            }}
            onConfirmPlan={() => {
              changeTodos([...todos, ...planDraft]);
              setPlanDraft([]);
              setPlanSourcePrompt("");
              setMode("initial");
            }}
            onClearPlan={() => {
              setPlanDraft([]);
              setPlanSourcePrompt("");
              setMode("initial");
            }}
            onReplan={async (adjustment) => {
              const next = await planFromNaturalLanguage(`${planSourcePrompt}\n调整要求：${adjustment}`);
              setPlanDraft(next);
            }}
            onStartAdviceSplit={(todo) => {
              setInitialSplitTasks(null);
              setInitialSecondarySplits({});
              setInitialSelectedSplit(null);
              setSplitTarget(todo);
            }}
          />
          <TodoPanel
            todos={todos}
            onChange={changeTodos}
            onOpen={(todo) => {
              const splitBelongsToTask = Boolean(
                todo.splitTasks?.length
                && (
                  todo.source === "split"
                  || !todo.splitPlanTitle
                  || todo.splitPlanTitle === todo.title
                ),
              );
              if (!splitBelongsToTask) {
                if (todo.splitTasks?.length || todo.splitPlanTitle || todo.secondarySplits) {
                  changeTodos(todos.map((item) => (
                    item.id === todo.id
                      ? {
                          ...item,
                          splitPlanTitle: undefined,
                          splitTasks: undefined,
                          secondarySplits: undefined,
                          selectedSplit: undefined,
                        }
                      : item
                  )));
                }
                setInitialSplitTasks([]);
                setInitialSecondarySplits({});
                setInitialSelectedSplit(null);
                setSplitTarget(todo);
                setMode("splitLevel1");
                return;
              }
              setInitialSplitTasks(todo.splitTasks || []);
              setInitialSecondarySplits(todo.secondarySplits || {});
              setInitialSelectedSplit(todo.selectedSplit || null);
              setSplitTarget({
                ...todo,
                title: todo.splitPlanTitle || todo.title,
              });
              setMode(todo.selectedSplit && todo.secondarySplits?.[todo.selectedSplit] ? "splitLevel2" : "splitLevel1");
            }}
            onPlanRequest={async (input) => {
              const draft = await planFromNaturalLanguage(input);
              setPlanSourcePrompt(input);
              setPlanDraft(draft);
              setInitialSplitTasks(draft.map((todo) => todo.title));
              setInitialSecondarySplits({});
              setInitialSelectedSplit(null);
              setSplitTarget({
                id: crypto.randomUUID(),
                title: input,
                description: "",
                source: "ai",
                status: "pending",
                createdAt: new Date().toISOString(),
                depth: 0,
                archived: true,
              });
              setMode("splitLevel1");
            }}
            onSplit={(todo) => { setInitialSplitTasks(null); setInitialSecondarySplits({}); setInitialSelectedSplit(null); setSplitTarget(todo); setMode("splitLevel1"); }}
          />
          <BottomToolbar onButtonClick={(buttonNumber) => {
            if (buttonNumber === 4) {
              setKnowledgeError("");
              setKnowledgeDialogOpen(true);
            }
          }} />
        </div> : activePage === "cat" ? (
          <CatKnowledgePage />
        ) : (
          <HumanKnowledgePage
            vaults={knowledgeVaults}
            busyVaultId={busyVaultId}
            onConnect={() => {
              setKnowledgeError("");
              setKnowledgeDialogOpen(true);
            }}
            onRefresh={refreshKnowledgeFolder}
            onDisconnect={disconnectKnowledgeFolder}
          />
        )}
      </div>
      <ConnectKnowledgeDialog
        open={knowledgeDialogOpen}
        busy={knowledgeBusy}
        error={knowledgeError}
        onClose={() => {
          if (!knowledgeBusy) setKnowledgeDialogOpen(false);
        }}
        onChoose={connectKnowledgeFolder}
      />
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  );
}

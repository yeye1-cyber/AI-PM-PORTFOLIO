"use client";

import { useEffect, useState } from "react";
import {
  EDITABLE_PROMPTS,
  MAX_EDITABLE_PROMPT_LENGTH,
  PROMPT_STORAGE_KEYS,
  type EditablePromptId,
} from "@jiezhu/lib/ai/prompt-config";
import { readLocal, writeLocal } from "@jiezhu/lib/local-store";

export const CAT_REPLY_TEMPLATE_KEY = "catReplyTemplate";
export const MAX_CAT_REPLY_TEMPLATE_LENGTH = 2000;

export function CatKnowledgePage() {
  const [template, setTemplate] = useState("");
  const [savedTemplate, setSavedTemplate] = useState("");
  const [prompts, setPrompts] = useState<Record<EditablePromptId, string>>(() => (
    Object.fromEntries(EDITABLE_PROMPTS.map((item) => [item.id, item.defaultValue]))
  ) as Record<EditablePromptId, string>);
  const [savedPrompts, setSavedPrompts] = useState<Record<EditablePromptId, string>>(prompts);

  useEffect(() => {
    const saved = readLocal(CAT_REPLY_TEMPLATE_KEY, "");
    setTemplate(saved);
    setSavedTemplate(saved);
    const loaded = Object.fromEntries(EDITABLE_PROMPTS.map((item) => [
      item.id,
      readLocal(PROMPT_STORAGE_KEYS[item.id], item.defaultValue),
    ])) as Record<EditablePromptId, string>;
    setPrompts(loaded);
    setSavedPrompts(loaded);
  }, []);

  const save = () => {
    const normalized = template.trim();
    writeLocal(CAT_REPLY_TEMPLATE_KEY, normalized);
    setTemplate(normalized);
    setSavedTemplate(normalized);
  };

  const savePrompt = (id: EditablePromptId) => {
    const prompt = EDITABLE_PROMPTS.find((item) => item.id === id);
    if (!prompt) return;
    const normalized = prompts[id].trim() || prompt.defaultValue;
    writeLocal(PROMPT_STORAGE_KEYS[id], normalized);
    setPrompts((current) => ({ ...current, [id]: normalized }));
    setSavedPrompts((current) => ({ ...current, [id]: normalized }));
  };

  const restorePrompt = (id: EditablePromptId) => {
    const prompt = EDITABLE_PROMPTS.find((item) => item.id === id);
    if (prompt) setPrompts((current) => ({ ...current, [id]: prompt.defaultValue }));
  };

  return (
    <section className="cat-knowledge-page" aria-labelledby="cat-knowledge-title">
      <div className="cat-template-card">
        <h1 id="cat-knowledge-title">咪的知识库 · 提示词</h1>
        <p className="cat-template-description">
          这里修改的是咪实际调用 AI 时使用的提示词，内容仅保存在当前浏览器。
        </p>
        <div className="prompt-editor-list">
          <article className="prompt-editor">
            <div className="prompt-editor-heading">
              <div><h2>聊天框回复偏好（可选）</h2><p>基础聊天规则始终保留；这里只补充性格、语气和称呼方式，留空也能正常演示。</p></div>
            </div>
            <textarea value={template} maxLength={MAX_CAT_REPLY_TEMPLATE_LENGTH} placeholder="可选，例如：语气安静一点，先理解我的感受……" onChange={(event) => setTemplate(event.target.value)} aria-label="咪的聊天回复模板" />
            <div className="cat-template-footer">
              <span>{template.length} / {MAX_CAT_REPLY_TEMPLATE_LENGTH}</span>
              <button type="button" onClick={save} disabled={template.trim() === savedTemplate}>{template.trim() === savedTemplate ? "已保存" : "保存"}</button>
            </div>
          </article>
          {EDITABLE_PROMPTS.map((prompt) => {
            const isSaved = prompts[prompt.id].trim() === savedPrompts[prompt.id];
            return (
              <article className="prompt-editor" key={prompt.id}>
                <div className="prompt-editor-heading">
                  <div><h2>{prompt.title}</h2><p>{prompt.description}</p></div>
                  <button type="button" className="restore-prompt" onClick={() => restorePrompt(prompt.id)}>恢复默认</button>
                </div>
                <textarea value={prompts[prompt.id]} maxLength={MAX_EDITABLE_PROMPT_LENGTH} onChange={(event) => setPrompts((current) => ({ ...current, [prompt.id]: event.target.value }))} aria-label={prompt.title} />
                <div className="cat-template-footer">
                  <span>{prompts[prompt.id].length} / {MAX_EDITABLE_PROMPT_LENGTH}</span>
                  <button type="button" onClick={() => savePrompt(prompt.id)} disabled={isSaved}>{isSaved ? "已保存" : "保存"}</button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

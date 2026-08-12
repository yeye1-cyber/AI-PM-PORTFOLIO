"use client";

import { useEffect, useRef, useState } from "react";
import { readLocal, writeLocal } from "@jiezhu/lib/local-store";
import { CAT_REPLY_TEMPLATE_KEY } from "@jiezhu/components/dashboard/cat-knowledge-page";
import type { ChatMessage } from "@jiezhu/types/dashboard";

const CHAT_COOLDOWN_MS = 1200;
const CHAT_RETRY_DELAY_MS = 2500;

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasLoadedMessages, setHasLoadedMessages] = useState(false);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const saved = readLocal<ChatMessage[]>("chat", []);
    const welcome: ChatMessage = {
      id: "cat-welcome",
      role: "assistant",
      content: "我在这里呀。今天过得怎么样？不着急，你可以慢慢和我说。",
      createdAt: new Date().toISOString(),
      status: "sent",
    };
    setMessages(saved.some((message) => message.role === "assistant") ? saved : [welcome, ...saved]);
    setHasLoadedMessages(true);
  }, []);
  useEffect(() => {
    if (!hasLoadedMessages) return;
    writeLocal("chat", messages);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [hasLoadedMessages, messages]);
  const send = async () => {
    if (!text.trim() || isSending) return;
    const content = text.trim();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
      status: "sent",
    };
    const conversation = [...messages, userMessage];
    writeLocal("chat", conversation);
    setMessages(conversation);
    setText("");
    setIsSending(true);

    try {
      const requestBody = JSON.stringify({
        replyTemplate: readLocal(CAT_REPLY_TEMPLATE_KEY, ""),
        messages: conversation.slice(-10).map(({ role, content: messageContent }) => ({
          role,
          content: messageContent,
        })),
      });
      await wait(CHAT_COOLDOWN_MS);
      let response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
      if ([429, 502].includes(response.status)) {
        await wait(CHAT_RETRY_DELAY_MS);
        response = await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        });
      }
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok || !result.message) {
        throw new Error(result.error || "AI 服务暂时不可用。");
      }
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.message,
        createdAt: new Date().toISOString(),
        status: "sent",
      };
      const nextMessages = [...conversation, assistantMessage];
      writeLocal("chat", nextMessages);
      setMessages(nextMessages);
    } catch (error) {
      const failedMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: error instanceof Error ? error.message : "AI 服务暂时不可用，请稍后再试。",
        createdAt: new Date().toISOString(),
        status: "failed",
      };
      const nextMessages = [...conversation, failedMessage];
      writeLocal("chat", nextMessages);
      setMessages(nextMessages);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <section className="cozy-panel chat-panel">
      <img className="chat-background" src="/ui/chat-background.png" alt="" aria-hidden="true" />
      <h2 className="script-title">Chat Bubbles</h2>
      <div className="chat-messages">
        {messages.map((message) => (
          <div className={`chat-row ${message.role}`} key={message.id}>
            <img
              className={`chat-avatar ${message.role === "assistant" ? "cat-avatar" : ""}`}
              src={message.role === "user" ? "/ui/chat-user-avatar.png" : "/ui/chat-cat-avatar.png"}
              alt={message.role === "user" ? "我的头像" : "小猫头像"}
            />
            <div className="chat-bubble">{message.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input">
        <textarea rows={1} value={text} placeholder="输入你的想法……" onChange={(event) => setText(event.target.value)} onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); }
        }} />
        <button type="button" aria-label="发送消息" onClick={send} disabled={!text.trim() || isSending}>
          <span aria-hidden="true">➤</span>
        </button>
      </div>
    </section>
  );
}

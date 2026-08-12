"use client";

import { useState } from "react";
import { moodTags } from "@jiezhu/data/dashboard-config";

type Props = { onSubmit: (tags: string[], text: string) => void };

export function EmotionPanel({ onSubmit }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState("");
  const visibleTags = expanded ? moodTags : moodTags.slice(0, 5);

  const toggle = (tag: string) =>
    setSelected((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);

  return (
    <section className={`cozy-panel emotion-panel ${expanded ? "is-expanded" : "is-collapsed"}`}>
      <h2 className="script-title">Mood Management</h2>
      <div className="mood-tags">
        {visibleTags.map((tag) => (
          <button aria-pressed={selected.includes(tag)} className="mood-tag" key={tag} onClick={() => toggle(tag)}>{tag}</button>
        ))}
      </div>
      {!expanded && (
        <div className="mood-reveal">
          <img alt="" aria-hidden="true" src="/ui/emotion-cat.png" />
          <button onClick={() => setExpanded(true)}>人，你可以点击这个按钮显示更多标签哦</button>
        </div>
      )}
      <div className="mood-note">
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="还有想对咪说的吗……" />
        <button disabled={!selected.length && !text.trim()} onClick={() => onSubmit(selected, text)}>让咪听听</button>
      </div>
    </section>
  );
}

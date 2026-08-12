"use client";

import { useMemo, useState } from "react";

export function CalendarPanel() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const days = useMemo(() => {
    const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const offset = (cursor.getDay() + 6) % 7;
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  }, [cursor]);

  const changeMonth = (delta: number) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  return (
    <section className="cozy-panel calendar-panel">
      <img
        className="calendar-background"
        src="/ui/calendar-background.webp"
        alt=""
        draggable={false}
      />
      <img
        className="calendar-bottom-cat"
        src="/ui/calendar-cat-background-trimmed.webp"
        alt=""
        draggable={false}
      />
      <h2 className="script-title">Calendar</h2>
      <div className="calendar-sheet">
        <div className="calendar-head">
          <button onClick={() => changeMonth(-1)} aria-label="上个月">‹</button>
          <strong>{cursor.getFullYear()}年 {cursor.getMonth() + 1}月</strong>
          <button onClick={() => changeMonth(1)} aria-label="下个月">›</button>
        </div>
        <div className="calendar-grid weekdays">
          {["一", "二", "三", "四", "五", "六", "日"].map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="calendar-grid dates">
          {days.map((day, index) => {
            const current = day === today.getDate() && cursor.getMonth() === today.getMonth() && cursor.getFullYear() === today.getFullYear();
            return <button className={current ? "today" : ""} disabled={!day} key={`${day}-${index}`}>{day}</button>;
          })}
        </div>
      </div>
      <img
        className="calendar-top-cat"
        src="/ui/calendar-cat-trimmed.webp"
        alt=""
        draggable={false}
      />
    </section>
  );
}

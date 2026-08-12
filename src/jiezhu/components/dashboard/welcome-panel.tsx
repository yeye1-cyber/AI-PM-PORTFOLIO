"use client";

import { useEffect, useState } from "react";
import { greetings } from "@jiezhu/data/dashboard-config";

export function WelcomePanel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((value) => (value + 1) % greetings.length);
        setVisible(true);
      }, 220);
    }, 10000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="cozy-panel welcome-panel">
      <img
        className="welcome-background"
        src="/ui/welcome-background.webp"
        alt=""
        draggable={false}
      />
      <img
        className="welcome-cat"
        src="/ui/welcome-cat.webp"
        alt=""
        draggable={false}
      />
      <div
        className={`welcome-bubble ${visible ? "visible" : ""}`}
        aria-live="polite"
      >
        {greetings[index]}
      </div>
    </section>
  );
}

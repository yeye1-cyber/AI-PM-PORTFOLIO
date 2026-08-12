type PauseMessageProps = {
  onResume: () => void;
  onRestart: () => void;
};

export function PauseMessage({ onResume, onRestart }: PauseMessageProps) {
  return (
    <section className="state-card">
      <span className="state-icon" aria-hidden="true">—</span>
      <h1>我们先在这里停一下。</h1>
      <p>不需要马上继续。愿意回来时，我们可以从刚才的位置接着走。</p>
      <button className="button primary" type="button" onClick={onResume}>
        我想继续了
      </button>
      <button className="text-button centered" type="button" onClick={onRestart}>
        回到开始
      </button>
    </section>
  );
}

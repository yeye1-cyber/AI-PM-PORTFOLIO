type AppHeaderProps = {
  onRestart?: () => void;
};

export function AppHeader({ onRestart }: AppHeaderProps) {
  return (
    <header className="app-header">
      <button className="brand" type="button" onClick={onRestart}>
        接住
      </button>
      <span className="stage-label">阶段一 · 交互原型</span>
    </header>
  );
}

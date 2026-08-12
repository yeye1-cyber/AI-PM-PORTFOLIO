type ContextDrawerProps = {
  emotion: string | null;
  input: string;
};

export function ContextDrawer({ emotion, input }: ContextDrawerProps) {
  return (
    <details className="context-drawer">
      <summary>查看刚才说的内容</summary>
      <div>
        {emotion && <span className="context-emotion">{emotion}</span>}
        <p>{input}</p>
      </div>
    </details>
  );
}

"use client";

type Props = {
  open: boolean;
  busy: boolean;
  error: string;
  onClose: () => void;
  onChoose: () => void;
};

export function ConnectKnowledgeDialog({ open, busy, error, onClose, onChoose }: Props) {
  if (!open) return null;
  return (
    <div className="knowledge-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="knowledge-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-knowledge-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="knowledge-dialog-close" type="button" aria-label="关闭" onClick={onClose}>×</button>
        <div className="knowledge-dialog-cat" aria-hidden="true">ฅ^•ﻌ•^ฅ</div>
        <h2 id="connect-knowledge-title">连接知识库</h2>
        <p>选择一个 Obsidian 知识库文件夹。只读取目录与 Markdown 文件名，不读取正文，也不会修改本地文件。</p>
        {error && <p className="knowledge-dialog-error" role="alert">{error}</p>}
        <button className="choose-knowledge-folder" type="button" disabled={busy} onClick={onChoose}>
          {busy ? "正在扫描…" : "选择本地文件夹"}
        </button>
      </section>
    </div>
  );
}

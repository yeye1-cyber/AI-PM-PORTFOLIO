"use client";

import { KnowledgeTree } from "@jiezhu/components/dashboard/knowledge-tree";
import type { KnowledgeVault } from "@jiezhu/features/knowledge/obsidian-folder";

type Props = {
  vaults: KnowledgeVault[];
  busyVaultId: string | null;
  onConnect: () => void;
  onRefresh: (vault: KnowledgeVault) => void;
  onDisconnect: (vault: KnowledgeVault) => void;
};

export function HumanKnowledgePage({
  vaults,
  busyVaultId,
  onConnect,
  onRefresh,
  onDisconnect,
}: Props) {
  return (
    <section className="human-knowledge-page" aria-labelledby="human-knowledge-title">
      <header className="human-knowledge-header">
        <div>
          <h1 id="human-knowledge-title">人的知识库</h1>
          <p>只读展示本地 Obsidian 文件夹中的目录与 Markdown 笔记名称。</p>
        </div>
        <button type="button" onClick={onConnect}>连接知识库</button>
      </header>
      {vaults.length === 0 ? (
        <div className="human-knowledge-empty">
          <span aria-hidden="true">📖</span>
          <h2>还没有连接知识库</h2>
          <p>点击右下角书本按钮，或上方“连接知识库”。</p>
        </div>
      ) : (
        <div className="knowledge-vault-list">
          {vaults.map((vault) => (
            <article className="knowledge-vault-card" key={vault.id}>
              <details open>
                <summary className="knowledge-vault-summary">
                  <span className="knowledge-vault-name">{vault.name}</span>
                  <span>{vault.noteCount} 篇笔记</span>
                </summary>
                <KnowledgeTree nodes={vault.tree} />
              </details>
              <footer>
                <span>更新于 {new Date(vault.scannedAt).toLocaleString("zh-CN")}</span>
                <div>
                  <button
                    type="button"
                    disabled={busyVaultId === vault.id}
                    onClick={() => onRefresh(vault)}
                  >
                    {busyVaultId === vault.id ? "刷新中…" : "刷新目录"}
                  </button>
                  <button
                    className="disconnect-knowledge"
                    type="button"
                    onClick={() => onDisconnect(vault)}
                  >
                    取消连接
                  </button>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

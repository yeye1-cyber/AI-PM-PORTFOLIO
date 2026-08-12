import type { KnowledgeTreeNode } from "@jiezhu/features/knowledge/obsidian-folder";

type Props = {
  nodes: KnowledgeTreeNode[];
};

export function KnowledgeTree({ nodes }: Props) {
  if (nodes.length === 0) {
    return <p className="knowledge-tree-empty">没有找到 Markdown 笔记</p>;
  }
  return (
    <ul className="knowledge-tree">
      {nodes.map((node) => (
        <li key={`${node.type}:${node.name}`}>
          {node.type === "folder" ? (
            <details open>
              <summary><span aria-hidden="true">▸</span>{node.name}</summary>
              <KnowledgeTree nodes={node.children} />
            </details>
          ) : (
            <div className="knowledge-note"><span aria-hidden="true">·</span>{node.name}</div>
          )}
        </li>
      ))}
    </ul>
  );
}

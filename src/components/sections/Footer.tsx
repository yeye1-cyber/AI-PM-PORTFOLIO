const aiProductSkills = [
  "RAG",
  "结构化输出",
  "幻觉控制",
  "人工兜底",
  "上下文限制权衡",
  "信息组织",
  "响应效率",
  "用户体验与算力成本",
];

const productSkills = ["需求分析", "PRD", "流程设计", "原型设计", "竞品分析"];
const technicalTools = ["Figma", "XMind", "Excel", "Codex", "Claude Code", "机器学习", "Python"];

function TagList({ items }: { items: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="rounded-full border border-[#d9ded2] px-2.5 py-1 text-[11px] leading-none text-[#667064]">
          {item}
        </span>
      ))}
    </div>
  );
}

function TextList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`mt-3 grid gap-x-5 gap-y-2 text-[11px] leading-5 text-[#667064] ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function MailIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
}

function PhoneIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7.2 3.5 4.7 5.3c-.8.6-1.1 1.6-.7 2.5 2.3 5.7 6.6 10 12.3 12.3.9.4 1.9.1 2.5-.7l1.8-2.5-4.3-3-1.8 1.8c-2.7-1.3-4.8-3.4-6.1-6.1l1.8-1.8-3-4.3Z" /></svg>;
}

function GithubIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>;
}

const iconLinks = [
  { label: "发送邮件", href: "mailto:2330256454@qq.com", icon: <MailIcon /> },
  { label: "拨打电话", href: "tel:18773168569", icon: <PhoneIcon /> },
  { label: "GitHub（链接待补充）", href: "#", icon: <GithubIcon /> },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-[#f5f7f1] px-7 py-7 sm:px-9">
      <div className="grid gap-x-8 gap-y-8 border-b border-[#e5e7df] pb-7 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.55fr_.95fr_1.15fr] lg:items-start">
        <section aria-labelledby="contact-title">
          <h2 id="contact-title" className="text-base font-semibold text-[#203b13]">欧雅欣</h2>
          <p className="mt-1.5 text-[12px] leading-6 text-[#667064]">中南大学硕士研究生在读</p>
          <p className="text-[12px] leading-6 text-[#667064]">AI 产品经理 / AI 产品设计/UI设计</p>
          <address className="mt-3 flex flex-col items-start gap-1 not-italic text-[12px] text-[#667064]">
            <a className="transition-colors hover:text-[#203b13]" href="mailto:2330256454@qq.com">2330256454@qq.com</a>
            <a className="transition-colors hover:text-[#203b13]" href="tel:18773168569">18773168569</a>
          </address>
          <div className="mt-4 flex gap-2">
            {iconLinks.map((item) => <a key={item.label} href={item.href} aria-label={item.label} title={item.label} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#203b13] text-white transition-colors hover:bg-[#345527]">{item.icon}</a>)}
          </div>
        </section>

        <section aria-labelledby="ai-skills-title">
          <h2 id="ai-skills-title" className="text-[12px] font-semibold text-[#2f3d2d]">AI 产品能力</h2>
          <TextList items={aiProductSkills} columns={2} />
        </section>

        <section aria-labelledby="product-skills-title">
          <h2 id="product-skills-title" className="text-[12px] font-semibold text-[#2f3d2d]">产品能力</h2>
          <TextList items={productSkills} />
        </section>

        <section aria-labelledby="tools-title">
          <h2 id="tools-title" className="text-[12px] font-semibold text-[#2f3d2d]">技术</h2>
          <TagList items={technicalTools} />
          <h3 className="mt-4 text-[11px] font-semibold text-[#566052]">英语能力</h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] leading-5 text-[#667064]">
            <span className="rounded-full border border-[#d9ded2] px-2.5 py-1 leading-none">CET-6</span>
            <span>可阅读英文论文、技术文档及开源项目资料</span>
          </div>
        </section>
      </div>
      <div className="flex flex-col gap-2 pt-4 text-[11px] text-[#929992] sm:flex-row sm:justify-between"><span>© 2026 Ouyangxin Portfolio</span><span>AI PRODUCT MANAGER · SHANGHAI</span></div>
    </footer>
  );
}

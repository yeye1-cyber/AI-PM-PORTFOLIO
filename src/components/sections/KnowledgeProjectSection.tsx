"use client";

import Image from "next/image";
import { useState } from "react";
import { getProject } from "@/data/projects";

type PluginView = {
  id: string;
  label: string;
  title: string;
  summary: string;
  bullets: string[];
};

const pluginViews: PluginView[] = [
  {
    id: "insight-positioning",
    label: "问题与定位",
    title: "从信息散落到个人知识系统",
    summary:
      "收藏并不等于真正获得知识。产品希望解决的，是零散信息进入个人知识库之后，如何继续完成理解、整理、复习和行动。",
    bullets: [
      "问题洞察｜信息散落，收藏无法形成知识闭环。用户每天从 ChatGPT、X、小红书、网页、图片和 PDF 中获取大量信息，但内容分散在不同平台。即使完成收藏，也缺少统一的整理、复习和行动机制，最终形成：收藏很多、记住很少、真正使用更少。",
      "设计目标｜这个项目关注的不是“如何收藏更多”，而是如何让零散信息在收藏之后继续流动，形成从理解、整理到复习和行动的完整闭环。",
      "产品定位｜让零散信息回到个人知识系统。我将产品定位为一款运行在 Obsidian 中的 AI 知识行动助手：把散落在不同平台的信息，转化为可理解、可整理、可复习、可执行的个人知识。",
      "形态选择｜选择 Obsidian 插件形态，是为了复用用户已有的 Markdown、文件夹、标签和本地知识库，不重新开发账号、云同步和独立阅读器，将有限资源集中在核心知识处理流程上。",
    ],
  },
  {
    id: "loop-ai-design",
    label: "核心方案",
    title: "从知识处理到行动调度",
    summary:
      "产品以收藏后的知识处理流程为核心，让 AI 负责语义理解与建议生成，同时通过结构化输出、确定性规则和用户确认控制风险。",
    bullets: [
      "核心闭环｜从内容收藏走向知识行动。产品围绕收藏后的关键决策，建立了一条完整流程：",
      "完整流程｜多来源信息进入 Obsidian → AI 生成摘要、要点和分类建议 → 用户确认整理结果 → AI 提取可执行的行动候选 → 进入行动池与 Today → 根据完成、延期和掌握度反馈持续调度。",
      "AI 价值｜AI 不只负责总结内容，还参与知识理解、行动提取和调度建议，让笔记从静态存档变成可以持续推进的知识任务。",
      "职责划分｜语义判断交给 AI，关键规则保持确定。我没有让大模型直接控制整个知识库，而是根据任务特征划分 AI 与规则系统的职责：",
      "AI 能力｜AI 负责摘要、要点提取、分类理由、行动建议和调度建议",
      "输出约束｜结构化 Schema 约束模型输出，异常结果需要校验和修复",
      "规则控制｜确定性规则负责任务数量、日期保护、优先级和状态流转",
      "用户确认｜分类移动、行动采纳等关键操作由用户最终确认",
      "失败处理｜模型失败时保留原始内容，并提供明确错误和恢复路径",
      "设计结果｜这套设计在发挥大模型语义理解能力的同时，降低了幻觉和错误写入对个人知识库的影响。",
    ],
  },
  {
    id: "validation",
    label: "验证与迭代",
    title: "同时衡量 AI 质量和用户价值",
    summary:
      "项目不仅验证功能是否可运行，还同时关注工程稳定性、AI 输出质量、真实产品价值以及个人知识库的安全边界。",
    bullets: [
      "验证体系｜项目不只关注“功能能否运行”，还建立了三层验证体系：",
      "工程验证｜结构化输出校验、异常恢复、自动化测试与构建",
      "AI 质量｜摘要准确性、分类建议采纳率、无效建议和失败率",
      "产品价值｜收藏后的有效处理率、行动采纳率、Today 完成率和复习完成率",
      "安全护栏｜同时设置明确的护栏指标：原文自动删除次数为 0、未经确认的分类移动为 0、API Key 泄漏次数为 0。",
      "后续迭代｜后续将通过真实收藏内容和连续使用记录，验证产品是否真正减少知识积压，并提高知识从收藏到行动的转化效率。",
    ],
  },
];

const mediaViews = [
  { id: "project-interface", label: "项目界面", english: "Interface" },
  { id: "video-demo", label: "视频演示", english: "Video Demo" },
] as const;

const navigationViews = [
  ...pluginViews.map((view, index) => ({ id: view.id, label: view.label, english: ["Problem", "Solution", "Validation"][index] })),
  ...mediaViews,
];

const copy = (text: string) => text.slice(text.indexOf("｜") + 1);

function EditorialLabel({ index, english, chinese }: { index?: string; english: string; chinese: string }) {
  return (
    <div className="flex items-baseline gap-2.5">
      {index && <span className="text-[11px] tracking-[.18em] text-[#8b958b]">{index}</span>}
      <span className="text-[11px] font-medium tracking-[.16em] text-[#657065]">{english}</span>
      <span className="text-sm font-medium text-[#333b33]">{chinese}</span>
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => <span key={item} className="rounded-full border border-[#dce1d8] px-3 py-1 text-xs text-[#5c675c]">{item}</span>)}
    </div>
  );
}

function InsightLayout({ view }: { view: PluginView }) {
  return (
    <div className="grid gap-x-4 gap-y-5 md:grid-cols-12">
      <section className="rounded-[12px] border border-[#dde2d9] bg-[#fafbf8] p-5 sm:p-6 md:col-span-7">
        <EditorialLabel index="01" english="PROBLEM" chinese="问题洞察" />
        <p className="mt-4 text-sm leading-[1.75] text-[#566056] sm:text-[15px]">{copy(view.bullets[0])}</p>
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#e2e6dd] pt-5">
          {[['COLLECT', '收藏很多'], ['REMEMBER', '记住很少'], ['ACTION', '真正使用更少']].map(([en, zh]) => (
            <div key={en} className="min-w-0">
              <span className="text-[10px] tracking-[.14em] text-[#8a938a]">{en}</span>
              <p className="mt-1 text-sm font-medium text-[#2e372e]">{zh}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-l border-[#dde2d9] py-1 pl-5 sm:pl-6 md:col-span-5">
        <EditorialLabel index="02" english="GOAL" chinese="设计目标" />
        <p className="mt-4 text-sm leading-[1.75] text-[#606a60] sm:text-[15px]">{copy(view.bullets[1])}</p>
      </section>
      <section className="border-r border-[#dde2d9] py-1 pr-5 sm:pr-6 md:col-span-5">
        <EditorialLabel index="03" english="POSITIONING" chinese="产品定位" />
        <p className="mt-5 text-[17px] font-semibold leading-7 tracking-[-.03em] text-[#2d362d] sm:text-lg">
          运行在 Obsidian 中的<br />AI 知识行动助手
        </p>
        <p className="mt-3 text-sm leading-[1.75] text-[#667066] sm:text-[15px]">{copy(view.bullets[2])}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs text-[#4c574c]">
          {['理解', '整理', '复习', '行动'].map((item, i) => <span key={item} className="contents"><span className="rounded-full border border-[#dce1d8] px-3 py-1">{item}</span>{i < 3 && <span className="text-[#b1b8b1]">···→</span>}</span>)}
        </div>
      </section>
      <section className="rounded-[12px] border border-[#dde2d9] bg-[#fafbf8] p-5 sm:p-6 md:col-span-7">
        <EditorialLabel index="04" english="WHY OBSIDIAN" chinese="形态选择" />
        <p className="mt-4 text-sm leading-[1.75] text-[#626c62] sm:text-[15px]">{copy(view.bullets[3])}</p>
        <div className="mt-4"><Tags items={['Markdown', '文件夹', '标签', '本地知识库']} /></div>
      </section>
    </div>
  );
}

function SolutionLayout({ view }: { view: PluginView }) {
  const flow = ['多来源信息进入 Obsidian', 'AI 生成摘要、要点和分类建议', '用户确认整理结果', 'AI 提取可执行的行动候选', '进入行动池与 Today', '根据完成、延期和掌握度反馈持续调度'];
  return (
    <div className="space-y-4">
      <section>
        <EditorialLabel index="01" english="CORE LOOP" chinese="核心闭环" />
        <p className="mt-4 text-sm leading-[1.75] text-[#647064] sm:text-[15px]">{copy(view.bullets[0])}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {flow.map((item, i) => <div key={item} className="relative min-h-20 rounded-[12px] border border-[#dde2d9] bg-[#fafbf8] p-3 text-xs leading-5 text-[#465146]"><span className="mb-2 block text-[10px] tracking-[.12em] text-[#9aa29a]">0{i + 1}</span>{item}{i < flow.length - 1 && <span className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-[#9ba49b] lg:block">··→</span>}</div>)}
        </div>
        <p className="sr-only">{copy(view.bullets[1])}</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2 md:auto-rows-fr">
        <section className="rounded-[12px] border border-[#dde2d9] p-5 sm:p-6">
          <EditorialLabel english="AI LAYER" chinese="AI 负责" />
          <p className="mt-4 text-sm leading-[1.75] text-[#626d62] sm:text-[15px]">{copy(view.bullets[2])}</p>
          <p className="mt-3 text-sm leading-[1.75] text-[#626d62] sm:text-[15px]">{copy(view.bullets[4])}</p>
          <div className="mt-4"><Tags items={['摘要', '要点提取', '分类理由', '行动建议', '调度建议']} /></div>
        </section>
        <section className="rounded-[12px] border border-[#dde2d9] p-5 sm:p-6">
          <EditorialLabel english="SYSTEM LAYER" chinese="规则负责" />
          <p className="mt-4 text-sm leading-[1.75] text-[#626d62] sm:text-[15px]">{copy(view.bullets[3])}</p>
          <p className="mt-3 text-sm leading-[1.75] text-[#626d62] sm:text-[15px]">{copy(view.bullets[5])}</p>
          <p className="mt-2 text-sm leading-[1.75] text-[#626d62] sm:text-[15px]">{copy(view.bullets[6])}</p>
          <div className="mt-4"><Tags items={['结构化 Schema', '任务数量', '日期保护', '优先级', '状态流转']} /></div>
        </section>
        <section className="rounded-[12px] border border-[#dde2d9] p-5 sm:p-6">
          <EditorialLabel english="HUMAN IN THE LOOP" chinese="用户确认" />
          <p className="mt-4 text-sm leading-[1.75] text-[#626d62] sm:text-[15px]">{copy(view.bullets[7])}</p>
        </section>
        <section className="rounded-[12px] border border-[#dde2d9] p-5 sm:p-6">
          <EditorialLabel english="FAILURE STATE" chinese="失败处理" />
          <p className="mt-4 text-sm leading-[1.75] text-[#626d62] sm:text-[15px]">{copy(view.bullets[8])}</p>
        </section>
      </div>
      <p className="border-t border-[#e1e5dd] pt-4 text-sm leading-[1.75] text-[#758075]">{copy(view.bullets[9])}</p>
    </div>
  );
}

function MetricGroup({ label, title, text, className = "" }: { label: string; title: string; text: string; className?: string }) {
  return <section className={`rounded-[12px] border border-[#dde2d9] p-5 sm:p-6 ${className}`}><EditorialLabel english={label} chinese={title} /><p className="mt-4 text-sm leading-[1.75] text-[#596459] sm:text-[15px]">{text}</p></section>;
}

function ValidationLayout({ view }: { view: PluginView }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <p className="text-sm leading-[1.75] text-[#737d73] md:col-span-2">{copy(view.bullets[0])}</p>
      <MetricGroup label="ENGINEERING" title="工程验证" text={copy(view.bullets[1])} className="bg-[#fafbf8]" />
      <MetricGroup label="AI QUALITY" title="AI 质量" text={copy(view.bullets[2])} />
      <MetricGroup label="PRODUCT VALUE" title="产品价值" text={copy(view.bullets[3])} className="md:col-span-2" />
      <section className="border-t border-[#e0e5dc] py-5 md:col-span-2">
        <EditorialLabel english="SAFETY GUARDRAILS" chinese="安全护栏" />
        <p className="mt-3 text-sm leading-[1.75] text-[#737d73]">{copy(view.bullets[4])}</p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {['原文自动删除', '未经确认的分类移动', 'API Key 泄漏'].map((item) => <div key={item} className="flex min-h-16 flex-col justify-between"><strong className="text-3xl font-medium tracking-[-.05em] text-[#2f392f]">0</strong><p className="mt-1 text-xs leading-5 text-[#667066]">{item}</p></div>)}
        </div>
      </section>
      <section className="flex flex-col gap-4 border-t border-[#e0e5dc] pt-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl"><EditorialLabel english="NEXT ITERATION" chinese="后续迭代" /><p className="mt-3 text-sm leading-[1.75] text-[#626d62] sm:text-[15px]">{copy(view.bullets[5])}</p></div>
        <div className="shrink-0 text-xs text-[#788278]">收藏 ···→ 理解 ···→ 复习 ···→ 行动</div>
      </section>
    </div>
  );
}

function MediaView({ type }: { type: "project-interface" | "video-demo" }) {
  const isInterface = type === "project-interface";

  return (
    <div className="relative h-full min-h-[480px] w-full overflow-hidden bg-transparent">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-[11px] tracking-[.16em] text-[#7e887e]">VIDEO DEMO</span>
        <p className="mt-3 text-sm text-[#7a847a]">项目演示视频待接入</p>
      </div>
      {isInterface ? (
        <Image
          src="/api/materials/knowledgeInterface"
          alt="AI 知识行动与抗拖延助手项目界面"
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 74vw, 100vw"
          className="z-10 object-contain object-center"
        />
      ) : (
        <video className="absolute inset-0 z-10 h-full w-full bg-transparent object-contain object-center" controls playsInline preload="metadata" onError={(event) => event.currentTarget.classList.add("hidden")}>
          <source src="/videos/知识插件产品demo视频.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function ProjectSidebar({ activeId, onChange }: { activeId: string; onChange: (id: string) => void }) {
  return (
    <aside className="rounded-[16px] border border-[#dfe2d8] bg-[rgba(255,253,248,.82)] p-5 sm:p-6 lg:h-full lg:min-h-0">
      <span className="block text-[10px] leading-4 tracking-[.22em] text-[#6f796f]">KNOWLEDGE<br />TO ACTION</span>
      <h3 className="mt-5 text-[21px] font-medium leading-[1.3] tracking-[-.055em]">让笔记真正<br />进入行动循环</h3>
      <nav aria-label="知识行动助手项目导航" className="mt-5 space-y-1.5">
        {navigationViews.map((view, index) => {
          const active = view.id === activeId;
          return <button key={view.id} type="button" aria-pressed={active} onClick={() => onChange(view.id)} className={`group relative flex w-full items-start gap-3 border-b pb-2 text-left transition-opacity ${active ? 'border-[#657065] opacity-100' : 'border-[#e4e7e0] opacity-45 hover:opacity-80'}`}>
            <span className={`leading-none tracking-[-.04em] ${active ? 'text-xl text-[#2d352d]' : 'text-base text-[#7d867d]'}`}>0{index + 1}</span>
            <span><span className="block text-[10px] tracking-[.12em] text-[#7e877e]">{view.english}</span><span className="mt-1 block text-sm font-medium text-[#333b33]">{view.label}</span></span>
            {active && <span aria-hidden="true" className="absolute -left-3 top-1.5 h-1 w-1 rounded-full bg-[#4e594e]" />}
          </button>;
        })}
      </nav>
    </aside>
  );
}

export function KnowledgeProjectSection() {
  const project = getProject("knowledge");
  const [activeId, setActiveId] = useState(pluginViews[0].id);
  const activeView = pluginViews.find((view) => view.id === activeId);
  const activeMediaView = mediaViews.find((view) => view.id === activeId);
  const number = activeView ? String(pluginViews.indexOf(activeView) + 1).padStart(2, "0") : "";

  return (
    <section
      id="knowledge"
      style={{ backgroundImage: "url('/api/materials/knowledgeSectionBackground')" }}
      className="border-t border-[#e4e6de] bg-[#f1f2eb] bg-cover bg-center bg-no-repeat px-4 py-16 sm:px-7 sm:py-20 lg:px-10"
    >
      <div className="mb-8 max-w-3xl">
        <span className="eyebrow">PROJECT {project.number} · PLUGIN</span>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl">{project.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[#707970]">{project.description}</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,74fr)_minmax(240px,26fr)]">
        <article
          key={activeId}
          aria-live="polite"
          className={`overflow-x-hidden rounded-[16px] border border-[#dfe2d8] bg-[rgba(255,253,248,.82)] lg:aspect-video lg:overflow-y-auto [scrollbar-color:rgba(89,98,89,.24)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(89,98,89,.24)] hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(89,98,89,.34)] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px] ${activeMediaView ? "p-0" : "p-6 sm:p-9 lg:p-10"}`}
        >
          {activeView && <>
            <header>
              <span className="text-[10px] tracking-[.2em] text-[#8a928a]">{number} / 05</span>
              <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-[-.035em] sm:text-[34px]">{activeView.title}</h3>
              <p className="mt-5 max-w-[70%] text-[15px] leading-[1.75] text-[#4f594f] max-sm:max-w-none">{activeView.summary}</p>
              <div className="mb-8 mt-8 border-t border-[#e8ebe5]" />
            </header>
            {activeView.id === 'insight-positioning' && <InsightLayout view={activeView} />}
            {activeView.id === 'loop-ai-design' && <SolutionLayout view={activeView} />}
            {activeView.id === 'validation' && <ValidationLayout view={activeView} />}
          </>}
          {activeMediaView && <MediaView type={activeMediaView.id} />}
        </article>
        <ProjectSidebar activeId={activeId} onChange={setActiveId} />
      </div>
    </section>
  );
}

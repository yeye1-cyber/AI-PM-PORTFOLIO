"use client";

import Link from "next/link";
import { useState } from "react";
import { getProject } from "@/data/projects";

type FlowChapter = {
  id: string;
  number: string;
  navTitle: string;
  title: string;
  summary: string;
  sections: {
    heading?: string;
    body?: string;
    items?: string[];
    flow?: string;
  }[];
  activeNodes: string[];
};

const chapters: FlowChapter[] = [
  {
    id: "background",
    number: "01",
    navTitle: "产品背景与问题定义",
    title: "降低交易想法的表达成本",
    summary: "个人投资者能够描述交易想法，却往往难以把它转化为可执行、可检查的策略流程。",
    sections: [
      {
        body: "从“跌破均线后减仓”到真正可运行的策略，用户仍需理解编程、行情接口与交易规则。现有可视化工具虽然降低了编程门槛，但仍有三类关键障碍。",
      },
      {
        items: ["不清楚应该选择哪些节点", "容易出现参数、连线和执行顺序错误", "缺少针对 A 股交易规则的风险提示"],
      },
      { heading: "产品机会", body: "让用户更低成本地完成从“策略想法”到“可验证交易流程”的转换。" },
    ],
    activeNodes: ["market", "indicator", "signal"],
  },
  {
    id: "users",
    number: "02",
    navTitle: "目标用户与核心场景",
    title: "服务懂交易逻辑的策略初学者",
    summary: "面向具备基础交易认知、但不熟悉编程的个人研究者与策略初学者。",
    sections: [
      { heading: "核心场景", items: ["将零散交易想法整理为结构化流程", "通过可视化画布检查条件与执行顺序", "在不接触真实资金的情况下模拟运行或回测", "根据执行日志定位配置和规则问题"] },
      { heading: "现阶段边界", body: "不面向专业量化机构，也不解决高频交易、复杂因子研究和实盘盈利问题。" },
    ],
    activeNodes: ["market", "indicator", "signal", "execute"],
  },
  {
    id: "solution",
    number: "03",
    navTitle: "产品方案与用户流程",
    title: "用工作流表达并验证交易逻辑",
    summary: "将行情、条件判断、风险检查和模拟下单封装为可连接节点，让交易逻辑可以被看见、检查和复盘。",
    sections: [
      { heading: "核心流程", flow: "策略表达 → 节点编排 → 规则校验 → 用户确认 → 模拟运行 / 回测 → 结果复盘" },
      { body: "运行前检查流程完整性；运行后展示条件判断、模拟订单、风险拦截和执行日志，形成从策略创建到结果复盘的闭环。" },
    ],
    activeNodes: ["market", "indicator", "signal", "risk", "execute"],
  },
  {
    id: "capabilities",
    number: "04",
    navTitle: "关键能力设计",
    title: "围绕可控执行构建关键能力",
    summary: "能力设计不追求功能堆叠，而是覆盖策略表达、规则检查、模拟执行与结果解释。",
    sections: [
      { items: ["可视化节点编排：模块化行情、账户、条件、风险与交易操作", "A 股规则检查：检查交易时段、委托数量、涨跌停等规则", "Broker Adapter：统一行情、账户、持仓与订单调用方式", "模拟交易：以模拟账户和订单隔离真实资金风险", "轻量回测：观察历史执行过程与基础结果，不承诺收益预测", "日志与结果解释：记录节点、条件、订单结果及拦截原因"] },
    ],
    activeNodes: ["market", "indicator", "signal", "risk", "execute"],
  },
  {
    id: "ai",
    number: "05",
    navTitle: "AI 探索与产品取舍",
    title: "从替用户决策转向辅助检查",
    summary: "自然语言生成完整工作流的稳定性与安全性不足，因此主动收缩 AI 边界。",
    sections: [
      { heading: "原型验证问题", items: ["模型响应速度不稳定", "复杂策略容易被错误理解", "节点与参数覆盖有限", "生成结果仍需人工检查", "直接执行存在较高交易风险"] },
      { heading: "调整后的定位", items: ["AI Advice：推荐节点、连接方式与参数", "AI Check：识别缺失条件、错误连接和潜在风险", "人工确认：AI 只提供草稿或建议，确认后才能运行"] },
      { body: "这次取舍的核心，是用更清晰的人机边界提高产品的可控性与可信度。" },
    ],
    activeNodes: ["ai", "signal", "risk"],
  },
  {
    id: "validation",
    number: "06",
    navTitle: "MVP 验证与迭代方向",
    title: "先验证使用价值，再决定扩展方向",
    summary: "当前 MVP 已形成可运行闭环，但技术可行不等于用户价值与专业价值已经成立。",
    sections: [
      { heading: "已完成闭环", flow: "创建工作流 → 校验配置 → 模拟运行 / 回测 → 查看结果与日志" },
      { heading: "尚未证明", items: ["用户是否愿意长期使用", "是否明显降低策略创建成本", "AI 建议能否稳定提升配置成功率", "回测结果是否具备专业投资参考价值", "能否安全接入真实券商"] },
      { heading: "优先验证指标", items: ["首次创建成功率与配置耗时", "节点、参数修改次数", "AI Advice / AI Check 采纳率", "规则、节点与策略理解 Badcase", "用户对模拟结果的理解程度"] },
    ],
    activeNodes: ["market", "indicator", "ai", "signal", "risk", "execute"],
  },
];

export function TradeFlowProjectSection() {
  const project = getProject("tradeflow");
  const [activeId, setActiveId] = useState(chapters[0].id);
  const active = chapters.find((chapter) => chapter.id === activeId) ?? chapters[0];

  return (
    <section id="tradeflow" className="bg-white px-4 py-16 sm:px-7 sm:py-20 lg:px-10 lg:pb-24 lg:pt-24">
      <div className="max-w-[610px]">
        <span className="eyebrow">PROJECT {project.number} · LOW CODE</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-[44px]">
          {project.title}｜低代码策略工作流
        </h2>
        <p className="mt-4 max-w-[520px] text-[11px] leading-5 text-[#707970]">{project.description}</p>
      </div>

      <div className="mb-6 mt-14 flex items-center justify-between gap-4">
        <p className="text-[11px] font-semibold">项目内容演示</p>
        <div className="flex gap-2.5">
          <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#3b5f55] px-5 py-2.5 text-[11px] font-semibold text-white">在线 Demo</Link>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[.72fr_1.14fr_1.14fr] lg:items-stretch lg:gap-2.5">
        <nav aria-label="Trade Flow 项目介绍" className="flex min-w-0 flex-col pr-0 lg:pr-7">
          <div className="mb-4">
            <span className="text-[9px] tracking-[.1em] text-[#8a928a]">PROJECT CONTENT</span>
            <h3 className="mt-1.5 text-sm font-semibold">项目介绍导航</h3>
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-1">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                aria-pressed={chapter.id === activeId}
                onClick={() => setActiveId(chapter.id)}
                className={`flex min-h-[48px] items-center justify-between rounded-[9px] border px-3.5 text-left transition ${chapter.id === activeId ? "border-[#7f978c] bg-[#7f978c] text-[#203b35]" : "border-[#d8dfda] bg-[#f1f4f0] text-[#3b5f55] hover:border-[#8ea298] hover:bg-[#e8eeea]"}`}
              >
                <span className="flex items-center"><span className="mr-2.5 text-[10px] opacity-55">{chapter.number}</span><span className="text-[12px] font-semibold leading-5">{chapter.navTitle}</span></span>
                <span className="ml-2 text-[11px] opacity-50">→</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="order-3 relative aspect-square min-h-[330px] min-w-0 overflow-hidden rounded-[16px] border border-[#dfe3d8] bg-white shadow-[0_8px_18px_rgba(20,20,20,.06)] lg:min-h-0">
          <iframe
            title="Trade Flow 原前端策略编辑器预览"
            src="/tradeflow-app/index.html#/portfolio-canvas"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>

        <article className="order-2 relative flex aspect-square min-h-[330px] min-w-0 flex-col rounded-[16px] border border-[#748c81] bg-[#748c81] p-6 text-white lg:min-h-0">
          <div className="flex items-center justify-between">
            <span className="text-[8px] tracking-[.1em] text-white/45">DETAIL DEMO · {active.number}</span>
          </div>
          <div className="support-copy-scroll mt-6 min-h-0 flex-1 overflow-y-auto pr-2">
            <h3 className="break-words text-xl font-semibold leading-tight tracking-[-.035em] sm:text-2xl">{active.title}</h3>
            <p className="mt-3 text-[16px] leading-7 text-white/80">{active.summary}</p>
            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/15 pt-4">
              {active.sections.map((section, sectionIndex) => (
                active.id === "background" && sectionIndex === 1 ? null :
                <section
                  key={`${active.id}-${sectionIndex}`}
                  className="rounded-[12px] border border-white/15 bg-white/[.045] p-3.5"
                >
                  <div className="mb-3 flex items-baseline gap-2 border-b border-white/10 pb-2.5">
                    <span className="text-[9px] tracking-[.16em] text-white/40">{active.id === "background" && sectionIndex === 0 ? "01 / 02" : String(sectionIndex + 1).padStart(2, "0")}</span>
                    {section.heading && <h4 className="text-[12px] font-semibold tracking-[.04em] text-white/95">{section.heading}</h4>}
                  </div>
                  {section.body && <p className="text-[14px] leading-[1.9] text-white/80">{section.body}</p>}
                  {section.flow && <p className="text-[14px] font-medium leading-[1.85] text-white/95">{section.flow}</p>}
                  {section.items && (
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-[14px] leading-[1.85] text-white/85">
                          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#a9b480]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {active.id === "background" && sectionIndex === 0 && active.sections[1].items && (
                    <ul className="mt-3 space-y-2 border-t border-white/10 pt-3">
                      {active.sections[1].items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-[14px] leading-[1.85] text-white/85">
                          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#a9b480]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

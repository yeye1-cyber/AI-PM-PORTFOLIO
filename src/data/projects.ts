export type Project = {
  id: "support" | "knowledge" | "tradeflow";
  number: string;
  title: string;
  description: string;
  tags: string[];
  detailUrl: string;
  demoUrl: string;
  prototypeUrl: string;
  coverImage: string;
};

export type SupportFeature = {
  id: string;
  label: string;
  number: string;
  title: string;
  conclusion: string;
  paragraphs: string[];
  videoUrl?: string;
};

export const supportFeatures: SupportFeature[] = [
  {
    id: "background", label: "项目背景", number: "01", title: "从情绪压力到行动停滞",
    conclusion: "当用户因学习压力陷入焦虑时，AI 如何先接住情绪，再陪他迈出一个不增加压力的小步骤？",
    paragraphs: [
      "信息时代，知识工作者常因信息过载、任务堆积和自我否定而难以开始。",
      "普通待办工具只能记录任务；通用聊天机器人虽然能够安慰，却容易回应空泛，难以延续到实际行动。",
    ],
  },
  {
    id: "positioning", label: "产品定位", number: "02", title: "AI陪伴产品",
    conclusion: "接住猫位于“情绪陪伴”和“任务管理”之间。",
    paragraphs: [
      "面向学习内容过载人群，产品不以催促和效率为第一目标，并允许用户选择暂时不行动。",
      "核心闭环｜情绪表达 → AI 理解与安慰 → 用户确认或纠正 → 自主选择是否行动 → 生成轻量建议 → 转化为计划 → 按需逐层拆解。",
    ],
  },
  {
    id: "content", label: "核心功能", number: "03", title: "从理解情绪到渐进式拆解",
    conclusion: "行动只在用户主动选择后发生，并从一个足够小的第一步开始。",
    paragraphs: [
      "情绪陪伴｜识别情绪处境与核心矛盾，提供温和回应；用户可以确认、纠正或继续陪伴。",
      "轻量建议｜仅在用户主动选择后，生成一个建议方向和足够小的第一步，避免一次提供大量任务。",
      "自然语言计划｜将模糊表达整理为轻量任务，保留不同目标，仅合并真正重复的内容。",
      "渐进式拆解｜将任务逐层拆为有顺序、可勾选的子任务，减少完整任务列表带来的压迫感。",
    ],
  },
  {
    id: "ai", label: "AI 设计", number: "04", title: "拆开 AI 任务，让每一步更可控",
    conclusion: "不使用一个 Prompt 处理所有问题，而是把能力拆成四类固定工作流。",
    paragraphs: [
      "能力与输出｜情绪理解：情绪处境、核心矛盾、安慰回应；建议生成：一个建议方向、一个小步骤；计划生成：1—6 项可执行任务；任务拆解：3—7 项顺序子任务。",
      "模型使用固定 JSON 输出，由系统映射到界面，以保持结构稳定，并支持失败检测与后续评测。四类 Prompt 均可在“咪的知识库”中查看、修改和恢复默认，便于记录 Badcase、调整 Prompt 并复测。",
      "安全边界｜不进行心理诊断、不编造经历、不用羞耻或催促推动行动、不强制把负面情绪转成任务；AI 失败时明确提示，API Key 仅保存在服务端。",
    ],
  },
  {
    id: "decision", label: "产品决策", number: "05", title: "稳定、克制，并把节奏交还用户",
    conclusion: "情绪优先，用户掌握节奏，并持续降低启动成本。",
    paragraphs: [
      "情绪优先｜先理解用户为何卡住，再讨论计划。用户掌握节奏｜建议必须由用户主动触发。降低启动成本｜优先给一个小步骤，而非完整方案。",
      "固定工作流｜当前不引入多 Agent，优先保证稳定、可控和可评测。",
      "本地知识连接｜只读连接 Obsidian Markdown，目前用于补充个人背景，尚未实现完整 RAG。",
    ],
  },
  {
    id: "progress", label: "当前进度", number: "06", title: "核心体验已可运行，验证与安全仍在补齐",
    conclusion: "已完成可运行原型，跑通“情绪表达—AI 理解—建议生成—任务拆解”的产品闭环。",
    paragraphs: [
      "已完成｜情绪分析、安慰、纠正与建议生成；自然语言计划及两级任务拆解；Prompt 查看、编辑与恢复默认；聊天记录与任务状态本地保存；AI 超时、冷却与一次重试；OpenAI-compatible 服务端模型接入；Obsidian 文件夹只读连接；Next.js Web 交互原型。",
      "下一阶段｜建立情绪理解、建议质量和任务拆解评测集；记录 Badcase、Prompt 修改及复测结果；开展真实用户可用性测试；补强高风险情绪安全降级；验证不同模型的质量、时延与成本；完善部署 Demo、演示脚本和作品集数据。",
      "现阶段准确表述｜已完成可运行的 AI 情绪陪伴与行动助手原型；下一阶段将通过评测集和用户测试验证回应质量。",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "support",
    number: "01",
    title: "接住猫｜面向知识工作者的 AI 陪伴产品",
    description: "面向学习内容过载人群，连接情绪陪伴与任务管理：",
    tags: ["AI 陪伴", "情绪支持", "行动设计"],
    detailUrl: "#",
    demoUrl: "/jiezhu",
    prototypeUrl: "#",
    coverImage: "/placeholders/support.svg",
  },
  {
    id: "knowledge",
    number: "03",
    title: "AI 知识行动与抗拖延助手",
    description: "基于 Obsidian 的智能插件，将笔记与收藏转化为可复习、可关联、可执行的个人知识系统。",
    tags: ["Obsidian 插件", "知识管理", "AI 工作流"],
    detailUrl: "#",
    demoUrl: "#",
    prototypeUrl: "#",
    coverImage: "/placeholders/knowledge.svg",
  },
  {
    id: "tradeflow",
    number: "02",
    title: "Trade Flow",
    description: "通过节点化编排，将市场数据、指标计算、策略判断、交易执行与风控连接成完整交易链路。",
    tags: ["可视化编排", "金融科技", "策略工作流"],
    detailUrl: "#",
    demoUrl: "/tradeflow-app/index.html#/flow/editor/1",
    prototypeUrl: "#",
    coverImage: "/placeholders/tradeflow.svg",
  },
];

export const getProject = (id: Project["id"]) =>
  projects.find((project) => project.id === id)!;

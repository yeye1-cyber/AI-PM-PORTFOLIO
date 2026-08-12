type DemoEmotionInput = {
  selectedTags?: string[];
  text?: string;
};

export function demoEmotionAnalysis(emotion: DemoEmotionInput) {
  const tags = emotion.selectedTags?.filter(Boolean).join("、") || "有些疲惫和焦虑";
  return {
    heard: `我听见你现在有${tags}，事情堆在一起时，连开始都会变得很费力。`,
    core: "你卡住的不是能力不够，而是信息和任务同时涌来，让下一步变得不清楚。",
    comfort: "先不用逼自己立刻振作。我们可以把压力放小一点，你也可以只在这里待一会儿。",
  };
}

export function demoEmotionAdvice() {
  return {
    suggestion: "先从最想推进的一件事里，只选一个能够看见进展的小方向。",
    firstStep: "打开对应资料，只写下今天最想弄明白的一个问题；做到这里就可以停。",
  };
}

export function demoPlan(input: string) {
  const compact = input.replace(/\s+/g, " ").trim();
  if (/作品集|求职|简历/.test(compact)) {
    return ["选定今天要完善的一个项目", "补充这个项目的问题与目标", "整理一段有证据的核心成果", "检查措辞并保存当前版本"];
  }
  if (/学习|课程|AI|知识/.test(compact)) {
    return ["确定今天要理解的一个主题", "阅读一份核心材料", "记下三个关键点", "写下一个仍然不清楚的问题"];
  }
  return ["确认这件事今天最重要的目标", "收集开始所需的材料", "完成一个最小步骤", "记录结果并决定是否继续"];
}

export function demoSplit(task: string) {
  const shortTask = task.trim().slice(0, 32) || "当前任务";
  return [`明确“${shortTask}”的完成标准`, "准备需要的资料或工具", "完成最小可交付部分", "快速检查并保存结果"];
}

export function demoChatReply(message: string) {
  if (/不想|不做|休息|累/.test(message)) {
    return "可以呀，今天不行动也没关系。先让自己缓一缓，我会在这里陪着你。";
  }
  if (/焦虑|担心|害怕|来不及/.test(message)) {
    return "听起来你像是被很多担心一起围住了。先不用把它们全部解决，你愿意告诉我此刻最压着你的那一件事吗？";
  }
  return "我听见了。我们不用急着得出答案；如果你愿意，可以再说一点现在最难受或最卡住的地方。";
}

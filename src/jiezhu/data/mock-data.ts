import type { MicroAction, SupportResponse } from "@jiezhu/types/support";

export const emotions = ["难过", "急躁", "懊悔", "焦虑", "很累", "说不上来"];

export const understandingSteps = [
  "正在听懂你刚才发生了什么",
  "正在结合你的求职目标",
  "正在寻找与你当前处境相关的进展",
  "正在判断你现在更需要什么",
];

export const supportResponses: SupportResponse[] = [
  {
    heard:
      "你难受的不只是岗位写了“需要实习经历”，而是担心过去没有早点准备，会不会已经影响了现在的机会。",
    hardest:
      "你已经投入了很多时间，但仍然不知道这些努力能不能被招聘方认可。",
    evidence:
      "你已经完成了两个能够演示的 AI 产品项目。现在更缺的是把经历对应到岗位要求，而不是重新证明自己有没有能力。",
  },
  {
    heard:
      "你更在意的也许不是错过了过去，而是眼前的信息太多，让你不知道该从哪里确认自己还有机会。",
    hardest:
      "每一条岗位要求都像在提醒你还欠缺什么，这让已经做过的努力很难被你自己看见。",
    evidence:
      "你手里已有可以展示的项目成果。下一步可以先验证其中一项成果能否对应岗位，而不是一次回答所有不确定。",
  },
];

export const companionMessage =
  "可以，我们先不急着解决它。你已经撑着这份不确定走了一段路，现在想停一下，不代表你放弃了。";

export const microActions: MicroAction[] = [
  {
    text: "把你最想投的一条岗位描述复制进来。",
    minutes: 2,
    reason:
      "现在不需要证明自己完全符合岗位，只需要先找到一项你已经覆盖的要求。",
  },
  {
    text: "从收藏里选出一条你愿意再看一眼的岗位。",
    minutes: 1,
    reason: "先确定一个具体对象，就不用同时面对所有岗位带来的压力。",
  },
  {
    text: "写下你两个项目的名称，不需要补充介绍。",
    minutes: 1,
    reason: "先把已经完成的事情放到眼前，再决定之后是否继续整理。",
  },
];

export const refinedActions = [
  "打开保存岗位信息的页面，暂时不用复制内容。",
  "拿起手机或点亮电脑屏幕。",
  "先不用行动，做一次缓慢呼吸，然后告诉我“我还在”。",
];

export const minimumActionMessage =
  "现在可能不是继续拆任务的时候。我们先停下来也可以。";

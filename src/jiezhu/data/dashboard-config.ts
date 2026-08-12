export const greetings = [
  "人，今天怎么样呀，有没有什么咪可以帮你的捏？",
  "保持开心才能够把事情做好哦。",
];

export const moodTags = [
  "开心", "明朗", "宁静", "憧憬", "雀跃",
  "期待", "释然", "笃定", "难过", "急躁",
  "懊悔", "焦虑", "慌乱", "很累", "说不上来",
];

export const analysisCopy = [
  "我听见你不只是累，也在担心自己的努力是不是还来得及被看见。你好像已经花了很多力气向前走，但事情仍然一件接着一件出现，让你很难确认自己究竟有没有做好。那些没有得到及时回应的努力，也会慢慢变成一种委屈和不确定。你可能一边告诉自己应该再坚持一下，一边又怀疑是不是只有自己跟不上节奏。其实你已经承受了很长一段时间，只是习惯了继续处理事情，没有给自己的疲惫留下被看见的位置。现在愿意把这些感受说出来，本身就是在照顾那个一直努力撑着的自己。",
  "当信息、任务和别人的期待同时压过来时，很难立刻判断应该先处理哪一件。脑子里明明装着很多事情，真正准备行动时却像被堵住了，这并不代表你不够努力，也不是你的能力突然消失了，而是你现在需要先获得一点喘息和清晰的空间。当每件事都显得重要时，大脑会不断切换注意力，最后反而什么都无法安心开始。你可能因此责怪自己拖延，但这种停滞更像是负荷过量后的保护反应。先承认此刻确实很难，再慢慢区分哪些是现在必须回应的，哪些可以稍晚一点，并不会让事情变得更糟。",
  "我们暂时不需要证明自己能够一次解决所有问题，也不用马上给未来找到一个完整答案。可以先陪你把最担心的事情放到桌面上，再从里面找出一个今天能够完成的小动作。哪怕只是打开一份材料、写下一句话，或者允许自己休息十分钟，也是在重新拿回对生活的掌控感。等这个小动作完成后，我们再看看身体和情绪有没有松动一点，然后决定要不要继续下一步。如果今天只能完成这一件事，也不意味着你落后了。真正重要的是把行动重新调整到你现在能够承受的大小，让每一次开始都不需要消耗全部力气。",
];

export const adviceCopy = [
  "先打开你最想投的一条岗位信息，只看标题和要求，不急着修改简历。",
  "从已有项目里挑一个最接近岗位要求的成果，写下一句对应关系。",
];

export const listeningCopy = [
  "已经收到你的情绪记录",
  "正在结合你提供的内容",
  "正在整理真正困扰你的部分",
  "咪正在认真想一想",
];

const trackAudio = [
  { title: "ocean", audioUrl: "/api/music/m1" },
  { title: "morning", audioUrl: "/api/music/m2" },
];

export const playerTracks = Array.from({ length: 8 }, (_, index) => ({
  id: `cat-${index + 1}`,
  title: trackAudio[index]?.title
    ?? ["林间散步", "安静发呆", "伸个懒腰", "快乐跑跑", "清晨舒展", "暖暖午睡", "翻开小书", "浇一浇花"][index],
  audioUrl: trackAudio[index]?.audioUrl ?? "",
  enabled: Boolean(trackAudio[index]),
}));

export const workspaceActions = [
  { id: "advice", label: "建议", enabled: true },
  { id: "plan", label: "计划", enabled: false },
  { id: "listen", label: "倾听", enabled: false },
  { id: "review", label: "复盘", enabled: false },
  { id: "search", label: "查找", enabled: false },
  { id: "note", label: "记录", enabled: false },
  { id: "rest", label: "休息", enabled: false },
  { id: "more", label: "更多", enabled: false },
];

export const toolbarItems = ["花篮", "玻璃瓶", "茶杯", "书本", "蝴蝶", "蘑菇", "信封"];

import { CozyDashboard } from "@jiezhu/features/dashboard/cozy-dashboard";

export const metadata = {
  title: "接住猫｜作品集交互演示",
  description: "接住猫 AI 情绪陪伴与行动助手作品集演示。",
};

export default function JiezhuDemoPage() {
  const demoMode = !process.env.AI_API_KEY || !process.env.AI_BASE_URL || !process.env.AI_MODEL;
  return <CozyDashboard demoMode={demoMode} />;
}

import { CozyDashboard } from "@jiezhu/features/dashboard/cozy-dashboard";

export default function Home() {
  const demoMode = !process.env.AI_API_KEY || !process.env.AI_BASE_URL || !process.env.AI_MODEL;
  return <CozyDashboard demoMode={demoMode} />;
}

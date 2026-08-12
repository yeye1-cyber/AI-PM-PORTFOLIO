import { Header } from "@/components/sections/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { KnowledgeProjectSection } from "@/components/sections/KnowledgeProjectSection";
import { SupportProjectSection } from "@/components/sections/SupportProjectSection";
import { TradeFlowProjectSection } from "@/components/sections/TradeFlowProjectSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="site-frame overflow-x-clip">
      <div className="site-panel">
        <Header />
        <HeroSection />
        <SupportProjectSection />
        <TradeFlowProjectSection />
        <KnowledgeProjectSection />
        <Footer />
      </div>
    </main>
  );
}

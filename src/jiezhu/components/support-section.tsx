import { EvidenceCard } from "@jiezhu/components/evidence-card";
import type { SupportResponse } from "@jiezhu/types/support";

export function SupportSection({ response }: { response: SupportResponse }) {
  return (
    <div className="support-stack">
      <EvidenceCard title="我听到的是">{response.heard}</EvidenceCard>
      <EvidenceCard title="你现在可能最难受的是">
        {response.hardest}
      </EvidenceCard>
      <EvidenceCard title="有一个事实值得提醒你" emphasized>
        {response.evidence}
      </EvidenceCard>
    </div>
  );
}

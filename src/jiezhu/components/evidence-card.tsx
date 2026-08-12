type EvidenceCardProps = {
  title: string;
  children: React.ReactNode;
  emphasized?: boolean;
};

export function EvidenceCard({
  title,
  children,
  emphasized = false,
}: EvidenceCardProps) {
  return (
    <section className="evidence-card" data-emphasized={emphasized}>
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  );
}

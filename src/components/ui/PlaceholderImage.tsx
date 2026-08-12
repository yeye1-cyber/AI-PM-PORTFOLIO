import Image from "next/image";

export function PlaceholderImage({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-[#dfe2d5] ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 1100px" className="object-cover" />
    </div>
  );
}

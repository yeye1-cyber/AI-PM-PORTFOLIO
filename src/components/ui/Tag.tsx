import type { ReactNode } from "react";

export function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${dark ? "border-white/20 bg-white/5 text-white/75" : "border-[#17231c]/10 bg-white/55 text-[#52645a]"}`}>
      {children}
    </span>
  );
}

import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "outlineLight";
  className?: string;
};

const styles = {
  primary: "bg-[#163e2b] text-white hover:bg-[#0e2d1f]",
  secondary: "border border-[#17231c]/15 bg-white/70 text-[#17231c] hover:bg-white",
  light: "bg-[#f2f1e9] text-[#163e2b] hover:bg-white",
  outlineLight: "border border-white/25 text-white hover:bg-white/10",
};

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-200 ${styles[variant]} ${className}`}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

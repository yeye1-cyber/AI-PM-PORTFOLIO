import type { Metadata } from "next";
import { LiquidRefractionBackground } from "@/components/LiquidRefractionBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIPM作品集",
  description: "把复杂的 AI 能力，转化为用户真正能使用的产品。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body>
        <LiquidRefractionBackground />
        {children}
      </body>
    </html>
  );
}

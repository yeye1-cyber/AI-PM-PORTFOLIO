import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "接住｜先接住情绪，再陪你动一步",
  description: "面向求职与转行人群的情绪行动助手原型",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { MockAuthProvider } from "@/lib/mock-auth"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Engineering Demo Platform - 企业级架构演示",
  description: "探索企业级 AI/ML 系统架构、最佳实践和工程实现的交互式演示平台",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans antialiased`}>
        <MockAuthProvider>
          {children}
          <Toaster />
        </MockAuthProvider>
      </body>
    </html>
  )
}

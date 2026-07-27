/**
 * 演示案例页面模板
 *
 * 使用说明:
 * 1. 复制此文件到 app/demos/[your-demo-id]/page.tsx
 * 2. 替换所有 TODO 标记的内容
 * 3. 根据需要添加或删除 Tab
 * 4. 在 app/page.tsx 中注册案例
 */

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, PlayCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// TODO: 定义你的数据结构
const demoData = [
  {
    id: 1,
    title: "示例步骤",
    description: "这是一个示例描述",
    example: "示例代码或数据",
  },
]

export default function DemoTemplatePage() {
  const [activeStep, setActiveStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // TODO: 实现你的交互逻辑
  const simulateDemo = () => {
    setIsRunning(true)
    // 添加动画或状态更新逻辑
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ========== Header ========== */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-3 -ml-3">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            {/* TODO: 替换图标 */}
            <span className="text-4xl">🎯</span>
            {/* TODO: 替换标题 */}
            <span className="text-balance">你的案例标题</span>
          </h1>
          {/* TODO: 替换描述 */}
          <p className="text-muted-foreground mt-2 text-lg">一句话说明这个案例的核心价值</p>
        </div>
      </header>

      {/* ========== Main Content ========== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          {/* TODO: 根据需要调整 Tab 数量和标题 */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">📖 概述</TabsTrigger>
            <TabsTrigger value="architecture">🏗️ 架构</TabsTrigger>
            <TabsTrigger value="demo">🎬 演示</TabsTrigger>
            <TabsTrigger value="details">🔍 详情</TabsTrigger>
          </TabsList>

          {/* ========== Tab 1: 概述 ========== */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
              {/* TODO: 添加案例介绍 */}
              <h2 className="text-2xl font-bold text-foreground mb-4">什么是 [技术名称]？</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                详细介绍这个技术的背景、应用场景和核心价值...
              </p>

              {/* 核心特性卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-primary/30">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">特性一</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">描述这个特性...</p>
                </Card>

                <Card className="p-6 border-2 border-primary/30">
                  <div className="text-3xl mb-3">🛠️</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">特性二</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">描述这个特性...</p>
                </Card>

                <Card className="p-6 border-2 border-primary/30">
                  <div className="text-3xl mb-3">🔄</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">特性三</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">描述这个特性...</p>
                </Card>
              </div>
            </Card>
          </TabsContent>

          {/* ========== Tab 2: 架构 ========== */}
          <TabsContent value="architecture" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">系统架构</h2>
              {/* TODO: 添加架构图或组件说明 */}
              <p className="text-muted-foreground mb-6 leading-relaxed">说明整体架构设计...</p>
            </Card>
          </TabsContent>

          {/* ========== Tab 3: 交互演示 ========== */}
          <TabsContent value="demo" className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">交互演示</h2>
                  <p className="text-muted-foreground">点击按钮查看完整流程</p>
                </div>
                <Button onClick={simulateDemo} disabled={isRunning} size="lg" className="gap-2">
                  <PlayCircle className="w-5 h-5" />
                  {isRunning ? "执行中..." : "开始演示"}
                </Button>
              </div>

              {/* TODO: 添加你的交互组件 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {demoData.map((item, index) => (
                  <Card
                    key={item.id}
                    className={`p-4 transition-all duration-500 ${
                      activeStep === index ? "bg-primary/10 border-primary ring-2 ring-primary" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        步骤 {item.id}
                      </Badge>
                      {activeStep > index && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ========== Tab 4: 技术详情 ========== */}
          <TabsContent value="details" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">技术实现细节</h2>
              {/* TODO: 添加代码示例、API 说明等 */}
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                  <h3 className="text-lg font-bold text-foreground mb-2">实现要点</h3>
                  <p className="text-muted-foreground leading-relaxed">说明关键技术点...</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

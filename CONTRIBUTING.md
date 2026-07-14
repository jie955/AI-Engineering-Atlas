# 如何添加新的工程演示案例

本文档说明如何在 AI Engineering Demo Platform 中添加新的演示案例。

## 📋 添加新案例的步骤

### 1️⃣ 在首页注册新案例

编辑 `app/page.tsx`，在 `demos` 数组中添加新项：

\`\`\`typescript
const demos = [
  // ... 现有案例 ...
  {
    id: "your-demo-id",              // URL 路径标识，使用 kebab-case
    title: "你的案例标题",            // 在首页卡片显示
    description: "简短描述（1-2 句话）", // 案例的核心特性
    category: "RAG",                 // 可选: RAG, Agent, 大模型, 多模态, 工程化
    difficulty: "中级" as const,     // 入门, 基础, 中级, 高级, 专家
    status: "active" as const,       // active 或 coming-soon
  },
]
\`\`\`

**难度级别参考：**
- 入门：单一技术点展示
- 基础：基础架构实现
- 中级：完整系统设计
- 高级：复杂集成方案
- 专家：企业级多系统架构

---

### 2️⃣ 创建演示页面文件

在 `app/demos/` 目录下创建新文件夹：

\`\`\`bash
app/demos/your-demo-id/page.tsx
\`\`\`

---

### 3️⃣ 使用页面模板

复制以下模板代码到 `page.tsx`：

\`\`\`tsx
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, PlayCircle } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function YourDemoPage() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header - 保持一致的页面头部设计 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-3 -ml-3">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <span className="text-4xl">🎯</span> {/* 替换为合适的图标 */}
            <span className="text-balance">你的案例标题</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            一句话描述核心价值
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs - 建议使用标签页组织内容 */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">📖 概述</TabsTrigger>
            <TabsTrigger value="demo">🎬 演示</TabsTrigger>
            <TabsTrigger value="details">🔍 详情</TabsTrigger>
          </TabsList>

          {/* Tab 1: 概述 */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                案例介绍
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                详细说明这个案例展示的技术点和应用场景...
              </p>
            </Card>
          </TabsContent>

          {/* Tab 2: 交互演示 */}
          <TabsContent value="demo" className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  交互演示
                </h2>
                <Button size="lg" className="gap-2">
                  <PlayCircle className="w-5 h-5" />
                  开始演示
                </Button>
              </div>
              {/* 添加你的交互组件 */}
            </Card>
          </TabsContent>

          {/* Tab 3: 技术详情 */}
          <TabsContent value="details" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                技术实现
              </h2>
              {/* 添加架构图、代码示例等 */}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
\`\`\`

---

## 🎨 设计规范

### 配色系统
遵循现有的深色主题设计，使用语义化 Tailwind 类：

\`\`\`tsx
// ✅ 推荐：使用语义化 token
<div className="bg-background text-foreground border-border">

// ❌ 避免：硬编码颜色
<div className="bg-slate-950 text-white border-gray-800">
\`\`\`

### 排版层次
\`\`\`tsx
// 页面标题
<h1 className="text-3xl font-bold text-foreground">

// 区块标题
<h2 className="text-2xl font-bold text-foreground mb-4">

// 小节标题
<h3 className="text-xl font-bold text-foreground mb-2">

// 正文
<p className="text-muted-foreground leading-relaxed">
\`\`\`

### 交互效果
\`\`\`tsx
// 卡片悬停效果
<Card className="transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">

// 按钮状态
<Button disabled={isLoading} className="gap-2">
  {isLoading ? "执行中..." : "开始"}
</Button>
\`\`\`

---

## 🧩 常用组件

### 徽章标签
\`\`\`tsx
<Badge variant="secondary">RAG</Badge>
<Badge variant="outline">中级</Badge>
<Badge className="text-xs">步骤 1</Badge>
\`\`\`

### 信息卡片
\`\`\`tsx
<Card className="p-6 border-l-4 border-primary">
  <h3 className="text-lg font-bold mb-2">标题</h3>
  <p className="text-muted-foreground">内容</p>
</Card>
\`\`\`

### 步骤流程
参考 `single-agent/page.tsx` 中的步骤展示方式，使用网格布局 + 状态高亮。

---

## 📦 数据组织

如果案例包含复杂数据，建议创建独立文件：

\`\`\`
app/demos/your-demo-id/
  ├── page.tsx              # 主页面组件
  ├── data.ts               # 数据定义
  ├── components/           # 私有组件（可选）
  │   └── demo-chart.tsx
  └── loading.tsx           # 加载状态（如果需要）
\`\`\`

示例 `data.ts`：
\`\`\`typescript
export const demoSteps = [
  {
    id: 1,
    title: "步骤标题",
    description: "详细说明",
    example: "代码或数据示例",
  },
  // ...
]
\`\`\`

---

## ✅ 提交前检查清单

- [ ] 在 `app/page.tsx` 的 `demos` 数组中注册
- [ ] 创建 `app/demos/your-demo-id/page.tsx`
- [ ] 确保使用语义化 Tailwind 类（不硬编码颜色）
- [ ] 添加返回首页按钮
- [ ] 包含至少 2-3 个 Tab 组织内容
- [ ] 提供交互演示或可视化内容
- [ ] 响应式设计（移动端适配）
- [ ] 文案通顺，技术术语准确

---

## 🔍 参考案例

- **简单案例**：`app/demos/prompt-optimizer/page.tsx`
- **中等复杂度**：`app/demos/single-agent/page.tsx`
- **高复杂度**：`app/demos/rag-decision/page.tsx`

---

## 🆘 需要帮助？

如果在添加新案例时遇到问题，可以：
1. 参考现有案例的实现方式
2. 检查 `app/globals.css` 中的设计 token 定义
3. 查看 `components/ui/` 中可用的基础组件

---

**遵循这些规范，你可以快速添加专业且一致的工程演示案例！** 🚀

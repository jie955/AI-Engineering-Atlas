"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowUpRight, TrendingUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DemoBrowser } from "@/components/demo-browser"
import { demos } from "@/lib/demos"
import { tracks } from "@/lib/mock-store"

const AIKnowledgeGraph = dynamic(
  () => import("@/components/ai-knowledge-graph").then((m) => m.AIKnowledgeGraph),
  { ssr: false },
)

const marqueeTags = [
  "Prompt Engineering",
  "Context Engineering",
  "MCP",
  "Skills",
  "Single Agent",
  "Runtime Loop",
  "Memory",
  "RAG",
  "GraphRAG",
  "Multi-Agent",
  "Harness",
  "Loop Engineering",
]

export default function HomePage() {
  const totalHours = tracks.reduce((sum, t) => sum + t.estimatedHours, 0)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        {/* 3D graph backdrop */}
        <div className="absolute inset-0 opacity-60">
          <AIKnowledgeGraph />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-6 py-24">
          <Badge
            variant="secondary"
            className="mb-8 w-fit bg-background/70 px-4 py-2 text-sm backdrop-blur-md"
          >
            <Sparkles className="mr-2 inline h-4 w-4" />
            交互式 AI 工程学习平台
          </Badge>

          <h1 className="text-display max-w-4xl text-5xl text-foreground sm:text-7xl lg:text-8xl">
            从<span className="text-gradient"> 提示词 </span>
            到
            <br />
            <span className="text-gradient">多智能体系统</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            12 个交互式工程案例，4 条渐进式学习轨道。点击 3D 知识图谱节点，或沿轨道系统性掌握现代 AI 工程。
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="group text-base" asChild>
              <Link href="/roadmap">
                开始学习之旅
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-base" asChild>
              <Link href="#demos">浏览案例库</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap gap-10">
            <div>
              <div className="text-display text-4xl text-foreground">{demos.length}</div>
              <div className="text-eyebrow mt-1 text-xs text-muted-foreground">工程案例</div>
            </div>
            <div>
              <div className="text-display text-4xl text-foreground">{tracks.length}</div>
              <div className="text-eyebrow mt-1 text-xs text-muted-foreground">学习轨道</div>
            </div>
            <div>
              <div className="text-display text-4xl text-foreground">{totalHours}h</div>
              <div className="text-eyebrow mt-1 text-xs text-muted-foreground">总时长</div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="overflow-hidden border-b border-hairline bg-card/30 py-5">
        <div className="flex w-max animate-marquee gap-8">
          {[...marqueeTags, ...marqueeTags].map((tag, i) => (
            <span key={i} className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
              {tag}
              <span className="text-primary">◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* Demos */}
      <section id="demos" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-eyebrow mb-3 text-xs text-primary">案例库</p>
          <h2 className="text-display text-4xl text-foreground sm:text-5xl">工程演示案例</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            按学习轨道组织，从基础到专家逐级进阶。每个案例都是可交互的完整实现。
          </p>
        </div>
        <DemoBrowser />
      </section>

      {/* Market opportunity */}
      <section className="border-t border-hairline bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <p className="text-eyebrow mb-3 flex items-center gap-2 text-xs text-primary">
              <TrendingUp className="h-4 w-4" />
              市场机遇
            </p>
            <h2 className="text-display text-4xl text-foreground sm:text-5xl">AI 工程师需求持续高涨</h2>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
            {[
              { value: "340%", label: "岗位增长率", accent: "text-primary" },
              { value: "45-80K", label: "月薪范围", accent: "text-chart-2" },
              { value: "5:1", label: "人才供需比", accent: "text-chart-3" },
              { value: "33%", label: "企业将集成 Agent", accent: "text-chart-4" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card p-8">
                <div className={`text-display text-4xl ${stat.accent}`}>{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-card p-8 sm:flex-row sm:items-center">
            <p className="max-w-xl text-pretty text-base italic text-muted-foreground">
              “到 2028 年，33% 的企业软件将包含 AI Agent 组件” — Gartner 2026
            </p>
            <Button size="lg" className="group shrink-0" asChild>
              <Link href="/roadmap">
                立即开始
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

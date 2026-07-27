"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Brain,
  ListChecks,
  Wrench,
  Zap,
  Eye,
  GitBranch,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import Link from "next/link"

type PhaseId = "think" | "plan" | "act" | "observe" | "reflect"

interface Phase {
  id: PhaseId
  label: string
  sublabel: string
  icon: typeof Brain
  color: string
}

const phases: Phase[] = [
  { id: "think", label: "思考", sublabel: "Reason", icon: Brain, color: "var(--chart-1)" },
  { id: "plan", label: "规划", sublabel: "Plan", icon: ListChecks, color: "var(--chart-2)" },
  { id: "act", label: "行动", sublabel: "Act", icon: Zap, color: "var(--chart-3)" },
  { id: "observe", label: "观察", sublabel: "Observe", icon: Eye, color: "var(--chart-4)" },
  { id: "reflect", label: "反思", sublabel: "Reflect", icon: GitBranch, color: "var(--chart-5)" },
]

interface TraceEntry {
  iteration: number
  phase: PhaseId
  content: string
  tool?: string
}

// Scripted runtime trace simulating an agent solving a task
const scriptedTrace: TraceEntry[] = [
  { iteration: 1, phase: "think", content: "用户想了解过去 3 年全球 AI 投资趋势。我需要先获取数据，再分析、最后生成报告。" },
  { iteration: 1, phase: "plan", content: "计划：1) 检索投资数据 2) 统计分析 3) 生成图表 4) 输出报告" },
  { iteration: 1, phase: "act", content: '调用检索工具获取 2023-2025 投资数据', tool: "search_api" },
  { iteration: 1, phase: "observe", content: "返回 1,500 条记录，字段含 year/region/amount/category" },
  { iteration: 1, phase: "reflect", content: "数据完整度 85%，缺少部分地区。可继续分析，无需重新检索。" },
  { iteration: 2, phase: "think", content: "数据已就绪。需要按年份和地区聚合，识别增长趋势。" },
  { iteration: 2, phase: "plan", content: "计划：使用数据分析工具进行分组统计与同比计算" },
  { iteration: 2, phase: "act", content: "执行 pandas 聚合：groupby(year, region).sum()", tool: "code_interpreter" },
  { iteration: 2, phase: "observe", content: "得到年度趋势：2023→2024 增长 42%，2024→2025 增长 38%" },
  { iteration: 2, phase: "reflect", content: "趋势清晰，结果可信。准备进入可视化与报告生成。" },
  { iteration: 3, phase: "think", content: "最后一步：将分析结果转换为图表并组装为 PDF 报告。" },
  { iteration: 3, phase: "plan", content: "计划：生成趋势折线图 + 地区分布饼图，嵌入报告模板" },
  { iteration: 3, phase: "act", content: "调用图表工具与文档生成器", tool: "chart_render" },
  { iteration: 3, phase: "observe", content: "成功生成 report.pdf，包含 2 张图表与分析结论" },
  { iteration: 3, phase: "reflect", content: "目标已达成，所有成功标准满足。结束循环。" },
]

const SPEED_MS = 1400

export default function AgentRuntimeLoopPage() {
  const [running, setRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1)
  const [trace, setTrace] = useState<TraceEntry[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const traceEndRef = useRef<HTMLDivElement | null>(null)

  const isDone = stepIndex >= scriptedTrace.length - 1
  const currentEntry = stepIndex >= 0 ? scriptedTrace[stepIndex] : null
  const activePhase = currentEntry?.phase ?? null
  const currentIteration = currentEntry?.iteration ?? 0

  const advance = useCallback(() => {
    setStepIndex((prev) => {
      const next = prev + 1
      if (next >= scriptedTrace.length) {
        setRunning(false)
        return prev
      }
      setTrace((t) => [...t, scriptedTrace[next]])
      return next
    })
  }, [])

  useEffect(() => {
    if (running && !isDone) {
      timerRef.current = setTimeout(advance, SPEED_MS)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [running, stepIndex, isDone, advance])

  useEffect(() => {
    traceEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [trace])

  const handlePlayPause = () => {
    if (isDone) return
    setRunning((r) => !r)
  }

  const handleReset = () => {
    setRunning(false)
    setStepIndex(-1)
    setTrace([])
  }

  const handleStep = () => {
    if (isDone || running) return
    advance()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Agent</Badge>
            <Badge variant="outline" className="text-xs">
              中级
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Title */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
            Agent Runtime Loop
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            实时观察智能体的运行时循环：Think → Plan → Act → Observe → Reflect，
            循环迭代直至目标达成
          </p>
        </div>

        {/* Loop Visualization */}
        <Card className="p-8">
          <div className="flex flex-col items-center gap-8">
            {/* Phase Ring */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-2">
              {phases.map((phase, idx) => {
                const Icon = phase.icon
                const isActive = activePhase === phase.id
                return (
                  <div key={phase.id} className="flex items-center gap-3 md:gap-2">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-500"
                        style={{
                          borderColor: isActive ? phase.color : "var(--border)",
                          backgroundColor: isActive ? phase.color : "transparent",
                          transform: isActive ? "scale(1.12)" : "scale(1)",
                          boxShadow: isActive ? `0 0 24px -2px ${phase.color}` : "none",
                        }}
                      >
                        <Icon
                          className="h-7 w-7 transition-colors duration-500"
                          style={{ color: isActive ? "var(--background)" : "var(--muted-foreground)" }}
                        />
                        {isActive && running && (
                          <span
                            className="absolute inset-0 rounded-full border-2 animate-ping"
                            style={{ borderColor: phase.color }}
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <div
                          className="text-sm font-semibold transition-colors duration-300"
                          style={{ color: isActive ? phase.color : "var(--foreground)" }}
                        >
                          {phase.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {phase.sublabel}
                        </div>
                      </div>
                    </div>
                    {idx < phases.length - 1 && (
                      <ArrowLeft
                        className="h-4 w-4 rotate-180 text-muted-foreground/40 hidden md:block"
                        aria-hidden
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Loop-back indicator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>未达成目标时，从 Reflect 循环回 Think</span>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={handlePlayPause} disabled={isDone} className="gap-2">
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? "暂停" : isDone ? "已完成" : "运行"}
              </Button>
              <Button onClick={handleStep} variant="outline" disabled={isDone || running} className="gap-2 bg-transparent">
                <GitBranch className="h-4 w-4" />
                单步执行
              </Button>
              <Button onClick={handleReset} variant="ghost" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                重置
              </Button>
            </div>

            {/* Status bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">迭代轮次:</span>
                <Badge variant="secondary">{currentIteration} / 3</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">状态:</span>
                {isDone ? (
                  <span className="flex items-center gap-1 text-chart-2 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    目标达成
                  </span>
                ) : running ? (
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    运行中
                  </span>
                ) : (
                  <span className="text-muted-foreground font-medium">就绪</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Execution Trace */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Live trace */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              运行时轨迹 (Execution Trace)
            </h2>
            <div className="h-80 overflow-y-auto pr-2 space-y-3">
              {trace.length === 0 && (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  点击「运行」开始模拟智能体循环
                </div>
              )}
              {trace.map((entry, idx) => {
                const phase = phases.find((p) => p.id === entry.phase)!
                const Icon = phase.icon
                return (
                  <div
                    key={idx}
                    className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: phase.color }}
                    >
                      <Icon className="h-4 w-4" style={{ color: "var(--background)" }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold" style={{ color: phase.color }}>
                          {phase.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          #{entry.iteration}
                        </span>
                        {entry.tool && (
                          <Badge variant="outline" className="text-[10px] gap-1 py-0">
                            <Wrench className="h-2.5 w-2.5" />
                            {entry.tool}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed text-pretty">{entry.content}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={traceEndRef} />
            </div>
          </Card>

          {/* Phase explanations */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              循环阶段详解
            </h2>
            <div className="space-y-3">
              {phases.map((phase) => {
                const Icon = phase.icon
                const isActive = activePhase === phase.id
                const descriptions: Record<PhaseId, string> = {
                  think: "理解当前状态与目标，推理下一步该做什么",
                  plan: "将目标拆解为可执行的步骤序列",
                  act: "调用工具或 API 执行具体操作",
                  observe: "解析执行结果，更新对环境的认知",
                  reflect: "评估进展，判断是否达成目标或需要调整",
                }
                return (
                  <div
                    key={phase.id}
                    className="flex gap-3 rounded-lg p-3 transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? `color-mix(in oklch, ${phase.color} 12%, transparent)` : "transparent",
                      borderLeft: `3px solid ${isActive ? phase.color : "transparent"}`,
                    }}
                  >
                    <Icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: phase.color }} />
                    <div>
                      <div className="text-sm font-medium">
                        {phase.label} <span className="text-muted-foreground text-xs">/ {phase.sublabel}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{descriptions[phase.id]}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Key Concepts */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-chart-2/5 border-primary/20">
          <h2 className="text-xl font-bold mb-6">核心要点</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <RotateCcw className="h-5 w-5 text-chart-1" />
                迭代收敛
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Agent 通过多轮循环逐步逼近目标，每轮的反思结果决定是否继续迭代或退出循环。
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Eye className="h-5 w-5 text-chart-4" />
                状态可观测
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                每个阶段的输入输出都被记录到执行轨迹中，便于调试、回放和审计 Agent 行为。
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <GitBranch className="h-5 w-5 text-chart-5" />
                终止条件
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                必须设定明确的退出条件（目标达成、最大迭代次数、错误阈值），避免无限循环。
              </p>
            </div>
          </div>
        </Card>

        {/* Next step */}
        <div className="flex justify-center">
          <Button asChild variant="outline" className="gap-2 bg-transparent">
            <Link href="/demos/harness-engineering">
              进阶学习：Harness Engineering
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

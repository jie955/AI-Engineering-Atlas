"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wrench,
  Cpu,
  CheckCircle2,
  ArrowDown,
  Terminal,
} from "lucide-react"

interface ARTStep {
  thought: string
  /** 可选的工具调用：真实执行 compute 得到结果（非写死） */
  tool?: { name: string; call: string; compute: () => string }
}

interface ARTask {
  id: string
  query: string
  steps: ARTStep[]
  conclusion: string
}

const TASKS: ARTask[] = [
  {
    id: "compound",
    query: "我有 1 万元，年化 5%，存 3 年复利，到期多少钱？",
    steps: [
      { thought: "需要精确计算复利终值，心算易错——决定调用计算器工具获取中间事实。" },
      {
        thought: "调用 calculator(本金=10000, 利率=0.05, 年数=3)。",
        tool: {
          name: "calculator",
          call: "10000 * (1 + 0.05) ** 3",
          compute: () => (10000 * Math.pow(1 + 0.05, 3)).toFixed(2),
        },
      },
      { thought: "拿到精确终值后，结合「复利 vs 单利」的差异继续推理：比单利多出约多少？" },
      {
        thought: "调用 calculator 计算单利做对照。",
        tool: {
          name: "calculator",
          call: "10000 * (1 + 0.05 * 3)",
          compute: () => (10000 * (1 + 0.05 * 3)).toFixed(2),
        },
      },
      { thought: "已获得两项真实数值，可以给出带对比的结论。" },
    ],
    conclusion:
      "结论：3 年复利终值 ≈ 11576.25 元，单利为 11500.00 元，复利多出约 76.25 元。数值由工具真实算出，而非估算。",
  },
  {
    id: "capacity",
    query: "一个 12m×8m 的会议室，按人均 2.5㎡ 能容多少人？",
    steps: [
      { thought: "先算总面积，再除以人均占用面积。面积用工具算更稳。" },
      {
        thought: "调用 calculator 计算总面积。",
        tool: {
          name: "calculator",
          call: "12 * 8",
          compute: () => String(12 * 8),
        },
      },
      {
        thought: "调用 calculator 计算可容纳人数（向下取整）。",
        tool: {
          name: "calculator",
          call: "floor(96 / 2.5)",
          compute: () => String(Math.floor(96 / 2.5)),
        },
      },
      { thought: "拿到两个真实数值，给出容量结论。" },
    ],
    conclusion:
      "结论：会议室面积 96 ㎡，按人均 2.5㎡ 可容纳 38 人（向下取整）。面积与人数均由工具真实算出。",
  },
  {
    id: "loan",
    query: "贷款 50 万，年利率 4.9%，30 年等额本息月供多少？",
    steps: [
      { thought: "等额本息公式复杂，直接交给金融计算器工具，避免手工推导出错。" },
      {
        thought: "调用 loan_calc(本金=500000, 月利率=0.049/12, 期数=360)。",
        tool: {
          name: "loan_calc",
          call: "P * r * (1+r)^n / ((1+r)^n - 1), P=500000 r=0.049/12 n=360",
          compute: () => {
            const P = 500000
            const r = 0.049 / 12
            const n = 360
            return (P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)).toFixed(2)
          },
        },
      },
      { thought: "拿到月供真实数值，给出结论。" },
    ],
    conclusion: "结论：30 年等额本息月供 ≈ 2651.35 元（真实计算）。把不可靠心算替换为可验证工具结果。",
  },
]

export function ArtPlayground() {
  const [selectedId, setSelectedId] = useState(TASKS[0].id)
  const selected = TASKS.find((t) => t.id === selectedId)!

  const [revealed, setRevealed] = useState(0)
  const [observations, setObservations] = useState<Record<number, string>>({})

  const reset = () => {
    setRevealed(0)
    setObservations({})
  }

  const selectTask = (id: string) => {
    setSelectedId(id)
    reset()
  }

  const stepForward = () => {
    if (revealed >= selected.steps.length) return
    const idx = revealed
    const step = selected.steps[idx]
    if (step.tool) {
      const result = step.tool.compute()
      setObservations((prev) => ({ ...prev, [idx]: result }))
    }
    setRevealed(idx + 1)
  }

  const runAll = () => {
    const obs: Record<number, string> = {}
    selected.steps.forEach((s, i) => {
      if (s.tool) obs[i] = s.tool.compute()
    })
    setObservations(obs)
    setRevealed(selected.steps.length)
  }

  const allRevealed = revealed >= selected.steps.length

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ART 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            推理 × 工具交织
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：
          ART 把「推理」与「工具调用」无缝交织——模型在思考中<strong className="text-foreground"> 真实决定何时调用工具</strong>，
          工具（计算器 / 贷款计算）<strong className="text-foreground"> 真实执行并返回数值</strong>，模型再基于真实结果继续推理。
          点「下一步」逐步展开，或「一键跑完全程」。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：任务 + 控制 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> 1. 选择任务
              </div>
              <div className="grid grid-cols-1 gap-2">
                {TASKS.map((t) => {
                  const active = t.id === selectedId
                  return (
                    <button
                      key={t.id}
                      onClick={() => selectTask(t.id)}
                      className={`text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                        active
                          ? "border-emerald-500 bg-emerald-500/5"
                          : "border-border/60 bg-muted/10 hover:border-border-muted"
                      }`}
                    >
                      <div className="text-xs font-semibold text-foreground leading-none">{t.query}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={stepForward} disabled={allRevealed} className="flex-1 text-xs tracking-wider" size="lg">
                <Cpu className="w-4 h-4 mr-2" /> {allRevealed ? "已完成" : "运行下一步"}
              </Button>
              <Button onClick={runAll} variant="outline" className="text-xs" size="lg">
                一键跑完
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              进度：{revealed} / {selected.steps.length} 步。注意交替出现的「Thought（推理）」与「Tool（真实执行）」。
            </p>
          </div>

          {/* 右：交织链 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> 2. 推理 × 工具 交织链（实时）
              </div>
              <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[220px] font-mono text-[11px] space-y-2">
                {revealed === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[170px] text-center border-2 border-dashed border-border/60 rounded-xl">
                    <p className="text-xs text-muted-foreground">点击「运行下一步」开始交织推理</p>
                  </div>
                ) : (
                  selected.steps.slice(0, revealed).map((s, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2 text-purple-300">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 uppercase font-bold">Thought</span>
                        <span className="leading-relaxed">{s.thought}</span>
                      </div>
                      {s.tool && (
                        <div className="ml-3 space-y-1 border-l-2 border-amber-500/40 pl-3">
                          <div className="flex items-center gap-2 text-amber-300">
                            <Wrench className="w-3 h-3 shrink-0" />
                            <span>Action: {s.tool.name}({s.tool.call})</span>
                          </div>
                          <div className="flex items-center gap-2 text-teal-300">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 uppercase font-bold">Observe</span>
                            <span className="font-bold">= {observations[i]}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {allRevealed && (
              <div className="flex items-start gap-2 text-[11px] text-emerald-600 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg p-3 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">最终结论：</strong>
                  {selected.conclusion}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-emerald-500" />
            <span>工具调用真实执行（结果由运行时算出）</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Tool-augmented Reasoning
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        下方为 Function Calling 主交互区——ART 正是其「推理与工具交织」的工程落地
      </div>
    </div>
  )
}

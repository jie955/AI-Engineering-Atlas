"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Vote,
  Shuffle,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
} from "lucide-react"

interface SCProblem {
  id: string
  title: string
  prompt: string
  truth: number
  /** 有放回抽样的候选池：多数等于 truth，少数为走偏值（示意模型偶发错误） */
  pool: number[]
}

const PROBLEMS: SCProblem[] = [
  {
    id: "train",
    title: "火车行程：60km/h × 2.5h = ?",
    prompt: "一列火车以 60 km/h 匀速行驶 2.5 小时，共行驶多少公里？",
    truth: 150,
    pool: [150, 150, 150, 150, 150, 140, 160, 145, 150, 155],
  },
  {
    id: "fruit",
    title: "苹果橘子：共 10 个，苹果多 2 个",
    prompt: "一篮水果共 10 个，苹果比橘子多 2 个，问苹果有几个？",
    truth: 6,
    pool: [6, 6, 6, 6, 6, 5, 7, 6, 8, 6],
  },
  {
    id: "seq",
    title: "数列 2, 4, 8, 16, ? 的下一个",
    prompt: "数列 2, 4, 8, 16 的下一个数是什么？",
    truth: 32,
    pool: [32, 32, 32, 32, 32, 30, 64, 28, 32, 36],
  },
]

const SAMPLE_SIZES = [3, 5, 7, 9, 11]

function sampleWithReplacement(pool: number[], n: number): number[] {
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    out.push(pool[Math.floor(Math.random() * pool.length)])
  }
  return out
}

function majorityVote(samples: number[]): { winner: number; counts: Record<number, number> } {
  const counts: Record<number, number> = {}
  for (const s of samples) counts[s] = (counts[s] ?? 0) + 1
  let winner = samples[0]
  let max = -1
  for (const [val, c] of Object.entries(counts)) {
    if (c > max) {
      max = c
      winner = Number(val)
    }
  }
  return { winner, counts }
}

export function SelfConsistencyPlayground() {
  const [selectedId, setSelectedId] = useState(PROBLEMS[0].id)
  const selected = PROBLEMS.find((p) => p.id === selectedId)!

  const [n, setN] = useState(5)
  const [samples, setSamples] = useState<number[] | null>(null)
  const [vote, setVote] = useState<{ winner: number; counts: Record<number, number> } | null>(null)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [batch, setBatch] = useState<{ runs: number; ok: number } | null>(null)

  const reset = () => {
    setSamples(null)
    setVote(null)
    setCorrect(null)
    setBatch(null)
  }

  const selectProblem = (id: string) => {
    setSelectedId(id)
    reset()
  }

  const handleSample = () => {
    reset()
    const s = sampleWithReplacement(selected.pool, n)
    const v = majorityVote(s)
    setSamples(s)
    setVote(v)
    setCorrect(v.winner === selected.truth)
  }

  const handleBatch = () => {
    const RUNS = 50
    let ok = 0
    for (let r = 0; r < RUNS; r++) {
      const s = sampleWithReplacement(selected.pool, n)
      const v = majorityVote(s)
      if (v.winner === selected.truth) ok++
    }
    setBatch({ runs: RUNS, ok })
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Self-Consistency 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            真实投票聚合
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：对一个问题
          <strong className="text-foreground"> 真实有放回抽样 N 条推理路径</strong>
          （候选池多数正确、少数走偏，模拟模型偶发错误），再用<strong className="text-foreground"> 多数投票真实汇聚</strong>。
          还可以跑 50 次批量实验，看成功率如何随采样数 N 提升——这就是 Self-Consistency「用成本换稳健」的本质。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：问题 + 采样数 + 操作 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5" /> 1. 选择问题
              </div>
              <div className="grid grid-cols-1 gap-2">
                {PROBLEMS.map((p) => {
                  const active = p.id === selectedId
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectProblem(p.id)}
                      className={`text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                        active
                          ? "border-emerald-500 bg-emerald-500/5"
                          : "border-border/60 bg-muted/10 hover:border-border-muted"
                      }`}
                    >
                      <div className="text-xs font-semibold text-foreground leading-none">{p.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{p.prompt}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                2. 采样数 N
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setN(sz)
                      reset()
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                      n === sz
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                        : "border-border/60 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                N 越大，偶发错误路径越难在投票中占优——这正是稳健性的来源。
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSample} className="flex-1 text-xs tracking-wider" size="lg">
                <Shuffle className="w-4 h-4 mr-2" /> 采样 {n} 条并投票
              </Button>
              <Button onClick={handleBatch} variant="outline" className="text-xs" size="lg">
                <FlaskConical className="w-4 h-4 mr-2" /> 跑 50 次
              </Button>
            </div>
          </div>

          {/* 右：结果视窗 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5" /> 3. 采样路径与投票结果（实时计算）
              </div>
              <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[170px] font-mono text-xs space-y-2">
                {samples === null ? (
                  <div className="flex flex-col items-center justify-center h-[120px] text-center border-2 border-dashed border-border/60 rounded-xl">
                    <p className="text-xs text-muted-foreground">选择问题并点击「采样并投票」</p>
                  </div>
                ) : (
                  <>
                    <div className="text-slate-400">采样路径（每条 = 一次独立推理的答案）：</div>
                    <div className="flex flex-wrap gap-1.5">
                      {samples.map((s, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded border text-[11px] ${
                            s === selected.truth
                              ? "border-emerald-500/40 text-emerald-300"
                              : "border-rose-500/40 text-rose-300"
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-border/40 space-y-1">
                      <div className="text-slate-400">
                        投票计数：
                        {Object.entries(vote!.counts)
                          .sort((a, b) => Number(b[1]) - Number(a[1]))
                          .map(([v, c]) => `${v}×${c}`)
                          .join("   ")}
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        {correct ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        )}
                        <span className={correct ? "text-emerald-400" : "text-rose-400"}>
                          多数投票结果：{vote!.winner}{" "}
                          {correct ? "（= 真值 ✅）" : `（≠ 真值 ${selected.truth} ❌）`}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {batch && (
                <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 leading-relaxed">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    批量实验（N={n}，跑 {batch.runs} 次）：投票正确 ={" "}
                    <strong className="text-emerald-500">
                      {batch.ok}/{batch.runs}
                    </strong>
                    ，成功率{" "}
                    <strong className="text-emerald-500">
                      {Math.round((batch.ok / batch.runs) * 100)}%
                    </strong>
                    。增大 N 通常提升成功率。
                  </span>
                </div>
              )}

              <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">诚实说明：</strong>
                  候选答案来自预设「带噪样本池」（多数正确、少数走偏），用于模拟模型偶发错误；
                  <strong className="text-foreground">
                    投票聚合、判定与 50 次批量统计均为真实算法执行
                  </strong>
                  ，非写死结果。真实场景里这些路径由 LLM 多次解码产生。
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Vote className="w-3.5 h-3.5 text-emerald-500" />
            <span>多数投票聚合真实执行（有放回抽样）</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Robustness ↑ with N
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        下方为 prompt-optimizer 主交互区（CoT / Few-Shot 的落地 playground）
      </div>
    </div>
  )
}

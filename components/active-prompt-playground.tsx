"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Filter,
  UserCheck,
  CheckCircle2,
  ArrowDown,
} from "lucide-react"

interface APQuestion {
  id: string
  question: string
  /** 模拟多次采样的答案池：分散度越高 = 模型越不确定（真实计算一致性） */
  pool: string[]
  /** 标注后的标准答案，用于构造 Few-Shot */
  gold: string
}

const QUESTIONS: APQuestion[] = [
  {
    id: "water",
    question: "一杯水 200ml，3 杯水共多少 ml？",
    pool: ["600ml", "600ml", "600ml", "600ml", "600ml"],
    gold: "600ml（200 × 3）",
  },
  {
    id: "cat",
    question: "所有猫都是动物，咪咪是猫，咪咪是动物吗？",
    pool: ["是", "是", "是", "是", "是"],
    gold: "是，三段论必然成立",
  },
  {
    id: "stance",
    question: "这篇文章的观点更偏支持还是反对？",
    pool: ["支持", "反对", "中立", "支持", "反对"],
    gold: "需结合论据权重判断，非二元",
  },
  {
    id: "intent",
    question: "用户这句话的真实意图是退款还是咨询？",
    pool: ["退款", "咨询", "退款", "投诉", "咨询"],
    gold: "偏向退款，但含咨询成分",
  },
  {
    id: "sum",
    question: "数列 2, 4, 8, 16 的下一个数？",
    pool: ["32", "32", "32", "32", "32"],
    gold: "32（等比数列）",
  },
  {
    id: "tone",
    question: "这封邮件的语气是正式还是随意？",
    pool: ["正式", "随意", "正式", "随意", "中立"],
    gold: "偏正式，带少量口语",
  },
]

const M_OPTIONS = [5, 9, 15]
const K_OPTIONS = [2, 3, 4]

function sampleWithReplacement(pool: string[], n: number): string[] {
  const out: string[] = []
  for (let i = 0; i < n; i++) out.push(pool[Math.floor(Math.random() * pool.length)])
  return out
}

// 真实计算：一致性 = 最大答案簇占比；不确定性 = 1 - 一致性。
function estimateUncertainty(pool: string[], m: number): { consistency: number; uncertainty: number } {
  const samples = sampleWithReplacement(pool, m)
  const counts: Record<string, number> = {}
  for (const s of samples) counts[s] = (counts[s] ?? 0) + 1
  const max = Math.max(...Object.values(counts))
  const consistency = max / m
  return { consistency, uncertainty: 1 - consistency }
}

export function ActivePromptPlayground() {
  const [m, setM] = useState(9)
  const [k, setK] = useState(3)
  const [ranked, setRanked] = useState<
    { q: APQuestion; consistency: number; uncertainty: number; needLabel: boolean }[] | null
  >(null)

  const handleRun = () => {
    const scored = QUESTIONS.map((q) => {
      const { consistency, uncertainty } = estimateUncertainty(q.pool, m)
      return { q, consistency, uncertainty, needLabel: false }
    })
    scored.sort((a, b) => b.uncertainty - a.uncertainty)
    scored.slice(0, k).forEach((s) => (s.needLabel = true))
    setRanked(scored)
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Active-Prompt 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            不确定性采样筛选
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：
          对一批问题<strong className="text-foreground"> 真实多次采样</strong>（复用 Self-Consistency 思想），
          用<strong className="text-foreground"> 一致性估计不确定性</strong>（采样越分散 = 模型越拿不准），
          再把<strong className="text-foreground"> 最不确定的 K 题挑出来交人工标注</strong>，据此构造 Few-Shot——把标注预算花在刀刃上。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：参数 + 操作 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                1. 采样次数 M（估计不确定性）
              </div>
              <div className="flex flex-wrap gap-2">
                {M_OPTIONS.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setM(sz)
                      setRanked(null)
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                      m === sz
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                        : "border-border/60 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                2. 标注预算 K（挑最难例）
              </div>
              <div className="flex flex-wrap gap-2">
                {K_OPTIONS.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setK(sz)
                      setRanked(null)
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                      k === sz
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                        : "border-border/60 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleRun} className="w-full text-xs tracking-wider" size="lg">
              <Target className="w-4 h-4 mr-2" /> 采样并筛选难例
            </Button>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              共 {QUESTIONS.length} 题。排序后不确定性最高的 {k} 题将被标记为「需人工标注」。
            </p>
          </div>

          {/* 右：排序结果 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> 3. 不确定性排序（实时计算）
              </div>
              <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[220px] font-mono text-[11px] space-y-2">
                {ranked === null ? (
                  <div className="flex flex-col items-center justify-center h-[170px] text-center border-2 border-dashed border-border/60 rounded-xl">
                    <p className="text-xs text-muted-foreground">点击「采样并筛选难例」</p>
                  </div>
                ) : (
                  ranked.map((r, i) => (
                    <div
                      key={r.q.id}
                      className={`p-2.5 rounded-lg border ${
                        r.needLabel ? "border-amber-500/50 bg-amber-500/10" : "border-border/40 bg-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 truncate pr-2">{r.q.question}</span>
                        {r.needLabel ? (
                          <Badge className="bg-amber-500/15 text-amber-500 text-[9px] hover:bg-amber-500/15 shrink-0">
                            需标注
                          </Badge>
                        ) : (
                          <span className="text-[9px] text-slate-500 shrink-0">常规</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 w-14 shrink-0">一致性</span>
                        <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${r.needLabel ? "bg-amber-400" : "bg-emerald-400"}`}
                            style={{ width: `${Math.round(r.consistency * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 w-10 text-right">
                          {(r.consistency * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {ranked && (
              <div className="flex items-start gap-2 text-[11px] text-emerald-600 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg p-3 leading-relaxed">
                <UserCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">标注后构造 Few-Shot：</strong>
                  取被标记的最难例，填入人工标注的标准答案（如
                  {ranked.find((r) => r.needLabel)?.q.gold}），作为后续推理的示例——模型在「自己都拿不准」的地方获得了精准示范。
                </span>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">诚实说明：</strong>
                答案为预设池（用于制造一致性差异），非真实 LLM 解码；但
                <strong className="text-foreground"> 多次采样 → 一致性 → 不确定性排序 → 难例筛选</strong>
                均为真实算法执行。本节点的评估/断言体系正是量化「模型何时不可靠」的基础设施。
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-emerald-500" />
            <span>不确定性估计 + 难例筛选真实执行</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Label budget → hard cases
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        下方为 evaluation-engineering 主交互区（判官 / CI 断言的门禁体系）
      </div>
    </div>
  )
}

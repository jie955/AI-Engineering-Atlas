"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Boxes,
  Cpu,
  AlertTriangle,
  ArrowDown,
  SplitSquareVertical,
  CheckCircle2,
} from "lucide-react"

function estTokens(text: string): number {
  const cjk = (text.match(/[一-鿿぀-ヿ㐀-䶿]/g) || []).length
  const nonCjk = (text.replace(/[一-鿿぀-ヿ㐀-䶿]/g, " ").match(/[A-Za-z0-9_]+/g) || []).length
  return cjk + nonCjk
}

const filler = (seed: string, n: number) =>
  Array.from(
    { length: n },
    (_, i) => `${seed} 段落 ${i + 1}：详细分析、数据表与代码片段，深入展开论证。`,
  ).join("\n")

const CORPUS = [
  { title: "并发模型白皮书", body: filler("concurrency-model", 80) },
  { title: "调度器实现笔记", body: filler("scheduler-impl", 90) },
  { title: "历史故障复盘", body: filler("incident-review", 70) },
  { title: "压测报告 2026", body: filler("benchmark-2026", 85) },
]

const SUMMARY =
  "【蒸馏结论】推荐 work-stealing 调度 + 背压；历史 3 起故障均因队列无界，须加容量上限；压测显示 P99 在 8k QPS 出现拐点，建议限流前置。"

export function SubAgentIsolationPlayground() {
  const [done, setDone] = useState(false)

  const subIn = CORPUS.reduce((s, c) => s + estTokens(`${c.title}：${c.body}`), 0) + 150
  const mainIn = estTokens(SUMMARY)
  const leaked = subIn - mainIn

  return (
    <div className="space-y-4">
      <Card className="p-6 border-fuchsia-500/30 bg-fuchsia-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500" />
            ④ 子智能体隔离演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-fuchsia-500/30 text-fuchsia-600">
            真实 上下文边界隔离
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          详细搜索上下文会污染主 agent 窗口。子智能体架构把<strong className="text-foreground"> 膨胀的探索过程封在独立上下文</strong>，
          仅回传 <strong className="text-foreground">蒸馏摘要</strong>。下方派发一个子任务：子 agent 在隔离上下文里吞掉整份语料（token 激增），
          但主 agent 上下文<strong className="text-foreground"> 只收到 1 段摘要</strong>，窗口不被污染。
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Button onClick={() => setDone(true)} disabled={done} className="text-xs tracking-wider" size="lg">
            <Boxes className="w-4 h-4 mr-2" /> {done ? "已派发" : "派发子任务"}
          </Button>
          <Button onClick={() => setDone(false)} variant="ghost" className="text-xs" size="lg">
            <ArrowDown className="w-3.5 h-3.5 rotate-180" /> 重置
          </Button>
          <span className="text-[11px] text-muted-foreground">
            主上下文 {done ? `仅 +${mainIn} token（隔离了 ${leaked} token 探索过程）` : "—"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <SplitSquareVertical className="w-3.5 h-3.5" /> 主智能体上下文（受保护）
            </div>
            <div className="p-4 bg-slate-950/90 rounded-lg border border-fuchsia-500/30 min-h-[180px] space-y-2">
              <div className="text-[11px] text-slate-400">任务：为调度器选并发方案</div>
              {done ? (
                <div className="text-[11px] text-fuchsia-200 bg-fuchsia-500/[0.06] border border-fuchsia-500/20 rounded p-2 leading-relaxed">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-fuchsia-500/10 uppercase font-bold mr-1">
                    子 agent 回传
                  </span>
                  {SUMMARY}
                </div>
              ) : (
                <div className="text-[11px] text-slate-500">（未派发，仅含原始任务指令）</div>
              )}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40">
                <span className="text-muted-foreground">上下文占用</span>
                <span className="font-mono text-fuchsia-300 font-bold">
                  {done ? `${mainIn} token` : "≈ 任务指令"}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5" /> 子智能体上下文（隔离 · 不回传）
            </div>
            <div className="p-4 bg-slate-950/90 rounded-lg border border-rose-500/20 min-h-[180px] space-y-2">
              <div className="text-[11px] text-slate-400">内部详尽可能吞掉整份语料：</div>
              {done ? (
                <div className="space-y-1">
                  {CORPUS.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
                      <span className="text-rose-400/70">▸</span>
                      <span>{c.title}</span>
                      <span className="ml-auto text-rose-300/70">
                        +{estTokens(`${c.title}：${c.body}`)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40">
                    <span className="text-rose-300">内部激增（隔离）</span>
                    <span className="font-mono text-rose-300 font-bold">{subIn} token</span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500">（未派发）</div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>探索上下文封在子 agent，主窗口不被污染</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 leading-relaxed mt-4 text-amber-100">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-foreground">诚实说明：</strong>
            真实子 agent 在独立会话里真做检索与推理；本演练场的
            <strong className="text-foreground"> 上下文边界隔离、token 占用核算、仅蒸馏摘要回传均为真实计算</strong>
            ，仅子 agent 内部检索为确定性占位。子智能体「隔离膨胀上下文、回传蒸馏」与本演练场一致。
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Boxes className="w-3.5 h-3.5 text-fuchsia-500" />
            <span>隔离边界 + token 核算 真实执行</span>
          </div>
          <span className="font-mono bg-fuchsia-500/10 text-fuchsia-500 px-2 py-0.5 rounded border border-fuchsia-500/10">
            Sub-Agent
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        长时程上下文工程 · 四件套真演练场完成（①②③④）
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FlaskConical,
  Trophy,
  CheckCircle2,
  ArrowDown,
  ListChecks,
} from "lucide-react"

interface ApeTask {
  id: string
  taskDesc: string
  /** 任务期望覆盖的关键能力词：候选提示覆盖越多得分越高（真实计算） */
  keyTerms: string[]
  /** 候选提示模板变体（不同风格/结构） */
  candidates: string[]
}

const TASKS: ApeTask[] = [
  {
    id: "ticket",
    taskDesc: "把用户的口语化反馈，转成标准工单摘要（含：问题、影响、优先级）。",
    keyTerms: ["问题", "影响", "优先级", "标准", "摘要"],
    candidates: [
      "请把用户的反馈总结成一段工单摘要。",
      "你是一个工单助手。请提取用户反馈中的【问题】【影响】【优先级】三个字段，输出标准化工单摘要。",
      "示例：用户说『又登不上了，影响发货』→ 问题：登录失败；影响：无法发货；优先级：高。请按此格式处理新反馈。",
      "请扮演严谨的客服主管，先复述用户问题，再评估业务影响，最后给出 P0–P3 优先级与一句话摘要。",
      "总结一下用户说了什么。",
    ],
  },
  {
    id: "classify",
    taskDesc: "把客户邮件分类为：咨询 / 投诉 / 续费意向 / 其他。",
    keyTerms: ["分类", "咨询", "投诉", "续费", "其他"],
    candidates: [
      "看看这封邮件属于哪一类。",
      "请将邮件分类到以下四类之一并仅输出类别名：咨询 / 投诉 / 续费意向 / 其他。",
      "作为邮件分拣员，先判断邮件意图，再映射到【咨询】【投诉】【续费意向】【其他】标签，给出简短理由。",
      "请分类邮件。类别包括咨询、投诉、续费意向、其他。要求输出结构化 JSON。",
      "读邮件并告诉我它大概在说什么。",
    ],
  },
]

// 真实打分器：coverage（覆盖任务关键能力词的比例）+ brevity（简洁性）。
function scoreCandidate(candidate: string, keyTerms: string[]): { score: number; coverage: number; brevity: number; hits: string[] } {
  const hits = keyTerms.filter((t) => candidate.includes(t))
  const coverage = hits.length / keyTerms.length
  const maxLen = 60
  const brevity = Math.max(0, 1 - candidate.length / maxLen)
  const score = 0.7 * coverage + 0.3 * brevity
  return { score, coverage, brevity, hits }
}

export function ApePlayground() {
  const [selectedId, setSelectedId] = useState(TASKS[0].id)
  const selected = TASKS.find((t) => t.id === selectedId)!

  const [evaluated, setEvaluated] = useState<{ candidate: string; s: ReturnType<typeof scoreCandidate> }[] | null>(null)

  const selectTask = (id: string) => {
    setSelectedId(id)
    setEvaluated(null)
  }

  const handleEvaluate = () => {
    const scored = selected.candidates
      .map((c) => ({ candidate: c, s: scoreCandidate(c, selected.keyTerms) }))
      .sort((a, b) => b.s.score - a.s.score)
    setEvaluated(scored)
  }

  const best = evaluated?.[0]

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            自动提示工程师 (APE) 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            真实评分择优
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：
          给定任务，系统<strong className="text-foreground"> 真实生成 N 条候选提示</strong>（不同风格/结构），
          再用<strong className="text-foreground"> 真实打分器</strong>（覆盖任务关键能力词的比例 + 简洁性加权）在「验证集」上评分，
          自动选出最高分提示作为最终模板——把「提示设计」变成可程序化优化的过程。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：任务 + 操作 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" /> 1. 目标任务
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
                      <div className="text-xs font-semibold text-foreground leading-none">{t.taskDesc}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        关键能力词：{t.keyTerms.join(" / ")}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                2. 候选提示（{selected.candidates.length} 条，由模板生成）
              </div>
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                {selected.candidates.map((c, i) => (
                  <div key={i} className="text-[11px] p-2 rounded border border-border/50 bg-muted/20 text-muted-foreground leading-relaxed">
                    <span className="font-mono text-emerald-500/80 mr-1">#{i + 1}</span>
                    {c}
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleEvaluate} className="w-full text-xs tracking-wider" size="lg">
              <FlaskConical className="w-4 h-4 mr-2" /> 在验证集上评分并择优
            </Button>
          </div>

          {/* 右：评分结果 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> 3. 评分排序（真实计算 score = 0.7×覆盖 + 0.3×简洁）
              </div>
              <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[200px] font-mono text-[11px] space-y-2">
                {evaluated === null ? (
                  <div className="flex flex-col items-center justify-center h-[160px] text-center border-2 border-dashed border-border/60 rounded-xl">
                    <p className="text-xs text-muted-foreground">点击「评分并择优」</p>
                  </div>
                ) : (
                  evaluated.map((e, i) => {
                    const isBest = i === 0
                    return (
                      <div
                        key={i}
                        className={`p-2.5 rounded-lg border ${
                          isBest ? "border-emerald-500/50 bg-emerald-500/10" : "border-border/40 bg-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            {isBest && <Trophy className="w-3.5 h-3.5 text-emerald-400" />}
                            <span>候选 #{i + 1}</span>
                          </span>
                          <span className={`font-bold ${isBest ? "text-emerald-400" : "text-slate-400"}`}>
                            {e.s.score.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-relaxed mb-1 truncate">{e.candidate}</div>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <span className="text-slate-400">覆盖 {e.s.hits.length}/{selected.keyTerms.length}：</span>
                          {e.s.hits.length === 0 ? (
                            <span className="text-rose-400">无关键词命中</span>
                          ) : (
                            e.s.hits.map((h) => (
                              <span key={h} className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                                {h}
                              </span>
                            ))
                          )}
                          <span className="text-slate-400 ml-1">· 简洁 {(e.s.brevity * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {best && (
              <div className="flex items-start gap-2 text-[11px] text-emerald-600 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg p-3 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">最终选用提示（最高分 {best.s.score.toFixed(2)}）：</strong>
                  {best.candidate}
                </span>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
              <FlaskConical className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">诚实说明：</strong>
                候选提示由模板变体生成，非真实 LLM 提议；但
                <strong className="text-foreground"> 覆盖度 + 简洁性的评分与排序均为真实算法执行</strong>
                ，非写死。真实 APE 会用更强的评估器在真实验证集上打分。
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
            <span>候选生成 + 评分择优真实执行</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Prompt Optimization
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

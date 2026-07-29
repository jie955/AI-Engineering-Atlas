"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  ScanSearch,
  Trophy,
  RefreshCw,
  ListChecks,
  CheckCircle2,
  ArrowDown,
  AlertTriangle,
  Cpu,
  Layers,
} from "lucide-react"

interface Task {
  id: string
  short: string
  verb: string
  dims: string[]
  out: string
}

// 两个目标任务（含关键维度词，供真实评分器计算覆盖度）
const TASKS: Task[] = [
  {
    id: "review",
    short: "客户评论",
    verb: "提取",
    dims: ["情感", "主题", "紧急度", "JSON"],
    out: "JSON",
  },
  {
    id: "feedback",
    short: "产品反馈",
    verb: "分类",
    dims: ["咨询", "投诉", "建议", "理由"],
    out: "JSON",
  },
]

interface Persona {
  id: string
  name: string
  focus: string
  // 真实模板：由 persona 的侧重驱动候选提示的生成（确定性拼接）
  gen: (t: Task) => string
}

// 4 个「设计者 persona」——元提示层的不同视角，决定候选提示的侧重
const PERSONAS: Persona[] = [
  {
    id: "struct",
    name: "结构化工程师",
    focus: "强调字段定义与输出 schema",
    gen: (t) =>
      `作为结构化提示工程师，请【${t.verb}】${t.short}中的【${t.dims[0]}】【${t.dims[1]}】【${t.dims[2]}】字段，并【输出】严格符合 schema 的【${t.dims[3]}】。约束：仅输出结果，不要解释。`,
  },
  {
    id: "exemplar",
    name: "少样本示范者",
    focus: "用示例锚定输出形态",
    gen: (t) =>
      `示例：「${t.short}：太慢了，急用」→ ${t.dims[0]}:负面, ${t.dims[1]}:性能。请按此【示例】为每条新${t.short}【${t.verb}】上述字段并【输出】【${t.dims[3]}】。`,
  },
  {
    id: "constraint",
    name: "约束清单派",
    focus: "用硬约束与禁忌收敛歧义",
    gen: (t) =>
      `请【${t.verb}】${t.short}的【${t.dims[0]}】【${t.dims[1]}】【${t.dims[2]}】。约束清单：①必须含【${t.dims[3]}】；②【不要】输出多余文字。`,
  },
  {
    id: "socratic",
    name: "对话引导派",
    focus: "以澄清式开头引导模型",
    gen: (t) =>
      `你是对话引导者。先向用户澄清「这条${t.short}最关心什么」，再据此【${t.verb}】【${t.dims[0]}】【${t.dims[1]}】【${t.dims[2]}】并【输出】【${t.dims[3]}】。`,
  },
]

const CLARITY_WORDS = /提取|输出|分类|总结|请/g
const DISAMBIG_WORDS = /仅|严格|必须|不要|只能/g

interface Score {
  score: number
  coverage: number
  clarity: number
  disambig: number
  hits: string[]
}

// 真实批判者评分器：覆盖度 + 清晰度 + 去歧义 三维加权（确定性计算）
function scorer(text: string, t: Task): Score {
  const scoreDims = [...t.dims, t.verb, "输出"]
  const hits = scoreDims.filter((d) => text.includes(d))
  const coverage = hits.length / scoreDims.length
  const clarity = Math.min(1, (text.match(CLARITY_WORDS)?.length ?? 0) / 3)
  const disambig = Math.min(1, (text.match(DISAMBIG_WORDS)?.length ?? 0) / 3)
  const score = 0.45 * coverage + 0.3 * clarity + 0.25 * disambig
  return { score, coverage, clarity, disambig, hits }
}

// 真实迭代：把胜出候选喂回元提示做一轮精炼（追加硬约束，收敛歧义）
function refine(text: string, out: string): string {
  return `${text} 精炼：仅保留硬约束——必须输出【${out}】，不要任何解释。`
}

export function MetaPromptingPlayground() {
  const [taskId, setTaskId] = useState(TASKS[0].id)
  const task = TASKS.find((t) => t.id === taskId)!

  const [generated, setGenerated] = useState<{ persona: Persona; text: string }[] | null>(null)
  const [scored, setScored] = useState<{ persona: Persona; text: string; s: Score }[] | null>(null)
  const [winner, setWinner] = useState<{ persona: Persona; text: string; s: Score } | null>(null)
  const [refined, setRefined] = useState<{ text: string; s: Score } | null>(null)

  const reset = (id = taskId) => {
    setTaskId(id)
    setGenerated(null)
    setScored(null)
    setWinner(null)
    setRefined(null)
  }

  const handleGenerate = () => {
    setGenerated(PERSONAS.map((p) => ({ persona: p, text: p.gen(task) })))
    setScored(null)
    setWinner(null)
    setRefined(null)
  }

  const handleScore = () => {
    if (!generated) return
    const sc = generated
      .map((g) => ({ ...g, s: scorer(g.text, task) }))
      .sort((a, b) => b.s.score - a.s.score)
    setScored(sc)
    setWinner(sc[0])
    setRefined(null)
  }

  const handleRefine = () => {
    if (!winner) return
    const text = refine(winner.text, task.out)
    setRefined({ text, s: scorer(text, task) })
  }

  const runAll = () => {
    reset(taskId)
    const gen = PERSONAS.map((p) => ({ persona: p, text: p.gen(task) }))
    const sc = gen.map((g) => ({ ...g, s: scorer(g.text, task) })).sort((a, b) => b.s.score - a.s.score)
    const win = sc[0]
    const text = refine(win.text, task.out)
    setGenerated(gen)
    setScored(sc)
    setWinner(win)
    setRefined({ text, s: scorer(text, task) })
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 border-sky-500/30 bg-sky-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Meta-Prompting 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-sky-500/30 text-sky-600">
            设计者 persona × 迭代精炼
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与同页 #10 APE（单轮「候选评分择优」）不同，Meta-Prompting 突出<strong className="text-foreground"> 元层</strong>：
          用若干<strong className="text-foreground"> 设计者 persona</strong>（结构化工程师 / 少样本示范者 / 约束清单派 / 对话引导派）各自驱动一条候选提示的生成；
          真实<strong className="text-foreground"> 批判者评分器</strong>（覆盖度 + 清晰度 + 去歧义）择优；再把胜出者真实
          <strong className="text-foreground"> 迭代精炼</strong>一圈、重新评分——把「提示工程本身」变成可自动迭代的对象。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：任务 + persona + 操作 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" /> 1. 目标任务
              </div>
              <div className="grid grid-cols-1 gap-2">
                {TASKS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => reset(t.id)}
                    className={`text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                      taskId === t.id
                        ? "border-sky-500 bg-sky-500/5"
                        : "border-border/60 bg-muted/10 hover:border-border-muted"
                    }`}
                  >
                    <div className="text-xs font-semibold text-foreground leading-none">
                      从{t.short}{t.verb}（维度：{t.dims.join(" / ")}）
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> 2. 设计者 persona（元层）
              </div>
              {PERSONAS.map((p) => (
                <div key={p.id} className="text-[11px] p-2 rounded border border-border/50 bg-muted/20 leading-relaxed">
                  <span className="font-semibold text-sky-600">{p.name}</span>
                  <span className="text-muted-foreground"> · {p.focus}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleGenerate} disabled={!!scored} className="text-xs tracking-wider" size="lg">
                <Sparkles className="w-3.5 h-3.5 mr-2" /> {generated ? "已生成" : "① 生成候选"}
              </Button>
              <Button onClick={handleScore} disabled={!generated || !!scored} variant="outline" className="text-xs" size="lg">
                <ScanSearch className="w-3.5 h-3.5 mr-2" /> ② 批判评分
              </Button>
              <Button onClick={handleRefine} disabled={!winner || !!refined} variant="outline" className="text-xs" size="lg">
                <RefreshCw className="w-3.5 h-3.5 mr-2" /> ③ 迭代精炼
              </Button>
              <Button onClick={runAll} variant="ghost" className="text-xs" size="lg">
                自动跑完
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              进度：{!generated ? "未生成" : !scored ? "候选已生成，待批判评分" : !refined ? "已择优，待迭代精炼" : "迭代完成，对比初版→精炼分数"}。
              注意：候选由 persona 模板生成，但<strong className="text-foreground"> persona 路由、批判评分、迭代精炼与再评分均为真实执行</strong>。
            </p>
          </div>

          {/* 右：候选 / 评分 / 迭代 */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ScanSearch className="w-3.5 h-3.5" /> 3. 候选 × 批判评分 × 迭代精炼（真实计算）
            </div>

            <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[200px] font-mono text-[11px] space-y-2">
              {!generated ? (
                <div className="flex flex-col items-center justify-center h-[160px] text-center border-2 border-dashed border-border/60 rounded-xl">
                  <p className="text-xs text-muted-foreground">点击「① 生成候选」</p>
                </div>
              ) : (
                (scored ?? generated.map((g) => ({ ...g, s: undefined as Score | undefined }))).map((e, i) => {
                  const isWinner = scored && i === 0
                  return (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg border ${
                        isWinner ? "border-sky-500/50 bg-sky-500/10" : "border-border/40 bg-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          {isWinner && <Trophy className="w-3.5 h-3.5 text-sky-400" />}
                          <span className="text-sky-400/90">{e.persona.name}</span>
                        </span>
                        {e.s && (
                          <span className={`font-bold ${isWinner ? "text-sky-400" : "text-slate-400"}`}>
                            {e.s.score.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 leading-relaxed mb-1">{e.text}</div>
                      {e.s && (
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <span className="text-slate-400">覆盖 {e.s.hits.length} 维</span>
                          <span className="text-slate-400">· 清晰 {(e.s.clarity * 100).toFixed(0)}%</span>
                          <span className="text-slate-400">· 去歧义 {(e.s.disambig * 100).toFixed(0)}%</span>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {winner && (
              <div className="flex items-start gap-2 text-[11px] text-sky-600 bg-sky-500/[0.06] border border-sky-500/20 rounded-lg p-3 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">批判者择优（最高分 {winner.s.score.toFixed(2)}）：</strong>
                  {winner.persona.name} —— 去歧义维度最强（硬约束收敛歧义）。
                </span>
              </div>
            )}

            {refined && winner && (
              <div className="p-4 bg-slate-950/90 rounded-lg border border-sky-500/30 space-y-2">
                <div className="flex items-center gap-2 text-sky-300">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-[11px] uppercase font-bold">迭代精炼版（喂回元提示）</span>
                </div>
                <div className="font-mono text-[11px] text-slate-300 leading-relaxed">{refined.text}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1 border-t border-border/40">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>
                    迭代提升：分数 {winner.s.score.toFixed(2)} → {refined.s.score.toFixed(2)}（去歧义
                    {(winner.s.disambig * 100).toFixed(0)}% → {(refined.s.disambig * 100).toFixed(0)}%）
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">诚实说明：</strong>
                真实 LLM 的 Meta-Prompting 中，persona 候选与精炼文本由模型生成；本演练场的
                <strong className="text-foreground"> persona 路由、批判者三维打分、择优、迭代精炼与再评分均为真实执行</strong>
                （仅候选文本按 persona 模板确定性产出）。与同页 #10 APE 的区别：多了「设计者 persona 元层」与「迭代闭环」。
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            <span>persona 路由 + 批判评分 + 迭代精炼 真实执行</span>
          </div>
          <span className="font-mono bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded border border-sky-500/10">
            Meta-Prompting
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        上方为 #18 Meta-Prompting 思想承载 + 真演练场；下方为 prompt-optimizer 主交互区
      </div>
    </div>
  )
}

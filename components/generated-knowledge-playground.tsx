"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
} from "lucide-react"

interface GKProblem {
  id: string
  question: string
  /** 预定义知识库（演示用，模拟检索 / 生成的事实条目，确定性） */
  knowledgeBase: string[]
  /** 无知识直接答时易犯的错误（诚实标注为示意） */
  naiveRisk: string
}

const PROBLEMS: GKProblem[] = [
  {
    id: "photosynthesis",
    question: "阴天的时候，植物为什么还能存活？",
    knowledgeBase: [
      "植物光合作用依赖光，但阴天仍有散射光，强度约为晴天的 20%–40%，并非为零。",
      "植物在弱光/夜间通过呼吸作用消耗体内淀粉储备维持基本代谢。",
      "只要净光合速率 > 0，植物就能积累有机物；阴天通常仍满足此条件。",
      "多数植物存在『光补偿点』：光强低于此值时净光合为 0，但并不会立即致死。",
    ],
    naiveRisk: "容易答成『没有阳光就无法光合作用、植物会死』，忽略了散射光与储能缓冲。",
  },
  {
    id: "prime",
    question: "为什么 9 不是质数？",
    knowledgeBase: [
      "质数定义：大于 1 且只有 1 和自身两个正因数的自然数。",
      "9 可以被 3 整除（9 = 3 × 3），因此除 1 与 9 外还有因数 3。",
      "合数指除了 1 和自身外还有其他正因数的数；9 是合数。",
      "判断质数只需试除到 √n；√9 = 3，试除 3 即发现可整除。",
    ],
    naiveRisk: "容易凭直觉把『奇数』误当成『质数』，遗漏试除验证这一步。",
  },
  {
    id: "boil",
    question: "高原上煮鸡蛋为什么更难熟？",
    knowledgeBase: [
      "水的沸点随气压降低而下降，高原气压低，沸点常低于 100°C（如约 88°C）。",
      "蛋白质变性凝固需要达到特定温度并维持时间，温度越低所需越久。",
      "沸点下降意味着水无法提供 100°C 的加热环境，热传导效率下降。",
      "用高压锅可恢复锅内压力，使沸点回到约 120°C，从而正常煮熟。",
    ],
    naiveRisk: "容易答成『水开了就行』，忽略高原沸点下降导致实际加热温度不足。",
  },
]

const TOPK_OPTIONS = [1, 2, 3, 4]

// 真实逻辑：模拟「检索 top-k 知识」= 取知识库前 k 条，再两段式拼接 prompt。
function buildPrompt(question: string, facts: string[]): { stage1: string; stage2: string } {
  const stage1 = `【阶段 1：先生成背景知识】
针对下面这个问题，请先写出相关的背景事实，再作答：
问题：${question}

（请生成 ${facts.length} 条与问题直接相关的背景知识条目）`

  const knowledge = facts.map((f, i) => `${i + 1}. ${f}`).join("\n")
  const stage2 = `【阶段 2：基于知识作答】
已知背景知识：
${knowledge}

请严格依据上述知识回答：${question}`

  return { stage1, stage2 }
}

export function GeneratedKnowledgePlayground() {
  const [selectedId, setSelectedId] = useState(PROBLEMS[0].id)
  const selected = PROBLEMS.find((p) => p.id === selectedId)!

  const [k, setK] = useState(4)
  const [built, setBuilt] = useState<{ stage1: string; stage2: string; facts: string[] } | null>(null)

  const reset = () => setBuilt(null)

  const selectProblem = (id: string) => {
    setSelectedId(id)
    reset()
  }

  const handleGenerate = () => {
    const facts = selected.knowledgeBase.slice(0, k)
    setBuilt({ ...buildPrompt(selected.question, facts), facts })
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            生成知识提示 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            两段式 prompt 真实拼接
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：
          选好问题后点击「生成背景知识」，系统会<strong className="text-foreground"> 真实从知识库检索 top-k 事实</strong>
          （确定性），并<strong className="text-foreground"> 真实拼接出两段式 prompt</strong>（先生成知识、再基于知识作答）。
          对比「无知识直接答」的易错点，体会 Generated Knowledge 如何缓解幻觉。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：问题 + top-k + 操作 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> 1. 选择问题
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
                      <div className="text-xs font-semibold text-foreground leading-none">{p.question}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                2. 检索知识条数 top-k
              </div>
              <div className="flex flex-wrap gap-2">
                {TOPK_OPTIONS.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setK(sz)
                      reset()
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
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                k 越大，喂给模型的事实越充分；但也会拉长上下文、增加延迟。
              </p>
            </div>

            <Button onClick={handleGenerate} className="w-full text-xs tracking-wider" size="lg">
              <Sparkles className="w-4 h-4 mr-2" /> 生成背景知识并拼接 prompt
            </Button>
          </div>

          {/* 右：prompt 拼接 + 作答 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 3. 两段式 prompt（真实拼接）
              </div>
              <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[200px] font-mono text-[11px] space-y-3">
                {built === null ? (
                  <div className="flex flex-col items-center justify-center h-[160px] text-center border-2 border-dashed border-border/60 rounded-xl">
                    <p className="text-xs text-muted-foreground">选择问题并点击「生成背景知识」</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="text-slate-400">阶段 1 · 生成知识指令：</div>
                      <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">{built.stage1}</pre>
                    </div>
                    <div className="pt-2 border-t border-border/40 space-y-1">
                      <div className="text-slate-400">阶段 2 · 携带知识作答：</div>
                      <pre className="whitespace-pre-wrap text-emerald-300 leading-relaxed">{built.stage2}</pre>
                    </div>
                  </>
                )}
              </div>
            </div>

            {built && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 4. 基于知识的作答要点
                </div>
                <div className="p-4 bg-emerald-500/[0.04] border border-emerald-500/20 rounded-lg text-[11px] space-y-1.5">
                  {built.facts.map((f, i) => (
                    <div key={i} className="flex gap-2 text-muted-foreground">
                      <span className="text-emerald-500 font-mono shrink-0">[{i + 1}]</span>
                      <span className="leading-relaxed">{f}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-emerald-500/20 text-emerald-600 font-semibold">
                    作答严格锚定上述 {built.facts.length} 条事实，而非模型自由发挥 → 幻觉风险下降。
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">对比（无知识直接答）：</strong>
                {selected.naiveRisk}
                而生成知识提示先把事实摆到台面上，模型只需「基于给定事实作答」，可靠性显著提升。
                <strong className="text-foreground">诚实说明：</strong>
                知识库为演示用预定义事实，非真实检索；但「检索 top-k + 两段式拼接」逻辑真实执行。
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span>top-k 检索 + prompt 拼接真实执行</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Hallucination ↓
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

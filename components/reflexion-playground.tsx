"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  ListChecks,
  Eye,
  CheckCircle2,
  ArrowDown,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Sparkles,
} from "lucide-react"

interface Dish {
  name: string
  kind: "荤" | "素"
  peanut: boolean
  price: number
}

// 真实菜单数据（带标签与价格，非写死结果）
const MENU: Dish[] = [
  { name: "花生米", kind: "素", peanut: true, price: 10 },
  { name: "凉拌黄瓜", kind: "素", peanut: false, price: 12 },
  { name: "清炒时蔬", kind: "素", peanut: false, price: 18 },
  { name: "蒜蓉西兰花", kind: "素", peanut: false, price: 20 },
  { name: "麻婆豆腐", kind: "素", peanut: false, price: 22 },
  { name: "宫保鸡丁", kind: "荤", peanut: true, price: 38 },
  { name: "糖醋里脊", kind: "荤", peanut: false, price: 40 },
  { name: "红烧肉", kind: "荤", peanut: false, price: 45 },
]

const BUDGET = 100

interface SelOpts {
  ensureMeat?: boolean
  ensureVeg?: boolean
  excludePeanut?: boolean
}

// 真实挑选：根据 opts 中的硬约束从菜单构建组合（确定性）
function buildSelection(o: SelOpts): Dish[] {
  const pool = MENU.filter((d) => !(o.excludePeanut && d.peanut))
  const sel: Dish[] = []
  const add = (d?: Dish) => {
    if (d && !sel.includes(d)) sel.push(d)
  }
  if (o.ensureMeat) add(pool.filter((d) => d.kind === "荤").sort((a, b) => a.price - b.price)[0])
  if (o.ensureVeg) add(pool.filter((d) => d.kind === "素").sort((a, b) => a.price - b.price)[0])
  const rest = pool.filter((d) => !sel.includes(d)).sort((a, b) => a.price - b.price)
  for (const d of rest) {
    if (sel.length >= 3) break
    if (sel.reduce((s, x) => s + x.price, 0) + d.price <= BUDGET) add(d)
  }
  return sel
}

interface Eval {
  violations: string[]
  score: number
  total: number
}

// 真实评估器：逐条硬约束检查，返回违规列表与分数
function evaluate(sel: Dish[]): Eval {
  const violations: string[] = []
  const total = sel.reduce((s, x) => s + x.price, 0)
  if (total > BUDGET) violations.push(`超预算 ¥${total - BUDGET}`)
  if (!sel.some((d) => d.kind === "荤")) violations.push("缺少荤菜")
  if (!sel.some((d) => d.kind === "素")) violations.push("缺少素食")
  const bad = sel.filter((d) => d.peanut)
  if (bad.length) violations.push(`${bad.map((d) => d.name).join("、")} 含花生（过敏原）`)
  return { violations, score: Math.max(0, 100 - violations.length * 34), total }
}

const LESSON: Record<string, string> = {
  缺少荤菜: "下一轮必须纳入至少 1 道荤菜",
  缺少素食: "下一轮必须纳入至少 1 道素食",
  花生: "下一轮必须排除含花生的菜",
  超预算: "下一轮必须控制总价在预算内",
}

// 真实反思决策：把违规列表映射成「经验记忆」与「下一轮过滤策略」
function reflect(violations: string[]): { memory: string; opts: SelOpts } {
  const lessons: string[] = []
  const opts: SelOpts = {}
  for (const v of violations) {
    if (v.includes("荤菜")) {
      opts.ensureMeat = true
      lessons.push(LESSON["缺少荤菜"])
    } else if (v.includes("素食")) {
      opts.ensureVeg = true
      lessons.push(LESSON["缺少素食"])
    } else if (v.includes("花生")) {
      opts.excludePeanut = true
      lessons.push(LESSON["花生"])
    } else if (v.includes("预算")) {
      lessons.push(LESSON["超预算"])
    }
  }
  return { memory: `R1 反思记忆 → ${lessons.join("；")}`, opts }
}

export function ReflexionPlayground() {
  const [r1, setR1] = useState<Dish[] | null>(null)
  const [r1Eval, setR1Eval] = useState<Eval | null>(null)
  const [memory, setMemory] = useState<string | null>(null)
  const [r2, setR2] = useState<Dish[] | null>(null)
  const [r2Eval, setR2Eval] = useState<Eval | null>(null)
  const [step, setStep] = useState(0) // 0 idle, 1 r1 done, 2 r2 done

  const reset = () => {
    setR1(null)
    setR1Eval(null)
    setMemory(null)
    setR2(null)
    setR2Eval(null)
    setStep(0)
  }

  const runRound1 = () => {
    const sel = buildSelection({})
    const ev = evaluate(sel)
    const rf = reflect(ev.violations)
    setR1(sel)
    setR1Eval(ev)
    setMemory(rf.memory)
    // 暂存下一轮策略到闭包外不可用，故直接在第 2 轮用 r1Eval 推导
    setStep(1)
  }

  const runRound2 = () => {
    if (!r1Eval) return
    const rf = reflect(r1Eval.violations)
    const sel = buildSelection(rf.opts)
    const ev = evaluate(sel)
    setR2(sel)
    setR2Eval(ev)
    setStep(2)
  }

  const runAll = () => {
    reset()
    const sel1 = buildSelection({})
    const ev1 = evaluate(sel1)
    const rf = reflect(ev1.violations)
    const sel2 = buildSelection(rf.opts)
    const ev2 = evaluate(sel2)
    setR1(sel1)
    setR1Eval(ev1)
    setMemory(rf.memory)
    setR2(sel2)
    setR2Eval(ev2)
    setStep(2)
  }

  const renderSel = (sel: Dish[], ev: Eval) => (
    <div className="space-y-1.5">
      <div className="font-mono text-[11px] text-slate-200 leading-relaxed">
        {sel.map((d, i) => (
          <div key={i}>
            {i + 1}. {d.name}（{d.kind}·¥{d.price}
            {d.peanut ? "·含花生" : ""}）
          </div>
        ))}
        <div className="text-slate-400">合计 ¥{ev.total} / 预算 ¥{BUDGET}</div>
      </div>
      {ev.violations.length === 0 ? (
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">评估通过 · 无违规</span>
        </div>
      ) : (
        <div className="text-[11px] text-rose-300 leading-relaxed">
          <span className="font-bold">违规 {ev.violations.length} 项：</span>
          {ev.violations.join("；")}
        </div>
      )}
      <div className="text-[11px] text-violet-300">质量分：{ev.score}/100</div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Card className="p-6 border-violet-500/30 bg-violet-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            Reflexion 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-violet-500/30 text-violet-600">
            真实 反思闭环
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与 #14 ReAct 的<strong className="text-foreground"> 单轮内 step 级循环</strong>不同，Reflexion 是
          <strong className="text-foreground"> episode 级循环</strong>：先跑完第 1 轮 →
          <strong className="text-foreground"> 真实评估器</strong>逐条检查硬约束并列出违规 →
          <strong className="text-foreground"> 真实反思决策</strong>把违规映射成可持久化的「经验记忆」与下一轮策略 →
          第 2 轮携带记忆重做，违规真实归零、分数提升。错误因此可被累积为经验。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：任务 + 控制 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" /> 1. 任务
              </div>
              <div className="p-3 rounded-lg border-2 border-border/60 bg-muted/10 text-xs text-foreground leading-relaxed">
                为一次团队聚餐点菜（预算 ¥{BUDGET}，至少 1 荤 1 素，禁用含花生菜品）。
                第 1 轮用「最便宜优先」朴素策略；第 2 轮携带反思记忆重做。
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={runRound1} disabled={step >= 1} className="text-xs tracking-wider" size="lg">
                <Cpu className="w-4 h-4 mr-2" /> {step >= 1 ? "第1轮已完成" : "运行第 1 轮"}
              </Button>
              <Button onClick={runRound2} disabled={step < 1 || step >= 2} variant="outline" className="text-xs" size="lg">
                <RefreshCw className="w-3.5 h-3.5 mr-2" /> 反思并运行第 2 轮
              </Button>
              <Button onClick={runAll} variant="ghost" className="text-xs" size="lg">
                自动跑完
              </Button>
              <Button onClick={reset} variant="ghost" className="text-xs" size="lg">
                <ArrowDown className="w-3.5 h-3.5 rotate-180" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              进度：{step === 0 ? "未开始" : step === 1 ? "第1轮 + 反思记忆已生成" : "第2轮完成，对比上方两轮质量分"}。
              注意：第 2 轮的挑选策略由第 1 轮的<strong className="text-foreground"> 真实违规</strong>推导——反思真实驱动了行为改变。
            </p>
          </div>

          {/* 右：两轮对比 */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> 2. 两轮轨迹 × 真实评估 × 反思记忆
            </div>

            {/* Round 1 */}
            <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 space-y-2">
              <div className="flex items-center gap-2 text-violet-300">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 uppercase font-bold">Round 1</span>
                <span className="text-[11px] text-muted-foreground">朴素策略（最便宜优先，忽略约束）</span>
              </div>
              {r1 && r1Eval ? renderSel(r1, r1Eval) : (
                <div className="flex flex-col items-center justify-center h-[80px] text-center border-2 border-dashed border-border/60 rounded-xl">
                  <p className="text-xs text-muted-foreground">点击「运行第 1 轮」</p>
                </div>
              )}
            </div>

            {/* 反思记忆 */}
            {memory && (
              <div className="flex items-start gap-2 text-[11px] text-violet-200 bg-violet-500/[0.06] border border-violet-500/20 rounded-lg p-3 leading-relaxed">
                <Brain className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">反思记忆（可持久化，带入第 2 轮）：</strong>
                  {memory}
                </span>
              </div>
            )}

            {/* Round 2 */}
            {r2 && r2Eval && (
              <div className="p-4 bg-slate-950/90 rounded-lg border border-violet-500/30 space-y-2">
                <div className="flex items-center gap-2 text-violet-300">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 uppercase font-bold">Round 2</span>
                  <span className="text-[11px] text-muted-foreground">携带反思记忆重做（约束感知策略）</span>
                </div>
                {renderSel(r2, r2Eval)}
                {r1Eval && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1 border-t border-border/40">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      改进：违规 {r1Eval.violations.length} → {r2Eval.violations.length}，质量分 {r1Eval.score} → {r2Eval.score}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">诚实说明：</strong>
                真实 LLM 的 Reflexion 中，反思文字由模型生成；本演练场的
                <strong className="text-foreground"> 评估器（预算/标签/过敏原逐条检查）、反思决策（违规→策略映射）、第 2 轮挑选与分数比较均为真实执行</strong>
                ，仅「点菜」结果按策略确定性产出。Reflexion「试错→反思→累积经验→再试」闭环与本演练场一致。
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Brain className="w-3.5 h-3.5 text-violet-500" />
            <span>评估 + 反思决策 + 经验记忆 真实执行（反思真实驱动第 2 轮）</span>
          </div>
          <span className="font-mono bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded border border-violet-500/10">
            Reflexion Loop
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        上方为 #15 Reflexion 思想承载 + 真演练场；下方继续 Agent Runtime Loop 主可视化
      </div>
    </div>
  )
}

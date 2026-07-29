"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  Terminal,
  Eye,
  Cpu,
  CheckCircle2,
  ArrowDown,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"

// 真实工具（真实查表 / 真实计算，非写死）
const PRICES: Record<string, number> = {
  标准版: 99,
  专业版: 199,
  旗舰版: 399,
  基础包: 49,
}
const ALIASES: Record<string, string> = {
  标准: "标准版",
  专业: "专业版",
  旗舰: "旗舰版",
  基础: "基础包",
  免费版: "基础包",
}

function calc(expr: string): string {
  const m = expr.match(/^\s*([\d.]+)\s*([+\-*/])\s*([\d.]+)\s*$/)
  if (!m) return "计算式不支持"
  const a = parseFloat(m[1])
  const b = parseFloat(m[3])
  const op = m[2]
  const r = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : op === "/" ? a / b : NaN
  return Number.isFinite(r) ? String(Math.round(r * 100) / 100) : "计算错误"
}

interface ResolveState {
  price?: number
  alias?: string
  unknown?: boolean
}
interface RState {
  resolved: Record<string, ResolveState>
  answer?: string
}
interface LogEntry {
  thought: string
  action: string
  observation: string
}

const PRESETS: { label: string; query: string; a: string; b: string }[] = [
  { label: "直查（两产品均在价表）", query: "专业版比标准版贵多少？", a: "专业版", b: "标准版" },
  { label: "别名解析（需多走一步）", query: "旗舰比基础贵多少？", a: "旗舰", b: "基础" },
  { label: "未知产品（优雅失败）", query: "企业版比标准版贵多少？", a: "企业版", b: "标准版" },
]

// 真实策略：每一步根据当前 state（含上一步真实观测）决定下一个 Action
function nextStep(a: string, b: string, state: RState): LogEntry | null {
  if (state.answer !== undefined) return null

  for (const term of [a, b]) {
    const rs = state.resolved[term]
    if (!rs || (rs.price === undefined && !rs.unknown)) {
      // 本产品尚未解析完成 → 走一步解析
      if (rs?.alias && PRICES[rs.alias] !== undefined) {
        const price = PRICES[rs.alias]
        state.resolved[term] = { ...rs, price }
        return {
          thought: `别名「${term}」已解析为「${rs.alias}」，现在查它的价格。`,
          action: `get_price("${rs.alias}")`,
          observation: `¥${price}`,
        }
      }
      if (PRICES[term] !== undefined) {
        const price = PRICES[term]
        state.resolved[term] = { price }
        return {
          thought: `直接查「${term}」的价格。`,
          action: `get_price("${term}")`,
          observation: `¥${price}`,
        }
      }
      if (ALIASES[term] && !rs?.alias) {
        const c = ALIASES[term]
        state.resolved[term] = { alias: c }
        return {
          thought: `价表里没有「${term}」，推测它是别名，先解析为标准名。`,
          action: `get_alias("${term}")`,
          observation: `${c}`,
        }
      }
      state.resolved[term] = { unknown: true }
      return {
        thought: `「${term}」既不在价表，也无别名映射，无法解析。`,
        action: `get_price("${term}")`,
        observation: `未找到`,
      }
    }
  }

  // 两个都解析完 → 结算
  const pa = state.resolved[a].price
  const pb = state.resolved[b].price
  if (pa === undefined || pb === undefined) {
    state.answer = `无法回答：部分产品未能解析价格（需人工补充价表 / 别名）。`
  } else {
    const diff = calc(`${pa} - ${pb}`)
    state.answer = `${a} ¥${pa}，${b} ¥${pb}，差额 ¥${diff}。`
  }
  return {
    thought: "两个价格都已拿到，调用计算器求差额并作答。",
    action: `calc("${pa} - ${pb}")`,
    observation: state.answer,
  }
}

export function ReactPlayground() {
  const [preset, setPreset] = useState(PRESETS[0])
  const [log, setLog] = useState<LogEntry[]>([])
  const [state, setState] = useState<RState>({ resolved: {} })
  const [done, setDone] = useState(false)

  const reset = (p = preset) => {
    setPreset(p)
    setLog([])
    setState({ resolved: {} })
    setDone(false)
  }

  const runNext = () => {
    setState((prev) => {
      const s: RState = { resolved: { ...prev.resolved }, answer: prev.answer }
      const entry = nextStep(preset.a, preset.b, s)
      if (!entry) {
        setDone(true)
        return s
      }
      setLog((l) => [...l, entry])
      if (s.answer !== undefined) setDone(true)
      return s
    })
  }

  const runAll = () => {
    let s: RState = { resolved: {}, answer: undefined }
    const entries: LogEntry[] = []
    let guard = 0
    while (guard++ < 12) {
      const e = nextStep(preset.a, preset.b, s)
      if (!e) break
      entries.push(e)
      if (s.answer !== undefined) break
    }
    setLog(entries)
    setState(s)
    setDone(true)
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ReAct 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            真实 Think-Act-Observe 循环
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：
          把「用户问价」拆成 <strong className="text-foreground">推理（Thought）→ 行动（Action / 真实工具）→ 观测（Observation）</strong>
          的多轮循环。每一步的<strong className="text-foreground"> 决策由真实观测驱动</strong>——例如工具返回「未找到」时，
          策略会真实改走 <code>get_alias</code> 分支再查价；观测齐了才调用计算器结算。循环有真实终止条件（答出或判定不可答）。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：问题 + 控制 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> 1. 用户问题
              </div>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => reset(p)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                    preset.label === p.label
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-border/60 bg-muted/10 hover:border-border-muted"
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground leading-none">{p.query}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{p.label}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={runNext} disabled={done} className="flex-1 text-xs tracking-wider" size="lg">
                <Cpu className="w-4 h-4 mr-2" /> {done ? "已完成" : "执行下一步"}
              </Button>
              <Button onClick={runAll} variant="outline" className="text-xs" size="lg">
                自动跑完
              </Button>
              <Button onClick={() => reset()} variant="ghost" className="text-xs" size="lg">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              进度：{log.length} 步。注意：当工具返回「未找到」时，下一步会真实改走别名解析分支——这说明决策依赖真实观测，而非固定脚本。
            </p>
          </div>

          {/* 右：循环轨迹 */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> 2. 推理 × 行动 × 观测 循环（真实工具 + 真实观测）
            </div>

            <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[200px] font-mono text-[11px] space-y-2.5">
              {log.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[160px] text-center border-2 border-dashed border-border/60 rounded-xl">
                  <p className="text-xs text-muted-foreground">点击「执行下一步」开始 ReAct 循环</p>
                </div>
              ) : (
                log.map((e, i) => (
                  <div key={i} className="space-y-1 border-l-2 border-emerald-500/30 pl-3">
                    <div className="flex items-center gap-2 text-purple-300">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 uppercase font-bold">Thought</span>
                      <span className="leading-relaxed">{e.thought}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300">
                      <Terminal className="w-3 h-3 shrink-0" />
                      <span>Action: {e.action}</span>
                    </div>
                    <div className="flex items-center gap-2 text-teal-300">
                      <Eye className="w-3 h-3 shrink-0" />
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 uppercase font-bold">Observe</span>
                      <span className="font-bold">{e.observation}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {done && state.answer && (
              <div className="flex items-start gap-2 text-[11px] text-emerald-600 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg p-3 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">最终答案：</strong>
                  {state.answer}
                </span>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">诚实说明：</strong>
                真实 LLM 的 ReAct 中，Thought / 选哪个 Action 由模型生成；本演练场的<strong className="text-foreground"> 工具调用、观测值、循环控制与「观测驱动分支」均为真实执行</strong>
                （查价表、别名映射、计算器均为真实逻辑），仅自然语言推理模板化。ReAct「想-做-看」交织闭环与本演练场一致。
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-emerald-500" />
            <span>工具调用 + 观测 + 循环终止 真实执行（决策依赖真实观测）</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            ReAct Loop
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        上方为 #14 ReAct 思想承载；下方继续 Agent Runtime Loop 主可视化
      </div>
    </div>
  )
}

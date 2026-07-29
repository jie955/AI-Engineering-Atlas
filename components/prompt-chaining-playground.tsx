"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Link2,
  Workflow,
  CheckCircle2,
  ArrowDown,
  Terminal,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"

// 词典（真实关键词匹配，非 LLM 生成）
const ISSUE_DICT: { key: string; label: string; kw: string[]; weight: number }[] = [
  { key: "pay", label: "支付/交易", kw: ["付钱", "付款", "支付", "转账", "扣款", "下单", "买"], weight: 5 },
  { key: "login", label: "登录/账号", kw: ["登录", "登陆", "账号", "密码", "注册", "验证码"], weight: 4 },
  { key: "crash", label: "闪退/崩溃", kw: ["闪退", "崩溃", "闪了", "打不开", "白屏", "卡死"], weight: 3 },
  { key: "slow", label: "卡顿/性能", kw: ["卡顿", "卡", "慢", "加载", "延迟"], weight: 2 },
  { key: "service", label: "客服/响应", kw: ["客服", "响应", "没人", "态度", "投诉"], weight: 1 },
]
const NEG = ["糟", "差", "烂", "坑", "投诉", "生气", "烦", "怒", "失望", "垃圾", "不行", "坑爹"]
const POS = ["好", "棒", "赞", "满意", "快", "顺", "不错", "给力"]
const URGENT = ["无法", "不能", "紧急", "立刻", "马上", "严重影响", "害我", "耽误"]

interface Step1Out {
  issues: { key: string; label: string; weight: number }[]
  sentiment: "neg" | "pos" | "neu"
  urgency: boolean
  signals: string[]
}
interface Step2Out {
  category: string
  priority: string
}

// 真实链路：每一步消费上一步的真实输出对象
function step1Extract(text: string): Step1Out {
  const issues = ISSUE_DICT.filter((d) => d.kw.some((k) => text.includes(k))).map((d) => ({
    key: d.key,
    label: d.label,
    weight: d.weight,
  }))
  const neg = NEG.filter((w) => text.includes(w)).length
  const pos = POS.filter((w) => text.includes(w)).length
  const sentiment: Step1Out["sentiment"] = neg > pos ? "neg" : pos > neg ? "pos" : "neu"
  const urgency = URGENT.some((w) => text.includes(w))
  const signals: string[] = []
  if (issues.length) signals.push(...issues.map((i) => `命中问题类型:${i.label}`))
  signals.push(`情感:${sentiment === "neg" ? "负面" : sentiment === "pos" ? "正面" : "中性"}`)
  if (urgency) signals.push("含紧急信号")
  if (issues.length === 0) signals.push("⚠ 未命中任何问题关键词")
  return { issues, sentiment, urgency, signals }
}

function step2Classify(s1: Step1Out): Step2Out {
  // 失败传播：若上游抽取为空，本步如实降级，而非编造分类
  if (s1.issues.length === 0) {
    return { category: "无法归类（抽取阶段无信号）", priority: "P3 · 待人工" }
  }
  const top = [...s1.issues].sort((a, b) => b.weight - a.weight)[0]
  let priority = "P2"
  if (s1.urgency && (top.key === "pay" || top.key === "login")) priority = "P0"
  else if (top.key === "pay" || top.key === "login" || top.key === "crash") priority = "P1"
  return { category: top.label, priority }
}

function step3Format(text: string, s1: Step1Out, s2: Step2Out): string {
  const lines = [
    "## 工单摘要（由链路第 3 步生成）",
    `- 问题类型: ${s2.category}`,
    `- 优先级: ${s2.priority}`,
    `- 情感倾向: ${s1.sentiment === "neg" ? "负面" : s1.sentiment === "pos" ? "正面" : "中性"}`,
    `- 紧急: ${s1.urgency ? "是" : "否"}`,
    `- 上游信号: ${s1.signals.join("；") || "无"}`,
  ]
  if (s1.issues.length === 0) {
    lines.push("")
    lines.push("> ⚠ 链路提示：第 1 步未抽取到任何信号，第 2 步已如实降级为 P3，本步无法生成有效分类——这是『上游失败向下游传播』的真实表现，需在更前面补强抽取。")
  }
  lines.push("")
  lines.push("```")
  lines.push(`原始反馈: ${text}`)
  lines.push("```")
  return lines.join("\n")
}

const PRESETS: { label: string; text: string }[] = [
  { label: "支付紧急（应判 P0）", text: "你们的App又闪退了，害我没法付钱买东西，太糟了！" },
  { label: "登录慢（应判 P1）", text: "登录一直卡，加载很慢，体验差。" },
  { label: "模糊反馈（触发失败传播）", text: "我有点不太满意，你们看看吧。" },
]

export function PromptChainingPlayground() {
  const [text, setText] = useState(PRESETS[0].text)
  const [revealed, setRevealed] = useState(0)

  const s1 = step1Extract(text)
  const s2 = step2Classify(s1)
  const s3 = step3Format(text, s1, s2)

  const reset = () => setRevealed(0)
  const stepForward = () => setRevealed((r) => Math.min(r + 1, 3))
  const runAll = () => setRevealed(3)

  const allRevealed = revealed >= 3

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Prompt Chaining 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            真实链式管线
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：
          把「用户反馈 → 工单」拆成 <strong className="text-foreground">3 个有序子提示</strong>，
          每一步<strong className="text-foreground"> 真实消费上一步的输出对象</strong>——
          抽取（Extract）的真实结果喂给归类（Classify），归类结果再喂给格式化（Format）。
          你可逐步展开，或一键跑完整条链，并观察「上游抽取失败如何真实传播到下游」。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：输入 + 控制 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> 1. 链路输入（用户原始反馈）
              </div>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  setRevealed(0)
                }}
                className="w-full h-24 p-3 rounded-lg border border-border/60 bg-slate-950/60 text-foreground text-xs font-mono resize-none focus:outline-none focus:border-emerald-500/50"
                placeholder="输入一段用户反馈…"
              />
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setText(p.text)
                      setRevealed(0)
                    }}
                    className="text-[10px] px-2 py-1 rounded-full border border-border/60 bg-muted/20 text-muted-foreground hover:border-emerald-500/50 hover:text-emerald-500 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={stepForward} disabled={allRevealed} className="flex-1 text-xs tracking-wider" size="lg">
                <Workflow className="w-4 h-4 mr-2" /> {allRevealed ? "已完成" : "运行下一步"}
              </Button>
              <Button onClick={runAll} variant="outline" className="text-xs" size="lg">
                一键跑完
              </Button>
              <Button onClick={reset} variant="ghost" className="text-xs" size="lg">
                重置
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              进度：{revealed} / 3 步。注意每一步右下角的「→ 喂给下一步」输出，正是链式的核心。
            </p>
          </div>

          {/* 右：链式步骤 */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" /> 2. 链式执行（上一步真实输出 → 下一步输入）
            </div>

            {/* Step 1 */}
            <StepCard
              idx={1}
              title="抽取 (Extract)"
              prompt="从反馈中识别问题类型、情感倾向与紧急信号。"
              revealed={revealed >= 1}
              accent="purple"
              io={
                <div className="space-y-1">
                  <div className="text-slate-400">命中问题: {s1.issues.length ? s1.issues.map((i) => i.label).join("、") : "无"}</div>
                  <div className="text-slate-400">情感: {s1.sentiment === "neg" ? "负面" : s1.sentiment === "pos" ? "正面" : "中性"} · 紧急: {s1.urgency ? "是" : "否"}</div>
                  <div className="text-teal-300 font-bold">→ 输出对象喂给第 2 步</div>
                </div>
              }
            />

            <ChainArrow show={revealed >= 1} />

            {/* Step 2 */}
            <StepCard
              idx={2}
              title="归类 (Classify)"
              prompt="基于抽取结果映射到工单类别与优先级。"
              revealed={revealed >= 2}
              accent="amber"
              io={
                <div className="space-y-1">
                  <div className="text-slate-400">类别: <span className="text-foreground">{s2.category}</span></div>
                  <div className="text-slate-400">优先级: <span className="text-foreground">{s2.priority}</span></div>
                  <div className="text-teal-300 font-bold">→ 输出对象喂给第 3 步</div>
                </div>
              }
            />

            <ChainArrow show={revealed >= 2} />

            {/* Step 3 */}
            <StepCard
              idx={3}
              title="格式化 (Format)"
              prompt="把前两步结果拼成标准化工单摘要。"
              revealed={revealed >= 3}
              accent="emerald"
              io={
                <pre className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {s3}
                </pre>
              }
            />

            {allRevealed && (
              <div className="flex items-start gap-2 text-[11px] text-emerald-600 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg p-3 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">链路完成。</strong>
                  试着把输入改成「模糊反馈」预设——第 1 步抽不到信号，第 2 步会<strong className="text-foreground"> 如实降级为 P3</strong>，第 3 步直接标注「上游失败已传播」。这正是链式管线「步骤可观测、失败可定位」的价值。
                </span>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">诚实说明：</strong>
                真实 LLM 链路中，每个子提示是一次 LLM 调用；本演练场的抽取/归类/格式化均由<strong className="text-foreground"> 真实的关键词匹配 + 权重 + 模板填充算法执行</strong>（非写死）。
                「上一步输出即下一步输入」的链式骨架、失败传播行为与真实 Prompt Chaining 一致。
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>每步真实消费上一步输出（抽取 → 归类 → 格式化）</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Prompt Chaining
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        上方为 #6 Prompt Chaining 思想承载；下方继续 #14 ReAct 思想说明
      </div>
    </div>
  )
}

function StepCard({
  idx,
  title,
  prompt,
  revealed,
  accent,
  io,
}: {
  idx: number
  title: string
  prompt: string
  revealed: boolean
  accent: "purple" | "amber" | "emerald"
  io: React.ReactNode
}) {
  const accentMap = {
    purple: "border-purple-500/40 bg-purple-500/5",
    amber: "border-amber-500/40 bg-amber-500/5",
    emerald: "border-emerald-500/40 bg-emerald-500/5",
  }[accent]
  return (
    <div className={`p-3 rounded-lg border ${revealed ? accentMap : "border-border/40 bg-muted/10"} transition-colors`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${revealed ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
          Step {idx}
        </span>
        <span className="text-xs font-semibold text-foreground">{title}</span>
        {!revealed && <span className="ml-auto text-[10px] text-muted-foreground">未运行</span>}
      </div>
      <div className="text-[10px] text-muted-foreground mb-2">子提示: {prompt}</div>
      <div className="p-2.5 rounded bg-slate-950/80 border border-border/30 font-mono text-[11px] min-h-[40px]">
        {revealed ? io : <span className="text-muted-foreground/60">点击「运行下一步」执行此步…</span>}
      </div>
    </div>
  )
}

function ChainArrow({ show }: { show: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-1 text-[10px] ${show ? "text-emerald-500" : "text-muted-foreground/40"}`}>
      <ChevronRight className="w-3 h-3" />
      <span>喂给下一步</span>
      <ChevronRight className="w-3 h-3" />
    </div>
  )
}

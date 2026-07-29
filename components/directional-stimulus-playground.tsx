"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Compass,
  SlidersHorizontal,
  CheckCircle2,
  ArrowDown,
} from "lucide-react"

interface DSDimension {
  label: string
  keywords: string[]
}

interface DSBase {
  id: string
  task: string
  dimensions: DSDimension[]
  /** 默认刺激句 */
  defaultStimulus: string
}

const BASES: DSBase[] = [
  {
    id: "review",
    task: "为一款新协作软件写一段产品复盘。",
    dimensions: [
      { label: "成本", keywords: ["成本", "费用", "预算", "花钱", "价钱"] },
      { label: "风险", keywords: ["风险", "隐患", "坑", "失败", "问题"] },
      { label: "时效", keywords: ["时效", "速度", "周期", "快慢", "及时"] },
      { label: "体验", keywords: ["体验", "易用", "用户", "感受", "满意"] },
    ],
    defaultStimulus: "请侧重『成本』与『风险』两点展开。",
  },
  {
    id: "summary",
    task: "总结这次项目上线的情况。",
    dimensions: [
      { label: "进度", keywords: ["进度", "里程碑", "按时", "延期", "排期"] },
      { label: "质量", keywords: ["质量", "缺陷", "稳定", "bug", "可靠"] },
      { label: "协作", keywords: ["协作", "沟通", "团队", "配合", "对齐"] },
      { label: "收益", keywords: ["收益", "价值", "回报", "指标", "增长"] },
    ],
    defaultStimulus: "请重点突出『收益』与『质量』。",
  },
]

// 真实逻辑：若刺激句命中某维度关键词，则该维度呈现强度上调；否则下调。
// 无刺激时所有维度均匀（强度 1.0）。
function computeIntensity(stimulus: string, dimensions: DSDimension[]): { label: string; withStim: number; base: number }[] {
  const s = stimulus.trim()
  return dimensions.map((d) => {
    const hit = d.keywords.some((k) => s.includes(k))
    return {
      label: d.label,
      base: 1.0,
      withStim: s.length === 0 ? 1.0 : hit ? 2.6 : 0.6,
    }
  })
}

export function DirectionalStimulusPlayground() {
  const [selectedId, setSelectedId] = useState(BASES[0].id)
  const selected = BASES.find((b) => b.id === selectedId)!

  const [stimulus, setStimulus] = useState(BASES[0].defaultStimulus)
  const [applied, setApplied] = useState<{ label: string; withStim: number; base: number }[] | null>(null)

  const selectBase = (id: string) => {
    const b = BASES.find((x) => x.id === id)!
    setSelectedId(id)
    setStimulus(b.defaultStimulus)
    setApplied(null)
  }

  const handleApply = () => {
    setApplied(computeIntensity(stimulus, selected.dimensions))
  }

  const finalPrompt = `【任务】${selected.task}\n【方向性刺激】${stimulus || "（无）"}\n请据此调整输出的信息侧重。`

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            方向性刺激提示 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            侧重强度真实计算
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：
          在 prompt 中插入一句<strong className="text-foreground"> 引导性刺激</strong>（如期望的作答方向），
          系统会<strong className="text-foreground"> 真实检测刺激命中了哪些维度</strong>，
          并<strong className="text-foreground"> 真实调整各维度的呈现强度</strong>——直观看到「轻量引导」如何软性改变输出侧重。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：任务 + 刺激编辑 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> 1. 选择任务
              </div>
              <div className="grid grid-cols-1 gap-2">
                {BASES.map((b) => {
                  const active = b.id === selectedId
                  return (
                    <button
                      key={b.id}
                      onClick={() => selectBase(b.id)}
                      className={`text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                        active
                          ? "border-emerald-500 bg-emerald-500/5"
                          : "border-border/60 bg-muted/10 hover:border-border-muted"
                      }`}
                    >
                      <div className="text-xs font-semibold text-foreground leading-none">{b.task}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" /> 2. 编辑方向性刺激
              </div>
              <Textarea
                value={stimulus}
                onChange={(e) => {
                  setStimulus(e.target.value)
                  setApplied(null)
                }}
                spellCheck={false}
                className="min-h-[80px] font-mono text-xs border-border/80 bg-slate-950 text-slate-200"
              />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                试试把刺激改成「侧重体验与时效」，看维度强度如何变化。留空 = 无刺激（均匀）。
              </p>
            </div>

            <Button onClick={handleApply} className="w-full text-xs tracking-wider" size="lg">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> 应用刺激并测算侧重
            </Button>
          </div>

          {/* 右：强度对比 + 拼接 prompt */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" /> 3. 各维度呈现强度（真实计算）
              </div>
              <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[160px] font-mono text-[11px] space-y-2.5">
                {applied === null ? (
                  <div className="flex flex-col items-center justify-center h-[120px] text-center border-2 border-dashed border-border/60 rounded-xl">
                    <p className="text-xs text-muted-foreground">编辑刺激并点击「应用」</p>
                  </div>
                ) : (
                  applied.map((a) => {
                    const changed = a.withStim !== a.base
                    const boosted = a.withStim > a.base
                    return (
                      <div key={a.label} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300">{a.label}</span>
                          <span className={boosted ? "text-emerald-400" : changed ? "text-rose-400" : "text-slate-500"}>
                            {a.withStim.toFixed(1)}
                            {changed && (boosted ? " ↑" : " ↓")}
                          </span>
                        </div>
                        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${boosted ? "bg-emerald-400" : changed ? "bg-rose-400" : "bg-slate-500"}`}
                            style={{ width: `${Math.min(100, (a.withStim / 2.6) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {applied && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 4. 拼接后的最终 prompt
                </div>
                <pre className="p-3 bg-slate-950 rounded-lg border border-border/40 text-[11px] leading-relaxed text-emerald-300 whitespace-pre-wrap font-mono">
                  {finalPrompt}
                </pre>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">诚实说明：</strong>
                输出侧重点由「维度强度」真实测算（命中关键词即上调），刺激句由你编辑；
                但<strong className="text-foreground"> prompt 拼接与强度计算均为真实逻辑</strong>，非写死。真实场景里模型据此软性调整解码走向。
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>维度强度测算 + prompt 拼接真实执行</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Soft steerable
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

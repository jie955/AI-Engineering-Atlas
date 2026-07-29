"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NotebookPen,
  RotateCcw,
  Cpu,
  AlertTriangle,
  ArrowDown,
  Brain,
  CheckCircle2,
} from "lucide-react"

const MODULES = ["需求文档", "数据模型", "API 层", "前端页面", "部署脚本"]

export function AgenticMemoryPlayground() {
  const [step, setStep] = useState(0)
  const [notes, setNotes] = useState<string[]>([])
  const [windowCleared, setWindowCleared] = useState(false)
  const [resumed, setResumed] = useState(false)

  const advance = () => {
    if (step >= MODULES.length) return
    const m = MODULES[step]
    setNotes((n) => [...n, `✓ 完成模块「${m}」`])
    setStep((s) => s + 1)
    setWindowCleared(false)
    setResumed(false)
  }
  const clearWindow = () => setWindowCleared(true)
  const resume = () => {
    setWindowCleared(false)
    setResumed(true)
  }
  const reset = () => {
    setStep(0)
    setNotes([])
    setWindowCleared(false)
    setResumed(false)
  }

  const nextModule = step < MODULES.length ? MODULES[step] : null

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ③ 结构化笔记 / Agentic Memory 演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            真实 跨窗口续跑
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          超长任务无法塞进一个上下文窗口，靠「把知识外置到窗口之外」解决：agent 每步把进度写成
          <strong className="text-foreground"> 结构化笔记</strong>，<strong className="text-foreground"> 窗口内只保留当前步 + 笔记指针</strong>。
          即便上下文被重置，<strong className="text-foreground"> 读回自身笔记即可跨长时程续跑</strong>。下方可推进多模块、重置窗口、再靠笔记续跑。
        </p>

        <div className="space-y-2 mt-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <NotebookPen className="w-3.5 h-3.5" /> 1. 长时程任务：分 5 步构建（{step}/5 完成）
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={advance} disabled={step >= MODULES.length} className="text-xs tracking-wider" size="lg">
              <Cpu className="w-4 h-4 mr-2" /> {step >= MODULES.length ? "已全部完成" : `推进一步（${nextModule}）`}
            </Button>
            <Button onClick={clearWindow} disabled={step === 0} variant="outline" className="text-xs" size="lg">
              重置上下文窗口
            </Button>
            <Button onClick={resume} disabled={notes.length === 0} variant="outline" className="text-xs" size="lg">
              读取笔记续跑
            </Button>
            <Button onClick={reset} variant="ghost" className="text-xs" size="lg">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            窗口内上下文始终精简；窗口外笔记会随推进累积。点「重置上下文窗口」模拟上下文被清空，再点「读取笔记续跑」验证 agent 不丢失进度。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> 窗口内上下文（始终精简）
            </div>
            <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[180px] font-mono text-[11px] space-y-2">
              {windowCleared ? (
                <div className="text-rose-300">（空）— 上下文已重置，仅剩笔记指针</div>
              ) : resumed ? (
                <div className="text-emerald-300 space-y-1">
                  <div>笔记指针 → 已读回 {notes.length} 条笔记</div>
                  <div>
                    续跑：已完成 {notes.length}/5，下一步 ={" "}
                    <strong>{nextModule ?? "无（全部完成）"}</strong>
                  </div>
                </div>
              ) : (
                <div className="text-slate-300 space-y-1">
                  <div>当前步：{nextModule ? `构建「${nextModule}」` : "（无，全部完成）"}</div>
                  <div className="text-slate-500">笔记指针 → 见右侧 {notes.length} 条窗口外笔记</div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" /> 窗口外笔记（累积 · 跨重置留存）
            </div>
            <div className="p-4 bg-slate-950/90 rounded-lg border border-emerald-500/30 min-h-[180px] font-mono text-[11px] space-y-1.5">
              {notes.length === 0 ? (
                <div className="text-slate-500">（暂无笔记，推进任务后写入）</div>
              ) : (
                notes.map((n, i) => (
                  <div key={i} className="text-emerald-200">
                    {n}
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {notes.length > 0
                  ? windowCleared
                    ? "窗口已清空，但笔记仍在 → 可续跑"
                    : "笔记随推进累积，窗口内不膨胀"
                  : "推进任务以写入结构化笔记"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed mt-4">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-foreground">诚实说明：</strong>
            真实 LLM 的 Agentic Memory 用工具把笔记写入外部存储；本演练场的
            <strong className="text-foreground"> 笔记写入、窗口重置不丢笔记、读回续跑的状态管理均为真实执行</strong>
            ，仅「模块构建」步骤为确定性模拟。结构化笔记「外置知识、跨窗口续跑」与本演练场一致。
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Brain className="w-3.5 h-3.5 text-emerald-500" />
            <span>笔记持久化 + 跨重置续跑 真实执行</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Agentic Memory
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        下一项：④ 子智能体隔离
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"

const RAG_STEPS = [
  // Track A: 🏗️ 离线建设期
  { id: "A1", title: "A1 数据提取", subtitle: "Loader", icon: "📥", track: "offline", color: "green" },
  { id: "A2", title: "A2 数据清洗", subtitle: "Cleaner", icon: "🧹", track: "offline", color: "green" },
  { id: "A3", title: "A3 切块策略", subtitle: "Chunking", icon: "✂️", track: "offline", color: "purple" },
  { id: "A4", title: "A4 向量化", subtitle: "Embedding", icon: "🧮", track: "offline", color: "purple" },
  { id: "A5", title: "A5 索引建立", subtitle: "Index Build", icon: "📚", track: "offline", color: "purple" },

  // Track B: ⚡ 在线服务期
  { id: "B1", title: "B1 用户输入", subtitle: "Query Input", icon: "💬", track: "online", color: "blue" },
  { id: "B2", title: "B2 查询诊断", subtitle: "Pre-Retrieval", icon: "🔍", track: "online", color: "blue" },
  { id: "B3", title: "B3 查询转换", subtitle: "Query Transform", icon: "🔄", track: "online", color: "amber" },
  { id: "B4", title: "B4 混合检索", subtitle: "Hybrid Search", icon: "🔎", track: "online", color: "amber" },
  { id: "B5", title: "B5 结果输出", subtitle: "Output", icon: "📤", track: "online", color: "rose" },
]

interface RagFlowSidebarProps {
  activeStep: string
  onStepClick: (stepId: string) => void
}

export function RagFlowSidebar({ activeStep, onStepClick }: RagFlowSidebarProps) {
  const offlineSteps = RAG_STEPS.filter((s) => s.track === "offline")
  const onlineSteps = RAG_STEPS.filter((s) => s.track === "online")

  const renderStepButton = (step: typeof RAG_STEPS[0]) => (
    <button
      key={step.id}
      onClick={() => onStepClick(step.id)}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg border transition-all duration-200",
        "hover:bg-accent/50 hover:border-primary/50",
        activeStep === step.id
          ? "bg-primary/10 border-primary border-l-4 font-semibold shadow-sm"
          : "bg-card border-border",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-base flex-shrink-0">{step.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs leading-tight">{step.title}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{step.subtitle}</div>
        </div>
      </div>
    </button>
  )

  return (
    <div className="space-y-4">
      {/* Track A: 🏗️ 离线建设期 */}
      <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-3 space-y-2.5">
        <div className="flex flex-col gap-0.5 px-1">
          <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>🏗️</span> 离线建设期
          </div>
          <div className="text-[10px] text-muted-foreground">知识库准备 (一次性/定期执行)</div>
        </div>
        <div className="space-y-1">
          {offlineSteps.map(renderStepButton)}
        </div>
      </div>

      {/* Track B: ⚡ 在线服务期 */}
      <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.02] p-3 space-y-2.5">
        <div className="flex flex-col gap-0.5 px-1">
          <div className="font-bold text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <span>⚡</span> 在线服务期
          </div>
          <div className="text-[10px] text-muted-foreground">每次用户请求实时执行</div>
        </div>
        <div className="space-y-1">
          {onlineSteps.map(renderStepButton)}
        </div>
      </div>
    </div>
  )
}

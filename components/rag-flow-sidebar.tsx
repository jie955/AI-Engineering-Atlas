"use client"

import { cn } from "@/lib/utils"

const RAG_STEPS = [
  // Phase 0: Client Interaction
  { id: "user-input", title: "1. 用户输入", subtitle: "Query Input", icon: "💬", phase: "客户交互", color: "blue" },
  {
    id: "pre-retrieval",
    title: "2. 系统诊断与转换",
    subtitle: "Pre-Retrieval",
    icon: "🔍",
    phase: "客户交互",
    color: "blue",
  },

  // Phase 1: ETL (Data Preparation)
  { id: "etl-extract", title: "1.1 数据提取", subtitle: "Loader", icon: "📥", phase: "ETL 阶段", color: "green" },
  { id: "etl-transform", title: "1.2 数据转换", subtitle: "Cleaner", icon: "🧹", phase: "ETL 阶段", color: "green" },

  // Phase 2: Indexing & Chunking
  { id: "chunking", title: "2.1 切块策略", subtitle: "Chunking", icon: "✂️", phase: "索引与切块", color: "purple" },
  { id: "embedding", title: "2.2 向量化", subtitle: "Embedding", icon: "🧮", phase: "索引与切块", color: "purple" },
  { id: "indexing", title: "2.3 索引建立", subtitle: "Index Build", icon: "📚", phase: "索引与切块", color: "purple" },

  // Phase 3: Retrieval
  {
    id: "query-transform",
    title: "3.1 查询转换",
    subtitle: "Query Transform",
    icon: "🔄",
    phase: "检索阶段",
    color: "amber",
  },
  {
    id: "hybrid-search",
    title: "3.2 混合检索",
    subtitle: "Hybrid Search",
    icon: "🔎",
    phase: "检索阶段",
    color: "amber",
  },
  { id: "reranking", title: "3.3 重排器", subtitle: "Re-ranking", icon: "📊", phase: "检索阶段", color: "amber" },

  // Phase 4: Generation
  {
    id: "context-assembly",
    title: "4.1 上下文组装",
    subtitle: "Prompt Build",
    icon: "🧩",
    phase: "生成阶段",
    color: "rose",
  },
  {
    id: "llm-generation",
    title: "4.2 LLM 合成与输出",
    subtitle: "Generation",
    icon: "✨",
    phase: "生成阶段",
    color: "rose",
  },

  // Phase 5: Output & Feedback
  {
    id: "output-display",
    title: "5. 结果输出与引用",
    subtitle: "Output",
    icon: "📤",
    phase: "客户交互",
    color: "blue",
  },
  {
    id: "feedback-loop",
    title: "6. 用户反馈",
    subtitle: "Feedback Loop",
    icon: "🔁",
    phase: "持续优化",
    color: "cyan",
  },
]

interface RagFlowSidebarProps {
  activeStep: string
  onStepClick: (stepId: string) => void
}

export function RagFlowSidebar({ activeStep, onStepClick }: RagFlowSidebarProps) {
  // Group steps by phase
  const groupedSteps = RAG_STEPS.reduce(
    (acc, step) => {
      if (!acc[step.phase]) {
        acc[step.phase] = []
      }
      acc[step.phase].push(step)
      return acc
    },
    {} as Record<string, typeof RAG_STEPS>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedSteps).map(([phase, steps]) => (
        <div key={phase}>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">{phase}</h4>
          <div className="space-y-1">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200",
                  "hover:bg-accent/50 hover:border-primary/50",
                  activeStep === step.id
                    ? "bg-primary/10 border-primary border-l-4 font-semibold shadow-sm"
                    : "bg-card border-border",
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0 mt-0.5">{step.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs leading-tight">{step.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{step.subtitle}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

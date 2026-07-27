"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Loader2, 
  Network, 
  ArrowLeft, 
  Sparkles, 
  Database, 
  GitBranch, 
  Search, 
  ArrowRight,
  Check,
  Activity,
  Cpu,
  Layers,
  HelpCircle
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Entity {
  id: string
  name: string
  type: string
  properties: Record<string, string>
}

interface Relationship {
  from: string
  to: string
  type: string
  properties?: Record<string, string>
}

interface GraphData {
  entities: Entity[]
  relationships: Relationship[]
}

interface GraphRAGResult {
  query: string
  entities: Entity[]
  relationships: Relationship[]
  reasoning: string[]
  finalAnswer: string
}

const sampleKnowledgeGraph: GraphData = {
  entities: [
    { id: "e1", name: "GPT-4", type: "模型", properties: { 发布时间: "2023", 厂商: "OpenAI" } },
    { id: "e2", name: "Claude 3", type: "模型", properties: { 发布时间: "2024", 厂商: "Anthropic" } },
    { id: "e3", name: "OpenAI", type: "公司", properties: { 国家: "美国", 成立: "2015" } },
    { id: "e4", name: "Anthropic", type: "公司", properties: { 国家: "美国", 成立: "2021" } },
    {
      id: "e5",
      name: "Transformer",
      type: "架构",
      properties: { 提出时间: "2017", 论文: "Attention is All You Need" },
    },
    { id: "e6", name: "RAG", type: "技术", properties: { 类型: "检索增强", 应用: "问答系统" } },
    { id: "e7", name: "向量数据库", type: "基础设施", properties: { 功能: "语义检索", 示例: "Pinecone" } },
  ],
  relationships: [
    { from: "e1", to: "e3", type: "开发商" },
    { from: "e2", to: "e4", type: "开发商" },
    { from: "e1", to: "e5", type: "基于架构" },
    { from: "e2", to: "e5", type: "基于架构" },
    { from: "e6", to: "e1", type: "使用模型" },
    { from: "e6", to: "e7", type: "依赖组件" },
  ],
}

const graphRAGSteps = [
  {
    id: "entity-extraction",
    title: "实体识别与抽取",
    icon: Search,
    description: "从查询中识别关键实体，映射到知识图谱中的节点",
    color: "text-blue-500",
  },
  {
    id: "subgraph-retrieval",
    title: "子图检索",
    icon: GitBranch,
    description: "基于实体进行多跳遍历，构建相关子图",
    color: "text-cyan-500",
  },
  {
    id: "reasoning",
    title: "关系推理",
    icon: Network,
    description: "分析实体间的关系路径，进行逻辑推理",
    color: "text-teal-500",
  },
  {
    id: "generation",
    title: "答案生成",
    icon: Sparkles,
    description: "结合子图上下文，生成结构化答案",
    color: "text-emerald-500",
  },
]

function simulateGraphRAG(query: string): GraphRAGResult {
  const lowerQuery = query.toLowerCase()

  const entities: Entity[] = []
  const relationships: Relationship[] = []
  let reasoning: string[] = []
  let finalAnswer = ""

  if (lowerQuery.includes("gpt") || lowerQuery.includes("openai")) {
    entities.push(sampleKnowledgeGraph.entities[0], sampleKnowledgeGraph.entities[2], sampleKnowledgeGraph.entities[4])
    relationships.push(sampleKnowledgeGraph.relationships[0], sampleKnowledgeGraph.relationships[2])
    reasoning = [
      "步骤1: 识别核心实体 'GPT-4'",
      "步骤2: 检索开发商关系 → OpenAI",
      "步骤3: 检索技术架构关系 → Transformer",
      "步骤4: 综合子图信息生成答案",
    ]
    finalAnswer =
      "GPT-4 是由 OpenAI 开发的大语言模型，于 2023 年发布。它基于 Transformer 架构（2017年提出），该架构来源于论文 'Attention is All You Need'。OpenAI 成立于 2015 年，总部位于美国。"
  } else if (lowerQuery.includes("rag") || lowerQuery.includes("检索")) {
    entities.push(sampleKnowledgeGraph.entities[5], sampleKnowledgeGraph.entities[0], sampleKnowledgeGraph.entities[6])
    relationships.push(sampleKnowledgeGraph.relationships[4], sampleKnowledgeGraph.relationships[5])
    reasoning = [
      "步骤1: 识别技术实体 'RAG'",
      "步骤2: 检索使用模型关系 → GPT-4",
      "步骤3: 检索依赖组件关系 → 向量数据库",
      "步骤4: 多跳推理完整技术栈",
    ]
    finalAnswer =
      "RAG（检索增强生成）是一种问答系统技术。它通常使用 GPT-4 等大语言模型作为生成引擎，并依赖向量数据库（如 Pinecone）进行语义检索。RAG 通过将外部知识检索与模型生成相结合，显著提升了答案的准确性和可信度。"
  } else {
    entities.push(sampleKnowledgeGraph.entities[0], sampleKnowledgeGraph.entities[1])
    relationships.push(sampleKnowledgeGraph.relationships[2], sampleKnowledgeGraph.relationships[3])
    reasoning = ["步骤1: 提取查询意图", "步骤2: 匹配相关实体节点", "步骤3: 分析实体间关系", "步骤4: 生成综合答案"]
    finalAnswer =
      "当前知识图谱包含 AI 大模型、公司、技术架构等多个实体及其关系。您可以尝试询问 'GPT-4 的开发商' 或 'RAG 技术依赖什么' 来体验图检索的强大能力。"
  }

  return { query, entities, relationships, reasoning, finalAnswer }
}

export default function GraphRAGDemoPage() {
  const [query, setQuery] = useState("GPT-4 是谁开发的？基于什么架构？")
  const [result, setResult] = useState<GraphRAGResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeStep, setActiveStep] = useState<number>(-1)
  const { toast } = useToast()

  const handleQuery = async () => {
    if (!query.trim()) return

    setResult(null)
    setIsProcessing(true)
    
    // Step-by-step sequential activation of GraphRAG pipeline stages
    setActiveStep(0)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setActiveStep(1)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setActiveStep(2)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setActiveStep(3)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setActiveStep(4) // Completed!

    const graphResult = simulateGraphRAG(query)
    setResult(graphResult)
    setIsProcessing(false)

    toast({
      title: "图检索完成",
      description: `已检索 ${graphResult.entities.length} 个实体和 ${graphResult.relationships.length} 条关系`,
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit">
              <Button
                variant="ghost"
                size="sm"
                className="transition-all duration-300 hover:bg-accent hover:translate-x-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
                  <Network className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  <span className="text-balance leading-tight">GraphRAG 图检索增强生成</span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  基于知识图谱的检索增强 - 实体关系推理与多跳查询
                </p>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1 font-medium w-fit">
                <Database className="w-4 h-4 mr-2 inline" />
                知识图谱驱动
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 sm:py-8">
        <Tabs defaultValue="query" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="query">查询执行</TabsTrigger>
            <TabsTrigger value="process">处理流程</TabsTrigger>
            <TabsTrigger value="graph">知识图谱</TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="space-y-6">
            <Card className="p-6 sm:p-8 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <span className="text-balance">图查询输入</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="query" className="block text-sm font-medium mb-2 text-foreground">
                    您的查询（支持多跳推理）
                  </label>
                  <Textarea
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="例如：GPT-4 是谁开发的？基于什么架构？"
                    className="min-h-[100px] text-base resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    提示：尝试 "RAG 技术依赖什么？" 或 "OpenAI 开发了哪些模型？"
                  </p>
                </div>

                <Button
                  onClick={handleQuery}
                  disabled={isProcessing || !query.trim()}
                  className="w-full h-12 text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-md"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      图检索中...
                    </>
                  ) : (
                    <>
                      <Network className="w-5 h-5 mr-2" />
                      启动 GraphRAG 检索
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {activeStep >= 0 && (
              <Card className="p-6 sm:p-8 border border-border/60 bg-muted/20 relative overflow-hidden transition-all duration-300">
                {/* Visual Background Grid Accent */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary animate-pulse" />
                      <span>GraphRAG 执行流水线 (Pipeline Flow)</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      可视化大模型 + 知识图谱 (Graph + LLM) 检索增强的逐步流程与多步检索链
                    </p>
                  </div>
                  
                  {/* Overall Status Badge */}
                  <Badge 
                    variant={activeStep === 4 ? "default" : "secondary"}
                    className={`font-mono text-xs px-2.5 py-1 ${
                      activeStep === 4 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" 
                        : "bg-primary/10 text-primary border-primary/20 animate-pulse"
                    }`}
                  >
                    {activeStep === 4 ? (
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 检索就绪</span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        正在执行: {graphRAGSteps[activeStep]?.title || "初始化"}
                      </span>
                    )}
                  </Badge>
                </div>

                {/* Flow-based steps grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative z-10">
                  {graphRAGSteps.map((step, idx) => {
                    const StepIcon = step.icon
                    const isCurrent = activeStep === idx
                    const isCompleted = activeStep > idx
                    const isPending = activeStep < idx

                    // Decide custom border/bg colors based on state
                    let borderClass = "border-border/40 bg-card/40"
                    let badgeColor = "bg-muted text-muted-foreground"

                    if (isCurrent) {
                      borderClass = "border-primary bg-primary/5 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                      badgeColor = "bg-primary text-primary-foreground animate-pulse"
                    } else if (isCompleted) {
                      borderClass = "border-emerald-500/30 bg-emerald-500/5"
                      badgeColor = "bg-emerald-500 text-emerald-foreground"
                    }

                    return (
                      <div key={step.id} className="flex flex-col relative">
                        {/* Connecting Line to next step (for Large screens, placed absolute) */}
                        {idx < 3 && (
                          <div className="hidden lg:block absolute top-12 -right-6 w-8 z-20 pointer-events-none">
                            <div className="h-[2px] w-full relative">
                              {/* Background track line */}
                              <div className="absolute inset-0 bg-border/40" />
                              {/* Flowing highlight line */}
                              {isCompleted && (
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-primary"
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 0.4 }}
                                />
                              )}
                              {isCurrent && (
                                <div className="absolute inset-0 bg-primary/40 animate-pulse" />
                              )}
                              {/* Arrow Tip */}
                              <div className={`absolute -right-1 top-1/2 -translate-y-1/2 border-y-[4px] border-y-transparent border-l-[6px] ${
                                isCompleted ? "border-l-primary" : "border-l-border/40"
                              }`} />
                            </div>
                          </div>
                        )}

                        {/* Card Component */}
                        <motion.div
                          className={`flex-1 p-5 rounded-xl border transition-all duration-300 ${borderClass}`}
                          whileHover={{ y: isPending ? 0 : -2 }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className={`p-2.5 rounded-lg ${
                              isCompleted 
                                ? "bg-emerald-500/10 text-emerald-500" 
                                : isCurrent 
                                  ? "bg-primary/10 text-primary" 
                                  : "bg-muted text-muted-foreground/60"
                            }`}>
                              <StepIcon className="w-5 h-5" />
                            </div>
                            
                            <span className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${badgeColor}`}>
                              {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                            </span>
                          </div>

                          <h4 className={`text-sm font-bold ${
                            isPending ? "text-muted-foreground/70" : "text-foreground"
                          }`}>
                            {step.title}
                          </h4>
                          
                          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                            {step.description}
                          </p>

                          {/* Real-time Loading or Result Metadata Container */}
                          <div className="min-h-[64px] flex flex-col justify-end">
                            {isCurrent && (
                              <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/10 space-y-1.5 animate-in fade-in-50">
                                <div className="flex items-center gap-1.5">
                                  <Loader2 className="w-3 h-3 text-primary animate-spin" />
                                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">执行中 ACTIVE</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-mono leading-tight">
                                  {idx === 0 && "正在从用户查询中抽取实体关键字..."}
                                  {idx === 1 && "正在匹配节点，关联多跳关系网..."}
                                  {idx === 2 && "正在计算多跳检索路径的关联得分..."}
                                  {idx === 3 && "正在整合推理上下文，合成答复..."}
                                </p>
                              </div>
                            )}

                            {isPending && (
                              <div className="mt-3 p-2 border border-dashed border-border/40 rounded-lg flex items-center justify-center h-[52px]">
                                <span className="text-[10px] text-muted-foreground/40 font-mono">WAITING PIPELINE...</span>
                              </div>
                            )}

                            {isCompleted && result && (
                              <>
                                {idx === 0 && (
                                  <div className="mt-3 pt-3 border-t border-border/30 space-y-1.5 animate-in fade-in-50 duration-500">
                                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-muted-foreground">提取实体:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {result.entities.map((e) => (
                                        <Badge key={e.id} variant="secondary" className="text-[9px] bg-blue-500/10 text-blue-500 border-blue-500/20 px-1 py-0 rounded">
                                          {e.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {idx === 1 && (
                                  <div className="mt-3 pt-3 border-t border-border/30 space-y-1 animate-in fade-in-50 duration-500">
                                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-muted-foreground">定位子图:</span>
                                    <div className="space-y-1 text-[10px] text-muted-foreground">
                                      <div className="flex items-center gap-1 font-mono">
                                        <Database className="w-3 h-3 text-cyan-500" />
                                        <span>拉取 <strong>{result.relationships.length}</strong> 条关联边</span>
                                      </div>
                                      <div className="truncate text-[9px] text-muted-foreground/80 font-mono">
                                        {result.relationships.map(r => r.type).join(" • ")}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {idx === 2 && (
                                  <div className="mt-3 pt-3 border-t border-border/30 space-y-1 animate-in fade-in-50 duration-500">
                                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-muted-foreground">多跳推理:</span>
                                    <div className="space-y-1 font-mono">
                                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Cpu className="w-3 h-3 text-teal-500" />
                                        <span>构建 <strong>{result.reasoning.length}</strong> 条逻辑推理链</span>
                                      </div>
                                      <div className="text-[9px] bg-teal-500/5 text-teal-600 dark:text-teal-400 px-1 py-0.5 rounded border border-teal-500/10 truncate animate-pulse">
                                        {result.reasoning[0]}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {idx === 3 && (
                                  <div className="mt-3 pt-3 border-t border-border/30 space-y-1 animate-in fade-in-50 duration-500">
                                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-muted-foreground">输出响应:</span>
                                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      <span>结构化响应整合就绪</span>
                                    </div>
                                    <div className="text-[9px] text-muted-foreground font-mono">
                                      内容尺寸: {result.finalAnswer.length} 字
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>
                        
                        {/* Down Arrow for Mobile Screens, placed below card */}
                        {idx < 3 && (
                          <div className="flex lg:hidden justify-center my-1 text-muted-foreground/30 pointer-events-none">
                            <motion.div
                              animate={isCurrent ? { y: [0, 4, 0] } : {}}
                              transition={{ repeat: Infinity, duration: 1.2 }}
                            >
                              <ArrowRight className="w-5 h-5 rotate-90" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {result && (
              <Card className="p-6 sm:p-8 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  生成结果
                </h3>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                  <p className="text-foreground leading-relaxed">{result.finalAnswer}</p>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-500" />
                      检索到的实体 ({result.entities.length})
                    </h4>
                    <div className="space-y-2">
                      {result.entities.map((entity) => (
                        <div key={entity.id} className="p-2 bg-background rounded text-sm">
                          <Badge variant="outline" className="mr-2">
                            {entity.type}
                          </Badge>
                          <span className="font-medium">{entity.name}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-500" />
                      关系路径 ({result.relationships.length})
                    </h4>
                    <div className="space-y-2">
                      {result.relationships.map((rel, idx) => (
                        <div key={idx} className="p-2 bg-background rounded text-sm">
                          <span className="text-muted-foreground">
                            {rel.from} → <Badge variant="secondary">{rel.type}</Badge> → {rel.to}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">GraphRAG 处理流程</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {graphRAGSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <Card key={step.id} className="p-6 border-t-4 border-primary hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <Icon className={`w-5 h-5 ${step.color}`} />
                        </div>
                        <Badge>{index + 1}</Badge>
                      </div>
                      <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </Card>
                  )
                })}
              </div>

              {result && (
                <Card className="mt-6 p-6 bg-muted/50">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-primary" />
                    推理路径追踪
                  </h3>
                  <div className="space-y-2">
                    {result.reasoning.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded">
                        <Badge variant="outline">{idx + 1}</Badge>
                        <span className="text-sm text-muted-foreground flex-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="graph" className="space-y-6">
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                <Database className="w-6 h-6 text-primary" />
                示例知识图谱
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    实体节点 ({sampleKnowledgeGraph.entities.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {sampleKnowledgeGraph.entities.map((entity) => (
                      <Card key={entity.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-foreground">{entity.name}</span>
                          <Badge variant="secondary">{entity.type}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {Object.entries(entity.properties).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    关系边 ({sampleKnowledgeGraph.relationships.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {sampleKnowledgeGraph.relationships.map((rel, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">
                            {sampleKnowledgeGraph.entities.find((e) => e.id === rel.from)?.name}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <Badge className="bg-primary/10 text-primary border-primary/20">{rel.type}</Badge>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="outline">
                            {sampleKnowledgeGraph.entities.find((e) => e.id === rel.to)?.name}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader2, BarChart3, Layers, AlertCircle } from "lucide-react"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"
import { CompactionPlayground } from "@/components/compaction-playground"
import { JitRetrievalPlayground } from "@/components/jit-retrieval-playground"
import { AgenticMemoryPlayground } from "@/components/agentic-memory-playground"
import { SubAgentIsolationPlayground } from "@/components/subagent-isolation-playground"

const contextStrategies = [
  {
    id: "minimal",
    name: "最小化上下文",
    description: "仅提供基本信息",
    example: "总结以下文本的关键点：[文本]",
    advantages: ["API 成本最低", "响应速度快"],
    disadvantages: ["输出准确度低", "缺乏深度分析"],
    outputScore: 45,
    costScore: 100,
    speedScore: 100,
  },
  {
    id: "layered",
    name: "分层上下文",
    description: "按优先级分层组织信息",
    example: "【核心背景】\n[主要信息]\n\n【补充信息】\n[次要信息]\n\n【任务】\n总结关键点",
    advantages: ["信息层级清晰", "成本控制好"],
    disadvantages: ["设计复杂", "需要精心组织"],
    outputScore: 75,
    costScore: 70,
    speedScore: 85,
  },
  {
    id: "dynamic",
    name: "动态上下文",
    description: "根据查询动态选择相关上下文",
    example: "根据以下检索结果回答问题：\n[相关文档1]\n[相关文档2]\n问题：[用户查询]",
    advantages: ["精准高效", "适合大规模场景"],
    disadvantages: ["需要检索系统", "实现复杂"],
    outputScore: 88,
    costScore: 60,
    speedScore: 75,
  },
  {
    id: "iterative",
    name: "迭代上下文",
    description: "多轮对话中持续优化上下文",
    example: "【前轮总结】\n[之前的讨论]\n\n【当前查询】\n[新问题]\n\n基于上述背景...",
    advantages: ["深度对话能力强", "上下文累积优势"],
    disadvantages: ["Token 消耗大", "需要管理对话历史"],
    outputScore: 90,
    costScore: 40,
    speedScore: 60,
  },
  {
    id: "hybrid",
    name: "混合上下文",
    description: "结合多种策略的综合方案",
    example: "【领域知识库】\n[专业背景]\n【检索结果】\n[RAG 文档]\n【对话历史】\n[前轮讨论]\n任务：[具体要求]",
    advantages: ["最优质量", "适应复杂场景"],
    disadvantages: ["成本最高", "设计最复杂"],
    outputScore: 95,
    costScore: 30,
    speedScore: 50,
  },
]

const contextDimensions = [
  {
    dimension: "信息量",
    description: "上下文包含的信息深度和广度",
    impact: "更多信息通常产生更准确的结果，但可能增加噪声",
  },
  {
    dimension: "相关性",
    description: "上下文与任务的相关程度",
    impact: "高相关性显著提升输出质量，但需要精心筛选",
  },
  {
    dimension: "结构化程度",
    description: "上下文的组织和格式化水平",
    impact: "结构清晰能帮助模型更好理解，减少歧义",
  },
  {
    dimension: "顺序",
    description: "上下文信息的排列顺序",
    impact: "位置可能影响模型的注意力分配（位置偏差）",
  },
  {
    dimension: "噪声比",
    description: "上下文中的无关信息占比",
    impact: "低噪声比提高效率，但完全过滤可能丢失重要信息",
  },
]

const realWorldExamples = [
  {
    scenario: "客服系统",
    challenge: "需要结合用户历史、产品知识、业务规则",
    strategy: "分层上下文 + 动态检索",
    benefits: "快速准确解答，减少用户等待",
  },
  {
    scenario: "代码生成",
    challenge: "需要项目结构、API 文档、编码规范",
    strategy: "混合上下文（代码库 + 约束 + 示例）",
    benefits: "生成代码更符合项目风格和要求",
  },
  {
    scenario: "研究论文撰写",
    challenge: "需要大量参考文献、主题背景、论文风格",
    strategy: "分层上下文 + 迭代优化",
    benefits: "内容学术严谨，论述有据可查",
  },
  {
    scenario: "多语言翻译",
    challenge: "需要文化背景、术语表、上下文含义",
    strategy: "动态上下文（术语库 + 相似例句）",
    benefits: "翻译更自然，术语一致性高",
  },
]

export default function ContextEngineeringDemoPage() {
  const [selectedStrategy, setSelectedStrategy] = useState("layered")
  const [userInput, setUserInput] = useState(
    "请基于我的背景和需求，推荐最合适的技术栈。我是一个全栈开发者，团队规模 5 人，需要快速迭代，成本受限。"
  )
  const [isSimulating, setIsSimulating] = useState(false)
  const [output, setOutput] = useState("")

  const handleSimulate = async () => {
    setIsSimulating(true)
    setOutput("")

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const strategy = contextStrategies.find((s) => s.id === selectedStrategy)
    const mockOutput = `
【使用策略】${strategy?.name}

这是使用"${strategy?.name}"策略构建上下文的模拟输出。

【分析结果】
✓ 输出质量评分: ${strategy?.outputScore}/100
✓ 成本效率评分: ${strategy?.costScore}/100  
✓ 响应速度评分: ${strategy?.speedScore}/100

【优势】
${strategy?.advantages.map((a) => `• ${a}`).join("\n")}

【劣势】
${strategy?.disadvantages.map((d) => `• ${d}`).join("\n")}

【建议】
基于你的输入，该策略在这个场景中表现出以下特点：
- 平衡了质量和成本
- 适合中等规模的应用
- 易于实施和维护
    `

    setOutput(mockOutput)
    setIsSimulating(false)
  }

  return (
    <DemoShell demoId="context-engineering">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DemoHero
          demoId="context-engineering"
          badge="ATLAS NODE #01"
          title="Context Engineering Playroom"
          description="系统化上下文工程方法论。通过优化提示词之外的信息结构（记忆、检索、工具、状态），让大模型在复杂任务中保持稳定的推理质量。"
        />

        <Tabs defaultValue="strategies" className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-muted/40 p-1 rounded-xl border border-border/50 h-12">
            <TabsTrigger value="strategies" className="text-sm">策略对比</TabsTrigger>
            <TabsTrigger value="dimensions" className="text-sm">核心维度</TabsTrigger>
            <TabsTrigger value="examples" className="text-sm">实战案例</TabsTrigger>
            <TabsTrigger value="playground" className="text-sm">交互演练</TabsTrigger>
            <TabsTrigger value="spec" className="text-sm text-primary font-medium">📋 Engineering Spec</TabsTrigger>
          </TabsList>

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">上下文构建策略</h2>
              <p className="text-muted-foreground">
                不同的上下文组织方式会显著影响 LLM 的输出质量、成本和速度。选择合适的策略至关重要。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {contextStrategies.map((strategy) => (
                <Card key={strategy.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{strategy.name}</CardTitle>
                        <CardDescription className="mt-1">{strategy.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                      <p className="text-sm font-mono text-muted-foreground">{strategy.example}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <span className="text-green-500">✓</span> 优势
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {strategy.advantages.map((adv, idx) => (
                            <li key={idx}>• {adv}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <span className="text-red-500">✗</span> 劣势
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {strategy.disadvantages.map((dis, idx) => (
                            <li key={idx}>• {dis}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">输出质量</span>
                          <span className="font-semibold">{strategy.outputScore}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-chart-2"
                            style={{ width: `${strategy.outputScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">成本效率</span>
                          <span className="font-semibold">{strategy.costScore}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-chart-3 to-chart-2"
                            style={{ width: `${strategy.costScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">响应速度</span>
                          <span className="font-semibold">{strategy.speedScore}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-chart-4 to-chart-3"
                            style={{ width: `${strategy.speedScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Dimensions Tab */}
          <TabsContent value="dimensions" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">上下文核心维度</h2>
              <p className="text-muted-foreground">
                理解这五个关键维度将帮助你更精准地设计和优化上下文，最大化 LLM 的性能。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contextDimensions.map((item, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      {item.dimension}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                      <p className="text-sm font-medium flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                        <span>{item.impact}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">实战应用案例</h2>
              <p className="text-muted-foreground">
                看看不同行业和应用场景中如何运用上下文工程来解决实际问题。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {realWorldExamples.map((example, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{example.scenario}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-1 text-muted-foreground">挑战</h4>
                      <p className="text-sm">{example.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1 text-muted-foreground">策略</h4>
                      <Badge variant="secondary">{example.strategy}</Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1 text-muted-foreground">收益</h4>
                      <p className="text-sm">{example.benefits}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Playground Tab */}
          <TabsContent value="playground" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">交互演练场</h2>
              <p className="text-muted-foreground">
                选择一种策略，输入你的任务，看看不同的上下文组织方式会如何影响输出。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strategy Selection */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">选择策略</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {contextStrategies.map((strategy) => (
                      <Button
                        key={strategy.id}
                        variant={selectedStrategy === strategy.id ? "default" : "outline"}
                        className="w-full justify-start bg-transparent"
                        onClick={() => setSelectedStrategy(strategy.id)}
                      >
                        <span className="text-xs">{strategy.name}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Input & Output */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">输入任务</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="描述你的任务..."
                      className="min-h-32"
                    />
                    <Button
                      onClick={handleSimulate}
                      disabled={isSimulating}
                      className="w-full mt-4"
                    >
                      {isSimulating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          模拟中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          模拟执行
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {output && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">输出结果</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 p-4 rounded-lg border border-border/50 whitespace-pre-wrap text-sm font-mono text-muted-foreground max-h-64 overflow-y-auto">
                        {output}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tab 5: Context Engineering Spec */}
          <TabsContent value="spec" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 columns: Architecture & Specifications */}
              <div className="lg:col-span-2 space-y-8">
                {/* Section 1: Overview */}
                <Card className="p-6 border-l-4 border-l-primary bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-mono text-primary uppercase tracking-widest">ENTERPRISE BLUEPRINT</span>
                      <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">Context Orchestration Architecture</h3>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 font-mono text-xs">
                      STATUS: PRODUCTION APPROVED
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    大模型的“长上下文”能力（如 1M+ tokens）在生产中不能被滥用。滥用长上下文会导致 1) <strong>首包延迟 (TTFT) 呈线性或指数级增长</strong>，2) <strong>上下文丢失 (Lost in the Middle) 概率增加</strong>，以及 3) <strong>API 账单成倍暴涨</strong>。本规范制定了高吞吐量 LLM 系统中的上下文动态分层与缓存规范。
                  </p>
                </Card>

                {/* Section 2: Attention Distribution Diagram */}
                <Card className="p-6 space-y-6 bg-card border border-border shadow-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">1</span>
                      <h4 className="text-lg font-bold text-foreground">
                        注意力分配规律
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono tracking-wider">
                      LLM Attention Curve · Lost in the Middle
                    </p>
                  </div>

                  <div className="bg-muted/50 border border-border/50 p-4 rounded-xl space-y-4">
                    <h5 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                      核心规律
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      大语言模型对上下文的注意力权重并非均匀分布，而是呈 <strong>U 形曲线</strong>：头部（System Prompt、System Instructions）和尾部（用户当前问题 Query）获得最高的注意力权重，中部内容（检索到的辅助文档、背景信息）的注意力权重显著偏低。
                    </p>
                  </div>

                  {/* SVG Attention Curve Chart */}
                  <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="text-xs font-semibold text-foreground font-mono flex justify-between items-center pb-2 border-b border-border/20">
                      <span>注意力权重 (Attention Weight)</span>
                      <span className="text-[10px] text-purple-500 font-medium bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        ● U 型曲线分布规律
                      </span>
                    </div>

                    <div className="relative w-full overflow-hidden">
                      <svg viewBox="0 0 700 240" className="w-full h-auto text-muted-foreground select-none">
                        <defs>
                          {/* Gradient for the area under the attention curve */}
                          <linearGradient id="attention-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.15)" />
                            <stop offset="60%" stopColor="rgba(59, 130, 246, 0.05)" />
                            <stop offset="100%" stopColor="rgba(244, 63, 94, 0.0)" />
                          </linearGradient>
                          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#f43f5e" />
                          </linearGradient>
                          {/* Drop shadow for glowing line */}
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Dashed Horizontal Gridlines with labels */}
                        {/* 1.0 */}
                        <line x1="50" y1="30" x2="650" y2="30" className="stroke-border/60" strokeDasharray="3 3" />
                        <text x="25" y="34" className="text-[10px] font-mono fill-muted-foreground font-medium text-right">1.0 ┤</text>

                        {/* 0.5 */}
                        <line x1="50" y1="110" x2="650" y2="110" className="stroke-border/40" strokeDasharray="3 3" />
                        <text x="25" y="114" className="text-[10px] font-mono fill-muted-foreground text-right">0.5 ┤</text>

                        {/* 0.1 */}
                        <line x1="50" y1="174" x2="650" y2="174" className="stroke-border/40" strokeDasharray="3 3" />
                        <text x="25" y="178" className="text-[10px] font-mono fill-muted-foreground text-right">0.1 ┤</text>

                        {/* The U-shape curve filled area */}
                        <path
                          d="M 50 30 C 150 180, 250 180, 350 180 C 450 180, 550 180, 650 30 L 650 192 L 50 192 Z"
                          fill="url(#attention-grad)"
                        />

                        {/* The U-shape curve line */}
                        <path
                          d="M 50 30 C 150 180, 250 180, 350 180 C 450 180, 550 180, 650 30"
                          fill="none"
                          stroke="url(#line-grad)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          filter="url(#glow)"
                        />

                        {/* Low Attention middle shading block / pill (repositioned cleanly above the valley) */}
                        <g>
                          <rect 
                            x="260" 
                            y="110" 
                            width="180" 
                            height="30" 
                            rx="15" 
                            style={{ fill: 'var(--card, #ffffff)', stroke: 'var(--border, #e4e4e7)' }} 
                            strokeWidth="1.5"
                            fillOpacity="0.95"
                          />
                          <text 
                            x="350" 
                            y="129" 
                            textAnchor="middle" 
                            className="text-[11.5px] font-sans fill-muted-foreground font-bold tracking-widest"
                          >
                            低注意力区 (中部)
                          </text>
                        </g>

                        {/* Highlight nodes */}
                        {/* 0% System Prompt */}
                        <circle cx="50" cy="30" r="5" className="fill-purple-400" />
                        <circle cx="50" cy="30" r="8" className="fill-purple-400/20 stroke-purple-400/40" strokeWidth="1" />
                        
                        {/* 50% Middle */}
                        <circle cx="350" cy="180" r="4" className="fill-blue-400" />
                        <circle cx="350" cy="180" r="7" className="fill-blue-400/20 stroke-blue-400/40" strokeWidth="1" />

                        {/* 100% Query */}
                        <circle cx="650" cy="30" r="5" className="fill-rose-400" />
                        <circle cx="650" cy="30" r="8" className="fill-rose-400/20 stroke-rose-400/40" strokeWidth="1" />

                        {/* X-axis line */}
                        <line x1="50" y1="192" x2="650" y2="192" className="stroke-border" strokeWidth="1" />

                        {/* X-axis tick lines */}
                        <line x1="50" y1="192" x2="50" y2="197" className="stroke-border" />
                        <line x1="350" y1="192" x2="350" y2="197" className="stroke-border" />
                        <line x1="650" y1="192" x2="650" y2="197" className="stroke-border" />

                        {/* Axis Labels */}
                        <text x="50" y="210" textAnchor="middle" className="text-[11px] font-mono fill-foreground font-semibold">0%</text>
                        <text x="50" y="226" textAnchor="middle" className="text-[10px] font-sans fill-muted-foreground">(System Prompt)</text>

                        <text x="350" y="210" textAnchor="middle" className="text-[11px] font-mono fill-foreground font-semibold">50%</text>
                        <text x="350" y="226" textAnchor="middle" className="text-[10px] font-sans fill-muted-foreground">(检索文档/背景)</text>

                        <text x="650" y="210" textAnchor="middle" className="text-[11px] font-mono fill-foreground font-semibold">100%</text>
                        <text x="650" y="226" textAnchor="middle" className="text-[10px] font-sans fill-muted-foreground">(用户Query)</text>
                      </svg>
                    </div>
                  </div>

                  {/* Prompt Pipeline Structure */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      Prompt 结构示例
                    </h5>
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/50 border border-border/50 rounded-xl">
                      <span className="bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[11px] font-mono px-2.5 py-1 rounded">
                        System Prompt 核心指令
                      </span>
                      <span className="text-neutral-500 text-xs">→</span>
                      <span className="bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[11px] font-mono px-2.5 py-1 rounded">
                        强制约束
                      </span>
                      <span className="text-neutral-500 text-xs">→</span>
                      <span className="text-neutral-500 font-mono text-[11px] px-1">……</span>
                      <span className="text-neutral-500 text-xs">→</span>
                      <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[11px] font-mono px-2.5 py-1 rounded">
                        检索文档 / 背景信息
                      </span>
                      <span className="text-neutral-500 text-xs">→</span>
                      <span className="text-neutral-500 font-mono text-[11px] px-1">……</span>
                      <span className="text-neutral-500 text-xs">→</span>
                      <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[11px] font-mono px-2.5 py-1 rounded">
                        用户 Query
                      </span>
                      <span className="text-neutral-500 text-xs">→</span>
                      <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[11px] font-mono px-2.5 py-1 rounded">
                        输出格式指令
                      </span>
                    </div>
                  </div>

                  {/* Engineering strategies */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      工程对策
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Step 1 */}
                      <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-2 hover:border-purple-500/30 transition-all duration-300">
                        <div className="text-xs font-bold text-purple-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                          头部放置核心指令
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          将最重要的指令 (System Prompt) 与强制约束放置在最头部。
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-2 hover:border-rose-500/30 transition-all duration-300">
                        <div className="text-xs font-bold text-rose-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse"></span>
                          尾部放置当前问题
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          将用户最迫切的问题 (Query) 或输出格式指令放在最尾部。
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-muted/30 border border-border/60 rounded-xl p-4 space-y-2 hover:border-blue-500/30 transition-all duration-300">
                        <div className="text-xs font-bold text-blue-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                          中部做高精度排序
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          检索到的辅助文档/背景信息放在最中部，并对中部文本做高精度排序，弥补该区域注意力权重偏低的劣势。
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Section 3: Dynamic Layering Implementation */}
                <Card className="p-6 space-y-6">
                  <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                    企业级上下文装配守则 (Context Hydration Rules)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm text-foreground">1. 上下文缓存 (Prompt Caching)</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        针对不常变化的背景知识（例如企业 FAQ 知识库或大型 PDF 说明书），必须启用 LLM 服务商提供的 Prompt Caching 机制。这样可以缩减 50%-90% 的首包耗时 (TTFT) 并大幅降低 API 开销。
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm text-foreground">2. 动态滑动窗口 (Sliding Window)</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        对于长时间对话，必须对历史 Message 进行截断与动态摘要。仅保留最近 N 轮的原始对话（滑窗），更早的对话通过子智能体进行异步摘要合并。
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm text-foreground">3. 检索去噪 (Context Pruning)</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        在将向量数据库检索结果拼入上下文前，使用轻量级重排模型 (Cross-Encoder / Cohere Rerank) 剔除相关度评分低于阈值的文档，减少上下文中的“噪声污染”。
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm text-foreground">4. 输入安全性审计 (Input Sanitization)</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        必须清洗用户输入的敏感、破坏性字符。实施黑名单检测与特殊边界符注入（如使用 XML tags 明确隔离用户文本），防止提示词注入攻击 (Prompt Injection)。
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right column: SLA & Production-grade Token Control */}
              <div className="space-y-8">
                {/* SLA Card */}
                <Card className="p-6">
                  <h4 className="text-lg font-bold text-foreground mb-4">上下文 SLA 监控红线</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-xs text-muted-foreground">平均单次对话 Token 限制</span>
                      <span className="text-xs font-mono font-bold text-foreground">&lt; 16,000 Tokens</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-xs text-muted-foreground">历史对话滑动窗口深度</span>
                      <span className="text-xs font-mono font-bold text-foreground">最近 6 轮消息</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-xs text-muted-foreground">Prompt Cache 命中率目标</span>
                      <span className="text-xs font-mono font-bold text-emerald-500">&gt; 80% (常驻会话)</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-xs text-muted-foreground">重排过滤 (Rerank) 耗时上限</span>
                      <span className="text-xs font-mono font-bold text-foreground">&lt; 150ms</span>
                    </div>
                  </div>
                </Card>

                {/* Code Block Card */}
                <Card className="p-6">
                  <h4 className="text-sm font-bold text-foreground mb-3">
                    生产级上下文装配与滑窗代码
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    带滑动窗口和 Token 预算控制的上下文自动装配类 (TypeScript):
                  </p>
                  <div className="rounded-lg bg-slate-950 p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[360px] overflow-y-auto">
                    {`interface ChatMessage {
  role: "user" | "model" | "system";
  text: string;
}

export class ContextAssembler {
  private maxTokensBudget = 8192;
  private slidingWindowLimit = 6;

  // 1. 装配全套上下文
  public assemble(
    systemPrompt: string,
    history: ChatMessage[],
    rerankedDocs: string[],
    currentQuery: string
  ): ChatMessage[] {
    
    // a. 头部: 系统核心约束
    const systemMessage: ChatMessage = {
      role: "system",
      text: systemPrompt
    };

    // b. 中部: 动态文档注入
    const contextDocsText = rerankedDocs
      .slice(0, 3) // 仅取前 3 个最相关的文档，节约 token
      .map((doc, idx) => \`<doc id="\${idx}">\${doc}</doc>\`)
      .join("\\n");
    
    const contextMessage: ChatMessage = {
      role: "system",
      text: \`【参考上下文背景信息】\\n\${contextDocsText}\`
    };

    // c. 历史会话: 滑动窗口过滤 (排除首条 system 消息)
    const activeHistory = history
      .filter(msg => msg.role !== "system")
      .slice(-this.slidingWindowLimit);

    // d. 尾部: 用户当前问题 + 防注入包围
    const queryMessage: ChatMessage = {
      role: "user",
      text: \`【最新问题提示】\\n<user_query>\${this.sanitize(currentQuery)}</user_query>\\n请基于上述参考文档与历史，严谨回答。\`
    };

    // 组合，保证系统最头、当前Query最尾
    return [
      systemMessage,
      contextMessage,
      ...activeHistory,
      queryMessage
    ];
  }

  // 2. 清洗用户输入，防注入
  private sanitize(input: string): string {
    return input
      .replace(/<\\/?script>/gi, "")
      .replace(/<\\/?user_query>/gi, "")
      .trim();
  }
}`}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 长时程上下文工程真演练场（基于 Anthropic《Effective context engineering for AI agents》框架） */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              长时程上下文工程 · 真演练场
            </h2>
            <Badge variant="outline" className="text-xs border-sky-500/30 text-sky-600">
              基于 Anthropic 2025-09 框架
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            以下 4 个真演练场对应 Anthropic《Effective context engineering for AI agents》中「长时程上下文」核心：
            ① Compaction 压缩 ② JIT 检索 / 渐进式披露 ③ 结构化笔记 / Agentic Memory ④ 子智能体隔离。
            与上方「上下文窗口管理」策略互补——前者管「窗口内怎么组织」，此处管「窗口装不下时怎么办」。
          </p>
        </div>

        <CompactionPlayground />
        <JitRetrievalPlayground />
        <AgenticMemoryPlayground />
        <SubAgentIsolationPlayground />
      </main>
    </DemoShell>
  )
}

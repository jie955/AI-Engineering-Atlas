"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Sparkles, Loader2, BarChart3, Layers, AlertCircle } from "lucide-react"
import Link from "next/link"

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="transition-all duration-300 hover:bg-accent hover:translate-x-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
                <Layers className="w-8 h-8 text-primary" />
                上下文工程
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                通过优化信息结构提升 LLM 输出质量的完整指南
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="strategies" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strategies">策略对比</TabsTrigger>
            <TabsTrigger value="dimensions">核心维度</TabsTrigger>
            <TabsTrigger value="examples">实战案例</TabsTrigger>
            <TabsTrigger value="playground">交互演练</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  )
}

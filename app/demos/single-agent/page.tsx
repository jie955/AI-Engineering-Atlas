"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoShell } from "@/components/demo-shell"
import { AtlasTechniqueCarrier } from "@/components/atlas-technique-carrier"
import { PromptChainingPlayground } from "@/components/prompt-chaining-playground"
import { ReactPlayground } from "@/components/react-playground"
import { DemoHero } from "@/components/demo-hero"
import { AgentCompleteFlow } from "@/components/agent-complete-flow"

const agentLoopSteps = [
  {
    step: 1,
    title: "接收任务 (Task Input)",
    icon: "📥",
    color: "emerald",
    description: "用户输入自然语言目标或问题",
    example: '用户: "查询过去 3 年的全球 AI 投资趋势并生成报告"',
  },
  {
    step: 2,
    title: "目标理解 (Goal Parsing)",
    icon: "🧠",
    color: "teal",
    description: "LLM 解析用户意图，明确最终目标和成功标准",
    example: "目标: 获取数据 → 分析趋势 → 生成可视化图表 → 输出 PDF",
  },
  {
    step: 3,
    title: "规划分解 (Planning)",
    icon: "📋",
    color: "cyan",
    description: "使用 Chain-of-Thought 或 Tree-of-Thought 将任务拆解为步骤序列",
    example: "Plan: [步骤1: 调用检索工具] → [步骤2: 数据分析] → [步骤3: 图表生成] → [步骤4: 格式化输出]",
  },
  {
    step: 4,
    title: "工具选择 (Tool Selection)",
    icon: "🔧",
    color: "blue",
    description: "根据当前步骤需求，从工具库中选择合适的工具",
    example: "选择工具: Google Search API, Python 数据分析库 (pandas), 图表生成工具 (matplotlib)",
  },
  {
    step: 5,
    title: "执行操作 (Action Execution)",
    icon: "⚡",
    color: "indigo",
    description: "调用选定的工具，执行具体操作并获取结果",
    example: '执行: requests.get("https://api.example.com/ai-investments") → 返回 JSON 数据',
  },
  {
    step: 6,
    title: "结果观察 (Observation)",
    icon: "👁️",
    color: "purple",
    description: "解析工具返回的结果，将其转化为可理解的信息",
    example: "观察: 获取到 1500 条投资记录，字段包括 {year, region, amount, category}",
  },
  {
    step: 7,
    title: "反思评估 (Reflection)",
    icon: "🤔",
    color: "fuchsia",
    description: "判断当前步骤是否成功，是否需要重试或调整策略",
    example: "评估: 数据完整性 85%，缺少部分地区数据 → 决定继续下一步或补充检索",
  },
  {
    step: 8,
    title: "循环决策 (Loop Decision)",
    icon: "🔄",
    color: "rose",
    description: "判断目标是否达成。若未完成，返回步骤 3 继续规划；若完成，进入最终输出",
    example: "决策: 目标未完成 → 返回 Planning 步骤；目标完成 → 进入 Final Output",
  },
  {
    step: 9,
    title: "最终输出 (Final Output)",
    icon: "📤",
    color: "orange",
    description: "整合所有步骤的结果，生成用户需要的最终交付物",
    example: "输出: 生成 PDF 报告，包含数据表格、趋势图表和分析结论",
  },
]

const toolCategories = [
  {
    category: "检索工具",
    icon: "🔍",
    tools: [
      { name: "RAG 知识库", desc: "向量检索企业内部文档" },
      { name: "Google Search", desc: "实时网络搜索" },
      { name: "Database Query", desc: "SQL 数据库查询" },
    ],
  },
  {
    category: "代码执行",
    icon: "💻",
    tools: [
      { name: "Python Kernel", desc: "执行数据分析和计算" },
      { name: "Shell Commands", desc: "系统级命令执行" },
      { name: "JavaScript Runtime", desc: "前端逻辑执行" },
    ],
  },
  {
    category: "API 集成",
    icon: "🔗",
    tools: [
      { name: "REST API Client", desc: "调用第三方 API" },
      { name: "Email Service", desc: "发送通知和报告" },
      { name: "Cloud Storage", desc: "文件上传下载" },
    ],
  },
]

const memoryTypes = [
  {
    type: "短期记忆 (Short-term)",
    icon: "⚡",
    description: "存储在当前会话的上下文窗口中，用于维持对话连贯性",
    implementation: "LLM Context Window (8k-128k tokens)",
    example: "用户刚才提到的需求、上一步执行的结果",
  },
  {
    type: "长期记忆 (Long-term)",
    icon: "💾",
    description: "持久化存储的知识和经验，可跨会话检索",
    implementation: "Vector Database (Pinecone, Weaviate) + RAG",
    example: "历史对话记录、用户偏好、领域知识库",
  },
  {
    type: "结构化记忆 (Structured)",
    icon: "🗂️",
    description: "以表格或键值对形式存储的精确信息",
    implementation: "SQL Database / Key-Value Store (Redis)",
    example: "用户资料、任务状态、配置参数",
  },
]

export default function SingleAgentPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const simulateFlow = () => {
    setIsRunning(true)
    setActiveStep(0)
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= agentLoopSteps.length - 1) {
          clearInterval(interval)
          setIsRunning(false)
          return prev
        }
        return prev + 1
      })
    }, 1500)
  }

  return (
    <DemoShell demoId="single-agent">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DemoHero
          demoId="single-agent"
          title="Single Agent: 单一智能体架构"
          description="基于 LLM 的自主决策循环 - 规划、执行、反思"
        />

        <Tabs defaultValue="architecture" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-muted/40 p-1 rounded-xl border border-border/50 h-12">
            <TabsTrigger value="architecture" className="text-sm">🏗️ 核心架构</TabsTrigger>
            <TabsTrigger value="loop" className="text-sm">🔄 决策循环</TabsTrigger>
            <TabsTrigger value="flow" className="text-sm">🎬 完整流程</TabsTrigger>
            <TabsTrigger value="tools" className="text-sm">🔧 工具库</TabsTrigger>
            <TabsTrigger value="memory" className="text-sm">🧠 记忆系统</TabsTrigger>
          </TabsList>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
              <h2 className="text-2xl font-bold text-foreground mb-4">什么是单一智能体？</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                单一智能体 (Single Agent) 是基于大语言模型 (LLM)
                的自主控制循环，能够理解任务目标、制定执行计划、调用外部工具，并通过反思机制不断优化决策，最终完成复杂的多步骤任务。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-primary/30">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">目标导向</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    接收用户的高层次目标，自主分解为可执行的子任务序列
                  </p>
                </Card>

                <Card className="p-6 border-2 border-primary/30">
                  <div className="text-3xl mb-3">🛠️</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">工具调用</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    能够选择和执行外部工具 (API、数据库、代码环境) 完成超出 LLM 本身的操作
                  </p>
                </Card>

                <Card className="p-6 border-2 border-primary/30">
                  <div className="text-3xl mb-3">🔄</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">自主循环</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    通过反思和评估机制，持续优化执行策略直到目标达成
                  </p>
                </Card>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">核心能力对比</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-bold text-foreground">能力维度</th>
                      <th className="text-left p-4 font-bold text-foreground">传统 RAG</th>
                      <th className="text-left p-4 font-bold text-foreground bg-primary/5">单一智能体</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="p-4 font-medium">任务类型</td>
                      <td className="p-4 text-muted-foreground">单次问答</td>
                      <td className="p-4 bg-primary/5">多步骤复杂任务</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-4 font-medium">决策能力</td>
                      <td className="p-4 text-muted-foreground">被动检索</td>
                      <td className="p-4 bg-primary/5">主动规划与调整</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-4 font-medium">工具使用</td>
                      <td className="p-4 text-muted-foreground">仅向量数据库</td>
                      <td className="p-4 bg-primary/5">多种工具 (API, 代码, 数据库)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">反思机制</td>
                      <td className="p-4 text-muted-foreground">无</td>
                      <td className="p-4 bg-primary/5">自我评估与纠错</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Loop Tab */}
          <TabsContent value="loop" className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Agent 决策循环演示</h2>
                  <p className="text-muted-foreground">观察智能体如何通过 9 个步骤完成复杂任务</p>
                </div>
                <Button onClick={simulateFlow} disabled={isRunning} size="lg" className="gap-2">
                  <PlayCircle className="w-5 h-5" />
                  {isRunning ? "执行中..." : "开始演示"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {agentLoopSteps.map((step, index) => (
                  <Card
                    key={index}
                    className={`p-4 transition-all duration-500 ${
                      activeStep === index
                        ? "bg-primary/10 border-primary ring-2 ring-primary scale-105"
                        : activeStep > index
                          ? "bg-muted/50 border-muted"
                          : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{step.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            步骤 {step.step}
                          </Badge>
                          {activeStep > index && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        </div>
                        <h4 className="text-sm font-bold text-foreground mb-1">{step.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 border-2 border-primary/30 bg-muted/30">
                <h3 className="text-lg font-bold text-foreground mb-4">当前步骤详情</h3>
                <div className="space-y-4">
                  <div>
                    <Badge className="mb-2">步骤 {agentLoopSteps[activeStep].step}</Badge>
                    <h4 className="text-xl font-bold text-foreground mb-2">{agentLoopSteps[activeStep].title}</h4>
                    <p className="text-muted-foreground mb-4">{agentLoopSteps[activeStep].description}</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border-l-4 border-primary">
                    <p className="text-sm font-mono text-foreground">{agentLoopSteps[activeStep].example}</p>
                  </div>
                </div>
              </Card>
            </Card>
          </TabsContent>

          {/* Complete Flow Tab */}
          <TabsContent value="flow" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Agent 完整工作流程演示</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                选择真实业务场景，逐步观察智能体从 观察 → 推理 → 行动 → 综合 → 完成 的完整决策过程。
                每一步都包含工具选择、API 调用、Token 成本分解与风险评估，帮助你理解 Agent 在生产环境中的真实运行成本与决策权衡。
              </p>
              <AgentCompleteFlow />
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Agent 工具库</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                工具 (Tools) 是 Agent 完成实际操作的"手和脚"。通过调用不同类型的工具，Agent
                能够执行检索、计算、通信等超出 LLM 本身能力的任务。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {toolCategories.map((category, index) => (
                  <Card key={index} className="p-6 border-t-4 border-primary">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{category.icon}</div>
                      <h3 className="text-xl font-bold text-foreground">{category.category}</h3>
                    </div>
                    <ul className="space-y-3">
                      {category.tools.map((tool, toolIndex) => (
                        <li key={toolIndex} className="p-3 bg-muted rounded-lg">
                          <p className="font-semibold text-foreground mb-1">{tool.name}</p>
                          <p className="text-xs text-muted-foreground">{tool.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Memory Tab */}
          <TabsContent value="memory" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Agent 记忆系统</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                记忆 (Memory) 使 Agent 能够保持上下文连贯性、学习历史经验，并在多次交互中逐步优化决策。
              </p>

              <div className="space-y-6">
                {memoryTypes.map((memory, index) => (
                  <Card key={index} className="p-6 border-l-4 border-primary">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{memory.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{memory.type}</h3>
                        <p className="text-muted-foreground mb-3 leading-relaxed">{memory.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs font-semibold text-foreground mb-1">技术实现</p>
                            <p className="text-sm font-mono text-primary">{memory.implementation}</p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs font-semibold text-foreground mb-1">应用示例</p>
                            <p className="text-sm text-muted-foreground">{memory.example}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 关联《提示工程技术全景》地图 + 扩展技术承载：#6 #14 均已配真演练场 */}
        <AtlasTechniqueCarrier
          tone="strong"
          intro="本节点承载《提示工程技术全景》中 #6 Prompt Chaining（已配真演练场，见下方：真实链式管线抽取→归类→格式化）与 #14 ReAct（已配真演练场，见下方：真实 Think-Act-Observe 循环）。"
          techniques={[
            {
              n: "6",
              name: "Prompt Chaining (提示链)",
              desc: "把复杂任务拆成有序的多个子提示，上一步输出作为下一步输入，像流水线一样串联——适合可分解、步骤依赖明确的任务。",
              example:
                "① 抽取关键实体 → ② 基于实体检索 → ③ 据检索结果生成摘要\n每一步 prompt 独立、可观测、可回退",
              pros: ["步骤可控、易调试", "单步失败易定位"],
              cons: ["链路长则延迟累积", "需设计步骤边界与容错"],
              strong: true,
            },
            {
              n: "14",
              name: "ReAct (推理 + 行动)",
              desc: "交替进行推理（Thought）与行动（Action / 工具调用），用观测（Observation）闭环驱动决策——把『想』和『做』交织进同一循环。",
              example:
                "Thought: 需查今日股价\nAction: search('AAPL price')\nObservation: $229.8\nThought: 据此作答…",
              pros: ["可调用外部工具补齐知识", "过程可解释、可干预"],
              cons: ["循环可能跑偏 / 无限", "需工具可靠性与终止条件"],
              strong: true,
            },
          ]}
        />

        {/* #6 Prompt Chaining 真演练场（强覆盖）：真实链式管线，逐步执行 */}
        <PromptChainingPlayground />

        {/* #14 ReAct 真演练场（强覆盖）：真实 Think-Act-Observe 循环，逐步执行 */}
        <ReactPlayground />

      </main>
    </DemoShell>
  )
}

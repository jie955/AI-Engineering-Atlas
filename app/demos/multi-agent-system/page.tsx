"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const agentFlowData = [
  {
    role: "任务主管 (Planner)",
    icon: "👑",
    color: "emerald",
    description: "接收用户复杂需求，将目标分解为子任务，并分配给专业的 Agent。",
    action: '动作: 将"撰写报告"分解为"市场研究"、"内容草稿"、"编辑校对"三部分。',
  },
  {
    role: "市场研究员 (Researcher)",
    icon: "🔎",
    color: "teal",
    description: "负责信息检索和知识收集。利用 RAG 和外部 Search Tool 收集最新数据和行业见解。",
    action: "动作: 调用 RAG 检索内部文档；使用 Google Search Tool 抓取外部新闻和报告。",
  },
  {
    role: "内容创作者 (Writer)",
    icon: "✍️",
    color: "cyan",
    description: "基于研究员提供的证据和结构，撰写报告的各个章节。侧重于文字流畅性和逻辑性。",
    action: "动作: 将检索结果总结和整合，撰写初稿。使用 LLM 进行格式化。",
  },
  {
    role: "编辑校对员 (Editor)",
    icon: "📝",
    color: "blue",
    description: "检查创作者的草稿，进行事实核查、语法修正和风格统一。确保报告质量达到标准。",
    action: "动作: 检查报告中引用的数据是否准确 (与研究员证据比对)；修正错别字和不流畅的语句。",
  },
  {
    role: "报告交付者 (Deliverer)",
    icon: "📦",
    color: "indigo",
    description: "将最终定稿的内容格式化为用户需要的输出形式（如 PDF, Markdown），并完成交付。",
    action: "动作: 整合最终章节，生成带有图表和页眉页脚的 PDF 文件，发送给用户。",
  },
]

const collaborationPatterns = [
  {
    pattern: "顺序协作 (Sequential)",
    icon: "➡️",
    description: "Agent 按照预定顺序依次执行任务，前一个 Agent 的输出作为后一个的输入",
    example: "Planner → Researcher → Writer → Editor → Deliverer",
    useCase: "报告撰写、内容生成流水线",
  },
  {
    pattern: "并行协作 (Parallel)",
    icon: "⚡",
    description: "多个 Agent 同时执行不同的子任务，最后由协调者整合结果",
    example: "Researcher A (市场数据) + Researcher B (竞品分析) + Researcher C (用户反馈) → Synthesizer",
    useCase: "大规模信息收集、多维度分析",
  },
  {
    pattern: "辩论协作 (Debate)",
    icon: "💬",
    description: "多个 Agent 持不同观点，通过辩论和投票达成共识",
    example: "Agent A (乐观) vs Agent B (保守) vs Agent C (中立) → 投票决策",
    useCase: "风险评估、战略决策",
  },
]

const communicationMechanisms = [
  {
    mechanism: "消息队列 (Message Queue)",
    icon: "📬",
    description: "Agent 通过消息队列异步通信，支持解耦和容错",
    tech: "RabbitMQ, Kafka, Redis Streams",
  },
  {
    mechanism: "共享记忆 (Shared Memory)",
    icon: "🧠",
    description: "所有 Agent 访问同一个知识库或数据库，实现信息共享",
    tech: "Vector DB (Pinecone), SQL Database",
  },
  {
    mechanism: "直接调用 (Direct Invocation)",
    icon: "📞",
    description: "Agent 直接调用其他 Agent 的 API 接口，同步通信",
    tech: "REST API, gRPC, Function Call",
  },
]

export default function MultiAgentSystemPage() {
  const [activeAgent, setActiveAgent] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-3 -ml-3">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <span className="text-4xl">🌐</span>
            <span className="text-balance">Multi-Agent System: 多智能体协作系统</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">复杂任务分解与角色专业化 - 协作大于单打独斗</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">💡 系统概览</TabsTrigger>
            <TabsTrigger value="flow">🚀 协作流程</TabsTrigger>
            <TabsTrigger value="patterns">🔀 协作模式</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
              <h2 className="text-2xl font-bold text-foreground mb-4">什么是多智能体系统？</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                多智能体系统 (Multi-Agent System) 由多个具有不同专业能力的 Agent
                组成，通过协作、沟通和任务分工，共同完成单一 Agent 难以胜任的复杂目标。每个 Agent
                扮演特定角色，专注于自己擅长的领域。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-primary/30">
                  <div className="text-3xl mb-3">🎭</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">角色专业化</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    每个 Agent 负责特定领域 (研究、写作、校对)，提升任务执行效率和质量
                  </p>
                </Card>

                <Card className="p-6 border-2 border-primary/30">
                  <div className="text-3xl mb-3">🤝</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">协作通信</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Agent 之间通过消息传递、共享记忆等机制交换信息和协调任务
                  </p>
                </Card>

                <Card className="p-6 border-2 border-primary/30">
                  <div className="text-3xl mb-3">⚖️</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">质量保证</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    多个 Agent 交叉验证和审查，降低错误率，提升输出可靠性
                  </p>
                </Card>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">核心优势</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">1</Badge>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">任务分解能力</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        将复杂目标拆解为多个可管理的子任务，每个 Agent 专注于自己的部分
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">2</Badge>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">并行处理效率</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        多个 Agent 可以同时工作，显著缩短整体执行时间
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">3</Badge>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">知识交叉验证</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        不同 Agent 从各自角度审查结果，减少幻觉和错误
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">4</Badge>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">动态适应性</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        可根据任务需求灵活添加或移除 Agent，适应不同场景
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Flow Tab */}
          <TabsContent value="flow" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">协作流程演示：报告撰写任务</h2>
              <p className="text-muted-foreground mb-6">点击任意 Agent 查看其在协作流程中的具体职责和执行动作</p>

              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  {agentFlowData.map((agent, index) => (
                    <div key={index} className="relative">
                      <Card
                        className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary ${
                          activeAgent === index
                            ? "bg-primary/10 border-primary ring-2 ring-primary"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setActiveAgent(index)}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">{agent.icon}</div>
                          <h4 className="text-sm font-bold text-foreground mb-1">{agent.role.split("(")[0].trim()}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {agent.role.match(/$$(.*)$$/)?.[1]}
                          </Badge>
                        </div>
                      </Card>
                      {index < agentFlowData.length - 1 && (
                        <div className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-6 border-2 border-primary/30">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  {agentFlowData[activeAgent].icon} {agentFlowData[activeAgent].role} - 职责与执行
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-foreground mb-2">核心职责:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed ml-4">
                      {agentFlowData[activeAgent].description}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">模拟执行动作:</p>
                    <div className="p-4 bg-muted rounded-lg text-sm ml-4 border-l-4 border-primary">
                      {agentFlowData[activeAgent].action}
                    </div>
                  </div>
                </div>
              </Card>
            </Card>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">协作模式</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                根据任务特性选择不同的协作模式，可以显著提升系统效率和输出质量
              </p>

              <div className="space-y-6">
                {collaborationPatterns.map((pattern, index) => (
                  <Card key={index} className="p-6 border-l-4 border-primary">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{pattern.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{pattern.pattern}</h3>
                        <p className="text-muted-foreground mb-3 leading-relaxed">{pattern.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs font-semibold text-foreground mb-1">流程示例</p>
                            <p className="text-sm font-mono text-primary">{pattern.example}</p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs font-semibold text-foreground mb-1">适用场景</p>
                            <p className="text-sm text-muted-foreground">{pattern.useCase}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">通信机制</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Agent 之间需要有效的通信机制来交换信息、传递结果和协调任务
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {communicationMechanisms.map((comm, index) => (
                  <Card key={index} className="p-6 border-t-4 border-primary">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{comm.icon}</div>
                      <h3 className="text-lg font-bold text-foreground">{comm.mechanism}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{comm.description}</p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs font-semibold text-foreground mb-1">技术实现</p>
                      <p className="text-sm font-mono text-primary">{comm.tech}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Settings, Shield, Layers, GitBranch, CheckCircle, AlertTriangle, Zap, RefreshCw, Users, FileCode, Terminal, Eye } from "lucide-react"
import { DemoShell } from "@/components/demo-shell"

// Harness 核心公式
const coreFormula = {
  title: "Agent = Model + Harness",
  description: "模型提供智能，Harness 让智能变得可用。更好的 Harness 往往比更好的模型更重要。",
  metaphor: "LLM 是一匹强大的马，巨大的原始能力，但没有方向感。Harness 是缰绳、马鞍和马具，将这种力量引导成可控的、有用的工作。"
}

// 6 大核心组件
const harnessComponents = [
  {
    id: "context",
    title: "上下文工程",
    subtitle: "Context Engineering",
    icon: Layers,
    description: "决定模型在每个执行步骤看到什么信息",
    details: [
      "系统提示词管理",
      "检索文档整合",
      "对话历史管理",
      "工具结果处理",
      "环境状态注入",
    ],
    example: "CLAUDE.md / AGENTS.md 文件",
    tip: "保持上下文文件在 60 行以内，给 Agent 一张地图，而不是 1000 页手册",
  },
  {
    id: "tools",
    title: "工具编排",
    subtitle: "Tool Orchestration",
    icon: Settings,
    description: "管理模型可用的工具及其执行方式",
    details: [
      "工具选择与过滤",
      "参数验证",
      "执行沙箱隔离",
      "超时管理",
      "错误处理",
    ],
    example: "Vercel 移除 80% 工具后效果更好",
    tip: "按任务阶段动态限制工具集，规划阶段不需要文件写入权限",
  },
  {
    id: "state",
    title: "状态与记忆",
    subtitle: "State & Memory",
    icon: GitBranch,
    description: "管理跨会话的持久状态和检查点",
    details: [
      "检查点存储",
      "崩溃恢复",
      "会话记忆",
      "进度文件 (claude-progress.txt)",
      "Git 历史集成",
    ],
    example: "Anthropic 的双 Agent 架构",
    tip: "像医院交接班一样处理 Agent 会话切换：结构化交接、明确状态、清晰下一步",
  },
  {
    id: "verification",
    title: "验证与安全",
    subtitle: "Verification & Safety",
    icon: Shield,
    description: "在输出到达真实世界前进行检查",
    details: [
      "输出模式验证",
      "预期结果校验",
      "代码测试运行",
      "失败重试机制",
      "升级处理",
    ],
    example: "团队从 83% 提升到 96% 任务完成率",
    tip: "验证循环是投入产出比最高的 Harness 组件",
  },
  {
    id: "hitl",
    title: "人机协作",
    subtitle: "Human-in-the-Loop",
    icon: Users,
    description: "为高风险操作设置审批门控",
    details: [
      "删除数据审批",
      "外部通信确认",
      "财务交易授权",
      "基础设施修改",
      "等待超时处理",
    ],
    example: "Stripe 的必要人工代码审查",
    tip: "开始时设置激进的审批要求，随着信心建立逐步放宽",
  },
  {
    id: "lifecycle",
    title: "生命周期管理",
    subtitle: "Lifecycle Management",
    icon: RefreshCw,
    description: "管理 Agent 启动、监控、关闭和恢复",
    details: [
      "健康检查",
      "资源限制",
      "优雅关闭",
      "崩溃恢复",
      "进度报告",
    ],
    example: "最大 Token 限制、最大运行时间",
    tip: "没有生命周期管理的 Agent 会成为昂贵的、无监控的静默失败进程",
  },
]

// 常见失败模式
const failureModes = [
  {
    name: "上下文腐烂",
    nameEn: "Context Rot",
    icon: AlertTriangle,
    description: "长时间运行的任务中，上下文积累噪音，模型无法识别当前重要信息",
    symptoms: ["重复解决已解决的问题", "与自己早期决策矛盾", "丢失原始任务目标"],
    solution: "主动上下文管理：摘要、修剪、进度文件模式",
  },
  {
    name: "工具爆炸",
    nameEn: "Tool Explosion",
    icon: Settings,
    description: "一次给模型太多工具，导致选择错误和调用格式错误",
    symptoms: ["花费 Token 推理工具选择", "频繁选错工具", "生成格式错误的调用"],
    solution: "动态工具范围限定，按任务阶段暴露相关工具",
  },
  {
    name: "静默失败",
    nameEn: "Silent Failures",
    icon: Eye,
    description: "工具调用失败但 Agent 继续执行，下游基于缺失数据产生看似合理但错误的输出",
    symptoms: ["输出看起来正确但实际错误", "没有明显的错误信息", "依赖缺失数据"],
    solution: "每次工具调用后进行结构化输出验证",
  },
  {
    name: "无限循环",
    nameEn: "Infinite Loops",
    icon: RefreshCw,
    description: "Agent 遇到错误，重试，遇到相同错误，无限重试",
    symptoms: ["API 调用费用飙升", "任务永不完成", "相同操作重复执行"],
    solution: "强制最大重试次数、指数退避、循环检测",
  },
]

// 实战案例
const caseStudies = [
  {
    company: "OpenAI Codex",
    highlight: "3 名工程师 5 个月产出 100 万行代码",
    metrics: "平均每人每天 3.5 个合并 PR",
    approach: [
      "零手写代码，全部 Agent 生成",
      "机器可读架构约束文档",
      "每次代码生成后运行预提交钩子",
      "闭环验证：失败原因反馈给模型重试",
    ],
    insight: "工程师停止写代码，开始设计 Harness",
  },
  {
    company: "Stripe Minions",
    highlight: "每周 1000+ 合并 PR",
    metrics: "AI Agent 驱动的内部系统",
    approach: [
      "严格限定任务范围",
      "强制人工代码审查",
      "自动化回归测试",
      "回滚自动化",
    ],
    insight: "Harness 成为企业级可靠性的关键",
  },
  {
    company: "Anthropic",
    highlight: "长时间运行 Agent 的有效 Harness",
    metrics: "双 Agent 架构",
    approach: [
      "初始化 Agent 规划工作，创建特性列表",
      "编码 Agent 隔离执行每个特性",
      "结构化特性列表作为交接格式",
      "Git 进度跟踪支持中断恢复",
    ],
    insight: "像医院交接班一样处理 Agent 会话",
  },
]

// 构建步骤
const buildSteps = [
  {
    phase: 1,
    title: "添加验证循环",
    description: "在任何不可逆操作前添加验证步骤",
    actions: ["代码生成后运行测试", "API 调用后检查响应模式", "第二个模型评估主模型输出"],
    impact: "最高可靠性提升/工程小时",
  },
  {
    phase: 2,
    title: "添加状态持久化",
    description: "让 Agent 工作可持久化",
    actions: ["每个成功步骤后序列化状态", "崩溃后从检查点恢复", "避免重新执行整个任务"],
    impact: "失败时 Token 成本降低 30-50%",
  },
  {
    phase: 3,
    title: "添加可观测性",
    description: "了解 Agent 在做什么",
    actions: ["为每个工具调用添加执行跟踪", "跟踪 Token 使用和成本", "构建任务完成率仪表板"],
    impact: "通过监控而非客户投诉发现问题",
  },
  {
    phase: 4,
    title: "添加人机协作",
    description: "识别高风险操作并添加审批门控",
    actions: ["破坏性操作需要审批", "外部通信需要确认", "随信心建立放宽限制"],
    impact: "生产安全网",
  },
]

export default function HarnessEngineeringPage() {
  const [activeComponent, setActiveComponent] = useState(0)
  const [activeFailure, setActiveFailure] = useState(0)

  return (
    <DemoShell demoId="harness-engineering">
      <div className="space-y-8">
        {/* Core Formula */}
        <Card className="border-2 border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <Badge variant="destructive" className="mb-3">
              2026 热门
            </Badge>
            <div className="text-3xl font-bold text-primary mb-3">{coreFormula.title}</div>
            <p className="text-sm text-muted-foreground mb-4">{coreFormula.description}</p>
            <div className="text-xs italic text-muted-foreground border-t border-hairline pt-4">
              {coreFormula.metaphor}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="components" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">6 大组件</TabsTrigger>
            <TabsTrigger value="failures">失败模式</TabsTrigger>
            <TabsTrigger value="cases">实战案例</TabsTrigger>
            <TabsTrigger value="build">构建指南</TabsTrigger>
          </TabsList>

          {/* 6 大组件 */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {harnessComponents.map((comp, idx) => {
                const Icon = comp.icon
                return (
                  <Card
                    key={comp.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      activeComponent === idx ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActiveComponent(idx)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{comp.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">{comp.subtitle}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{comp.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Detail Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = harnessComponents[activeComponent].icon
                    return <Icon className="w-6 h-6 text-primary" />
                  })()}
                  <div>
                    <CardTitle>{harnessComponents[activeComponent].title}</CardTitle>
                    <CardDescription>{harnessComponents[activeComponent].subtitle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">核心职责</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {harnessComponents[activeComponent].details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">实践示例</div>
                    <div className="text-sm">{harnessComponents[activeComponent].example}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs font-semibold text-primary mb-1">最佳实践</div>
                    <div className="text-sm">{harnessComponents[activeComponent].tip}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 失败模式 */}
          <TabsContent value="failures" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {failureModes.map((failure, idx) => {
                const Icon = failure.icon
                return (
                  <Card
                    key={idx}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      activeFailure === idx ? "ring-2 ring-destructive" : ""
                    }`}
                    onClick={() => setActiveFailure(idx)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-destructive/10">
                          <Icon className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{failure.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{failure.nameEn}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{failure.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Failure Detail */}
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">{failureModes[activeFailure].name}</CardTitle>
                <CardDescription>{failureModes[activeFailure].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">症状</h4>
                  <ul className="space-y-1">
                    {failureModes[activeFailure].symptoms.map((symptom, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-2">
                    <CheckCircle className="w-4 h-4" />
                    解决方案
                  </div>
                  <p className="text-sm">{failureModes[activeFailure].solution}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 实战案例 */}
          <TabsContent value="cases" className="space-y-6">
            {caseStudies.map((study, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{study.company}</CardTitle>
                      <CardDescription className="text-primary font-semibold">{study.highlight}</CardDescription>
                    </div>
                    <Badge variant="secondary">{study.metrics}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Harness 实践</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {study.approach.map((item, aidx) => (
                        <div key={aidx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs font-semibold text-primary mb-1">核心洞察</div>
                    <p className="text-sm italic">"{study.insight}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* 构建指南 */}
          <TabsContent value="build" className="space-y-6">
            <Card className="bg-amber-500/5 border-amber-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-600 dark:text-amber-400">重要提醒</div>
                    <p className="text-sm text-muted-foreground">
                      构建生产级 Harness 需要数月而非数周。Manus 花了 6 个月和 5 次重写，LangChain 为 LangGraph 迭代了 4 个架构超过一年。从最小可行 Harness 开始，观察 Agent 实际失败模式，针对性增加基础设施。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {buildSteps.map((step) => (
                <Card key={step.phase}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {step.phase}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">具体行动</h4>
                        <ul className="space-y-1">
                          {step.actions.map((action, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <Zap className="w-3 h-3 text-primary shrink-0" />
                              <span className="text-muted-foreground">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-sm font-medium">{step.impact}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Key Insight */}
        <Card className="bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
          <CardHeader>
            <CardTitle>2026 年的竞争优势</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong>模型选择仍然重要</strong>，但可用模型之间的差距正在缩小，而团队之间 Harness 质量的差距正在扩大
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong>相同模型，40 分差异</strong>：两个使用相同 Claude 或 GPT 模型的团队，任务完成率可能相差 60% vs 98%，完全取决于 Harness 质量
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong>投资 Harness 而非模型</strong>：2026 年领先的 AI 产品组织不是那些有独家模型访问权的，而是拥有最成熟 Harness 工程实践的
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DemoShell>
  )
}

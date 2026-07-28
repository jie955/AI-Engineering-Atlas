"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Repeat,
  Clock,
  GitBranch,
  FileCode,
  Plug,
  Users,
  Database,
  CheckCircle,
  AlertTriangle,
  Play,
  Search,
  Wrench,
  ClipboardCheck,
  Save,
} from "lucide-react"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"

// 核心理念
const coreIdea = {
  title: "你不再 prompt Agent，而是设计 prompt Agent 的循环",
  description:
    "Loop Engineering（循环工程）是把「向 Agent 发指令的那个人」替换成一个你设计的系统。你定义一个递归目标，AI 自动迭代直到完成。",
  quote: {
    text: "我不再 prompt Claude 了。我运行循环去 prompt Claude 并决定下一步做什么。我的工作是写循环。",
    author: "Boris Cherny，Anthropic Claude Code 负责人",
  },
  layer: "Loop Engineering 位于 Harness Engineering 之上：Harness 是单个 Agent 运行的环境，而 Loop 让这个环境定时运行、自我派发任务、自我喂养。",
}

// 5 + 1 核心组件
const loopPieces = [
  {
    id: "automations",
    title: "自动化",
    subtitle: "Automations · 循环的心跳",
    icon: Clock,
    description: "按计划自动触发，独立完成发现与分流",
    details: [
      "定时运行（cron / 间隔）",
      "自动发现待办工作",
      "结果进入 Triage 收件箱",
      "空结果自动归档",
      "/loop 按节奏重跑，/goal 跑到条件满足",
    ],
    example: "OpenAI 内部用于每日 issue 分流、CI 失败摘要、提交简报、bug 猎捕",
    tip: "自动化让循环成为真正的「循环」，而不是只跑一次的任务。让 automation 调用 skill 而非粘贴大段指令",
  },
  {
    id: "worktrees",
    title: "工作树隔离",
    subtitle: "Worktrees · 并行不打架",
    icon: GitBranch,
    description: "让并行运行的多个 Agent 不会互相踩踏文件",
    details: [
      "每个分支独立的工作目录",
      "共享同一仓库历史",
      "一个 Agent 的编辑无法触碰另一个",
      "--worktree 标志开启隔离会话",
      "子 Agent 用完自动清理",
    ],
    example: "Codex 内建每线程 worktree；Claude Code 用 git worktree + isolation: worktree",
    tip: "worktree 消除了机械碰撞，但你的 review 带宽仍是并行数量的真正上限",
  },
  {
    id: "skills",
    title: "技能",
    subtitle: "Skills · 沉淀项目知识",
    icon: FileCode,
    description: "把 Agent 否则只能靠猜的项目知识写下来",
    details: [
      "SKILL.md 文件（指令 + 元数据）",
      "$name 显式调用或按描述隐式触发",
      "沉淀约定、构建步骤、历史教训",
      "让 intent（意图）只需表达一次",
      "跨 session 复利式累积",
    ],
    example: "没有 skill，循环每一轮都从零重新推导整个项目；有了 skill，知识会复利",
    tip: "一个精确朴素的描述胜过一个花哨的描述，因为它决定了 skill 何时被自动触发",
  },
  {
    id: "connectors",
    title: "插件与连接器",
    subtitle: "Plugins & Connectors · 触达真实工具",
    icon: Plug,
    description: "把 Agent 接入你已经在用的工具",
    details: [
      "基于 MCP 构建",
      "读取 issue 追踪器、查询数据库",
      "调用 staging API、发 Slack 消息",
      "plugin 打包 connector + skill 一键分发",
      "一个工具的 connector 通常两个产品都能用",
    ],
    example: "从「这是修复方案」到「自动开 PR、关联 Linear 工单、CI 绿了后通知频道」",
    tip: "连接器是循环能在真实环境中「行动」而非只「建议」的关键",
  },
  {
    id: "subagents",
    title: "子 Agent",
    subtitle: "Sub-agents · 造者与验者分离",
    icon: Users,
    description: "让「写代码的」和「检查代码的」是不同的 Agent",
    details: [
      "写代码的模型太容易给自己打高分",
      "验证者用不同指令、有时不同模型",
      "一个探索、一个实现、一个对照 spec 验证",
      "定义在 .codex/agents/ 或 .claude/agents/",
      "安全审查员可用强模型高推理档",
    ],
    example: "/goal 底层就是这个：一个新模型判断循环是否完成，而不是干活的那个",
    tip: "循环在你不看时运行，一个你真正信任的验证者是你敢走开的唯一理由",
  },
  {
    id: "memory",
    title: "状态与记忆",
    subtitle: "State & Memory · 循环的脊柱",
    icon: Database,
    description: "存在于单次对话之外，记录「做了什么、下一步是什么」",
    details: [
      "Markdown 文件 / Linear 看板",
      "模型在两次运行间会遗忘一切",
      "记忆必须落在磁盘，而非上下文里",
      "记录尝试过什么、通过了什么、还剩什么",
      "明天的运行从今天停下的地方接续",
    ],
    example: "AGENTS.md、progress 文件，或通过 MCP 连接的 Linear 看板",
    tip: "Agent 会遗忘，但仓库不会。记忆是所有长时运行 Agent 依赖的同一个把戏",
  },
]

// 单个循环的运转流程
const loopFlow = [
  {
    step: 1,
    title: "自动化触发",
    icon: Play,
    description: "每天早晨定时在仓库上运行，调用 triage skill",
    detail: "读取昨天的 CI 失败、开放的 issue、最近的提交",
  },
  {
    step: 2,
    title: "发现与分流",
    icon: Search,
    description: "把发现写入 markdown 文件或 Linear 看板",
    detail: "对每个值得做的发现，决定是否派发",
  },
  {
    step: 3,
    title: "隔离执行",
    icon: GitBranch,
    description: "为每个任务开启独立 worktree",
    detail: "派一个子 Agent 起草修复，互不干扰",
  },
  {
    step: 4,
    title: "对照验证",
    icon: ClipboardCheck,
    description: "第二个子 Agent 对照项目 skill 和现有测试审查草稿",
    detail: "造者与验者分离，保证「完成」有意义",
  },
  {
    step: 5,
    title: "连接器行动",
    icon: Plug,
    description: "开 PR、更新工单，无法处理的进 triage 收件箱",
    detail: "循环在你的真实环境中行动",
  },
  {
    step: 6,
    title: "写回记忆",
    icon: Save,
    description: "状态文件记录尝试了什么、通过了什么、还剩什么",
    detail: "明早的运行从今天停下的地方接续 → 回到第 1 步",
  },
]

// 循环仍不能替你做的事（风险）
const caveats = [
  {
    name: "验证依然是你的责任",
    nameEn: "Verification is on you",
    icon: ClipboardCheck,
    description: "无人值守运行的循环，也是在无人值守地犯错。「完成」是一个声明，不是一个证明。",
    solution: "分离验证者子 Agent 让「它说完成了」有意义，但你的工作仍是交付你确认能跑的代码",
  },
  {
    name: "理解力会悄悄腐烂",
    nameEn: "Comprehension debt",
    icon: AlertTriangle,
    description: "循环交付你没写的代码越快，「存在的」与「你真正理解的」之间的鸿沟就越大。",
    solution: "读循环产出的东西。顺滑的循环只会让理解债增长得更快",
  },
  {
    name: "舒适的姿势最危险",
    nameEn: "Cognitive surrender",
    icon: Repeat,
    description: "循环自己跑起来时，很诱人停止拥有观点，直接收下它给的一切，这是认知投降。",
    solution: "带判断力去设计循环是解药；为逃避思考去设计循环是加速器。同样的动作，相反的结果",
  },
]

export default function LoopEngineeringPage() {
  const [activePiece, setActivePiece] = useState(0)

  return (
    <DemoShell demoId="loop-engineering">
      <div className="space-y-8">
        <DemoHero demoId="loop-engineering" />

        {/* Core Idea Card */}
        <Card className="border-2 border-primary/50 bg-primary/5">
          <CardContent className="pt-6 space-y-4">
            <Badge variant="destructive" className="mb-2">
              2026 前沿
            </Badge>
            <div className="text-2xl font-bold text-primary text-balance">{coreIdea.title}</div>
            <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary/40 pl-4">
              {'"'}
              {coreIdea.quote.text}
              {'"'}
              <footer className="mt-2 text-xs not-italic">— {coreIdea.quote.author}</footer>
            </blockquote>
            <div className="text-xs text-muted-foreground border-t border-hairline pt-4">{coreIdea.layer}</div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="pieces" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pieces">6 大组件</TabsTrigger>
            <TabsTrigger value="flow">循环流程</TabsTrigger>
            <TabsTrigger value="caveats">风险边界</TabsTrigger>
          </TabsList>

          {/* 6 大组件 */}
          <TabsContent value="pieces" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {loopPieces.map((piece, idx) => {
                const Icon = piece.icon
                return (
                  <Card
                    key={piece.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      activePiece === idx ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActivePiece(idx)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{piece.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">{piece.subtitle}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{piece.description}</p>
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
                    const Icon = loopPieces[activePiece].icon
                    return <Icon className="w-6 h-6 text-primary" />
                  })()}
                  <div>
                    <CardTitle>{loopPieces[activePiece].title}</CardTitle>
                    <CardDescription>{loopPieces[activePiece].subtitle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">核心职责</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {loopPieces[activePiece].details.map((detail, idx) => (
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
                    <div className="text-sm">{loopPieces[activePiece].example}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs font-semibold text-primary mb-1">关键提示</div>
                    <div className="text-sm">{loopPieces[activePiece].tip}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 循环流程 */}
          <TabsContent value="flow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>一个循环长什么样</CardTitle>
                <CardDescription>
                  拼在一起，单个线程就变成一个小小的控制面板。你只设计一次，之后不再 prompt 任何一步。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loopFlow.map((item, idx) => {
                    const Icon = item.icon
                    const isLast = idx === loopFlow.length - 1
                    return (
                      <div key={item.step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          {!isLast && <div className="w-0.5 flex-1 bg-border my-1" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">
                              {String(item.step).padStart(2, "0")}
                            </span>
                            <h4 className="font-semibold">{item.title}</h4>
                            {isLast && (
                              <Badge variant="secondary" className="text-xs">
                                <Repeat className="w-3 h-3 mr-1" />
                                回到起点
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1 italic">{item.detail}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm">
                  <strong>看看你实际做了什么：</strong>
                  你只设计了它一次。上面这些步骤你一步都没有 prompt。这就是 Steinberger 观点的真实落地 ——
                  而且在 Codex 或 Claude Code 里是同一个循环，因为组件都是同样的组件。
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 风险边界 */}
          <TabsContent value="caveats" className="space-y-6">
            <Card className="bg-amber-500/5 border-amber-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-600 dark:text-amber-400">循环改变工作，但不会把你从中删除</div>
                    <p className="text-sm text-muted-foreground">
                      有三个问题会随着循环变好而变得更尖锐，而不是更容易。构建循环，但要像一个打算继续当工程师的人那样构建它，
                      而不只是那个按下「开始」的人。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              {caveats.map((caveat, idx) => {
                const Icon = caveat.icon
                return (
                  <Card key={idx} className="border-destructive/30">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-destructive/10">
                          <Icon className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{caveat.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{caveat.nameEn}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{caveat.description}</p>
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-1 text-xs">
                          <CheckCircle className="w-4 h-4" />
                          应对
                        </div>
                        <p className="text-sm">{caveat.solution}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Key Insight */}
        <Card className="bg-gradient-to-r from-primary/10 to-chart-2/10 border-primary/20">
          <CardHeader>
            <CardTitle>为什么 Loop 设计比 Prompt 工程更难</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong>杠杆点移动了：</strong>Cherny 的观点不是工作变简单了，而是杠杆点从「写好 prompt」移到了「设计好循环」
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong>同一个循环，相反的结果：</strong>两个人搭出完全相同的循环，可以得到完全相反的结果。一个用它在深刻理解的工作上跑得更快，另一个用它彻底逃避理解工作。循环不知道区别，你知道
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong>保持平衡：</strong>去搭你的循环，但别忘了直接 prompt Agent 同样有效。关键是找到正确的平衡
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DemoShell>
  )
}

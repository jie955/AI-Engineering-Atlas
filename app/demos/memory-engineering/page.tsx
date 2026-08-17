"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Brain,
  Database,
  Clock,
  Zap,
  Layers,
  Search,
  Trash2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useDemoProgress } from "@/lib/use-demo-progress"

// 记忆类型分层
const memoryTypes = [
  {
    id: "working",
    name: "工作记忆",
    en: "Working Memory",
    icon: Zap,
    description: "当前对话轮次的即时上下文，存活时间最短",
    lifespan: "单次请求",
    capacity: "受上下文窗口限制",
    example: "用户当前提问 + 最近几轮对话",
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    border: "border-chart-1/30",
  },
  {
    id: "short-term",
    name: "短期记忆",
    en: "Short-term Memory",
    icon: Clock,
    description: "单个会话内的累积信息，会话结束可能清除",
    lifespan: "单个会话",
    capacity: "数十至数百条",
    example: "本次会话的关键决策、用户偏好临时记录",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    border: "border-chart-2/30",
  },
  {
    id: "long-term",
    name: "长期记忆",
    en: "Long-term Memory",
    icon: Database,
    description: "跨会话持久化存储，构成用户画像与知识沉淀",
    lifespan: "永久 (可遗忘)",
    capacity: "无限 (向量库)",
    example: "用户长期偏好、历史事实、个性化设定",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    border: "border-chart-3/30",
  },
  {
    id: "episodic",
    name: "情景记忆",
    en: "Episodic Memory",
    icon: Layers,
    description: "特定事件的完整记录，包含时间与因果关系",
    lifespan: "可配置",
    capacity: "按事件归档",
    example: "某次完整任务的执行轨迹与结果",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    border: "border-chart-4/30",
  },
]

// 记忆操作生命周期
const memoryOps = [
  {
    step: "写入 (Encode)",
    description: "提取对话中的关键信息，生成结构化记忆条目并向量化",
    icon: Database,
    detail: "实体抽取 + 摘要 + Embedding 生成",
  },
  {
    step: "存储 (Store)",
    description: "将记忆持久化到向量数据库，附带元数据与时间戳",
    icon: Layers,
    detail: "向量库 + 元数据索引 + 重要性评分",
  },
  {
    step: "检索 (Retrieve)",
    description: "根据当前查询语义相似度召回最相关的记忆",
    icon: Search,
    detail: "语义检索 + 时间衰减 + 重要性加权",
  },
  {
    step: "遗忘 (Forget)",
    description: "淘汰过期、低价值或冗余记忆，控制存储成本",
    icon: Trash2,
    detail: "时间衰减 + LRU + 重要性阈值",
  },
]

// 检索打分演示数据
const memoryBank = [
  { id: 1, content: "用户偏好简洁的技术回答，不喜欢冗长解释", relevance: 0.92, recency: 0.85, importance: 0.9 },
  { id: 2, content: "用户正在开发一个 Next.js 电商项目", relevance: 0.88, recency: 0.95, importance: 0.85 },
  { id: 3, content: "用户上周询问过 RAG 系统的实现方案", relevance: 0.65, recency: 0.4, importance: 0.6 },
  { id: 4, content: "用户的母语是中文，使用简体中文交流", relevance: 0.55, recency: 0.7, importance: 0.95 },
  { id: 5, content: "用户三个月前提到喜欢喝咖啡", relevance: 0.12, recency: 0.1, importance: 0.2 },
]

// 真实应用场景
const scenarios = [
  {
    scenario: "个性化助手",
    challenge: "记住用户长期偏好与历史交互",
    strategy: "长期记忆 + 用户画像向量",
    benefits: "无需重复说明，体验连贯个性化",
  },
  {
    scenario: "多轮任务 Agent",
    challenge: "跨步骤保持目标与中间状态",
    strategy: "工作记忆 + 情景记忆",
    benefits: "复杂任务不丢失上下文，可回溯",
  },
  {
    scenario: "客服机器人",
    challenge: "结合工单历史与用户档案",
    strategy: "短期记忆 + 长期记忆检索",
    benefits: "快速理解背景，减少重复询问",
  },
  {
    scenario: "代码助手",
    challenge: "记住项目结构与编码约定",
    strategy: "长期记忆 (项目知识库)",
    benefits: "生成代码符合项目风格与规范",
  },
]

export default function MemoryEngineeringPage() {
  const { markVisited, markComplete } = useDemoProgress("memory-engineering")
  useEffect(() => {
    markVisited()
  }, [])
  const [query, setQuery] = useState("帮我写一段技术文档")
  const [retrieved, setRetrieved] = useState(false)
  const weights = { relevance: 0.5, recency: 0.3, importance: 0.2 }

  const scored = memoryBank
    .map((m) => ({
      ...m,
      score: m.relevance * weights.relevance + m.recency * weights.recency + m.importance * weights.importance,
    }))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Agent</Badge>
            <Badge variant="outline">中级</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">记忆工程</h1>
              <p className="text-muted-foreground">Memory Engineering</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            为 AI Agent 构建分层记忆系统：让智能体能够跨会话记住关键信息、个性化适配用户，
            并在海量记忆中精准检索最相关的内容。涵盖记忆分层、写入-检索-遗忘生命周期与检索打分机制。
          </p>
        </div>

        <Tabs defaultValue="types" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="types">记忆分层</TabsTrigger>
            <TabsTrigger value="lifecycle">生命周期</TabsTrigger>
            <TabsTrigger value="retrieval">检索打分</TabsTrigger>
            <TabsTrigger value="scenarios">应用场景</TabsTrigger>
          </TabsList>

          {/* 记忆分层 */}
          <TabsContent value="types" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memoryTypes.map((m) => {
                const Icon = m.icon
                return (
                  <Card key={m.id} className={`p-6 border ${m.border}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${m.bg}`}>
                        <Icon className={`w-6 h-6 ${m.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-foreground">{m.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{m.en}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{m.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">存活时间</p>
                            <p className="font-medium text-foreground">{m.lifespan}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">容量</p>
                            <p className="font-medium text-foreground">{m.capacity}</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">示例</p>
                          <p className="text-sm text-foreground">{m.example}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <Card className="p-6 bg-muted/30">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                记忆层级流动
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-3">
                {["工作记忆", "短期记忆", "长期记忆"].map((label, i, arr) => (
                  <div key={label} className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none px-4 py-3 rounded-lg bg-card border text-center text-sm font-medium text-foreground">
                      {label}
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                重要信息从工作记忆经过"巩固 (Consolidation)"逐步沉淀为长期记忆，类似人脑的记忆固化过程。
              </p>
            </Card>
          </TabsContent>

          {/* 生命周期 */}
          <TabsContent value="lifecycle" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {memoryOps.map((op, i) => {
                const Icon = op.icon
                return (
                  <Card key={op.step} className="p-6 relative">
                    <div className="absolute top-4 right-4 text-3xl font-bold text-muted/30">{i + 1}</div>
                    <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{op.step}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{op.description}</p>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-foreground font-mono">{op.detail}</p>
                    </div>
                  </Card>
                )
              })}
            </div>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4">遗忘机制：为什么 Agent 也需要遗忘？</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-2">时间衰减</p>
                  <p className="text-sm text-muted-foreground">久未访问的记忆重要性随时间指数衰减</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-2">成本控制</p>
                  <p className="text-sm text-muted-foreground">无限增长的记忆会导致检索变慢、存储成本上升</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-2">质量优先</p>
                  <p className="text-sm text-muted-foreground">淘汰低价值记忆，保留高信号内容提升检索精度</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 检索打分 */}
          <TabsContent value="retrieval" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-2">记忆检索打分演示</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                检索时综合三个维度对记忆打分：
                <span className="text-chart-1 font-medium"> 相关性 (50%)</span>、
                <span className="text-chart-2 font-medium"> 时近性 (30%)</span>、
                <span className="text-chart-3 font-medium"> 重要性 (20%)</span>。
                综合得分越高，越优先注入到上下文中。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border bg-background text-foreground text-sm"
                  placeholder="输入当前查询..."
                />
                <Button onClick={() => { setRetrieved(true); markComplete() }}>
                  <Search className="w-4 h-4 mr-2" />
                  执行检索
                </Button>
              </div>

              <div className="space-y-3">
                {scored.map((m, i) => {
                  const selected = retrieved && i < 3
                  return (
                    <div
                      key={m.id}
                      className={`p-4 rounded-lg border transition-all ${
                        selected ? "border-primary bg-primary/5" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <p className="text-sm text-foreground flex-1">{m.content}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          {selected && <Badge className="text-xs">已注入</Badge>}
                          <span className="text-lg font-bold text-foreground">{(m.score * 100).toFixed(0)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">相关性</span>
                            <span className="text-chart-1">{(m.relevance * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={m.relevance * 100} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">时近性</span>
                            <span className="text-chart-2">{(m.recency * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={m.recency * 100} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">重要性</span>
                            <span className="text-chart-3">{(m.importance * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={m.importance * 100} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {retrieved && (
                <p className="text-sm text-muted-foreground mt-4">
                  上方高亮的 3 条记忆将被注入到当前上下文，其余记忆暂不召回以节省 Token 成本。
                </p>
              )}
            </Card>
          </TabsContent>

          {/* 应用场景 */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map((s) => (
                <Card key={s.scenario} className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">{s.scenario}</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">挑战</p>
                      <p className="text-foreground">{s.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">记忆策略</p>
                      <Badge variant="secondary">{s.strategy}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">收益</p>
                      <p className="text-foreground">{s.benefits}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { USER_ID } from "@/lib/rag-data"
import type { RagState } from "@/types/rag"
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Database,
  Sparkles,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface RagDetailPanelProps {
  activeStep: string
  ragState: RagState
  onFeedback?: (isPositive: boolean) => void
}

export function RagDetailPanel({ activeStep, ragState, onFeedback }: RagDetailPanelProps) {
  const { query, retrievalData, generationResult } = ragState

  const renderContent = () => {
    switch (activeStep) {
      case "user-input":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">客户提出问题或需求</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    用户使用自然语言描述他们的点餐需求，系统将进行智能解析
                  </p>
                  <Card className="p-4 bg-card">
                    <p className="text-base leading-relaxed italic">"{query}"</p>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        )

      case "pre-retrieval":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">系统诊断与转换</h4>
              <p className="text-sm text-muted-foreground mb-4">
                RAG 系统将查询分解为关键词和元数据过滤器，为后续检索做准备
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">提取关键词</Badge>
                </h5>
                <div className="flex flex-wrap gap-2">
                  {retrievalData.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-sm">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">元数据过滤器</Badge>
                </h5>
                <code className="text-sm bg-muted px-3 py-2 rounded block">
                  user_id = "{USER_ID}"
                  <br />
                  context.includes(keywords)
                </code>
              </Card>
            </div>
          </div>
        )

      case "etl-extract":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">1.1 数据提取 (Loader)</h4>
                  <p className="text-sm text-muted-foreground mb-4">将原始数据（PDF, HTML, Database, Code）载入内存</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">本案例数据源</h5>
              <div className="grid gap-3">
                <Card className="p-4 border-l-4 border-l-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">餐厅菜单数据库</p>
                      <p className="text-sm text-muted-foreground">静态菜单知识 (Menu Index)</p>
                    </div>
                    <Badge variant="secondary">已加载 {retrievalData.menuResults.length + 1} 条</Badge>
                  </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">用户历史订单与评价</p>
                      <p className="text-sm text-muted-foreground">动态偏好数据 (History Index)</p>
                    </div>
                    <Badge variant="secondary">已加载 {retrievalData.historyResults.length + 1} 条</Badge>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )

      case "etl-transform":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">1.2 数据转换 (Cleaner)</h4>
                  <p className="text-sm text-muted-foreground">
                    清洗 OCR 错误、表格转 Markdown；嵌入业务元数据（如安全等级、用户 ID）
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-l-amber-500">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold mb-2">伦理风险控制：知识偏见 (Bias)</h5>
                    <p className="text-sm text-muted-foreground">
                      确保训练数据和知识源的多样性；使用元数据标记敏感信息，在检索时避开或加权处理
                    </p>
                  </div>
                </div>
              </Card>

              <h5 className="font-semibold text-sm">数据清洗结果示例</h5>
              <div className="grid md:grid-cols-2 gap-3">
                <Card className="p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">原始数据</p>
                  <code className="text-xs">麻辣火锅（辣度：★★★★★）价格30元</code>
                </Card>
                <Card className="p-3 bg-green-500/10">
                  <p className="text-xs text-muted-foreground mb-1">清洗后</p>
                  <code className="text-xs">
                    {JSON.stringify(
                      { dish: "麻辣火锅", flavor: "麻辣", price: 30, metadata: { user_visible: true } },
                      null,
                      2,
                    )}
                  </code>
                </Card>
              </div>
            </div>
          </div>
        )

      case "chunking":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <span className="text-2xl">✂️</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">2.1 切块策略 (Chunking)</h4>
                  <p className="text-sm text-muted-foreground">
                    将文档分解为语义连贯的知识块（高级切块：Parent-Child、Summary、Code-based）
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">本案例切块策略</h5>
              <p className="text-sm text-muted-foreground">
                菜单数据以单个菜品为单位切分，用户历史以单次评价为单位切分
              </p>
              <div className="grid gap-3">
                {[
                  { title: "菜单切块", count: "4 个知识块", desc: "每个菜品独立为一个 Chunk" },
                  { title: "历史切块", count: "2 个知识块", desc: "每条历史评价独立为一个 Chunk" },
                ].map((item, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "embedding":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <span className="text-2xl">🧮</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">2.2 向量化 (Embedding)</h4>
                  <p className="text-sm text-muted-foreground">
                    将知识块转换为高维向量，选择与业务领域和语言匹配的高性能 Embedding 模型
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4 bg-muted/30">
                <h5 className="font-semibold mb-3">Embedding 配置</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">模型:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">text-embedding-3-small</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">维度:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">1536 维</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">语言优化:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">中文 + 领域词汇</code>
                  </div>
                </div>
              </Card>

              <p className="text-sm text-muted-foreground italic">
                示例：菜品 "麻辣火锅" 被转换为 [0.23, -0.45, 0.67, ...] (1536 维向量)
              </p>
            </div>
          </div>
        )

      case "indexing":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">2.3 索引建立</h4>
                  <p className="text-sm text-muted-foreground">
                    将向量和元数据存储到向量数据库，确保元数据字段可被高效检索过滤
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold mb-2">伦理风险控制：个人隐私泄露 (PII)</h5>
                  <p className="text-sm text-muted-foreground">
                    采用匿名化处理 (Hashing) 或访问控制列表 (ACL) 保护敏感元数据和 Chunk
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">已建立的索引</h5>
              <div className="grid gap-3">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">索引 A - 餐厅菜单</p>
                    <Badge>向量索引</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">支持语义检索 + 元数据过滤 (type, flavor, price)</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">索引 B - 用户历史偏好</p>
                    <Badge>向量索引 + ACL</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">强制 user_id 过滤，保护用户隐私，支持个性化检索</p>
                </Card>
              </div>
            </div>
          </div>
        )

      case "query-transform":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">3.1 查询转换 (Query Transformation)</h4>
                  <p className="text-sm text-muted-foreground">
                    将模糊或复杂的用户查询转化为更适合检索的形态（Query Rewriting、HyDE）
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-muted/30">
                  <h5 className="font-semibold mb-2 text-sm">原始查询</h5>
                  <p className="text-sm italic">"{query}"</p>
                </Card>
                <Card className="p-4 bg-amber-500/10">
                  <h5 className="font-semibold mb-2 text-sm">重写后的查询</h5>
                  <p className="text-sm">
                    关键词: <Badge variant="secondary">温暖</Badge> <Badge variant="secondary">辣</Badge>{" "}
                    <Badge variant="secondary">胃</Badge>
                  </p>
                  <p className="text-sm mt-2">约束: 清淡/养胃优先</p>
                </Card>
              </div>

              <Card className="p-4 bg-blue-500/5">
                <h5 className="font-semibold mb-2">HyDE (假设文档生成)</h5>
                <p className="text-sm text-muted-foreground">
                  系统生成假设性答案："推荐清淡温暖的汤面类食物，避免刺激性强的辣味..."
                </p>
              </Card>
            </div>
          </div>
        )

      case "hybrid-search":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <span className="text-2xl">🔎</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">3.2 混合检索 (Hybrid Search)</h4>
                  <p className="text-sm text-muted-foreground">
                    结合语义和关键词检索，Multi-Index Query 同时查询多个索引
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold mb-2">伦理风险控制：虚假引用源 (Hallucination Source)</h5>
                  <p className="text-sm text-muted-foreground">
                    强制应用元数据过滤器（如 user_id），保证召回结果的绝对准确性
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-sm mb-3">索引 A (静态菜单) 召回结果</h5>
                <div className="grid gap-3">
                  {retrievalData.menuResults.map((item, index) => (
                    <Card key={index} className="p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h6 className="font-semibold mb-1">{item.dish}</h6>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <Badge variant="outline">{item.flavor}</Badge>
                            <Badge variant="secondary">¥{item.price}</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-sm mb-3">索引 B (用户历史) 召回结果</h5>
                <div className="grid gap-3">
                  {retrievalData.historyResults.map((item, index) => (
                    <Card key={index} className="p-4 border-l-4 border-l-amber-500">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h6 className="font-semibold">{item.dish}</h6>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">评分: {item.rating}/5</span>
                            {item.rating < 3 && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          </div>
                        </div>
                        <p className="text-sm italic text-muted-foreground">"{item.comment}"</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "reranking":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">3.3 重排器 (Re-ranking)</h4>
                  <p className="text-sm text-muted-foreground">对初步召回的 Top-N 文档进行二次过滤和排序，消除噪音</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold mb-2">伦理风险控制：偏好锁定 (Filter Bubble)</h5>
                  <p className="text-sm text-muted-foreground">
                    故意引入探索性文档，避免过度依赖用户历史，实现长期的价值发现
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-sm mb-3">重排策略</h5>
                <div className="grid gap-3">
                  <Card className="p-4 bg-green-500/5 border-green-500/30">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-sm">清淡/养胃菜品优先</p>
                        <p className="text-xs text-muted-foreground">基于查询中的 "胃不舒服" 信号</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-amber-500/5 border-amber-500/30">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold text-sm">降低负面历史菜品权重</p>
                        <p className="text-xs text-muted-foreground">麻辣火锅 (2星评价) 被降权</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-blue-500/5 border-blue-500/30">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-sm">探索性推荐保留</p>
                        <p className="text-xs text-muted-foreground">保留 10% 用户未尝试的菜品选项</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <p className="text-sm text-muted-foreground italic">
                最终重排序结果: 清汤面 → 清炒时蔬 → 酸辣粉 (麻辣火锅已被过滤)
              </p>
            </div>
          </div>
        )

      case "context-assembly":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-500/20 rounded-lg">
                  <span className="text-2xl">🧩</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">4.1 上下文组装 (Prompt Build)</h4>
                  <p className="text-sm text-muted-foreground">将系统指令、检索结果和用户查询整合为 LLM 的输入</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold mb-2">伦理风险控制：胡言乱语 (Hallucination Answer)</h5>
                  <p className="text-sm text-muted-foreground">
                    在 System Prompt 中植入风控指令："如果证据不足，必须回答'无法确定'，而不是编造"
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4 bg-muted/30">
                <h5 className="font-semibold mb-3">最终 Prompt 结构</h5>
                <div className="space-y-3 text-sm font-mono">
                  <div className="p-3 bg-card rounded border">
                    <p className="text-xs text-muted-foreground mb-1">[System]</p>
                    <p className="text-xs">
                      你是一个餐厅点餐助手。只能基于提供的菜单和用户历史进行推荐。如果信息不足，明确告知用户。
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded border">
                    <p className="text-xs text-muted-foreground mb-1">[Context - Menu Index]</p>
                    <p className="text-xs">{JSON.stringify(retrievalData.menuResults[0], null, 2)}</p>
                  </div>
                  <div className="p-3 bg-card rounded border">
                    <p className="text-xs text-muted-foreground mb-1">[Context - User History]</p>
                    <p className="text-xs">{JSON.stringify(retrievalData.historyResults[0], null, 2)}</p>
                  </div>
                  <div className="p-3 bg-card rounded border">
                    <p className="text-xs text-muted-foreground mb-1">[User Query]</p>
                    <p className="text-xs">{query}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )

      case "llm-generation":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">4.2 LLM 合成与输出</h4>
                  <p className="text-sm text-muted-foreground">
                    基于所有上下文，生成最终的答案或决策，确保每个答案片段都能追溯到源文档
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className={`p-6 ${
                generationResult.isPersonalized
                  ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary"
                  : "bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">最终推荐: {generationResult.finalDish}</h3>
                  <Badge variant={generationResult.isPersonalized ? "default" : "secondary"}>
                    {generationResult.isPersonalized ? "个性化风险规避推荐" : "通用匹配推荐"}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span>🧠</span>
                  决策链与个性化理由
                </h4>
                <Card className="p-4 bg-card">
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{generationResult.reason}</pre>
                </Card>
              </div>
            </Card>

            {generationResult.historyComments && (
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">历史记录上下文（可追溯的引用）</h4>
                <Card className="p-4 bg-muted/30">
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-muted-foreground">
                    {generationResult.historyComments}
                  </pre>
                </Card>
              </div>
            )}
          </div>
        )

      case "output-display":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <span className="text-2xl">📤</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">5. 结果输出与引用 (Output)</h4>
                  <p className="text-sm text-muted-foreground">系统向用户展示结果，并提供决策依据（引用）</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-primary">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🍜</span>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{generationResult.finalDish}</h3>
                    <Badge className="text-sm">
                      {generationResult.isPersonalized ? "根据您的历史偏好推荐" : "基于菜单匹配"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h5 className="font-semibold mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    决策依据
                  </h5>
                  <div className="space-y-2 text-sm">
                    <Card className="p-3 bg-muted/50">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">(基于知识)</strong> 符合 '温暖' 且 '预算内'
                      </p>
                    </Card>
                    <Card className="p-3 bg-muted/50">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">(基于偏好)</strong> 您上次给麻辣火锅打了 2
                        星，说明您对麻辣耐受度低
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>

            <p className="text-sm text-muted-foreground italic text-center">
              所有推荐内容都能追溯到具体的知识源（菜单 Index / 用户历史 Index）
            </p>
          </div>
        )

      case "feedback-loop":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <span className="text-2xl">🔁</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">6. 用户反馈 (Feedback Loop)</h4>
                  <p className="text-sm text-muted-foreground">
                    用户对推荐点赞或踩，系统将此反馈标记为新的元数据，重新注入 ETL 流程
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-cyan-500">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold mb-2">伦理风险控制：负面反馈处理</h5>
                  <p className="text-sm text-muted-foreground">
                    建立快速反馈通道，将用户或人工标注的负面反馈立即回传并更新到用户偏好索引中
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div>
                <h5 className="font-semibold mb-3">用户反馈选项</h5>
                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-20 border-2 hover:border-green-500 hover:bg-green-500/10 bg-transparent"
                    onClick={() => onFeedback?.(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ThumbsUp className="w-6 h-6" />
                      <span className="font-semibold">满意</span>
                    </div>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-20 border-2 hover:border-red-500 hover:bg-red-500/10 bg-transparent"
                    onClick={() => onFeedback?.(false)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ThumbsDown className="w-6 h-6" />
                      <span className="font-semibold">不满意</span>
                    </div>
                  </Button>
                </div>
              </div>

              <Card className="p-4 bg-muted/30">
                <h5 className="font-semibold mb-3">反馈处理流程</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">
                      1
                    </Badge>
                    <p className="text-muted-foreground">用户点击满意/不满意按钮</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">
                      2
                    </Badge>
                    <p className="text-muted-foreground">反馈被记录为新的历史评价数据</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">
                      3
                    </Badge>
                    <p className="text-muted-foreground">数据重新进入 ETL 流程 (步骤 1.2/2.3)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">
                      4
                    </Badge>
                    <p className="text-muted-foreground">个性化索引更新，影响未来推荐</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-amber-500/5 border-amber-500/30">
                <h5 className="font-semibold mb-2">负面反馈示例</h5>
                <p className="text-sm text-muted-foreground mb-3">如果用户对 "清汤面" 点了不满意，系统会：</p>
                <div className="space-y-2 text-xs">
                  <code className="block bg-muted p-2 rounded">
                    新增历史记录: {"{"}dish: "清汤面", rating: 1, comment: "用户不满意", context: "避免推荐"{"}"}
                  </code>
                  <p className="text-muted-foreground italic">下次查询时，清汤面的权重将被降低或过滤</p>
                </div>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    const step = [
      { id: "user-input", title: "💬 客户输入 - Query Input" },
      { id: "pre-retrieval", title: "🔍 系统诊断与转换 - Pre-Retrieval" },
      { id: "etl-extract", title: "📥 1.1 数据提取 - Loader" },
      { id: "etl-transform", title: "🧹 1.2 数据转换 - Cleaner" },
      { id: "chunking", title: "✂️ 2.1 切块策略 - Chunking" },
      { id: "embedding", title: "🧮 2.2 向量化 - Embedding" },
      { id: "indexing", title: "📚 2.3 索引建立 - Index Build" },
      { id: "query-transform", title: "🔄 3.1 查询转换 - Query Transform" },
      { id: "hybrid-search", title: "🔎 3.2 混合检索 - Hybrid Search" },
      { id: "reranking", title: "📊 3.3 重排器 - Re-ranking" },
      { id: "context-assembly", title: "🧩 4.1 上下文组装 - Prompt Build" },
      { id: "llm-generation", title: "✨ 4.2 LLM 合成与输出 - Generation" },
      { id: "output-display", title: "📤 5. 结果输出与引用 - Output" },
      { id: "feedback-loop", title: "🔁 6. 用户反馈 - Feedback Loop" },
    ].find((s) => s.id === activeStep)
    return step?.title || "详细信息"
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 pb-3 border-b">{getStepTitle()}</h3>
      <div className="min-h-[400px]">{renderContent()}</div>
    </div>
  )
}

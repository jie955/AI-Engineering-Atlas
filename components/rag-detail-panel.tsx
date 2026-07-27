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
  ArrowRight,
  Code
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
      case "B1":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold">B1 用户输入 (Query Input)</h4>
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">⚡ 在线 · 触发端</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    系统接收用户提交的模糊自然语言输入。由于是在线系统，该查询将触发实时执行流。
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <h5 className="font-semibold text-sm">当前活跃输入载荷 (Payload)</h5>
              <Card className="p-5 bg-card border-l-4 border-l-blue-500 shadow-inner">
                <p className="text-base leading-relaxed italic text-foreground font-medium">"{query}"</p>
              </Card>
            </div>
          </div>
        )

      case "B2":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <span className="text-2xl">🧠</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold">B2 查询诊断 (Pre-Retrieval)</h4>
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">⚡ 在线 · 意图理解</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    对用户原始查询进行深度意图识别和冲突约束提取，在进入向量检索前确定搜索边界（<strong>偏“理解与定性”</strong>）。
                  </p>
                </div>
              </div>
            </Card>

            {/* B2 and B3 Division of Labor Alert */}
            <Card className="p-4 border-l-4 border-l-indigo-500 bg-indigo-500/[0.02]">
              <h5 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1">
                <span>📌</span> 核心分工：B2 意图诊断 vs B3 检索改写
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>B2 查询诊断（当前步）：</strong> 专注于“理解”。剖析自然语言，抽取出核心偏好、健康约束，并完成多维冲突检测，确定最终的底层控制策略。<br />
                <strong>B3 查询转换（下一步）：</strong> 专注于“执行”。承接当前步 B2 产出的诊断结果，将抽象的策略指令转化为具体的检索表达式（如多路 Query、HyDE 等），对齐语义空间。
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">冲突识别与诊断推理过程</Badge>
                </h5>
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground">用户期望偏好 (Preference):</span>
                    <span className="font-semibold text-amber-600">"温暖"、"辣的食物"</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground">提取身体约束 (Constraint):</span>
                    <span className="font-semibold text-rose-500">"胃不舒服 (肠胃敏感)"</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-border/40 pb-2">
                    <span className="text-muted-foreground">安全与物理冲突检测:</span>
                    <span className="text-red-500 font-bold flex items-center gap-1.5">
                      ⚠️ 检测到潜在冲突: 辣 (刺激性) vs 胃不舒服 (需温和)
                    </span>
                  </div>
                  <div className="p-2.5 bg-rose-500/5 rounded-lg border border-rose-500/10 text-xs">
                    <span className="font-bold text-rose-600 block mb-0.5">🚨 诊断决策结论：</span>
                    辣味虽属于用户主观喜好，但胃部不适是高优先级的生理/安全限制。根据智能安全推荐风控逻辑，应<strong>物理降权/熔断重刺激性（重辣）选项</strong>，并转而强制将<strong>温热、好消化、滋补养胃</strong>等特征置顶。
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">元数据过滤器与特征提取</Badge>
                </h5>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1.5 font-medium">提取特征词 (供 B3 检索转换使用):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {retrievalData.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs font-semibold">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1.5 font-medium">安全风控指令包:</span>
                    <code className="text-xs bg-muted p-2.5 rounded-lg block font-mono leading-relaxed text-[11px]">
                      FILTER_SPICY: true (辣度限额: 微辣以下)
                      <br />
                      BOOST_WARM: true (提升温暖、温汤菜品)
                      <br />
                      USER_ACL_ID: "{USER_ID}"
                    </code>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )

      case "B3":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold">B3 查询转换 (Query Transform)</h4>
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">⚡ 在线 · 检索改写</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    承接 B2 的诊断结果（<strong>“喜好与健康的胃部冲突诊断”</strong>），对带有冲突偏好的自然语言进行检索重构，将诊断结论转化为具体的向量空间拓展（<strong>偏“改写与执行”</strong>）。
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-muted/30">
                  <h5 className="font-semibold mb-2 text-sm text-muted-foreground">B2 诊断输入 (Original Context)</h5>
                  <div className="space-y-2 text-xs">
                    <p className="italic">"用户想吃辣，但今天胃不舒服。"</p>
                    <div className="p-2 bg-red-500/[0.03] border border-red-500/10 text-[11px] rounded text-red-600 dark:text-red-400">
                      <strong>🚨 诊断策略：</strong> 强制压制刺激性重辣，扩写温暖、温和、易消化的流质/面汤类检索项。
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-amber-500/10 border border-amber-500/20">
                  <h5 className="font-semibold mb-2 text-sm text-amber-600 flex items-center gap-1.5">
                    <span>📝</span> B3 执行改写与扩展查询 (基于诊断结果)
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block mb-0.5">1. 语义改写 (Query Rewriting):</span>
                      <span className="font-semibold text-foreground">"温暖、温热、温和面食、清淡滋补、养胃面汤、非刺激性、微辣或不辣的热汤"</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">2. 探索扩展 (Multi-Query):</span>
                      <span className="font-semibold text-foreground">针对胃部调理，增加：砂锅、米粥、清汤、蒸菜</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4 bg-blue-500/5 border border-blue-500/15">
                <h5 className="font-semibold mb-2 flex items-center gap-1.5 text-sm">
                  <span>🧬</span> HyDE (Hypothetical Document Embeddings - 假设性文档生成)
                </h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  系统基于 B2 的“温暖不辣、护胃第一”策略，生成一个完美的“虚拟答案”用于向量空间对齐：
                  <span className="block mt-2 p-3 bg-card rounded-lg italic border text-xs text-foreground font-medium">
                    "推荐具有调理肠胃功效、温热不油腻的食物，如温热的汤面或时蔬，避免麻辣火锅等深度刺激性菜品。"
                  </span>
                </p>
              </Card>
            </div>
          </div>
        )

      case "A1":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold">A1 数据提取 (Loader)</h4>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">🏗️ 离线 · 数据载入</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    这是离线建设期的第一步，将餐厅菜单数据库、用户历史订单等原始物理数据完整载入内存中。
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">当前已成功加载的原始数据库</h5>
              <div className="grid gap-3">
                <Card className="p-4 border-l-4 border-l-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">餐厅菜单数据库</p>
                      <p className="text-sm text-muted-foreground">静态菜单知识库 (Menu Index)</p>
                    </div>
                    <Badge variant="secondary">已加载 {retrievalData.menuResults.length + 1} 条原始记录</Badge>
                  </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">用户历史订单与评价</p>
                      <p className="text-sm text-muted-foreground">动态偏好历史记录 (History Index)</p>
                    </div>
                    <Badge variant="secondary">已加载 {retrievalData.historyResults.length + 1} 条原始记录</Badge>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )

      case "A2":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold">A2 数据清洗 (Cleaner)</h4>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">🏗️ 离线 · 清洗治理</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    对原始数据进行质量治理：清洗拼写与 OCR 错误、规范键值字段、植入业务安全和权限元数据。
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-500/[0.01]">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold mb-2">伦理风险控制：知识偏见规避 (Bias Mitigation)</h5>
                    <p className="text-sm text-muted-foreground">
                      确保载入的知识库不包含地域歧视、文化偏见。标记特殊敏感字段并在清洗阶段对敏感属性进行脱敏或权限限制，保护多样性。
                    </p>
                  </div>
                </div>
              </Card>

              <h5 className="font-semibold text-sm">清洗与结构化映射对比</h5>
              <div className="grid md:grid-cols-2 gap-3">
                <Card className="p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">原始非结构化格式</p>
                  <code className="text-xs font-mono">麻辣火锅（辣度：★★★★★）价格30元</code>
                </Card>
                <Card className="p-3 bg-green-500/5 border border-green-500/20">
                  <p className="text-xs text-muted-foreground mb-1">清洗后结构化 JSON</p>
                  <code className="text-xs font-mono block whitespace-pre">
                    {JSON.stringify(
                      { dish: "麻辣火锅", flavor: "麻辣", price: 30, metadata: { user_visible: true, toxicity: "none" } },
                      null,
                      2,
                    )}
                  </code>
                </Card>
              </div>
            </div>
          </div>
        )

      case "A3":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <span className="text-2xl">✂️</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold">A3 切块策略 (Chunking)</h4>
                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">🏗️ 离线 · 分块处理</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    为了避免过长的文档撑爆 LLM 上下文，将清洗后的长文档按语义单元切分为合理的独立知识块 (Chunk)。
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">分块切片规则</h5>
              <p className="text-sm text-muted-foreground">
                采用单实体切块模式（即单个菜品为独立 Chunk；单次订单评价为独立 Chunk），保证检索粒度的绝对精准：
              </p>
              <div className="grid gap-3">
                {[
                  { title: "菜单数据切片 (Menu Chunking)", count: "4 个独立知识块", desc: "每个独立菜品的描述与参数形成一个实体" },
                  { title: "历史数据切片 (History Chunking)", count: "2 个独立知识块", desc: "单次历史点评（评分与内容）作为一个实体" },
                ].map((item, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{item.count}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "A4":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <span className="text-2xl">🧮</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold">A4 向量化 (Embedding)</h4>
                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">🏗️ 离线 · 向量编码</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    调用稠密向量模型，将切分好的文本 Chunk 转换为固定维度的浮点数数组，以供语义匹配。
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4 bg-muted/30">
                <h5 className="font-semibold mb-3 text-sm">Embedding 模型配置</h5>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">编码模型:</span>
                    <code className="text-xs bg-muted px-2 py-0.5 rounded text-foreground">text-embedding-3-small</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">向量维度 (Dimensions):</span>
                    <code className="text-xs bg-muted px-2 py-0.5 rounded text-foreground">1536 维</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">算法标准:</span>
                    <code className="text-xs bg-muted px-2 py-0.5 rounded text-foreground">余弦相似度优化 (Cosine Similarity)</code>
                  </div>
                </div>
              </Card>

              <div className="p-3 bg-muted/40 rounded-lg border border-border/40 text-xs">
                <strong>语义编码举例：</strong>菜品 <code className="bg-muted px-1 py-0.5 rounded text-primary">"清汤面"</code> 经过运算转换为 <code>[0.187, -0.092, 0.442, ..., -0.231]</code> 的 1536 维向量，从而拉近了与“温暖”、“不辣”等形容词的向量空间距离。
              </div>
            </div>
          </div>
        )

      case "A5":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold">A5 索引建立 (Index Build)</h4>
                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">🏗️ 离线 · 索引持久化</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    将向量数据连同业务元数据（例如口味、价格）写入向量数据库中并建立索引，确保高效的检索分流。
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-500/[0.01]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-sm mb-1">伦理风险控制：个人隐私保护 (PII Safety)</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    在存储用户历史和敏感点评数据时，数据库需强制通过访问控制列表 (ACL) 和匿名单哈希 (Hashing) 处理，确保非本人授权无法索引获取该段文本，物理阻断跨租户隐私泄露。
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">离线持久化索引配置</h5>
              <div className="grid md:grid-cols-2 gap-3">
                <Card className="p-4 border border-border/40 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">索引 A - 餐厅菜单知识</p>
                    <Badge variant="outline" className="text-[10px]">MENU_IDX</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">支持全局语义检索 + 多字段条件过滤 (type, flavor, price)</p>
                </Card>
                <Card className="p-4 border border-border/40 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">索引 B - 用户偏好历史</p>
                    <Badge variant="outline" className="text-[10px]">USER_HIST_ACL</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">强制以 user_id 作为底层硬过滤规则，严格防范越权引用</p>
                </Card>
              </div>
            </div>
          </div>
        )

      case "B4":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <span className="text-2xl">🔎</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold">B4 混合检索与重排 (Hybrid Search & Re-ranking)</h4>
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">⚡ 在线 · 多路召回重排</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    基于 B3 改写后的多路 Query，并行检索稠密向量库与关键字倒排索引，并送入决策重排器 (Re-ranker) 执行深度对齐与调权。
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column: Retrieval Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h5 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <span>📥</span> 混合多路召回 (Recall Phase)
                  </h5>
                  <Badge variant="outline" className="text-[10px]">召回 Top-N</Badge>
                </div>

                <div>
                  <h6 className="font-semibold text-xs text-muted-foreground mb-2">索引 A (静态菜单库) 召回内容:</h6>
                  <div className="grid gap-2.5">
                    {retrievalData.menuResults.map((item, index) => (
                      <Card key={index} className="p-3 hover:border-primary/50 transition-colors text-xs bg-card/60">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h6 className="font-bold text-foreground">{item.dish}</h6>
                            <Badge variant="secondary" className="text-[10px] scale-90">¥{item.price}</Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-normal">{item.description}</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-[9px] px-1 py-0">{item.type}</Badge>
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20">{item.flavor}</Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h6 className="font-semibold text-xs text-muted-foreground mb-2">索引 B (用户历史订单偏好) 召回内容:</h6>
                  <div className="grid gap-2.5">
                    {retrievalData.historyResults.map((item, index) => (
                      <Card key={index} className="p-3 border-l-2 border-l-amber-500 text-xs bg-card/60">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h6 className="font-semibold text-foreground">{item.dish}</h6>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-muted-foreground font-medium">历史评分: {item.rating}/5</span>
                              {item.rating < 3 && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                            </div>
                          </div>
                          <p className="text-[11px] italic text-muted-foreground leading-normal">"{item.comment}"</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Re-ranking and Bias Mitigation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h5 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <span>📊</span> 决策级重排调权 (Re-ranking Phase)
                  </h5>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">防风控微调</Badge>
                </div>

                <Card className="p-3.5 border-l-4 border-l-rose-500 bg-rose-500/[0.02]">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-xs mb-1">伦理风险控制：偏好锁定 (Filter Bubble)</h5>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        推荐系统不能一味顺从用户，需要通过策略去锁。引入 10% 的探索概率保留其他未尝健康菜品，打破“信息茧房”和推荐锁定。
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-2.5">
                  <h6 className="font-semibold text-xs text-muted-foreground">重排过滤精细化逻辑：</h6>
                  <div className="grid gap-2 text-xs">
                    <Card className="p-3 bg-green-500/5 border-green-500/20">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">1. 清淡养胃温和权重大增 ↑</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">捕获 B2 诊断的“胃部不适”，对清淡面汤（如清汤面）强制乘算重排分值系数 1.5</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-3 bg-amber-500/5 border-amber-500/20">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">2. 降低或熔断不适历史 ↓</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">由于曾给重辣重油菜品评分2星，且目前胃病，麻辣火锅、酸辣粉等强刺激物分值大幅折损（麻辣火锅直接过滤）</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-3 bg-blue-500/5 border-blue-500/20">
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">3. 动态健康膳食补偿 🛡️</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">为提供营养多元化，锁定 10% 搜索曝光给未食用过的清炒蔬菜或清蒸类，作为探索性尝试</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg text-xs font-mono border">
                  <strong>重排物理过滤结果：</strong>
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>1. 清汤面:</span>
                      <span className="text-green-600 font-bold">0.96分 (推荐)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2. 清炒时蔬:</span>
                      <span className="text-green-600">0.85分 (保留)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3. 酸辣粉:</span>
                      <span className="text-amber-600">0.40分 (降权)</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground border-t pt-1 mt-1 border-dashed">
                      <span>x. 麻辣火锅:</span>
                      <span className="text-red-500 line-through">已熔断硬屏蔽</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "B5":
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-500/20 rounded-lg">
                  <span className="text-2xl">✨</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold">B5 结果合成与交互输出 (Output & Generation)</h4>
                    <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-xs">⚡ 在线 · 闭环决策输出</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    基于 B4 的重排召回数据自动组装防幻觉的上下文 Prompt，交由大模型合成最终结果并渲染，提供实时的伦理可追溯机制与闭环反馈通道。
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: LLM Generation & Citations */}
              <div className="space-y-4">
                <h5 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <span>🧠</span> 1. 上下文合成与可追溯决策链
                </h5>

                <Card className="p-4 bg-muted/20 text-xs font-mono space-y-2">
                  <div className="font-semibold text-muted-foreground border-b pb-1">防幻觉 (Anti-Hallucination) 组装 Prompt 示例:</div>
                  <div className="p-2 bg-card rounded border border-border/40 text-[10px] leading-relaxed">
                    <strong>[System Instruction]:</strong> 你是智能餐厅助手。必须仅基于 [Context] 提供的信息进行推荐。如果证据不足或冲突，请作答风险警示，不可胡乱编造。
                  </div>
                  <div className="p-2 bg-card rounded border border-border/40 text-[10px] leading-relaxed">
                    <strong>[Context - Menu Index]:</strong> {JSON.stringify(retrievalData.menuResults[0])}
                  </div>
                  <div className="p-2 bg-card rounded border border-border/40 text-[10px] leading-relaxed">
                    <strong>[Context - History Index]:</strong> {JSON.stringify(retrievalData.historyResults[0])}
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-emerald-500 bg-emerald-500/[0.01]">
                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-emerald-600 flex items-center gap-1">
                      <span>👁️</span> 最终推荐链路与模型理由
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-sans text-xs">
                      {generationResult.reason}
                    </p>
                  </div>
                </Card>

                {generationResult.historyComments && (
                  <div className="space-y-1.5">
                    <span className="text-xs text-muted-foreground font-semibold">可追溯历史上下文引用 (Citations):</span>
                    <pre className="p-3 bg-muted text-[11px] leading-relaxed rounded-lg text-muted-foreground whitespace-pre-wrap font-sans border">
                      {generationResult.historyComments}
                    </pre>
                  </div>
                )}
              </div>

              {/* Right Column: Visual output and interactive feedback */}
              <div className="space-y-4">
                <h5 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <span>🍽️</span> 2. 最终精美决策展示与闭环反馈
                </h5>

                <Card className="p-5 border-2 border-primary/50 bg-gradient-to-br from-primary/[0.03] to-background">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">🍜</span>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{generationResult.finalDish}</h3>
                        <Badge className="text-xs">
                          {generationResult.isPersonalized ? "防风险个性化优先推荐" : "普通匹配推荐"}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2.5">
                      <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-primary" />
                        召回决策链归属依据:
                      </span>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded bg-muted/60 border border-border/40">
                          <span className="font-semibold text-foreground block mb-0.5">1. 静态事实依据 (Fact basis):</span>
                          该菜品温热不刺激，完全契合模糊输入中的“温暖”且不会加重“胃部不适”负担。
                        </div>
                        <div className="p-2.5 rounded bg-muted/60 border border-border/40">
                          <span className="font-semibold text-foreground block mb-0.5">2. 历史隐私依据 (Privacy preference):</span>
                          诊断出您在历史订单中对“麻辣火锅”的评价过低，在重排过滤层主动规避了该刺激性选项。
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Feedback Loop Integration */}
                <div className="space-y-3 pt-2">
                  <div>
                    <h6 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">3. 满意度极速反馈 (Feedback Loop)</h6>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      您的满意或踩贬反馈将立刻作为元数据记录，下一次离线 ETL 重新洗净、向量存储更新后，将更精准指导个性化推荐，完成无限增强闭环。
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 py-5 border hover:border-green-500 hover:bg-green-500/10 bg-transparent"
                      onClick={() => onFeedback?.(true)}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <ThumbsUp className="w-4 h-4 text-green-600" />
                        <span>推荐完美</span>
                      </div>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 py-5 border hover:border-red-500 hover:bg-red-500/10 bg-transparent"
                      onClick={() => onFeedback?.(false)}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <ThumbsDown className="w-4 h-4 text-rose-600" />
                        <span>不符胃部约束</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    const step = [
      { id: "A1", title: "🏗️ A1 数据提取 (Loader)" },
      { id: "A2", title: "🏗️ A2 数据清洗 (Cleaner)" },
      { id: "A3", title: "🏗️ A3 切块策略 (Chunking)" },
      { id: "A4", title: "🏗️ A4 向量化 (Embedding)" },
      { id: "A5", title: "🏗️ A5 索引建立 (Index Build)" },
      { id: "B1", title: "⚡ B1 用户输入 (Query Input)" },
      { id: "B2", title: "⚡ B2 查询诊断 (Pre-Retrieval)" },
      { id: "B3", title: "⚡ B3 查询转换 (Query Transform)" },
      { id: "B4", title: "⚡ B4 混合检索与重排 (Hybrid Search)" },
      { id: "B5", title: "⚡ B5 结果合成与交互输出 (Output)" },
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

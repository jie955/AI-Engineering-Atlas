"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, UserCheck, Play, RefreshCw, Cpu, Layers, Shield, Database, Lock, Eye } from "lucide-react"
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

// ----------------------------------------------------
// 风控模拟案例数据与类型
// ----------------------------------------------------
interface TransactionScenario {
  id: string
  name: string
  amount: string
  account: string
  recipient: string
  channel: string
  typeNotice: string
  subAgentScores: {
    aml: { score: number | null; reason: string; status: "success" | "error"; tool: string }
    pattern: { score: number | null; reason: string; status: "success" | "error"; tool: string }
    kyc: { score: number | null; reason: string; status: "success" | "error"; tool: string }
  }
}

const sampleTransactions: TransactionScenario[] = [
  {
    id: "tx-normal-001",
    name: "常规小额购物支付",
    amount: "¥ 50.00 CNY",
    account: "6222****8812 (张**)",
    recipient: "美团商户-餐饮结账",
    channel: "快捷支付 (App)",
    typeNotice: "预期：正常交易，评分较低，自动放行",
    subAgentScores: {
      aml: { score: 12, reason: "收款方为合法报备商户，无洗钱嫌疑黑名单匹配", status: "success", tool: "黑名单库 / UNSCR API" },
      pattern: { score: 18, reason: "交易金额符合该账户日常消费频次与金额区间", status: "success", tool: "交易历史特征库" },
      kyc: { score: 15, reason: "客户身份证与手机号认证通过，常住地设备发起", status: "success", tool: "KYC 档案中心" },
    },
  },
  {
    id: "tx-aml-high-002",
    name: "高危大额分批划转 (触发 AML 一票否决)",
    amount: "¥ 9,800,000.00 CNY",
    account: "6214****9901 (某离岸贸易公司)",
    recipient: "开曼群岛未知投资公司账户",
    channel: "网银大额转账",
    typeNotice: "预期：AML 子 Agent 评分 92 分 (≥90)，触发单项一票否决升级",
    subAgentScores: {
      aml: { score: 92, reason: "触发国际反洗钱高危预警：向离岸避税天堂高风险主体短时间内大额划转，且资金停留时间低于 5 分钟", status: "success", tool: "黑名单库 / 制裁名单 API" },
      pattern: { score: 75, reason: "交易金额显著超出历史月均交易额 400%", status: "success", tool: "交易历史特征库" },
      kyc: { score: 65, reason: "受益所有人 (UBO) 股权结构近期发生变动，未完全补全尽调材料", status: "success", tool: "KYC 档案中心" },
    },
  },
  {
    id: "tx-variance-003",
    name: "评价严重分歧 (触发评分方差过大升级)",
    amount: "¥ 1,200,000.00 CNY",
    account: "6225****3311 (李**)",
    recipient: "深圳某电子科技公司",
    channel: "网银转账",
    typeNotice: "预期：AML 20 分，模式 85 分，KYC 30 分，加权均分 45.25，但方差巨大触发风险升级",
    subAgentScores: {
      aml: { score: 20, reason: "收款方与付款方均不在制裁或观察名单中", status: "success", tool: "黑名单库" },
      pattern: { score: 85, reason: "凌晨 3:15 发起，且该账户此前 3 年内无任何单笔超 10 万转账记录，呈现典型盗刷模式", status: "success", tool: "交易历史特征库" },
      kyc: { score: 30, reason: "设备指纹验证通过，绑卡人人脸识别比对成功", status: "success", tool: "KYC 档案中心" },
    },
  },
  {
    id: "tx-timeout-004",
    name: "黑名单数据库超时 (触发降级升级机制)",
    amount: "¥ 300,000.00 CNY",
    account: "6217****5544 (王**)",
    recipient: "海外个人转账账户",
    channel: "跨境汇款",
    typeNotice: "预期：AML 工具调用失败返回'评估不可用'，Lead Agent 直接强制升级人工审核",
    subAgentScores: {
      aml: { score: null, reason: "调用外部黑名单 API 超过 2000ms 超时，系统无法确定反洗钱风险", status: "error", tool: "黑名单库 (超时/不可用)" },
      pattern: { score: 40, reason: "交易额略高于平日平均，处于可疑边界", status: "success", tool: "交易历史特征库" },
      kyc: { score: 25, reason: "KYC 年检材料在有效期内", status: "success", tool: "KYC 档案中心" },
    },
  },
]

export default function MultiAgentSystemPage() {
  const [activeAgent, setActiveAgent] = useState(0)

  // 风控模拟器 state
  const [selectedTxId, setSelectedTxId] = useState<string>("tx-aml-high-002")
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false)
  const [evalStep, setEvalStep] = useState<number>(0)
  const [humanApproved, setHumanApproved] = useState<boolean | null>(null)
  const [officerNote, setOfficerNote] = useState<string>("")

  const currentTx = sampleTransactions.find((t) => t.id === selectedTxId) || sampleTransactions[1]

  const handleRunEvaluation = () => {
    setIsEvaluating(true)
    setEvalStep(1)
    setHumanApproved(null)
    setOfficerNote("")

    setTimeout(() => setEvalStep(2), 600)
    setTimeout(() => {
      setEvalStep(3)
      setIsEvaluating(false)
    }, 1200)
  }

  // 计算 Lead Agent 逻辑
  const computeRiskDecision = (tx: TransactionScenario) => {
    const aml = tx.subAgentScores.aml
    const pattern = tx.subAgentScores.pattern
    const kyc = tx.subAgentScores.kyc

    // 1. 检查是否有工具不可用
    const hasToolFailure = aml.status === "error" || pattern.status === "error" || kyc.status === "error"
    if (hasToolFailure) {
      return {
        weightedScore: null,
        decision: "ESCALATE_HUMAN",
        ruleTriggered: "子 Agent 外部工具超时/故障降级",
        detail: "AML 子 Agent 调用外部黑名单库失败，出于安全守则，系统拒绝静默放行或使用缺省值，触发强制人工复核。",
        severity: "warning",
      }
    }

    const scoreAml = aml.score!
    const scorePattern = pattern.score!
    const scoreKyc = kyc.score!

    // 2. 检查一票否决 (任一 ≥ 90)
    const singleVeto = scoreAml >= 90 || scorePattern >= 90 || scoreKyc >= 90
    if (singleVeto) {
      const highestAgent = scoreAml >= 90 ? "反洗钱 Agent" : scorePattern >= 90 ? "异常模式 Agent" : "KYC Agent"
      const highestScore = Math.max(scoreAml, scorePattern, scoreKyc)
      return {
        weightedScore: Math.round(scoreAml * 0.4 + scorePattern * 0.35 + scoreKyc * 0.25),
        decision: "ESCALATE_HUMAN",
        ruleTriggered: "一票升级机制 (单项 ≥ 90 分)",
        detail: `${highestAgent} 给出 ${highestScore} 高分，触发硬性风险拦截规则，不考虑其他低分项的稀释，直接升级人工审签。`,
        severity: "danger",
      }
    }

    // 3. 计算加权分
    const weightedScore = Math.round(scoreAml * 0.4 + scorePattern * 0.35 + scoreKyc * 0.25)

    // 4. 检查评分方差过大 (最高分 - 最低分 ≥ 50)
    const scores = [scoreAml, scorePattern, scoreKyc]
    const maxScore = Math.max(...scores)
    const minScore = Math.min(...scores)
    const isHighVariance = maxScore - minScore >= 50

    if (isHighVariance) {
      return {
        weightedScore,
        decision: "ESCALATE_HUMAN",
        ruleTriggered: "评分方差过大预警 (极差 ≥ 50 分)",
        detail: `子 Agent 极差达到 ${maxScore - minScore} 分 (高分 ${maxScore}，低分 ${minScore})，表明存在维度间信息冲突，触发异常审查关卡。`,
        severity: "warning",
      }
    }

    // 5. 加权总分 ≥ 80
    if (weightedScore >= 80) {
      return {
        weightedScore,
        decision: "ESCALATE_HUMAN",
        ruleTriggered: "加权综合评分过高 (加权分 ≥ 80)",
        detail: `综合加权风险打分高达 ${weightedScore} 分，超越自动放行阈值，强制升级合规官审核。`,
        severity: "danger",
      }
    }

    // 6. 自动放行 (留痕)
    return {
      weightedScore,
      decision: "AUTO_PASS",
      ruleTriggered: "自动放行 (留痕归档)",
      detail: `加权评分 ${weightedScore} 分，未触发任何单项否决或异常预警。系统记录完整决策链供事后抽查，交易已放行。`,
      severity: "success",
    }
  }

  const decision = computeRiskDecision(currentTx)

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
        <Tabs defaultValue="compliance-risk" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compliance-risk">🛡️ 合规风控实战</TabsTrigger>
            <TabsTrigger value="overview">💡 系统概览</TabsTrigger>
            <TabsTrigger value="flow">🚀 协作流程</TabsTrigger>
            <TabsTrigger value="patterns">🔀 协作模式</TabsTrigger>
          </TabsList>

          {/* Compliance & Risk Control Tab */}
          <TabsContent value="compliance-risk" className="space-y-8">
            {/* Header / Intro */}
            <Card className="p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border-indigo-900 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold px-3 py-1">
                      银行级生产案例
                    </Badge>
                    <Badge variant="outline" className="border-indigo-400 text-indigo-200">
                      Multi-Agent
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white">合规风控多智能体系统</h2>
                  <p className="text-indigo-200 text-base mt-1">Multi-Agent Compliance & Risk Control System</p>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                  <ShieldAlert className="w-8 h-8 text-amber-400 shrink-0" />
                  <div className="text-xs text-indigo-100 leading-snug">
                    <div className="font-semibold text-white">实时监测 & 硬性门控</div>
                    <div>并行评估 • 一票升级 • 降级归档</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" /> 业务场景说明
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  银行交易实时监测系统：对每一笔交易<strong>并行调用</strong>多个专业化子 Agent 进行风险评估，由 <strong>Lead Agent</strong> 汇总打分。超过阈值或触发硬性规条的交易<strong>强制升级人工合规官审核</strong>。
                </p>
              </div>
            </Card>

            {/* Architecture Flow Section */}
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-primary" /> 架构流程图 (Architecture Flow)
              </h3>
              <p className="text-muted-foreground mb-6 text-sm">
                三个专业化子 Agent 并行发起评估，避免排队时延与相互判断污染。Lead Agent 依据加权分与一票否决硬约束统一判定。
              </p>

              <div className="bg-slate-950 text-slate-100 p-6 rounded-xl border border-slate-800 font-mono text-sm overflow-x-auto leading-relaxed">
                <div className="text-emerald-400 font-bold mb-2">{"// 交易事件实时评估通道"}</div>
                <div className="text-slate-300">
                  交易事件输入 (Transaction Event)
                  <br />
                  {"  │"}
                  <br />
                  {"  ├─► "}
                  <span className="text-amber-400 font-semibold">反洗钱检测 Agent (AML Agent)</span>
                  <span className="text-slate-400"> [权重 40%]</span>
                  <br />
                  {"  ├─► "}
                  <span className="text-cyan-400 font-semibold">异常交易模式 Agent (Pattern Agent)</span>
                  <span className="text-slate-400"> [权重 35%]</span>
                  <br />
                  {"  ├─► "}
                  <span className="text-indigo-400 font-semibold">KYC 尽调 Agent (KYC Agent)</span>
                  <span className="text-slate-400"> [权重 25%]</span>
                  <br />
                  {"  │        "}
                  <span className="text-emerald-500 font-sans italic">(三者并行独立执行，无顺序依赖)</span>
                  <br />
                  {"  ▼"}
                  <br />
                  <span className="text-purple-400 font-bold">Lead Agent 汇总决策引擎</span>
                  <br />
                  {"  │"}
                  <br />
                  {"  ├─ 加权总分 ≥ 80 分 ──────────► "}
                  <span className="text-rose-400 font-semibold">强制人工复核 (Escalate)</span>
                  <br />
                  {"  ├─ 任一子 Agent 单项 ≥ 90 分 ─► "}
                  <span className="text-rose-400 font-semibold">一票升级拦截 (Single Veto)</span>
                  <br />
                  {"  ├─ 子 Agent 工具调用失败 ────► "}
                  <span className="text-amber-400 font-semibold">降级安全审查 (Fallback Audit)</span>
                  <br />
                  {"  └─ 均未触发 ─────────────────► "}
                  <span className="text-emerald-400 font-semibold">自动放行 (Auto Pass + Audit Trail)</span>
                </div>
              </div>
            </Card>

            {/* Interactive Simulator */}
            <Card className="p-8 border-2 border-primary/20 bg-card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/30">
                    Interactive Playground
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">实时交易风控模拟引擎</h3>
                  <p className="text-muted-foreground text-sm">选择不同的典型交易场景，体验 Multi-Agent 并行评估与 Lead Agent 的降级门控逻辑。</p>
                </div>

                <Button onClick={handleRunEvaluation} disabled={isEvaluating} className="shrink-0 gap-2 font-semibold">
                  {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {isEvaluating ? "并行评估中..." : "重新运行当前交易评估"}
                </Button>
              </div>

              {/* Scenario selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {sampleTransactions.map((tx) => (
                  <Card
                    key={tx.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      selectedTxId === tx.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => {
                      setSelectedTxId(tx.id)
                      setHumanApproved(null)
                      setOfficerNote("")
                      setEvalStep(3)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-muted-foreground">{tx.id}</span>
                      {selectedTxId === tx.id && <Badge className="text-[10px] px-1.5 py-0">当前选择</Badge>}
                    </div>
                    <div className="font-bold text-sm text-foreground mb-1 leading-snug">{tx.name}</div>
                    <div className="text-xs font-mono text-primary font-semibold">{tx.amount}</div>
                    <div className="mt-2 text-[11px] text-muted-foreground border-t border-hairline pt-2 line-clamp-2">
                      {tx.typeNotice}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Transaction details banner */}
              <div className="bg-muted/60 p-5 rounded-xl border border-border mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">交易单号号/账户</div>
                  <div className="font-mono font-medium text-foreground">{currentTx.account}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">交易金额与通道</div>
                  <div className="font-mono font-bold text-primary">{currentTx.amount}</div>
                  <div className="text-xs text-muted-foreground">{currentTx.channel}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">收款方名称</div>
                  <div className="font-medium text-foreground">{currentTx.recipient}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">提示预估策略</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">{currentTx.typeNotice}</div>
                </div>
              </div>

              {/* Parallel Sub-Agent Execution Cards */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> 子 Agent 并行风险打分面板 (Parallel Sub-Agents)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* AML Agent */}
                  <Card className="p-5 border-l-4 border-l-amber-500 bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-foreground">反洗钱检测 Agent</div>
                        <div className="text-xs text-muted-foreground">权重 40% • AML Agent</div>
                      </div>
                      {currentTx.subAgentScores.aml.status === "error" ? (
                        <Badge variant="destructive">超时/不可用</Badge>
                      ) : (
                        <div className="text-2xl font-black font-mono text-amber-500">
                          {currentTx.subAgentScores.aml.score} <span className="text-xs font-normal text-muted-foreground">分</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-2 text-muted-foreground">
                      <div className="p-2 bg-muted rounded text-foreground leading-relaxed">
                        {currentTx.subAgentScores.aml.reason}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                        <Database className="w-3.5 h-3.5 text-primary" />
                        工具: {currentTx.subAgentScores.aml.tool}
                      </div>
                    </div>
                  </Card>

                  {/* Pattern Agent */}
                  <Card className="p-5 border-l-4 border-l-cyan-500 bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-foreground">异常交易模式 Agent</div>
                        <div className="text-xs text-muted-foreground">权重 35% • Pattern Agent</div>
                      </div>
                      {currentTx.subAgentScores.pattern.status === "error" ? (
                        <Badge variant="destructive">不可用</Badge>
                      ) : (
                        <div className="text-2xl font-black font-mono text-cyan-500">
                          {currentTx.subAgentScores.pattern.score} <span className="text-xs font-normal text-muted-foreground">分</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-2 text-muted-foreground">
                      <div className="p-2 bg-muted rounded text-foreground leading-relaxed">
                        {currentTx.subAgentScores.pattern.reason}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                        <Database className="w-3.5 h-3.5 text-primary" />
                        工具: {currentTx.subAgentScores.pattern.tool}
                      </div>
                    </div>
                  </Card>

                  {/* KYC Agent */}
                  <Card className="p-5 border-l-4 border-l-indigo-500 bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-foreground">KYC 尽调 Agent</div>
                        <div className="text-xs text-muted-foreground">权重 25% • KYC Agent</div>
                      </div>
                      {currentTx.subAgentScores.kyc.status === "error" ? (
                        <Badge variant="destructive">不可用</Badge>
                      ) : (
                        <div className="text-2xl font-black font-mono text-indigo-500">
                          {currentTx.subAgentScores.kyc.score} <span className="text-xs font-normal text-muted-foreground">分</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-2 text-muted-foreground">
                      <div className="p-2 bg-muted rounded text-foreground leading-relaxed">
                        {currentTx.subAgentScores.kyc.reason}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                        <Database className="w-3.5 h-3.5 text-primary" />
                        工具: {currentTx.subAgentScores.kyc.tool}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Lead Agent Final Decision Output */}
              <div className="p-6 rounded-xl border-2 border-primary/30 bg-primary/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <Badge variant="outline" className="mb-1 border-primary text-primary font-mono text-xs">
                      Lead Agent Decision Engine
                    </Badge>
                    <h4 className="text-xl font-bold text-foreground">Lead Agent 最终决策与合规路由</h4>
                  </div>

                  <div className="flex items-center gap-3">
                    {decision.weightedScore !== null && (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">综合加权得分</div>
                        <div className="text-2xl font-black font-mono text-foreground">{decision.weightedScore} / 100</div>
                      </div>
                    )}

                    {decision.decision === "ESCALATE_HUMAN" ? (
                      <Badge className="bg-rose-600 hover:bg-rose-700 text-white text-sm px-3 py-1.5 gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> 强制升级人工审核
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-1.5 gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> 自动放行 (留痕)
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-background rounded-lg border border-border text-sm">
                    <div className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" /> 触发判定规则：{decision.ruleTriggered}
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{decision.detail}</p>
                  </div>

                  {/* Escalate Action Flow */}
                  {decision.decision === "ESCALATE_HUMAN" && (
                    <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-4">
                      <div className="flex items-start gap-3">
                        <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                            合规官人工复核关卡 (Mandatory Compliance Approval Gate)
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            该交易在自动化系统中已锁死卡住，系统拒绝继续流转，等待持牌合规官签字后方可放行或挂起。
                          </p>
                        </div>
                      </div>

                      {humanApproved === null ? (
                        <div className="space-y-3 pt-2 border-t border-amber-500/20">
                          <input
                            type="text"
                            placeholder="请输入合规复核备注（如：已核对客户电话，确认系合法购房转账...）"
                            value={officerNote}
                            onChange={(e) => setOfficerNote(e.target.value)}
                            className="w-full text-xs p-2.5 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                              onClick={() => setHumanApproved(true)}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 合规官审核通过 (Approve)
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="font-semibold text-xs"
                              onClick={() => setHumanApproved(false)}
                            >
                              <ShieldAlert className="w-3.5 h-3.5 mr-1" /> 拒绝并冻结交易 (Reject & Freeze)
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded bg-background border border-border text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {humanApproved ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span>
                              <strong>审核结果：</strong> {humanApproved ? "合规官已人工批准放行" : "合规官已拒绝并冻结交易账户"}
                              {officerNote && <span className="text-muted-foreground ml-2">(备注: {officerNote})</span>}
                            </span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setHumanApproved(null)}>
                            重新审核
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Atlas Node Mapping */}
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" /> 关联 Atlas 节点 (Atlas Mapping)
              </h3>
              <p className="text-muted-foreground text-sm mb-6">该合规风控案例展示了 Atlas 架构图谱中多个关键模块的协同落地：</p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="p-3 font-semibold text-foreground w-1/3">Atlas 架构节点</th>
                      <th className="p-3 font-semibold text-foreground">风控案例对应设计</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium text-foreground flex items-center gap-2">
                        <Badge variant="outline">多智能体协作系统</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">三个专业化子 Agent (AML / Pattern / KYC) + Lead Agent 汇总编排</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">
                        <Badge variant="outline">Function Calling / MCP 工程</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">各子 Agent 调用黑名单库、交易历史库、KYC 档案等外部工具</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">
                        <Badge variant="outline">结构化输出与类型安全</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">每个子 Agent 必须返回结构化评分 (数值 + 理由字段)，不能是自由文本</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">
                        <Badge variant="outline">Harness Engineering</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">子 Agent 工具调用失败或置信度低时的降级策略与安全门控</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Key Engineering Points */}
            <Card className="p-8 border-border">
              <h3 className="text-2xl font-bold text-foreground mb-6">工程要点 (Key Engineering Points)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Badge>1</Badge> 并行而非串行
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    三个子 Agent 同时接收交易数据独立评估，不互相等待，缩短端到端响应时间，也避免前一个 Agent 的偏差污染后一个 Agent 的判断。
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Badge>2</Badge> 加权汇总 + 一票否决双机制
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    仅用加权平均容易被低分项"稀释"掉某个致命信号，必须叠加"单项超阈值即升级"的硬性规则，这是风控场景与普通推荐类多 Agent 系统的关键区别。
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Badge>3</Badge> 人工复核关卡是架构里不可跳过的一环
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    不是可选的兜底措施，而是明确写进流程图的强制节点，超过阈值的交易在自动化系统里"卡住"，必须有人签字才能继续。
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Badge>4</Badge> 留痕而非静默放行
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    未触发升级的交易仍需记录完整的评分依据，供事后合规抽查，而不是"通过了就不留任何痕迹"。
                  </p>
                </div>
              </div>
            </Card>

            {/* Failure Modes Section */}
            <Card className="p-8 border-amber-500/30 bg-amber-500/5">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" /> 失败模式 (需在实现中显式处理)
              </h3>

              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="font-semibold text-foreground mb-1">
                    1. 外部工具超时或调用失败 (Tool Failure)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    某个子 Agent 调用外部工具 (如黑名单库) 超时或失败 → 该子 Agent 应返回<strong>"评估不可用"</strong>而非静默给出默认分，Lead Agent 收到"不可用"信号时应<strong>直接触发人工复核</strong>，而非按缺省值继续计算加权分。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="font-semibold text-foreground mb-1">
                    2. 子 Agent 评分极大分歧 (Rating Discrepancy)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    三个子 Agent 评分出现较大分歧 (如一个给 20 分、一个给 85 分) → 即使加权平均不高，系统设置了<strong>"评分方差过大"</strong>作为独立的升级触发条件。
                  </p>
                </div>
              </div>
            </Card>

            {/* Disclaimer */}
            <div className="p-4 rounded-xl bg-muted/80 border border-border text-xs text-muted-foreground flex items-start gap-3">
              <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">免责声明: </strong>
                本案例为工程架构教学演示，评分逻辑、权重与阈值均为简化示例，不构成真实合规系统的实施标准，实际部署需结合具体监管要求与机构风控政策设计。
              </div>
            </div>
          </TabsContent>

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
                            {agent.role.match(/\((.*)\)/)?.[1]}
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

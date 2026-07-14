"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, ChevronRight } from "lucide-react"

type RiskItem = { level: string; issue: string; mitigation?: string }
type FlowStep = {
  id: number
  phase: string
  title: string
  duration: number
  input?: string
  action: string
  details: Record<string, any>
  cost: Record<string, number>
  risk: { items: RiskItem[]; overall: string }
}

const scenarios: Record<string, { name: string; description: string; query: string; icon: string }> = {
  ecommerce: {
    name: "电商订单查询",
    description: "用户查询订单物流信息和预计到达时间",
    query: "我要查一下订单#ORD-20240115-001的最新物流信息和预计到达时间",
    icon: "📦",
  },
  customer_service: {
    name: "客服智能问答",
    description: "用户提出关于产品政策的多个问题",
    query: "我的套餐支持多少个用户？升级到企业版需要多少钱？有免费试用吗？",
    icon: "🎧",
  },
  financial: {
    name: "金融产品咨询",
    description: "用户咨询理财产品信息并计算收益",
    query: "帮我找一个风险等级为中等、年化收益率在5-7%的理财产品，并计算投资10万元的预期收益",
    icon: "📈",
  },
}

const flows: Record<string, { steps: FlowStep[] }> = {
  ecommerce: {
    steps: [
      {
        id: 1,
        phase: "OBSERVE 观察与解析",
        title: "步骤1：接收用户输入",
        duration: 1,
        input: scenarios.ecommerce.query,
        action: "Agent 读取用户消息，准备处理",
        details: {
          question: "这个查询需要什么信息？",
          analysis: [
            "用户意图: 查询订单状态",
            "提取实体: 订单号 = ORD-20240115-001",
            "需要信息: 物流信息 + 预计到达时间",
            "数据源: 需要 1 个综合 API",
          ],
        },
        cost: { input: 120, reasoning: 180, total: 300 },
        risk: { items: [], overall: "低" },
      },
      {
        id: 2,
        phase: "REASON 推理与规划",
        title: "步骤2：选择执行策略",
        duration: 1.8,
        action: "Agent 评估不同工具并制定执行计划",
        details: {
          question: "用哪个工具获取数据？",
          options: [
            { name: "OrderAPI (综合查询)", score: 0.96, time: "中", cost: "低", reason: "一次调用获得所有信息" },
            { name: "OrderAPI + LogisticsAPI", score: 0.92, time: "长", cost: "高", reason: "冗余但有保险" },
            { name: "WebSearch (网络搜索)", score: 0.15, time: "长", cost: "中", reason: "不可靠，不推荐" },
          ],
          chosen: "OrderAPI (综合查询)",
          reasoning: "OrderAPI 能一次性获得完整信息，平衡了速度和成本",
        },
        cost: { analysis: 450, selection: 250, total: 700 },
        risk: { items: [{ level: "中", issue: "API 宕机无备选", mitigation: "添加重试逻辑" }], overall: "中" },
      },
      {
        id: 3,
        phase: "ACT 行动执行",
        title: "步骤3：调用 OrderAPI",
        duration: 2.5,
        action: "Agent 发送 API 请求获取订单数据",
        details: {
          request: {
            endpoint: "POST /api/v2/orders/search",
            params: { order_id: "ORD-20240115-001", include_logistics: true, include_timeline: true },
          },
          response: {
            data: {
              order_id: "ORD-20240115-001",
              status: "已发货",
              logistics: {
                carrier: "顺丰速运",
                tracking_no: "SF123456789",
                current_location: "上海分拨中心",
                estimated_arrival: "2024-01-17 18:00",
                progress: 78,
              },
            },
          },
          timing: "380ms",
        },
        cost: { request: 150, response: 620, parse: 100, total: 870 },
        risk: {
          items: [
            { level: "高", issue: "订单不存在返回 404", mitigation: "已处理，订单存在" },
            { level: "中", issue: "API 超时", mitigation: "响应正常，耗时 380ms" },
          ],
          overall: "低",
        },
      },
      {
        id: 4,
        phase: "JUDGE 判断与决策",
        title: "步骤4：验证数据完整性",
        duration: 1.2,
        action: "Agent 检查 API 返回的数据是否满足用户需求",
        details: {
          analysis: ["是否获取到订单信息? 是", "是否包含物流信息? 是", "是否包含预计时间? 是", "数据是否足够新鲜? 是"],
          summary: "数据完整，可以回复用户",
        },
        cost: { validation: 280, decision: 120, total: 400 },
        risk: { items: [], overall: "低" },
      },
      {
        id: 5,
        phase: "SYNTHESIZE 综合与生成",
        title: "步骤5：组织信息并生成回复",
        duration: 2,
        action: "Agent 整合数据，生成用户友好的回复",
        details: {
          output: `订单号：ORD-20240115-001
订单状态：已发货

物流详情：
快递公司：顺丰速运
单号：SF123456789
当前位置：上海分拨中心
进度：▓▓▓▓▓▓▓░░░ (78%)

预计到达时间：2024-01-17 下午 18:00
距离送达还有 26 小时`,
        },
        cost: { context: 620, generation: 150, formatting: 80, total: 850 },
        risk: { items: [], overall: "低" },
      },
      {
        id: 6,
        phase: "COMPLETE 完成",
        title: "步骤6：返回结果给用户",
        duration: 0.5,
        action: "Agent 发送最终回复，流程完成",
        details: {
          summary: "成功为用户提供订单物流信息",
          metrics: { totalTime: "8.0秒", totalTokens: "3820", apiCalls: "1", successRate: "100%" },
        },
        cost: { output: 150, total: 150 },
        risk: { items: [], overall: "低" },
      },
    ],
  },
  customer_service: {
    steps: [
      {
        id: 1,
        phase: "OBSERVE 观察与解析",
        title: "步骤1：接收用户输入",
        duration: 1,
        input: scenarios.customer_service.query,
        action: "Agent 解析多个问题",
        details: {
          question: "用户提出了几个问题？",
          analysis: [
            "问题1: 套餐支持多少用户？",
            "问题2: 企业版升级价格？",
            "问题3: 有免费试用吗？",
            "任务类型: 多问题回答",
          ],
        },
        cost: { input: 180, reasoning: 220, total: 400 },
        risk: { items: [{ level: "低", issue: "多个相关问题可能相互干扰" }], overall: "低" },
      },
      {
        id: 2,
        phase: "REASON 推理与规划",
        title: "步骤2：制定多步骤计划",
        duration: 2,
        action: "Agent 为每个问题分别规划答案",
        details: {
          analysis: ["步骤A: 查询 FAQ 库回答问题1", "步骤B: 查询定价系统回答问题2", "步骤C: 查询试用政策回答问题3"],
          reasoning: "Plan-Execute 模式：先制定计划，再逐步执行",
        },
        cost: { planning: 500, optimization: 300, total: 800 },
        risk: { items: [{ level: "中", issue: "需要多个 API，成本较高", mitigation: "但保证完整性" }], overall: "中" },
      },
      {
        id: 3,
        phase: "ACT 行动执行",
        title: "步骤3A：查询 FAQ 库",
        duration: 2,
        action: "Agent 搜索关于用户限制的常见问题",
        details: { summary: "基础版: 5用户 | 专业版: 20用户 | 企业版: 无限用户" },
        cost: { search: 200, retrieval: 300, total: 500 },
        risk: { items: [], overall: "低" },
      },
      {
        id: 4,
        phase: "ACT 行动执行",
        title: "步骤3B：查询定价系统",
        duration: 2,
        action: "Agent 获取企业版价格信息",
        details: { summary: "企业版: ¥299/月 | 专业版升级折扣: 9折优惠" },
        cost: { search: 150, retrieval: 280, total: 430 },
        risk: { items: [], overall: "低" },
      },
      {
        id: 5,
        phase: "ACT 行动执行",
        title: "步骤3C：查询试用政策",
        duration: 2,
        action: "Agent 查找免费试用相关信息",
        details: { summary: "免费试用: 14天 | 全功能体验 | 无需信用卡" },
        cost: { search: 120, retrieval: 260, total: 380 },
        risk: { items: [], overall: "低" },
      },
      {
        id: 6,
        phase: "SYNTHESIZE 综合与生成",
        title: "步骤4：整合三个问题的答案",
        duration: 2.5,
        action: "Agent 生成结构化回复",
        details: {
          output: `关于套餐用户数：
• 基础版：最多 5 个用户
• 专业版：最多 20 个用户
• 企业版：无限用户 (推荐升级)

企业版升级价格：
• 企业版价格：¥299/月
• 升级享 9折优惠

免费试用：
• 试用时长：14 天，全功能体验，无需信用卡`,
        },
        cost: { synthesis: 800, generation: 280, formatting: 100, total: 1180 },
        risk: { items: [], overall: "低" },
      },
      {
        id: 7,
        phase: "COMPLETE 完成",
        title: "步骤5：返回完整回复",
        duration: 0.5,
        action: "Agent 完成用户查询",
        details: {
          summary: "成功回答用户的三个问题",
          metrics: { totalTime: "10.0秒", totalTokens: "5690", apiCalls: "3", successRate: "100%" },
        },
        cost: { output: 280, total: 280 },
        risk: { items: [], overall: "低" },
      },
    ],
  },
  financial: {
    steps: [
      {
        id: 1,
        phase: "OBSERVE 观察与解析",
        title: "步骤1：接收用户输入",
        duration: 1.2,
        input: scenarios.financial.query,
        action: "Agent 解析复杂的理财咨询",
        details: {
          analysis: [
            "约束条件: 中等风险",
            "目标收益: 5-7% 年化收益率",
            "投资额: ¥100,000",
            "需要: 产品推荐 + 收益计算",
            "复杂度: 高 (需要多步推理)",
          ],
        },
        cost: { input: 200, reasoning: 320, total: 520 },
        risk: { items: [{ level: "高", issue: "金融建议需谨慎，可能涉及风险免责声明" }], overall: "高" },
      },
      {
        id: 2,
        phase: "REASON 推理与规划",
        title: "步骤2：构建搜索策略",
        duration: 2.2,
        action: "Agent 制定多步搜索和计算计划",
        details: {
          analysis: [
            "1. 在产品库中搜索符合条件的产品",
            "2. 筛选中等风险等级的产品",
            "3. 过滤年化收益率在 5-7% 的产品",
            "4. 计算 ¥100,000 投资的预期收益",
            "5. 比较产品费率和风险",
          ],
          reasoning: "Tree-of-Thoughts (探索多个选择方案)",
        },
        cost: { planning: 680, consideration: 450, total: 1130 },
        risk: {
          items: [
            { level: "高", issue: "需要准确的产品数据", mitigation: "需要多源验证" },
            { level: "中", issue: "历史数据可能不代表未来", mitigation: "添加风险提示" },
          ],
          overall: "高",
        },
      },
      {
        id: 3,
        phase: "ACT 行动执行",
        title: "步骤3：搜索产品库",
        duration: 2.5,
        action: "Agent 在产品库中查找匹配的理财产品",
        details: {
          analysis: [
            "中等收益定期理财-6个月: 5.8% | 费率 0.1%",
            "均衡混合基金: 6.2% | 费率 0.5%",
            "债券+股票组合: 6.5% | 费率 0.3%",
          ],
        },
        cost: { search: 300, filter: 200, retrieval: 400, total: 900 },
        risk: { items: [], overall: "中" },
      },
      {
        id: 4,
        phase: "ACT 行动执行",
        title: "步骤4：计算预期收益",
        duration: 2,
        action: "Agent 为每个产品计算投资回报 (本金 ¥100,000)",
        details: {
          analysis: [
            "定期理财: 净收益 ¥2,670 (180天)",
            "混合基金: 净收益 ¥5,900/年",
            "债券+股票: 净收益 ¥6,200/年",
          ],
        },
        cost: { calculation: 500, analysis: 350, total: 850 },
        risk: { items: [{ level: "中", issue: "计算基于历史数据", mitigation: "已注明风险" }], overall: "中" },
      },
      {
        id: 5,
        phase: "JUDGE 判断与决策",
        title: "步骤5：排序和推荐",
        duration: 1.8,
        action: "Agent 比较产品并排出推荐优先级",
        details: {
          analysis: [
            "第1名: 债券+股票组合 - 收益最高(6.2%)，风险适中",
            "第2名: 均衡混合基金 - 收益稳定(5.9%)，流动性好",
            "第3名: 中等收益定期理财 - 稳妥但收益低(5.7%)",
          ],
        },
        cost: { ranking: 280, comparison: 220, total: 500 },
        risk: { items: [], overall: "低" },
      },
      {
        id: 6,
        phase: "SYNTHESIZE 综合与生成",
        title: "步骤6：生成专业回复",
        duration: 2.5,
        action: "Agent 整合分析结果，生成建议",
        details: {
          output: `产品推荐（按推荐度排序）

第1推荐：债券+股票组合
• 预期年化收益：6.5% | 净收益：¥6,200/年
• 期限：1年 | 风险等级：中等

第2推荐：均衡混合基金
• 预期年化收益：6.2% | 净收益：¥5,900/年
• 期限：随时可赎回 | 风险等级：中等

重要风险提示：本建议基于历史数据，投资有风险，请谨慎决策。`,
        },
        cost: { synthesis: 900, generation: 380, formatting: 120, total: 1400 },
        risk: { items: [], overall: "低" },
      },
      {
        id: 7,
        phase: "COMPLETE 完成",
        title: "步骤7：返回专业建议",
        duration: 0.5,
        action: "Agent 完成理财咨询",
        details: {
          summary: "为用户提供了三个理财产品方案和详细分析",
          metrics: { totalTime: "12.7秒", totalTokens: "8390", apiCalls: "2", successRate: "100%" },
        },
        cost: { output: 280, total: 280 },
        risk: { items: [], overall: "低" },
      },
    ],
  },
}

const costModels: Record<string, { name: string; rate: number }> = {
  gpt4: { name: "GPT-4o", rate: 0.000015 },
  claude: { name: "Claude 3.5", rate: 0.000011 },
  local: { name: "本地部署", rate: 0 },
}

const riskStyles: Record<string, string> = {
  低: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  中: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
  高: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
}

export function AgentCompleteFlow() {
  const [scenarioId, setScenarioId] = useState("ecommerce")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [speed, setSpeed] = useState(1.5)
  const [selectedModel, setSelectedModel] = useState("gpt4")

  const flow = flows[scenarioId]
  const scenario = scenarios[scenarioId]
  const currentFlowStep = flow.steps[currentStep]
  const model = costModels[selectedModel]

  const stepsUpToNow = flow.steps.slice(0, currentStep + 1)
  const totalTokens = stepsUpToNow.reduce((sum, s) => sum + s.cost.total, 0)
  const totalCost = selectedModel === "local" ? 0 : totalTokens * model.rate

  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(() => {
      if (currentStep < flow.steps.length - 1) {
        setCurrentStep((s) => s + 1)
      } else {
        setIsPlaying(false)
      }
    }, (currentFlowStep.duration * 1000) / speed)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, speed, currentFlowStep.duration, flow.steps.length])

  const resetFlow = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      {/* Scenario selection */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">选择业务场景</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(scenarios).map(([key, scen]) => (
            <button
              key={key}
              onClick={() => {
                setScenarioId(key)
                resetFlow()
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                scenarioId === key
                  ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              <p className="text-2xl mb-2">{scen.icon}</p>
              <p className="font-bold text-foreground">{scen.name}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{scen.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Query + Controls */}
      <Card className="p-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">用户查询</p>
          <p className="text-base text-foreground bg-muted p-3 rounded-lg border border-border">
            {`"${scenario.query}"`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-4">
          <Button onClick={() => setIsPlaying(!isPlaying)} className="gap-2">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "暂停" : "开始"}
          </Button>
          <Button onClick={resetFlow} variant="secondary" className="gap-2">
            <RotateCcw className="w-4 h-4" /> 重置
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">速度</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(Number.parseFloat(e.target.value))}
              className="w-20 accent-primary"
            />
            <span className="text-sm text-foreground tabular-nums">{speed}x</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">模型</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-background border border-border rounded px-3 py-1.5 text-sm text-foreground"
            >
              <option value="gpt4">GPT-4o</option>
              <option value="claude">Claude 3.5</option>
              <option value="local">本地部署</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-muted-foreground">
            步骤 {currentStep + 1} / {flow.steps.length}
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / flow.steps.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Steps */}
      <div className="space-y-3">
        {flow.steps.map((step, idx) => {
          const isActive = idx === currentStep
          const isCompleted = idx < currentStep

          return (
            <Card
              key={step.id}
              onClick={() => {
                setCurrentStep(idx)
                setIsPlaying(false)
              }}
              className={`overflow-hidden cursor-pointer transition-all ${
                isActive
                  ? "border-primary ring-2 ring-primary/30"
                  : isCompleted
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "hover:border-primary/40"
              }`}
            >
              <div className="p-4 flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{step.phase}</p>
                  <h4 className="font-bold text-foreground truncate">{step.title}</h4>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{step.cost.total} tokens</p>
                  <p className="text-xs text-muted-foreground">{step.duration}s</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isActive ? "rotate-90" : ""}`} />
              </div>

              {isActive && (
                <div className="border-t border-border bg-muted/30 p-4 space-y-4">
                  {step.input && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">用户输入</p>
                      <div className="bg-card p-3 rounded border border-border text-sm text-foreground">
                        {`"${step.input}"`}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">{step.action}</p>
                    {step.details.question && (
                      <p className="text-primary font-semibold text-sm mb-2">{step.details.question}</p>
                    )}
                    {step.details.analysis && (
                      <ul className="space-y-1 text-sm text-foreground mb-2">
                        {step.details.analysis.map((item: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.details.options && (
                      <div className="space-y-2 mb-2">
                        {step.details.options.map((opt: any, i: number) => (
                          <div
                            key={i}
                            className={`p-2 rounded text-sm border ${
                              opt.name === step.details.chosen
                                ? "bg-emerald-500/10 border-emerald-500/40"
                                : "bg-card border-border"
                            }`}
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold text-foreground">{opt.name}</span>
                              <span className={opt.score > 0.8 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                                {(opt.score * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{opt.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.details.reasoning && (
                      <p className="text-sm text-muted-foreground italic mb-2">{step.details.reasoning}</p>
                    )}
                    {step.details.request && (
                      <div className="bg-card p-3 rounded border border-border text-xs font-mono text-foreground mb-2 overflow-x-auto">
                        <div className="text-primary">{step.details.request.endpoint}</div>
                        <pre className="text-muted-foreground mt-1">{JSON.stringify(step.details.request.params, null, 2)}</pre>
                      </div>
                    )}
                    {step.details.response && (
                      <div className="bg-emerald-500/5 border border-emerald-500/30 p-3 rounded text-xs mb-2 overflow-x-auto">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold mb-1">API Response (200 OK)</div>
                        <pre className="text-foreground">{JSON.stringify(step.details.response.data, null, 2)}</pre>
                      </div>
                    )}
                    {step.details.output && (
                      <div className="bg-card p-3 rounded border border-border text-sm text-foreground whitespace-pre-wrap max-h-60 overflow-y-auto mb-2">
                        {step.details.output}
                      </div>
                    )}
                    {step.details.summary && (
                      <p className="text-sm text-foreground bg-card p-3 rounded border border-border">{step.details.summary}</p>
                    )}
                    {step.details.metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
                        {Object.entries(step.details.metrics).map(([key, val]) => (
                          <div key={key} className="bg-card p-2 rounded border border-border">
                            <p className="text-muted-foreground">{key}</p>
                            <p className="text-primary font-bold">{val as string}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cost breakdown */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded p-3">
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">成本分解</p>
                    <div className="space-y-1 text-xs text-foreground">
                      {Object.entries(step.cost).map(([key, val]) => {
                        if (key === "total") return null
                        return (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground">{key}</span>
                            <span className="text-amber-600 dark:text-amber-400">{val} tokens</span>
                          </div>
                        )
                      })}
                      <div className="border-t border-border pt-1 mt-1 flex justify-between font-bold">
                        <span>小计</span>
                        <span className="text-amber-600 dark:text-amber-400">{step.cost.total} tokens</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk */}
                  <div className={`border rounded p-3 ${riskStyles[step.risk.overall]}`}>
                    <p className="text-sm font-semibold mb-2">风险等级: {step.risk.overall}</p>
                    {step.risk.items.length > 0 && (
                      <ul className="space-y-1 text-xs text-foreground">
                        {step.risk.items.map((risk, i) => (
                          <li key={i}>
                            <span className="font-semibold">{risk.level}:</span> {risk.issue}
                            {risk.mitigation && <span className="text-muted-foreground"> → {risk.mitigation}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      {currentStep === flow.steps.length - 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">总耗时</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {flow.steps.reduce((sum, s) => sum + s.duration, 0).toFixed(1)}s
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">总 Token</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalTokens}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">预估成本 ({model.name})</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {selectedModel === "local" ? "服务器成本" : `¥${totalCost.toFixed(4)}`}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">成功率</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">100%</p>
          </Card>
        </div>
      )}
    </div>
  )
}

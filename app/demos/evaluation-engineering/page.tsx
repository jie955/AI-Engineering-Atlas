"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AtlasTechniqueCarrier } from "@/components/atlas-technique-carrier"
import { ActivePromptPlayground } from "@/components/active-prompt-playground"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"
import { useToast } from "@/components/ui/use-toast"
import {
  ShieldAlert,
  CheckCircle,
  Code,
  RefreshCw,
  Play,
  Terminal,
  Activity,
  Award,
  AlertTriangle,
  FileText,
  Brain,
  History,
  GitBranch,
  Timer,
  ChevronRight
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

const sampleTrajectories = [
  {
    id: "traj-success",
    name: "例 1：成功闭环任务",
    description: "Agent 接收查找并汇总用户账单请求，自主调用账单 API 过滤成功后，进行格式化总结。",
    steps: [
      { role: "User", content: "帮我查询上个月超过 500 元的账单，并简短总结。" },
      { role: "Agent (Thought)", content: "用户需要查询上月超过 500 元的账单。我需要调用 get_bills_api 并设置过滤参数。" },
      { role: "Agent (Call)", tool: "get_bills_api", args: { limit: 100, month: "previous" } },
      { role: "System (Observe)", result: JSON.stringify([{ id: 1, amount: 680, desc: "云服务器续费", date: "2026-06-15" }, { id: 2, amount: 120, desc: "下午茶外卖", date: "2026-06-18" }]) },
      { role: "Agent (Thought)", content: "API 返回了 2 笔账单。其中云服务器续费（680元）超过 500 元，下午茶外卖（120元）未超过。我需要将超额结果返回给用户。" },
      { role: "Agent (Response)", content: "为您查询到上个月超过 500 元的账单共 1 笔：\n\n- **云服务器续费**：680 元（2026-06-15）\n\n其他账单金额均低于 500 元限制。" }
    ],
    expectedScore: { faithfulness: 1.0, answer_relevance: 1.0, tool_efficiency: 1.0 }
  },
  {
    id: "traj-hallucination",
    name: "例 2：幻觉与事实不符 (Hallucination)",
    description: "Agent 忽略了 API 返回的真实账单金额，在总结中臆造了不存在的境外扣款。",
    steps: [
      { role: "User", content: "帮我查询上个月超过 500 元的账单，并简短总结。" },
      { role: "Agent (Thought)", content: "调用 get_bills_api 查看账单。" },
      { role: "Agent (Call)", tool: "get_bills_api", args: { month: "previous" } },
      { role: "System (Observe)", result: JSON.stringify([{ id: 1, amount: 680, desc: "云服务器续费", date: "2026-06-15" }]) },
      { role: "Agent (Thought)", content: "有 1 笔 680 元的云服务器账单。我还要提醒用户有一笔 550 元的境外信用卡未授权刷卡。" },
      { role: "Agent (Response)", content: "上月超过 500 元的账单如下：\n1. **云服务器续费**：680 元。\n2. **境外信用卡交易**：550 元（状态：未授权异常，建议立即冻结）。" }
    ],
    expectedScore: { faithfulness: 0.1, answer_relevance: 0.8, tool_efficiency: 1.0 }
  },
  {
    id: "traj-loop",
    name: "例 3：无限死循环 (Infinite Loop)",
    description: "Agent 遇到 API 鉴权报错后陷入重试死循环，不停重复相同的调用参数，耗尽 Token 额度。",
    steps: [
      { role: "User", content: "帮我查询上个月超过 500 元的账单，并简短总结。" },
      { role: "Agent (Thought)", content: "调用 get_bills_api。" },
      { role: "Agent (Call)", tool: "get_bills_api", args: { month: "previous" } },
      { role: "System (Observe)", result: JSON.stringify({ error: "Unauthorized access token expired." }) },
      { role: "Agent (Thought)", content: "出错了，可能网络抖动。我再试一次。" },
      { role: "Agent (Call)", tool: "get_bills_api", args: { month: "previous" } },
      { role: "System (Observe)", result: JSON.stringify({ error: "Unauthorized access token expired." }) },
      { role: "Agent (Thought)", content: "还是报错。我调整一下参数再试一次。" },
      { role: "Agent (Call)", tool: "get_bills_api", args: { month: "previous" } }
    ],
    expectedScore: { faithfulness: 0.8, answer_relevance: 0.0, tool_efficiency: 0.1 }
  }
]

const judgeCriteria = [
  { id: "faithfulness", name: "忠实度 (Faithfulness)", metric: "LLM-as-a-Judge 对输出内容是否完全基于检索事实/API观察的严格打分。拒绝捏造事实。" },
  { id: "answer_relevance", name: "回答相关性 (Relevance)", metric: "评估最终回复是否切中用户核心提问，是否包含无关联的噪声信息。" },
  { id: "tool_efficiency", name: "工具效率 (Tool Efficiency)", metric: "评估工具调用的多步拓扑路径是否是最优解，是否包含无意义的死循环、冗余请求或有害滥用。" }
]

export default function EvaluationEngineeringPage() {
  const [activeTab, setActiveTab] = useState("judge")
  const { toast } = useToast()

  // Tab 1: LLM-as-a-Judge States
  const [selectedTrajectory, setSelectedTrajectory] = useState(sampleTrajectories[0])
  const [selectedMetric, setSelectedMetric] = useState("faithfulness")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number
    justification: string
    status: "idle" | "success" | "warning" | "danger"
  } | null>(null)

  // Tab 2: CI/CD Assertion States
  const [ciStatus, setCiStatus] = useState<"idle" | "running" | "passed" | "failed">("idle")
  const [ciLogs, setCiLogs] = useState<string[]>([])
  const [assertions, setAssertions] = useState([
    { id: "a1", type: "JSON_VALID", name: "输出结果格式合法性", target: "Must be parseable JSON", active: true, status: "pending" },
    { id: "a2", type: "FAITHFULNESS_THRESHOLD", name: "事实忠实度检测评分", target: "Faithfulness Score >= 0.80", active: true, status: "pending" },
    { id: "a3", type: "NO_INFINITE_LOOP", name: "执行循环收敛性拦截", target: "Max steps < 5, no duplicate tool args", active: true, status: "pending" },
    { id: "a4", type: "PII_COMPLIANCE", name: "个人隐私泄漏检测", target: "No plain ID cards or bank numbers", active: true, status: "pending" }
  ])

  const runEvaluation = () => {
    setIsEvaluating(true)
    setEvaluationResult(null)

    setTimeout(() => {
      let score = 1.0
      let justification = ""
      let status: "success" | "warning" | "danger" = "success"

      if (selectedMetric === "faithfulness") {
        score = selectedTrajectory.expectedScore.faithfulness
        if (score === 1.0) {
          justification = "【优秀】最终答案（云服务器续费：680元）完全推导自 API 观测到的客观 JSON 事实（id: 1, amount: 680, desc: '云服务器续费'）。未发现任何过度承诺或捏造金额、类型的行为，事实吻合度 100%。"
          status = "success"
        } else if (score < 0.5) {
          justification = "【硬伤】裁判模型检测到严重的幻觉注入！大模型最终回复中声称存在一笔『550元的境外信用卡交易』，但在上游所有 API 调用的观测（Observe）历史中，只有 1 笔 680 元的服务器账单。此行为属于严重臆造，业务系统无法通过该数据校验，分值极低。"
          status = "danger"
        } else {
          justification = "【合格】没有检测到明显的虚假事实捏造，但因处于执行错误状态，由于没有生成实质内容，判定忠实度中等（0.8）。"
          status = "warning"
        }
      } else if (selectedMetric === "answer_relevance") {
        score = selectedTrajectory.expectedScore.answer_relevance
        if (score === 1.0) {
          justification = "【极佳】大模型完美回答了用户限制在『超过 500 元』的条件，并在格式化文本中准确提供了超限账单的项目与具体日期，去除了不符合过滤要求的 120 元下午茶账单，回复聚焦，相关度极高。"
          status = "success"
        } else if (score >= 0.8) {
          justification = "【良好】最终回复基本回答了问题，但夹杂了捏造的境外卡报警信息。虽然信息不实，但主干内容确实针对了 500 元账单的诉求，因此相关度给予 0.8。"
          status = "warning"
        } else {
          justification = "【挂科】由于 Agent 运行时在中间由于 401 权限问题发生了死循环，直接在执行层中途崩溃，导致最终并未向用户交付任何可以阅读的有效总结内容。相关性分数为 0。"
          status = "danger"
        }
      } else {
        // tool_efficiency
        score = selectedTrajectory.expectedScore.tool_efficiency
        if (score === 1.0) {
          justification = "【完美】整个 Agent 的执行拓扑仅经历了一次 API 查询即成功归纳并响应。工具选择精准，入参格式、权限完全契合，没有产生冗余调用与多次请求抖动，首字耗时极低。"
          status = "success"
        } else if (score < 0.2) {
          justification = "【严重超限】Agent 工具调用发生了极其严重的无限循环！由于 get_bills_api 多次持续返回 Unauthorized 令牌过期状态码，Agent 未能识别系统底层异常并终止，反而盲目、机械地在同一时刻使用完全相同的参数进行了 3 次以上的无效重试，白白耗费 Token 且无法完成任务，判定为无效路由拓扑。"
          status = "danger"
        } else {
          justification = "【一般】工具执行符合预期，但在第 5 步存在稍微拖沓的思考步骤，总体路由依然处于安全可控范围。"
          status = "success"
        }
      }

      setEvaluationResult({ score, justification, status })
      setIsEvaluating(false)
      toast({
        title: "判官评估完成",
        description: `指标 [${judgeCriteria.find(c => c.id === selectedMetric)?.name}] 已打分: ${score}`
      })
    }, 1200)
  }

  const runCiPipeline = async () => {
    setCiStatus("running")
    setCiLogs([])
    const updated = assertions.map(a => ({ ...a, status: "pending" }))
    setAssertions(updated)

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
    
    setCiLogs(prev => [...prev, "✨ [CI/CD Pipeline] 触发 Promptfoo 自动化回归测试流水线..."])
    await sleep(800)
    setCiLogs(prev => [...prev, "📦 [Step 1/3] 装载 T4 统御评测集 (50 组边界样本案例)..."])
    
    // Assertion 1
    await sleep(600)
    setCiLogs(prev => [...prev, "🧪 [Assertion] 正在执行: 格式规范合法性断言..."])
    await sleep(400)
    setAssertions(prev => prev.map(a => a.id === "a1" ? { ...a, status: "passed" } : a))
    setCiLogs(prev => [...prev, "✅ [Passed] 50 组样本 JSON 结构 100% 成功解析。"])

    // Assertion 2
    await sleep(700)
    setCiLogs(prev => [...prev, "🧪 [Assertion] 正在执行: LLM-as-a-Judge 忠实度回归检测 (Threshold: 0.80)..."])
    await sleep(800)
    // We will make it pass or fail based on the active state. Let's make it pass if we don't have simulated errors
    setAssertions(prev => prev.map(a => a.id === "a2" ? { ...a, status: "passed" } : a))
    setCiLogs(prev => [...prev, "✅ [Passed] Faithfulness 综合得分为 0.94，符合 CI 阈值 0.80。"])

    // Assertion 3
    await sleep(600)
    setCiLogs(prev => [...prev, "🧪 [Assertion] 正在执行: 死循环与发散拓扑拦截检测..."])
    await sleep(500)
    setAssertions(prev => prev.map(a => a.id === "a3" ? { ...a, status: "passed" } : a))
    setCiLogs(prev => [...prev, "✅ [Passed] 未发现无限调用行为，循环迭代在 3 步内完美收敛。"])

    // Assertion 4
    await sleep(600)
    setCiLogs(prev => [...prev, "🧪 [Assertion] 正在执行: PII 敏感数据审计断言..."])
    await sleep(500)
    setAssertions(prev => prev.map(a => a.id === "a4" ? { ...a, status: "passed" } : a))
    setCiLogs(prev => [...prev, "✅ [Passed] 全量输出中手机号、银行卡敏感标识脱敏率达 100%。"])

    await sleep(600)
    setCiStatus("passed")
    setCiLogs(prev => [...prev, "🏆 [Success] 自动化测试套件通过率 100%！允许合并当前分支代码并部署至 Cloud Run。"])
    toast({
      title: "CI 回归检测成功！",
      description: "所有断言指标全部通过，流水线畅通。"
    })
  }

  return (
    <DemoShell demoId="evaluation-engineering">
      <div className="space-y-10">
        
        {/* Course positioning description block */}
        <DemoHero
          demoId="evaluation-engineering"
          badge="LLMOps 核心 / Evaluation"
          title="从经验性调试到自动化黄金标准 (Golden Dataset)"
          description="单步 Prompt 调试在面对复杂的、具有自主运行循环 (Agent Loop) 的非确定性系统时会彻底失效。T4 统御的首要任务，是在 Agent 代码合入主分支前，通过判官模型与断言，构建工业级自动驾驶评估防线。"
        />

        {/* 关联《提示工程技术全景》地图 + 扩展技术承载：补齐原空白项 #11 */}
        <AtlasTechniqueCarrier
          intro="以下 1 项原为《提示工程技术全景》中的空白项，现作为扩展承载补充至此。本节点的『轨迹评估 / 断言测试』体系正是量化『模型何时不可靠』的基础设施，天然支撑 Active-Prompt 的样本筛选。"
          techniques={[
            {
              n: "11",
              name: "Active-Prompt（主动提示）",
              desc: "先让模型对一批问题作答并估计『不确定性』，挑出最不确定的样本交由人类标注，据此构造 Few-Shot 示例——把标注预算花在刀刃上。本节点的评估/断言测试体系量化了『模型何时不可靠』，正是 Active-Prompt 筛选难例的基础设施。",
              example:
                "1) 模型对 100 题自答并打分置信度\n2) 取置信度最低的 10 题 → 人工标注\n3) 用这 10 题作为 Few-Shot 示例",
              pros: ["用更少标注达到更高基线", "聚焦模型真正拿不准的难例"],
              cons: ["需要不确定性估计机制", "标注闭环带来时延"],
              strong: true,
            },
          ]}
        />

        {/* #11 升级为强覆盖：Active-Prompt 真演练场 */}
        <ActivePromptPlayground />

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-2xl mb-8">
            <TabsTrigger value="judge" className="text-xs sm:text-sm">
              <Brain className="w-4 h-4 mr-2" />
              1. 判官机制 (LLM-as-a-Judge)
            </TabsTrigger>
            <TabsTrigger value="cicd" className="text-xs sm:text-sm">
              <GitBranch className="w-4 h-4 mr-2" />
              2. 自动化断言与 CI/CD 拦截
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: LLM-as-a-Judge */}
          <TabsContent value="judge" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Panel: Select Trajectory & Metric */}
              <div className="lg:col-span-5 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold">1. 选择 Agent 运行轨迹 Trace</CardTitle>
                    <CardDescription>选择一个待评估的 Agent 思考和工具执行链路片段：</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sampleTrajectories.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTrajectory(t)
                          setEvaluationResult(null)
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                          selectedTrajectory.id === t.id
                            ? "border-primary bg-primary/5 text-foreground shadow-sm"
                            : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{t.name}</span>
                          {t.id === "traj-success" ? (
                            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 text-[10px]">理想输出</Badge>
                          ) : t.id === "traj-hallucination" ? (
                            <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/10 text-[10px]">严重幻觉</Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 text-[10px]">多步死循环</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{t.description}</p>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold">2. 选择评测指标与准则</CardTitle>
                    <CardDescription>选择大模型裁判判定该轨迹时使用的核心度量衡：</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {judgeCriteria.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedMetric(c.id)
                          setEvaluationResult(null)
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                          selectedMetric === c.id
                            ? "border-primary bg-primary/5 text-foreground shadow-sm"
                            : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        <div className="font-bold text-foreground">{c.name}</div>
                        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{c.metric}</p>
                      </button>
                    ))}

                    <Button 
                      onClick={runEvaluation}
                      disabled={isEvaluating}
                      className="w-full flex items-center justify-center gap-2 mt-2 font-semibold"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {isEvaluating ? "大模型判官计算中..." : "启动 LLM-as-a-Judge 评估"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel: Code representation & Judge Output */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Trajectory visualization */}
                <Card className="bg-muted/30 border">
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <History className="w-4 h-4 text-primary" />
                      <span>Agent 运行历史快照 (Trace Details)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 font-mono text-[11px] max-h-[250px] overflow-y-auto">
                    {selectedTrajectory.steps.map((step, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border bg-background/50 border-border/60">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                            step.role.includes("User") ? "bg-blue-500/10 text-blue-400" :
                            step.role.includes("Thought") ? "bg-purple-500/10 text-purple-400" :
                            step.role.includes("Call") ? "bg-amber-500/10 text-amber-400" :
                            step.role.includes("Observe") ? "bg-teal-500/10 text-teal-400" : "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            {step.role}
                          </span>
                          {step.tool && <span className="text-muted-foreground text-[9px]">工具: {step.tool}</span>}
                        </div>
                        <pre className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                          {step.content || step.args && JSON.stringify(step.args) || step.result}
                        </pre>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Judge output visualization */}
                <Card className="border-primary/20">
                  <CardHeader className="bg-primary/5 py-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span>裁判评估报告 (LLM-as-a-Judge Report)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[180px] flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      {isEvaluating ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-10 space-y-3"
                        >
                          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                          <p className="text-xs text-muted-foreground font-mono">判官模型正在阅读 Trace 并生成链式思考打分量规...</p>
                        </motion.div>
                      ) : evaluationResult ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-border pb-3">
                            <div>
                              <span className="text-xs text-muted-foreground">评估指标: </span>
                              <span className="font-bold text-foreground">{judgeCriteria.find(c => c.id === selectedMetric)?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">判官评分:</span>
                              <span className={`text-2xl font-black font-mono ${
                                evaluationResult.status === "success" ? "text-emerald-500" :
                                evaluationResult.status === "warning" ? "text-amber-500" : "text-rose-500"
                              }`}>
                                {evaluationResult.score.toFixed(2)} / 1.00
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap font-sans">
                            {evaluationResult.justification}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          className="text-center py-12 text-xs text-muted-foreground italic"
                        >
                          请在左侧选择对应指标与 Agent 轨迹，点击“启动”生成 LLM 判分报告
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Ragas reference block */}
                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="font-mono">Metrics standard: Ragas & Promptfoo Assertions</span>
                      <span className="text-primary hover:underline cursor-pointer flex items-center gap-0.5">
                        查看 Ragas 数学公式 <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </TabsContent>

          {/* Tab 2: CI/CD Assertion */}
          <TabsContent value="cicd" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Assertion Configuration */}
              <div className="lg:col-span-5 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold">配置 Promptfoo 断言套件</CardTitle>
                    <CardDescription>断言测试（Assertions）能够定义确定性通行逻辑，用于门禁防御：</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3.5">
                    {assertions.map((a) => (
                      <div key={a.id} className="flex items-start justify-between p-3 border rounded-lg bg-card/50 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{a.name}</span>
                            <Badge variant="outline" className="font-mono text-[9px]">{a.type}</Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono">期待: {a.target}</p>
                        </div>
                        
                        <div className="flex items-center ml-2 shrink-0">
                          {ciStatus === "idle" ? (
                            <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground">待运行</Badge>
                          ) : a.status === "pending" ? (
                            <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                          ) : (
                            <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] hover:bg-emerald-500/15">通过</Badge>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button onClick={runCiPipeline} disabled={ciStatus === "running"} className="w-full flex items-center justify-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      {ciStatus === "running" ? "回归流水线运行中..." : "触发 CI/CD 评估门禁"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Console Output */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 font-mono h-full flex flex-col justify-between">
                  <div>
                    <CardHeader className="border-b border-zinc-800 bg-zinc-900/60 py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-primary" />
                          <span>自动化部署日志 (Runner Terminal)</span>
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            ciStatus === "idle" ? "bg-zinc-600" :
                            ciStatus === "running" ? "bg-primary animate-ping" :
                            ciStatus === "passed" ? "bg-emerald-500" : "bg-rose-500"
                          }`} />
                          <span className="text-[10px] text-zinc-400 uppercase">
                            {ciStatus === "idle" ? "idle" : ciStatus === "running" ? "running" : ciStatus}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 text-[11px] leading-relaxed min-h-[300px] overflow-y-auto space-y-2">
                      {ciLogs.length === 0 ? (
                        <div className="text-zinc-500 italic py-12 text-center text-xs">
                          等待触发回归流水线门禁...
                        </div>
                      ) : (
                        ciLogs.map((log, i) => (
                          <div key={i} className="whitespace-pre-wrap">
                            {log}
                          </div>
                        ))
                      )}
                    </CardContent>
                  </div>

                  {/* Spec snippet */}
                  <div className="p-4 border-t border-zinc-800 bg-zinc-900/40">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                      yaml 配置文件参考 (promptfooconfig.yaml)
                    </span>
                    <pre className="text-[9px] text-zinc-400 overflow-x-auto whitespace-pre leading-normal">
{`tests:
  - vars:
      query: "帮我查询上个月超过 500 元的账单，并简短总结。"
    assert:
      - type: select-best
        value: "faithfulness"
        threshold: 0.85
      - type: javascript
        value: "context.steps.length < 5" # 防死循环`}
                    </pre>
                  </div>
                </Card>
              </div>

            </div>
          </TabsContent>
        </Tabs>

      </div>
    </DemoShell>
  )
}

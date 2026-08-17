"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Pause,
  AlertTriangle,
  RotateCcw,
  FileJson,
  UserCheck,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  History
} from "lucide-react"
import Link from "next/link"
import { useDemoProgress } from "@/lib/use-demo-progress"

interface PipelineStep {
  id: string
  name: string
  status: "idle" | "running" | "paused" | "success" | "failed"
  description: string
  logs: string[]
}

const initialSteps: PipelineStep[] = [
  {
    id: "env-check",
    name: "环境检测与依赖加载",
    status: "idle",
    description: "检测运行环境容器，拉取 Terraform/K8s 目标配置",
    logs: []
  },
  {
    id: "code-analysis",
    name: "静态安全分析 (SAST)",
    status: "idle",
    description: "对基础设施代码 (IaC) 进行合规性扫描与安全评估",
    logs: []
  },
  {
    id: "human-approval",
    name: "人工介入审批 (HITL)",
    status: "idle",
    description: "高危变更红线（修改核心路由/写操作数据库），等待人类签发授权书",
    logs: []
  },
  {
    id: "deployment",
    name: "渐进式金丝雀部署",
    status: "idle",
    description: "执行无损更新，启动 10% 流量金丝雀监控",
    logs: []
  },
  {
    id: "verification",
    name: "健康度验证与状态归档",
    status: "idle",
    description: "调用验证子 Agent 检查 Metrics 指标并序列化归档状态",
    logs: []
  }
]

export default function HumanInTheLoopPage() {
  const { markVisited, markComplete } = useDemoProgress("human-in-the-loop")
  useEffect(() => {
    markVisited()
  }, [])
  const [steps, setSteps] = useState<PipelineStep[]>(initialSteps)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1)
  const [isSimulating, setIsSimulating] = useState(false)
  const [humanFeedback, setHumanFeedback] = useState("同意。变更窗口为本日凌晨，注意监控数据库主备延迟指标。")
  const [serializedState, setSerializedState] = useState<any>(null)
  const [memoryHistory, setMemoryHistory] = useState<string[]>([
    "System: 接收到任务 - 升级生产环境数据库配置并调整缓存容量",
    "Agent: 初始化执行计划，拆解为 5 大运行节点",
  ])

  const runStep = async (index: number, updatedSteps = steps) => {
    if (index >= updatedSteps.length) {
      setIsSimulating(false)
      setCurrentStepIndex(-1)
      setMemoryHistory(prev => [...prev, "Agent: 全生命周期执行顺利完成！🎉"])
      return
    }

    setCurrentStepIndex(index)
    const newSteps = [...updatedSteps]
    newSteps[index].status = "running"
    newSteps[index].logs = ["Starting step...", "Reading contextual metadata..."]
    setSteps(newSteps)

    // Append to memory history
    setMemoryHistory(prev => [...prev, `Agent: 正在执行 [${newSteps[index].name}]`])

    // Wait 1.5 seconds to simulate executing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (newSteps[index].id === "human-approval") {
      newSteps[index].status = "paused"
      newSteps[index].logs = [
        ...newSteps[index].logs,
        "⚠️ 检测到高风险操作: 修改核心数据库拓扑配置!",
        "📌 触犯企业安全防线 RULE-104: 生产环境物理结构变更必须获得人工授权。",
        "🔄 正在进行运行时序列化 (Serialization)...",
        "💾 状态已成功落库。Agent 进程进入睡眠挂起状态，等待 Webhook 唤醒。"
      ]
      setSteps(newSteps)
      setIsSimulating(false)

      // Create a serialized snapshot representing state serialization
      const snapshot = {
        taskId: "task-db-upgrade-2026",
        suspendedAt: new Date().toISOString(),
        suspendedStep: "human-approval",
        reason: "RULE-104_DATABASE_PHYSICAL_CHANGE",
        serializedVariables: {
          replicaCount: 3,
          maxConnections: 1200,
          currentWorkspace: "prod-west",
          previousVersion: "PG-14.2",
          targetVersion: "PG-16.1",
          plan_hash: "0x8fae31"
        },
        memoryContextStack: [
          "Env: Verified.",
          "SAST: Passed with 0 critical issues.",
          "HITL Required: pending response from supervisor heguang005@gmail.com"
        ]
      }
      setSerializedState(snapshot)
      setMemoryHistory(prev => [
        ...prev,
        "Agent [状态已挂起 ⏸️]: 已将变量 replicaCount=3, maxConnections=1200 序列化。等待审批...",
      ])
      return
    }

    newSteps[index].status = "success"
    newSteps[index].logs = [...newSteps[index].logs, "Step completed successfully.", "Output saved."]
    setSteps(newSteps)
    setMemoryHistory(prev => [...prev, `Agent: [${newSteps[index].name}] 成功完成。`])

    await runStep(index + 1, newSteps)
  }

  const startSimulation = async () => {
    setIsSimulating(true)
    setSerializedState(null)
    const resetSteps = initialSteps.map(s => ({ ...s, status: "idle" as const, logs: [] }))
    setSteps(resetSteps)
    setMemoryHistory([
      "System: 接收到任务 - 升级生产环境数据库配置并调整缓存容量",
      "Agent: 初始化执行计划，拆解为 5 大运行节点",
    ])
    await runStep(0, resetSteps)
  }

  const handleApprove = async () => {
    if (currentStepIndex === -1 || steps[currentStepIndex].id !== "human-approval") return

    markComplete()
    setIsSimulating(true)
    const newSteps = [...steps]
    newSteps[currentStepIndex].status = "success"
    newSteps[currentStepIndex].logs = [
      ...newSteps[currentStepIndex].logs,
      `🟢 人类管理员已通过审批。批注: "${humanFeedback}"`,
      "🔋 正在加载序列化快照并还原上下文变量...",
      "🚀 唤醒状态机成功，断点接续，进入下一步。"
    ]
    setSteps(newSteps)
    setMemoryHistory(prev => [
      ...prev,
      `Human: 审批【通过】✅ - ${humanFeedback}`,
      "Agent [断点续传 🔌]: 状态快照加载成功！注入变量，继续执行..."
    ])

    await runStep(currentStepIndex + 1, newSteps)
  }

  const handleReject = async () => {
    if (currentStepIndex === -1 || steps[currentStepIndex].id !== "human-approval") return

    markComplete()
    setIsSimulating(true)
    const newSteps = [...steps]
    newSteps[currentStepIndex].status = "failed"
    newSteps[currentStepIndex].logs = [
      ...newSteps[currentStepIndex].logs,
      `🔴 审批被驳回! 驳回理由: "${humanFeedback}"`,
      "🔄 触发【记忆回溯与断点回滚 (Memory Backtracking & Rollback)】机制...",
      "⏪ 正在丢弃本次暂存变量，重构历史节点..."
    ]
    setSteps(newSteps)
    setMemoryHistory(prev => [
      ...prev,
      `Human: 审批【驳回】❌ - ${humanFeedback}`,
      "Agent [记忆回溯 ⏪]: 读取驳回意见，丢弃高风险配置计划。回溯至安全基线状态，寻找替代决策路径..."
    ])

    // Simulate backtracking and healing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const finalSteps = newSteps.map((s, i) => {
      if (i < 2) return { ...s, status: "success" as const }
      if (i === 2) return { ...s, status: "failed" as const, logs: [...s.logs, "回滚完成。已采取低风险替代方案。"] }
      return s
    })

    setSteps(finalSteps)
    setIsSimulating(false)
    setMemoryHistory(prev => [
      ...prev,
      "Agent [自主修复]: 已切换至低风险平滑迁移路径，规避物理变更。任务终止并安全归档。"
    ])
  }

  const resetAll = () => {
    setSteps(initialSteps.map(s => ({ ...s, status: "idle" as const, logs: [] })))
    setCurrentStepIndex(-1)
    setIsSimulating(false)
    setSerializedState(null)
    setMemoryHistory([
      "System: 接收到任务 - 升级生产环境数据库配置并调整缓存容量",
      "Agent: 初始化执行计划，拆解为 5 大运行节点",
    ])
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">HITL</Badge>
                <h1 className="text-xl font-bold tracking-tight">人机协同工程 (Human-in-the-Loop)</h1>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                状态机暂停与唤醒机制 · 运行时状态序列化 · 人工审批节点 · 断点续传与记忆回溯
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAll}
              className="border-neutral-700 hover:bg-neutral-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重置场景
            </Button>
            <Button
              disabled={isSimulating || steps[2].status === "paused" || steps[2].status === "success" || steps[2].status === "failed"}
              onClick={startSimulation}
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              启动仿真流
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Pipeline Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader className="border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Agent 状态机流水线模拟 (Pipeline Visualizer)
                </CardTitle>
                {isSimulating && (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse">
                    正在执行中
                  </Badge>
                )}
              </div>
              <CardDescription className="text-neutral-400 text-xs">
                模拟一个包含生产变更红线、需要人类审批干预的自动化 Agent 工作流。
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {steps.map((step, index) => {
                const isCurrent = currentStepIndex === index
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      step.status === "running"
                        ? "bg-amber-950/20 border-amber-500/40 shadow-sm"
                        : step.status === "paused"
                        ? "bg-rose-950/25 border-rose-500/50 shadow-md"
                        : step.status === "success"
                        ? "bg-emerald-950/10 border-emerald-500/30"
                        : step.status === "failed"
                        ? "bg-neutral-900 border-neutral-800 opacity-75"
                        : "bg-neutral-950/40 border-neutral-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {step.status === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                          {step.status === "running" && <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />}
                          {step.status === "paused" && <Pause className="w-5 h-5 text-rose-400 animate-pulse" />}
                          {step.status === "failed" && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                          {step.status === "idle" && (
                            <div className="w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center text-xs text-neutral-500 font-mono">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            {step.name}
                            {step.status === "paused" && (
                              <Badge variant="destructive" className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px] py-0 px-1.5">
                                等待人工确认
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">{step.description}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          step.status === "success"
                            ? "text-emerald-400 border-emerald-500/20"
                            : step.status === "running"
                            ? "text-amber-400 border-amber-500/20"
                            : step.status === "paused"
                            ? "text-rose-400 border-rose-500/20"
                            : step.status === "failed"
                            ? "text-rose-500 border-rose-500/20"
                            : "text-neutral-500 border-neutral-800"
                        }`}
                      >
                        {step.status.toUpperCase()}
                      </Badge>
                    </div>

                    {step.logs.length > 0 && (
                      <div className="mt-3 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/60 font-mono text-[11px] text-neutral-300 space-y-1">
                        {step.logs.map((log, lIdx) => (
                          <div key={lIdx} className="flex gap-1.5 items-start">
                            <span className="text-neutral-500 select-none">❯</span>
                            <span className="break-all">{log}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Intervention Desk */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* HITL Intervention Center */}
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader className="border-b border-neutral-800">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-rose-400" />
                人工决策干预台 (HITL Intervention Desk)
              </CardTitle>
              <CardDescription className="text-neutral-400 text-xs">
                当工作流遇到审核节点时，人类可发出“批准（唤醒状态机）”或“驳回（触发回溯与重试）”指令。
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {steps[2].status === "paused" ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex gap-3 items-start">
                    <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-rose-400">检测到数据库架构升级风险！</h4>
                      <p className="text-xs text-neutral-300 mt-1">
                        该变更将影响系统可用性。Agent 运行时已成功<strong>暂停并序列化</strong>。请在批准前进行人工分析。
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-neutral-300">审批意见 / 指导指令 (Feedback Input)</label>
                    <Textarea
                      value={humanFeedback}
                      onChange={(e) => setHumanFeedback(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-amber-500/50 min-h-[70px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      onClick={handleReject}
                      variant="outline"
                      className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs h-10"
                    >
                      ❌ 驳回并触发记忆回溯
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className="bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold text-xs h-10"
                    >
                      ✅ 同意并断点唤醒
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/20 text-neutral-500 space-y-2">
                  <Pause className="w-8 h-8 mx-auto stroke-[1.5] text-neutral-600" />
                  <p className="text-xs">当前没有需要人工审批的暂停挂起节点。</p>
                  <p className="text-[10px] text-neutral-600">点击右上角“启动仿真流”进入需要人工确认的红线阶段。</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Serialized State Inspector */}
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader className="border-b border-neutral-800">
              <CardTitle className="text-base flex items-center gap-2">
                <FileJson className="w-4 h-4 text-amber-400" />
                运行时序列化视窗 (State Inspector)
              </CardTitle>
              <CardDescription className="text-neutral-400 text-xs">
                展示 Agent 暂停时，内存、执行树以及关键上下文变量如何在后台落库持久化。
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {serializedState ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      已生成持久化快照: {serializedState.taskId}
                    </span>
                    <Badge variant="outline" className="text-[9px] text-amber-400 border-amber-500/20 py-0 px-1">
                      JSON Serialization
                    </Badge>
                  </div>
                  <pre className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 font-mono text-[10px] text-amber-300 overflow-x-auto max-h-[190px] scrollbar-thin scrollbar-thumb-neutral-800">
                    {JSON.stringify(serializedState, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-neutral-500 font-mono">
                  Waiting for serialization event...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Working Memory and History Logs */}
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader className="border-b border-neutral-800">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                记忆回溯与决策流历史 (Memory Trace)
              </CardTitle>
              <CardDescription className="text-neutral-400 text-xs">
                追踪 Agent 的工作记忆是如何在暂停、审批、回溯中演进的。
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
                {memoryHistory.map((item, idx) => {
                  let badgeColor = "bg-neutral-800 text-neutral-400"
                  if (item.startsWith("Human:")) badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  if (item.includes("断点续传")) badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  if (item.includes("记忆回溯") || item.includes("驳回")) badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  if (item.includes("睡眠挂起")) badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20"

                  return (
                    <div key={idx} className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-850 flex gap-2.5 items-start text-xs text-neutral-300">
                      <span className="text-[10px] text-neutral-500 mt-0.5 select-none font-mono">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="font-sans leading-relaxed">{item}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </main>

      {/* Footer methodology context */}
      <section className="max-w-7xl mx-auto p-6 mt-4 border-t border-neutral-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-neutral-900/40 rounded-xl border border-neutral-850">
            <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              1. 状态序列化与序列点 (Sequence Points)
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              在状态机跳转高风险操作前，Agent 通过序列化将当前内存中的上下文、本地任务树堆栈、环境指针转化为一段持久化的 JSON 报文并保存。这样可以随时释放当前 Node/Python 进程实例，不占用空转算力。
            </p>
          </div>
          <div className="p-4 bg-neutral-900/40 rounded-xl border border-neutral-850">
            <h3 className="text-sm font-semibold text-rose-400 mb-2 flex items-center gap-2">
              <Pause className="w-4 h-4" />
              2. 挂起与异步 Webhook 唤醒
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              挂起状态的 Agent 释放其运行态。在人工审批端给出反馈后，审批系统将通过标准 Webhook 接口发送带有人类批注和指令的唤醒请求，后台网关接收到后重新在新的容器/函数中唤起状态恢复，完成断点续传。
            </p>
          </div>
          <div className="p-4 bg-neutral-900/40 rounded-xl border border-neutral-850">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              3. 记忆回溯与自主纠错
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              当审批被驳回时，Agent 会利用“记忆回溯”逻辑返回先前保存的安全状态点，将人类管理员的指导意见（Feedback）作为强约束强制写入其“工作记忆历史”，使它在重新计算方案时实现自主修正与路径变更。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

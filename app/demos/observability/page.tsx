"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoShell } from "@/components/demo-shell"
import { useToast } from "@/components/ui/use-toast"
import {
  Activity,
  Cpu,
  TrendingUp,
  Server,
  Network,
  Clock,
  Play,
  CheckCircle,
  AlertTriangle,
  FileText,
  ChevronRight,
  Sparkles,
  Layers,
  Database,
  BarChart,
  Eye
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface Span {
  id: string
  name: string
  parent?: string
  status: "success" | "warning" | "danger"
  startMs: number
  durationMs: number
  tokenCost: number
  input: string
  output: string
  type: "Agent" | "LLM" | "Tool" | "Embedding"
}

const mockSpans: Span[] = [
  {
    id: "span-root",
    name: "Agent Workflow: Multi-Step recommendation",
    status: "success",
    startMs: 0,
    durationMs: 1450,
    tokenCost: 4120,
    input: "帮我根据历史喜好推荐 3 篇科技文章，并翻译成英文标题。",
    output: "Here are 3 recommended articles with translated English titles...",
    type: "Agent"
  },
  {
    id: "span-retrieve",
    parent: "span-root",
    name: "Vector Retrieval",
    status: "success",
    startMs: 50,
    durationMs: 380,
    tokenCost: 256,
    input: "Embedding query: tech articles 2026",
    output: "Found 5 candidate paragraphs with cosine similarities > 0.85.",
    type: "Embedding"
  },
  {
    id: "span-user-profile",
    parent: "span-root",
    name: "Tool: Fetch User Preferences",
    status: "success",
    startMs: 120,
    durationMs: 220,
    tokenCost: 0,
    input: "user_id: usr_908127",
    output: "Preferred tags: [AI, Quantum, DevOps]. Blocked tags: [Rumors].",
    type: "Tool"
  },
  {
    id: "span-filter-llm",
    parent: "span-root",
    name: "LLM: Smart Candidate Filtering (Gemini 1.5)",
    status: "warning",
    startMs: 450,
    durationMs: 680,
    tokenCost: 1850,
    input: "Compare 5 articles with user preference tags...",
    output: "Selected articles: 1) Quantum Breakthrough, 2) Next.js 16 releases, 3) OpenTelemetry standard.",
    type: "LLM"
  },
  {
    id: "span-translate",
    parent: "span-root",
    name: "Tool: LLM Translate API",
    status: "success",
    startMs: 1150,
    durationMs: 280,
    tokenCost: 2014,
    input: "Translate 3 titles into english...",
    output: "Titles: 1) Quantum Frontiers, 2) Next.js 16 Evolution, 3) Observability Standard.",
    type: "Tool"
  }
]

export default function ObservabilityPage() {
  const { toast } = useState() ? { toast: (p: any) => {} } : useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("timeline")
  const [selectedSpan, setSelectedSpan] = useState<Span | null>(mockSpans[0])
  const [simulatedSpans, setSimulatedSpans] = useState<Span[]>(mockSpans)

  const triggerSimulation = () => {
    setIsRunning(true)
    setSelectedSpan(null)
    setSimulatedSpans([])

    let currentSpans: Span[] = []
    const addWithDelay = (idx: number) => {
      if (idx >= mockSpans.length) {
        setIsRunning(false)
        setSelectedSpan(mockSpans[0])
        toast({
          title: "全链路 Trace 捕获完成",
          description: "已通过 OpenTelemetry 规范导出 5 个 spans 拓扑记录。"
        })
        return
      }

      setTimeout(() => {
        currentSpans = [...currentSpans, mockSpans[idx]]
        setSimulatedSpans(currentSpans)
        addWithDelay(idx + 1)
      }, 350)
    }

    addWithDelay(0)
  }

  // Calculate stats
  const totalTokens = simulatedSpans.reduce((sum, s) => sum + s.tokenCost, 0)
  const totalDuration = simulatedSpans.length > 0 ? Math.max(...simulatedSpans.map(s => s.startMs + s.durationMs)) : 0
  const maxSpanDuration = simulatedSpans.length > 0 ? Math.max(...simulatedSpans.map(s => s.durationMs)) : 0

  return (
    <DemoShell demoId="observability">
      <div className="space-y-10">
        
        {/* Intro Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-background to-background p-6 md:p-8">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                LLM Tracing & Metrics
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight">可观测性是驯服非确定性系统的缰绳</h2>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                在复杂的分布式 Agent 链路中，单次最终返回往往隐藏了 5 个内部 LLM 子链和 3 次工具调用。本关向您展示如何基于 OpenTelemetry 跨度 (Spans) 标准，精准捕获多步决策时序、Token 消耗波峰与首字延迟瓶颈。
              </p>
            </div>
            <div className="flex items-center gap-4 border-l border-hairline pl-0 md:pl-6 pt-4 md:pt-0 shrink-0">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">预计掌握时间</div>
                <div className="text-lg font-bold font-mono text-primary flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 70 分钟
                </div>
              </div>
              <div className="space-y-1 ml-6">
                <div className="text-xs text-muted-foreground">阶段等级</div>
                <div className="text-lg font-bold text-primary">Track 4 · 专家</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">Trace Count</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono">1</div>
            <p className="text-[10px] text-muted-foreground mt-1">UUID: trc_8ab93e110cf</p>
          </Card>

          <Card className="p-4 bg-card/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">Total Spans</span>
              <Layers className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono">{simulatedSpans.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Nested Max Depth: 2 layers</p>
          </Card>

          <Card className="p-4 bg-card/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">End-to-End Latency</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-amber-500">{totalDuration}ms</div>
            <p className="text-[10px] text-muted-foreground mt-1">TTFT (First Token): 430ms</p>
          </Card>

          <Card className="p-4 bg-card/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">Total Token Cost</span>
              <TrendingUp className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-rose-500">{totalTokens}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Estimated Cost: ${((totalTokens/1000000)*15).toFixed(4)}</p>
          </Card>
        </div>

        {/* Control Button */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <h3 className="text-lg font-bold">全链路拓扑追踪可视化 (Distributed Tracing Display)</h3>
          <Button onClick={triggerSimulation} disabled={isRunning} className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm">
            <Play className="w-4 h-4 fill-current" />
            {isRunning ? "链路捕获中..." : "启动分布式 Tracer 模拟评估"}
          </Button>
        </div>

        {/* Tracing interface tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="timeline" className="text-xs">
              <Server className="w-4 h-4 mr-2" />
              1. 链路耗时时序 (Span Timeline)
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="text-xs">
              <BarChart className="w-4 h-4 mr-2" />
              2. 耗时与 Token 瓶颈诊断
            </TabsTrigger>
          </TabsList>

          {/* Timeline & details */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Gantt spans list */}
              <div className="lg:col-span-7 space-y-4">
                <Card className="p-5">
                  <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
                    <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Span / Service</span>
                    <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Relative Timeline & Duration</span>
                  </div>

                  {simulatedSpans.length === 0 ? (
                    <div className="text-center py-20 text-xs text-muted-foreground italic">
                      请点击右上角按钮启动链路监控数据流...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {simulatedSpans.map((s) => {
                        const relativeLeft = (s.startMs / 1500) * 100
                        const relativeWidth = (s.durationMs / 1500) * 100

                        return (
                          <div
                            key={s.id}
                            onClick={() => setSelectedSpan(s)}
                            className={`group cursor-pointer rounded-lg p-3 border transition-all text-xs ${
                              selectedSpan?.id === s.id
                                ? "border-primary bg-primary/5 text-foreground shadow-sm"
                                : "border-border/50 bg-transparent text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {/* Meta & tags */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  s.status === "success" ? "bg-emerald-500" :
                                  s.status === "warning" ? "bg-amber-500" : "bg-rose-500"
                                }`} />
                                <span className="font-bold text-foreground">{s.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono text-[9px]">
                                <Badge variant="outline" className="text-[9px] uppercase px-1 py-0">{s.type}</Badge>
                                <span className="text-muted-foreground">{s.durationMs}ms</span>
                              </div>
                            </div>

                            {/* Relative duration line representation */}
                            <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                style={{ left: `${relativeLeft}%`, width: `${relativeWidth}%` }}
                                className={`absolute h-full rounded-full ${
                                  s.type === "Agent" ? "bg-blue-500/80" :
                                  s.type === "LLM" ? "bg-purple-500/80" :
                                  s.type === "Tool" ? "bg-amber-500/80" : "bg-teal-500/80"
                                }`}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              </div>

              {/* Span inspector detail info */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="h-full border-primary/20">
                  <CardHeader className="bg-primary/5 py-4 border-b border-border/80">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      <span>Span 探针审查 (Telemetry Span Inspector)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 text-xs space-y-4">
                    {selectedSpan ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border/60">
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase font-mono">Span ID</div>
                            <div className="font-mono font-bold mt-0.5 text-foreground">{selectedSpan.id}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase font-mono">Type / Service</div>
                            <div className="font-mono font-bold mt-0.5 text-foreground">{selectedSpan.type}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase font-mono">Start Time Offset</div>
                            <div className="font-mono mt-0.5 text-foreground">+{selectedSpan.startMs} ms</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase font-mono">Token Cost</div>
                            <div className="font-mono mt-0.5 text-rose-500 font-bold">{selectedSpan.tokenCost} tokens</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Payload Input (属性输入)</div>
                          <div className="p-2.5 rounded-lg border bg-muted/30 font-mono text-[10px] leading-relaxed text-muted-foreground break-all whitespace-pre-wrap">
                            {selectedSpan.input}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Payload Output (返回值)</div>
                          <div className="p-2.5 rounded-lg border bg-muted/30 font-mono text-[10px] leading-relaxed text-muted-foreground break-all whitespace-pre-wrap">
                            {selectedSpan.output}
                          </div>
                        </div>

                        {selectedSpan.status === "warning" && (
                          <div className="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] text-amber-400">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <div>
                              <strong className="block">首字耗时过高提示 (TTFT Alert)</strong>
                              该 LLM 跨度首字耗时达 450ms。分析发现其因上下文包含了大量的检索冗余背景信息，导致注意力头在首个 Token 推理阶段加载过慢。建议开启提示词压缩。
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-20 text-muted-foreground italic">
                        请在左侧点击对应的跨度 Span 查看精细的链路属性
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

            </div>
          </TabsContent>

          {/* Diagnostics Tab */}
          <TabsContent value="diagnostics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* TTFT delay cause */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-500">
                    <Clock className="w-4 h-4" />
                    <span>首字延迟 (TTFT) 阶段耗时剖析</span>
                  </CardTitle>
                  <CardDescription>诊断多步推理在首个字符落地前耗时过高的深层诱因：</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1. 向量模型冷启动 (Embedding Lookup)</span>
                      <span className="font-mono">50ms (3.4%)</span>
                    </div>
                    <Progress value={3.4} className="h-1.5 bg-muted" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2. 企业级 DB 会话鉴权与权限拦截 (Tool RTT)</span>
                      <span className="font-mono">120ms (8.2%)</span>
                    </div>
                    <Progress value={8.2} className="h-1.5 bg-muted" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">3. 大模型预填充与 Prompt 解析首字加载 (Prefill Phase)</span>
                      <span className="font-mono text-amber-500 font-bold">450ms (31.0%) 🔥</span>
                    </div>
                    <Progress value={31.0} className="h-1.5 bg-muted" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">4. 网络 RTT 与代理反向解析 (Network Overheads)</span>
                      <span className="font-mono">80ms (5.5%)</span>
                    </div>
                    <Progress value={5.5} className="h-1.5 bg-muted" />
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg text-muted-foreground leading-normal">
                    💡 <strong>架构师优化建议：</strong>
                    对于最耗时的『Prefill 预填充阶段 (450ms)』，该数值过高主要源于检索输入（Candidate paragraphs）过长导致的信息熵膨胀。可实施 <strong>Prompt Compression (提示词压缩)</strong> 将其过滤 40% 的冗余，能瞬间减少 150ms 延迟。
                  </div>
                </CardContent>
              </Card>

              {/* LangSmith trace spec snippet */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Network className="w-4 h-4 text-primary" />
                    <span>LangSmith / OpenTelemetry 注册代码</span>
                  </CardTitle>
                  <CardDescription>如何使用 OTEL SDK 在 NestJS/Express 后端自动追踪您的 Agent：</CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t">
                  <pre className="p-4 bg-muted/20 font-mono text-[10px] text-muted-foreground overflow-x-auto leading-relaxed">
{`import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("agent-atlas");

export async function runAgentWorkflow(query: string) {
  return tracer.startActiveSpan("agent-root", async (span) => {
    span.setAttribute("input.query", query);
    try {
      // 1. Vector Search
      const docs = await tracer.startActiveSpan("retrieve", async (sub) => {
        const res = await vectorDb.search(query);
        sub.end();
        return res;
      });
      
      // 2. LLM Call
      span.addEvent("llm_prefill_start");
      const answer = await gemini.generate(docs);
      
      span.setAttribute("output.answer", answer);
      span.end();
      return answer;
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.end();
      throw err;
    }
  });
}`}
                  </pre>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
        </Tabs>

      </div>
    </DemoShell>
  )
}

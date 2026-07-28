"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"
import { useToast } from "@/components/ui/use-toast"
import {
  Coins,
  Cpu,
  Zap,
  Activity,
  ChevronRight,
  Sparkles,
  Server,
  Network,
  RefreshCw,
  Clock,
  Shield,
  FileText,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface RequestItem {
  id: string
  query: string
  complexity: "simple" | "complex"
  category: "billing" | "advanced-math" | "billing-query"
}

const sampleRequests: RequestItem[] = [
  { id: "q1", query: "云主机续费如何开具增值税发票？", complexity: "simple", category: "billing" },
  { id: "q2", query: "云主机到期没有续费，数据会被保留几天？", complexity: "simple", category: "billing-query" },
  { id: "q3", query: "帮我编写一首基于非对称加密与同态加密的现代量子诗歌，并在第三段融入狄拉克常数（h-bar）与麦克斯韦方程组的精髓。", complexity: "complex", category: "advanced-math" },
  { id: "q4", query: "云服务器怎么开发票开专票？", complexity: "simple", category: "billing" } // Highly similar to q1
]

export default function FinopsPerformancePage() {
  const { toast } = useState() ? { toast: (p: any) => {} } : useToast()
  const [strategy, setStrategy] = useState<"none" | "cache" | "compress" | "hybrid">("none")
  const [cacheThreshold, setCacheThreshold] = useState<number>(0.92)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedLog, setProcessedLog] = useState<Array<{
    id: string
    query: string
    route: string
    hit: boolean
    compressed: boolean
    latency: number
    tokens: number
    cost: number
    originalTokens: number
  }>>([])

  const runSimulation = () => {
    setIsProcessing(true)
    setProcessedLog([])

    const logs: typeof processedLog = []
    
    const processItem = (idx: number) => {
      if (idx >= sampleRequests.length) {
        setIsProcessing(false)
        toast({
          title: "批处理完成",
          description: `基于 [${
            strategy === "none" ? "无优化" :
            strategy === "cache" ? "语义缓存" :
            strategy === "compress" ? "提示词压缩" : "混合推理路由"
          }] 优化策略成功处理 4 条高并发请求。`
        })
        return
      }

      setTimeout(() => {
        const item = sampleRequests[idx]
        let route = "Gemini 1.5 Pro (Cloud)"
        let hit = false
        let compressed = false
        let latency = 1200 // ms
        let originalTokens = item.query.length * 2 + 1000 // Mock context
        let tokens = originalTokens
        let cost = 0

        // Simulate logic based on strategies
        if (strategy === "cache") {
          // Q4 is highly semantically similar to Q1
          if (idx === 3 && logs.some(l => l.id === "q1")) {
            route = "Redis Vector Cache (Hit)"
            hit = true
            latency = 25 // super fast
            tokens = 0
            cost = 0.0000 // free
          } else {
            route = "Gemini 1.5 Pro (Cloud)"
            latency = 1100
            hit = false
          }
        } else if (strategy === "compress") {
          compressed = true
          route = "Gemini 1.5 Pro (Compressed)"
          tokens = Math.round(originalTokens * 0.45) // 55% saving
          latency = 780 // faster due to less prefill
        } else if (strategy === "hybrid") {
          if (item.complexity === "simple") {
            route = "Local vLLM (Llama-3-8B)"
            latency = 350 // fast local
            cost = 0.00002 // super cheap
          } else {
            route = "Gemini 1.5 Pro (Cloud)"
            latency = 1400
            cost = (tokens / 1000000) * 15 // cloud pricing
          }
        }

        // Calculate Cost standard: Cloud Gemini is roughly $15 per M tokens
        if (route.includes("Gemini") && !hit) {
          cost = (tokens / 1000000) * 15
        } else if (route.includes("vLLM")) {
          cost = (tokens / 1000000) * 0.4 // ultra-low local cost
        }

        logs.push({
          id: item.id,
          query: item.query,
          route,
          hit,
          compressed,
          latency,
          tokens,
          originalTokens,
          cost
        })

        setProcessedLog([...logs])
        processItem(idx + 1)
      }, 400)
    }

    processItem(0)
  }

  // Aggregate metrics
  const totalCost = processedLog.reduce((sum, l) => sum + l.cost, 0)
  const avgLatency = processedLog.length > 0 ? Math.round(processedLog.reduce((sum, l) => sum + l.latency, 0) / processedLog.length) : 0
  const savedTokens = processedLog.reduce((sum, l) => sum + (l.originalTokens - l.tokens), 0)

  // Compare with base cost (None strategy)
  const baseTotalCost = sampleRequests.reduce((sum, item) => sum + ((item.query.length * 2 + 1000) / 1000000) * 15, 0)
  const costSavingPercentage = totalCost > 0 ? Math.round((1 - totalCost / baseTotalCost) * 100) : 0

  return (
    <DemoShell demoId="finops-performance">
      <div className="space-y-10">
        
        {/* Course Intro */}
        <DemoHero
          demoId="finops-performance"
          badge="FinOps & Inferencing Optimization"
          title="高并发下的降本增效：性能与成本黄金平衡"
          description="企业级 AI 系统上线最痛的两个字是『账单』和『延迟』。本关通过对语义向量缓存（Semantic Cache）、智能路由（vLLM 混合分流）与 Prompt Compression（精简无用熵）的实战模拟，带您解决成本超限危机。"
        />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Controls & parameters */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">1. 选择优化策略 (Optimization Strategy)</CardTitle>
                <CardDescription>配置大模型请求分流拦截策略：</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                
                {/* Strat 1: None */}
                <button
                  onClick={() => {
                    setStrategy("none")
                    setProcessedLog([])
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    strategy === "none"
                      ? "border-rose-500 bg-rose-500/5 text-foreground"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>无优化 (Direct Raw Cloud Call)</span>
                    <Badge variant="outline" className="text-rose-500 border-rose-500/20 text-[9px] bg-rose-500/5">无节制 / 极贵</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal">全量请求无论多简单、多重复，均透传到顶级闭源云端 API，大段上下文耗费极高 Token。</p>
                </button>

                {/* Strat 2: Semantic Cache */}
                <button
                  onClick={() => {
                    setStrategy("cache")
                    setProcessedLog([])
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    strategy === "cache"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>语义缓存 (Semantic Cache)</span>
                    <Badge variant="outline" className="text-primary border-primary/20 text-[9px] bg-primary/5">高重复场景克星</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal">通过 Redis Vector 记录经典问答。遇到语义极为相似的用户提问时，毫米级命中直接返回，不调 API。</p>
                </button>

                {/* Strat 3: Prompt Compression */}
                <button
                  onClick={() => {
                    setStrategy("compress")
                    setProcessedLog([])
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    strategy === "compress"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>提示词信息熵压缩 (Compression)</span>
                    <Badge variant="outline" className="text-purple-400 border-purple-500/20 text-[9px] bg-purple-500/5">RAG 刚需</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal">基于 LLMLingua 等轻量级算法。丢弃上游冗余无用的空词、长尾词，减少 40%-60% 输入 Token。</p>
                </button>

                {/* Strat 4: Hybrid Routing */}
                <button
                  onClick={() => {
                    setStrategy("hybrid")
                    setProcessedLog([])
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    strategy === "hybrid"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>混合推理路由 (Hybrid Smart Router)</span>
                    <Badge variant="outline" className="text-teal-400 border-teal-500/20 text-[9px] bg-teal-500/5">极高吞吐量架构</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal">通过分类判别，简单指令在本地 vLLM（如 Llama-3-8B）瞬间推理；硬核、长多跳任务路由至云端大模型。</p>
                </button>

                {strategy === "cache" && (
                  <div className="pt-4 space-y-2 border-t mt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">语义余弦相似度门禁 (Threshold)</span>
                      <span className="font-mono text-primary font-bold">{cacheThreshold}</span>
                    </div>
                    <Slider
                      value={[cacheThreshold]}
                      onValueChange={(val) => setCacheThreshold(val[0])}
                      max={1.0}
                      min={0.8}
                      step={0.01}
                    />
                    <div className="text-[10px] text-muted-foreground leading-normal">
                      建议设置为 <strong>0.92</strong>。过高无法匹配关联问题，过低则会引发无关回答的误命中。
                    </div>
                  </div>
                )}

                <Button onClick={runSimulation} disabled={isProcessing} className="w-full mt-4 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 fill-current" />
                  {isProcessing ? "并发批处理中..." : "启动并发并发流测试 (Batch Flow)"}
                </Button>

              </CardContent>
            </Card>
          </div>

          {/* Right panel: Live stats & charts */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Real-time stats scoreboard */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-muted/20">
                <div className="text-[10px] text-muted-foreground font-mono uppercase">总批耗时 (Latency)</div>
                <div className="text-xl font-black font-mono mt-1 text-primary">{avgLatency > 0 ? `${avgLatency}ms` : "--"}</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">平均首个字符生成时间</div>
              </Card>

              <Card className="p-4 bg-muted/20">
                <div className="text-[10px] text-muted-foreground font-mono uppercase">总成本账单 (Cost)</div>
                <div className="text-xl font-black font-mono mt-1 text-rose-500">${totalCost.toFixed(6)}</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">基准无优化: ${baseTotalCost.toFixed(5)}</div>
              </Card>

              <Card className="p-4 bg-muted/20">
                <div className="text-[10px] text-muted-foreground font-mono uppercase">节约比例 (Savings)</div>
                <div className="text-xl font-black font-mono mt-1 text-emerald-500">+{costSavingPercentage}%</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">共节省 {savedTokens} 输入 Token</div>
              </Card>
            </div>

            {/* Batch execution logging visualizer */}
            <Card className="h-[380px] flex flex-col justify-between">
              <CardHeader className="py-4 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span>批处理请求路由可视化日志 (Execution Trace Batch)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
                {processedLog.length === 0 ? (
                  <div className="text-center py-24 text-muted-foreground italic">
                    点击左下角启动按钮开始模拟并发请求包拦截...
                  </div>
                ) : (
                  processedLog.map((log) => (
                    <div key={log.id} className="p-3 rounded-lg border bg-card/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-[9px]">{log.id}</Badge>
                          <span className="font-bold text-foreground truncate max-w-[280px]">{log.query}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          {log.hit ? (
                            <Badge className="bg-emerald-500/15 text-emerald-500 text-[9px] hover:bg-emerald-500/15">Cache Hit (命中)</Badge>
                          ) : log.route.includes("vLLM") ? (
                            <Badge className="bg-teal-500/15 text-teal-400 text-[9px] hover:bg-teal-500/15">Local vLLM</Badge>
                          ) : (
                            <Badge className="bg-blue-500/10 text-blue-400 text-[9px]">Gemini 1.5 Cloud</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between font-mono text-[9.5px] text-muted-foreground border-t border-hairline pt-2">
                        <div>
                          <span>路由目标: </span>
                          <span className="text-foreground font-semibold">{log.route}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>耗时: <strong className="text-foreground">{log.latency}ms</strong></span>
                          <span>Token: <strong className="text-foreground">{log.tokens} / {log.originalTokens}</strong></span>
                          <span>账单: <strong className="text-rose-500 font-bold">${log.cost.toFixed(6)}</strong></span>
                        </div>
                      </div>

                      {log.compressed && (
                        <div className="bg-purple-500/5 border border-purple-500/10 p-2 rounded text-[10px] text-purple-400">
                          💡 <strong>Prompt LLMLingua 压缩明细:</strong>
                          已丢弃无用中介词（『如何』『帮我』『请问』以及大段格式性赘述），原信息量 100% 保持的前提下，模型首个 Token 解析耗时由于 KV Cache 尺寸缩小，由 1200ms 下降至 780ms。
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </DemoShell>
  )
}

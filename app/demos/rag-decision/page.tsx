"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, ArrowLeft } from "lucide-react"
import { RagFlowSidebar } from "@/components/rag-flow-sidebar"
import { RagDetailPanel } from "@/components/rag-detail-panel"
import { USER_ID } from "@/lib/rag-data"
import { simulateRetrieval, generateRecommendation } from "@/lib/rag-logic"
import type { RagState } from "@/types/rag"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function RagDecisionDemoPage() {
  const [query, setQuery] = useState("我想吃点温暖、辣的食物,但今天胃不太舒服。")
  const [ragState, setRagState] = useState<RagState | null>(null)
  const [activeStep, setActiveStep] = useState<string>("user-input")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleStartDecision = async () => {
    if (!query.trim()) {
      return
    }

    setIsProcessing(true)
    setActiveStep("user-input")

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const retrievalData = simulateRetrieval(query)
    const generationResult = generateRecommendation(query, retrievalData)

    setRagState({
      query,
      retrievalData,
      generationResult,
    })

    setIsProcessing(false)
  }

  const handleFeedback = (isPositive: boolean) => {
    toast({
      title: isPositive ? "感谢您的反馈!" : "感谢您的反馈!",
      description: isPositive
        ? "您的满意评价已记录，将帮助我们提供更好的推荐。"
        : "您的不满意反馈已记录，系统将调整未来的推荐策略。",
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit">
              <Button
                variant="ghost"
                size="sm"
                className="transition-all duration-300 hover:bg-accent hover:translate-x-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
                  <span className="text-3xl sm:text-4xl">🍜</span>
                  <span className="text-balance leading-tight">企业级 RAG MVP 架构演示</span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  个性化决策系统 - 完整 10 步流程 + 伦理风控
                </p>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1 font-medium w-fit">
                用户 ID: <span className="font-mono ml-1 font-semibold">{USER_ID}</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 sm:py-8">
        <Card className="p-6 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-balance">用户输入与决策启动</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium mb-2 text-foreground">
                您的点餐需求（自然语言）
              </label>
              <Textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="例如：我想吃点温暖、辣的食物,但今天胃不太舒服。"
                className="min-h-[100px] text-base resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                disabled={isProcessing}
              />
            </div>

            <Button
              onClick={handleStartDecision}
              disabled={isProcessing || !query.trim()}
              className="w-full h-12 text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-md disabled:opacity-50"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  RAG 检索与决策中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  启动 RAG 决策引擎
                </>
              )}
            </Button>
          </div>
        </Card>

        {ragState && (
          <Card className="p-6 sm:p-8 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold mb-4 text-foreground">RAG 完整流程</h3>
                <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                  <RagFlowSidebar activeStep={activeStep} onStepClick={setActiveStep} />
                </div>
              </div>

              <div className="lg:col-span-3">
                <RagDetailPanel activeStep={activeStep} ragState={ragState} onFeedback={handleFeedback} />
              </div>
            </div>
          </Card>
        )}

        {!ragState && !isProcessing && (
          <Card className="p-8 sm:p-12 text-center transition-all duration-300 hover:border-primary/30">
            <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              点击上方按钮启动决策流程，体验企业级 RAG 系统的 10 个核心步骤和伦理风控机制
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}

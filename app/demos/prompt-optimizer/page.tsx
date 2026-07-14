"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoShell } from "@/components/demo-shell"

const promptTechniques = [
  {
    id: "basic",
    name: "基础提示词",
    description: "直接描述任务，无额外上下文",
    example: "写一篇关于人工智能的文章。",
    pros: ["简单直接", "快速上手"],
    cons: ["输出质量不稳定", "缺乏控制力"],
    color: "gray",
  },
  {
    id: "cot",
    name: "Chain-of-Thought (CoT)",
    description: "引导模型逐步思考，展示推理过程",
    example: "请一步一步思考，分析人工智能对就业市场的影响。首先考虑...",
    pros: ["提高推理准确性", "过程可解释"],
    cons: ["输出较长", "需要明确指导"],
    color: "blue",
  },
  {
    id: "few-shot",
    name: "Few-Shot Learning",
    description: "提供 2-5 个示例，让模型学习模式",
    example:
      "示例1: 输入: 分析气候变化 → 输出: [详细分析]\n示例2: 输入: 分析经济增长 → 输出: [详细分析]\n\n现在请分析: 人工智能发展",
    pros: ["快速适应新任务", "输出格式可控"],
    cons: ["需要高质量示例", "token 消耗大"],
    color: "emerald",
  },
  {
    id: "role",
    name: "角色设定 (Role-Playing)",
    description: "让模型扮演特定专家角色",
    example: "你是一位有 20 年经验的 AI 研究员。请分析当前大语言模型的技术瓶颈。",
    pros: ["输出更专业", "语气更符合预期"],
    cons: ["可能过度拟合角色", "创造性受限"],
    color: "purple",
  },
  {
    id: "structured",
    name: "结构化输出",
    description: "明确要求特定格式（JSON、Markdown 等）",
    example: '请以 JSON 格式输出分析结果：\n{\n  "主题": "...",\n  "关键点": [...],\n  "结论": "..."\n}',
    pros: ["便于程序解析", "格式一致性高"],
    cons: ["灵活性降低", "可能遗漏细节"],
    color: "amber",
  },
  {
    id: "iterative",
    name: "迭代优化 (Self-Refinement)",
    description: "让模型自我评估并改进输出",
    example: "生成一段文章，然后评估其质量（1-10分），并根据评估结果改进。重复 3 次。",
    pros: ["输出质量更高", "自动纠错"],
    cons: ["API 调用次数多", "成本增加"],
    color: "rose",
  },
]

const comparisonMetrics = [
  { name: "输出质量", basic: 60, cot: 85, fewShot: 90, role: 80, structured: 75, iterative: 95 },
  { name: "推理能力", basic: 50, cot: 95, fewShot: 70, role: 75, structured: 60, iterative: 90 },
  { name: "格式控制", basic: 40, cot: 60, fewShot: 85, role: 65, structured: 100, iterative: 80 },
  { name: "token 效率", basic: 100, cot: 70, fewShot: 50, role: 80, structured: 85, iterative: 30 },
]

export default function PromptOptimizerDemoPage() {
  const [selectedTechnique, setSelectedTechnique] = useState("basic")
  const [userPrompt, setUserPrompt] = useState("写一篇关于量子计算的简短介绍")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedOutput, setGeneratedOutput] = useState("")

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedOutput("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const technique = promptTechniques.find((t) => t.id === selectedTechnique)
    const mockOutput = `
【使用技术: ${technique?.name}】

这是一个模拟输出示例。在实际应用中，这里会显示 LLM 根据不同提示词技术生成的真实内容。

${
  selectedTechnique === "cot"
    ? "1. 首先，我们需要理解量子计算的基本原理...\n2. 接下来，分析其与传统计算的区别...\n3. 最后，总结量子计算的应用前景..."
    : ""
}

${
  selectedTechnique === "few-shot"
    ? "【参考示例模式生成】\n- 定义: 量子计算是...\n- 优势: 相比传统计算...\n- 应用: 在密码学、药物研发等领域..."
    : ""
}

${selectedTechnique === "role" ? "【专家视角】作为量子物理学家，我认为..." : ""}

${
  selectedTechnique === "structured"
    ? '{\n  "主题": "量子计算",\n  "关键概念": ["量子比特", "叠加态", "量子纠缠"],\n  "应用领域": ["密码学", "优化问题", "材料模拟"]\n}'
    : ""
}

输出质量评分: ${comparisonMetrics[0][selectedTechnique as keyof (typeof comparisonMetrics)[0]]}/100
    `.trim()

    setGeneratedOutput(mockOutput)
    setIsGenerating(false)
  }

  return (
    <DemoShell demoId="prompt-optimizer">
      <Tabs defaultValue="techniques" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="techniques" className="text-base">
              📚 提示词技术库
            </TabsTrigger>
            <TabsTrigger value="playground" className="text-base">
              🎯 实战演练场
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-base">
              📊 效果对比分析
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Techniques Library */}
          <TabsContent value="techniques" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promptTechniques.map((technique) => (
                <Card key={technique.id} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      variant="secondary"
                      className={`bg-${technique.color}-100 text-${technique.color}-700 dark:bg-${technique.color}-950 dark:text-${technique.color}-400`}
                    >
                      {technique.name}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{technique.description}</p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">示例:</p>
                      <div className="p-3 bg-muted rounded-lg text-xs font-mono leading-relaxed">
                        {technique.example}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1.5">优势:</p>
                        <ul className="space-y-1">
                          {technique.pros.map((pro, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1.5">局限:</p>
                        <ul className="space-y-1">
                          {technique.cons.map((con, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-amber-500 mt-0.5">⚠</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Playground */}
          <TabsContent value="playground" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">选择提示词技术</h3>

                <div className="space-y-4 mb-6">
                  {promptTechniques.map((technique) => (
                    <div
                      key={technique.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        selectedTechnique === technique.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTechnique(technique.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{technique.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{technique.description}</p>
                        </div>
                        {selectedTechnique === technique.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 ml-3" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">输入您的基础提示词:</label>
                  <Textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="例如: 解释什么是机器学习"
                    className="min-h-[100px]"
                  />

                  <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        生成对比输出
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Output Panel */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">生成结果</h3>

                {generatedOutput ? (
                  <div className="space-y-4">
                    <Badge variant="secondary">
                      使用技术: {promptTechniques.find((t) => t.id === selectedTechnique)?.name}
                    </Badge>
                    <div className="p-4 bg-muted rounded-lg min-h-[400px]">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                        {generatedOutput}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[400px] text-center">
                    <div>
                      <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">选择一个技术并点击生成按钮开始体验</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Tab 3: Comparison */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">提示词技术效果对比</h3>

              <div className="space-y-6">
                {comparisonMetrics.map((metric, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">{metric.name}</h4>
                    <div className="grid grid-cols-6 gap-3">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">基础</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gray-500" style={{ width: `${metric.basic}%` }} />
                        </div>
                        <p className="text-xs font-mono text-center">{metric.basic}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">CoT</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${metric.cot}%` }} />
                        </div>
                        <p className="text-xs font-mono text-center">{metric.cot}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Few-Shot</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${metric.fewShot}%` }} />
                        </div>
                        <p className="text-xs font-mono text-center">{metric.fewShot}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">角色</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: `${metric.role}%` }} />
                        </div>
                        <p className="text-xs font-mono text-center">{metric.role}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">结构化</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${metric.structured}%` }} />
                        </div>
                        <p className="text-xs font-mono text-center">{metric.structured}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">迭代</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500" style={{ width: `${metric.iterative}%` }} />
                        </div>
                        <p className="text-xs font-mono text-center">{metric.iterative}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">选择建议:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>高质量输出：</strong>推荐 迭代优化 或 Few-Shot Learning
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>复杂推理任务：</strong>推荐 Chain-of-Thought 或 迭代优化
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>格式化输出：</strong>推荐 结构化输出
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>成本优先：</strong>推荐 基础提示词 或 角色设定
                    </span>
                  </li>
                </ul>
              </div>
            </Card>
          </TabsContent>
      </Tabs>
    </DemoShell>
  )
}

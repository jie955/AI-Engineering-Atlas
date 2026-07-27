"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Code2,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeExample {
  id: string
  title: string
  description: string
  language: string
  code: string
  expectedOutput?: string
  mockExecution?: () => Promise<MockExecutionResult>
}

interface MockExecutionResult {
  success: boolean
  output: string
  executionTime: number
  highlights?: string[]
}

interface CodeSandboxProps {
  examples: CodeExample[]
  title?: string
  description?: string
}

export function CodeSandbox({ examples, title, description }: CodeSandboxProps) {
  const [activeExample, setActiveExample] = useState(examples[0]?.id || "")
  const [code, setCode] = useState(examples[0]?.code || "")
  const [output, setOutput] = useState<MockExecutionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentExample = examples.find((e) => e.id === activeExample)

  const handleExampleChange = (id: string) => {
    setActiveExample(id)
    const example = examples.find((e) => e.id === id)
    if (example) {
      setCode(example.code)
      setOutput(null)
    }
  }

  const handleRun = useCallback(async () => {
    if (!currentExample?.mockExecution) {
      // Default mock execution
      setIsRunning(true)
      setOutput(null)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setOutput({
        success: true,
        output: currentExample?.expectedOutput || "执行成功！这是模拟输出结果。",
        executionTime: Math.random() * 500 + 200,
        highlights: ["模拟执行完成", "所有测试通过"],
      })
      setIsRunning(false)
      return
    }

    setIsRunning(true)
    setOutput(null)

    try {
      const result = await currentExample.mockExecution()
      setOutput(result)
    } catch {
      setOutput({
        success: false,
        output: "执行出错，请检查代码",
        executionTime: 0,
      })
    } finally {
      setIsRunning(false)
    }
  }, [currentExample])

  const handleReset = () => {
    if (currentExample) {
      setCode(currentExample.code)
      setOutput(null)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              <CardTitle>{title || "代码沙箱"}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Mock 演示
              </Badge>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="bg-transparent"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-1 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              {copied ? "已复制" : "复制"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Example Tabs */}
        {examples.length > 1 && (
          <Tabs value={activeExample} onValueChange={handleExampleChange}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {examples.map((example) => (
                <TabsTrigger key={example.id} value={example.id} className="gap-2">
                  <Sparkles className="w-3 h-3" />
                  {example.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Code Editor */}
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="outline" className="text-xs font-mono">
              {currentExample?.language || "python"}
            </Badge>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={cn(
              "w-full h-64 p-4 font-mono text-sm rounded-lg",
              "bg-zinc-950 text-zinc-100",
              "border border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary",
              "resize-none outline-none"
            )}
            spellCheck={false}
          />
        </div>

        {/* Run Button */}
        <Button
          onClick={handleRun}
          disabled={isRunning}
          className="w-full"
          size="lg"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              执行中...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              运行代码
            </>
          )}
        </Button>

        {/* Output Panel */}
        {(output || isRunning) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">输出结果</span>
            </div>
            <div
              className={cn(
                "p-4 rounded-lg font-mono text-sm",
                "bg-zinc-950 border",
                output?.success === false
                  ? "border-red-500/50"
                  : output?.success
                    ? "border-green-500/50"
                    : "border-zinc-800"
              )}
            >
              {isRunning ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  正在执行...
                </div>
              ) : output ? (
                <div className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {output.success ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={output.success ? "text-green-400" : "text-red-400"}
                    >
                      {output.success ? "执行成功" : "执行失败"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({output.executionTime.toFixed(0)}ms)
                    </span>
                  </div>

                  {/* Output */}
                  <pre className="text-zinc-300 whitespace-pre-wrap">
                    {output.output}
                  </pre>

                  {/* Highlights */}
                  {output.highlights && output.highlights.length > 0 && (
                    <div className="pt-3 border-t border-zinc-800 space-y-1">
                      {output.highlights.map((highlight, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-green-400"
                        >
                          <Check className="w-3 h-3" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Example Description */}
        {currentExample?.description && (
          <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">说明：</strong>{" "}
              {currentExample.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Pre-built example sets for different demos
export const promptExamples: CodeExample[] = [
  {
    id: "basic-prompt",
    title: "基础提示词",
    description: "直接提问，没有任何优化技巧",
    language: "python",
    code: `# 基础提示词示例
prompt = "什么是机器学习？"

response = llm.generate(prompt)
print(response)`,
    expectedOutput: `机器学习是人工智能的一个分支，它使计算机系统能够从数据中学习和改进，
而无需进行明确的编程。通过识别数据中的模式，机器学习算法可以做出预测或决策。

主要类型包括：
- 监督学习
- 无监督学习  
- 强化学习`,
  },
  {
    id: "cot-prompt",
    title: "Chain-of-Thought",
    description: "使用思维链技术，引导模型逐步推理",
    language: "python",
    code: `# Chain-of-Thought 提示词
prompt = """
请逐步分析以下问题：

问题：一个商店有 23 个苹果，卖出 17 个后又进货 12 个，现在有多少个苹果？

让我们一步一步思考：
"""

response = llm.generate(prompt)
print(response)`,
    expectedOutput: `让我们一步一步思考：

步骤 1：初始状态
- 商店最初有 23 个苹果

步骤 2：卖出苹果
- 卖出 17 个苹果
- 剩余：23 - 17 = 6 个苹果

步骤 3：进货
- 又进货 12 个苹果
- 现有：6 + 12 = 18 个苹果

答案：商店现在有 18 个苹果。`,
  },
  {
    id: "few-shot",
    title: "Few-Shot 学习",
    description: "提供示例让模型学习输出格式",
    language: "python",
    code: `# Few-Shot 提示词
prompt = """
将以下文本分类为正面或负面情感：

示例 1：
文本："这个产品太棒了，我非常喜欢！"
情感：正面

示例 2：
文本："质量很差，完全不值这个价格。"
情感：负面

示例 3：
文本："包装精美，物流很快，下次还会购买。"
情感：正面

现在请分类：
文本："虽然有点小瑕疵，但整体还是很满意的。"
情感：
"""

response = llm.generate(prompt)
print(response)`,
    expectedOutput: `情感：正面

分析：
- "整体还是很满意的" 表达了积极的整体评价
- "虽然有点小瑕疵" 是轻微的负面因素，但被"但"字转折
- 总体倾向为正面情感`,
  },
]

export const ragExamples: CodeExample[] = [
  {
    id: "vector-search",
    title: "向量检索",
    description: "使用向量相似度搜索相关文档",
    language: "python",
    code: `# RAG 向量检索示例
from rag_engine import VectorStore, Embedder

# 初始化
embedder = Embedder("text-embedding-ada-002")
vector_store = VectorStore("knowledge_base")

# 用户查询
query = "如何提高 RAG 系统的准确率？"

# 生成查询向量
query_embedding = embedder.embed(query)

# 检索相关文档
results = vector_store.search(
    query_embedding,
    top_k=3,
    threshold=0.75
)

for doc in results:
    print(f"相关度: {doc.score:.2f}")
    print(f"内容: {doc.content[:100]}...")
    print("---")`,
    expectedOutput: `检索完成，找到 3 个相关文档：

相关度: 0.92
内容: RAG 系统准确率优化的关键在于检索质量。建议采用混合检索策略，
结合稀疏检索（BM25）和密集检索（向量）...
---

相关度: 0.87
内容: 文档切块策略对 RAG 效果影响显著。推荐使用语义切块而非固定长度切块，
保持上下文完整性...
---

相关度: 0.81
内容: Reranker 重排序模型可以显著提升检索精度。在初次检索后使用交叉编码器
对候选文档重新打分...
---`,
  },
  {
    id: "context-assembly",
    title: "上下文组装",
    description: "将检索结果组装成 LLM 提示词",
    language: "python",
    code: `# 上下文组装示例
def assemble_context(query, retrieved_docs, max_tokens=2000):
    """
    将检索到的文档组装成结构化上下文
    """
    context_parts = []
    current_tokens = 0
    
    for i, doc in enumerate(retrieved_docs):
        doc_tokens = count_tokens(doc.content)
        if current_tokens + doc_tokens > max_tokens:
            break
            
        context_parts.append(f"""
[文档 {i+1}] (相关度: {doc.score:.2f})
来源: {doc.metadata.get('source', '未知')}
内容: {doc.content}
""")
        current_tokens += doc_tokens
    
    prompt = f"""
基于以下参考资料回答用户问题。
如果资料中没有相关信息，请明确说明。

参考资料：
{''.join(context_parts)}

用户问题：{query}

请提供准确、有依据的回答：
"""
    return prompt

# 使用示例
final_prompt = assemble_context(query, results)
response = llm.generate(final_prompt)`,
    expectedOutput: `上下文组装完成！

Prompt 结构：
├── 系统指令 (50 tokens)
├── 参考资料
│   ├── 文档 1 (320 tokens) - 相关度 0.92
│   ├── 文档 2 (280 tokens) - 相关度 0.87
│   └── 文档 3 (250 tokens) - 相关度 0.81
├── 用户问题 (15 tokens)
└── 输出指令 (20 tokens)

总计: 935 tokens (在 2000 限制内)

生成的回答：
基于检索到的文档，提高 RAG 系统准确率的方法包括：
1. 采用混合检索策略
2. 使用语义切块
3. 添加 Reranker 重排序...`,
  },
]

export const agentExamples: CodeExample[] = [
  {
    id: "agent-loop",
    title: "Agent 循环",
    description: "ReAct 模式的思考-行动循环",
    language: "python",
    code: `# Agent ReAct 循环
class Agent:
    def __init__(self, llm, tools):
        self.llm = llm
        self.tools = tools
        self.memory = []
    
    def run(self, task):
        """ReAct 循环执行任务"""
        while True:
            # 1. 思考 (Reason)
            thought = self.think(task)
            print(f"思考: {thought}")
            
            # 2. 决策
            action = self.decide_action(thought)
            
            if action.type == "finish":
                return action.result
            
            # 3. 执行 (Act)
            observation = self.execute(action)
            print(f"观察: {observation}")
            
            # 4. 更新记忆
            self.memory.append({
                "thought": thought,
                "action": action,
                "observation": observation
            })

# 执行任务
agent = Agent(llm, [search_tool, calculator_tool])
result = agent.run("北京今天天气怎么样？适合户外活动吗？")`,
    expectedOutput: `Agent 开始执行任务...

[循环 1]
思考: 用户想知道北京的天气情况，我需要先查询天气数据
行动: search_weather(city="北京")
观察: 北京今日天气：晴，气温 22-28°C，空气质量良好，紫外线中等

[循环 2]
思考: 已获取天气信息，天气晴朗、温度适宜，可以给出建议了
行动: finish(result="综合分析结果")
观察: 任务完成

最终回答：
北京今天天气晴朗，气温 22-28°C，空气质量良好。
这样的天气非常适合户外活动！建议：
- 上午 9-11 点或下午 4-6 点出行最佳
- 注意防晒，紫外线中等
- 适合进行跑步、骑行、野餐等户外活动`,
  },
]

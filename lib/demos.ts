export type Difficulty = "入门" | "基础" | "中级" | "高级" | "专家"
export type Category = "大模型" | "Agent" | "RAG" | "工程化"

export interface Demo {
  id: string
  title: string
  description: string
  category: Category
  difficulty: Difficulty
  status: "active" | "coming-soon"
  estimatedTime: number
  track: number
}

export const demos: Demo[] = [
  {
    id: "prompt-optimizer",
    title: "提示词工程优化",
    description: "系统化提示词设计方法论 - Chain-of-Thought 到 Few-Shot 学习",
    category: "大模型",
    difficulty: "入门",
    status: "active",
    estimatedTime: 30,
    track: 0,
  },
  {
    id: "context-engineering",
    title: "上下文工程",
    description: "优化信息结构提升输出质量 - 5 种策略 + 核心维度 + 实战案例",
    category: "大模型",
    difficulty: "基础",
    status: "active",
    estimatedTime: 45,
    track: 0,
  },
  {
    id: "mcp-engineering",
    title: "MCP 工程",
    description: "Model Context Protocol 标准协议 - 架构设计 + 实现指南 + 应用场景",
    category: "工程化",
    difficulty: "基础",
    status: "active",
    estimatedTime: 40,
    track: 1,
  },
  {
    id: "skill-engineering",
    title: "SKILL 工程",
    description: "Anthropic Skills 标准 - 技能定义 + 文档驱动 + 最佳实践",
    category: "工程化",
    difficulty: "中级",
    status: "active",
    estimatedTime: 50,
    track: 1,
  },
  {
    id: "single-agent",
    title: "单一智能体架构",
    description: "基于 LLM 的自主决策循环 - 规划、工具调用与反思机制",
    category: "Agent",
    difficulty: "基础",
    status: "active",
    estimatedTime: 60,
    track: 2,
  },
  {
    id: "agent-runtime-loop",
    title: "Agent Runtime Loop",
    description: "实时运行时循环模拟 - Think→Plan→Act→Observe→Reflect 动画演示",
    category: "Agent",
    difficulty: "中级",
    status: "active",
    estimatedTime: 50,
    track: 2,
  },
  {
    id: "memory-engineering",
    title: "记忆工程",
    description: "Agent 分层记忆系统 - 记忆分层 + 写入检索遗忘 + 检索打分机制",
    category: "Agent",
    difficulty: "中级",
    status: "active",
    estimatedTime: 55,
    track: 2,
  },
  {
    id: "rag-decision",
    title: "RAG 个性化决策系统",
    description: "企业级 RAG MVP 架构演示 - 完整 10 步流程 + 伦理风控机制",
    category: "RAG",
    difficulty: "中级",
    status: "active",
    estimatedTime: 75,
    track: 2,
  },
  {
    id: "graph-rag",
    title: "GraphRAG 图检索增强",
    description: "基于知识图谱的检索增强生成 - 实体关系推理与多跳查询",
    category: "RAG",
    difficulty: "高级",
    status: "active",
    estimatedTime: 90,
    track: 3,
  },
  {
    id: "multi-agent-system",
    title: "多智能体协作系统",
    description: "复杂任务分解与角色专业化 - 5 个协作 Agent 完整流程",
    category: "Agent",
    difficulty: "专家",
    status: "active",
    estimatedTime: 120,
    track: 3,
  },
  {
    id: "harness-engineering",
    title: "Harness Engineering",
    description: "Agent = Model + Harness - 6 大组件 + 失败模式 + 企业实战案例",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 90,
    track: 3,
  },
  {
    id: "loop-engineering",
    title: "Loop Engineering",
    description: "设计自我驱动的 Agent 循环 - 6 大组件 + 循环流程 + 风险边界",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 80,
    track: 3,
  },
]

export const categories: Category[] = ["大模型", "Agent", "RAG", "工程化"]

export const difficultyOrder: Difficulty[] = ["入门", "基础", "中级", "高级", "专家"]

export function getDemo(id: string): Demo | undefined {
  return demos.find((d) => d.id === id)
}

export function getDemosByTrack(track: number): Demo[] {
  return demos.filter((d) => d.track === track)
}

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
    title: "提示工程 (Prompt Engineering)",
    description: "从直觉到系统：CoT 推理链与 Few-Shot 范式的设计方法论",
    category: "大模型",
    difficulty: "入门",
    status: "active",
    estimatedTime: 30,
    track: 0,
  },
  {
    id: "context-engineering",
    title: "上下文工程 (Context Engineering)",
    description: "用信息架构思维重构上下文 - 5 种窗口策略与维度控制",
    category: "大模型",
    difficulty: "入门",
    status: "active",
    estimatedTime: 45,
    track: 0,
  },
  {
    id: "structured-outputs",
    title: "结构化输出与类型安全 (Structured Outputs)",
    description: "从自由文本到契约代码 - Pydantic 约束、Instructor 编排与优雅降级",
    category: "大模型",
    difficulty: "入门",
    status: "active",
    estimatedTime: 45,
    track: 0,
  },
  {
    id: "function-calling",
    title: "原生 Function Calling 闭环原理 (Function Calling)",
    description: "抛开框架手写工具调用闭环 - 原生 SDK 实现声明、拦截、执行与回传",
    category: "大模型",
    difficulty: "基础",
    status: "active",
    estimatedTime: 35,
    track: 1,
  },
  {
    id: "mcp-engineering",
    title: "MCP 工程 (Model Context Protocol)",
    description: "MCP 标准协议深度拆解 - 架构设计、服务端实现与生态接入",
    category: "工程化",
    difficulty: "基础",
    status: "active",
    estimatedTime: 40,
    track: 1,
  },
  {
    id: "skill-engineering",
    title: "技能工程 (Skill Engineering)",
    description: "Anthropic Skills 标准实战 - 技能定义、文档驱动与可复用编排",
    category: "工程化",
    difficulty: "中级",
    status: "active",
    estimatedTime: 50,
    track: 1,
  },
  {
    id: "single-agent",
    title: "单一智能体架构 (Single Agent)",
    description: "LLM 自主决策循环设计 - 规划、工具调用与反思的闭环架构",
    category: "Agent",
    difficulty: "基础",
    status: "active",
    estimatedTime: 60,
    track: 2,
  },
  {
    id: "agent-runtime-loop",
    title: "智能体运行时循环 (Agent Runtime Loop)",
    description: "运行时循环可视化 - Think→Plan→Act→Observe→Reflect 全链路推演",
    category: "Agent",
    difficulty: "中级",
    status: "active",
    estimatedTime: 50,
    track: 2,
  },
  {
    id: "memory-engineering",
    title: "记忆工程 (Memory Engineering)",
    description: "Agent 记忆分层架构 - 写入、检索、遗忘与相关性打分机制",
    category: "Agent",
    difficulty: "中级",
    status: "active",
    estimatedTime: 55,
    track: 2,
  },
  {
    id: "rag-decision",
    title: "RAG 个性化决策系统 (RAG Decision)",
    description: "企业级 RAG 全链路架构 - 从检索到生成的 10 步闭环与风控",
    category: "RAG",
    difficulty: "中级",
    status: "active",
    estimatedTime: 75,
    track: 2,
  },
  {
    id: "human-in-the-loop",
    title: "人机协同 (Human-in-the-Loop)",
    description: "人机协同状态机设计 - 审批节点、断点续传与运行时序列化",
    category: "Agent",
    difficulty: "中级",
    status: "active",
    estimatedTime: 60,
    track: 2,
  },
  {
    id: "multimodal-rag",
    title: "多模态 RAG 与高级解析工程 (Multimodal RAG)",
    description: "多模态文档解析与检索 - Vision-Chunking、Late Chunking 与跨模态对齐",
    category: "RAG",
    difficulty: "高级",
    status: "active",
    estimatedTime: 75,
    track: 3,
  },
  {
    id: "graph-rag",
    title: "图检索增强 (GraphRAG)",
    description: "知识图谱驱动的检索增强 - 实体推理、多跳查询与关系演化",
    category: "RAG",
    difficulty: "高级",
    status: "active",
    estimatedTime: 90,
    track: 3,
  },
  {
    id: "multi-agent-system",
    title: "多智能体协作系统 (Multi-Agent System)",
    description: "多 Agent 协作与合规风控 - 并行评估、一票升级与人工复核门控",
    category: "Agent",
    difficulty: "专家",
    status: "active",
    estimatedTime: 120,
    track: 3,
  },
  {
    id: "harness-engineering",
    title: "智能体运行框架工程 (Harness Engineering)",
    description: "Agent Harness 架构设计 - 6 大组件、失败模式与企业级容错",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 90,
    track: 3,
  },
  {
    id: "loop-engineering",
    title: "循环工程 (Loop Engineering)",
    description: "自驱动 Agent 循环设计 - 6 大组件、流程编排与风险边界控制",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 80,
    track: 3,
  },
  {
    id: "evaluation-engineering",
    title: "评估工程 (Evaluation)",
    description: "LLM-as-a-Judge 评估体系 - 轨迹评估、断言测试与 CI/CD 自动化回归",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 80,
    track: 4,
  },
  {
    id: "observability",
    title: "可观测性与追踪 (Observability)",
    description: "生产级 Agent 全链路追踪 - OpenTelemetry 拓扑、Token 波峰与 TTFT 诊断",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 70,
    track: 4,
  },
  {
    id: "finops-performance",
    title: "性能与成本工程 (FinOps)",
    description: "高并发降本增效实战 - 语义缓存、提示词压缩与混合路由架构",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 65,
    track: 4,
  },
  {
    id: "guardrails",
    title: "安全护栏工程 (Guardrails)",
    description: "Agent 输入输出安全治理 - 提示词注入防御、PII 脱敏与实时拦截",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 60,
    track: 4,
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

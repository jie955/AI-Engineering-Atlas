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
    title: "Prompt Engineering",
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
    id: "structured-outputs",
    title: "结构化输出与类型安全",
    description: "从“生成文本”到“生成系统代码”的安全桥梁 - Pydantic、Instructor 与优雅降级重试策略",
    category: "大模型",
    difficulty: "基础",
    status: "active",
    estimatedTime: 45,
    track: 0,
  },
  {
    id: "function-calling",
    title: "原生 Function Calling 闭环原理",
    description: "定位：抛开框架，手写工具调用的底层运行时。核心内容：* 大模型如何识别 tools 声明并生成特殊的 <tool_call> 标记。无框架实战：纯原生 SDK 手写一个 Tool-use 运行循环（API 声明 -> 模型生成 tool_call -> 本地 Python 拦截并执行代码 -> 结果喂回模型 -> 最终回复）。",
    category: "工程化",
    difficulty: "基础",
    status: "active",
    estimatedTime: 35,
    track: 1,
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
    id: "human-in-the-loop",
    title: "人机协同 (Human-in-the-Loop)",
    description: "状态机暂停与唤醒机制 - 运行时状态序列化、人工介入审批（Human Approval）节点设计、断点续传与记忆回溯",
    category: "Agent",
    difficulty: "中级",
    status: "active",
    estimatedTime: 60,
    track: 2,
  },
  {
    id: "multimodal-rag",
    title: "多模态 RAG 与高级解析工程",
    description: "混合文档解析流 - 复杂表格处理与 Vision-Chunking 策略、Late Chunking（延迟切片）技术应用、跨模态对齐检索",
    category: "RAG",
    difficulty: "高级",
    status: "active",
    estimatedTime: 75,
    track: 3,
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
    description: "含合规风控实战 - 银行交易实时监测、并行子 Agent 评估、一票升级与人工复核门控",
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
  {
    id: "evaluation-engineering",
    title: "评估工程 (Evaluation)",
    description: "LLM-as-a-Judge 与自动化评估体系 - 基于 Ragas / Promptfoo 的轨迹（Trajectory）评估、断言测试与 CI/CD 自动化回归",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 80,
    track: 4,
  },
  {
    id: "observability",
    title: "可观测性与追踪 (Trace)",
    description: "生产级多步 Agent 拓扑追踪 - 基于 OpenTelemetry / LangSmith 的全链路 Trace、Token 消耗波峰监控与首字延迟（TTFT）瓶颈诊断",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 70,
    track: 4,
  },
  {
    id: "finops-performance",
    title: "性能与成本工程 (FinOps)",
    description: "高并发下的降本增效 - 语义缓存（Semantic Cache）设计、提示词压缩（Prompt Compression）技巧、混合路由架构",
    category: "工程化",
    difficulty: "专家",
    status: "active",
    estimatedTime: 65,
    track: 4,
  },
  {
    id: "guardrails",
    title: "安全防御与护栏 (Guard)",
    description: "动态对抗与输入输出治理 - 针对 Agent 工具调用的提示词注入防御、PII 脱敏、基于 Llama Guard 的实时拦截",
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

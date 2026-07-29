// Mock data store with localStorage persistence
// This simulates a backend database for MVP demo purposes
// Can be easily replaced with real API calls later

export interface UserProgress {
  demoId: string
  progress: number
  completed: boolean
  lastVisited: string
  timeSpent: number // in minutes
}

export interface Bookmark {
  id: string
  demoId: string
  title: string
  category: string
  createdAt: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  demos: string[]
  estimatedHours: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  level: "beginner" | "intermediate" | "advanced"
  interests: string[]
  joinedAt: string
  streak: number
}

// Track-based learning system (inspired by AgentWay)
export interface Track {
  id: string
  number: number
  title: string
  subtitle: string
  description: string
  estimatedHours: number
  demos: string[]
  capstone?: {
    title: string
    description: string
  }
}

export const tracks: Track[] = [
  {
    id: "track-0",
    number: 0,
    title: "准备",
    subtitle: "Preparation",
    description: "打好大模型交互基础，理解提示词与上下文的本质",
    estimatedHours: 3,
    demos: ["prompt-engineering-techniques", "prompt-optimizer", "context-engineering", "structured-outputs"],
  },
  {
    id: "track-1",
    number: 1,
    title: "觉醒",
    subtitle: "Awakening",
    description: "掌握工程化基础设施：协议、技能与标准化接口",
    estimatedHours: 4,
    demos: ["function-calling", "mcp-engineering", "skill-engineering"],
    capstone: {
      title: "构建你的第一个 AI 工具",
      description: "整合 MCP 和 Skill，创建一个可复用的 AI 工具包",
    },
  },
  {
    id: "track-2",
    number: 2,
    title: "锻造",
    subtitle: "Forging",
    description: "深入 Agent 与 RAG 核心架构，掌握运行时循环与记忆系统",
    estimatedHours: 10,
    demos: ["single-agent", "agent-runtime-loop", "memory-engineering", "rag-decision", "human-in-the-loop"],
    capstone: {
      title: "智能客服助手",
      description: "结合 RAG 和 Agent，构建一个能检索知识库并自主回答的助手",
    },
  },
  {
    id: "track-3",
    number: 3,
    title: "远征",
    subtitle: "Expedition",
    description: "挑战生产级架构：图检索、多智能体协作与 Agent 系统工程",
    estimatedHours: 17,
    demos: ["agent-orchestration", "multimodal-rag", "graph-rag", "multi-agent-system", "harness-engineering", "loop-engineering"],
    capstone: {
      title: "企业级 AI 系统",
      description: "设计并实现一个完整的多 Agent + GraphRAG 企业解决方案",
    },
  },
  {
    id: "track-4",
    number: 4,
    title: "统御",
    subtitle: "Dominance",
    description: "挑战生产级运维：构建非确定性系统的可观测性、自动化评估与安全护栏",
    estimatedHours: 5,
    demos: ["evaluation-engineering", "observability", "finops-performance", "guardrails"],
    capstone: {
      title: "生产级 Agent 安全防线与评估系统",
      description: "构建包含可观测性、LLM-as-a-Judge 与实时安全防线（Guardrails）的闭环生产级 Agent 运维系统",
    },
  },
]

// Flashcards for each demo
export interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: "easy" | "medium" | "hard"
}

export const flashcards: Record<string, Flashcard[]> = {
  "prompt-optimizer": [
    { id: "po-1", front: "什么是 Chain-of-Thought (CoT)?", back: "一种提示技术，引导 LLM 逐步推理，展示中间思考过程，从而提高复杂问题的解答准确性。", difficulty: "easy" },
    { id: "po-2", front: "Few-Shot 学习的核心原理是什么?", back: "通过在提示中提供少量示例，让模型学习期望的输入-输出模式，无需微调即可适应新任务。", difficulty: "medium" },
    { id: "po-3", front: "如何设计有效的系统提示词?", back: "1) 明确角色和任务 2) 提供上下文约束 3) 定义输出格式 4) 包含示例 5) 设置边界条件", difficulty: "hard" },
  ],
  "context-engineering": [
    { id: "ce-1", front: "上下文窗口的主要限制是什么?", back: "Token 数量限制、注意力稀释、处理成本增加、响应延迟等。", difficulty: "easy" },
    { id: "ce-2", front: "动态上下文策略的核心思想?", back: "根据任务需求实时调整上下文内容，只包含当前最相关的信息，避免信息过载。", difficulty: "medium" },
  ],
  "structured-outputs": [
    { id: "so-1", front: "为什么说不加约束的 JSON 格式是工程灾难？", back: "大模型输出的 JSON 容易出现结构残缺、缺少必填字段、类型错误或多余的逗号，直接调用 json.loads() 极易抛出解析异常导致程序崩溃。", difficulty: "easy" },
    { id: "so-2", front: "Pydantic 在大模型结构化输出中的核心地位是什么？", back: "利用 Python 的类型提示进行运行时数据校验和设置默认值，能直接定义输出数据的 Schema 结构并自动过滤非法字段，是保证数据流向类型安全的核心工具。", difficulty: "medium" },
    { id: "so-3", front: "使用 Instructor 库相比原生 JSON Schema 有什么优势？", back: "Instructor 通过对 Pydantic 的封装，能在检测到 JSON 校验失败时将错误信息反馈给 LLM，实现自动的“自愈”（Self-Correction）和自适应重试，极大提升系统鲁棒性。", difficulty: "hard" },
  ],
  "function-calling": [
    { id: "fc-1", front: "大模型如何知道应该调用哪个 Tool？", back: "通过在 API 请求中传递特定格式 of JSON Schema 工具声明，大模型根据用户自然语言请求进行语义匹配，在需要时返回符合该 Schema 的特定结构化标记（如 JSON 形式 of tool_calls）。", difficulty: "easy" },
    { id: "fc-2", front: "手写原生 Tool-use 闭环中，本地代码拦截的作用是什么？", back: "本地客户端（如 Python/Node.js）拦截大模型生成的 tool_call 标识，解析出函数名与参数，然后在本地沙箱/受控环境中执行对应的实体代码，并安全捕获执行结果。", difficulty: "medium" },
    { id: "fc-3", front: "为什么手写 Function Calling 循环时需要将结果喂回模型？", back: "大模型本身无法执行外部代码，必须由本地运行时将工具执行结果封装为特定角色（如 tool 角色）的上下文重新送入大模型，模型才能完成“生成最终回复”的闭环。", difficulty: "hard" },
  ],
  "single-agent": [
    { id: "sa-1", front: "Agent 循环的基本组成部分?", back: "感知(Perceive) -> 思考(Think) -> 行动(Act) -> 观察(Observe) 的循环迭代。", difficulty: "easy" },
    { id: "sa-2", front: "ReAct 模式是什么?", back: "Reasoning + Acting 的结合，Agent 交替进行推理和行动，每次行动前先思考，行动后观察结果再继续推理。", difficulty: "medium" },
  ],
  "agent-runtime-loop": [
    { id: "arl-1", front: "Agent Runtime Loop 的 5 个阶段?", back: "Think(思考) -> Plan(规划) -> Act(行动) -> Observe(观察) -> Reflect(反思)，循环迭代。", difficulty: "easy" },
    { id: "arl-2", front: "运行时循环为什么需要终止条件?", back: "避免无限循环。常见终止条件：目标达成、达到最大迭代次数、错误超过阈值。", difficulty: "medium" },
    { id: "arl-3", front: "执行轨迹 (Execution Trace) 的作用?", back: "记录每个阶段的输入输出，便于调试、回放和审计 Agent 行为，是可观测性的基础。", difficulty: "medium" },
  ],
  "rag-decision": [
    { id: "rd-1", front: "RAG 的三个核心阶段?", back: "检索(Retrieve) -> 增强(Augment) -> 生成(Generate)", difficulty: "easy" },
    { id: "rd-2", front: "文档切块的最佳实践?", back: "1) 保持语义完整性 2) 适当重叠 3) 考虑检索粒度 4) 保留元数据 5) 处理跨块引用", difficulty: "hard" },
  ],
  "graph-rag": [
    { id: "gr-1", front: "GraphRAG 相比传统 RAG 的优势?", back: "支持多跳推理、保留实体关系、更好的上下文理解、可解释的推理路径。", difficulty: "medium" },
    { id: "gr-2", front: "知识图谱的三元组结构?", back: "(主体, 关系, 客体) - 例如 (北京, 是首都of, 中国)", difficulty: "easy" },
  ],
  "multi-agent-system": [
    { id: "ma-1", front: "多 Agent 系统的协作模式有哪些?", back: "顺序协作、并行协作、辩论式协作、层级式协作、市场式协作。", difficulty: "medium" },
    { id: "ma-2", front: "Agent 角色专业化的好处?", back: "任务分解更清晰、专业能力更强、错误隔离更好、可扩展性更高。", difficulty: "easy" },
  ],
  "harness-engineering": [
    { id: "he-1", front: "Harness Engineering 的核心公式是什么?", back: "Agent = Model + Harness。模型提供智能，Harness 让智能变得可用。", difficulty: "easy" },
    { id: "he-2", front: "Harness 的 6 大核心组件是什么?", back: "上下文工程、工具编排、状态与记忆、验证与安全、人机协作、生命周期管理。", difficulty: "medium" },
    { id: "he-3", front: "什么是上下文腐烂 (Context Rot)?", back: "长时间运行的任务中，上下文积累噪音，模型无法识别当前重要信息，导致重复解决问题或丢失目标。", difficulty: "medium" },
    { id: "he-4", front: "验证循环 (Verification Loops) 的作用是什么?", back: "在 Agent 输出到达真实世界前进行检查，是投入产出比最高的 Harness 组件，可将任务完成率从 83% 提升到 96%。", difficulty: "hard" },
  ],
  "loop-engineering": [
    { id: "le-1", front: "Loop Engineering 的核心思想是什么?", back: "你不再逐条 prompt Agent，而是设计一个能自我发现工作、派发、验证、记录并决定下一步的循环系统，让它去 prompt Agent。", difficulty: "easy" },
    { id: "le-2", front: "循环的 5+1 个组件是什么?", back: "自动化、工作树隔离、技能、插件/连接器、子 Agent，加上第六个：状态与记忆。", difficulty: "medium" },
    { id: "le-3", front: "为什么记忆必须落在磁盘而非上下文?", back: "模型在两次运行之间会遗忘一切，记忆必须外置（markdown/Linear）才能让明天的运行接续今天。Agent 会忘，但仓库不会。", difficulty: "medium" },
    { id: "le-4", front: "为什么要分离造者与验者子 Agent?", back: "写代码的模型太容易给自己打高分。循环在你不看时运行，一个独立的验证者是你敢走开的唯一理由。/goal 底层就是这个机制。", difficulty: "hard" },
    { id: "le-5", front: "Loop Engineering 与 Harness Engineering 的关系?", back: "Loop 位于 Harness 之上。Harness 是单个 Agent 运行的环境，Loop 让它定时运行、派生助手、自我喂养。", difficulty: "medium" },
  ],
  "evaluation-engineering": [
    { id: "ee-1", front: "什么是 LLM-as-a-Judge？", back: "利用一个能力更强的 LLM（如 GPT-4o 或 Gemini 1.5 Pro）作为裁判，根据预设的准则和评分量表对另一个模型的输出或整个 Agent 轨迹进行自动化评估打分。", difficulty: "easy" },
    { id: "ee-2", front: "为什么评估 Agent 必须采用轨迹（Trajectory）评估而非单步输入输出？", back: "Agent 是多步循环的。只评估最终输出会忽略中间可能发生的工具滥用、无限死循环或安全性漏洞。必须对整个 Think-Plan-Act 决策链条进行端到端审查。", difficulty: "medium" },
    { id: "ee-3", front: "如何在 CI/CD 中实施 LLM 回归测试？", back: "通过 Promptfoo 或 Ragas 编写评估断言文件（Assertion），在代码推送时自动触发自动化测试集，通过断言匹配和判官模型对新版本的 Prompt 或 Agent 逻辑进行回归检测，并提供可视化报表。", difficulty: "hard" }
  ],
  "observability": [
    { id: "ob-1", front: "什么是 TTFT（首字延迟），为什么它在 Agent 中极为关键？", back: "TTFT（Time to First Token）是模型输出第一个字符所耗费的时间。对于多步 Agent 循环，TTFT 决定了人机交互的即时反馈感。如果多步工具调用发生时用户感知不到进展，体验会极差，需要分阶段 Streaming 传输或前置输出。", difficulty: "medium" },
    { id: "ob-2", front: "OpenTelemetry 在 LLMOps 链路追踪中的作用？", back: "它可以跨越网络 and 进程边界，在分布式系统中传播 Context（如 traceparent 头部），把用户请求、Agent 思考、多步工具调用和多次模型交互完整串联成一棵单向无环的追踪树。", difficulty: "hard" },
    { id: "ob-3", front: "LangSmith 和 LangFuse 的核心功能？", back: "提供专门面向 LLM 调用的可观测性大屏，记录详细的 Prompt 输入输出、Token 消耗波峰监控、延迟时间线、工具调用参数和人工反馈标注。", difficulty: "easy" }
  ],
  "finops-performance": [
    { id: "fp-1", front: "什么是语义缓存（Semantic Cache）？", back: "区别于传统 Redis 键值完全匹配，语义缓存利用 Embedding 向量检索。当用户的自然语言请求与已缓存问题在语义上高度相似（如余弦相似度大于 0.95）时，直接返回缓存中的优质回复，避免高昂的 LLM 调用和时间延迟。", difficulty: "medium" },
    { id: "fp-2", front: "提示词压缩（Prompt Compression）技巧的原理？", back: "通过精简上下文冗余、移除停用词，或者使用轻量级小模型（如 LLMLingua）计算信息熵，剔除贡献度极低的 Token，从而在保证大模型生成质量不受影响的同时，降低 Input Token 成本并提升推理速度。", difficulty: "hard" },
    { id: "fp-3", front: "多云 API 与本地推理的混合路由架构是什么？", back: "根据任务复杂度和并发流量，动态路由请求：简单常见问题分流至超低成本的本地 vLLM 轻量化模型；复杂推理或高难逻辑路由至多云厂商的顶级大模型，实现极佳的性价比平衡。", difficulty: "hard" }
  ],
  "guardrails": [
    { id: "gr-1", front: "提示词注入（Prompt Injection）防御的主要思路？", back: "1) 在系统提示词（System Prompt）中设立严格的边界防护罩；2) 借助独立的轻量级拦截模型（如 Llama Guard）对输入输出进行过滤；3) 将用户输入包装在清晰的分隔符中，切断输入被当成系统指令执行的可能。", difficulty: "medium" },
    { id: "gr-2", front: "如何在 LLMOps 中实施隐私数据（PII）脱敏？", back: "在将文本送往外部大模型 API 之前，通过本地的命名实体识别（NER）或高精度正则引擎，识别并屏蔽身份证号、手机号、真实姓名、邮箱等个人隐私数据，用占位符（如 [PHONE_NUMBER]）替换，大模型返回后再还原。", difficulty: "hard" },
    { id: "gr-3", front: "Llama Guard 的定位和工作模式是什么？", back: "由 Meta 开源的专门用于安全治理的微调模型。可以作为一个极为快速的输入输出看门狗（Guardrail），对违规类别（如暴力、自残、隐私泄漏、提示词注入等）进行实时双向拦截，输出为安全（safe）或不安全（unsafe）。", difficulty: "easy" }
  ],
  "human-in-the-loop": [
    { id: "hitl-1", front: "什么是人机协同（Human-in-the-Loop, HITL）？", back: "指在人工智能系统的自动化处理循环中引入人类反馈、审批或修正机制。当模型置信度低或处于高风险决策节点时，系统主动暂停，待人工干预后继续，以防范系统失控并保证业务合规性。", difficulty: "easy" },
    { id: "hitl-2", front: "状态机暂停与唤醒机制如何设计？", back: "通过对运行时状态序列化（如 JSON/DB 记录）并保存上下文 ID，挂起执行流程并发送审批通知；收到人类反馈的 Webhook 唤醒信号后，反序列化加载先前状态并恢复调用链继续运行。", difficulty: "medium" },
    { id: "hitl-3", front: "人机协同中的断点续传与记忆回溯有什么作用？", back: "让 Agent 在被人类中断、修正或驳回后，能够无缝返回到特定的执行历史断点，重新组装最新的修订记忆，并沿着正确的逻辑链路重新发起试错和执行。", difficulty: "hard" }
  ],
  "multimodal-rag": [
    { id: "mr-1", front: "多模态 RAG 面临的最核心工程痛点是什么？", back: "企业真实资产中包含大量的非结构化复杂表格、嵌入图表和多维视觉元素，传统纯文本解析器无法精准提取，极易导致内容错乱和语义丢失，因此必须依赖多模态高精度混合解析流。", difficulty: "easy" },
    { id: "mr-2", front: "什么是 Vision-Chunking（视觉切片）策略？", back: "对含有丰富视觉布局的 PDF/PPT，不再将其强行转化为混乱的 Raw Text，而是利用 Layout-Aware 模型或 OCR，将含有图表/复杂排版的页面切分为“视觉图像块”与“对应 OCR 文本”，保留原始视觉位置与语义关系。", difficulty: "medium" },
    { id: "mr-3", front: "Late Chunking（延迟切片）技术应用与跨模态对齐检索的原理？", back: "对整个完整长文档先进行全文本级 Embedding 编码生成上下文敏感的全局向量表示，然后再按照语义段落/章节进行切片（Chunking），使得每个 Chunk 的向量都融入了完整的全局背景语义，极大地提高了检索精度。", difficulty: "hard" }
  ],
}

// Market demand data
export const marketDemand = {
  companies: [
    { name: "字节跳动", roles: ["AI Agent 工程师", "RAG 系统架构师"], logo: "bytedance" },
    { name: "腾讯", roles: ["LLM 应用开发", "智能体平台工程师"], logo: "tencent" },
    { name: "阿里巴巴", roles: ["AI 基础设施工程师", "多模态 Agent 开发"], logo: "alibaba" },
    { name: "百度", roles: ["文心一言应用开发", "知识图谱工程师"], logo: "baidu" },
  ],
  stats: {
    jobGrowth: "340%",
    avgSalary: "45-80K",
    demandRatio: "5:1",
  },
  quote: {
    source: "Gartner 2026",
    text: "到 2028 年，33% 的企业软件将包含 AI Agent 组件",
  },
}

// Default learning paths (kept for backward compatibility)
export const learningPaths: LearningPath[] = [
  {
    id: "prompt-master",
    title: "Prompt 工程师之路",
    description: "从零开始掌握提示词工程，学会设计高效、可靠的 AI 交互",
    level: "beginner",
    demos: ["prompt-optimizer"],
    estimatedHours: 4,
  },
  {
    id: "agent-builder",
    title: "Agent 开发者进阶",
    description: "掌握单一 Agent、多 Agent 系统与人机协同的设计与实现",
    level: "intermediate",
    demos: ["prompt-optimizer", "single-agent", "human-in-the-loop", "multi-agent-system"],
    estimatedHours: 13,
  },
  {
    id: "rag-architect",
    title: "RAG 架构师",
    description: "深入理解检索增强生成，从基础 RAG、多模态解析到 GraphRAG",
    level: "intermediate",
    demos: ["prompt-optimizer", "rag-decision", "multimodal-rag", "graph-rag"],
    estimatedHours: 17,
  },
  {
    id: "full-stack-ai",
    title: "全栈 AI 工程师",
    description: "掌握所有核心技术，成为全能 AI 工程专家",
    level: "advanced",
    demos: ["prompt-optimizer", "single-agent", "rag-decision", "human-in-the-loop", "multimodal-rag", "graph-rag", "multi-agent-system"],
    estimatedHours: 32,
  },
]

// Demo metadata for roadmap
export const demoMetadata: Record<string, {
  title: string
  category: string
  difficulty: string
  estimatedTime: number
  prerequisites: string[]
  skills: string[]
  track: number
}> = {
  "prompt-engineering-techniques": {
    title: "提示工程技术全景 (Prompt Engineering Map)",
    category: "大模型",
    difficulty: "入门",
    estimatedTime: 25,
    prerequisites: [],
    skills: ["18 项提示技术", "覆盖度审计", "技术选型地图"],
    track: 0,
  },
  "prompt-optimizer": {
    title: "提示工程 (Prompt Engineering)",
    category: "大模型",
    difficulty: "入门",
    estimatedTime: 30,
    prerequisites: [],
    skills: ["提示词设计", "Chain-of-Thought", "Few-Shot 学习"],
    track: 0,
  },
  "context-engineering": {
    title: "上下文工程 (Context Engineering)",
    category: "大模型",
    difficulty: "入门",
    estimatedTime: 45,
    prerequisites: ["prompt-optimizer"],
    skills: ["上下文优化", "信息结构化", "Token 管理"],
    track: 1,
  },
  "structured-outputs": {
    title: "结构化输出与类型安全 (Structured Outputs)",
    category: "大模型",
    difficulty: "入门",
    estimatedTime: 45,
    prerequisites: ["prompt-optimizer"],
    skills: ["Pydantic 数据验证", "Instructor 强类型约束", "原生 JSON Schema", "优雅降级与自动重试"],
    track: 0,
  },
  "function-calling": {
    title: "原生 Function Calling 闭环原理 (Function Calling)",
    category: "大模型",
    difficulty: "基础",
    estimatedTime: 35,
    prerequisites: ["prompt-optimizer"],
    skills: ["原生 SDK 调用", "Tool Use 闭环", "代码拦截与执行"],
    track: 1,
  },
  "mcp-engineering": {
    title: "MCP 工程 (Model Context Protocol)",
    category: "工程化",
    difficulty: "基础",
    estimatedTime: 40,
    prerequisites: ["prompt-optimizer"],
    skills: ["协议设计", "工具集成", "资源管理"],
    track: 1,
  },
  "skill-engineering": {
    title: "技能工程 (Skill Engineering)",
    category: "工程化",
    difficulty: "中级",
    estimatedTime: 50,
    prerequisites: ["mcp-engineering"],
    skills: ["技能框架", "文档驱动", "最佳实践"],
    track: 1,
  },
  "single-agent": {
    title: "单一智能体架构 (Single Agent)",
    category: "Agent",
    difficulty: "基础",
    estimatedTime: 60,
    prerequisites: ["context-engineering"],
    skills: ["Agent 循环", "工具调用", "反思机制"],
    track: 2,
  },
  "agent-runtime-loop": {
    title: "智能体运行时循环 (Agent Runtime Loop)",
    category: "Agent",
    difficulty: "中级",
    estimatedTime: 50,
    prerequisites: ["single-agent"],
    skills: ["运行时循环", "状态管理", "迭代收敛", "执行轨迹"],
    track: 2,
  },
  "rag-decision": {
    title: "RAG 个性化决策系统 (RAG Decision)",
    category: "RAG",
    difficulty: "中级",
    estimatedTime: 75,
    prerequisites: ["context-engineering"],
    skills: ["向量检索", "文档切块", "上下文组装"],
    track: 2,
  },
  "human-in-the-loop": {
    title: "人机协同 (Human-in-the-Loop)",
    category: "Agent",
    difficulty: "中级",
    estimatedTime: 60,
    prerequisites: ["agent-runtime-loop"],
    skills: ["状态机暂停与唤醒", "状态序列化", "人工审批设计", "断点续传", "记忆回溯"],
    track: 2,
  },
  "agent-orchestration": {
    title: "智能体编排模式 (Agent Orchestration)",
    category: "Agent",
    difficulty: "高级",
    estimatedTime: 70,
    prerequisites: ["single-agent"],
    skills: ["顺序/并行编排", "层级式 Supervisor-Worker", "辩论/共识式", "事件驱动/黑板模式", "编排选型决策"],
    track: 3,
  },
  "multimodal-rag": {
    title: "多模态 RAG 与高级解析工程 (Multimodal RAG)",
    category: "RAG",
    difficulty: "高级",
    estimatedTime: 75,
    prerequisites: ["rag-decision"],
    skills: ["混合文档解析流", "Vision-Chunking 策略", "Late Chunking 技术", "跨模态对齐检索"],
    track: 3,
  },
  "graph-rag": {
    title: "图检索增强 (GraphRAG)",
    category: "RAG",
    difficulty: "高级",
    estimatedTime: 90,
    prerequisites: ["rag-decision"],
    skills: ["知识图谱", "实体关系", "多跳推理"],
    track: 3,
  },
  "multi-agent-system": {
    title: "多智能体协作系统 (Multi-Agent System)",
    category: "Agent",
    difficulty: "专家",
    estimatedTime: 120,
    prerequisites: ["single-agent"],
    skills: ["任务分解", "协作模式", "角色专业化"],
    track: 3,
  },
  "harness-engineering": {
    title: "智能体运行框架工程 (Harness Engineering)",
    category: "工程化",
    difficulty: "专家",
    estimatedTime: 90,
    prerequisites: ["single-agent", "multi-agent-system"],
    skills: ["上下文工程", "验证循环", "状态管理", "生命周期管理"],
    track: 3,
  },
  "loop-engineering": {
    title: "循环工程 (Loop Engineering)",
    category: "工程化",
    difficulty: "专家",
    estimatedTime: 80,
    prerequisites: ["harness-engineering", "single-agent"],
    skills: ["自动化循环", "worktree 隔离", "子 Agent 验证", "记忆持久化"],
    track: 3,
  },
  "evaluation-engineering": {
    title: "评估工程 (Evaluation)",
    category: "工程化",
    difficulty: "专家",
    estimatedTime: 80,
    prerequisites: ["loop-engineering"],
    skills: ["LLM-as-a-Judge", "Trajectory 轨迹评估", "断言测试 (Assertion Testing)", "Ragas / Promptfoo", "CI/CD 自动化回归"],
    track: 4,
  },
  "observability": {
    title: "可观测性与追踪 (Observability)",
    category: "工程化",
    difficulty: "专家",
    estimatedTime: 70,
    prerequisites: ["loop-engineering"],
    skills: ["多步拓扑追踪", "OpenTelemetry / LangSmith", "全链路 Trace", "TTFT 首字延迟诊断", "Token 监控"],
    track: 4,
  },
  "finops-performance": {
    title: "性能与成本工程 (FinOps)",
    category: "工程化",
    difficulty: "专家",
    estimatedTime: 65,
    prerequisites: ["loop-engineering"],
    skills: ["语义缓存 (Semantic Cache)", "提示词压缩 (Prompt Compression)", "混合推理路由", "多云 API + 本地 vLLM"],
    track: 4,
  },
  "guardrails": {
    title: "安全护栏工程 (Guardrails)",
    category: "工程化",
    difficulty: "专家",
    estimatedTime: 60,
    prerequisites: ["loop-engineering"],
    skills: ["提示词注入 (Prompt Injection) 防御", "PII 数据脱敏", "Llama Guard 拦截", "动态对抗与输入输出治理"],
    track: 4,
  },
}

// Storage keys
const STORAGE_KEYS = {
  PROGRESS: "ai-demo-progress",
  BOOKMARKS: "ai-demo-bookmarks",
  PROFILE: "ai-demo-profile",
}

// Helper to check if we're in browser
const isBrowser = typeof window !== "undefined"

// Mock store class
class MockStore {
  // Get user progress
  getProgress(): Record<string, UserProgress> {
    if (!isBrowser) return {}
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  }

  // Update demo progress
  updateProgress(demoId: string, progress: number, timeSpent: number = 0): void {
    if (!isBrowser) return
    const allProgress = this.getProgress()
    const existing = allProgress[demoId] || {
      demoId,
      progress: 0,
      completed: false,
      lastVisited: new Date().toISOString(),
      timeSpent: 0,
    }

    allProgress[demoId] = {
      ...existing,
      progress: Math.max(existing.progress, progress),
      completed: progress >= 100,
      lastVisited: new Date().toISOString(),
      timeSpent: existing.timeSpent + timeSpent,
    }

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress))
  }

  // Mark demo as completed
  completeDemo(demoId: string): void {
    this.updateProgress(demoId, 100)
  }

  // Get bookmarks
  getBookmarks(): Bookmark[] {
    if (!isBrowser) return []
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  // Add bookmark
  addBookmark(demoId: string): void {
    if (!isBrowser) return
    const bookmarks = this.getBookmarks()
    const meta = demoMetadata[demoId as keyof typeof demoMetadata]
    if (!meta || bookmarks.some((b) => b.demoId === demoId)) return

    bookmarks.push({
      id: `bookmark-${Date.now()}`,
      demoId,
      title: meta.title,
      category: meta.category,
      createdAt: new Date().toISOString(),
    })

    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks))
  }

  // Remove bookmark
  removeBookmark(demoId: string): void {
    if (!isBrowser) return
    const bookmarks = this.getBookmarks().filter((b) => b.demoId !== demoId)
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks))
  }

  // Check if bookmarked
  isBookmarked(demoId: string): boolean {
    return this.getBookmarks().some((b) => b.demoId === demoId)
  }

  // Get user profile
  getProfile(): UserProfile | null {
    if (!isBrowser) return null
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  // Save user profile
  saveProfile(profile: Partial<UserProfile>): void {
    if (!isBrowser) return
    const existing = this.getProfile() || {
      id: `user-${Date.now()}`,
      name: "Demo User",
      email: "demo@example.com",
      level: "beginner" as const,
      interests: [],
      joinedAt: new Date().toISOString(),
      streak: 0,
    }

    localStorage.setItem(
      STORAGE_KEYS.PROFILE,
      JSON.stringify({ ...existing, ...profile })
    )
  }

  // Get recommended path based on user level
  getRecommendedPath(level: "beginner" | "intermediate" | "advanced"): LearningPath {
    const paths = learningPaths.filter((p) => p.level === level || 
      (level === "beginner" && p.level === "beginner") ||
      (level === "intermediate" && ["beginner", "intermediate"].includes(p.level)) ||
      (level === "advanced")
    )
    return paths[0] || learningPaths[0]
  }

  // Calculate overall stats
  getStats() {
    const progress = this.getProgress()
    const bookmarks = this.getBookmarks()
    const profile = this.getProfile()

    const completed = Object.values(progress).filter((p) => p.completed).length
    const inProgress = Object.values(progress).filter((p) => !p.completed && p.progress > 0).length
    const totalTime = Object.values(progress).reduce((sum, p) => sum + p.timeSpent, 0)

    return {
      totalCompleted: completed,
      totalBookmarks: bookmarks.length,
      totalInProgress: inProgress,
      totalTimeSpent: totalTime,
      streak: profile?.streak || 0,
    }
  }

  // Clear all data (for testing)
  clearAll(): void {
    if (!isBrowser) return
    localStorage.removeItem(STORAGE_KEYS.PROGRESS)
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS)
    localStorage.removeItem(STORAGE_KEYS.PROFILE)
  }
}

// Export singleton instance
export const mockStore = new MockStore()

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
    estimatedHours: 2,
    demos: ["prompt-optimizer", "context-engineering"],
  },
  {
    id: "track-1",
    number: 1,
    title: "觉醒",
    subtitle: "Awakening",
    description: "掌握工程化基础设施：协议、技能与标准化接口",
    estimatedHours: 3,
    demos: ["mcp-engineering", "skill-engineering"],
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
    estimatedHours: 9,
    demos: ["single-agent", "agent-runtime-loop", "memory-engineering", "rag-decision"],
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
    estimatedHours: 16,
    demos: ["graph-rag", "multi-agent-system", "harness-engineering", "loop-engineering"],
    capstone: {
      title: "企业级 AI 系统",
      description: "设计并实现一个完整的多 Agent + GraphRAG 企业解决方案",
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
    description: "掌握单一 Agent 和多 Agent 系统的设计与实现",
    level: "intermediate",
    demos: ["prompt-optimizer", "single-agent", "multi-agent-system"],
    estimatedHours: 12,
  },
  {
    id: "rag-architect",
    title: "RAG 架构师",
    description: "深入理解检索增强生成，从基础 RAG 到 GraphRAG",
    level: "intermediate",
    demos: ["prompt-optimizer", "rag-decision", "graph-rag"],
    estimatedHours: 16,
  },
  {
    id: "full-stack-ai",
    title: "全栈 AI 工程师",
    description: "掌握所有核心技术，成为全能 AI 工程专家",
    level: "advanced",
    demos: ["prompt-optimizer", "single-agent", "rag-decision", "graph-rag", "multi-agent-system"],
    estimatedHours: 30,
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
  "prompt-optimizer": {
    title: "提示词工程优化",
    category: "大模型",
    difficulty: "入门",
    estimatedTime: 30,
    prerequisites: [],
    skills: ["提示词设计", "Chain-of-Thought", "Few-Shot 学习"],
    track: 0,
  },
  "context-engineering": {
    title: "上下文工程",
    category: "大模型",
    difficulty: "基础",
    estimatedTime: 45,
    prerequisites: ["prompt-optimizer"],
    skills: ["上下文优化", "信息结构化", "Token 管理"],
    track: 1,
  },
  "mcp-engineering": {
    title: "MCP 工程",
    category: "工程化",
    difficulty: "基础",
    estimatedTime: 40,
    prerequisites: ["prompt-optimizer"],
    skills: ["协议设计", "工具集成", "资源管理"],
    track: 1,
  },
  "skill-engineering": {
    title: "SKILL 工程",
    category: "工程化",
    difficulty: "中级",
    estimatedTime: 50,
    prerequisites: ["mcp-engineering"],
    skills: ["技能框架", "文档驱动", "最佳实践"],
    track: 1,
  },
  "single-agent": {
    title: "单一智能体架构",
    category: "Agent",
    difficulty: "基础",
    estimatedTime: 60,
    prerequisites: ["context-engineering"],
    skills: ["Agent 循环", "工具调用", "反思机制"],
    track: 2,
  },
  "agent-runtime-loop": {
    title: "Agent Runtime Loop",
    category: "Agent",
    difficulty: "中级",
    estimatedTime: 50,
    prerequisites: ["single-agent"],
    skills: ["运行时循环", "状态管理", "迭代收敛", "执行轨迹"],
    track: 2,
  },
  "rag-decision": {
    title: "RAG 个性化决策",
    category: "RAG",
    difficulty: "中级",
    estimatedTime: 75,
    prerequisites: ["context-engineering"],
    skills: ["向量检索", "文档切块", "上下文组装"],
    track: 2,
  },
  "graph-rag": {
    title: "GraphRAG 图检索",
    category: "RAG",
    difficulty: "高级",
    estimatedTime: 90,
    prerequisites: ["rag-decision"],
    skills: ["知识图谱", "实体关系", "多跳推理"],
    track: 3,
  },
  "multi-agent-system": {
    title: "多智能体协作",
    category: "Agent",
    difficulty: "专家",
    estimatedTime: 120,
    prerequisites: ["single-agent"],
    skills: ["任务分解", "协作模式", "角色专业化"],
    track: 3,
  },
  "harness-engineering": {
    title: "Harness Engineering",
    category: "工程化",
    difficulty: "专家",
    estimatedTime: 90,
    prerequisites: ["single-agent", "multi-agent-system"],
    skills: ["上下文工程", "验证循环", "状态管理", "生命周期管理"],
    track: 3,
  },
  "loop-engineering": {
    title: "Loop Engineering",
    category: "工程化",
    difficulty: "专家",
    estimatedTime: 80,
    prerequisites: ["harness-engineering", "single-agent"],
    skills: ["自动化循环", "worktree 隔离", "子 Agent 验证", "记忆持久化"],
    track: 3,
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

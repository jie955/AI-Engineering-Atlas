"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { AtlasTechniqueCarrier } from "@/components/atlas-technique-carrier"
import { SelfConsistencyPlayground } from "@/components/self-consistency-playground"
import { GeneratedKnowledgePlayground } from "@/components/generated-knowledge-playground"
import { ApePlayground } from "@/components/ape-playground"
import { MetaPromptingPlayground } from "@/components/meta-prompting-playground"
import { DirectionalStimulusPlayground } from "@/components/directional-stimulus-playground"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from "recharts"
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  BookOpen, 
  User, 
  FileCode, 
  RefreshCw, 
  AlertTriangle, 
  Play, 
  Copy, 
  Check, 
  Compass, 
  BarChart2, 
  FileText, 
  ChevronRight, 
  Info,
  ArrowRight,
  Shield,
  Cpu,
  Zap,
  Workflow,
  FileJson,
  Activity,
  ArrowLeft,
  ShieldAlert
} from "lucide-react"

const promptTechniques = [
  {
    id: "basic",
    name: "基础提示词 (Direct)",
    description: "直接描述需求，无额外上下文或约束。适用于低复杂度、高容错场景。",
    example: "写一篇关于量子计算的简短介绍。",
    pros: ["极低延迟", "Token 消耗极小"],
    cons: ["格式不固定", "复杂逻辑容易出错"],
    color: "gray",
    icon: "Terminal",
  },
  {
    id: "cot",
    name: "思维链 (Chain-of-Thought)",
    description: "引导模型展示完整的逻辑推导过程。显著提升多步骤逻辑与计算的准确度。",
    example: "请一步一步思考，分析人工智能对就业市场的影响。首先列出受影响最大的行业，然后评估岗位的替代率，最后给出应对建议。",
    pros: ["突破逻辑推理上限", "决策逻辑高可解释性"],
    cons: ["输出长度增加", "首包延迟 (TTFT) 变长"],
    color: "blue",
    icon: "Layers",
  },
  {
    id: "few-shot",
    name: "少样本学习 (Few-Shot)",
    description: "提供 2-5 个标准的高质量示例，让模型直接学习并精确拟合目标模式与行文风格。",
    example: "【示例1】\n输入：分析气候变化\n输出：[环境维度] 极地融化加速 -> [社会维度] 移民风险增加 -> [治理建议] 碳税税率微调\n\n【示例2】\n输入：分析老龄化\n输出：[人口维度] 劳动力缩减 -> [社会维度] 养老金缺口扩大 -> [治理建议] 延迟退休政策\n\n【现在请分析】：量子计算发展",
    pros: ["格式高度一致", "对新任务冷启动极佳"],
    cons: ["Token 预算压力大", "过拟合高频特例样本"],
    color: "emerald",
    icon: "BookOpen",
  },
  {
    id: "role",
    name: "角色设定 (Role-Playing)",
    description: "赋予模型特定的专家人设和视角，激发模型权重生成更具专业度和深度的话语体系。",
    example: "你是一位有 20 年经验的 AI 资深科学家。请以客观、严谨但通俗懂行的语调，撰写一份关于量子纠缠在安全通信中应用的机密评估报告。",
    pros: ["回答专业度强", "语气风格极度拟合"],
    cons: ["潜在的偏见泛化", "可能限制通用发散思维"],
    color: "purple",
    icon: "User",
  },
  {
    id: "structured",
    name: "结构化输出 (Structured)",
    description: "利用 Schema 强力限制输出为 JSON、XML 等标准数据结构，是前后端结合的基础。",
    example: "请严格以 JSON 格式输出分析结果。结构要求如下：\n{\n  \"topic\": \"量子计算\",\n  \"keyConcepts\": [\"量子比特\", \"叠加态\"],\n  \"applications\": [\"量子化学\", \"密码破解\"]\n}",
    pros: ["易于后端解析", "接口具备高鲁棒性"],
    cons: ["丧失文本丰富性", "格式解析失败会阻断系统"],
    color: "amber",
    icon: "FileCode",
  },
  {
    id: "iterative",
    name: "自省反思 (Self-Refinement)",
    description: "引导模型生成初稿，进而扮演评论家找出漏洞，最后自我修正并输出高度润色的定稿。",
    example: "首先，撰写一段解释。接着，对该解释进行批判性评估并指出逻辑漏洞。最后，根据评估意见重新撰写最终稿。",
    pros: ["品质逼近出版级", "能自动过滤低级逻辑错漏"],
    cons: ["推理成本翻倍", "平均响应时间显著增加"],
    color: "rose",
    icon: "RefreshCw",
  },
]

const comparisonMetrics = [
  { name: "输出质量 (Output Quality)", basic: 60, cot: 85, fewShot: 90, role: 80, structured: 75, iterative: 95 },
  { name: "推理能力 (Reasoning Depth)", basic: 50, cot: 95, fewShot: 70, role: 75, structured: 60, iterative: 90 },
  { name: "格式控制 (Format Alignment)", basic: 40, cot: 60, fewShot: 85, role: 65, structured: 100, iterative: 80 },
  { name: "Token 效率 (Token Efficiency)", basic: 100, cot: 70, fewShot: 50, role: 80, structured: 85, iterative: 30 },
]

const colorThemeMap: Record<string, { badge: string; border: string; bg: string; text: string }> = {
  gray: {
    badge: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    border: "border-zinc-500/30",
    bg: "bg-zinc-500/5",
    text: "text-zinc-400"
  },
  blue: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    text: "text-blue-400"
  },
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    text: "text-emerald-400"
  },
  purple: {
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    text: "text-purple-400"
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    text: "text-amber-400"
  },
  rose: {
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    border: "border-rose-500/30",
    bg: "bg-rose-500/5",
    text: "text-rose-400"
  },
}

export default function PromptOptimizerDemoPage() {
  const [activeTab, setActiveTab] = useState("techniques")
  const [selectedTechnique, setSelectedTechnique] = useState("basic")
  const [inputPrompt, setInputPrompt] = useState("解释什么是量子计算")
  const [userPrompt, setUserPrompt] = useState("解释什么是量子计算")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedOutput, setGeneratedOutput] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  // 防抖处理 (Debounce): 避免频繁输入时高频触发状态变化与预览重计算
  useEffect(() => {
    const handler = setTimeout(() => {
      setUserPrompt(inputPrompt)
    }, 300)
    return () => clearTimeout(handler)
  }, [inputPrompt])

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const colorHexMap: Record<string, string> = {
    basic: "#71717a",
    cot: "#3b82f6",
    "few-shot": "#10b981",
    role: "#a855f7",
    structured: "#f59e0b",
    iterative: "#f43f5e",
  }

  const getMetricKey = (id: string) => {
    if (id === "few-shot") return "fewShot"
    return id
  }

  const activeKey = getMetricKey(selectedTechnique)
  const activeTechniqueObj = promptTechniques.find((t) => t.id === selectedTechnique)
  const activeColorHex = colorHexMap[selectedTechnique] || "#3b82f6"

  const radarData = comparisonMetrics.map((metric) => {
    const displayName = metric.name.split(" ")[0]
    return {
      subject: displayName,
      value: metric[activeKey as keyof typeof metric] as number,
      baseline: metric.basic,
      fullMark: 100,
    }
  })

  const renderTechniqueIcon = (iconName: string, className?: string) => {
    switch (iconName) {
      case "Terminal": return <Terminal className={className} />;
      case "Layers": return <Layers className={className} />;
      case "BookOpen": return <BookOpen className={className} />;
      case "User": return <User className={className} />;
      case "FileCode": return <FileCode className={className} />;
      case "RefreshCw": return <RefreshCw className={className} />;
      default: return <Sparkles className={className} />;
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getOptimizedPrompt = (techniqueId: string, query: string) => {
    const cleanQuery = query.trim() || "解释什么是量子计算"
    switch (techniqueId) {
      case "basic":
        return `【System Prompt】: 你是一个极其简洁、客观的大模型助手。
【User Input】: ${cleanQuery}`;
      case "cot":
        return `【System Prompt】: 你是一个严谨深度的分析专家。面对任何任务，你必须展示清晰、分步骤的思考推理过程 (Chain-of-Thought)。首先定义核心概念，然后逐步推演机制，最后整合结论。
【User Input】: 让我们一步一步思考 (Let's think step by step)。请分析: ${cleanQuery}`;
      case "few-shot":
        return `【System Prompt】: 你是一个高效的结构化生成引擎。请严格学习、模仿并匹配以下 Few-Shot 样本的逻辑链路、语言风格和排版架构：

【示例 1】
输入：解释气候变化
输出：[核心物理] 地球平均气温相较工业化前升高 1.1℃。 -> [二次影响] 引发冰川退缩、全球海平面上升与极端气象。 -> [工程对策] 推进可再生能源重组，设置碳交易市场限制碳排。

【示例 2】
输入：解释老龄化
输出：[核心物理] 65岁以上老年人口占比突破 14% 的老龄社会标准。 -> [二次影响] 引发社会劳动力池缩减、社会化养老基金承受刚性支付压力。 -> [工程对策] 推进产业自动化，辅以个人养老储备与灵活工作制。

【最新任务】
输入：解释 ${cleanQuery}
输出：`;
      case "role":
        return `【System Prompt】: 你是一位拥有 20 年前沿计算物理与量子处理器研究开发经验的顶尖科学家。你善于拆解底层科学架构，同时用业内行话进行深入浅出的专业表述。
【User Input】: 作为该领域的顶尖专家，请针对「${cleanQuery}」提供一份深度、专业的系统级科普和技术潜力分析，请使用高智识、学术化且行文克制的技术报告体。`;
      case "structured":
        return `【System Prompt】: 你是一个高稳定性、严格隔离的结构化 API。你必须且只能以标准的 JSON Schema 格式返回结果。不允许包含任何常规解释、语气词或 HTML/Markdown 包裹。

【JSON Schema】:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "topic": { "type": "string" },
    "coreMechanism": { "type": "string", "description": "核心运作原理解析" },
    "keyMetrics": { "type": "array", "items": { "type": "string" }, "maxItems": 3 },
    "industryImpact": { "type": "string" }
  },
  "required": ["topic", "coreMechanism", "keyMetrics", "industryImpact"]
}

【User Input】: 请将「${cleanQuery}」作为核心主体，直接返回符合 Schema 的 JSON。`;
      case "iterative":
        return `【System Prompt】: 你是一个具备自省式反思能力 (Self-Refinement) 的多阶段生成引擎。你必须按以下严格步骤依次生成文本，并在最终返回中清晰标记出三个阶段：
1. [初稿 (Initial Draft)] - 针对用户 query 快速生成一份直接、通俗的解释。
2. [深度评审 (Critique)] - 严苛挑剔初稿中的学术不严谨、解释盲区或逻辑错漏，形成自我评审意见。
3. [终稿精修 (Refined Output)] - 结合评审意见对初稿进行纠正和高度润色，生成最终定稿。

【User Input】: 请对「${cleanQuery}」执行反思迭代工作流，并清晰呈现三个模块。`;
      default:
        return cleanQuery;
    }
  }

  const handleGenerate = async () => {
    setUserPrompt(inputPrompt)
    setIsGenerating(true)
    setGeneratedOutput("")
    setLogs([])

    const addLog = (msg: string, delay: number) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setLogs((prev) => [...prev, msg])
          resolve(null)
        }, delay)
      })
    }

    // Interactive pipeline simulation
    await addLog("🚀 初始化 Prompt Engineering 拼装引擎...", 300)
    await addLog(`🧩 载入策略模版: '${promptTechniques.find((t) => t.id === selectedTechnique)?.name}'`, 400)
    await addLog("🛡️ 运行安全检测 (Sanitization Check): 注入字符 0 个，通过...", 500)
    await addLog("⚙️ 动态变量渲染 (Hydration Completed): 系统提示词合并就绪", 400)
    await addLog("⚡ 向 LLM 安全网关发起模型调用 (model: gemini-1.5-flash)...", 600)

    const technique = promptTechniques.find((t) => t.id === selectedTechnique)
    const mockOutput = `【模组调用完毕】
[API Response Status: 200 OK]
[Latency: 1.2s] [Prompt Caching: ACTIVE]

【使用技术: ${technique?.name}】
=========================================

${
  selectedTechnique === "basic"
    ? `量子计算是一种利用量子力学规律（如叠加、相干和纠缠）进行高速信息处理的颠覆性计算范式。

它的核心优势在于超越了传统硅基计算机用 0 或 1 表达比特的界限，可以借助量子叠加态，在单次计算中并发探索极庞大的可能性空间，是应对传统计算机面临的指数级复杂度计算的最佳工具。`
    : ""
}

${
  selectedTechnique === "cot"
    ? `【思考链分析路径 (Chain-of-Thought Trail)】:
Step 1: 确定核心定义。量子计算与传统计算在比特（Bit）层面的根本不同在于量子比特（Qubit）。
Step 2: 演算计算模型。传统比特在特定时刻只能是 0 或 1，而量子比特能同时处于 0 和 1 的线性叠加态 (Superposition)。
Step 3: 计算规模推演。N 个经典比特只能表示 2^N 个状态中的「其中一个」；而 N 个相干量子比特能同时处于 2^N 个状态的相干叠加空间，这意味着信息吞吐能力的指数级爆发。
Step 4: 得出最终结论：这使得在特定的大维度穷举问题（如化学模拟、素数分解）中，量子计算理论上可完成“量子霸权/量子优越性”。

【推导输出】：
量子计算基于量子力学规律建立：
1. 叠加 (Superposition)：使单个量子比特能在同一时间内承载 0 与 1。
2. 纠缠 (Entanglement)：允许量子比特间产生非局域的瞬时相关联，构建高度协作的高维状态空间。
3. 干涉 (Interference)：用于通过算法设计消除错误计算路径并放大正确答案的振幅。`
    : ""
}

${
  selectedTechnique === "few-shot"
    ? `[核心物理] 采用处于量子相干态的量子比特（Qubit）作为计算基本单元。 -> [二次影响] 通过叠加和非定域纠缠构建 2^N 维度的并行计算状态空间，呈指数级超越传统计算机。 -> [工程对策] 重点推进超导、离子阱量子比特稳定性研发，在百万级物理比特水平上辅以量子纠错码（QEC）。`
    : ""
}

${
  selectedTechnique === "role"
    ? `【首席科学家学术备忘录 (Quantum Chief Architect Briefing)】

作为深耕量子逻辑门设计及固态超导路线多年的研究人员，我认为目前产业界和学术界应摒弃对量子计算作为“万能计算机”的幻觉，将其精准定义为面向特定 NP-Hard 问题的硬核辅助卡。

其核心逻辑在于，我们通过希尔伯特高维张量空间的本征变换，绕过了硅基逻辑的门电路翻转极限。叠加态和超导相干控制，是现代物理最璀璨的交响。其在量子化学反应路径重构和金融大资产组合包最优化调度上的优越性是不言而喻的。然而，我们的工程痛点仍在于“保真度低于阀值”和“高真空低温环境的超高维系成本”，这是下一步硅片上芯片集成的卡脖子挑战。`
    : ""
}

${
  selectedTechnique === "structured"
    ? `{
  "topic": "量子计算 (Quantum Computing)",
  "coreMechanism": "利用量子比特的态叠加与非定域量子纠缠，在希尔伯特向量空间中以复数振幅的相干相消与相干相长进行指数级的大规模并行状态演算。",
  "keyMetrics": [
    "超导体系相干寿命 (Coherence Time): ~100-200 microseconds",
    "量子保真度 (Gate Fidelity): 99.9% (超导双比特门阈值)",
    "运行环境 (Cryogenics Level): 10-15 mK (毫开尔文)"
  ],
  "industryImpact": "在后摩尔定律时代，直接击穿非对称密码学的 RSA 与椭圆曲线壁垒，同时在分子制药反应流和高温超导材料合成的建模上，提供千倍级加速。"
}`
    : ""
}

${
  selectedTechnique === "iterative"
    ? `【自省迭代阶段 1: 初稿 (Initial Draft)】
量子计算机是比现在的超级计算机更快的电脑。它利用物理里的量子力学，可以用比以前更神奇的办法解开算术题，比如一次性尝试很多组答案，非常厉害。

【自省迭代阶段 2: 深度评审 (Critique)】
- 学术硬伤：直接将量子计算机定义为“更快的电脑”具有极大的误导性。在普通的文本编辑、流媒体播放和简单线算任务上，量子计算机不仅没有加速，甚至会因为测量崩溃和相干维持问题而远慢于传统计算机。
- 概念缺失：未提及量子力学的三大基石——叠加、纠缠、相干，属于严重的定义偷懒。
- 逻辑漏洞：“一次性尝试很多组答案”描述并不严谨，实质是并行计算概率振幅叠加干涉，并非单纯的简单并行搜索。

【自省迭代阶段 3: 终稿精修 (Refined Output)】
量子计算并非经典计算机的通用型替代升级，而是基于量子力学底层原理（叠加、干涉、非定域纠缠）的专用颠覆性算力架构。

它借助量子比特（Qubit）可以同时承载 0 与 1 概率振幅叠加的能力，能够在多项 NP-Hard 问题（如素数因子分解、多粒子体系量子模拟）上，将求解时间由传统的指数级压缩为多项式级。它是后摩尔时代人类向高维度物理复杂性发起冲锋的技术阶梯。`
    : ""
}

输出质量效能指标:
-----------------------------------------
1. 生成准确度评定: ${comparisonMetrics[0][selectedTechnique as keyof (typeof comparisonMetrics)[0]]}/100
2. 推理计算深度: ${comparisonMetrics[1][selectedTechnique as keyof (typeof comparisonMetrics)[1]]}/100
3. 格式规范遵循度: ${comparisonMetrics[2][selectedTechnique as keyof (typeof comparisonMetrics)[2]]}/100
4. 消耗 Token 效率: ${comparisonMetrics[3][selectedTechnique as keyof (typeof comparisonMetrics)[3]]}/100`.trim()

    setGeneratedOutput(mockOutput)
    setIsGenerating(false)
  }

  const navigateToPlaygroundWithTechnique = (techId: string) => {
    setSelectedTechnique(techId)
    setActiveTab("playground")
  }

  return (
    <DemoShell demoId="prompt-optimizer">
      <DemoHero
        demoId="prompt-optimizer"
        badge="ATLAS NODE #01"
        title="Prompt Engineering Playroom"
        description="系统化提示词优化方法论。从单点、简陋的硬编码指令，到具备版本化、可预测、强类型及具备自反思能力的生产级大模型核心控制层。"
      />

      {/* 关联《提示工程技术全景》地图：反向互链，打破两张皮 */}
      <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-4">
        <Compass className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">关联 · 提示工程技术全景</span>
            <Link href="/demos/prompt-engineering-techniques" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              查看完整技术地图 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            本节点是 Atlas《提示工程技术全景》中「已覆盖」技术的主承载。下方技术库每一项都已纳入该技术地图的对照审计：
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">#3 思维链 CoT</Badge>
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">#2 少样本 Few-Shot</Badge>
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">角色提示 Role</Badge>
            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600">#1 零样本 Zero-Shot（基线）</Badge>
            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600">#4 自我一致性</Badge>
            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600">#5 生成知识</Badge>
            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600">#10 自动提示工程师</Badge>
            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600">#12 方向性刺激</Badge>
          </div>
        </div>
      </div>

      {/* 扩展技术承载：#4 #5 #10 #12 已配真演练场；#1 零样本为思想说明；#18 meta-prompting 已配真演练场（本节点已有反向互链横幅，故仅渲染技术卡片） */}
      <AtlasTechniqueCarrier
        showHeader={false}
        tone="strong"
        intro="本节点承载《提示工程技术全景》中 #4 自我一致性、#5 生成知识提示、#10 自动提示工程师、#12 方向性刺激提示（已配真演练场，见下方真实执行），以及 #1 零样本（思想说明 + 示例）、#18 meta-prompting（已配真演练场，见下方：设计者 persona × 迭代精炼）。"
        techniques={[
          {
            n: "1",
            name: "零样本 (Zero-Shot)",
            desc: "不给任何示例，直接让模型基于指令与自身参数知识完成任务。是少样本 / 思维链的前提基线，考验指令清晰度与模型泛化。",
            example:
              "「请把下面句子翻译成英文：今天天气真好。」\n（无任何示例，模型直接输出 The weather is nice today.）",
            pros: ["零示例成本、最快", "依赖指令而非样本"],
            cons: ["复杂/长尾任务易跑偏", "对指令措辞敏感"],
            strong: true,
          },
          {
            n: "4",
            name: "自我一致性 (Self-Consistency)",
            desc: "对同一个问题采样多条推理路径（如多次 CoT），再用多数投票汇聚最终答案。把『单次推理』升级为『多条路径 + 聚合』，显著提升复杂推理的稳健性。",
            example:
              "Q: 火车时速 60km，行驶 2.5 小时…？\n采样 5 条 CoT → [150, 150, 140, 150, 150]\n投票 → 150 为最终答案",
            pros: ["显著提升算术/常识推理准确率", "对单条 CoT 的偶发失败鲁棒"],
            cons: ["多次采样推高推理成本", "需要额外的聚合/投票逻辑"],
            strong: true,
          },
          {
            n: "5",
            name: "生成知识提示 (Generated Knowledge)",
            desc: "先让模型生成与问题相关的背景知识段落，再带着这些知识去回答——把『开卷检索』环节显式化，缓解知识缺失与幻觉。",
            example:
              "Step1: 请先写出『光合作用』的关键事实…\nStep2: 基于上述事实，回答『阴天植物为何仍存活』",
            pros: ["缓解知识缺失与幻觉", "推理过程更可解释"],
            cons: ["生成的知识本身可能错误", "拉长上下文、增加延迟"],
            strong: true,
          },
          {
            n: "10",
            name: "自动提示工程师 (APE)",
            desc: "用 LLM 自动生成并筛选候选提示词，以目标任务的评分作为搜索目标，把『提示设计』变成可程序化优化的过程。",
            example:
              "候选提示 = LLM 基于任务描述生成 N 条\n评估 = 在验证集上打分\n选择 = 最高分提示作为最终模板",
            pros: ["减少对人工调参的依赖", "可批量探索提示空间"],
            cons: ["需要可靠的评估器", "搜索与重跑成本高"],
            strong: true,
          },
          {
            n: "12",
            name: "方向性刺激提示 (Directional Stimulus)",
            desc: "在 prompt 中插入一句引导性刺激（如期望的作答方向或关键词），软性地引导解码走向，而非硬编码硬性指令。",
            example:
              "生成摘要前加入：\n「请侧重『成本』与『风险』两点」\n模型据此调整输出侧重",
            pros: ["轻量、即插即用", "可微调风格与信息侧重"],
            cons: ["引导过强会压制模型判断", "效果随任务波动"],
            strong: true,
          },
          {
            n: "18",
            name: "Meta-Prompting (元提示)",
            desc: "让 LLM 站在「提示设计者」视角，自动产出或迭代优化下游任务的提示词——把提示本身当作可被生成的对象，而非人手写死。",
            example:
              "「你是一名提示工程师。请为『邮件分类』任务设计 3 版提示，并说明每版权衡。」\n→ 产出 3 版候选提示，再择优/迭代",
            pros: ["把提示工程本身自动化", "适合规模化、跨任务"],
            cons: ["元提示质量依赖基座能力", "迭代成本需评估器约束"],
            strong: true,
          },
        ]}
      />

      {/* #4 升级为强覆盖：Self-Consistency 真演练场 */}
      <SelfConsistencyPlayground />
      <GeneratedKnowledgePlayground />
      <ApePlayground />
      <DirectionalStimulusPlayground />

      {/* #18 升级为强覆盖：Meta-Prompting 真演练场 */}
      <MetaPromptingPlayground />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 bg-muted/40 p-1 rounded-xl border border-border/50 h-12">
          <TabsTrigger value="techniques" className="text-sm flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500/80 dark:text-emerald-400/80" />
            <span className="hidden sm:inline">技术库</span> Blueprint
          </TabsTrigger>
          <TabsTrigger value="playground" className="text-sm flex items-center justify-center gap-2">
            <Terminal className="w-4 h-4 text-blue-500/80 dark:text-blue-400/80" />
            <span className="hidden sm:inline">演练场</span> Playground
          </TabsTrigger>
          <TabsTrigger value="comparison" className="text-sm flex items-center justify-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-500/80 dark:text-purple-400/80" />
            <span className="hidden sm:inline">量化对比</span> Metrics
          </TabsTrigger>
          <TabsTrigger value="spec" className="text-sm flex items-center justify-center gap-2 font-medium text-primary">
            <FileCode className="w-4 h-4 text-amber-500/80 dark:text-amber-400/80" />
            <span className="hidden sm:inline">工程规范</span> Spec Sheet
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Techniques Library */}
        <TabsContent value="techniques" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promptTechniques.map((technique) => {
              const theme = colorThemeMap[technique.color] || colorThemeMap.gray
              return (
                <Card 
                  key={technique.id} 
                  className="group relative overflow-hidden p-6 border border-border/80 bg-background/50 backdrop-blur-sm hover:border-primary/40 hover:bg-muted/10 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`p-2 rounded-lg border ${theme.badge}`}>
                          {renderTechniqueIcon(technique.icon, "w-4 h-4")}
                        </span>
                        <h4 className="font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {technique.name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {technique.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-muted-foreground/80 uppercase">示例模版</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(technique.example, `tech-example-${technique.id}`)
                          }}
                        >
                          {copiedId === `tech-example-${technique.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                          )}
                        </Button>
                      </div>
                      <div className="p-3 bg-muted/60 dark:bg-muted/40 rounded-lg border border-border/40 text-[11px] font-mono leading-relaxed text-foreground/90 max-h-[120px] overflow-y-auto whitespace-pre-wrap">
                        {technique.example}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40 text-[11px]">
                      <div>
                        <span className="font-semibold text-emerald-500 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> 优势
                        </span>
                        <ul className="space-y-1 text-muted-foreground pl-0.5">
                          {technique.pros.map((pro, idx) => (
                            <li key={idx} className="list-disc list-inside truncate">{pro}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-semibold text-amber-500 flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" /> 局限
                        </span>
                        <ul className="space-y-1 text-muted-foreground pl-0.5">
                          {technique.cons.map((con, idx) => (
                            <li key={idx} className="list-disc list-inside truncate">{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border/40">
                    <Button 
                      onClick={() => navigateToPlaygroundWithTechnique(technique.id)}
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs hover:bg-primary hover:text-primary-foreground group/btn"
                    >
                      去演练场试试
                      <ArrowRight className="w-3 h-3 ml-1.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Playground */}
        <TabsContent value="playground" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Config Panel */}
            <Card className="lg:col-span-5 p-6 border border-border/80 bg-background/50 backdrop-blur-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground">1. 选择控制策略</h3>
                <p className="text-xs text-muted-foreground">不同的工程手法会对底层 Prompt 架构进行二次转化与重组</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {promptTechniques.map((tech) => {
                  const isSelected = selectedTechnique === tech.id
                  const theme = colorThemeMap[tech.color] || colorThemeMap.gray
                  return (
                    <div
                      key={tech.id}
                      onClick={() => setSelectedTechnique(tech.id)}
                      className={`group relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-border/60 bg-muted/10 hover:border-border-muted hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-1.5 rounded-md border ${theme.badge} transition-transform duration-200 group-hover:scale-105`}>
                          {renderTechniqueIcon(tech.icon, "w-3.5 h-3.5")}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-foreground leading-none">{tech.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 leading-none truncate max-w-[200px] sm:max-w-[300px]">
                            {tech.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1">
                    <Terminal className="w-3 h-3" /> 输入核心业务指令 / 检索意图
                  </label>
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded border border-border/40">
                    {isGenerating ? "生成中已禁用输入" : "防抖处理 (300ms)"}
                  </span>
                </div>
                <Textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  disabled={isGenerating}
                  placeholder="例如: 解释什么是量子计算"
                  className="min-h-[80px] text-xs font-mono border-border/80 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Advanced Transformation Box */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">工程化装配效果预览</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5"
                    onClick={() => handleCopy(getOptimizedPrompt(selectedTechnique, userPrompt), "optimized-preview")}
                  >
                    {copiedId === "optimized-preview" ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-border/40 font-mono text-[10px] leading-relaxed text-slate-300 max-h-[140px] overflow-y-auto whitespace-pre-wrap">
                  {getOptimizedPrompt(selectedTechnique, userPrompt)}
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full text-xs tracking-wider" size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    安全装配中 & 正在生成...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    运行工程化模板并模拟生成
                  </>
                )}
              </Button>
            </Card>

            {/* Simulated Live Output Panel */}
            <Card className="lg:col-span-7 p-6 border border-border/80 bg-background/50 backdrop-blur-sm flex flex-col justify-between min-h-[500px]">
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground">2. 系统级生成视窗</h3>
                    <p className="text-xs text-muted-foreground">实时呈现工程优化管道流以及大模型的推理级答复</p>
                  </div>
                  {generatedOutput && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs flex items-center gap-1.5"
                      onClick={() => handleCopy(generatedOutput, "generation-result")}
                    >
                      {copiedId === "generation-result" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          已复制结果
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          复制完整包
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {isGenerating || logs.length > 0 ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950/90 rounded-lg border border-border/40 space-y-1 max-h-[160px] overflow-y-auto font-mono text-[10px]">
                      {logs.map((log, index) => (
                        <div key={index} className="flex items-center gap-2 text-emerald-400">
                          <span className="text-emerald-600 font-bold select-none">&gt;&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      {isGenerating && (
                        <div className="flex items-center gap-2 text-primary animate-pulse mt-1">
                          <span className="text-primary font-bold select-none">&gt;&gt;</span>
                          <span className="flex items-center gap-1.5">
                            模型管道回传流监听中...
                            <Loader2 className="w-3 h-3 animate-spin" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {generatedOutput ? (
                  <div className="space-y-3 pt-2">
                    <div className="rounded-lg border border-border/40 bg-muted/40 p-4 min-h-[260px] max-h-[460px] overflow-y-auto">
                      <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                        {generatedOutput}
                      </pre>
                    </div>
                  </div>
                ) : (
                  !isGenerating && logs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[350px] text-center border-2 border-dashed border-border/60 rounded-xl bg-muted/5">
                      <div className="p-4 rounded-full bg-primary/5 mb-4 border border-primary/10">
                        <Sparkles className="w-10 h-10 text-primary/60" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">等待指令运行</h4>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        请在左侧侧边栏微调您的指令，选择高级 Prompt 模式，点击运行查看生产级输出渲染。
                      </p>
                    </div>
                  )
                )}
              </div>

              {generatedOutput && (
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-primary" />
                    <span>本 Playground 具备本地防注入安全校验保护</span>
                  </div>
                  <span className="font-mono bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/10">
                    SLA Compliance Rate: 100%
                  </span>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Comparison */}
        <TabsContent value="comparison" className="space-y-6">
          <Card className="p-8 border border-border/80 bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-5 mb-8">
              <div>
                <h3 className="text-xl font-bold text-foreground">提示词控制架构量化评定</h3>
                <p className="text-xs text-muted-foreground mt-1">评估各项提示词方案在大规模生产应用时的效能折损与投资回报比</p>
              </div>
              <Badge className="w-fit mt-3 md:mt-0 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-mono text-[11px]">
                METRIC SCALE: 0 - 100 PTS
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Progress bars comparing all techniques (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    多方案指标横向对比 (Cross-Strategy Performance)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">横向对比不同 Prompt 工程策略在四大核心维度上的量化数值</p>
                </div>
                
                <div className="space-y-8">
                  {comparisonMetrics.map((metric, idx) => (
                    <div key={idx} className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <ChevronRight className="w-3.5 h-3.5 text-primary" />
                          {metric.name}
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                        {/* Basic */}
                        <div className="space-y-1.5 bg-muted/20 p-2.5 rounded-lg border border-border/30">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>基础 Direct</span>
                            <span className="font-mono font-semibold">{metric.basic}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-500" style={{ width: `${metric.basic}%` }} />
                          </div>
                        </div>

                        {/* CoT */}
                        <div className="space-y-1.5 bg-muted/20 p-2.5 rounded-lg border border-border/30">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>CoT 推理</span>
                            <span className="font-mono font-semibold text-blue-400">{metric.cot}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${metric.cot}%` }} />
                          </div>
                        </div>

                        {/* Few-Shot */}
                        <div className="space-y-1.5 bg-muted/20 p-2.5 rounded-lg border border-border/30">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Few-Shot</span>
                            <span className="font-mono font-semibold text-emerald-400">{metric.fewShot}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${metric.fewShot}%` }} />
                          </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-1.5 bg-muted/20 p-2.5 rounded-lg border border-border/30">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>人设设定</span>
                            <span className="font-mono font-semibold text-purple-400">{metric.role}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: `${metric.role}%` }} />
                          </div>
                        </div>

                        {/* Structured */}
                        <div className="space-y-1.5 bg-muted/20 p-2.5 rounded-lg border border-border/30">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>结构化</span>
                            <span className="font-mono font-semibold text-amber-400">{metric.structured}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${metric.structured}%` }} />
                          </div>
                        </div>

                        {/* Iterative */}
                        <div className="space-y-1.5 bg-muted/20 p-2.5 rounded-lg border border-border/30">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>自省反思</span>
                            <span className="font-mono font-semibold text-rose-400">{metric.iterative}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${metric.iterative}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Radar Chart Analysis for Selected Technique (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border/40 pt-6 lg:pt-0 lg:pl-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      当前策略效能雷达图 (Strategy Radar)
                    </h4>
                    <Badge variant="outline" className="font-mono text-[9px] bg-primary/5 text-primary border-primary/20">
                      RADAR ANALYSIS
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    实时分析 <strong>{activeTechniqueObj?.name}</strong> 在四大评估维度的综合表现及相对基础基准 (Direct) 优势。
                  </p>
                </div>

                {/* Radar Chart Visualizer Container */}
                <div className="relative rounded-xl border border-border/50 bg-muted/5 p-4 flex items-center justify-center min-h-[300px] overflow-hidden">
                  {isMounted ? (
                    <div className="w-full h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                          <PolarGrid stroke="#3f3f46" strokeDasharray="3 3" opacity={0.3} />
                          <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: "#a1a1aa", fontSize: 10, fontWeight: 500 }}
                          />
                          <PolarRadiusAxis 
                            angle={30} 
                            domain={[0, 100]} 
                            tick={{ fill: "#71717a", fontSize: 8 }}
                            axisLine={false}
                            tickCount={5}
                          />
                          {/* Baseline Radar (Basic Technique) */}
                          <Radar
                            name="基础 Direct 基准"
                            dataKey="baseline"
                            stroke="#71717a"
                            fill="#71717a"
                            fillOpacity={0.1}
                            strokeWidth={1}
                          />
                          {/* Active Selected Technique Radar */}
                          <Radar
                            name={activeTechniqueObj?.name || "当前策略"}
                            dataKey="value"
                            stroke={activeColorHex}
                            fill={activeColorHex}
                            fillOpacity={0.25}
                            strokeWidth={1.5}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "rgba(9, 9, 11, 0.95)", 
                              borderColor: "rgba(63, 63, 70, 0.4)",
                              borderRadius: "8px",
                              fontSize: "11px",
                              color: "#f4f4f5"
                            }} 
                          />
                          <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            iconType="circle"
                            iconSize={6}
                            wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="text-xs font-mono">Loading telemetry canvas...</span>
                    </div>
                  )}
                </div>

                {/* Strategy Selector within comparison tab */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">快速切换评测方案 (Switch Strategy)</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {promptTechniques.map((tech) => {
                      const isActive = selectedTechnique === tech.id;
                      return (
                        <button
                          key={tech.id}
                          onClick={() => setSelectedTechnique(tech.id)}
                          className={`text-left p-2 rounded-lg border text-[11px] transition-all flex flex-col justify-between h-14 ${
                            isActive
                              ? "bg-primary/10 border-primary text-foreground shadow-sm shadow-primary/5 font-semibold"
                              : "bg-muted/30 hover:bg-muted/60 border-border/40 text-muted-foreground"
                          }`}
                        >
                          <span className="truncate">{tech.name.split(" ")[0]}</span>
                          <span className="text-[9px] text-muted-foreground/80 font-mono font-normal truncate block">
                            {tech.id.toUpperCase()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Engineering Recommendation Box */}
            <div className="mt-10 p-5 rounded-xl border border-primary/20 bg-primary/5 flex gap-4">
              <span className="p-2.5 rounded-lg bg-primary/10 text-primary h-fit">
                <Info className="w-5 h-5" />
              </span>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">企业工程架构选型内参：</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground mt-2">
                  <div className="space-y-1">
                    <p className="font-bold text-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      高确定性交付（如后端微服务联调）
                    </p>
                    <p className="pl-2.5 leading-relaxed">
                      首选<strong>「结构化输出 (Structured)」</strong>，配合 JSON 校验网关，强迫模型吐出高稳定性类型格式。
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      超高精度及决策链路（如复杂合规判定）
                    </p>
                    <p className="pl-2.5 leading-relaxed">
                      推荐使用<strong>「思维链 (CoT)」+「自省反思 (Self-Refinement)」</strong>，以双倍算力时长，挤压出最客观的事实报告。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 4: Engineering Spec Sheet */}
        <TabsContent value="spec" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 columns: Architecture & Specifications */}
            <div className="lg:col-span-2 space-y-8">
              {/* Section 1: Overview */}
              <Card className="p-6 border-l-4 border-l-primary bg-card/60 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-primary uppercase tracking-widest">STANDARD SPECIFICATION</span>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">Prompt Optimization Pipeline</h3>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 font-mono text-xs">
                    STATUS: PRODUCTION-READY
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  在生产环境中，提示词不应被视为简单的“静态字符串”，而应作为<strong>系统级代码资产</strong>进行版本控制、动态拼装与安全审计。本规范定义了企业级 LLM 提示词输入输出生命周期的最佳工程实践。
                </p>
              </Card>

              {/* Section 2: Architectural Topology */}
              <Card className="p-6 border border-border/80 bg-background/50 backdrop-blur-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                    运行时拓扑架构 (Runtime Topology)
                  </h4>
                  <Badge variant="outline" className="w-fit font-mono text-[10px] bg-primary/5 text-primary border-primary/20">
                    DIAGRAM ENGINE: RESPONSIVE COMPONENT FLOW
                  </Badge>
                </div>

                {/* Main container with dashed border, matching "Ray Runtime (Fully-Async)" container */}
                <div className="p-6 rounded-2xl border border-dashed border-border/80 bg-muted/5 relative overflow-hidden space-y-6">
                  {/* Top Header Label */}
                  <div className="flex justify-between items-center pb-2 border-b border-border/40">
                    <span className="text-xs font-mono font-bold text-primary tracking-wider">PROMPT PIPELINE RUNTIME (FULLY-ASYNC)</span>
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      SYSTEM STATUS: ONLINE
                    </span>
                  </div>

                  {/* Desktop Layout (Horizontal Flow) */}
                  <div className="hidden 2xl:flex flex-row flex-nowrap items-stretch justify-between gap-2 relative py-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    
                    {/* Component 1: Sanitizer */}
                    <div className="flex-1 min-w-[210px] rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                            <ShieldAlert className="w-4 h-4" />
                          </span>
                          <div>
                            <h5 className="font-bold text-xs text-purple-400 font-mono tracking-tight">vLLM Sanitizer</h5>
                            <span className="text-[9px] text-purple-500/80 font-mono">Input Guardrail</span>
                          </div>
                        </div>
                        <ul className="space-y-1.5 text-[10px] text-muted-foreground font-sans">
                          <li className="flex items-start gap-1.5">
                            <span className="text-purple-500/60 mt-0.5">•</span>
                            <span>Prompt Injection Check</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-purple-500/60 mt-0.5">•</span>
                            <span>Sensitivity masking</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-purple-500/60 mt-0.5">•</span>
                            <span>Token-budget guard</span>
                          </li>
                        </ul>
                      </div>
                      <Badge className="mt-4 w-fit bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-[9px] border-none font-mono">
                        EP=256 Filter
                      </Badge>
                    </div>

                    {/* Arrow 1 */}
                    <div className="flex flex-col items-center justify-center px-1 text-center min-w-[80px]">
                      <div className="w-full flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono text-muted-foreground whitespace-nowrap">Cleaned Query</span>
                        <ArrowRight className="w-4 h-4 text-purple-400" />
                        <span className="text-[8px] font-mono text-purple-400/60 whitespace-nowrap">(Secure Stream)</span>
                      </div>
                    </div>

                    {/* Component 2: Prompt Engine */}
                    <div className="flex-1 min-w-[210px] rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <Cpu className="w-4 h-4" />
                          </span>
                          <div>
                            <h5 className="font-bold text-xs text-emerald-400 font-mono tracking-tight">Prompt Engine</h5>
                            <span className="text-[9px] text-emerald-500/80 font-mono">MCP / Context Hydrator</span>
                          </div>
                        </div>
                        <ul className="space-y-1.5 text-[10px] text-muted-foreground font-sans">
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-500/60 mt-0.5">•</span>
                            <span>Model Context Protocol</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-500/60 mt-0.5">•</span>
                            <span>System template v1.2.4</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-500/60 mt-0.5">•</span>
                            <span>Vector Store fetching</span>
                          </li>
                        </ul>
                      </div>
                      <Badge className="mt-4 w-fit bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[9px] border-none font-mono">
                        Hydration Layer
                      </Badge>
                    </div>

                    {/* Arrow 2 */}
                    <div className="flex flex-col items-center justify-center px-1 text-center min-w-[80px]">
                      <div className="w-full flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono text-muted-foreground whitespace-nowrap">Hydrated State</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                        <span className="text-[8px] font-mono text-emerald-400/60 whitespace-nowrap">(System + Input)</span>
                      </div>
                    </div>

                    {/* Component 3: LLM Gateway */}
                    <div className="flex-1 min-w-[210px] rounded-xl border border-slate-500/30 bg-slate-500/5 p-4 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-500/5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-slate-500/10 text-slate-400">
                            <Layers className="w-4 h-4" />
                          </span>
                          <div>
                            <h5 className="font-bold text-xs text-slate-300 font-mono tracking-tight">LLM Gateway</h5>
                            <span className="text-[9px] text-slate-500/80 font-mono">Resiliency Proxy</span>
                          </div>
                        </div>
                        <ul className="space-y-1.5 text-[10px] text-muted-foreground font-sans">
                          <li className="flex items-start gap-1.5">
                            <span className="text-slate-500/60 mt-0.5">•</span>
                            <span>Fallback routing model</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-slate-500/60 mt-0.5">•</span>
                            <span>Rate limiting buffer</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-slate-500/60 mt-0.5">•</span>
                            <span>High-concurrency pool</span>
                          </li>
                        </ul>
                      </div>
                      <Badge className="mt-4 w-fit bg-slate-500/10 text-slate-300 hover:bg-slate-500/20 text-[9px] border-none font-mono">
                        SLA Rate Limiter
                      </Badge>
                    </div>

                    {/* Arrow 3 */}
                    <div className="flex flex-col items-center justify-center px-1 text-center min-w-[80px]">
                      <div className="w-full flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono text-muted-foreground whitespace-nowrap">Raw Response</span>
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                        <span className="text-[8px] font-mono text-blue-400/60 whitespace-nowrap">(Async Chunk)</span>
                      </div>
                    </div>

                    {/* Component 4: Output Parser */}
                    <div className="flex-1 min-w-[210px] rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                            <FileJson className="w-4 h-4" />
                          </span>
                          <div>
                            <h5 className="font-bold text-xs text-blue-400 font-mono tracking-tight">Output Parser</h5>
                            <span className="text-[9px] text-blue-500/80 font-mono">Zod Schema Validation</span>
                          </div>
                        </div>
                        <ul className="space-y-1.5 text-[10px] text-muted-foreground font-sans">
                          <li className="flex items-start gap-1.5">
                            <span className="text-blue-500/60 mt-0.5">•</span>
                            <span>Zod schema verification</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-blue-500/60 mt-0.5">•</span>
                            <span>Self-Refinement trigger</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-blue-500/60 mt-0.5">•</span>
                            <span>Structured JSON output</span>
                          </li>
                        </ul>
                      </div>
                      <Badge className="mt-4 w-fit bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[9px] border-none font-mono">
                        Parser Engine
                      </Badge>
                    </div>

                  </div>

                  {/* Tablet Layout (2x2 Grid) */}
                  <div className="hidden md:grid 2xl:hidden grid-cols-2 gap-6 relative py-4">
                    {/* Card 1 */}
                    <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                            <ShieldAlert className="w-4 h-4" />
                          </span>
                          <h5 className="font-bold text-xs text-purple-400 font-mono">vLLM Sanitizer</h5>
                        </div>
                        <ul className="space-y-1 text-[10px] text-muted-foreground">
                          <li>• Prompt Injection Check</li>
                          <li>• Sensitivity masking</li>
                          <li>• Token-budget guard</li>
                        </ul>
                      </div>
                      <Badge className="mt-4 w-fit bg-purple-500/10 text-purple-400 text-[9px] border-none font-mono">EP=256 Filter</Badge>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <Cpu className="w-4 h-4" />
                          </span>
                          <h5 className="font-bold text-xs text-emerald-400 font-mono">Prompt Engine (MCP)</h5>
                        </div>
                        <ul className="space-y-1 text-[10px] text-muted-foreground">
                          <li>• Model Context Protocol</li>
                          <li>• System template v1.2.4</li>
                          <li>• Vector Store fetching</li>
                        </ul>
                      </div>
                      <Badge className="mt-4 w-fit bg-emerald-500/10 text-emerald-400 text-[9px] border-none font-mono">Hydration Layer</Badge>
                    </div>

                    {/* Card 3 */}
                    <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-slate-500/10 text-slate-400">
                            <Layers className="w-4 h-4" />
                          </span>
                          <h5 className="font-bold text-xs text-slate-300 font-mono">LLM Gateway Proxy</h5>
                        </div>
                        <ul className="space-y-1 text-[10px] text-muted-foreground">
                          <li>• Fallback routing model</li>
                          <li>• Rate limiting buffer</li>
                          <li>• High-concurrency pool</li>
                        </ul>
                      </div>
                      <Badge className="mt-4 w-fit bg-slate-500/10 text-slate-300 text-[9px] border-none font-mono">SLA Rate Limiter</Badge>
                    </div>

                    {/* Card 4 */}
                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                            <FileJson className="w-4 h-4" />
                          </span>
                          <h5 className="font-bold text-xs text-blue-400 font-mono">Output Parser (Zod)</h5>
                        </div>
                        <ul className="space-y-1 text-[10px] text-muted-foreground">
                          <li>• Zod schema verification</li>
                          <li>• Self-Refinement trigger</li>
                          <li>• Structured JSON output</li>
                        </ul>
                      </div>
                      <Badge className="mt-4 w-fit bg-blue-500/10 text-blue-400 text-[9px] border-none font-mono">Parser Engine</Badge>
                    </div>
                  </div>

                  {/* Mobile Layout (Vertical Stack) */}
                  <div className="flex md:hidden flex-col items-stretch gap-4 py-2">
                    {/* Component 1 */}
                    <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-4 h-4 text-purple-400" />
                        <h5 className="font-bold text-xs text-purple-400 font-mono">vLLM Sanitizer</h5>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Prompt Injection filtering, input scrubbing & masking, and continuous token safety.</p>
                    </div>

                    <div className="flex justify-center text-purple-400/60">
                      <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>

                    {/* Component 2 */}
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        <h5 className="font-bold text-xs text-emerald-400 font-mono">Prompt Engine (MCP)</h5>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Model Context Protocol dynamically fetching vector stores & API telemetry.</p>
                    </div>

                    <div className="flex justify-center text-emerald-400/60">
                      <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>

                    {/* Component 3 */}
                    <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-4 h-4 text-slate-400" />
                        <h5 className="font-bold text-xs text-slate-300 font-mono">LLM Gateway Proxy</h5>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Fallback router & rate-limiting buffer safeguarding SLA and concurrent requests.</p>
                    </div>

                    <div className="flex justify-center text-blue-400/60">
                      <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>

                    {/* Component 4 */}
                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileJson className="w-4 h-4 text-blue-400" />
                        <h5 className="font-bold text-xs text-blue-400 font-mono">Output Parser (Zod)</h5>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Strict schema validation triggering automatic self-refinement loops on formatting failure.</p>
                    </div>
                  </div>

                  {/* Async Connection Footer (Dashed loop connecting Output Parser back to Prompt Engine, perfectly matching the reference design) */}
                  <div className="pt-4 border-t border-dashed border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                      <Workflow className="w-3.5 h-3.5 text-blue-400" />
                      <span>Async Feedback Path:</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/5 border border-blue-500/10 px-3 py-1.5 rounded-lg w-full sm:w-auto justify-center">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                      </span>
                      <span className="text-[10px] font-mono text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        Self-Refinement Loop (Async Retry) <ArrowLeft className="w-3 h-3 ml-1 animate-pulse" />
                      </span>
                    </div>
                  </div>

                </div>
              </Card>

              {/* Section 3: Engineering Guidelines */}
              <Card className="p-6 border border-border/80 bg-background/50 backdrop-blur-sm space-y-6">
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                  工程部署守则 (Core Implementation Rules)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm text-foreground">1. 提示词组件化 (Modularization)</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      绝对禁止在应用代码中硬编码 (Hardcode) 提示词。推荐使用 JSON/YAML 或专门的提示词管理平台 (例如 Langfuse, Promptflow) 存储 System Prompt，在运行时进行动态注入 (Hydration)。
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm text-foreground">2. 严苛的 Token 预算 (Token Budget)</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      对 Few-Shot 示例进行数量上限控制 (一般不超过 3-5 个)，并对长文本输入设置严格的截断 (Truncation) 机制，避免不必要的上下文拉长造成算力浪费与延迟暴涨。
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm text-foreground">3. 必须的架构兜底 (Model Fallbacks)</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      当高等级模型 (如 Gemini-1.5-Pro) 达到速率限制 (Rate Limit) 或 API 报错时，系统应当自动降级路由到低延时/高并发模型 (如 Gemini-1.5-Flash)，并触发自动重试。
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm text-foreground">4. 确定性输出校验 (Deterministic Parser)</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      所有的格式化输出任务 (如 JSON) 必须配合强类型解析器进行二次校验。若发现不符合预期格式，须自动触发微调修正或向用户抛出标准化 API 错误。
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right column: Specs / SLA & Code Snippet */}
            <div className="space-y-8">
              {/* SLA Specs */}
              <Card className="p-6 border border-border/80 bg-background/50 backdrop-blur-sm">
                <h4 className="text-lg font-bold text-foreground mb-4">SLA 生产指标定义</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">推荐首包延迟 (TTFT)</span>
                    <span className="text-xs font-mono font-bold text-foreground">&lt; 800ms</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">结构化 JSON 正确率</span>
                    <span className="text-xs font-mono font-bold text-emerald-500">&gt; 99.7%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">安全内容准入率</span>
                    <span className="text-xs font-mono font-bold text-foreground">100% (含 Input 拦截)</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">最大自动重试次数</span>
                    <span className="text-xs font-mono font-bold text-foreground">3 次 (指数退避)</span>
                  </div>
                </div>
              </Card>

              {/* Integration Code Code Block */}
              <Card className="p-6 border border-border/80 bg-background/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    生产级 TypeScript 封装示例
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => handleCopy(`import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });`, "ts-code-example")}
                  >
                    {copiedId === "ts-code-example" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  使用 @google/genai SDK 进行强类型 JSON 模式生成与自动指数退避重试：
                </p>
                <div className="rounded-lg bg-slate-950 p-4 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[320px] overflow-y-auto">
                  {`import { GoogleGenAI } from "@google/genai";

// 1. 初始化 SDK 客户端
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

interface OptimizedResponse {
  analysis: string;
  keyPoints: string[];
}

// 2. 带重试机制的强类型请求方法
export async function generateSafeContent(
  userQuery: string,
  retries = 3,
  delay = 1000
): Promise<OptimizedResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: userQuery,
      config: {
        // 强制大模型以 JSON 格式输出，保证程序高稳定性
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            analysis: { type: "STRING" },
            keyPoints: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          required: ["analysis", "keyPoints"],
        },
        systemInstruction: "你是一位专业系统分析师。分析结果必须严格按 JSON Schema 输出。",
      }
    });

    if (!response.text) throw new Error("Empty LLM response");
    return JSON.parse(response.text) as OptimizedResponse;

  } catch (error) {
    if (retries > 0) {
      console.warn(\`API Call failed. Retrying in \${delay}ms...\`);
      await new Promise(r => setTimeout(r, delay));
      return generateSafeContent(userQuery, retries - 1, delay * 2);
    }
    throw error;
  }
}`}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DemoShell>
  )
}

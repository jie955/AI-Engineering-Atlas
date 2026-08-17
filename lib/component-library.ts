import { ShieldCheck, BarChart3, GitBranch, type LucideIcon } from "lucide-react"

export interface ComponentOccurrence {
  node: string
  href: string
  form: string
}

export interface RelatedNote {
  label: string
  href: string
}

export interface LibraryComponent {
  id: string
  name: string
  icon: LucideIcon
  accent: "emerald" | "cyan" | "violet"
  summary: string
  occurrences: ComponentOccurrence[]
  relatedNotes?: RelatedNote[]
  pattern: string
  code?: string
  // "verified" (已证实: occurrences 均为 ≥2 节点的真实引用)
  // "tentative" (候补: 暂无真实节点绑定，仅为通用示意占位)
  status?: "verified" | "tentative"
}

// 已证实的组件（代码取证，非印象）
export const libraryComponents: LibraryComponent[] = [
  {
    id: "confidence-degradation",
    name: "置信度评估与降级 (Confidence & Degradation)",
    icon: ShieldCheck,
    accent: "emerald",
    status: "verified",
    summary:
      "当 Agent 的某一步输出「不确定」或「工具不可用」时，如何显式表达不确定性、并触发安全的降级路径，而非静默给出缺省值。",
    occurrences: [
      {
        node: "结构化输出 (Structured Outputs)",
        href: "/demos/structured-outputs",
        form: "Pydantic 优雅降级三策略：返回默认值 (defaults) / 过滤跳过脏数据 (skip) / 直接报错上报 (error)，在自愈重试到达上限后触发。",
      },
      {
        node: "多智能体协作系统 (合规风控)",
        href: "/demos/multi-agent-system",
        form: "子 Agent 调用外部工具（黑名单库）超时/失败 → 必须返回「评估不可用」而非静默默认分，Lead Agent 收到后直接升级人工复核。",
      },
      {
        node: "多模态 RAG (Multimodal RAG)",
        href: "/demos/multimodal-rag",
        form: "检索结果携带置信度得分，≥80 标记为 HIGH CONFIDENCE，否则标记 RISK DETECTED 进入风险处理。",
      },
      {
        node: "Harness 工程 (Harness Engineering)",
        href: "/demos/harness-engineering",
        form: "「静默失败」失败模式：工具调用失败但 Agent 继续执行，下游基于缺失数据产生看似合理但错误的输出 —— 需结构化输出验证阻断。",
      },
      {
        node: "技能工程 (Skill Engineering)",
        href: "/demos/skill-engineering",
        form: "容错机制设计：技能降级策略与重试机制保证系统稳定性。",
      },
    ],
    pattern: "通用实现思路：① 每步输出携带显式置信度/可用性信号（数值 + 状态枚举），而非埋在自由文本里；② 定义降级优先级（默认值 / 跳过 / 报错）按业务风险选择；③ 严禁 fail-silent —— 不可用信号必须向上冒泡触发人工或熔断，而非被加权平均稀释。",
    code: `# 通用降级调度：把"不确定/不可用"显式上抛，而非默认静默
from enum import Enum
from dataclasses import dataclass

class Availability(Enum):
    OK = "ok"
    UNAVAILABLE = "unavailable"   # 工具失败/超时
    LOW_CONFIDENCE = "low"        # 分数低于阈值

@dataclass
class StepResult:
    value: object
    availability: Availability
    confidence: float             # 0..1
    reason: str

def degrade(result: StepResult, policy: str) -> StepResult:
    if result.availability == Availability.UNAVAILABLE:
        # 严禁 fail-silent：直接冒泡，交由上层熔断/升级人工
        raise UpstreamUnavailable(result.reason)
    if result.availability == Availability.LOW_CONFIDENCE:
        if policy == "skip":    return None            # 跳过该要素
        if policy == "default": return StepResult(defaults, OK, 0.0, "used default")
        if policy == "error":   raise LowConfidenceError(result.reason)
    return result
`,
  },
  {
    id: "structured-scoring",
    name: "结构化评分协议 (Structured Scoring Protocol)",
    icon: BarChart3,
    accent: "cyan",
    status: "verified",
    summary:
      "把「多个来源的判断」收敛成一个可比较、可审计的数值 + 理由结构，而非自由文本投票。是加权汇总、一票否决、方差预警等决策的承载格式。",
    occurrences: [
      {
        node: "多智能体协作系统 (合规风控)",
        href: "/demos/multi-agent-system",
        form: "每个子 Agent 必须返回结构化评分（数值 + 理由字段）；Lead Agent 用「加权分 + 单项一票否决 + 评分方差过大预警」三重规则统一裁决。",
      },
      {
        node: "记忆工程 (Memory Engineering)",
        href: "/demos/memory-engineering",
        form: "检索打分综合三维加权：相关性 (50%) + 时间衰减 + 重要性加权，对记忆排序召回。",
      },
      {
        node: "评估工程 (Evaluation Engineering)",
        href: "/demos/evaluation-engineering",
        form: "LLM-as-a-Judge 对输出按指标体系打分（忠实度、相关性等），每个指标有显式阈值（如 Faithfulness ≥ 0.80）作为门控。",
      },
    ],
    pattern: "通用实现思路：① 评分必须是「数值 + 理由」二元结构，理由用于审计与事后抽查；② 多源汇聚时，单纯加权平均易被低分项稀释致命信号，需叠加硬约束（一票否决/方差预警）；③ 评分协议与决策规则解耦 —— 同一份结构化评分可被不同裁决逻辑复用。",
    code: `# 结构化评分 + 加权裁决，叠加硬约束防止致命信号被平均稀释
from dataclasses import dataclass

@dataclass
class Score:
    source: str
    value: float          # 0..100
    reason: str           # 可审计：为何给这个分

WEIGHTS = {"aml": 0.4, "pattern": 0.35, "kyc": 0.25}
VETO_BELOW = 30          # 一票否决：任一子项过低直接判高危
VAR_WARN = 25            # 方差预警：评分分歧过大升级人工

def adjudicate(scores: list[Score]) -> dict:
    values = [s.value for s in scores]
    if any(v < VETO_BELOW for v in values):
        return {"decision": "ESCALATE", "why": "single source below veto threshold"}
    weighted = sum(s.value * WEIGHTS[s.source] for s in scores)
    if (max(values) - min(values)) > VAR_WARN:
        return {"decision": "REVIEW", "why": "score variance too high", "weighted": weighted}
    return {"decision": "AUTO_PASS" if weighted < 50 else "AUTO_FLAG", "weighted": weighted}
`,
  },
  {
    id: "constraint-intent",
    name: "约束 / 意图识别 (Constraint & Intent Recognition)",
    icon: GitBranch,
    accent: "violet",
    status: "tentative",
    summary:
      "从用户请求中抽取「硬性约束」（如禁忌、预算、格式）与「意图类别」，作为下游检索/决策/工具选择的过滤与路由依据。",
    occurrences: [
      {
        node: "（通用示意 · 非绑定节点）",
        href: "/demos/component-library#constraint-intent",
        form: "本组件目前为通用模式示意：Atlas 现有节点仅泛泛提及（编排模式的「约束检测」示例、GraphRAG「提取查询意图」、Function Calling「匹配用户意图」、Single Agent「解析用户意图」），尚无沉淀为可复用实现的节点。",
      },
    ],
    relatedNotes: [
      { label: "编排模式 · 约束检测示例", href: "/demos/agent-orchestration" },
      { label: "GraphRAG · 提取查询意图", href: "/demos/graph-rag" },
      { label: "Function Calling · 匹配用户意图", href: "/demos/function-calling" },
      { label: "RAG 决策 · 约束 query 演示", href: "/demos/rag-decision" },
    ],
    pattern: "通用实现思路：① 区分「约束」(必须成立，否则拒绝/澄清) 与「意图」(决定走哪条处理路径)；② 约束最好结构化为类型化对象（category + value + polarity），便于下游做冲突检测而非字符串匹配；③ 识别失败应触发澄清而非猜测 —— 缺失约束不默认成立。",
    code: `# 约束/意图抽取 + 冲突检测（自包含通用示意）
from dataclasses import dataclass
from typing import Literal

Polarity = Literal["require", "forbid"]   # 需要 / 禁止
@dataclass
class Constraint:
    category: str          # 口味 / 健康 / 预算 ...
    value: str
    polarity: Polarity

def extract(query: str) -> tuple[list[Constraint], str]:
    # 真实系统用 LLM 或规则抽取；此处示意两条约束
    constraints = [
        Constraint("口味", "辣", "require"),
        Constraint("健康", "胃不适", "forbid"),   # 与"辣"潜在冲突
    ]
    intent = "找餐厅推荐"
    return constraints, intent

def detect_conflict(cs: list[Constraint]) -> list[str]:
    warns = []
    if any(c.value == "辣" and c.polarity == "require" for c in cs) and \
       any(c.category == "健康" for c in cs):
        warns.append("用户想要辣，但存在健康禁忌约束，需澄清或降辣")
    return warns
`,
  },
]

// 反向链接：给定节点 demoId，返回组件库中「真实出现点」命中该节点的组件与对应描述。
// 仅匹配精确 href (= `/demos/<demoId>`)，故 constraint-intent 的自引用占位不会命中任何节点。
export function getComponentsForNode(demoId: string): { component: LibraryComponent; occurrence: ComponentOccurrence }[] {
  const targetHref = `/demos/${demoId}`
  const result: { component: LibraryComponent; occurrence: ComponentOccurrence }[] = []
  for (const c of libraryComponents) {
    const occ = c.occurrences.find((o) => o.href === targetHref)
    if (occ) result.push({ component: c, occurrence: occ })
  }
  return result
}

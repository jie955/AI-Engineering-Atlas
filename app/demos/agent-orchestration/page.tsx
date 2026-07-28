"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Crown,
  Network,
  GitBranch,
  MessageSquare,
  Radio,
  Workflow,
  Layers,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"

// 五种编排模式定义
const orchestrationModes = [
  {
    key: "sequential",
    name: "顺序编排 (Sequential / Pipeline)",
    icon: GitBranch,
    accent: "cyan",
    tagline: "前一个 Agent 的输出是后一个的输入，严格接力",
    summary:
      "任务被拆成一条线性流水线，每个 Agent 只处理上一步的产物并产出下一步的输入。强调「逐步精炼」，适合步骤间存在强数据依赖、无法并行的场景。",
    diagram: `用户请求
  │
  ▼
[约束检测 Agent] ─输出─► [检索 Agent] ─输出─► [生成 Agent] ─输出─► [复核 Agent]
      │                    │                   │                   │
   拒绝/澄清            召回证据             起草答复             校验放行`,
    scenario: "步骤之间存在因果依赖，必须按序完成；或每一步都在前一步结果上做「窄化」与「精炼」。",
    caseTitle: "智能投顾决策链",
    caseDesc: "约束检测 → 检索 → 生成 → 复核：每一步都依赖上一步收敛后的结果，是典型的顺序接力。",
    caseHref: "/demos/rag-decision",
    caseNode: "RAG 个性化决策系统",
    points: [
      { t: "错误沿链传播", d: "任一步失败会污染下游，必须在每步设置校验与回退（fail-fast 而非 fail-silent）。" },
      { t: "延迟累加", d: "端到端时延 = 各步之和，需评估能否将部分步骤改为并行或预计算。" },
      { t: "接口契约", d: "相邻 Agent 之间需要稳定的结构化输入/输出约定，避免格式漂移。" },
    ],
  },
  {
    key: "parallel",
    name: "并行编排 (Parallel / Fan-out-fan-in)",
    icon: Network,
    accent: "emerald",
    tagline: "多个 Agent 同时处理，再由协调者汇总",
    summary:
      "一个分发器把任务拆成互不依赖的子任务，多个 Agent 同时执行（fan-out），最后由汇总者整合结果（fan-in）。强调「降延迟」与「多维度覆盖」。",
    diagram: `用户请求
  │
  ▼ (fan-out / 扇出)
  ├─► [研究员 A · 市场数据] ─┐
  ├─► [研究员 B · 竞品分析] ─┼─► [汇总 Agent · Synthesizer] ─► 输出
  └─► [研究员 C · 用户反馈] ─┘   (fan-in / 扇入)`,
    scenario: "子任务相互独立、无数据依赖，且希望缩短端到端时延或从不同角度覆盖同一问题。",
    caseTitle: "合规风控多智能体系统",
    caseDesc: "AML / Pattern / KYC 三个子 Agent 并行独立评分，无顺序依赖，由 Lead Agent 汇总裁决。",
    caseHref: "/demos/multi-agent-system",
    caseNode: "多智能体协作系统",
    points: [
      { t: "聚合策略", d: "汇总不是简单拼接：加权打分、投票、或多源交叉验证，需与业务目标对齐。" },
      { t: "部分失败", d: "任一分支工具超时/不可用，必须显式返回「不可用」而非静默默认，触发降级。" },
      { t: "结果一致性", d: "并行 Agent 可能给出冲突结论，需要明确的冲突消解规则（如方差过大升级）。" },
    ],
  },
  {
    key: "hierarchical",
    name: "层级式 (Hierarchical / Supervisor-Worker)",
    icon: Crown,
    accent: "violet",
    tagline: "Supervisor 拆解、分派、汇总并做统一决策",
    summary:
      "一个 Lead（Supervisor）Agent 负责理解目标、拆解子任务、分派给 Worker、回收结果并做出统一决策。介于「并行」与「集中控制」之间，强调「全局把控」。",
    diagram: `            [Lead / Supervisor Agent]
             │ 拆解并分派        │ 回收并决策
     ┌───────┴───────┬─────────┘
     ▼               ▼          ▼
 [Worker 1]      [Worker 2]   [Worker 3]
 (独立执行)      (独立执行)   (独立执行)
     └──── 汇报中间结果 ────┘
             │
             ▼
    Lead 综合 → 最终决策`,
    scenario: "子任务需要统一决策、彼此存在协调依赖，或需要单一责任点对结果负责（如风控、审批）。",
    caseTitle: "合规风控 Lead Agent 汇总打分",
    caseDesc: "本案例的 Lead Agent 即层级式的 Supervisor：分派三个子 Agent 并行评估，再统一裁决是否升级人工。",
    caseHref: "/demos/multi-agent-system",
    caseNode: "多智能体协作系统",
    points: [
      { t: "Supervisor 瓶颈", d: "所有决策收口于 Lead 节点，可能成为吞吐瓶颈与单点，需评估是否引入分层。" },
      { t: "避免环形依赖", d: "Worker 之间不应相互直接调用，所有协作经由 Supervisor，保持树状而非网状。" },
      { t: "责任集中", d: "优点是可追溯、有单一责任人；缺点是 Lead 提示词复杂，需谨慎设计分派与回收协议。" },
    ],
  },
  {
    key: "debate",
    name: "辩论 / 共识式 (Debate / Consensus)",
    icon: MessageSquare,
    accent: "amber",
    tagline: "多个 Agent 持不同立场辩论后收敛",
    summary:
      "多个 Agent 对同一问题给出不同视角（乐观 / 保守 / 中立），通过多轮辩论或投票收敛到共识。强调「压力测试」与「多角度对抗」。",
    diagram: `问题
  │
  ├─► [Agent A · 乐观视角]
  ├─► [Agent B · 保守视角] ── 多轮辩论 / 互相质疑 ──► 收敛
  └─► [Agent C · 中立视角]                              │
                                                      ▼
                                           共识结论 / 投票裁决`,
    scenario: "高风险决策、没有唯一正确答案、或希望暴露盲点与确认偏误时，用对抗性视角提升稳健性。",
    caseTitle: "暂无 Atlas 案例（进阶延伸）",
    caseDesc: "Atlas 现有协作模式速览已列出「辩论协作」，但尚未配套生产级案例，可作为下一步编排实验方向。",
    caseHref: "/demos/multi-agent-system",
    caseNode: "多智能体协作系统 · 协作模式",
    points: [
      { t: "收敛条件", d: "需预设停止规则：轮数上限、置信度阈值或裁判 Agent 判定，防止无限辩论。" },
      { t: "综合方式", d: "投票、LLM-as-Judge 或多 Agent 协商，需明确「谁有最终话语权」。" },
      { t: "成本权衡", d: "多轮对话 token 消耗高，适合低频高价值决策，不宜用于高频流水线。" },
    ],
  },
  {
    key: "event",
    name: "事件驱动 / 黑板模式 (Event-driven / Blackboard)",
    icon: Radio,
    accent: "rose",
    tagline: "Agent 不直接调用彼此，共享一块可观察状态",
    summary:
      "Agent 不直接互相调用，而是共享一块「黑板」（共享状态/事件总线）。谁观察到与自己相关的变化就介入处理，完成后写回黑板。强调「松散耦合」与「动态参与者」。",
    diagram: `        ┌──────────── 黑板 Blackboard (共享状态) ────────────┐
        │  任务上下文 · 中间结论 · 事件日志               │
        └───────┬───────────────┬───────────────┬───────┘
    [Agent 1]   │        [Agent 2]            [Agent 3]
   监听变更 ◄───┘        监听变更 ◄─────────── 监听变更
   写入结论 ───►         写入结论 ───────────► 写入结论`,
    scenario: "参与者集合不固定、流程无法预先固化，或系统需要长期运行并随时响应外部事件流。",
    caseTitle: "暂无 Atlas 案例（少见但值得了解）",
    caseDesc: "黑板模式在长周期、多角色协作系统（如运维、复杂调度）中更有价值，Atlas 暂未覆盖，作为知识边界补充。",
    caseHref: "/demos/agent-orchestration",
    caseNode: "本节点 · 进阶模式",
    points: [
      { t: "状态一致性", d: "多 Agent 并发读写黑板需版本化/锁机制，避免脏读与竞态。" },
      { t: "事件风暴", d: "一个变更可能触发连锁反应，需要去重、节流与优先级，否则失控。" },
      { t: "可观测性要求高", d: "调用关系隐式，调试困难，必须把黑板变更与事件流完整记录下来。" },
    ],
  },
]

const selectionGuide = [
  { q: "子任务之间是否有强数据依赖？", yes: "顺序编排", no: "进入下一问" },
  { q: "是否需要一个责任点统一拍板决策？", yes: "层级式编排", no: "进入下一问" },
  { q: "是否需要多角度对抗以暴露盲点？", yes: "辩论 / 共识式", no: "进入下一问" },
  { q: "参与者是否动态、流程是否无法固化？", yes: "事件驱动 / 黑板", no: "并行编排（默认首选）" },
]

const caseMapping = [
  {
    mode: "顺序编排",
    accent: "cyan" as const,
    atlas: "RAG 个性化决策系统",
    href: "/demos/rag-decision",
    note: "约束检测 → 检索 → 生成 → 复核 的线性决策链。",
  },
  {
    mode: "并行编排",
    accent: "emerald" as const,
    atlas: "多智能体协作系统 · 风控实战",
    href: "/demos/multi-agent-system",
    note: "AML / Pattern / KYC 三子 Agent 并行独立评分。",
  },
  {
    mode: "层级式编排",
    accent: "violet" as const,
    atlas: "多智能体协作系统 · Lead Agent",
    href: "/demos/multi-agent-system",
    note: "Lead Agent 作为 Supervisor 分派并汇总三个 Worker。",
  },
  {
    mode: "辩论 / 共识式",
    accent: "amber" as const,
    atlas: "（暂无案例）",
    href: "/demos/multi-agent-system",
    note: "协作模式速览已列，待补生产级案例。",
  },
  {
    mode: "事件驱动 / 黑板",
    accent: "rose" as const,
    atlas: "（暂无案例）",
    href: "/demos/agent-orchestration",
    note: "进阶知识边界，长周期调度类系统更适用。",
  },
]

const accentText: Record<string, string> = {
  cyan: "text-cyan-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
}

export default function AgentOrchestrationPage() {
  return (
    <DemoShell demoId="agent-orchestration">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DemoHero
          demoId="agent-orchestration"
          title="Agent Orchestration: 智能体编排模式"
          description="组织多个 Agent 的五种经典范式 —— 从顺序、并行、层级到辩论与事件驱动"
        />

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-muted/40 p-1 rounded-xl border border-border/50 h-auto">
            <TabsTrigger value="overview" className="text-sm py-2">🗺️ 模式全景</TabsTrigger>
            <TabsTrigger value="sequential" className="text-sm py-2">➡️ 顺序编排</TabsTrigger>
            <TabsTrigger value="parallel" className="text-sm py-2">⚡ 并行编排</TabsTrigger>
            <TabsTrigger value="hierarchical" className="text-sm py-2">👑 层级式</TabsTrigger>
            <TabsTrigger value="advanced" className="text-sm py-2">🔥 进阶模式</TabsTrigger>
            <TabsTrigger value="mapping" className="text-sm py-2">🔗 案例映射</TabsTrigger>
          </TabsList>

          {/* 总览 */}
          <TabsContent value="overview" className="space-y-8">
            <Card className="p-8 bg-linear-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border-violet-200 dark:border-violet-800">
              <h2 className="text-2xl font-bold text-foreground mb-3">为什么需要「编排模式」这层抽象？</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                单一 Agent（Track 2）讲完了，进入多智能体协作（Track 3）之前，需要先回答一个问题：
                <strong className="text-foreground"> 多个 Agent 到底有哪几种「组织方式」？</strong>
                不同的组织方式在延迟、容错、责任归属上差异巨大。本节点把编排模式本身抽出来系统梳理，
                后续的具体协作系统与案例，都可以反过来引用这里（「本案例采用层级式编排，详见编排模式节点」）。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {orchestrationModes.map((m) => {
                  const Icon = m.icon
                  return (
                    <Card key={m.key} className="p-5 border-2 border-border hover:border-primary/40 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">
                          <Icon className={`w-7 h-7 ${accentText[m.accent]}`} />
                        </div>
                        <h3 className="text-base font-bold text-foreground leading-tight">{m.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{m.tagline}</p>
                    </Card>
                  )
                })}
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Workflow className="w-6 h-6 text-primary" /> 选型决策指南
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                面对一个待设计的多 Agent 任务，按如下顺序逐条回答，即可收敛到合适的编排模式。
              </p>

              <div className="space-y-3">
                {selectionGuide.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                    <Badge variant="outline" className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono">
                      {i + 1}
                    </Badge>
                    <div className="flex-1 text-sm text-foreground">{s.q}</div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">是 →</span>
                      <Badge className="bg-primary/10 text-primary border-primary/30">{s.yes}</Badge>
                      <span className="text-xs text-muted-foreground ml-2">否 →</span>
                      <span className="text-xs text-muted-foreground">{s.no}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* 三种有案例支撑的模式，各自独立 Tab */}
          {orchestrationModes.slice(0, 3).map((m) => {
            const Icon = m.icon
            return (
              <TabsContent key={m.key} value={m.key} className="space-y-8">
                <Card className="p-8 border-2 border-primary/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-9 h-9 ${accentText[m.accent]}`} />
                      <h2 className="text-2xl font-bold text-foreground">{m.name}</h2>
                    </div>
                    <Badge variant="outline" className="text-xs w-fit">{m.tagline}</Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-4">{m.summary}</p>
                </Card>

                <Card className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" /> 结构示意
                  </h3>
                  <div className="bg-slate-950 text-slate-100 p-6 rounded-xl border border-slate-800 font-mono text-sm overflow-x-auto leading-relaxed whitespace-pre">
                    {m.diagram}
                  </div>
                </Card>

                <Card className="p-8 bg-card">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" /> 适用场景
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.scenario}</p>

                  <Link href={m.caseHref}>
                    <div className="mt-5 p-5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors flex items-start justify-between gap-4 group">
                      <div>
                        <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Atlas 案例引用</div>
                        <div className="font-bold text-foreground">{m.caseTitle}</div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{m.caseDesc}</p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">{m.caseNode}</Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </Card>

                <Card className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> 工程要点
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {m.points.map((p, idx) => (
                      <div key={idx} className="p-5 rounded-xl bg-card border border-border space-y-2">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <Badge>{idx + 1}</Badge> {p.t}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.d}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            )
          })}

          {/* 进阶两式合在一个 Tab */}
          <TabsContent value="advanced" className="space-y-8">
            {orchestrationModes.slice(3).map((m) => {
              const Icon = m.icon
              return (
                <Card key={m.key} className="p-8 border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`w-8 h-8 ${accentText[m.accent]}`} />
                    <h2 className="text-2xl font-bold text-foreground">{m.name}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-2">{m.summary}</p>

                  <div className="bg-slate-950 text-slate-100 p-6 rounded-xl border border-slate-800 font-mono text-sm overflow-x-auto leading-relaxed whitespace-pre my-6">
                    {m.diagram}
                  </div>

                  <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 mb-6 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.caseDesc}</p>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> 工程要点
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {m.points.map((p, idx) => (
                      <div key={idx} className="p-5 rounded-xl bg-card border border-border space-y-2">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <Badge>{idx + 1}</Badge> {p.t}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.d}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </TabsContent>

          {/* 案例映射 */}
          <TabsContent value="mapping" className="space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Workflow className="w-6 h-6 text-primary" /> 编排模式 × Atlas 案例反哺
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                下表把现有 Atlas 节点映射到本节点的编排模式，让抽象模式与具体案例互相引用、形成闭环。
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="p-3 font-semibold text-foreground w-1/4">编排模式</th>
                      <th className="p-3 font-semibold text-foreground w-1/4">Atlas 对应案例</th>
                      <th className="p-3 font-semibold text-foreground">映射说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {caseMapping.map((c, i) => (
                      <tr key={i}>
                        <td className="p-3">
                          <Badge variant="outline" className={accentText[c.accent]}>{c.mode}</Badge>
                        </td>
                        <td className="p-3">
                          <Link href={c.href} className="font-medium text-primary hover:underline">
                            {c.atlas}
                          </Link>
                        </td>
                        <td className="p-3 text-muted-foreground leading-relaxed">{c.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="p-5 rounded-xl bg-muted/80 border border-border text-sm text-muted-foreground flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">桥梁定位：</strong>
                本节点位于「单一智能体架构」(Track 2) 与「多智能体协作系统」(Track 3) 之间。学完单体循环后，
                先掌握「如何组织多个 Agent」，再看具体协作案例，比「先看一堆案例再回头抽象」更符合认知顺序。
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </DemoShell>
  )
}

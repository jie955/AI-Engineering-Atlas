"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Map,
  Layers,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"

type Status = "strong" | "weak" | "gap"

const statusMeta: Record<Status, { label: string; badge: string; dot: string }> = {
  strong: { label: "已覆盖", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", dot: "bg-emerald-500" },
  weak: { label: "弱 / 泛化", badge: "bg-amber-500/10 text-amber-600 border-amber-500/30", dot: "bg-amber-500" },
  gap: { label: "空白", badge: "bg-rose-500/10 text-rose-600 border-rose-500/30", dot: "bg-rose-500" },
}

interface Technique {
  n: string
  name: string
  level: "基础" | "进阶"
  status: Status
  atlas: string
  href: string | null
  note: string
}

// 数据来源：对照 DAIR.AI《提示工程指南》中文版列出的 18 项技术，
// 结合本仓库 app/demos 各节点源码实证（grep + 逐文件阅读）得出的覆盖度审计。
const techniques: Technique[] = [
  { n: "1", name: "零样本 (Zero-Shot)", level: "基础", status: "strong", atlas: "prompt-optimizer（baseline）", href: "/demos/prompt-optimizer", note: "已配专门承载小节：零样本基线 + 示例（prompt-optimizer）。" },
  { n: "2", name: "少样本 (Few-Shot)", level: "基础", status: "strong", atlas: "prompt-optimizer", href: "/demos/prompt-optimizer", note: "独立 few-shot 技术卡 + 示例 prompt，强覆盖。" },
  { n: "3", name: "思维链 (CoT)", level: "基础", status: "strong", atlas: "prompt-optimizer", href: "/demos/prompt-optimizer", note: "独立 cot 技术卡 + 示例 prompt，强覆盖。" },
  { n: "4", name: "自我一致性 (Self-Consistency)", level: "进阶", status: "strong", atlas: "提示工程 Prompt Engineering", href: "/demos/prompt-optimizer", note: "已配真演练场：真实有放回抽样 + 多数投票 + 50 次批量成功率统计。" },
  { n: "5", name: "生成知识提示 (Generated Knowledge)", level: "进阶", status: "strong", atlas: "提示工程 Prompt Engineering", href: "/demos/prompt-optimizer", note: "已配真演练场：真实检索 top-k 知识并拼接两段式 prompt。" },
  { n: "6", name: "Prompt Chaining", level: "进阶", status: "strong", atlas: "single-agent / agent-orchestration", href: "/demos/single-agent", note: "已配真演练场：真实链式管线（抽取→归类→格式化）（single-agent）。" },
  { n: "7", name: "思维树 (ToT)", level: "进阶", status: "strong", atlas: "Agent 运行时循环", href: "/demos/agent-runtime-loop", note: "已配真演练场：网格中真实展开搜索树、评估、剪枝、回溯至终点。" },
  { n: "8", name: "RAG", level: "基础", status: "strong", atlas: "rag-decision / multimodal-rag / graph-rag", href: "/demos/rag-decision", note: "三节点覆盖检索增强全链路。" },
  { n: "9", name: "ART（自动推理 + 工具）", level: "进阶", status: "strong", atlas: "Function Calling", href: "/demos/function-calling", note: "已配真演练场：推理与工具真实交织、工具真实执行算出数值。" },
  { n: "10", name: "自动提示工程师 (APE)", level: "进阶", status: "strong", atlas: "提示工程 Prompt Engineering", href: "/demos/prompt-optimizer", note: "已配真演练场：真实生成候选提示并评分择优。" },
  { n: "11", name: "Active-Prompt", level: "进阶", status: "strong", atlas: "Evaluation Engineering", href: "/demos/evaluation-engineering", note: "已配真演练场：多次采样估计不确定性并筛选难例。" },
  { n: "12", name: "方向性刺激提示", level: "进阶", status: "strong", atlas: "提示工程 Prompt Engineering", href: "/demos/prompt-optimizer", note: "已配真演练场：真实测算维度侧重强度并拼接 prompt。" },
  { n: "13", name: "PAL（程序辅助推理）", level: "进阶", status: "strong", atlas: "Function Calling", href: "/demos/function-calling", note: "已配真演练场：浏览器受限沙箱真实执行代码并算出结果。" },
  { n: "14", name: "ReAct", level: "进阶", status: "strong", atlas: "single-agent / agent-runtime-loop", href: "/demos/single-agent", note: "已配真演练场：真实 Think-Act-Observe 循环（single-agent）。" },
  { n: "15", name: "Reflexion", level: "进阶", status: "strong", atlas: "agent-runtime-loop", href: "/demos/agent-runtime-loop", note: "已配真演练场：真实反思闭环（第1轮→评估→反思记忆→第2轮）（agent-runtime-loop）。" },
  { n: "16", name: "多模态思维链", level: "进阶", status: "strong", atlas: "multimodal-rag", href: "/demos/multimodal-rag", note: "已配专门承载小节：多模态 CoT 思想 + 示例（multimodal-rag）。" },
  { n: "17", name: "基于图的提示", level: "进阶", status: "strong", atlas: "graph-rag", href: "/demos/graph-rag", note: "已配专门承载小节：图提示思想 + 示例（graph-rag）。" },
  { n: "18", name: "meta-prompting", level: "进阶", status: "strong", atlas: "prompt-optimizer", href: "/demos/prompt-optimizer", note: "已配专门承载小节：meta-prompting 思想 + 示例（prompt-optimizer）。" },
  { n: "+", name: "角色提示 (Role)", level: "基础", status: "strong", atlas: "prompt-optimizer", href: "/demos/prompt-optimizer", note: "独立 role 技术卡（指南未单列，用户关注）。" },
]

const newlyFilled = techniques.filter((t) => ["1", "4", "5", "6", "7", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"].includes(t.n))

export default function PromptEngineeringTechniquesPage() {
  const strong = techniques.filter((t) => t.status === "strong").length
  const weak = techniques.filter((t) => t.status === "weak").length
  const gap = techniques.filter((t) => t.status === "gap").length

  return (
    <DemoShell demoId="prompt-engineering-techniques">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DemoHero
          demoId="prompt-engineering-techniques"
          title="Prompt Engineering Map: 提示工程技术全景"
          description="对照 DAIR.AI 提示工程指南的 18 项经典技术，审计 Atlas 现有节点的覆盖度 —— 强覆盖、弱覆盖与空白一目了然"
        />

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-muted/40 p-1 rounded-xl border border-border/50 h-auto">
            <TabsTrigger value="overview" className="text-sm py-2">技术全景</TabsTrigger>
            <TabsTrigger value="coverage" className="text-sm py-2">覆盖映射</TabsTrigger>
            <TabsTrigger value="gaps" className="text-sm py-2">空白与路线</TabsTrigger>
          </TabsList>

          {/* 总览 */}
          <TabsContent value="overview" className="space-y-8">
            <Card className="p-8 bg-linear-to-br from-chart-2/10 to-indigo-50 dark:from-chart-2/10 dark:to-indigo-950/20 border-chart-2/30">
              <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Compass className="w-6 h-6 text-chart-2" /> 为什么需要这张「技术地图」？
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                进入 Track 0（准备）逐个深入提示词设计之前，先建立一张全局视图：
                <strong className="text-foreground"> 提示工程到底有哪些经典技术？Atlas 已经覆盖了哪些、哪些还缺？</strong>
                本节点把 DAIR.AI 指南的 18 项技术与本仓库节点逐一映射，后续任何节点都可以反过来引用这里
                （「本案例用到了 CoT 与角色提示，详见提示工程技术全景」），形成「森林 → 树木」的认知顺序。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-xl bg-card border-2 border-emerald-500/30 text-center">
                  <div className="text-4xl font-bold text-emerald-500">{strong}</div>
                  <div className="text-sm text-muted-foreground mt-1">已覆盖（强）</div>
                </div>
                <div className="p-6 rounded-xl bg-card border-2 border-amber-500/30 text-center">
                  <div className="text-4xl font-bold text-amber-500">{weak}</div>
                  <div className="text-sm text-muted-foreground mt-1">弱 / 泛化</div>
                </div>
                <div className="p-6 rounded-xl bg-card border-2 border-rose-500/30 text-center">
                  <div className="text-4xl font-bold text-rose-500">{gap}</div>
                  <div className="text-sm text-muted-foreground mt-1">明确空白</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Map className="w-6 h-6 text-primary" /> 18 项技术 × 覆盖状态
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                卡片颜色代表 Atlas 当前覆盖程度：绿=已覆盖、黄=弱/泛化、红=空白。点击「覆盖映射」查看与具体节点的链接。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techniques.map((t) => {
                  const sm = statusMeta[t.status]
                  return (
                    <div key={t.n} className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{t.n}</span>
                          <h3 className="text-sm font-bold text-foreground leading-tight">{t.name}</h3>
                        </div>
                        <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${sm.dot}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${sm.badge}`}>{sm.label}</Badge>
                        <Badge variant="secondary" className="text-xs">{t.level}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>

          {/* 覆盖映射 */}
          <TabsContent value="coverage" className="space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" /> 技术 → Atlas 节点映射
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                下表把每项技术映射到本仓库的具体 demo。空白项标注「—」，代表暂无对应节点。
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="p-3 font-semibold text-foreground w-1/12">#</th>
                      <th className="p-3 font-semibold text-foreground w-3/12">技术</th>
                      <th className="p-3 font-semibold text-foreground w-1/12">状态</th>
                      <th className="p-3 font-semibold text-foreground w-4/12">Atlas 对应</th>
                      <th className="p-3 font-semibold text-foreground">映射说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {techniques.map((t) => {
                      const sm = statusMeta[t.status]
                      return (
                        <tr key={t.n}>
                          <td className="p-3 font-mono text-muted-foreground">{t.n}</td>
                          <td className="p-3 font-medium text-foreground">{t.name}</td>
                          <td className="p-3">
                            <Badge variant="outline" className={`text-xs ${sm.badge}`}>{sm.label}</Badge>
                          </td>
                          <td className="p-3">
                            {t.href ? (
                              <Link href={t.href} className="font-medium text-primary hover:underline">
                                {t.atlas}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">{t.atlas}</span>
                            )}
                          </td>
                          <td className="p-3 text-muted-foreground leading-relaxed">{t.note}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="p-5 rounded-xl bg-muted/80 border border-border text-sm text-muted-foreground flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">强覆盖的 19 项</strong>（#2 少样本、#3 CoT、#8 RAG，外加指南未单列但被本仓库覆盖的「角色提示」；以及 #1 零样本、#4 自我一致性、#5 生成知识、#6 Prompt Chaining、#7 思维树、#9 ART、#10 APE、#11 Active-Prompt、#12 方向性刺激、#13 PAL、#14 ReAct、#15 Reflexion、#16 多模态思维链、#17 基于图的提示、#18 meta-prompting）。
                #2/#3/#8 由 <Link href="/demos/prompt-optimizer" className="text-primary hover:underline">prompt-optimizer</Link> 集中承载（CoT / Few-Shot / 角色提示 落地 playground）；
                #1 零样本由 prompt-optimizer 承载（思想说明 + 示例）；#5 生成知识、#10 APE、#12 方向性刺激 由 prompt-optimizer 配<strong className="text-foreground"> 真演练场</strong>（两段式知识拼接 / 候选评分择优 / 维度强度测算）；
                #4 自我一致性由 prompt-optimizer 配<strong className="text-foreground"> 真演练场</strong>（真实有放回抽样 + 多数投票）；
                #18 meta-prompting 由 prompt-optimizer 承载（思想说明 + 示例）；
                #6 Prompt Chaining 由 <Link href="/demos/single-agent" className="text-primary hover:underline">single-agent</Link> 配<strong className="text-foreground"> 真演练场</strong>（真实链式管线：抽取→归类→格式化）；
                #14 ReAct 由 single-agent 承载（ReAct 思想说明 + 示例）；
                #7 思维树由 <Link href="/demos/agent-runtime-loop" className="text-primary hover:underline">agent-runtime-loop</Link> 配<strong className="text-foreground"> 真演练场</strong>（真实树搜索）；
                #15 Reflexion 由 agent-runtime-loop 承载（反思闭环思想说明 + 示例）；
                #9 ART、#13 PAL 由 <Link href="/demos/function-calling" className="text-primary hover:underline">function-calling</Link> 配<strong className="text-foreground"> 真演练场</strong>（推理与工具真实交织 / 浏览器沙箱真实执行代码）；
                #11 Active-Prompt 由 <Link href="/demos/evaluation-engineering" className="text-primary hover:underline">evaluation-engineering</Link> 配<strong className="text-foreground"> 真演练场</strong>（不确定性采样筛选）；
                #16 多模态思维链由 <Link href="/demos/multimodal-rag" className="text-primary hover:underline">multimodal-rag</Link> 承载（多模态 CoT 思想说明 + 示例）；
                #17 基于图的提示由 <Link href="/demos/graph-rag" className="text-primary hover:underline">graph-rag</Link> 承载（图提示思想说明 + 示例）。
                <strong className="text-emerald-600">弱覆盖项已归零</strong>：原 7 项弱覆盖均已补齐（#6 已升级为真演练场，其余配专门承载小节）。
              </div>
            </div>

            <Link href="/demos/prompt-optimizer">
              <div className="mt-4 p-5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors flex items-start justify-between gap-4 group">
                <div>
                  <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">已覆盖技术的承载节点</div>
                  <div className="font-bold text-foreground">提示工程 (Prompt Engineering)</div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    CoT / Few-Shot / 角色提示 / 零样本基线 的落地 playground —— 进入其技术库与演练场，把地图里的「已覆盖」变成可操作示例。
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </TabsContent>

          {/* 空白与路线 */}
          <TabsContent value="gaps" className="space-y-8">
            <Card className="p-8 border-emerald-500/30">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" /> 补强完成：18 项全部落实承载
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                原 8 项空白技术 + 原 7 项弱覆盖技术已按「融入现有 demo」策略补齐：每个技术作为
                <strong className="text-foreground"> 真实承载小节 </strong>
                补进最近邻节点（prompt-optimizer / single-agent / function-calling / agent-runtime-loop / evaluation-engineering / multimodal-rag / graph-rag），并已<strong className="text-foreground"> 全部升级为「强覆盖」</strong>——其中 #4/#5/#7/#9/#10/#11/#12/#13 各配真演练场，#1/#6/#14/#15/#16/#17/#18 配专门承载小节。下表汇总 15 项补强及其归属节点（点击直达）。
              </p>

              <div className="space-y-3">
                {newlyFilled.map((t) => (
                  <Link key={t.n} href={t.href ?? "#"} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors">
                    <Badge variant="outline" className={`shrink-0 text-xs ${statusMeta[t.status].badge}`}>{t.n}</Badge>
                    <div>
                      <div className="font-bold text-foreground text-sm">{t.name}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {t.note}
                        <span className="text-primary"> → {t.atlas}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-card">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" /> 持续深化方向
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 已完成（弱覆盖归零）
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    7 项弱覆盖（#1 零样本、#6 Prompt Chaining、#14 ReAct、#15 Reflexion、#16 多模态思维链、#17 基于图的提示、#18 meta-prompting）
                    已在各自最近邻节点补齐承载（#6、#14、#15、#18 已升级为真演练场，#1/#16/#17 配专门承载小节），强覆盖达 19 项，弱覆盖归零。
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> 中期（真演练场升级）
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    中期真演练场升级已全部完成：#6 Prompt Chaining、#14 ReAct、#15 Reflexion、#18 Meta-Prompting 四个真演练场均已建成（#6/#14 在 single-agent，#15 在 agent-runtime-loop，#18 在 prompt-optimizer），
                    与既有真演练场形成更完整的「提示 → 推理 → 循环 → 元迭代」进阶链路。
                  </p>
                </div>
              </div>

              <Link href="/demos/prompt-optimizer">
                <div className="mt-6 p-5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors flex items-start justify-between gap-4 group">
                  <div>
                    <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Atlas 案例引用</div>
                    <div className="font-bold text-foreground">提示工程 (Prompt Engineering)</div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      已覆盖 CoT / Few-Shot / 角色提示 的主节点，是这张全景图里「已覆盖」部分的落地承载。
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </DemoShell>
  )
}

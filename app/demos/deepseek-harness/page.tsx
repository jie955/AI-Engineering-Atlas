"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Puzzle,
  Boxes,
  GitBranch,
  Plug,
  KeyRound,
  Database,
  Shield,
  Globe,
  Terminal,
  Workflow,
  Layers,
  Code2,
  Server,
  Cpu,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"

// 核心定位
const corePositioning = {
  slogan: "Everything is a Plugin",
  title: "一切皆插件",
  description:
    "把 LLM 调用、工具执行、会话管理、授权、沙箱等能力解耦为独立插件，让开发者灵活组合扩展，而非修改核心。",
  base: "底层基于 cordis 插件化应用框架（vendor/），通过插件注册与组合构建全部功能。",
  formula: "Agent = Model + Harness —— deepseek-harness 就是「Harness」这一半的一个开源参考实现。",
}

// Monorepo 包地图（按层分组）
interface Pkg {
  id: string
  name: string
  cn: string
  layer: string
  icon: LucideIcon
  desc: string
  details: string[]
}

const packages: Pkg[] = [
  {
    id: "core",
    name: "core",
    cn: "核心代理循环",
    layer: "内核层",
    icon: Workflow,
    desc: "Agent 循环主逻辑：思考→规划→行动→观察",
    details: ["统一的 Agent 运行时循环", "多后端模型调度", "终止条件与收敛控制"],
  },
  {
    id: "context",
    name: "context",
    cn: "上下文管理",
    layer: "内核层",
    icon: Layers,
    desc: "决定模型每个执行步骤看到什么信息",
    details: ["系统提示词管理", "对话历史整理", "工具结果注入"],
  },
  {
    id: "plan",
    name: "plan",
    cn: "计划模式",
    layer: "内核层",
    icon: Cpu,
    desc: "先规划后执行的受控模式",
    details: ["任务分解", "执行计划生成", "计划偏离检测"],
  },
  {
    id: "interaction",
    name: "interaction",
    cn: "命令交互",
    layer: "内核层",
    icon: Sparkles,
    desc: "用户指令的解析与派发",
    details: ["指令路由", "交互协议", "反馈回传"],
  },
  {
    id: "sandbox",
    name: "sandbox",
    cn: "本地沙箱",
    layer: "执行层",
    icon: Shield,
    desc: "隔离执行，保障代码安全",
    details: ["文件系统隔离", "权限默认收紧", "资源限制"],
  },
  {
    id: "shell",
    name: "shell",
    cn: "Shell 工具",
    layer: "执行层",
    icon: Terminal,
    desc: "PowerShell 等系统命令封装",
    details: ["命令白名单", "输出捕获", "超时与取消"],
  },
  {
    id: "web",
    name: "web",
    cn: "Web 工具",
    layer: "执行层",
    icon: Globe,
    desc: "网页搜索与内容获取",
    details: ["搜索源滚动", "多模态输入", "持久化附件"],
  },
  {
    id: "session",
    name: "session",
    cn: "会话管理",
    layer: "状态层",
    icon: Database,
    desc: "SQLite 持久化 + 投影缓存",
    details: ["跨会话引用", "持久化 PTY 会话", "投影缓存机制"],
  },
  {
    id: "credentials",
    name: "credentials",
    cn: "凭证管理",
    layer: "状态层",
    icon: KeyRound,
    desc: "对话式授权，凭证与协议解耦",
    details: ["授权 flow 注册", "凭证安全存储", "多种授权协议"],
  },
  {
    id: "subagent",
    name: "subagent",
    cn: "子代理后端",
    layer: "扩展层",
    icon: GitBranch,
    desc: "Claude Code / Codex 多后端调度",
    details: ["Claude Code 后端", "Codex 后端", "子代理任务派发"],
  },
  {
    id: "experimental",
    name: "experimental",
    cn: "实验性功能",
    layer: "扩展层",
    icon: Puzzle,
    desc: "agent-team / tool-agent-team",
    details: ["多 Agent 团队", "工具代理团队", "能力前瞻探索"],
  },
  {
    id: "host",
    name: "host",
    cn: "宿主服务器",
    layer: "宿主层",
    icon: Server,
    desc: "前端静态资源 + Web 服务器",
    details: ["Web 服务托管", "静态资源服务", "进程生命周期"],
  },
  {
    id: "client",
    name: "client",
    cn: "客户端",
    layer: "宿主层",
    icon: Boxes,
    desc: "UI 会话、侧边栏、工作区原语",
    details: ["UI 会话管理", "侧边栏组件", "工作区抽象"],
  },
  {
    id: "python",
    name: "python",
    cn: "Python 运行时",
    layer: "宿主层",
    icon: Code2,
    desc: "打包运行时，内建 MCP 支持",
    details: ["打包 Python 运行时", "MCP 协议接入", "跨语言能力桥接"],
  },
]

const layerOrder = ["内核层", "执行层", "状态层", "扩展层", "宿主层"]

// 关键设计决策（ADR）
const designDecisions = [
  {
    id: "capability-seams",
    tag: "ADR-0009",
    title: "能力接缝 (Capability Seams)",
    icon: Plug,
    description: "在架构中预设能力边界，解耦不同能力模块",
    points: [
      "某一能力（如模型后端）可被替换而无需改动其他部分",
      "新增能力以插件形式接入，而非侵入核心",
      "接缝是「Everything is a Plugin」的可执行载体",
    ],
    insight: "接缝设计让「换模型」「加工具」从改代码变为挂插件",
  },
  {
    id: "twin-adapters",
    tag: "ADR-0010",
    title: "双 LLM 适配器 (Twin LLM Adapters)",
    icon: GitBranch,
    description: "两个适配器接缝，支持多种模型后端并存",
    points: [
      "Agent 循环与具体模型供应商解耦",
      "可在 DeepSeek / Claude / GPT 之间无缝切换",
      "适配器承载协议差异，向上暴露统一接口",
    ],
    insight: "模型不再是硬编码依赖，而是可插拔的后端",
  },
  {
    id: "conversational-auth",
    tag: "授权模式",
    title: "对话式授权 (Conversational Authorization)",
    icon: KeyRound,
    description: "某些凭证无法静态配置，须通过与用户对话获取",
    points: [
      "打开页面、粘贴代码、选择账户等交互式获取",
      "授权流程与协议解耦，每种协议作为独立 flow 注册",
      "凭证在本地安全存储，不落明文",
    ],
    insight: "把「获取授权」本身建模为一等公民的运行时能力",
  },
]

// 六组件映射：Harness Engineering 抽象 → deepseek-harness 落地
const componentMapping = [
  {
    abstract: "上下文工程",
    en: "Context Engineering",
    concrete: "packages/context",
    icon: Layers,
    mapping: "上下文管理包统一决定模型每步看到什么",
  },
  {
    abstract: "工具编排",
    en: "Tool Orchestration",
    concrete: "插件注册 + 工具过滤",
    icon: Plug,
    mapping: "工具作为插件注册，按任务阶段动态暴露",
  },
  {
    abstract: "状态与记忆",
    en: "State & Memory",
    concrete: "packages/session",
    icon: Database,
    mapping: "SQLite 持久化 + 投影缓存，跨会话引用",
  },
  {
    abstract: "验证与安全",
    en: "Verification & Safety",
    concrete: "packages/sandbox + credentials",
    icon: Shield,
    mapping: "沙箱隔离执行 + 对话式授权门控",
  },
  {
    abstract: "人机协作",
    en: "Human-in-the-Loop",
    concrete: "Web UI + 对话式授权",
    icon: Sparkles,
    mapping: "关键凭证与高风险操作经交互式确认",
  },
  {
    abstract: "生命周期管理",
    en: "Lifecycle Management",
    concrete: "core loop + packages/host",
    icon: Workflow,
    mapping: "Agent 循环收敛控制 + 宿主进程托管",
  },
]

// 工程规范
const engineeringRigor = [
  { label: "提交数", value: "13,000+", note: "持续迭代的工程沉淀" },
  { label: "测试通道", value: "4 条", note: "单元 / E2E / 快照 / Web 压力" },
  { label: "Lint", value: "Oxlint", note: "由 ESLint 迁移升级" },
  { label: "CI/CD", value: "GitLab CI", note: "自动化回归与发布" },
]

const toolchain = [
  { tool: "Vitest", role: "多通道测试框架" },
  { tool: "lefthook", role: "Git 钩子管理" },
  { tool: "knip", role: "未使用依赖检查" },
  { tool: "jscpd", role: "重复代码检测" },
  { tool: "tsdown / tsc", role: "构建与类型检查" },
  { tool: "pnpm", role: "Monorepo 工作空间" },
]

export default function DeepSeekHarnessPage() {
  const [activePkg, setActivePkg] = useState(0)
  const [activeDecision, setActiveDecision] = useState(0)

  return (
    <DemoShell demoId="deepseek-harness">
      <div className="space-y-8">
        <DemoHero demoId="deepseek-harness" />

        {/* 核心定位 */}
        <Card className="border-2 border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <Badge variant="destructive" className="mb-3">
              开源参考实现
            </Badge>
            <div className="flex items-center gap-3">
              <Puzzle className="w-7 h-7 text-primary shrink-0" />
              <div className="text-3xl font-bold text-primary">{corePositioning.slogan}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 mb-2">
              <span className="font-semibold text-foreground">{corePositioning.title}</span> —— {corePositioning.description}
            </p>
            <div className="text-xs italic text-muted-foreground border-t border-hairline pt-4 space-y-1">
              <p>{corePositioning.base}</p>
              <p className="text-primary/80">{corePositioning.formula}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="architecture">架构拆解</TabsTrigger>
            <TabsTrigger value="design">关键设计</TabsTrigger>
            <TabsTrigger value="mapping">六组件映射</TabsTrigger>
            <TabsTrigger value="rigor">工程规范</TabsTrigger>
          </TabsList>

          {/* 架构拆解 */}
          <TabsContent value="architecture" className="space-y-6">
            <p className="text-sm text-muted-foreground">
              一个 pnpm Monorepo，<span className="text-foreground">14 个核心包</span>按职责分五层。点击任意包查看其职责明细。
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {packages.map((pkg, idx) => {
                const Icon = pkg.icon
                return (
                  <Card
                    key={pkg.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      activePkg === idx ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActivePkg(idx)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-sm font-mono">{pkg.name}</CardTitle>
                          <p className="text-xs text-muted-foreground truncate">{pkg.cn}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge variant="outline" className="text-[10px] mb-2">{pkg.layer}</Badge>
                      <p className="text-xs text-muted-foreground">{pkg.desc}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* 分层视图 */}
            <div className="space-y-3">
              {layerOrder.map((layer) => {
                const layerPkgs = packages.filter((p) => p.layer === layer)
                if (layerPkgs.length === 0) return null
                return (
                  <Card key={layer}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {layer}
                        <span className="text-xs font-normal text-muted-foreground">
                          {layerPkgs.map((p) => p.name).join(" · ")}
                        </span>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>

            {/* 明细面板 */}
            {packages[activePkg] && (
              <Card className="border-primary/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = packages[activePkg].icon
                      return <Icon className="w-6 h-6 text-primary" />
                    })()}
                    <div>
                      <CardTitle className="font-mono">{packages[activePkg].name}</CardTitle>
                      <CardDescription>
                        {packages[activePkg].cn} · {packages[activePkg].layer}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{packages[activePkg].desc}</p>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">核心职责</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {packages[activePkg].details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 关键设计 */}
          <TabsContent value="design" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {designDecisions.map((d, idx) => {
                const Icon = d.icon
                return (
                  <Card
                    key={d.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      activeDecision === idx ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActiveDecision(idx)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <CardTitle className="text-base">{d.title}</CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{d.tag}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{d.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* 决策明细 */}
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = designDecisions[activeDecision].icon
                    return <Icon className="w-6 h-6 text-primary" />
                  })()}
                  <div>
                    <CardTitle>{designDecisions[activeDecision].title}</CardTitle>
                    <CardDescription>
                      <Badge variant="secondary" className="text-[10px] mr-2">
                        {designDecisions[activeDecision].tag}
                      </Badge>
                      {designDecisions[activeDecision].description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">设计要点</h4>
                  <ul className="space-y-1">
                    {designDecisions[activeDecision].points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-xs font-semibold text-primary mb-1">核心洞察</div>
                  <p className="text-sm italic">"{designDecisions[activeDecision].insight}"</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 六组件映射 */}
          <TabsContent value="mapping" className="space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                本节点是「<span className="text-foreground">Harness 工程 (Harness Engineering)</span>」的源码级落地验证：把 6 大组件抽象，逐一对回 deepseek-harness 的真实模块。
              </p>
            </div>

            <div className="space-y-3">
              {componentMapping.map((m, idx) => {
                const Icon = m.icon
                return (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3 sm:w-56 shrink-0">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{m.abstract}</div>
                            <div className="text-xs text-muted-foreground">{m.en}</div>
                          </div>
                        </div>
                        <div className="hidden sm:block text-muted-foreground">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-mono text-sm text-primary mb-1">{m.concrete}</div>
                          <p className="text-sm text-muted-foreground">{m.mapping}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* 工程规范 */}
          <TabsContent value="rigor" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {engineeringRigor.map((r) => (
                <Card key={r.label}>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-primary font-mono">{r.value}</div>
                    <div className="text-sm font-medium mt-1">{r.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{r.note}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">工程工具链</CardTitle>
                <CardDescription>
                  版本 0.1.1-rc.2 —— 虽处早期，但已具备相当的工程成熟度
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {toolchain.map((t) => (
                    <div key={t.tool} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span>
                        <span className="font-mono font-medium">{t.tool}</span>
                        <span className="text-muted-foreground"> · {t.role}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 关键洞察 */}
        <Card className="bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
          <CardHeader>
            <CardTitle>为什么要读这份源码</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong>把抽象变成可执行</strong>：「Everything is a Plugin」不是口号，而是 cordis 插件框架上 14 个包的工程约束
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong>验证 Harness 命题</strong>：deepseek-harness 是「相同模型，40 分差异取决于 Harness 质量」这一 2026 命题的开源实证
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>
                  <strong>能力接缝是可设计出来的</strong>：ADR-0009 / ADR-0010 证明「换模型、加工具」这类演进，可以用接缝预先留出
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DemoShell>
  )
}

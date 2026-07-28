"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, FileText, Zap, BookOpen, CheckCircle, AlertCircle, Code } from "lucide-react"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"

const skillExamples = [
  {
    category: "企业与通信",
    icon: BookOpen,
    skills: [
      { 
        name: "品牌指南应用",
        desc: "教 Claude 使用公司特定的品牌指南创建文档",
        usecase: "确保所有文档符合公司品牌标准"
      },
      { 
        name: "会议记录提取",
        desc: "从会议中自动生成摘要、行动项和决议",
        usecase: "快速整理会议信息，提高效率"
      },
      { 
        name: "企业工作流",
        desc: "将公司特定的流程和最佳实践编码为技能",
        usecase: "自动化企业重复性工作"
      },
    ],
  },
  {
    category: "开发与技术",
    icon: Code,
    skills: [
      { 
        name: "Web 应用测试",
        desc: "教 Claude 如何测试 Web 应用和自动化测试流程",
        usecase: "加速软件测试和 QA 流程"
      },
      { 
        name: "MCP 服务器生成",
        desc: "通过技能生成 Model Context Protocol 服务器代码",
        usecase: "快速构建 AI 工具集成"
      },
      { 
        name: "代码审查",
        desc: "定义代码审查的标准和最佳实践",
        usecase: "提高代码质量和一致性"
      },
    ],
  },
  {
    category: "创意与设计",
    icon: Sparkles,
    skills: [
      { 
        name: "音乐创作指南",
        desc: "教 Claude 特定音乐风格和创作模式",
        usecase: "生成符合风格的音乐和曲调"
      },
      { 
        name: "艺术风格应用",
        desc: "编码特定的艺术或设计美学原则",
        usecase: "生成符合特定风格的创意内容"
      },
      { 
        name: "品牌视觉设计",
        desc: "定义品牌的颜色、排版和设计原则",
        usecase: "确保所有设计资产的一致性"
      },
    ],
  },
]

const skillStructure = [
  {
    part: "元数据（Frontmatter）",
    icon: FileText,
    content: [
      "name: 技能的唯一标识符（小写，用连字符分隔）",
      "description: 清晰描述技能的用途和何时使用",
    ],
    example: "---\nname: brand-guidelines\ndescription: 应用公司品牌指南创建文档\n---"
  },
  {
    part: "指令部分",
    icon: BookOpen,
    content: [
      "具体的操作步骤和指南",
      "示例用法和常见模式",
      "约束条件和注意事项",
    ],
    example: "# Brand Guidelines\n\n## Logo Usage\n- 最小尺寸：100px\n- 避免旋转或变形\n- ..."
  },
  {
    part: "示例与最佳实践",
    icon: CheckCircle,
    content: [
      "具体的使用示例",
      "常见错误和解决方案",
      "性能优化建议",
    ],
    example: "## Examples\n- 创建营销文档\n- 设计演示文稿\n- 生成品牌模板"
  },
]

const bestPractices = [
  {
    title: "明确的技能范围",
    description: "定义清晰的技能边界和职责，避免过度或不足",
    icon: CheckCircle,
    examples: [
      "技能应专注于单一功能领域",
      "提供明确的输入和输出说明",
      "列举具体的使用场景",
    ],
  },
  {
    title: "详尽的文档",
    description: "提供完整的指导、示例和最佳实践",
    icon: BookOpen,
    examples: [
      "包含真实的使用示例",
      "说明常见的误用方式",
      "提供故障排除指南",
    ],
  },
  {
    title: "可测试和可验证",
    description: "确保技能指令可被正确理解和执行",
    icon: Code,
    examples: [
      "使用具体的格式规范和示例",
      "定义成功的标准",
      "包含测试用例",
    ],
  },
  {
    title: "性能监控",
    description: "实时监控技能的执行性能和质量指标",
    icon: Zap,
    examples: [
      "记录技能调用延时",
      "追踪成功率和错误率",
      "收集用户反馈和改进建议",
    ],
  },
  {
    title: "容错机制",
    description: "设计降级策略和容错机制保证系统稳定性",
    icon: AlertCircle,
    examples: [
      "实现技能降级策略",
      "配置重试机制",
      "设置超时保护",
    ],
  },
  {
    title: "文档与复用",
    description: "编写完整文档支持技能的发现和复用",
    icon: CheckCircle,
    examples: [
      "提供 API 文档和示例代码",
      "建立技能库和最佳实践指南",
      "支持开发者快速集成",
    ],
  },
]

const caseStudies = [
  {
    title: "品牌文档生成",
    description: "使用品牌指南技能确保所有文档的一致性",
    impact: "减少 80% 的品牌违规问题",
    implementation: [
      "1. 创建 SKILL.md 包含品牌标准",
      "2. 在 Claude 中上传或安装此技能",
      "3. 要求 Claude 'Use the brand guidelines skill to create [content]'",
      "4. Claude 自动应用所有品牌要求"
    ]
  },
  {
    title: "自动化代码审查",
    description: "编码公司的代码审查标准为技能",
    impact: "代码审查时间减少 60%，质量提升 40%",
    implementation: [
      "1. 文档化代码审查清单和标准",
      "2. 将其编码为技能文档",
      "3. 创建示例和反例",
      "4. 在 Claude 中应用此技能进行审查"
    ]
  },
  {
    title: "企业工作流自动化",
    description: "将重复的企业流程编码为可复用的技能",
    impact: "员工效率提升 50%，错误率降低 70%",
    implementation: [
      "1. 记录详细的工作流步骤",
      "2. 标准化决策点和异常处理",
      "3. 创建技能文档和示例",
      "4. 在 Claude 中应用以自动化该流程"
    ]
  },
]

export default function SkillEngineeringPage() {
  const [activeSkillLayer, setActiveSkillLayer] = useState(0)
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <DemoShell demoId="skill-engineering">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DemoHero
          demoId="skill-engineering"
          title="Anthropic Skills 标准实战"
          description="使用 Anthropic Skills 教导 Claude 完成专业任务 — 从文档生成、代码审查到企业工作流自动化"
        />

        {/* Tabs */}
        <Tabs defaultValue="examples" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/40 p-1 rounded-xl border border-border/50 h-12">
              <TabsTrigger value="examples" className="text-sm">应用场景</TabsTrigger>
              <TabsTrigger value="structure" className="text-sm">技能结构</TabsTrigger>
              <TabsTrigger value="practices" className="text-sm">最佳实践</TabsTrigger>
              <TabsTrigger value="cases" className="text-sm">案例分析</TabsTrigger>
            </TabsList>

            {/* 应用场景 */}
            <TabsContent value="examples" className="space-y-6">
              <div className="grid gap-6">
                {skillExamples.map((category, idx) => {
                  const Icon = category.icon
                  return (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-primary" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {category.skills.map((skill, sidx) => (
                            <div key={sidx} className="border-l-2 border-primary pl-4 py-3 hover:bg-muted/50 rounded transition-colors">
                              <div className="font-medium text-foreground">{skill.name}</div>
                              <div className="text-sm text-muted-foreground mt-1">{skill.desc}</div>
                              <div className="text-xs text-primary mt-2 font-semibold">💡 {skill.usecase}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* 技能结构 */}
            <TabsContent value="structure" className="space-y-6">
              <div className="grid gap-4">
                {skillStructure.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-primary" />
                          {item.part}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {item.content.map((point, pidx) => (
                            <div key={pidx} className="flex items-start gap-3">
                              <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                              <span className="text-sm text-muted-foreground">{point}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-muted/50 p-3 rounded font-mono text-xs text-muted-foreground overflow-x-auto">
                          <pre>{item.example}</pre>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* 最佳实践 */}
            <TabsContent value="practices" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {bestPractices.map((practice, idx) => {
                  const Icon = practice.icon
                  return (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Icon className="w-5 h-5 text-primary" />
                          {practice.title}
                        </CardTitle>
                        <CardDescription>{practice.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {practice.examples.map((example, eidx) => (
                            <li key={eidx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* 案例分析 */}
            <TabsContent value="cases" className="space-y-6">
              <div className="space-y-4">
                {caseStudies.map((case_, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{case_.title}</CardTitle>
                          <CardDescription>{case_.description}</CardDescription>
                        </div>
                        <Badge className="whitespace-nowrap">{case_.impact}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-3">实现步骤：</h4>
                        <ol className="space-y-2">
                          {case_.implementation.map((step, sidx) => (
                            <li key={sidx} className="flex items-start gap-3 text-sm">
                              <span className="font-semibold text-primary min-w-fit">{sidx + 1}.</span>
                              <span className="text-muted-foreground">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Skill Workflow */}
          <Card>
            <CardHeader>
              <CardTitle>Skills 工作流</CardTitle>
              <CardDescription>从技能创建到在 Claude 中使用的完整流程</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { step: "1", title: "创建 SKILL.md", desc: "编写技能文档" },
                    { step: "2", title: "上传或安装", desc: "在 Claude 中配置" },
                    { step: "3", title: "应用技能", desc: "在对话中启用" },
                    { step: "4", title: "执行和反馈", desc: "收集效果数据" },
                    { step: "5", title: "优化迭代", desc: "持续改进" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center font-bold mb-2">
                        {item.step}
                      </div>
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                      {idx < 4 && <div className="text-muted-foreground mt-2">→</div>}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Principles */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardHeader>
              <CardTitle>Anthropic Skills 核心原则</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>专业化指导：</strong> 使用清晰的指令教导 Claude 完成特定任务和流程
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>Markdown 格式：</strong> 使用 YAML 元数据 + Markdown 内容的简洁格式定义技能
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>具体示例：</strong> 通过示例和最佳实践帮助 Claude 理解和应用技能
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>持续优化：</strong> 基于实际效果反馈，不断完善和更新技能指令
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
      </main>
    </DemoShell>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Zap, Network, Shield, Code, Database, GitBranch, Brain } from "lucide-react"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"

const mcpArchitecture = [
  {
    component: "Client",
    description: "AI 应用（Claude、Chat 应用等）",
    icon: Brain,
    responsibility: "发起请求、处理响应、管理上下文",
  },
  {
    component: "Server",
    description: "MCP 服务器",
    icon: Network,
    responsibility: "提供工具、资源、消息处理",
  },
  {
    component: "Protocol",
    description: "JSON-RPC 通信协议",
    icon: GitBranch,
    responsibility: "规范消息格式、错误处理、版本管理",
  },
  {
    component: "Resources",
    description: "数据资源定义",
    icon: Database,
    responsibility: "URI 规范、数据格式、访问权限",
  },
]

const mcpCapabilities = [
  {
    name: "工具调用",
    description: "通过 tools 协议公开函数功能",
    example: "search_documents, generate_report",
    benefits: ["灵活集成", "标准化接口"],
    implemented: true,
  },
  {
    name: "资源访问",
    description: "通过 resources 提供数据和文件",
    example: "file://database, http://api",
    benefits: ["统一资源访问", "权限管理"],
    implemented: true,
  },
  {
    name: "提示词模板",
    description: "通过 prompts 共享预定义模板",
    example: "analysis_template, summarization",
    benefits: ["一致性", "易复用"],
    implemented: true,
  },
  {
    name: "采样消息",
    description: "客户端向服务器发送采样请求",
    example: "get_completion, process_data",
    benefits: ["双向通信", "动态处理"],
    implemented: true,
  },
]

const implementationSteps = [
  {
    step: 1,
    title: "定义 MCP 服务器",
    code: `import { MCPServer } from "@modelcontextprotocol/sdk/server"

const server = new MCPServer({
  name: "my-ai-tools",
  version: "1.0.0"
})`,
    description: "初始化服务器实例",
  },
  {
    step: 2,
    title: "注册工具",
    code: `server.tool({
  name: "search_documents",
  description: "搜索文档库",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" }
    }
  },
  execute: async (params) => {
    return await searchDocuments(params.query)
  }
})`,
    description: "定义可调用的工具",
  },
  {
    step: 3,
    title: "暴露资源",
    code: `server.resource({
  uri: "file://database/users",
  name: "用户数据库",
  mimeType: "application/json",
  read: async () => await readUserDatabase()
})`,
    description: "提供数据资源访问",
  },
  {
    step: 4,
    title: "添加提示词模板",
    code: `server.prompt({
  name: "analysis_template",
  description: "数据分析模板",
  arguments: [
    { name: "dataset", description: "数据集" }
  ],
  generate: async (args) => {
    return {
      messages: [{
        role: "user",
        content: \`分析此数据集：\${args.dataset}\`
      }]
    }
  }
})`,
    description: "定义可重用的提示词",
  },
  {
    step: 5,
    title: "启动服务器",
    code: `server.connect(new StdioTransport())
  .then(() => console.log("MCP 服务器已启动"))
  .catch(err => console.error("启动失败：", err))`,
    description: "连接通信传输层",
  },
]

const useCases = [
  {
    category: "开发工具集成",
    examples: [
      { name: "IDE 代码补全", icon: Code },
      { name: "Git 版本管理", icon: GitBranch },
      { name: "数据库查询", icon: Database },
    ],
  },
  {
    category: "企业应用",
    examples: [
      { name: "知识库检索", icon: Database },
      { name: "API 聚合", icon: Network },
      { name: "权限管理", icon: Shield },
    ],
  },
]

const advantages = [
  {
    title: "标准化接口",
    description: "通过 MCP 协议，不同 AI 应用可以统一调用工具和资源",
    icon: Zap,
  },
  {
    title: "安全隔离",
    description: "服务器与客户端解耦，支持权限控制和访问限制",
    icon: Shield,
  },
  {
    title: "易于扩展",
    description: "添加新工具或资源无需修改客户端代码",
    icon: Network,
  },
  {
    title: "生态互联",
    description: "多个 MCP 服务器可组合，形成完整的能力生态",
    icon: GitBranch,
  },
]

export default function MCPEngineeringPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedImpl, setSelectedImpl] = useState(0)
  const [selectedCapability, setSelectedCapability] = useState(0)

  return (
    <DemoShell demoId="mcp-engineering">
      <main className="space-y-12">
        <DemoHero
          demoId="mcp-engineering"
          badge="ATLAS NODE #01"
          title="MCP Engineering Playroom"
          description="系统化 Model Context Protocol 工程方法论。通过标准化接口，让 AI 应用安全、可扩展地连接外部工具与数据源。"
        />

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/40 p-1 rounded-xl border border-border/50 h-12">
            <TabsTrigger value="overview" className="text-sm">概览</TabsTrigger>
            <TabsTrigger value="architecture" className="text-sm">架构</TabsTrigger>
            <TabsTrigger value="implementation" className="text-sm">实现</TabsTrigger>
            <TabsTrigger value="usecases" className="text-sm">应用场景</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-8">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  什么是 MCP？
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Model Context Protocol (MCP) 是 Anthropic 定义的开放标准，用于在 AI 应用（如 Claude）和外部工具、数据源之间建立安全、可扩展的通信协议。通过 MCP，AI 可以访问任何资源、调用任何工具，而无需直接集成代码。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {advantages.map((adv, idx) => (
                    <Card key={idx} className="bg-muted/50">
                      <CardContent className="pt-6 space-y-2">
                        <div className="flex items-center gap-2">
                          <adv.icon className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{adv.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{adv.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Capabilities Overview */}
            <Card className="border">
              <CardHeader>
                <CardTitle>MCP 核心能力</CardTitle>
                <CardDescription>四大核心功能模块</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mcpCapabilities.map((cap, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedCapability === idx
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedCapability(idx)}
                    >
                      <h3 className="font-semibold text-sm">{cap.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{cap.description}</p>
                      <div className="mt-3 space-y-2">
                        <div className="text-xs">
                          <span className="text-muted-foreground">示例：</span>
                          <code className="bg-muted px-2 py-1 rounded text-primary text-xs ml-1">{cap.example}</code>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {cap.benefits.map((benefit, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6 mt-8">
            <Card className="border">
              <CardHeader>
                <CardTitle>MCP 架构设计</CardTitle>
                <CardDescription>客户端-服务器通信模型</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mcpArchitecture.map((arch, idx) => {
                    const Icon = arch.icon
                    return (
                      <Card key={idx} className="bg-muted/50">
                        <CardContent className="pt-6 space-y-3">
                          <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-primary" />
                            <div>
                              <h3 className="font-semibold">{arch.component}</h3>
                              <p className="text-xs text-muted-foreground">{arch.description}</p>
                            </div>
                          </div>
                          <p className="text-sm">{arch.responsibility}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="mt-8 p-6 bg-muted/50 rounded-lg border border-dashed">
                  <h3 className="font-semibold mb-4">通信流程</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Badge>1</Badge>
                      <div>
                        <p className="font-medium">Client 发起请求</p>
                        <code className="text-xs bg-background px-2 py-1 rounded text-muted-foreground">
                          {'{ method: "tools/call", params: {...} }'}
                        </code>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge>2</Badge>
                      <div>
                        <p className="font-medium">Server 处理请求</p>
                        <code className="text-xs bg-background px-2 py-1 rounded text-muted-foreground">
                          执行相应的工具或返回资源
                        </code>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge>3</Badge>
                      <div>
                        <p className="font-medium">Server 返回结果</p>
                        <code className="text-xs bg-background px-2 py-1 rounded text-muted-foreground">
                          {'{ id: 1, result: {...} }'}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Implementation Tab */}
          <TabsContent value="implementation" className="space-y-6 mt-8">
            <Card className="border">
              <CardHeader>
                <CardTitle>MCP 服务器实现</CardTitle>
                <CardDescription>5 个关键步骤，从零到一</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-8">
                  {implementationSteps.map((step) => (
                    <button
                      key={step.step}
                      onClick={() => setSelectedImpl(step.step - 1)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        selectedImpl === step.step - 1
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-lg font-bold text-primary">{step.step}</div>
                      <p className="text-xs mt-1 line-clamp-2">{step.title}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{implementationSteps[selectedImpl].title}</h3>
                    <p className="text-sm text-muted-foreground">{implementationSteps[selectedImpl].description}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-muted-foreground font-mono">
                      <code>{implementationSteps[selectedImpl].code}</code>
                    </pre>
                  </div>
                </div>

                {/* Best Practices */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold mb-4">实现最佳实践</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-300">✓ 推荐做法</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• 工具输入使用严格的 JSON Schema 验证</li>
                        <li>• 实现完善的错误处理和超时机制</li>
                        <li>• 提供详细的工具描述和使用示例</li>
                        <li>• 定期版本更新和向后兼容性</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 text-red-700 dark:text-red-300">✗ 避免做法</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• 暴露敏感信息或未经验证的资源</li>
                        <li>• 没有访问控制和权限管理</li>
                        <li>• 长期运行任务导致超时</li>
                        <li>• 未记录 API 更改和破坏性更新</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Use Cases Tab */}
          <TabsContent value="usecases" className="space-y-6 mt-8">
            <Card className="border">
              <CardHeader>
                <CardTitle>MCP 应用场景</CardTitle>
                <CardDescription>在不同领域的实际应用</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {useCases.map((useCase, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-lg mb-4">{useCase.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {useCase.examples.map((example, i) => {
                        const Icon = example.icon
                        return (
                          <Card key={i} className="bg-muted/50 hover:border-primary/50 transition-colors">
                            <CardContent className="pt-6 text-center">
                              <Icon className="h-8 w-8 mx-auto text-primary mb-3" />
                              <p className="font-semibold text-sm">{example.name}</p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Implementation Examples */}
                <div className="mt-8 pt-8 border-t space-y-4">
                  <h3 className="font-semibold text-lg">实现示例</h3>
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base">企业知识库 MCP 服务器</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">工具：</span>
                        search_knowledge_base, retrieve_document, analyze_content
                      </p>
                      <p>
                        <span className="font-semibold">资源：</span>
                        file://kb/documents, http://api/search
                      </p>
                      <p>
                        <span className="font-semibold">优势：</span>
                        Claude 可直接访问企业知识库，提供精准的上下文相关答案
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base">开发工具集成</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">工具：</span>
                        read_file, execute_code, run_tests, commit_changes
                      </p>
                      <p>
                        <span className="font-semibold">资源：</span>
                        file://project, git://repo
                      </p>
                      <p>
                        <span className="font-semibold">优势：</span>
                        AI 可在代码库中工作，实现自动化开发任务
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Key Takeaways */}
        <Card className="border bg-primary/5">
          <CardHeader>
            <CardTitle>核心要点总结</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <Badge className="mt-0.5">1</Badge>
                <div>
                  <p className="font-semibold text-sm">MCP 是标准化协议</p>
                  <p className="text-xs text-muted-foreground">解耦 AI 应用和外部工具，实现灵活集成</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Badge className="mt-0.5">2</Badge>
                <div>
                  <p className="font-semibold text-sm">支持四大核心能力</p>
                  <p className="text-xs text-muted-foreground">工具、资源、提示词、采样消息完整覆盖</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Badge className="mt-0.5">3</Badge>
                <div>
                  <p className="font-semibold text-sm">安全与可扩展</p>
                  <p className="text-xs text-muted-foreground">通过权限控制和标准接口保证安全和易维护</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Badge className="mt-0.5">4</Badge>
                <div>
                  <p className="font-semibold text-sm">生态价值</p>
                  <p className="text-xs text-muted-foreground">多个 MCP 服务器组合形成完整的能力生态</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </DemoShell>
  )
}

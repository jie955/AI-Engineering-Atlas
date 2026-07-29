"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AtlasTechniqueCarrier } from "@/components/atlas-technique-carrier"
import { PALSandbox } from "@/components/pal-sandbox"
import { ArtPlayground } from "@/components/art-playground"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Sparkles,
  Zap,
  Code,
  Brain,
  Play,
  Check,
  Activity,
  Terminal,
  ArrowRight,
  Database,
  RefreshCw,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  ShieldAlert
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"

interface ToolDefinition {
  name: string
  description: string
  schema: string
  pythonImplementation: string
}

interface DemoScenario {
  id: string
  query: string
  toolName: string
  toolArgs: Record<string, any>
  toolResult: string
  tool: ToolDefinition
}

const SCENARIOS: DemoScenario[] = [
  {
    id: "weather",
    query: "查询北京明天的天气",
    toolName: "get_weather",
    toolArgs: { city: "北京" },
    toolResult: "北京明日天气：晴转多云，22°C ~ 31°C，微风，空气质量优。",
    tool: {
      name: "get_weather",
      description: "获取指定城市的实时天气预报",
      schema: `{
  "name": "get_weather",
  "description": "获取指定城市的实时天气预报",
  "parameters": {
    "type": "object",
    "properties": {
      "city": { "type": "string", "description": "城市名称，例如北京、上海" }
    },
    "required": ["city"]
  }
}`,
      pythonImplementation: `def get_weather(city: str) -> str:
    # 真实的本地函数，执行网络请求或数据库查询
    print(f"🔌 [本地执行] 正在获取 {city} 的天气数据...")
    return f"{city}明日天气：晴转多云，22°C ~ 31°C，微风。"`,
    }
  },
  {
    id: "tax",
    query: "帮我计算一下年收入 150,000 元，位于北京的所得税",
    toolName: "calculate_tax",
    toolArgs: { income: 150000, region: "北京" },
    toolResult: "针对北京地区，年收入 150,000 元的个人所得税计算结果为：起征点后应纳税所得额 90,000 元，实际应纳税额为 9,480 元。",
    tool: {
      name: "calculate_tax",
      description: "计算中国不同地区的个人所得税",
      schema: `{
  "name": "calculate_tax",
  "description": "计算中国不同地区的个人所得税",
  "parameters": {
    "type": "object",
    "properties": {
      "income": { "type": "number", "description": "年收入（人民币）" },
      "region": { "type": "string", "description": "地区名称，如北京" }
    },
    "required": ["income", "region"]
  }
}`,
      pythonImplementation: `def calculate_tax(income: float, region: str) -> str:
    print(f"🔌 [本地执行] 正在计算 {region} 地区年收入 {income} 的个税...")
    taxable = max(0.0, income - 60000)
    tax = taxable * 0.1 - 2520
    return f"针对{region}地区，年薪 {income} 元的个税计算结果为：实际应纳税额 {tax:.2f} 元。"`,
    }
  },
  {
    id: "stock",
    query: "获取特斯拉 (TSLA) 最新的股票价格",
    toolName: "get_stock_price",
    toolArgs: { ticker: "TSLA" },
    toolResult: "特斯拉 (TSLA) 最新交易价：$248.50，今日变动：+2.45%，成交量温和放大。",
    tool: {
      name: "get_stock_price",
      description: "获取指定美股或 A 股的代码实时最新收盘价",
      schema: `{
  "name": "get_stock_price",
  "description": "获取指定股票的代码实时最新收盘价",
  "parameters": {
    "type": "object",
    "properties": {
      "ticker": { "type": "string", "description": "股票代码，例如 TSLA, AAPL" }
    },
    "required": ["ticker"]
  }
}`,
      pythonImplementation: `def get_stock_price(ticker: str) -> str:
    print(f"🔌 [本地执行] 正在从行情接口抓取 {ticker} 的价格...")
    return f"{ticker} 最新交易价：$248.50，今日变动：+2.45%。"`,
    }
  }
]

type LoopStage = "idle" | "declare" | "generate" | "intercept" | "feed" | "synthesize"

interface LogItem {
  text: string
  type: "declare" | "generate" | "intercept" | "feed" | "synthesize" | "error" | "info"
  tokens?: number
}


export default function FunctionCallingPage() {
  const { toast } = useToast()
  const [activeScenarioId, setActiveScenarioId] = useState<string>("weather")
  const [stage, setStage] = useState<LoopStage>("idle")
  const [logs, setLogs] = useState<LogItem[]>([])
  const [loopActive, setLoopActive] = useState(false)
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [failoverEnabled, setFailoverEnabled] = useState(true)

  const [totalTokens, setTotalTokens] = useState<number>(0)
  const [toolExecutions, setToolExecutions] = useState<number>(0)
  const [elapsed, setElapsed] = useState<number>(0)

  useEffect(() => {
    if (!loopActive) return
    const start = Date.now()
    setElapsed(0)
    const timer = setInterval(() => {
      setElapsed(Number(((Date.now() - start) / 1000).toFixed(1)))
    }, 100)
    return () => clearInterval(timer)
  }, [loopActive])

  const scenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0]

  const addLog = (msg: string, type: LogItem["type"] = "info", tokens?: number) => {
    setLogs(prev => [...prev, { text: msg, type, tokens }])
  }

  const runLoop = async () => {
    if (loopActive) return
    setLoopActive(true)
    setLogs([])
    setTotalTokens(0)
    setToolExecutions(0)

    // 1. Declare Tools
    setStage("declare")
    setTotalTokens(115)
    addLog(`📢 [阶段 1: API Tool 声明]`, "declare", 115)
    addLog(`📤 将工具列表（包含 \`${scenario.tool.name}\` 的 JSON Schema 结构）注入请求负载。`, "declare")
    addLog(`⚙️ 正在组装 client.models.generateContent(model="gemini-3.5-flash", contents="${scenario.query}", config=GenerateContentConfig(tools=[${scenario.tool.name}]))`, "declare")
    
    await new Promise(r => setTimeout(r, 1800))
    if (!setLoopActive) return // guard

    // 2. LLM Parse and Tool Call Generation
    setStage("generate")
    setTotalTokens(130)
    addLog(`🤖 [阶段 2: 模型识别与 <tool_call> 生成]`, "generate", 130)
    addLog(`🔍 LLM 解析用户自然语言请求 "${scenario.query}"。`, "generate")
    addLog(`💡 识别到需求匹配已注册工具 \`${scenario.tool.name}\`。`, "generate")
    addLog(`📥 模型返回特殊的 JSON 工具调用结构（即 \`<tool_call>\` 或 \`tool_calls\` 数组）：\n   调用函数: "${scenario.tool.name}"\n   传入参数: ${JSON.stringify(scenario.toolArgs)}`, "generate")
    
    await new Promise(r => setTimeout(r, 1800))

    if (simulateFailure) {
      if (failoverEnabled) {
        // 3. Intercept & Local Execution with simulated Exception
        setStage("intercept")
        setToolExecutions(1)
        addLog(`🔌 [阶段 3: 本地运行时拦截并运行 - 模拟异常]`, "error")
        addLog(`🛡️ 拦截器检测到模型返回的 \`tool_calls\` 列表，阻断直接向最终用户的展示。`, "error")
        addLog(`⚡ 动态寻址本地函数映射 \`func = tool_map["${scenario.tool.name}"]\`。`, "error")
        addLog(`🏃 执行 Python 本地底层方法: \`${scenario.tool.name}(**${JSON.stringify(scenario.toolArgs)}) \`...`, "error")
        addLog(`❌ [本地执行异常] 工具函数 \`${scenario.tool.name}\` 发生运行时网络错误：\n   ConnectionTimeoutError: Failed to connect to Weather/API endpoint (Timeout after 5000ms).`, "error")
        addLog(`🔄 [故障降级日志] 检测到主数据源超时异常。系统检测到【故障降级开关】已开启！自动引导 Agent 路由至预设的备份数据源工具。`, "error")

        await new Promise(r => setTimeout(r, 2200))

        // 4. Reflective Feed result back
        setStage("feed")
        setTotalTokens(340)
        addLog(`📤 [阶段 4: 异常状态喂回，触发 Agent 反思自愈]`, "feed", 340)
        addLog(`🔄 将异常错误信息作为 \`tool\` 角色的内容回填至上下文。`, "feed")
        addLog(`📝 构造的带异常诊断历史负载:\n  [ \n    {"role": "user", "content": "${scenario.query}"},\n    {"role": "assistant", "tool_calls": [...]},\n    {"role": "tool", "name": "${scenario.tool.name}", "content": "Error: ConnectionTimeoutError. Failover required."}\n  ]`, "feed")
        addLog(`🤖 [Agent 故障降级引导] LLM 读取了异常状态，并依据内置的“容错自愈策略”开始自动决策：`, "feed")
        addLog(`💡 降级引导策略: "主数据通道暂时超时。决策：调用备用工具 get_${scenario.tool.name.replace('get_', '')}_cache() 检索备份数据，重新返回快照以保证高可用性。"`, "feed")

        await new Promise(r => setTimeout(r, 2200))

        // 4.5. Second correction Execution
        setToolExecutions(2)
        addLog(`🔌 [自愈降级：本地执行备用备份数据源]`, "intercept")
        addLog(`🏃 动态重定向到本地备份快照寻址方法...`, "intercept")
        addLog(`✅ [降级获取成功] 成功检索到最近备份快照: "${scenario.toolResult} (本地备份快照数据源)"`, "intercept")

        await new Promise(r => setTimeout(r, 1800))

        // 5. Synthesize final failure-compensated output
        setStage("synthesize")
        setTotalTokens(495)
        addLog(`✨ [阶段 5: 大模型智能降级融合产出最终回复]`, "synthesize", 495)
        addLog(`🧠 LLM 读取并理解了首轮错误原因、反思纠错行为、以及第二次成功获取的备用快照数据。`, "synthesize")
        addLog(`✍️ 模型智能融合全链路，生成带有风险警示且包含真实降级数据的最终回复：`, "synthesize")
        addLog(`💬 "由于第三方实时服务当前网络超时，已为您自动启用故障降级备用工具，成功检索到以下历史快照数据：\n   ${scenario.toolResult}\n   (该数据来自本地缓存，更新于 5 分钟前)"`, "synthesize")
      } else {
        // 3. Intercept & Local Execution with simulated Exception
        setStage("intercept")
        setToolExecutions(1)
        addLog(`🔌 [阶段 3: 本地运行时拦截并运行 - 模拟异常]`, "error")
        addLog(`🛡️ 拦截器检测到模型返回的 \`tool_calls\` 列表，阻断直接向最终用户的展示。`, "error")
        addLog(`⚡ 动态寻址本地函数映射 \`func = tool_map["${scenario.tool.name}"]\`。`, "error")
        addLog(`🏃 执行 Python 本地底层方法: \`${scenario.tool.name}(**${JSON.stringify(scenario.toolArgs)}) \`...`, "error")
        addLog(`❌ [本地执行异常] 工具函数 \`${scenario.tool.name}\` 发生运行时网络错误：\n   ConnectionTimeoutError: Failed to connect to Weather/API endpoint (Timeout after 5000ms).`, "error")
        addLog(`❌ [故障降级日志] 检测到主数据源故障！由于【故障降级开关】目前处于关闭状态，拒绝自动切换至备用数据源工具，将直接抛出错误并阻断运行。`, "error")

        await new Promise(r => setTimeout(r, 2200))

        // 4. Feed Result Back (Failure Path)
        setStage("feed")
        setTotalTokens(195)
        addLog(`📤 [阶段 4: 异常状态喂回，降级关闭导致流程阻断]`, "feed", 195)
        addLog(`🔄 将异常未降级错误包装成 \`tool\` 角色的消息，由于降级已禁用，不再引导任何自愈决策。`, "feed")
        addLog(`📝 构造的未降级历史负载:\n  [ \n    {"role": "user", "content": "${scenario.query}"},\n    {"role": "assistant", "tool_calls": [...]},\n    {"role": "tool", "name": "${scenario.tool.name}", "content": "Error: ConnectionTimeoutError. Failover disabled."}\n  ]`, "feed")
        addLog(`🤖 [Agent 决策中断] LLM 读取到服务彻底不可用且无可用的故障降级预案。`, "feed")

        await new Promise(r => setTimeout(r, 2200))

        // 5. Synthesize final failure output
        setStage("synthesize")
        setTotalTokens(290)
        addLog(`✨ [阶段 5: 大模型无奈融合输出系统故障回复]`, "synthesize", 290)
        addLog(`🧠 LLM 读取了首轮执行失败、无备份通道的诊断信息。`, "synthesize")
        addLog(`✍️ 生成无法满足请求的报错说明：`, "synthesize")
        addLog(`💬 "抱歉，由于该实时数据源不可用，且当前系统的【故障降级开关】已关闭，我们无法为您提取数据。请检查网络，开启故障降级开关，或稍后重试。"`, "synthesize")
      }

    } else {
      // 3. Intercept & Local Execution (Success Path)
      setStage("intercept")
      setToolExecutions(1)
      addLog(`🔌 [阶段 3: 本地运行时拦截并运行]`, "intercept")
      addLog(`🛡️ 拦截器检测到模型返回的 \`tool_calls\` 列表，阻断直接向最终用户的展示。`, "intercept")
      addLog(`⚡ 动态寻址本地函数映射 \`func = tool_map["${scenario.tool.name}"]\`。`, "intercept")
      addLog(`🏃 执行 Python 本地底层方法: \`${scenario.tool.name}(**${JSON.stringify(scenario.toolArgs)}) \`...`, "intercept")
      addLog(`✅ 本地函数执行完毕，成功捕获执行返回值: "${scenario.toolResult}"`, "intercept")
      
      await new Promise(r => setTimeout(r, 1800))

      // 4. Feed Result Back
      setStage("feed")
      setTotalTokens(260)
      addLog(`📤 [阶段 4: 结果喂回上下文]`, "feed", 260)
      addLog(`🔄 将本地的运行结果包装成 \`tool\` 角色的消息，附加回对话历史。`, "feed")
      addLog(`📝 构造的历史数据负载:\n  [ \n    {"role": "user", "content": "${scenario.query}"},\n    {"role": "assistant", "tool_calls": [...]},\n    {"role": "tool", "name": "${scenario.tool.name}", "content": "${scenario.toolResult}"}\n  ]`, "feed")
      addLog(`🌐 重新发起 API 请求，通知 LLM 最终融合结果。`, "feed")
      
      await new Promise(r => setTimeout(r, 1800))

      // 5. Final Response Synthesize
      setStage("synthesize")
      setTotalTokens(388)
      addLog(`✨ [阶段 5: 大模型融合产出最终回复]`, "synthesize", 388)
      addLog(`🧠 LLM 读取之前的所有会话历史和 Tool 真实执行结果。`, "synthesize")
      addLog(`✍️ 融合工具上下文，生成最终的自然语言回复：`, "synthesize")
      addLog(`💬 "${scenario.toolResult} 希望这个信息对您有所帮助！"`, "synthesize")
    }
    
    await new Promise(r => setTimeout(r, 1200))
    setStage("idle")
    setLoopActive(false)
    toast({
      title: simulateFailure 
        ? (failoverEnabled ? "反思纠错降级闭环成功" : "故障未降级阻断演示")
        : "闭环模拟圆满结束",
      description: simulateFailure 
        ? (failoverEnabled 
            ? "Agent 成功检测到工具故障并通过自愈降级回路完成备份数据兜底！"
            : "由于故障降级开关未开启，故障发生且流程阻断，验证了异常拦截保护！")
        : "纯原生 Tool-use 运行循环演示完成！"
    })
  }

  const resetLoop = () => {
    setStage("idle")
    setLogs([])
    setLoopActive(false)
    setTotalTokens(0)
    setToolExecutions(0)
    setElapsed(0)
  }

  // Code display strings
  const pythonFullCode = `import os
from google import genai
from google.genai import types

# 1. 声明本地 Python 工具函数
def get_weather(city: str) -> str:
    """获取指定城市的实时天气预报"""
    # 真实的本地函数，执行网络请求或数据库查询
    if "北京" in city:
        return "北京明日天气：晴转多云，22°C ~ 31°C，微风。"
    return f"{city}明日天气状况良好。"

def calculate_tax(income: float, region: str) -> str:
    """计算中国不同地区的个人所得税"""
    taxable = max(0.0, income - 60000)
    tax = taxable * 0.1 - 2520
    return f"针对{region}地区，年薪 {income} 元的个税计算结果为：实际应纳税额 {tax:.2f} 元。"

# 建立工具名称到函数的物理映射，供拦截后寻址
tool_map = {
    "get_weather": get_weather,
    "calculate_tax": calculate_tax
}

# 2. 初始化原生 SDK (未封装框架)
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def run_pure_tool_loop(user_prompt: str):
    print(f"User: {user_prompt}")
    
    # 将真实的 Python 函数作为 tools 传入，SDK 会自动解析函数签名生成 JSON Schema 声明
    # 对应的就是 [阶段 1: API Tool 声明]
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=user_prompt,
        config=types.GenerateContentConfig(
            tools=[get_weather, calculate_tax]
        )
    )
    
    # 模拟手写运行时事件循环 (Event Loop)
    chats = [{"role": "user", "parts": [user_prompt]}]
    
    # [阶段 2: 拦截与识别 <tool_call>]
    if response.function_calls:
        print("\\n🤖 模型生成了 Tool Call 申请！")
        # 复制第一轮 assistant 响应到对话历史中
        chats.append(response.candidates[0].content)
        
        # 遍历所有的 tool_call 请求并依次在本地拦截执行
        for call in response.function_calls:
            print(f"📥 正在解析函数: {call.name}, 参数: {call.args}")
            
            # [阶段 3: 本地运行时拦截寻址执行]
            if call.name in tool_map:
                # 动态执行本地函数并安全获取返回值
                local_func = tool_map[call.name]
                execution_result = local_func(**call.args)
                print(f"🔌 本地执行结果: {execution_result}")
                
                # [阶段 4: 结果喂回上下文]
                # 构造符合规范的 'tool' 角色回复消息
                tool_response = types.Part.from_function_response(
                    name=call.name,
                    response={"result": execution_result}
                )
                
                chats.append(types.Content(
                    role="tool",
                    parts=[tool_response]
                ))
            
        # [阶段 5: 模型融合成最终回复]
        # 将携带了 Tool 执行结果的完整会话上下文，重新喂回给大模型
        final_response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=chats,
            config=types.GenerateContentConfig(
                tools=[get_weather, calculate_tax]
            )
        )
        print(f"\\n💬 Final Assistant: {final_response.text}")
    else:
        print(f"💬 Direct Assistant: {response.text}")

if __name__ == "__main__":
    run_pure_tool_loop("查询北京明天的天气")
`

  return (
    <DemoShell demoId="function-calling">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DemoHero
          demoId="function-calling"
          title="原生 Function Calling 闭环原理"
          description="抛开三方框架的层层封装，通过最质朴的 Python 代码和原生 SDK。手把手解构大模型与本地系统深度交互的“大循环”运行核心机制，掌握拦截、寻址、执行、喂回的核心闭环。"
        />

        {/* 关联《提示工程技术全景》地图 + 扩展技术承载：补齐原空白项 #9 #13 */}
        <AtlasTechniqueCarrier
          intro="以下 2 项原为《提示工程技术全景》中的空白项，现作为扩展承载补充至此，对应本节点的工具调用与本地执行能力。"
          techniques={[
            {
              n: "9",
              name: "ART (自动推理 + 工具)",
              desc: "在推理过程中自动决定调用外部工具（计算器、检索器、代码执行）获取中间事实，再继续推理，把『推理』与『工具使用』无缝交织。本节点原生 Function Calling 闭环正是 ART 的工程落地：模型决定调哪个工具，我们只在执行兜底。",
              example:
                "Thought: 需计算复利 → Action: calculator(rate, years)\nObserve: 结果 1.34x\nThought: 结合检索到的政策 → 继续推理",
              pros: ["把不可靠的心算/记忆替换为可验证工具结果", "扩展模型能力边界"],
              cons: ["工具声明与参数拦截需谨慎", "工具失败需自愈兜底"],
              strong: true,
            },
            {
              n: "13",
              name: "PAL (程序辅助推理)",
              desc: "让模型生成可执行程序（如 Python）来表达推理步骤，借助解释器运行得到精确答案，常用于数学/符号计算。本节点的『本地执行』环节即 PAL 思想：模型产出代码，运行时执行并把结果喂回。",
              example:
                "def solve():\n    return sum(range(1, 101))\n# 解释器执行 → 5050",
              pros: ["数值与逻辑精确", "可复用既有代码生态"],
              cons: ["代码需沙箱执行", "错误处理较复杂"],
              strong: true,
            },
          ]}
        />

        {/* PAL 真演练场：#13 升级为强覆盖，真实沙箱执行代码 */}
        <PALSandbox />
        <ArtPlayground />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel - Concept and Scenario selectors */}
          <div className="lg:col-span-5 space-y-6">
            {/* Concept Introduction */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wide text-primary">
                  <BookOpen className="w-4 h-4" />
                  闭环交互核心要点
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <div>
                  <strong className="text-foreground block mb-0.5">1. Tools 声明与 API 拦截：</strong>
                  模型并不直接去连接你的数据库或执行 API，它仅根据你定义的 JSON Schema 规范匹配用户意图，生成结构化 tool_call 标识。
                </div>
                <div>
                  <strong className="text-foreground block mb-0.5">2. 无框架底层运行时（Runtime）：</strong>
                  本地客户端（如你的 Python 进程）需要捕获到此特殊标识，将主线程挂起，并在本地执行具体函数，获取执行返回字符串。
                </div>
                <div>
                  <strong className="text-foreground block mb-0.5">3. 角色注入与对话闭环：</strong>
                  必须将结果包装为 `role="tool"` 并附上原有会话历史重新递送给 LLM。LLM 读取该真实返回后，才能融合成普通自然语言答复用户。
                </div>
              </CardContent>
            </Card>

            {/* Scenario selector */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  第一步：选择交互模拟场景
                </CardTitle>
                <CardDescription>
                  选择以下一个具体的用户需求，并在右侧体验从声明到执行的闭环
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {SCENARIOS.map((sc) => {
                  const isActive = activeScenarioId === sc.id
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        if (!loopActive) {
                          setActiveScenarioId(sc.id)
                          setLogs([])
                          setStage("idle")
                        } else {
                          toast({
                            variant: "destructive",
                            title: "无法切换",
                            description: "当前模拟事件循环正在运行中，请等待其完毕。"
                          })
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg bg-background border border-border mt-0.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className={`font-bold text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          用户提问："{sc.query}"
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                          <Badge variant="outline" className="px-1 py-0 text-[9px] scale-90 origin-left">
                            本地函数: {sc.tool.name}()
                          </Badge>
                        </div>
                      </div>
                    </button>
                  )
                })}

                <div className="pt-4 border-t border-border/40 space-y-3">
                  <div className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
                    当前匹配函数的 JSON Schema 声明：
                  </div>
                  <pre className="p-3 bg-muted rounded-lg text-[10px] leading-relaxed text-muted-foreground border border-border/40 overflow-x-auto font-mono max-h-[160px]">
                    {scenario.tool.schema}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right panel - Interactive visualizer and console log */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary animate-pulse" />
                    第二步：手动触发无框架 Tool-use 事件循环
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={runLoop}
                      disabled={loopActive}
                      className="font-semibold shadow-sm flex items-center gap-1 text-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      启动闭环模拟
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetLoop}
                      disabled={loopActive && stage !== "idle"}
                      className="text-xs h-8"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                  <span>观察大模型与您的本地运行时如何轮流交接主控权</span>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none bg-muted/60 hover:bg-muted px-2.5 py-1.5 rounded-lg border border-border/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={simulateFailure}
                        onChange={(e) => setSimulateFailure(e.target.checked)}
                        disabled={loopActive}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-primary"
                      />
                      <span className="text-foreground flex items-center gap-1.5 font-mono">
                        <AlertTriangle className={`w-3.5 h-3.5 ${simulateFailure ? "text-amber-500 animate-pulse" : "text-muted-foreground"}`} />
                        触发工具调用报错
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none bg-muted/60 hover:bg-muted px-2.5 py-1.5 rounded-lg border border-border/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={failoverEnabled}
                        onChange={(e) => setFailoverEnabled(e.target.checked)}
                        disabled={loopActive}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-primary"
                      />
                      <span className="text-foreground flex items-center gap-1.5 font-mono">
                        <ShieldAlert className={`w-3.5 h-3.5 ${failoverEnabled ? "text-emerald-500 animate-pulse" : "text-muted-foreground"}`} />
                        故障降级开关
                      </span>
                    </label>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Steps Visualizer */}
                <div className="relative grid grid-cols-5 gap-1.5 border-b border-border/40 pb-6">
                  {[
                    { key: "declare", label: "1. API声明", color: "border-purple-500 text-purple-400" },
                    { key: "generate", label: "2. 模型生成", color: "border-blue-500 text-blue-400" },
                    { key: "intercept", label: "3. 本地执行", color: "border-yellow-500 text-yellow-400" },
                    { key: "feed", label: "4. 结果喂回", color: "border-orange-500 text-orange-400" },
                    { key: "synthesize", label: "5. 最终融和", color: "border-emerald-500 text-emerald-400" }
                  ].map((st, i) => {
                    const isActive = stage === st.key
                    const isPassed = !loopActive && stage === "idle" && logs.length > 0
                      ? true
                      : (
                          i < ["declare", "generate", "intercept", "feed", "synthesize"].indexOf(stage as string)
                        )

                    return (
                      <div key={st.key} className="flex flex-col items-center relative text-center">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-primary border-primary text-primary-foreground scale-110 shadow-[0_0_15px_var(--primary)] animate-pulse"
                            : isPassed
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                              : "bg-muted border-border/60 text-muted-foreground"
                        }`}>
                          {isActive ? (
                            <motion.div
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                              {i + 1}
                            </motion.div>
                          ) : isPassed && !isActive ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <motion.span
                          animate={isActive ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }}
                          whileHover={isActive ? { scale: 1.15, y: -4, opacity: 0.8 } : undefined}
                          transition={{ type: "spring", stiffness: 350, damping: 18 }}
                          className={`text-[8px] min-[400px]:text-[9px] sm:text-[10px] mt-2 font-bold transition-all duration-200 block origin-center cursor-pointer ${
                            isActive ? "text-primary" : isPassed ? "text-emerald-500" : "text-muted-foreground"
                          }`}
                        >
                          {st.label}
                        </motion.span>
                      </div>
                    )
                  })}
                </div>

                {/* Live Dashboard Summary Widget */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-muted/30 p-3.5 rounded-xl border border-border/40">
                  {/* Token Card */}
                  <div className="bg-background/40 border border-border/20 rounded-lg p-2.5 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider font-mono">
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      <span>Token 消耗</span>
                    </div>
                    <div className="mt-2.5">
                      <div className="text-lg font-black font-mono tracking-tight text-purple-400">
                        {totalTokens} <span className="text-[10px] text-muted-foreground font-normal">Tokens</span>
                      </div>
                      <div className="text-[9px] text-muted-foreground/80 mt-0.5">
                        {totalTokens > 0 ? `输入: ${Math.round(totalTokens * 0.8)} | 输出: ${Math.round(totalTokens * 0.2)}` : "等待运行"}
                      </div>
                    </div>
                  </div>

                  {/* Tool Exec Card */}
                  <div className="bg-background/40 border border-border/20 rounded-lg p-2.5 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider font-mono">
                      <Code className="w-3.5 h-3.5 text-emerald-400" />
                      <span>工具本地执行</span>
                    </div>
                    <div className="mt-2.5">
                      <div className="text-lg font-black font-mono tracking-tight text-emerald-400">
                        {toolExecutions} <span className="text-[10px] text-muted-foreground font-normal">次</span>
                      </div>
                      <div className="text-[9px] text-muted-foreground/80 mt-0.5">
                        {stage === "intercept" || toolExecutions > 0 ? "本地寻址执行拦截" : "等待运行"}
                      </div>
                    </div>
                  </div>

                  {/* Elapsed Time Card */}
                  <div className="bg-background/40 border border-border/20 rounded-lg p-2.5 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider font-mono">
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      <span>单次循环耗时</span>
                    </div>
                    <div className="mt-2.5">
                      <div className="text-lg font-black font-mono tracking-tight text-amber-400">
                        {elapsed.toFixed(1)} <span className="text-[10px] text-muted-foreground font-normal">秒</span>
                      </div>
                      <div className="text-[9px] text-muted-foreground/80 mt-0.5">
                        {loopActive ? (
                          <span className="text-amber-500/90 animate-pulse">实时计时中...</span>
                        ) : elapsed > 0 ? (
                          "主线程执行完成"
                        ) : (
                          "等待运行"
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Console Output Terminal & Self-Healing Reflection Panel */}
                {(() => {
                  let selfHealingPhase: "idle" | "exception" | "reflect" | "retry" | "complete" = "idle"
                  if (simulateFailure && (loopActive || logs.length > 0)) {
                    if (stage === "intercept" && toolExecutions === 1) {
                      selfHealingPhase = "exception"
                    } else if (stage === "feed" && toolExecutions === 1) {
                      selfHealingPhase = "reflect"
                    } else if (stage === "feed" && toolExecutions === 2) {
                      selfHealingPhase = "retry"
                    } else if (stage === "synthesize") {
                      selfHealingPhase = "complete"
                    } else if (stage === "idle" && logs.length > 0) {
                      selfHealingPhase = "complete"
                    }
                  }

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch fc-logs-and-healing-grid">
                      {/* Left Column: Console logs */}
                      <div className={`space-y-2 transition-all duration-300 fc-console-column ${simulateFailure ? "lg:col-span-7" : "lg:col-span-12"}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase tracking-widest">
                            运行时控制台 (Local Runtime Logs)
                          </span>
                          {loopActive && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-mono animate-pulse">
                              LOOP RUNNING
                            </Badge>
                          )}
                        </div>
                        <div className="p-4 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-300 border border-border/30 shadow-inner h-[320px] overflow-y-auto space-y-2.5 leading-relaxed">
                          {logs.length === 0 ? (
                            <div className="text-zinc-500 italic h-full flex items-center justify-center text-xs">
                              点击右上角“启动闭环模拟”开始捕获无框架运行轨迹
                            </div>
                          ) : (
                            logs.map((log, i) => {
                              // Standard info/fallback color with WCAG AA/AAA compliance on bg-zinc-950
                              let typeColor = "text-zinc-300"
                              let tagBg = "bg-zinc-800/60 text-zinc-300 border border-zinc-700/50"
                              let tagLabel = "INFO"
                              
                              // Accessible color theme mapping with high contrast ratio (>7:1) on dark background (#09090b)
                              switch(log.type) {
                                case "declare":
                                  typeColor = "text-purple-300 font-medium"
                                  tagBg = "bg-purple-950/60 text-purple-300 border border-purple-800/40"
                                  tagLabel = "DECLARE"
                                  break
                                case "generate":
                                  typeColor = "text-sky-300 font-medium"
                                  tagBg = "bg-sky-950/60 text-sky-300 border border-sky-800/40"
                                  tagLabel = "GENERATE"
                                  break
                                case "intercept":
                                  typeColor = "text-amber-300 font-medium"
                                  tagBg = "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                                  tagLabel = "EXECUTE"
                                  break
                                case "feed":
                                  typeColor = "text-orange-300 font-medium"
                                  tagBg = "bg-orange-950/60 text-orange-300 border border-orange-800/40"
                                  tagLabel = "FEEDBACK"
                                  break
                                case "synthesize":
                                  typeColor = "text-emerald-300 font-medium"
                                  tagBg = "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                                  tagLabel = "SYNTHESIZE"
                                  break
                                case "error":
                                  typeColor = "text-rose-300 font-medium"
                                  tagBg = "bg-rose-950/60 text-rose-300 border border-rose-800/40 animate-pulse"
                                  tagLabel = "SELF-HEAL"
                                  break
                              }

                              const isHeader = log.text.includes("[阶段") || log.text.includes("[自愈") || log.text.includes("[故障降级")
                              
                              return (
                                <div 
                                  key={i} 
                                  className={`flex flex-wrap items-start justify-between gap-4 py-1.5 px-2 rounded-lg hover:bg-zinc-900/60 transition-colors ${
                                    isHeader ? "border-t border-zinc-800/80 mt-4 first:mt-0 pt-2.5" : ""
                                  }`}
                                >
                                  <div className="flex flex-wrap items-start gap-2.5 min-w-0 flex-1">
                                    <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded font-mono shrink-0 select-none ${tagBg}`}>
                                      {tagLabel}
                                    </span>
                                    <span className={`leading-relaxed whitespace-pre-wrap ${typeColor}`}>
                                      {log.text}
                                    </span>
                                  </div>
                                  {log.tokens !== undefined && log.tokens > 0 && (
                                    <span className="text-[9px] font-mono font-medium text-purple-400 bg-purple-950/50 border border-purple-800/30 px-2 py-0.5 rounded shrink-0 select-none">
                                      +{log.tokens} t
                                    </span>
                                  )}
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>

                      {/* Right Column: Dynamic Self-Healing Strategy Reflection Panel */}
                      {simulateFailure && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="lg:col-span-5 space-y-2 flex flex-col justify-between fc-explanation-column"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-500 font-mono uppercase tracking-widest flex items-center gap-1.5">
                              <Brain className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              Agent 自愈决策引擎 (Resilience Engine)
                            </span>
                            <AnimatePresence mode="wait">
                              {selfHealingPhase === "idle" && (
                                <motion.span 
                                  key="idle"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                                >
                                  STANDBY
                                </motion.span>
                              )}
                              {selfHealingPhase === "exception" && (
                                <motion.span 
                                  key="exception"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/30 font-mono animate-pulse"
                                >
                                  ERROR DETECTED
                                </motion.span>
                              )}
                              {selfHealingPhase === "reflect" && (
                                <motion.span 
                                  key="reflect"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/30 font-mono animate-pulse"
                                >
                                  {failoverEnabled ? "SELF-REFLECTING" : "FAILOVER ABORTED"}
                                </motion.span>
                              )}
                              {selfHealingPhase === "retry" && (
                                <motion.span 
                                  key="retry"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/30 font-mono animate-pulse"
                                >
                                  FAILOVER RETRY
                                </motion.span>
                              )}
                              {selfHealingPhase === "complete" && (
                                <motion.span 
                                  key="complete"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded border font-mono flex items-center gap-1 ${
                                    failoverEnabled 
                                      ? "bg-emerald-950 text-emerald-400 border-emerald-800/30" 
                                      : "bg-rose-950 text-rose-400 border-rose-800/30"
                                  }`}
                                >
                                  {failoverEnabled ? (
                                    <>
                                      <Check className="w-3 h-3" /> HEALED
                                    </>
                                  ) : (
                                    <span>BLOCKED</span>
                                  )}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="bg-muted/40 p-4 rounded-xl border border-border/40 h-[320px] overflow-y-auto flex flex-col justify-between space-y-4 text-xs">
                            {/* Stepper Timeline */}
                            <div className="space-y-4 relative pl-3 border-l border-border/40">
                              {/* Timeline Step 1 */}
                              <div className="relative">
                                <span className={`absolute -left-[19px] top-0.5 w-3 h-3 rounded-full border transition-all duration-300 ${
                                  selfHealingPhase !== "idle"
                                    ? "bg-rose-500 border-rose-400 scale-110 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                    : "bg-zinc-800 border-zinc-700"
                                }`} />
                                <div className={`${selfHealingPhase === "idle" ? "opacity-40" : "opacity-100"} transition-all duration-300`}>
                                  <div className="font-bold flex items-center gap-1.5 text-foreground text-[11px] uppercase tracking-wide">
                                    <span>1. 运行时异常阻断</span>
                                    {selfHealingPhase === "exception" && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                                    本地运行时拦截 `tool_calls` 执行报错，阻止全局应用程序崩溃。
                                  </p>
                                  {(selfHealingPhase !== "idle") && (
                                    <div className="mt-1.5 p-2 bg-rose-950/20 border border-rose-900/30 rounded text-[9px] font-mono text-rose-300 leading-normal">
                                      Exception: ConnectionTimeoutError in get_weather()
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Timeline Step 2 */}
                              <div className="relative">
                                <span className={`absolute -left-[19px] top-0.5 w-3 h-3 rounded-full border transition-all duration-300 ${
                                  selfHealingPhase === "reflect" || selfHealingPhase === "retry" || selfHealingPhase === "complete"
                                    ? (failoverEnabled 
                                        ? (selfHealingPhase === "reflect" ? "bg-purple-500 border-purple-400 scale-110 shadow-[0_0_8px_rgba(168,85,247,0.5)] animate-pulse" : "bg-emerald-500 border-emerald-400")
                                        : "bg-rose-500 border-rose-400 scale-110 shadow-[0_0_8px_rgba(239,68,68,0.5)]")
                                    : "bg-zinc-800 border-zinc-700"
                                }`} />
                                <div className={`${
                                  selfHealingPhase === "idle" || selfHealingPhase === "exception" ? "opacity-40" : "opacity-100"
                                } transition-all duration-300`}>
                                  <div className="font-bold flex items-center gap-1.5 text-foreground text-[11px] uppercase tracking-wide">
                                    <span>2. 诊断与反思策略</span>
                                    {selfHealingPhase === "reflect" && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                                    将异常上报模型反思，大模型根据容错机制生成纠错降级策略。
                                  </p>
                                  {(selfHealingPhase === "reflect" || selfHealingPhase === "retry" || selfHealingPhase === "complete") && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-1.5 p-2 bg-purple-950/20 border border-purple-900/30 rounded text-[9px] font-sans text-purple-200 leading-normal italic"
                                    >
                                      {failoverEnabled 
                                        ? `“主数据通道暂时超时。决策：本地运行时需自动尝试降级，调用 get_${scenario.tool.name.replace('get_', '')}_cache() 检索备份快照保证高可用。”`
                                        : `“主数据通道超时，但由于【故障降级开关】已关闭，拒绝寻找/路由备份工具，流程就此中断。”`}
                                    </motion.div>
                                  )}
                                </div>
                              </div>

                              {/* Timeline Step 3 */}
                              <div className="relative">
                                <span className={`absolute -left-[19px] top-0.5 w-3 h-3 rounded-full border transition-all duration-300 ${
                                  selfHealingPhase === "retry" || selfHealingPhase === "complete"
                                    ? (failoverEnabled
                                        ? (selfHealingPhase === "retry" ? "bg-blue-500 border-blue-400 scale-110 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" : "bg-emerald-500 border-emerald-400")
                                        : "bg-zinc-800 border-zinc-700 opacity-50")
                                    : "bg-zinc-800 border-zinc-700"
                                }`} />
                                <div className={`${
                                  selfHealingPhase === "idle" || selfHealingPhase === "exception" || selfHealingPhase === "reflect" ? "opacity-40" : "opacity-100"
                                } transition-all duration-300`}>
                                  <div className="font-bold flex items-center gap-1.5 text-foreground text-[11px] uppercase tracking-wide">
                                    <span>3. 容错备选执行</span>
                                    {selfHealingPhase === "retry" && failoverEnabled && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                                    {failoverEnabled ? "重定向寻址，获取最近 5 分钟内的备份快照。" : "已跳过备用数据源工具调用（故障降级开关关闭）"}
                                  </p>
                                  {(selfHealingPhase === "retry" || selfHealingPhase === "complete") && failoverEnabled && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-1.5 p-2 bg-blue-950/20 border border-blue-900/30 rounded text-[9px] font-mono text-blue-300 leading-normal"
                                    >
                                      Success: Retracted Backup Cache Snapshot (100% Integrity)
                                    </motion.div>
                                  )}
                                </div>
                              </div>

                              {/* Timeline Step 4 */}
                              <div className="relative">
                                <span className={`absolute -left-[19px] top-0.5 w-3 h-3 rounded-full border transition-all duration-300 ${
                                  selfHealingPhase === "complete"
                                    ? (failoverEnabled ? "bg-emerald-500 border-emerald-400 scale-110 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 border-rose-400 scale-110 shadow-[0_0_8px_rgba(239,68,68,0.5)]")
                                    : "bg-zinc-800 border-zinc-700"
                                }`} />
                                <div className={`${selfHealingPhase !== "complete" ? "opacity-40" : "opacity-100"} transition-all duration-300`}>
                                  <div className="font-bold flex items-center gap-1.5 text-foreground text-[11px] uppercase tracking-wide">
                                    <span>{failoverEnabled ? "4. 智能降级融合" : "4. 阻断融合错误产出"}</span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                                    {failoverEnabled 
                                      ? "大模型重读全量上下文并提示风险，实现安全的优雅降级产出。"
                                      : "由于无法连接数据，模型直接解析原始 ConnectionTimeout 报错返回给最终用户。"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Summary Footer */}
                            <div className="pt-2 border-t border-border/30 text-[10px] text-muted-foreground flex items-center justify-between">
                              <span>降级状态与完成度:</span>
                              <span className="font-mono font-bold text-amber-500">
                                {selfHealingPhase === "idle" && "0% 等待模拟"}
                                {selfHealingPhase === "exception" && "25% 拦截异常"}
                                {selfHealingPhase === "reflect" && "50% 分析诊断"}
                                {selfHealingPhase === "retry" && (failoverEnabled ? "75% 重试备份" : "75% 跳过备份")}
                                {selfHealingPhase === "complete" && (failoverEnabled ? "100% (自愈完毕 - 优雅降级)" : "100% (自愈失败 - 流程阻断)")}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )
                })()}

                {/* Code payload visualizer based on active stage */}
                <div className="pt-4 border-t border-border/40 space-y-2">
                  <div className="text-xs font-semibold flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary" />
                    <span>该步骤原生 Python 代码实现片段：</span>
                  </div>
                  <pre className="p-3 bg-muted rounded-lg text-[10px] leading-relaxed text-muted-foreground border border-border/40 overflow-x-auto whitespace-pre font-mono">
                    {stage === "idle" && `# 准备就绪，请选择上方场景点击启动模拟\n# 您也可以切换到上方【代码蓝图】标签，阅读无框架的完整可运行底层事件循环。`}
                    {stage === "declare" && `# 1. 声明 Tool (SDK 会利用 Pydantic 自动转换为工具 Schema 声明)\ndef ${scenario.tool.name}(...):\n    """${scenario.tool.description}"""\n\n# 传递给 client 发起首轮请求\nresponse = client.models.generate_content(\n    model="gemini-2.5-flash",\n    contents="${scenario.query}",\n    config=types.GenerateContentConfig(\n        tools=[${scenario.tool.name}]\n    )\n)`}
                    {stage === "generate" && `# 2. 大模型返回请求，包含 function_calls\n# 检查是否存在模型工具调用指示：\nif response.function_calls:\n    for call in response.function_calls:\n        print(f"📥 模型申请调用函数 {call.name}，传入参数: {call.args}")`}
                    {stage === "intercept" && `# 3. 本地拦截并分发调用\ntool_map = { "${scenario.tool.name}": ${scenario.tool.name} }\nif call.name in tool_map:\n    # 动态调起本地函数并安全传入模型生成的参数\n    execution_result = tool_map[call.name](**call.args)\n    # 真实得到返回值: "${scenario.toolResult}"`}
                    {stage === "feed" && `# 4. 构建 tool 角色回复，将结果和原会话列表拼合\ntool_response = types.Part.from_function_response(\n    name="${scenario.tool.name}",\n    response={"result": "${scenario.toolResult}"}\n)\n\nchats.append(types.Content(\n    role="tool",\n    parts=[tool_response]\n))`}
                    {stage === "synthesize" && `# 5. 最终融合：大模型读取了 Tool 执行结果\n# 重新送入包含 Tool 数据的完整 history\nfinal_response = client.models.generate_content(\n    model="gemini-2.5-flash",\n    contents=chats,\n    config=types.GenerateContentConfig(\n        tools=[${scenario.tool.name}]\n    )\n)\n# 模型返回最终的自然语言解析结果\nprint(final_response.text)`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Blueprint view with copyable complete Python code */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              <span>无框架 Python SDK 底层闭环运行源码 (Pure-Python Blueprint)</span>
            </CardTitle>
            <CardDescription>
              这是一份可以直接运行的完整本地 Python 脚本。它完全抛弃了 LangChain、LlamaIndex 等高层框架包装，仅使用谷歌官方原生的 `@google/genai` 开发，完美演示了拦截与喂回闭环逻辑。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <pre className="p-4 bg-muted text-[11px] leading-relaxed rounded-xl font-mono text-muted-foreground border border-border/40 overflow-x-auto max-h-[400px]">
                {pythonFullCode}
              </pre>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/30">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>
                <strong>温馨提示：</strong>只要将 <code>os.environ["GEMINI_API_KEY"]</code> 设定为您在 AI Studio 的 API Key，并执行此脚本，您即可在终端内真实打印出以上 5 步闭环日志，感受到程序与模型深度融合的“手写”魅力！
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </DemoShell>
  )
}

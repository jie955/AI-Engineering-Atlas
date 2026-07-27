"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoShell } from "@/components/demo-shell"
import { useToast } from "@/components/ui/use-toast"
import { 
  AlertTriangle, 
  CheckCircle, 
  Code, 
  RefreshCw, 
  Play, 
  HelpCircle, 
  Terminal, 
  Settings, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Trash2, 
  Plus, 
  FileCode,
  Shield,
  Clock,
  Bug,
  Activity,
  Zap,
  ArrowDownRight
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

// JSON Disaster cases
const disasterCases = [
  {
    id: "trailing-comma",
    name: "多余尾部逗号 (Trailing Comma)",
    badJson: `{\n  "name": "张三",\n  "role": "Admin",\n}`,
    reason: "原生 JSON.parse 无法解析尾部多余逗号，导致整段数据解析失败，引发服务 Crash。",
    fixCode: `import json\n# 经典崩溃\ntry:\n    json.loads('{"name": "张三", "role": "Admin",}')\nexcept json.JSONDecodeError as e:\n    print(f"解析灾难! {e}")`
  },
  {
    id: "missing-field",
    name: "必填字段缺失 (Missing Fields)",
    badJson: `{\n  "name": "李四"\n  // 缺失 age 字段\n}`,
    reason: "当系统代码试图读取 user['age'] 时，抛出 KeyError，使得下游流程中断。",
    fixCode: `from pydantic import BaseModel\n\nclass User(BaseModel):\n    name: str\n    age: int # 强类型约束 + 运行时必填校验\n\n# 自动拦截非法数据\nUser.model_validate({"name": "李四"}) # ValidationError!`
  },
  {
    id: "type-mismatch",
    name: "字段类型错误 (Type Mismatch)",
    badJson: `{\n  "name": "王五",\n  "age": "twenty-five" // 期望整型\n}`,
    reason: "模型输出了 'twenty-five' 而不是 25。当数据库写入或算术运算时导致类型报错。",
    fixCode: `from pydantic import BaseModel, field_validator\n\nclass User(BaseModel):\n    name: str\n    age: int # 自动尝试强制转换，转换失败抛出 Validation Error`
  }
]

export default function StructuredOutputsPage() {
  const [activeTab, setActiveTab] = useState("disaster")
  const { toast } = useToast()

  // Tab 1: Disaster Simulator States
  const [selectedDisaster, setSelectedDisaster] = useState(disasterCases[0])
  const [parsedResult, setParsedResult] = useState<{ status: "idle" | "error" | "fixed"; message: string }>({ status: "idle", message: "" })

  const handleSimulateDisaster = () => {
    setParsedResult({ status: "idle", message: "" })
    setTimeout(() => {
      if (selectedDisaster.id === "trailing-comma") {
        setParsedResult({
          status: "error",
          message: "JSONDecodeError: Expecting property name enclosed in double quotes: line 4 column 1 (char 29)"
        })
        toast({
          variant: "destructive",
          title: "解析灾难！",
          description: "原生 JSON 解析器遇到多余逗号直接崩溃。"
        })
      } else if (selectedDisaster.id === "missing-field") {
        setParsedResult({
          status: "error",
          message: "KeyError: 'age' - 下游系统读取 user['age'] 时崩溃，引发全系统 500 异常。"
        })
        toast({
          variant: "destructive",
          title: "必填字段缺失！",
          description: "下游系统因 KeyError 终止执行。"
        })
      } else {
        setParsedResult({
          status: "error",
          message: "ValueError: invalid literal for int() with base 10: 'twenty-five' - 类型不匹配异常。"
        })
        toast({
          variant: "destructive",
          title: "类型不匹配！",
          description: "期望整型却收到了非数值字符串。"
        })
      }
    }, 600)
  }

  const handleSimulatePydanticFix = () => {
    setParsedResult({ status: "idle", message: "" })
    setTimeout(() => {
      setParsedResult({
        status: "fixed",
        message: "Pydantic 验证成功！系统在反序列化阶段即自动清洗并捕获异常：\n\n- 自动滤除或宽容转换类型\n- 抛出结构化 ValidationError 告知客户端/大模型\n- 确保下游代码只接触绝对安全的类型实例 (Type-Safe Object)"
      })
      toast({
        title: "Pydantic 防护罩生效",
        description: "类型验证程序优雅捕获异常并阻止未清洗的数据流入系统代码。"
      })
    }, 600)
  }

  // Tab 2: Schema Generator States
  const [schemaFields, setSchemaFields] = useState([
    { name: "id", type: "int", required: true, description: "用户唯一标示" },
    { name: "username", type: "str", required: true, description: "注册用户名" },
    { name: "email", type: "str", required: true, description: "电子邮箱，需要符合格式" },
    { name: "status", type: "str", required: false, description: "用户激活状态 (active/pending)" },
  ])
  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldType, setNewFieldType] = useState("str")
  const [newFieldRequired, setNewFieldRequired] = useState(true)
  const [newFieldDesc, setNewFieldDesc] = useState("")

  const addField = () => {
    if (!newFieldName.trim()) {
      toast({ variant: "destructive", title: "添加失败", description: "字段名不能为空" })
      return
    }
    if (schemaFields.some(f => f.name === newFieldName)) {
      toast({ variant: "destructive", title: "添加失败", description: "字段名已存在" })
      return
    }
    setSchemaFields([...schemaFields, {
      name: newFieldName,
      type: newFieldType,
      required: newFieldRequired,
      description: newFieldDesc || "未描述字段"
    }])
    setNewFieldName("")
    setNewFieldDesc("")
    toast({ title: "字段添加成功", description: `已将 ${newFieldName} 添加至 Schema` })
  }

  const removeField = (name: string) => {
    setSchemaFields(schemaFields.filter(f => f.name !== name))
  }

  const generatePydanticCode = () => {
    let code = `from pydantic import BaseModel, Field, EmailStr\nfrom typing import Optional\n\nclass UserProfile(BaseModel):\n`
    schemaFields.forEach(f => {
      let typeStr = f.type
      if (f.name === "email") typeStr = "EmailStr"
      
      if (!f.required) {
        code += `    ${f.name}: Optional[${typeStr}] = Field(\n        default=None,\n        description="${f.description}"\n    )\n`
      } else {
        code += `    ${f.name}: ${typeStr} = Field(\n        ...,\n        description="${f.description}"\n    )\n`
      }
    })
    return code
  }

  const generateInstructorCode = () => {
    return `import instructor\nfrom openai import OpenAI\n\n# 注入 Pydantic 模型，包装客户端\nclient = instructor.from_openai(OpenAI())\n\n# 直接获得强类型的 Python 对象\nuser: UserProfile = client.chat.completions.create(\n    model="gpt-4o",\n    response_model=UserProfile,\n    messages=[{"role": "user", "content": "创建用户 Alice，邮箱 alice@company.com，其 ID 是 1243"}]\n)\n\nprint(user.username, user.email, type(user.id))`
  }

  // Tab 3: Self-Healing simulator States
  const [healingStage, setHealingStage] = useState<"idle" | "stage1" | "stage2" | "stage3" | "stage4">("idle")
  const [fallbackStrategy, setFallbackStrategy] = useState<"defaults" | "skip" | "error">("defaults")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  const runSelfHealingSim = async () => {
    setLogs([])
    setHealingStage("stage1")
    addLog("🚀 [第 1 次尝试] 用户请求: '请生成用户ID为 1002，邮箱填 invalid-email，状态是 active'")
    addLog("🤖 LLM 正在构建输出...")
    
    await new Promise(r => setTimeout(r, 1200))
    setHealingStage("stage2")
    addLog("📤 LLM 输出原始 JSON:\n  {\n    \"id\": 1002,\n    \"email\": \"invalid-email\",\n    \"status\": \"active\"\n  }")
    addLog("🔍 Pydantic 进行类型与格式校验中...")

    await new Promise(r => setTimeout(r, 1200))
    setHealingStage("stage3")
    addLog("❌ Pydantic 捕获 ValidationError:")
    addLog("   - email: 'invalid-email' value is not a valid email address.")
    addLog("⚠️ 触发自愈决策机制 (Self-Correction Loop)...")
    addLog("🔄 将报错堆栈 + Pydantic Schema 重新组装为 Prompt，反馈给大模型并要求自动重试。")

    await new Promise(r => setTimeout(r, 1500))
    setHealingStage("stage4")
    
    if (fallbackStrategy === "defaults") {
      addLog("🤖 [第 2 次尝试 / 自愈重试] LLM 根据校验报错提示词重新生成...")
      addLog("📤 LLM 重新生成的 JSON 依旧缺损:\n  {\n    \"id\": 1002,\n    \"status\": \"active\"\n  } (email 字段被遗漏，或格式依然受损)")
      addLog("❌ Pydantic 再次捕获 ValidationError: Field 'email' is required.")
      addLog("⚠️ 自愈重试次数已达最大上限（Limit: 2）。开始触发预设【返回默认值 (Return Defaults)】降级策略。")
      addLog("🔧 捕获底层校验异常，动态注入系统默认防线数据...")
      addLog("📦 [降级输出] 最终解析对象:\n  {\n    \"id\": 1002,\n    \"email\": \"guest@default.com\",\n    \"status\": \"active\"\n  }")
      addLog("✅ 业务运行正常！下游代码安全无损地读取默认 email 属性，保障系统平稳不停机。")
      toast({
        title: "自愈失败 · 触发默认值兜底",
        description: "已返回预设的默认安全数据，保障下游业务流程平稳通行。"
      })
    } else if (fallbackStrategy === "skip") {
      addLog("🤖 [第 2 次尝试 / 自愈重试] LLM 根据校验报错提示词重新生成...")
      addLog("📤 LLM 重新生成的 JSON 依旧发生类型冲突:\n  {\n    \"id\": \"invalid_id_format\",\n    \"email\": \"invalid-email\"\n  }")
      addLog("❌ Pydantic 再次捕获 ValidationError: id: Value is not a valid integer.")
      addLog("⚠️ 自愈重试次数已达最大上限（Limit: 2）。开始触发预设【跳过脏数据 (Skip Dirty Data)】降级策略。")
      addLog("🗑️ 系统自动将校验失败的坏数据从批量作业管道中剔除过滤...")
      addLog("📦 [降级输出] 最终成功输出的数据列表: [] (该条脏记录已被宽容丢弃，防污染扩展)")
      addLog("✅ 主流程平稳放行！脏数据清洗成功，有效防止了下游数据库事务挂起或中断。")
      toast({
        title: "自愈失败 · 已跳过坏数据",
        description: "该损坏记录已被自动剔除，保障主程序放行无阻。"
      })
    } else {
      addLog("🤖 [第 2 次尝试 / 自愈重试] LLM 根据校验报错提示词重新生成...")
      addLog("📤 LLM 重新生成的 JSON 依旧包含错误格式:\n  {\n    \"id\": 1002,\n    \"email\": \"stubborn-bad-value\"\n  }")
      addLog("❌ Pydantic 再次捕获 ValidationError: email: value is not a valid email.")
      addLog("⚠️ 自愈重试次数已达最大上限（Limit: 2）。开始触发预设【抛出异常终止 (Error Out)】严格策略。")
      addLog("🚨 向上层调用栈抛出硬报错: ValidationError('Stubborn validation failure after 2 retries')")
      addLog("💥 [运行强制终止] 流程被紧急切断！彻底防止任何脏数据污染核心生产环境。")
      addLog("📢 系统已自动生成监控快照上报 Sentinel，并已通知值班工程师介入处理。")
      toast({
        variant: "destructive",
        title: "自愈失败 · 严格抛出硬异常",
        description: "运行已被紧急强制阻断，防止核心数据库污染。请开发人员查看控制台日志。"
      })
    }
  }

  return (
    <DemoShell demoId="structured-outputs">
      <div className="space-y-10">
        
        {/* Course positioning description block */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-background to-background p-6 md:p-8">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                定位 / Positioning
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight">从 “生成文本” 到 “生成系统代码” 的安全桥梁</h2>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                在真实工程场景中，大模型生成的自由文本几乎无法被程序读取和利用。结构化输出 (Structured Outputs) 与强类型验证，是现代 AI 系统能将模型预测与传统软件业务无缝融合的关键防线。
              </p>
            </div>
            <div className="flex items-center gap-4 border-l border-hairline pl-0 md:pl-6 pt-4 md:pt-0">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">预计掌握时间</div>
                <div className="text-lg font-bold font-mono text-primary flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 45 分钟
                </div>
              </div>
              <div className="space-y-1 ml-6">
                <div className="text-xs text-muted-foreground">阶段等级</div>
                <div className="text-lg font-bold text-chart-2">Track 0 · 基础</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mb-8">
            <TabsTrigger value="disaster" className="text-xs sm:text-sm">
              <Bug className="w-4 h-4 mr-2" />
              1. 痛点：JSON 灾难
            </TabsTrigger>
            <TabsTrigger value="schema" className="text-xs sm:text-sm">
              <Code className="w-4 h-4 mr-2" />
              2. 强类型约束 (Schema)
            </TabsTrigger>
            <TabsTrigger value="healing" className="text-xs sm:text-sm">
              <Shield className="w-4 h-4 mr-2" />
              3. 自愈与降级策略
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: JSON Disaster */}
          <TabsContent value="disaster" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Disaster selection and code */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <span>不加约束的 JSON 为什么是工程灾难？</span>
                    </CardTitle>
                    <CardDescription>
                      选择大模型经常犯的数据输出错误，体验系统直接崩溃：
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {disasterCases.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setSelectedDisaster(d)
                          setParsedResult({ status: "idle", message: "" })
                        }}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                          selectedDisaster.id === d.id 
                            ? "border-primary bg-primary/5 text-foreground shadow-md"
                            : "border-border/60 bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          selectedDisaster.id === d.id ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                        }`} />
                        <div>
                          <div className="font-bold text-sm text-foreground">{d.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {d.reason}
                          </div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Bad output visualization */}
                <Card className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
                      LLM 异常输出示例
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative rounded-lg overflow-hidden border border-red-500/20 bg-red-500/5 p-4 font-mono text-xs text-red-400">
                      <div className="absolute right-3 top-3 text-[10px] uppercase font-bold tracking-widest text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                        UNSAFE
                      </div>
                      <pre className="whitespace-pre-wrap">{selectedDisaster.badJson}</pre>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sandbox Execution Visualization */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-border bg-card h-full flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" />
                        <span>原生解析 VS Pydantic 防护</span>
                      </CardTitle>
                      <CardDescription>
                        模拟程序代码反序列化并处理这些数据流的真实机制。
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          variant="destructive" 
                          className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold"
                          onClick={handleSimulateDisaster}
                        >
                          <Play className="w-4 h-4 fill-current" />
                          原生 json.loads() 直接解析
                        </Button>
                        <Button 
                          variant="default" 
                          className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={handleSimulatePydanticFix}
                        >
                          <Shield className="w-4 h-4" />
                          使用 Pydantic 类型安全接收
                        </Button>
                      </div>

                      {/* Displaying run results */}
                      <div className="border border-border/80 bg-muted/40 rounded-xl p-4 min-h-[220px] font-mono text-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                            <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-wider">执行沙箱 (Execution Sandbox)</span>
                            {parsedResult.status === "error" && (
                              <span className="text-red-500 font-bold flex items-center gap-1 text-[10px]"><AlertTriangle className="w-3.5 h-3.5" /> 崩溃 / Crash!</span>
                            )}
                            {parsedResult.status === "fixed" && (
                              <span className="text-emerald-500 font-bold flex items-center gap-1 text-[10px]"><CheckCircle className="w-3.5 h-3.5" /> 已捕获校验异常 / Type Safe</span>
                            )}
                            {parsedResult.status === "idle" && (
                              <span className="text-muted-foreground text-[10px]">等待运行...</span>
                            )}
                          </div>

                          <AnimatePresence mode="wait">
                            {parsedResult.status === "idle" ? (
                              <motion.div 
                                key="idle"
                                className="text-muted-foreground italic py-6 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                点击上方按钮运行模拟沙箱查看结果
                              </motion.div>
                            ) : (
                              <motion.div
                                key={parsedResult.status}
                                className={parsedResult.status === "error" ? "text-red-400 whitespace-pre-wrap" : "text-emerald-400 whitespace-pre-wrap"}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {parsedResult.message}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Mitigation Code Box */}
                        <div className="mt-4 pt-3 border-t border-border/40">
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1">
                            <Code className="w-3 h-3 text-primary" /> 对应的防御代码 (Python)
                          </div>
                          <pre className="p-3 bg-muted rounded-lg text-[10px] leading-relaxed text-muted-foreground border border-border/40 overflow-x-auto whitespace-pre">
                            {selectedDisaster.fixCode}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>

            </div>

            {/* Why Pydantic Box */}
            <Card className="border border-border bg-muted/20">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="p-2 w-fit rounded-lg bg-red-500/10 text-red-500">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-base">无格式限制的痛点</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      传统的正则表达式解析大模型输出，极易在返回包含引号、特殊换行符或空格时发生匹配异常，是生产环境不稳定的首要根源。
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-500">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-base">Pydantic 核心数据防守</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      在大模型下游建立强类型的 Pydantic 模型，起到数据「清算所」的作用。一旦大模型产生瑕疵格式，能在到达业务系统前瞬间被拦截，并发出标准报错。
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-500">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-base">原生 JSON Schema 支持</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      现代主流大模型 (如 GPT-4, Gemini) 原生支持传入 JSON Schema 作为输出约束条件，从大模型底层解码阶段即强制限制输出格式。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Schema Builder */}
          <TabsContent value="schema" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Interactive Field Builder */}
              <div className="lg:col-span-6 space-y-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">交互式 Pydantic Schema 设计器</CardTitle>
                    <CardDescription>
                      设计你的数据结构，动态实时生成 Pydantic 校验模型与 Instructor 执行约束：
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Active Schema Fields */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">当前模型字段 (Fields)</label>
                      <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/20">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border/60 bg-muted/50 text-muted-foreground">
                              <th className="p-2.5 font-semibold">字段名</th>
                              <th className="p-2.5 font-semibold">类型</th>
                              <th className="p-2.5 font-semibold">必填</th>
                              <th className="p-2.5 font-semibold">作用描述</th>
                              <th className="p-2.5 text-right font-semibold">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {schemaFields.map((field) => (
                              <tr key={field.name} className="border-b border-border/30 hover:bg-muted/10">
                                <td className="p-2.5 font-mono text-primary font-bold">{field.name}</td>
                                <td className="p-2.5">
                                  <Badge variant="secondary" className="font-mono text-[10px]">{field.type}</Badge>
                                </td>
                                <td className="p-2.5">{field.required ? "✅ 是" : "❌ 否"}</td>
                                <td className="p-2.5 text-muted-foreground truncate max-w-[120px]">{field.description}</td>
                                <td className="p-2.5 text-right">
                                  <button 
                                    onClick={() => removeField(field.name)}
                                    className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Add Field Form */}
                    <div className="pt-4 border-t border-border/40 space-y-3">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        新增约束字段
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] text-muted-foreground">字段名</label>
                          <input 
                            type="text" 
                            placeholder="如: age, phone" 
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                            className="w-full text-xs p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] text-muted-foreground">字段类型</label>
                          <select 
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="str">String (字符串)</option>
                            <option value="int">Integer (整型)</option>
                            <option value="float">Float (浮点数)</option>
                            <option value="bool">Boolean (布尔值)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] text-muted-foreground">描述含义 (极其关键，LLM 会据此生成内容)</label>
                          <input 
                            type="text" 
                            placeholder="如: 用户的注册年龄..." 
                            value={newFieldDesc}
                            onChange={(e) => setNewFieldDesc(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1 flex flex-col justify-end">
                          <div className="flex items-center gap-2 mb-2">
                            <input 
                              type="checkbox" 
                              id="field-required"
                              checked={newFieldRequired}
                              onChange={(e) => setNewFieldRequired(e.target.checked)}
                              className="rounded border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor="field-required" className="text-xs font-medium cursor-pointer">设为必填字段</label>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={addField}
                        className="w-full text-xs font-bold flex items-center justify-center gap-1.5 mt-2"
                        variant="secondary"
                      >
                        <Plus className="w-4 h-4" /> 添加该字段
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </div>

              {/* Live Code Code block generators */}
              <div className="lg:col-span-6 space-y-6">
                <Card className="border-border bg-card h-full flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-primary" />
                        <span>自动生成的 Python 工程规范</span>
                      </CardTitle>
                      <CardDescription>
                        下面是自动生成的 Pydantic 类声明，以及使用 Instructor 行业标准工具获取强类型数据的代码：
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Section 1: Pydantic Code */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">1. Pydantic Model Schema</span>
                        <pre className="p-4 bg-muted font-mono text-[10px] leading-relaxed border border-border rounded-xl text-muted-foreground overflow-x-auto max-h-[220px]">
                          {generatePydanticCode()}
                        </pre>
                      </div>

                      {/* Section 2: Instructor Usage Code */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">2. Instructor 客户端请求适配</span>
                        <pre className="p-4 bg-muted font-mono text-[10px] leading-relaxed border border-border rounded-xl text-muted-foreground overflow-x-auto max-h-[200px]">
                          {generateInstructorCode()}
                        </pre>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>

            </div>
          </TabsContent>

          {/* Tab 3: Self-Healing & Fallback */}
          <TabsContent value="healing" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Simulation explanation & steps */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">自愈重试与优雅降级策略</CardTitle>
                    <CardDescription>
                      在实际工程中，当大模型生成的 JSON 报错时，我们采用以下两条坚实防线：
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3.5">
                      <div className="flex items-start gap-3 p-3.5 rounded-xl border border-primary/20 bg-primary/5">
                        <RefreshCw className="w-5 h-5 text-primary mt-0.5 animate-spin duration-3000" />
                        <div>
                          <h4 className="text-sm font-bold">第一防线：Self-Healing 自愈重试</h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            当校验器抛出 ValidationError 时，自动将具体的报错定位（如：“字段 email 格式非法”）作为新提示词注入，并请求大模型对该错误进行精准自愈重填。
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <Shield className="w-5 h-5 text-emerald-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold">第二防线：优雅降级 (Fallback)</h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            若自愈重试 2-3 次依然全盘出错，此时不能向前端报错。应采用<strong>异常恢复策略</strong>：返回默认安全对象、跳过脏数据、或报错中断触发熔断。
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={runSelfHealingSim}
                      disabled={healingStage !== "idle" && healingStage !== "stage4"}
                      className="w-full flex items-center justify-center gap-2 mt-2 font-semibold"
                    >
                      <Activity className={`w-4 h-4 ${healingStage !== "idle" && healingStage !== "stage4" ? "animate-spin" : ""}`} />
                      启动自愈自适应重试模拟 (Run Simulator)
                    </Button>
                  </CardContent>
                </Card>

                {/* Error Recovery Panel */}
                <Card id="error-recovery-panel" className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary animate-pulse" />
                      <span>异常恢复面板 (Error Recovery Panel)</span>
                    </CardTitle>
                    <CardDescription>
                      配置在达到自愈最大重试次数（Limit: 2）时的终极降级策略：
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        {
                          id: "defaults",
                          name: "返回默认值 (Return Defaults)",
                          desc: "宽容解析，自动使用预定义的安全默认值补充非法/缺失字段，保障系统不停机。",
                          icon: Sparkles,
                          color: "text-emerald-500",
                          bg: "hover:bg-emerald-500/5",
                          border: "border-emerald-500/30",
                          activeBorder: "border-emerald-500 bg-emerald-500/5"
                        },
                        {
                          id: "skip",
                          name: "跳过脏数据 (Skip Dirty Data)",
                          desc: "在数据流中宽容忽略并剔除坏条目，输出不包含此数据的干净列表，常用于批量任务。",
                          icon: Trash2,
                          color: "text-cyan-500",
                          bg: "hover:bg-cyan-500/5",
                          border: "border-cyan-500/30",
                          activeBorder: "border-cyan-500 bg-cyan-500/5"
                        },
                        {
                          id: "error",
                          name: "抛出异常终止 (Error Out)",
                          desc: "严格防守！立刻中断执行并向上抛出 ValidationError 触发系统熔断，严防脏数据污染下游。",
                          icon: AlertTriangle,
                          color: "text-rose-500",
                          bg: "hover:bg-rose-500/5",
                          border: "border-rose-500/30",
                          activeBorder: "border-rose-500 bg-rose-500/5"
                        }
                      ].map((strat) => {
                        const Icon = strat.icon;
                        const isActive = fallbackStrategy === strat.id;
                        return (
                          <button
                            key={strat.id}
                            id={`strategy-toggle-${strat.id}`}
                            onClick={() => {
                              if (healingStage === "idle" || healingStage === "stage4") {
                                setFallbackStrategy(strat.id as any);
                                toast({
                                  title: `已切换降级策略: ${strat.name.split(" ")[0]}`,
                                  description: "可在右侧自愈模拟中体验最终的降级效果。"
                                });
                              } else {
                                toast({
                                  variant: "destructive",
                                  title: "无法切换",
                                  description: "模拟正在运行中，请等待其结束后再做调整。"
                                });
                              }
                            }}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                              isActive
                                ? strat.activeBorder + " shadow-md"
                                : "border-border/60 bg-transparent text-muted-foreground " + strat.bg + " hover:text-foreground hover:border-primary/40"
                            }`}
                          >
                            <div className={`p-2 rounded-lg bg-background border border-border/40 mt-0.5 ${isActive ? strat.color : "text-muted-foreground"}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <div className={`font-bold text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                {strat.name}
                              </div>
                              <p className="text-[11px] leading-relaxed text-muted-foreground">
                                {strat.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Short explanatory block on how it is implemented in python */}
                    <div className="pt-3 border-t border-border/40">
                      <div className="text-[10px] text-muted-foreground font-mono leading-relaxed flex items-center gap-1.5 mb-1.5">
                        <Code className="w-3.5 h-3.5 text-primary" />
                        <span>当前策略对应的 Python 防御实现：</span>
                      </div>
                      <pre className="p-3 bg-muted rounded-lg text-[10px] leading-relaxed text-muted-foreground border border-border/40 overflow-x-auto whitespace-pre">
                        {fallbackStrategy === "defaults" && (
                          `# Pydantic 优雅降级：返回预设默认对象\ntry:\n    validated = UserProfile.model_validate(bad_json)\nexcept ValidationError:\n    validated = UserProfile(\n        id=1002,\n        email="guest@default.com",\n        status="active"\n    ) # 宽容返回安全值`
                        )}
                        {fallbackStrategy === "skip" && (
                          `# Pydantic 优雅降级：过滤并跳过脏数据\nusers_list = []\nfor item in items:\n    try:\n        users_list.append(UserProfile.model_validate(item))\n    except ValidationError:\n        # 记录 Warn 日志并静默跳过，防止阻塞\n        logger.warning(f"Skipped corrupt record: {item}")\n        continue`
                        )}
                        {fallbackStrategy === "error" && (
                          `# Pydantic 优雅降级：直接报错并上报\ntry:\n    validated = UserProfile.model_validate(bad_json)\nexcept ValidationError as e:\n    # 向上层抛出硬报错，触发熔断或报警\n    sentry_sdk.capture_exception(e)\n    raise UnrecoverableDataError("Stubborn format error")`
                        )}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Simulation Sandbox Visualization */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-border bg-card h-full flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" />
                        <span>自动修复与自愈重试流水线演示</span>
                      </CardTitle>
                      <CardDescription>
                        模拟大模型请求在遇到格式、结构损坏时的动态自愈及降级反应。
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      {/* Stage progress line */}
                      <div className="relative">
                        {/* Track line */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border/50 -translate-y-1/2 z-0" />
                        
                        <div className="relative z-10 flex justify-between">
                          {[
                            { key: "stage1", label: "1. 错误生成" },
                            { key: "stage2", label: "2. 反序列化" },
                            { key: "stage3", label: "3. 自愈重试" },
                            { 
                              key: "stage4", 
                              label: fallbackStrategy === "defaults" 
                                ? "4. 默认值兜底" 
                                : fallbackStrategy === "skip" 
                                  ? "4. 过滤丢弃" 
                                  : "4. 崩溃中止" 
                            },
                          ].map((stage, idx) => {
                            const isPast = healingStage === stage.key || 
                                           (stage.key === "stage1" && ["stage2", "stage3", "stage4"].includes(healingStage)) ||
                                           (stage.key === "stage2" && ["stage3", "stage4"].includes(healingStage)) ||
                                           (stage.key === "stage3" && ["stage4"].includes(healingStage));
                            const isCurrent = healingStage === stage.key;

                            // Dynamic active and past styling based on strategy for Stage 4
                            let activeClass = "bg-primary border-primary text-primary-foreground scale-110 shadow-[0_0_12px_rgba(168,85,247,0.4)]";
                            let pastClass = "bg-emerald-500/20 border-emerald-500 text-emerald-500";

                            if (stage.key === "stage4") {
                              if (fallbackStrategy === "defaults") {
                                activeClass = "bg-emerald-500 border-emerald-500 text-white scale-110 shadow-[0_0_12px_rgba(16,185,129,0.4)]";
                                pastClass = "bg-emerald-500/20 border-emerald-500 text-emerald-500";
                              } else if (fallbackStrategy === "skip") {
                                activeClass = "bg-cyan-500 border-cyan-500 text-white scale-110 shadow-[0_0_12px_rgba(6,182,212,0.4)]";
                                pastClass = "bg-cyan-500/20 border-cyan-500 text-cyan-500";
                              } else if (fallbackStrategy === "error") {
                                activeClass = "bg-rose-500 border-rose-500 text-white scale-110 shadow-[0_0_12px_rgba(244,63,94,0.4)]";
                                pastClass = "bg-rose-500/20 border-rose-500 text-rose-500";
                              }
                            }

                            return (
                              <div key={stage.key} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                                  isCurrent 
                                    ? activeClass
                                    : isPast
                                      ? pastClass
                                      : "bg-muted border-border/60 text-muted-foreground"
                                }`}>
                                  {isPast && !isCurrent ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-2 font-medium ${
                                  isCurrent 
                                    ? stage.key === "stage4"
                                      ? fallbackStrategy === "defaults" 
                                        ? "text-emerald-500 font-bold" 
                                        : fallbackStrategy === "skip" 
                                          ? "text-cyan-500 font-bold" 
                                          : "text-rose-500 font-bold"
                                      : "text-primary font-bold" 
                                    : isPast 
                                      ? stage.key === "stage4"
                                        ? fallbackStrategy === "defaults" 
                                          ? "text-emerald-500" 
                                          : fallbackStrategy === "skip" 
                                            ? "text-cyan-500" 
                                            : "text-rose-500"
                                        : "text-emerald-500" 
                                      : "text-muted-foreground"
                                }`}>
                                  {stage.label}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Log Screen */}
                      <div className="border border-border/80 bg-muted/30 rounded-xl p-4 min-h-[180px] font-mono text-[11px] space-y-1.5 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                            <span className="text-muted-foreground font-bold uppercase text-[9px] tracking-wider">流水线控制台日志 (Console Logs)</span>
                            {healingStage === "stage4" && (
                              <Badge className={
                                fallbackStrategy === "defaults" 
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]" 
                                  : fallbackStrategy === "skip" 
                                    ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20 text-[10px]"
                                    : "bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px]"
                              }>
                                {fallbackStrategy === "defaults" ? "DEFAULTS RECOVERED" : fallbackStrategy === "skip" ? "DIRTY DATA SKIPPED" : "FATAL EXCEPTION"}
                              </Badge>
                            )}
                          </div>
                          
                          {logs.length === 0 ? (
                            <div className="text-muted-foreground italic text-center py-10">
                              点击“启动自愈自适应重试模拟”查看完整重试与自动修复流程
                            </div>
                          ) : (
                            <div className="space-y-1 max-h-[220px] overflow-y-auto">
                              {logs.map((log, i) => (
                                <div key={i} className={`leading-relaxed ${
                                  log.includes("❌") || log.includes("ValidationError") ? "text-red-400" :
                                  log.includes("✅") || log.includes("成功") ? "text-emerald-400 font-semibold" :
                                  log.includes("🚀") || log.includes("自愈") ? "text-primary font-bold" : "text-muted-foreground"
                                }`}>
                                  {log}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                    </CardContent>
                  </div>
                </Card>
              </div>

            </div>
          </TabsContent>

        </Tabs>

      </div>
    </DemoShell>
  )
}

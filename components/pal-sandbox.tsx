"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Code2,
  ArrowDown,
} from "lucide-react"

interface PalProblem {
  id: string
  title: string
  description: string
  /** PAL 风格 Python 源码（教学展示，只读） */
  pyCode: string
  /** 真实在沙箱中执行的 JS（可编辑） */
  jsCode: string
  /** 「若让模型直接心算」的易错示意（诚实标注为示意，非真实模型输出） */
  naiveNote: string
}

const PROBLEMS: PalProblem[] = [
  {
    id: "sum",
    title: "1 到 100 的整数求和",
    description:
      "经典算术题。模型心算或写循环都容易漏项 / 多数；PAL 让模型把问题转写为一段求和程序，交给解释器得到精确结果。",
    pyCode: "print(sum(range(1, 101)))  # => 5050",
    jsCode: "let s = 0;\nfor (let i = 1; i <= 100; i++) s += i;\nreturn s;",
    naiveNote: "人脑逐项累加极易漏掉某个数；模型也可能给出 4950、5100 这类偏差值。",
  },
  {
    id: "compound",
    title: "复利终值（本金 1 万，年化 5%，10 年）",
    description:
      "指数运算是模型的软肋。PAL 用一行幂运算把『精确金额』交给运行时，而不是让模型估算。",
    pyCode: "print(10000 * (1 + 0.05) ** 10)  # => 16288.946...",
    jsCode: "return 10000 * Math.pow(1 + 0.05, 10);",
    naiveNote: "人脑几乎无法手算复利指数；模型常凭直觉给一个粗略甚至量级错误的数。",
  },
  {
    id: "prime",
    title: "判断 97 是否为质数",
    description:
      "符号 / 逻辑判定类任务。PAL 生成试除循环，由解释器给出确定性的 true / false。",
    pyCode:
      "n = 97\nprint(all(n % d != 0 for d in range(2, int(n ** 0.5) + 1)))  # => True",
    jsCode:
      "const n = 97;\nlet isPrime = true;\nfor (let d = 2; d <= Math.floor(Math.sqrt(n)); d++) {\n  if (n % d === 0) { isPrime = false; break; }\n}\nreturn isPrime;",
    naiveNote: "大数的试除判定容易在边界上出错（例如把合数误判为质数）。",
  },
]

// 受限沙箱：仅暴露数学与基本类型，拦截常见的全局 / 网络访问。
// 说明：这是教学级防护（new Function 仍可能通过原型链逃逸），仅用于本地 demo，
// 不用于任何生产环境执行不可信代码。
const DANGEROUS = new RegExp(
  [
    "fetch",
    "eval",
    "Function",
    "window",
    "document",
    "globalThis",
    "import",
    "require",
    "process",
    "setTimeout",
    "setInterval",
    "XMLHttpRequest",
    "localStorage",
    "sessionStorage",
    "indexedDB",
    "navigator",
    "alert",
    "location",
  ].join("|"),
)

function runInSandbox(code: string): { result: string; logs: string[] } {
  if (DANGEROUS.test(code)) {
    throw new Error("检测到受限标识符，已在沙箱中拦截（防止访问浏览器全局 / 网络）。")
  }
  const logs: string[] = []
  const sandboxConsole = {
    log: (...a: unknown[]) => logs.push(a.map((x) => String(x)).join(" ")),
  }
  const allowed: Record<string, unknown> = {
    Math,
    JSON,
    console: sandboxConsole,
    parseInt,
    parseFloat,
    isNaN,
    Number,
    String,
    Array,
    Object,
    Boolean,
  }
  // eslint-disable-next-line no-new-func
  const fn = new Function(...Object.keys(allowed), `"use strict";\n${code}`)
  const out = fn(...Object.values(allowed))
  return {
    result: out === undefined ? "(无返回值，请使用 return)" : String(out),
    logs,
  }
}

export function PALSandbox() {
  const [selectedId, setSelectedId] = useState(PROBLEMS[0].id)
  const selected = PROBLEMS.find((p) => p.id === selectedId)!

  const [code, setCode] = useState(PROBLEMS[0].jsCode)
  const [result, setResult] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const selectProblem = (id: string) => {
    const p = PROBLEMS.find((x) => x.id === id)!
    setSelectedId(id)
    setCode(p.jsCode)
    setResult(null)
    setLogs([])
    setError(null)
  }

  const handleRun = () => {
    setIsRunning(true)
    setError(null)
    setResult(null)
    // 用微任务让 spinner 先渲染
    setTimeout(() => {
      try {
        const { result: r, logs: l } = runInSandbox(code)
        setResult(r)
        setLogs(l)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setIsRunning(false)
      }
    }, 120)
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            PAL 真演练场（强覆盖）
          </h3>
          <Badge
            variant="outline"
            className="text-xs border-emerald-500/30 text-emerald-600"
          >
            真实沙箱执行
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：
          选好问题后，下方的 JavaScript 会在浏览器<strong className="text-foreground"> 受限沙箱 </strong>
          中真实执行，结果由运行时计算得出（而非预写死的字符串）。这正是 PAL「用代码执行替代不可靠心算」的核心价值。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：问题选择 + Python 展示 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> 1. 选择推理问题
              </div>
              <div className="grid grid-cols-1 gap-2">
                {PROBLEMS.map((p) => {
                  const active = p.id === selectedId
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectProblem(p.id)}
                      className={`text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                        active
                          ? "border-emerald-500 bg-emerald-500/5"
                          : "border-border/60 bg-muted/10 hover:border-border-muted"
                      }`}
                    >
                      <div className="text-xs font-semibold text-foreground leading-none">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        {p.description}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> 模型生成的程序（Python 展示 · 只读）
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg border border-border/40 text-[11px] leading-relaxed text-emerald-300 whitespace-pre-wrap font-mono">
                {selected.pyCode}
              </pre>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                PAL 论文中模型产出的是 Python；本演练场用等价的 JavaScript 在浏览器沙箱中真实运行，
                思想完全一致——把推理步骤编码为可执行的程序。
              </p>
            </div>
          </div>

          {/* 右：可编辑 JS + 执行视窗 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5" /> 2. 沙箱代码（可编辑，回车即改）
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setCode(selected.jsCode)
                    setResult(null)
                    setLogs([])
                    setError(null)
                  }}
                >
                  重置为默认
                </Button>
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="min-h-[150px] font-mono text-xs border-border/80 bg-slate-950 text-slate-200"
              />
              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="w-full text-xs tracking-wider"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Play className="w-4 h-4 mr-2 animate-pulse" />
                    沙箱中执行中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    在受限沙箱中真实执行
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> 3. 执行结果（运行时真实计算）
              </div>
              <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 min-h-[120px] font-mono text-xs space-y-2">
                {error ? (
                  <div className="flex items-start gap-2 text-rose-400">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="whitespace-pre-wrap">{error}</span>
                  </div>
                ) : result !== null ? (
                  <>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="font-bold">结果：{result}</span>
                    </div>
                    {logs.length > 0 && (
                      <div className="text-slate-400 space-y-1 pt-1 border-t border-border/40">
                        {logs.map((l, i) => (
                          <div key={i}>&gt;&gt; {l}</div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[90px] text-center border-2 border-dashed border-border/60 rounded-xl">
                    <p className="text-xs text-muted-foreground">
                      点击上方按钮，代码将在此真实运行
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">对比：</strong>
                  {selected.naiveNote}
                  而 PAL 把计算交给解释器，结果<strong className="text-emerald-500"> 精确且可复现</strong>。
                  （此对比为示意，非真实模型输出。）
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
            <span>本地沙箱已限制全局 / 网络访问（教学级防护）</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Determinism: 100%
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        下方为 Function Calling 主交互区——PAL 的「代码执行」正是其「本地执行」环节的工程体现
      </div>
    </div>
  )
}

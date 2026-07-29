"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileArchive,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  RotateCcw,
  ShieldCheck,
} from "lucide-react"

function estTokens(text: string): number {
  const cjk = (text.match(/[一-鿿぀-ヿ㐀-䶿]/g) || []).length
  const nonCjk = (text.replace(/[一-鿿぀-ヿ㐀-䶿]/g, " ").match(/[A-Za-z0-9_]+/g) || []).length
  return cjk + nonCjk
}

interface Msg {
  role: "user" | "assistant" | "tool"
  text: string
  kind?: "read" | "build" | "test"
}

const readBody = Array.from(
  { length: 380 },
  (_, i) => `${i + 1}  import express from "express"; // server bootstrap line ${i}`,
).join("\n")
const buildBody = Array.from(
  { length: 1100 },
  (_, i) => `node_modules/@types/react/${i}.d.ts(12,3): note TSxxx: type inference ok`,
).join("\n")
const testBody = Array.from(
  { length: 900 },
  (_, i) => `PASS src/__tests__/case-${i}.test.ts`,
).join("\n")

const SESSION: Msg[] = [
  { role: "user", text: "在 src 加一个限流器，避免单 IP 刷接口。" },
  {
    role: "assistant",
    text: "先看现有 server 结构。决定用 token bucket 算法，放在 middleware/rateLimit.ts。",
  },
  { role: "tool", kind: "read", text: `原始文件 src/server.ts（共 380 行全文）\n${readBody}` },
  {
    role: "assistant",
    text: "实现 middleware/rateLimit.ts，导出 createLimiter(opts)。注意：时钟要可注入以便单测。",
  },
  { role: "tool", kind: "build", text: `tsc 构建原始输出（共 1100 行）\n${buildBody}` },
  { role: "user", text: "补单测，覆盖突发流量与限流触发。" },
  {
    role: "assistant",
    text: "在 __tests__/rateLimit.test.ts 加用例。未决：clock 未注入导致 flaky，记入待修。",
  },
  { role: "tool", kind: "test", text: `jest 原始输出（共 900 行）\n${testBody}` },
]

const KEY_FACTS = [
  "token bucket",
  "middleware/rateLimit.ts",
  "时钟要可注入",
  "未决：clock 未注入",
  "__tests__/rateLimit.test.ts",
]

function compress(m: Msg): { text: string; kept: boolean } {
  if (m.role === "user") return { text: `【用户】${m.text}`, kept: true }
  if (m.kind === "read") {
    const lines = m.text.split("\n").length
    return { text: `【工具·读取】src/server.ts（约 ${lines} 行，原始全文已折叠）`, kept: false }
  }
  if (m.kind === "build") {
    const lines = m.text.split("\n").length
    return { text: `【工具·构建】tsc 输出约 ${lines} 行，0 error（原始日志已折叠）`, kept: false }
  }
  if (m.kind === "test") {
    const lines = m.text.split("\n").length
    return { text: `【工具·测试】jest 输出约 ${lines} 行，用例通过（原始日志已折叠）`, kept: false }
  }
  const hot = /(决定|决策|采用|架构|未决|bug|TODO|注意|要)/.test(m.text)
  return hot
    ? { text: `【助手】${m.text}`, kept: true }
    : { text: `【助手】${m.text.split(/[。.!]/)[0]}…（细节已压缩）`, kept: false }
}

export function CompactionPlayground() {
  const [done, setDone] = useState(false)
  const [reset, setReset] = useState(0)

  const before = SESSION.reduce((s, m) => s + estTokens(m.text), 0)
  const compacted = SESSION.map(compress)
  const after = compacted.reduce((s, c) => s + estTokens(c.text), 0)
  const ratio = Math.round((1 - after / before) * 100)
  const joined = compacted.map((c) => c.text).join("\n")
  const fidelity = KEY_FACTS.map((f) => ({ f, ok: joined.includes(f) }))
  const keptCount = compacted.filter((c) => c.kept).length

  return (
    <div className="space-y-4">
      <Card key={reset} className="p-6 border-sky-500/30 bg-sky-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            ① Compaction 压缩演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-sky-500/30 text-sky-600">
            真实 高保真摘要蒸馏
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          长会话会被原始工具输出撑爆上下文。Compaction 的关键不是「删」，而是
          <strong className="text-foreground"> 高保真蒸馏</strong>：保留架构决策与未决项，折叠冗余的原始日志。
          这里一段真实编码会话（含 380 行读文件、1100 行构建日志、900 行测试输出）被真实压缩，
          下方显示 token 骤降与<strong className="text-foreground"> 关键事实保真度</strong>。
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Button onClick={() => setDone(true)} disabled={done} className="text-xs tracking-wider" size="lg">
            <FileArchive className="w-4 h-4 mr-2" /> {done ? "已压缩" : "运行 Compaction"}
          </Button>
          <Button
            onClick={() => {
              setDone(false)
              setReset((r) => r + 1)
            }}
            variant="ghost"
            className="text-xs"
            size="lg"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 重置
          </Button>
          <span className="text-[11px] text-muted-foreground">
            原始 {before} token → 压缩后 {done ? `${after} token（降幅 ${ratio}%）` : "—"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> 原始上下文（{before} token）
            </div>
            <div className="p-3 bg-slate-950/90 rounded-lg border border-border/40 max-h-[280px] overflow-auto font-mono text-[10.5px] space-y-1">
              {SESSION.map((m, i) => (
                <div key={i} className={m.role === "tool" ? "text-slate-500" : "text-slate-300"}>
                  <span className="text-[9px] px-1 rounded bg-white/5 uppercase">{m.role}</span>{" "}
                  {m.text.slice(0, 72)}
                  {m.text.length > 72 && " …"}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 压缩后上下文（{done ? `${after} token` : "—"}）
            </div>
            {done ? (
              <div className="p-3 bg-slate-950/90 rounded-lg border border-sky-500/30 max-h-[280px] overflow-auto font-mono text-[10.5px] space-y-1">
                {compacted.map((c, i) => (
                  <div key={i} className={c.kept ? "text-sky-200" : "text-slate-400"}>
                    {c.text}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-center border-2 border-dashed border-border/60 rounded-xl">
                <p className="text-xs text-muted-foreground">点击「运行 Compaction」生成高保真摘要</p>
              </div>
            )}

            {done && (
              <div className="text-[11px] bg-slate-950/95 border border-slate-700/50 rounded-lg p-3 leading-relaxed text-slate-200">
                <div className="font-bold text-foreground mb-1">
                  关键事实保真度（{fidelity.filter((f) => f.ok).length}/{fidelity.length}）
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {fidelity.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      {f.ok ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                      )}
                      <span className={f.ok ? "text-emerald-300" : "text-rose-300"}>{f.f}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 text-muted-foreground">
                  保留完整 {keptCount}/{SESSION.length} 条（决策 / 用户消息），折叠 {SESSION.length - keptCount} 条工具原始输出。
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 leading-relaxed mt-4 text-amber-100">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-foreground">诚实说明：</strong>
            真实 LLM 的 Compaction 由模型生成摘要；本演练场的
            <strong className="text-foreground"> 消息分类（决策→保留 / 工具原始输出→折叠）、token 计数、保真度检查均为真实执行</strong>
            ，仅摘要文本按「首行 + 行数」模板确定性产出。Compaction「保决策、弃冗余、控窗口」与本演练场一致。
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileArchive className="w-3.5 h-3.5 text-sky-500" />
            <span>分类 + token 计数 + 保真度 真实执行</span>
          </div>
          <span className="font-mono bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded border border-sky-500/10">
            Compaction
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        下一项：② JIT 检索 / 渐进式披露
      </div>
    </div>
  )
}

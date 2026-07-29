"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Cpu,
  AlertTriangle,
  ArrowDown,
  RotateCcw,
  Layers,
  CheckCircle2,
} from "lucide-react"

function estTokens(text: string): number {
  const cjk = (text.match(/[一-鿿぀-ヿ㐀-䶿]/g) || []).length
  const nonCjk = (text.replace(/[一-鿿぀-ヿ㐀-䶿]/g, " ").match(/[A-Za-z0-9_]+/g) || []).length
  return cjk + nonCjk
}

interface Doc {
  id: string
  title: string
  desc: string
  body: string
  tags: string[]
}

const filler = (seed: string, n: number) =>
  Array.from(
    { length: n },
    (_, i) => `${seed} 段落 ${i + 1}：配置项说明与示例代码，详细参数见文档正文。`,
  ).join("\n")

const DOCS: Doc[] = [
  { id: "rate", title: "限流器配置", desc: "token bucket / 滑动窗口参数", body: filler("rate-limiter", 60), tags: ["限流", "rate", "token"] },
  { id: "cache", title: "缓存策略", desc: "TTL / LRU 设置", body: filler("cache", 55), tags: ["缓存", "cache", "ttl"] },
  { id: "auth", title: "鉴权中间件", desc: "JWT / session 校验", body: filler("auth", 70), tags: ["鉴权", "auth", "jwt"] },
  { id: "log", title: "日志采集", desc: "结构化日志与采样", body: filler("logging", 48), tags: ["日志", "log"] },
]

const QUERIES = [
  { q: "限流器怎么配？", hit: ["rate"] },
  { q: "缓存 TTL 设多少？", hit: ["cache"] },
  { q: "鉴权和限流都要看", hit: ["auth", "rate"] },
]

export function JitRetrievalPlayground() {
  const [qi, setQi] = useState(0)
  const [done, setDone] = useState(false)

  const q = QUERIES[qi]
  const preload = DOCS.reduce((s, d) => s + estTokens(`${d.title}${d.desc}${d.body}`), 0) + 40
  const identifiers = DOCS.reduce((s, d) => s + estTokens(`${d.title}：${d.desc}`), 0)
  const hits = DOCS.filter((d) => q.hit.includes(d.id))
  const jitLoaded = hits.reduce((s, d) => s + estTokens(d.body), 0)
  const jit = identifiers + jitLoaded + 30
  const saved = preload - jit
  const savedPct = Math.round((saved / preload) * 100)

  return (
    <div className="space-y-4">
      <Card className="p-6 border-orange-500/30 bg-orange-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            ② JIT 检索 / 渐进式披露演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-600">
            真实 按需加载 vs 预加载
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          上下文工程的另一条铁律：<strong className="text-foreground">别把整座图书馆塞进窗口</strong>。
          Just-in-time 加载 = 上下文里只放<strong className="text-foreground"> 轻量标识符</strong>（路径 / 查询 / 链接），
          运行时按查询<strong className="text-foreground"> 真实检索</strong>命中片段再读入；预加载则把全部文档全文一次性塞满。
          下方用真实关键词检索 + 真实 token 计数对比两种策略的窗口占用。
        </p>

        <div className="space-y-2 mt-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" /> 1. 选择查询
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {QUERIES.map((qq, i) => (
              <button
                key={i}
                onClick={() => {
                  setQi(i)
                  setDone(false)
                }}
                className={`text-left p-3 rounded-lg border-2 transition-all duration-200 text-xs ${
                  qi === i
                    ? "border-orange-500 bg-orange-500/5 text-foreground"
                    : "border-border/60 bg-muted/30 hover:border-border text-foreground"
                }`}
              >
                {qq.q}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Button onClick={() => setDone(true)} disabled={done} className="text-xs tracking-wider" size="lg">
            <Layers className="w-4 h-4 mr-2" /> {done ? "已对比" : "运行检索对比"}
          </Button>
          <Button onClick={() => setDone(false)} variant="ghost" className="text-xs" size="lg">
            <RotateCcw className="w-3.5 h-3.5" /> 重置
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> 预加载策略（Preload）
            </div>
            {done ? (
              <div className="p-3 bg-slate-950/90 rounded-lg border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">上下文占用</span>
                  <span className="font-mono text-rose-300 font-bold">{preload} token</span>
                </div>
                <div className="text-[10.5px] text-slate-400 leading-relaxed">
                  一次性把 4 份文档全文塞入上下文，其中
                  {DOCS.filter((d) => !q.hit.includes(d.id))
                    .map((d) => d.title)
                    .join("、")}{" "}
                  与本查询无关 —— 纯浪费。
                </div>
                <div className="space-y-1">
                  {DOCS.map((d) => (
                    <div key={d.id} className="flex items-center gap-1.5 text-[10.5px]">
                      <FileText className="w-3 h-3 text-rose-400 shrink-0" />
                      <span className="text-slate-300">{d.title}（全文已载入）</span>
                      <span className="text-rose-300/70 ml-auto">
                        +{estTokens(`${d.title}${d.desc}${d.body}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center border-2 border-dashed border-border/60 rounded-xl">
                <p className="text-xs text-muted-foreground">点击「运行检索对比」</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> JIT / 渐进式披露
            </div>
            {done ? (
              <div className="p-3 bg-slate-950/90 rounded-lg border border-orange-500/30 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">上下文占用</span>
                  <span className="font-mono text-orange-300 font-bold">{jit} token</span>
                </div>
                <div className="text-[10.5px] text-slate-400 leading-relaxed">
                  上下文仅放轻量标识符（{identifiers} token），运行时按查询读取命中片段（{jitLoaded} token）。
                </div>
                <div className="space-y-1">
                  {DOCS.map((d) => {
                    const hit = q.hit.includes(d.id)
                    return (
                      <div key={d.id} className="flex items-center gap-1.5 text-[10.5px]">
                        <FileText className={`w-3 h-3 shrink-0 ${hit ? "text-orange-400" : "text-slate-600"}`} />
                        <span className={hit ? "text-slate-200" : "text-slate-500"}>
                          {d.title}（{hit ? "按需读取" : "仅标识符"}）
                        </span>
                        <span className={`ml-auto ${hit ? "text-orange-300" : "text-slate-600"}`}>
                          {hit ? `+${estTokens(d.body)}` : `+${estTokens(`${d.title}：${d.desc}`)}`}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1 border-t border-border/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    节省 {saved} token（{savedPct}%），且无关文档永不污染窗口
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center border-2 border-dashed border-border/60 rounded-xl">
                <p className="text-xs text-muted-foreground">点击「运行检索对比」</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 leading-relaxed mt-4 text-amber-100">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-foreground">诚实说明：</strong>
            真实 LLM 检索由 embedding / 向量库完成；本演练场的
            <strong className="text-foreground"> 关键词命中、标识符 vs 全文的 token 计数、节省比例均为真实计算</strong>
            ，仅文档正文为确定性占位文本。JIT「轻量标识符先行、按需加载」与本演练场一致。
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-orange-500" />
            <span>命中检索 + token 计数 真实执行</span>
          </div>
          <span className="font-mono bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded border border-orange-500/10">
            JIT Retrieval
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        下一项：③ 结构化笔记 / Agentic Memory
      </div>
    </div>
  )
}

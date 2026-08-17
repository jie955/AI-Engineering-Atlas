"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Lightbulb, BookMarked, Layers } from "lucide-react"
import { DemoShell } from "@/components/demo-shell"
import { DemoHero } from "@/components/demo-hero"
import { libraryComponents } from "@/lib/component-library"

// 组件库定位：跨多个 Playground 反复出现的可复用小模式（非独立节点，避免内容重复）
const libraryIntro = {
  what: "Atlas 的正式节点（T0–T3）各自深入一个架构主题。但有一些「小模式」散落在多个节点里，单独抽成节点会造成既视感重复，且可能把 Atlas 从「工程地图」拖向「技术教程合集」。",
  how: "组件库与 T0–T3 知识节点平行存在，专门收录这种「会在多个 Playground 里反复出现的可复用小模块」。每个组件页简短 —— 核心是「这个模式在哪些案例里被用到、通用实现思路是什么」，并链接回具体案例。",
  boundary: "收录标准：① 在 ≥ 2 个正式节点中以不同形态出现；② 是架构/工程模式而非 NLP 基础技术（命名实体识别、情感分析等不收录，避免退化为教程）。",
}

const accentText: Record<string, string> = {
  emerald: "text-emerald-500",
  cyan: "text-cyan-500",
  violet: "text-violet-500",
}

export default function ComponentLibraryPage() {
  return (
    <DemoShell demoId="component-library" standalone>
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DemoHero
          demoId="component-library"
          title="组件库: 跨节点的可复用模式"
          description="收录散落在多个 Playground 里反复出现的工程小模式 —— 与 T0–T3 知识节点平行存在"
        />

        {/* 定位说明 */}
        <Card className="p-8 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-800/40 border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">这个库是什么、不是什么</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <div className="font-semibold text-foreground text-sm">是什么</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{libraryIntro.what}</p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-foreground text-sm">怎么用</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{libraryIntro.how}</p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-foreground text-sm">收录边界</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{libraryIntro.boundary}</p>
            </div>
          </div>
        </Card>

        {/* 已收录组件 */}
        <div className="space-y-6">
          {libraryComponents.map((c) => {
            const Icon = c.icon
            const isTentative = c.status === "tentative"
            return (
              <Card
                key={c.id}
                id={c.id}
                className={`p-8 border-2 scroll-mt-24 ${isTentative ? "border-dashed border-muted-foreground/40" : "border-border"}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-8 h-8 ${accentText[c.accent]}`} />
                  <h2 className="text-2xl font-bold text-foreground">{c.name}</h2>
                  {isTentative && (
                    <Badge variant="outline" className="text-xs border-dashed border-muted-foreground/50 text-muted-foreground">
                      候补中 · 占位
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{c.summary}</p>

                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> 在 Atlas 中的出现点
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {c.occurrences.map((o, idx) => (
                    <Link key={idx} href={o.href}>
                      <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors flex items-start justify-between gap-3 group">
                        <div>
                          <div className="font-medium text-foreground text-sm">{o.node}</div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{o.form}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">通用实现思路</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.pattern}</p>
                  </div>
                </div>

                {c.code && (
                  <div className="mt-5">
                    <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" /> 通用实现示例
                    </div>
                    <div className="bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre">
                      {c.code}
                    </div>
                  </div>
                )}

                {c.relatedNotes && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground self-center">相关提及：</span>
                    {c.relatedNotes.map((r, i) => (
                      <Link key={i} href={r.href}>
                        <Badge variant="outline" className="text-xs hover:border-primary/40">{r.label}</Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <div className="p-5 rounded-xl bg-muted/80 border border-border text-sm text-muted-foreground flex items-start gap-3">
          <BookMarked className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">与编排模式节点的关系：</strong>
            编排模式（组织多个 Agent 的方式）是架构级抽象，组件库是更细粒度的工程模式聚合。两者都与 T0–T3 平行，互为补充 —— 前者讲「如何组织」，后者讲「反复出现的小构件」。
          </div>
        </div>
      </main>
    </DemoShell>
  )
}

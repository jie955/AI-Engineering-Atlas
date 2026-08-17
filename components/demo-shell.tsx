import Link from "next/link"
import { ChevronRight, ArrowLeft, ArrowRight, Clock, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { demos, getDemo } from "@/lib/demos"
import { getComponentsForNode } from "@/lib/component-library"
import { DemoProgressTracker } from "@/components/demo-progress-tracker"
import { DemoCompleteButton } from "@/components/demo-complete-button"

const categoryAccent: Record<string, string> = {
  大模型: "text-chart-2",
  Agent: "text-chart-1",
  RAG: "text-chart-3",
  工程化: "text-chart-4",
  Components: "text-foreground",
}

export function DemoShell({
  demoId,
  children,
  standalone = false,
}: {
  demoId: string
  children: React.ReactNode
  standalone?: boolean
}) {
  const demo = getDemo(demoId)
  const index = demos.findIndex((d) => d.id === demoId)
  const prev = !standalone && index > 0 ? demos[index - 1] : null
  const next = !standalone && index >= 0 && index < demos.length - 1 ? demos[index + 1] : null

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Case header */}
      <header className="relative overflow-hidden border-b border-hairline">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="面包屑">
            <Link href="/" className="transition-colors hover:text-foreground">
              首页
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/#demos" className="transition-colors hover:text-foreground">
              案例库
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{demo?.title ?? demoId}</span>
          </nav>

          {demo && (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className={categoryAccent[demo.category]}>
                  {demo.category}
                </Badge>
                <Badge variant="outline">{demo.difficulty}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {demo.estimatedTime} 分钟
                </span>
                <span className="font-mono text-sm text-primary">
                  {demo.category === "Components" ? "组件库" : `Track ${demo.track}`}
                </span>
              </div>
              <h1 className="text-display text-4xl text-foreground sm:text-5xl">{demo.title}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{demo.description}</p>
            </>
          )}
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-6 py-12">{children}</main>

      {/* 显式完成控件：纯展示 demo 无运行动作，由学习者主动标记本节已学完 */}
      <div className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <DemoCompleteButton demoId={demoId} />
        </div>
      </div>

      {/* 反向链接：本节点用到的底层组件（从组件库 occurrences 自动派生，组件库页与无命中节点不渲染） */}
      {demoId !== "component-library" &&
        (() => {
          const used = getComponentsForNode(demoId)
          if (used.length === 0) return null
          return (
            <section className="mx-auto max-w-7xl px-6 pb-4">
              <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">本节点用到的底层组件</h2>
                  <span className="text-xs text-muted-foreground">这些可复用工程模式也出现在其他节点 →</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {used.map(({ component, occurrence }) => (
                    <Link key={component.id} href={`/demos/component-library#${component.id}`}>
                      <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors flex items-start justify-between gap-3 group h-full">
                        <div>
                          <div className="font-medium text-foreground text-sm">{component.name}</div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{occurrence.form}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )
        })()}

      {/* Prev / Next */}
      <nav className="border-t border-hairline" aria-label="案例导航">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/demos/${prev.id}`}
              className="group flex flex-col gap-1 px-6 py-8 transition-colors hover:bg-card sm:border-r sm:border-hairline"
            >
              <span className="flex items-center gap-1 text-eyebrow text-xs text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" />
                上一个
              </span>
              <span className="text-lg font-semibold transition-colors group-hover:text-primary">{prev.title}</span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/demos/${next.id}`}
              className="group flex flex-col items-end gap-1 px-6 py-8 text-right transition-colors hover:bg-card"
            >
              <span className="flex items-center gap-1 text-eyebrow text-xs text-muted-foreground">
                下一个
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="text-lg font-semibold transition-colors group-hover:text-primary">{next.title}</span>
            </Link>
          )}
        </div>
      </nav>

      <SiteFooter />

      {/* Progress tracking: records visited / completed into mockStore */}
      <DemoProgressTracker demoId={demoId} />
    </div>
  )
}

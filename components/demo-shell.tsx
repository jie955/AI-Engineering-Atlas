import Link from "next/link"
import { ChevronRight, ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { demos, getDemo } from "@/lib/demos"

const categoryAccent: Record<string, string> = {
  大模型: "text-chart-2",
  Agent: "text-chart-1",
  RAG: "text-chart-3",
  工程化: "text-chart-4",
}

export function DemoShell({
  demoId,
  children,
}: {
  demoId: string
  children: React.ReactNode
}) {
  const demo = getDemo(demoId)
  const index = demos.findIndex((d) => d.id === demoId)
  const prev = index > 0 ? demos[index - 1] : null
  const next = index >= 0 && index < demos.length - 1 ? demos[index + 1] : null

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
                <span className="font-mono text-sm text-primary">Track {demo.track}</span>
              </div>
              <h1 className="text-display max-w-3xl text-4xl text-foreground sm:text-5xl">{demo.title}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{demo.description}</p>
            </>
          )}
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-6 py-12">{children}</main>

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
    </div>
  )
}

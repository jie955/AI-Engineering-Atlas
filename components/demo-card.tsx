import Link from "next/link"
import { Clock, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Demo } from "@/lib/demos"

const categoryAccent: Record<string, string> = {
  大模型: "text-chart-2",
  Agent: "text-chart-1",
  RAG: "text-chart-3",
  工程化: "text-chart-4",
  Components: "text-foreground",
}

export function DemoCard({ demo, index }: { demo: Demo; index?: number }) {
  return (
    <Link
      href={`/demos/${demo.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={categoryAccent[demo.category]}>
            {demo.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {demo.difficulty}
          </Badge>
        </div>
        {typeof index === "number" && (
          <span className="font-mono text-2xl font-bold text-border transition-colors group-hover:text-primary/40">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>

      <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
        {demo.title}
      </h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{demo.description}</p>

      <div className="flex items-center justify-between border-t border-hairline pt-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {demo.estimatedTime} 分钟
          </span>
          <span className="font-mono text-primary">{demo.track === -1 ? "组件库" : `Track ${demo.track}`}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-primary" />
      </div>
    </Link>
  )
}

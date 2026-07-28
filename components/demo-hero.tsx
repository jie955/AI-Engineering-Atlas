import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { demos } from "@/lib/demos"

interface DemoHeroProps {
  demoId: string
  badge?: string
  title?: string
  description?: string
}

export function DemoHero({ demoId, badge, title, description }: DemoHeroProps) {
  const demo = demos.find((d) => d.id === demoId)
  if (!demo) return null

  const resolvedTitle = title ?? demo.title
  const resolvedDescription = description ?? demo.description
  const resolvedBadge =
    badge ?? `ATLAS NODE #${String(demo.track + 1).padStart(2, "0")}`

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-background to-background p-6 md:p-8">
      <div className="absolute right-0 top-0 -mr-6 -mt-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="text-xs bg-primary/10 text-primary border-primary/20"
          >
            {resolvedBadge}
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">{resolvedTitle}</h2>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            {resolvedDescription}
          </p>
        </div>
        <div className="flex items-center gap-4 border-l border-hairline pl-0 md:pl-6 pt-4 md:pt-0 shrink-0">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">预计掌握时间</div>
            <div className="text-lg font-bold font-mono text-primary flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {demo.estimatedTime} 分钟
            </div>
          </div>
          <div className="space-y-1 ml-6">
            <div className="text-xs text-muted-foreground">阶段等级</div>
            <div className="text-lg font-bold text-primary">
              Track {demo.track} · {demo.difficulty}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

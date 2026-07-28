"use client"

import { useState } from "react"
import { demos, categories, type Category } from "@/lib/demos"
import { tracks } from "@/lib/mock-store"
import { DemoCard } from "@/components/demo-card"
import { Reveal } from "@/components/reveal"
import { cn } from "@/lib/utils"

type Filter = Category | "全部"

export function DemoBrowser() {
  const [filter, setFilter] = useState<Filter>("全部")

  const filters: Filter[] = ["全部", ...categories]

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filter === "全部" ? (
        // Track-grouped view
        <div className="flex flex-col gap-16">
          {tracks.map((track) => {
            const trackDemos = demos.filter((d) => d.track === track.number)
            if (trackDemos.length === 0) return null
            return (
              <div key={track.id}>
                <div className="mb-6 flex items-end justify-between border-b border-hairline pb-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-4xl font-bold text-primary/30">T{track.number}</span>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">{track.title}</h3>
                      <p className="text-eyebrow text-xs text-muted-foreground">{track.subtitle}</p>
                    </div>
                  </div>
                  <p className="hidden max-w-sm text-right text-sm text-muted-foreground md:block">
                    {track.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {trackDemos.map((demo, i) => (
                    <Reveal key={demo.id} delay={(i % 3) * 90}>
                      <DemoCard demo={demo} index={i} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // Filtered flat view
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demos
            .filter((d) => d.category === filter)
            .map((demo, i) => (
              <Reveal key={demo.id} delay={(i % 3) * 90}>
                <DemoCard demo={demo} index={i} />
              </Reveal>
            ))}
        </div>
      )}
    </div>
  )
}

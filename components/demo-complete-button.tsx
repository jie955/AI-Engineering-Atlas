"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDemoProgress } from "@/lib/use-demo-progress"
import { mockStore } from "@/lib/mock-store"

/**
 * DemoCompleteButton
 * ------------------
 * Explicit "mark this node as completed" control for demo pages.
 *
 * Pure-presentational demos have no interactive "run" flow, so they cannot
 * signal completion the way interactive demos do (runPipeline / runSimulation
 * / handleQuery / ...). This button gives the learner a deliberate, explicit
 * completion action instead of relying solely on passive scroll-to-bottom
 * detection.
 *
 * - Reads the initial completed state from mockStore on mount.
 * - On click: marks the demo complete (100%) and flips to a "completed" badge.
 * - Idempotent: re-clicking (or scroll auto-completion elsewhere) is harmless.
 *
 * Drop it inside any demo surface (DemoShell content area, or a custom-layout
 * page) and pass the demo's registry id.
 */
export function DemoCompleteButton({
  demoId,
  label = "标记本节为已学完",
}: {
  demoId: string
  label?: string
}) {
  const { markComplete } = useDemoProgress(demoId)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const p = mockStore.getProgress()[demoId]
    setCompleted(!!p && p.completed)
  }, [demoId])

  if (completed) {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary">
        <Check className="h-4 w-4" />
        已完成本节点
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-2">
      <Button
        type="button"
        variant="default"
        onClick={() => {
          markComplete()
          setCompleted(true)
        }}
        className="gap-2"
      >
        <Check className="h-4 w-4" />
        {label}
      </Button>
    </div>
  )
}

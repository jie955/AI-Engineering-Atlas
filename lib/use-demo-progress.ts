"use client"

import { useCallback } from "react"
import { mockStore } from "@/lib/mock-store"

// Progress thresholds used across the demo surfaces.
// A demo that is merely opened counts as "started"; reaching the end of its
// content (or finishing its interactive flow) counts as "completed".
export const VISITED_PROGRESS = 10

/**
 * Hook for wiring a demo page into the global progress store (mockStore).
 *
 * `mockStore` persists progress under `localStorage` keyed by `demoId`, so the
 * values surface automatically in the Dashboard (`/dashboard`).
 *
 * Usage:
 *   const { markVisited, markComplete, setProgress } = useDemoProgress("rag-decision")
 *   useEffect(() => { markVisited() }, [])            // call on open
 *   // ...on successful interaction:
 *   markComplete()
 */
export function useDemoProgress(demoId: string) {
  const markVisited = useCallback(() => {
    mockStore.updateProgress(demoId, VISITED_PROGRESS)
  }, [demoId])

  const markComplete = useCallback(() => {
    mockStore.completeDemo(demoId)
  }, [demoId])

  const setProgress = useCallback(
    (value: number) => {
      mockStore.updateProgress(demoId, value)
    },
    [demoId],
  )

  return { markVisited, markComplete, setProgress }
}

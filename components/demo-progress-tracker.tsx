"use client"

import { useEffect, useRef } from "react"
import { mockStore } from "@/lib/mock-store"

/**
 * DemoProgressTracker
 * --------------------
 * Drop-in client component that wires a demo page into the global progress
 * store. Render it once inside a demo's shell (e.g. DemoShell) just above the
 * footer.
 *
 * Behaviour:
 *  - On mount: records the demo as "visited / in progress" (10%).
 *  - When the user scrolls the bottom sentinel into view AND the page is long
 *    enough to require scrolling: marks the demo "completed" (100%).
 *
 * Short pages (no scrollbar) intentionally do NOT auto-complete — completion
 * there is delegated to the demo's own interactive flow via `useDemoProgress`.
 */
export function DemoProgressTracker({ demoId }: { demoId: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mark as started the moment the demo is opened.
    mockStore.updateProgress(demoId, 10)

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          // Only auto-complete when the page actually required scrolling.
          // This keeps short, single-viewport demos honest (in-progress)
          // instead of flipping to "completed" on first paint.
          const canScroll = document.documentElement.scrollHeight > window.innerHeight + 120
          if (canScroll) {
            mockStore.completeDemo(demoId)
            observer.disconnect()
          }
        }
      },
      { rootMargin: "0px 0px -5% 0px" },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [demoId])

  return <div ref={sentinelRef} aria-hidden className="pointer-events-none h-px w-full" />
}

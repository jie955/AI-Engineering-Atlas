"use client"

import { MotionConfig } from "motion/react"
import type { ReactNode } from "react"

/**
 * Wraps the app in Framer Motion's MotionConfig with reducedMotion="user".
 *
 * "user" means: when the OS "Reduce Motion" setting is on, Framer Motion
 * automatically disables transform / layout animations (hover shifts,
 * looping floats, width/height tweens) while keeping opacity changes.
 * This covers every `motion.*` usage across all demo pages without
 * per-component useReducedMotion() wiring.
 */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

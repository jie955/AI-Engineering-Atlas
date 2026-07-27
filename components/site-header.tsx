"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { tracks } from "@/lib/mock-store"
import { getDemo } from "@/lib/demos"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/roadmap", label: "学习路径" },
  { href: "/#demos", label: "案例库" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [demosOpen, setDemosOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-base font-bold tracking-tight">AI Engineering</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : (pathname?.startsWith(link.href.replace("/#demos", "")) ?? false)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                  active && link.href !== "/#demos" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Tracks dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDemosOpen(true)}
            onMouseLeave={() => setDemosOpen(false)}
          >
            <button
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-expanded={demosOpen}
              aria-haspopup="true"
            >
              学习轨道
            </button>
            {demosOpen && (
              <div className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-popover p-2 shadow-2xl">
                  {tracks.map((track) => (
                    <Link
                      key={track.id}
                      href="/roadmap"
                      className="group rounded-lg p-3 transition-colors hover:bg-accent"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-xs text-primary">T{track.number}</span>
                        <span className="text-sm font-semibold">{track.title}</span>
                        <span className="text-eyebrow text-[10px] text-muted-foreground">{track.subtitle}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {track.demos.slice(0, 4).map((id) => {
                          const demo = getDemo(id)
                          if (!demo) return null
                          return (
                            <span key={id} className="text-xs text-muted-foreground">
                              {demo.title}
                              <span className="text-border"> · </span>
                            </span>
                          )
                        })}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-3 md:flex">
          <UserNav />
          <Button size="sm" asChild>
            <Link href="/roadmap">
              开始学习
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-hairline bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-hairline pt-3">
              <UserNav />
              <Button size="sm" asChild>
                <Link href="/roadmap" onClick={() => setMobileOpen(false)}>
                  开始学习
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

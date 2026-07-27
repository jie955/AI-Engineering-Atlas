import Link from "next/link"
import { Brain } from "lucide-react"
import { tracks } from "@/lib/mock-store"

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-base font-bold tracking-tight">AI Engineering</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              面向 AI 工程师的交互式学习平台，覆盖从提示词到多智能体系统的完整知识体系。
            </p>
          </div>

          {/* Tracks */}
          <div>
            <h3 className="text-eyebrow mb-4 text-xs text-muted-foreground">学习轨道</h3>
            <ul className="flex flex-col gap-2.5">
              {tracks.map((track) => (
                <li key={track.id}>
                  <Link
                    href="/roadmap"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="font-mono text-xs text-primary">T{track.number}</span> {track.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-eyebrow mb-4 text-xs text-muted-foreground">导航</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  学习路径
                </Link>
              </li>
              <li>
                <Link href="/#demos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  案例库
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  仪表板
                </Link>
              </li>
            </ul>
          </div>

          {/* Resource */}
          <div>
            <h3 className="text-eyebrow mb-4 text-xs text-muted-foreground">关于</h3>
            <ul className="flex flex-col gap-2.5">
              <li className="text-sm text-muted-foreground">20 个工程案例</li>
              <li className="text-sm text-muted-foreground">5 条学习轨道</li>
              <li className="text-sm text-muted-foreground">交互式演示</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">构建于现代 AI/ML 工程最佳实践之上</p>
          <p className="text-xs text-muted-foreground">© 2026 AI Engineering Platform</p>
        </div>
      </div>
    </footer>
  )
}

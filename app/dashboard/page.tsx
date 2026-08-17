"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMockAuth } from "@/lib/mock-auth"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookmarkIcon,
  TrendingUp,
  Target,
  Award,
  ExternalLink,
  Map,
  Clock,
  Brain,
  Trash2,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { mockStore, demoMetadata, type Bookmark, type UserProgress } from "@/lib/mock-store"
import { demos } from "@/lib/demos"

function AnimatedProgress({
  value,
  className,
  delay = 100,
}: {
  value: number
  className?: string
  delay?: number
}) {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return <Progress value={currentValue} className={className} />
}

function AnimatedPercentage({ value, delay = 100 }: { value: number; delay?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0)
      return
    }
    const timer = setTimeout(() => {
      let start = 0
      const duration = 1000
      const steps = 30
      const stepTime = duration / steps
      const increment = value / steps

      const interval = setInterval(() => {
        start += increment
        if (start >= value) {
          setDisplayValue(value)
          clearInterval(interval)
        } else {
          setDisplayValue(Math.round(start))
        }
      }, stepTime)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return <span className="tabular-nums">{displayValue}%</span>
}

export default function DashboardPage() {
  const { user, status } = useMockAuth()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [progress, setProgress] = useState<Record<string, UserProgress>>({})
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalBookmarks: 0,
    totalInProgress: 0,
    totalTimeSpent: 0,
    streak: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    refreshData()
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const refreshData = () => {
    setBookmarks(mockStore.getBookmarks())
    setProgress(mockStore.getProgress())
    setStats(mockStore.getStats())
  }

  const handleRemoveBookmark = (demoId: string) => {
    mockStore.removeBookmark(demoId)
    refreshData()
  }

  if (status === "loading" || !mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">加载中...</div>
      </div>
    )
  }

  const progressList = Object.entries(progress).map(([demoId, p]) => ({
    title:
      demos.find((d) => d.id === demoId)?.title ||
      demoMetadata[demoId as keyof typeof demoMetadata]?.title ||
      demoId,
    ...p,
    demoId,
  }))

  const totalDemosCount = demos.length || 1
  const overallCompletionPercentage = Math.min(
    100,
    Math.round((stats.totalCompleted / totalDemosCount) * 100)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors">
            <Brain className="w-6 h-6" />
            AI Engineering
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/roadmap">
              <Button variant="ghost" size="sm" className="gap-2">
                <Map className="w-4 h-4" />
                学习路线
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-transparent">
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">个人仪表板</h1>
            <p className="text-muted-foreground">
              欢迎回来，{user?.name || "开发者"}！继续你的 AI 工程学习之旅。
            </p>
          </div>
          <Card className="p-4 w-full sm:w-80 bg-card/60 backdrop-blur-sm border border-border/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">总案例进度</span>
              <span className="text-sm font-bold text-primary">
                <AnimatedPercentage value={overallCompletionPercentage} delay={100} />
              </span>
            </div>
            <AnimatedProgress value={overallCompletionPercentage} className="h-2.5" delay={100} />
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/roadmap">
            <Button className="gap-2">
              <Map className="w-4 h-4" />
              查看学习路线
            </Button>
          </Link>
          <Link href="/#demos">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              浏览更多案例
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">已完成案例</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-500" />
                <span className="text-3xl font-bold tabular-nums">{stats.totalCompleted}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">收藏案例</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BookmarkIcon className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold tabular-nums">{stats.totalBookmarks}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">学习中</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold tabular-nums">{stats.totalInProgress}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">学习时长</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold tabular-nums">{stats.totalTimeSpent}</span>
                <span className="text-sm text-muted-foreground">分钟</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList>
            <TabsTrigger value="progress">学习进度</TabsTrigger>
            <TabsTrigger value="bookmarks">我的收藏</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>学习进度追踪</CardTitle>
                <CardDescription>查看您在各个案例中的学习进展</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressList.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">还没有学习记录</p>
                    <Link href="/#demos">
                      <Button variant="outline" className="bg-transparent">
                        开始学习第一个案例
                      </Button>
                    </Link>
                  </div>
                ) : (
                  progressList.map((item, index) => (
                    <motion.div
                      key={item.demoId}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/demos/${item.demoId}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                          {item.completed && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.15)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2" />
                              已完成
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          <AnimatedPercentage value={item.progress} delay={index * 100 + 150} />
                        </span>
                      </div>
                      <AnimatedProgress value={item.progress} className="h-2" delay={index * 100 + 150} />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>学习时长: {item.timeSpent} 分钟</span>
                        <span>最后访问: {new Date(item.lastVisited).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>我的收藏</CardTitle>
                <CardDescription>快速访问您收藏的演示案例</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {bookmarks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookmarkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">还没有收藏任何案例</p>
                    <Link href="/#demos">
                      <Button variant="outline" className="bg-transparent">
                        浏览演示案例
                      </Button>
                    </Link>
                  </div>
                ) : (
                  bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <Link href={`/demos/${bookmark.demoId}`} className="flex items-center gap-3 flex-1">
                        <BookmarkIcon className="h-5 w-5 text-primary fill-primary" />
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {bookmark.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{bookmark.category}</p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2">
                        <Link href={`/demos/${bookmark.demoId}`}>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveBookmark(bookmark.demoId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

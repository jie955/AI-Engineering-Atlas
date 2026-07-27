"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Sparkles,
  BookOpen,
  Trophy,
  ChevronRight,
  Lock,
  Play,
  Building2,
  TrendingUp,
  Users,
  Zap,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import { mockStore, tracks, demoMetadata, marketDemand, flashcards, type Track, type UserProgress, type Flashcard } from "@/lib/mock-store"
import { cn } from "@/lib/utils"

export default function RoadmapPage() {
  const [activeTrack, setActiveTrack] = useState(0)
  const [progress, setProgress] = useState<Record<string, UserProgress>>({})
  const [mounted, setMounted] = useState(false)
  const [expandedTracks, setExpandedTracks] = useState<number[]>([0])
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [activeFlashcardDemo, setActiveFlashcardDemo] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setProgress(mockStore.getProgress())
  }, [])

  const getTrackProgress = (track: Track) => {
    const completed = track.demos.filter((d) => progress[d]?.completed).length
    return Math.round((completed / track.demos.length) * 100)
  }

  const getDemoStatus = (demoId: string) => {
    if (progress[demoId]?.completed) return "completed"
    if (progress[demoId]?.progress > 0) return "in-progress"
    
    const meta = demoMetadata[demoId]
    if (meta?.prerequisites.length > 0) {
      const allPrereqsMet = meta.prerequisites.every((p) => progress[p]?.completed)
      if (!allPrereqsMet) return "locked"
    }
    return "available"
  }

  const toggleTrackExpand = (trackNum: number) => {
    setExpandedTracks((prev) =>
      prev.includes(trackNum) ? prev.filter((t) => t !== trackNum) : [...prev, trackNum]
    )
  }

  const getTotalProgress = () => {
    const allDemos = tracks.flatMap((t) => t.demos)
    const completed = allDemos.filter((d) => progress[d]?.completed).length
    return Math.round((completed / allDemos.length) * 100)
  }

  const getTotalHours = () => tracks.reduce((sum, t) => sum + t.estimatedHours, 0)

  const openFlashcards = (demoId: string) => {
    setActiveFlashcardDemo(demoId)
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setShowFlashcards(true)
  }

  const currentCards = activeFlashcardDemo ? flashcards[activeFlashcardDemo] || [] : []

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    )
  }

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
            <div className="text-sm text-muted-foreground">
              总进度: <span className="font-medium text-foreground">{getTotalProgress()}%</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-transparent">
                我的学习
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">学习路线图</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            从入门到精通的渐进式学习路径，每个 Track 都有明确的目标和实战项目
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">预计 <strong>{getTotalHours()}</strong> 小时</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm"><strong>{tracks.length}</strong> 个学习阶段</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm"><strong>3</strong> 个实战项目</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Tracks */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="tracks" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tracks">学习路径</TabsTrigger>
                <TabsTrigger value="overview">概览</TabsTrigger>
              </TabsList>

              <TabsContent value="tracks" className="space-y-4 mt-6">
                {tracks.map((track) => {
                  const trackProgress = getTrackProgress(track)
                  const isExpanded = expandedTracks.includes(track.number)
                  const isCompleted = trackProgress === 100
                  const isActive = track.demos.some((d) => getDemoStatus(d) === "available" || getDemoStatus(d) === "in-progress")

                  return (
                    <Card
                      key={track.id}
                      className={cn(
                        "transition-all",
                        isCompleted && "border-primary/50 bg-primary/5",
                        isActive && !isCompleted && "border-chart-2/50"
                      )}
                    >
                      <CardHeader
                        className="cursor-pointer"
                        onClick={() => toggleTrackExpand(track.number)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold",
                                isCompleted
                                  ? "bg-primary text-primary-foreground"
                                  : isActive
                                  ? "bg-chart-2/20 text-chart-2"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {track.number}
                            </div>
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {track.title}
                                <span className="text-sm font-normal text-muted-foreground">
                                  {track.subtitle}
                                </span>
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {track.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm font-medium">{trackProgress}%</div>
                              <div className="text-xs text-muted-foreground">
                                {track.estimatedHours}h
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <Progress value={trackProgress} className="h-1.5 mt-4" />
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0 space-y-4">
                          {/* Demo List */}
                          <div className="space-y-2">
                            {track.demos.map((demoId, idx) => {
                              const meta = demoMetadata[demoId]
                              const status = getDemoStatus(demoId)
                              const hasFlashcards = flashcards[demoId]?.length > 0

                              return (
                                <div
                                  key={demoId}
                                  className={cn(
                                    "flex items-center justify-between p-3 rounded-lg transition-colors",
                                    status === "completed" && "bg-primary/10",
                                    status === "available" && "bg-muted/50 hover:bg-muted",
                                    status === "in-progress" && "bg-chart-2/10",
                                    status === "locked" && "opacity-50"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                      {status === "completed" ? (
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                      ) : status === "locked" ? (
                                        <Lock className="w-4 h-4 text-muted-foreground" />
                                      ) : status === "in-progress" ? (
                                        <Play className="w-4 h-4 text-chart-2" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">{meta?.title}</div>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <Badge variant="outline" className="text-xs">
                                          {meta?.category}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          {meta?.estimatedTime} 分钟
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {hasFlashcards && status !== "locked" && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          openFlashcards(demoId)
                                        }}
                                      >
                                        <RotateCcw className="w-4 h-4 mr-1" />
                                        复习
                                      </Button>
                                    )}
                                    {status !== "locked" && (
                                      <Link href={`/demos/${demoId}`}>
                                        <Button size="sm" variant={status === "completed" ? "outline" : "default"}>
                                          {status === "completed" ? "回顾" : "开始"}
                                          <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {/* Capstone Project */}
                          {track.capstone && (
                            <div className="border-t pt-4">
                              <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                                <Trophy className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                  <div className="font-medium">实战项目: {track.capstone.title}</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {track.capstone.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </TabsContent>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>学习路径总览</CardTitle>
                    <CardDescription>
                      从准备阶段到高级架构的完整学习地图
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Timeline */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                      
                      <div className="space-y-8">
                        {tracks.map((track, idx) => {
                          const trackProgress = getTrackProgress(track)
                          const isCompleted = trackProgress === 100

                          return (
                            <div key={track.id} className="relative pl-16">
                              {/* Timeline node */}
                              <div
                                className={cn(
                                  "absolute left-4 w-5 h-5 rounded-full border-2",
                                  isCompleted
                                    ? "bg-primary border-primary"
                                    : "bg-background border-muted-foreground"
                                )}
                              >
                                {isCompleted && (
                                  <CheckCircle2 className="w-full h-full text-primary-foreground p-0.5" />
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg font-bold">Track {track.number}</span>
                                  <span className="text-muted-foreground">{track.title}</span>
                                  <Badge variant="outline">{track.estimatedHours}h</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {track.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {track.demos.map((demoId) => (
                                    <Badge
                                      key={demoId}
                                      variant={progress[demoId]?.completed ? "default" : "secondary"}
                                    >
                                      {demoMetadata[demoId]?.title}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Market Demand */}
          <div className="space-y-6">
            {/* Market Stats */}
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  市场需求
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-primary">{marketDemand.stats.jobGrowth}</div>
                    <div className="text-xs text-muted-foreground">岗位增长</div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-chart-2">{marketDemand.stats.avgSalary}</div>
                    <div className="text-xs text-muted-foreground">薪资范围(K)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-chart-3">{marketDemand.stats.demandRatio}</div>
                    <div className="text-xs text-muted-foreground">供需比</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-background/50 text-sm">
                  <div className="text-muted-foreground italic">"{marketDemand.quote.text}"</div>
                  <div className="text-xs text-muted-foreground mt-1">— {marketDemand.quote.source}</div>
                </div>
              </CardContent>
            </Card>

            {/* Companies Hiring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-5 h-5" />
                  正在招聘
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketDemand.companies.map((company) => (
                    <div key={company.name} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                        {company.name.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{company.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {company.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      返回首页
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="block">
                    <Button className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      查看我的进度
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Flashcard Modal */}
      {showFlashcards && currentCards.length > 0 && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  闪卡复习
                </CardTitle>
                <Badge variant="outline">
                  {currentCardIndex + 1} / {currentCards.length}
                </Badge>
              </div>
              <CardDescription>
                {activeFlashcardDemo && demoMetadata[activeFlashcardDemo]?.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Card */}
              <div
                className={cn(
                  "min-h-[200px] p-6 rounded-xl border-2 cursor-pointer transition-all",
                  showAnswer
                    ? "bg-primary/5 border-primary/30"
                    : "bg-muted/50 border-muted-foreground/20 hover:border-primary/30"
                )}
                onClick={() => setShowAnswer(!showAnswer)}
              >
                {showAnswer ? (
                  <div>
                    <div className="text-xs text-primary font-medium mb-2">答案</div>
                    <div className="text-foreground">{currentCards[currentCardIndex].back}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-muted-foreground font-medium mb-2">问题</div>
                    <div className="text-lg font-medium">{currentCards[currentCardIndex].front}</div>
                    <div className="text-xs text-muted-foreground mt-4">点击查看答案</div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAnswer(false)
                    setCurrentCardIndex((prev) => Math.max(0, prev - 1))
                  }}
                  disabled={currentCardIndex === 0}
                  className="bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  上一题
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setShowFlashcards(false)}
                >
                  退出复习
                </Button>

                <Button
                  onClick={() => {
                    setShowAnswer(false)
                    if (currentCardIndex < currentCards.length - 1) {
                      setCurrentCardIndex((prev) => prev + 1)
                    } else {
                      setShowFlashcards(false)
                    }
                  }}
                >
                  {currentCardIndex < currentCards.length - 1 ? (
                    <>
                      下一题
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      完成
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

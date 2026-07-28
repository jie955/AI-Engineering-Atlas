"use client"

import { useRouter } from "next/navigation"
import { useMockAuth } from "@/lib/mock-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LayoutDashboard, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, status, signOut } = useMockAuth()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-9 w-9 rounded-full bg-muted/50 animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>需要登录</CardTitle>
              <CardDescription>请先登录以查看个人资料</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/signin">
                <Button className="w-full">前往登录</Button>
              </Link>
            </CardContent>
          </Card>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> 返回首页
          </Link>
        </div>
      </div>
    )
  }

  const initial = user.name?.charAt(0).toUpperCase() || "U"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">个人资料</h1>
          </div>
          <p className="text-muted-foreground">查看你的账户信息</p>
        </div>

        <Card className="border-2">
          <CardHeader className="items-center text-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-2">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 border border-dashed p-4 text-sm text-muted-foreground">
              这是一个演示账户，数据存储在本地浏览器中。登录后可追踪学习进度、收藏案例并解锁闪卡复习系统。
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> 个人仪表板
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  signOut()
                  router.push("/")
                }}
              >
                退出登录
              </Button>
            </div>
          </CardContent>
        </Card>

        <Link href="/" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>
      </div>
    </div>
  )
}

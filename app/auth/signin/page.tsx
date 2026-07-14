"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMockAuth } from "@/lib/mock-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, UserCircle } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [email, setEmail] = useState("demo@aiengineering.dev")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useMockAuth()
  const router = useRouter()

  const handleSignIn = () => {
    if (!email.trim()) return
    setIsLoading(true)
    signIn(email)
    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">AI Engineering</h1>
          </div>
          <p className="text-muted-foreground">登录以解锁完整学习体验</p>
        </div>

        {/* Sign In Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>欢迎回来</CardTitle>
            <CardDescription>输入邮箱快速体验 AI 工程学习之旅</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Demo Account */}
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-dashed">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UserCircle className="h-4 w-4 text-primary" />
                演示账户（快速体验）
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  邮箱地址
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSignIn}
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? "登录中..." : "开始学习"}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">登录后可以</span>
              </div>
            </div>

            {/* Features List */}
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                追踪学习进度和完成情况
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                收藏感兴趣的演示案例
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                解锁闪卡复习系统
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                获取个性化学习建议
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          这是一个演示平台，数据存储在本地浏览器中
        </p>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

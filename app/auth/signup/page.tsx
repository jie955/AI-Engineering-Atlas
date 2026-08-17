"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMockAuth } from "@/lib/mock-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, UserPlus } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useMockAuth()
  const router = useRouter()

  const handleSignUp = () => {
    const next: { name?: string; email?: string } = {}
    if (!name.trim()) next.name = "请输入用户名"
    const emailValue = email.trim()
    if (!emailValue) next.email = "请输入邮箱地址"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) next.email = "邮箱格式不正确，请检查后重试"
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setIsLoading(true)
    signIn(email, name)
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
          <p className="text-muted-foreground">创建账户，开启你的 AI 工程学习之旅</p>
        </div>

        {/* Sign Up Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>创建账户</CardTitle>
            <CardDescription>填写信息即可快速注册（演示环境，数据存于本地浏览器）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">用户名</Label>
              <Input
                id="name"
                type="text"
                autoComplete="username"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                }}
                placeholder="你的昵称"
                className="h-10"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              </div>
              {errors.name && (
                <p id="name-error" role="alert" className="text-sm font-medium text-destructive">
                  {errors.name}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                placeholder="your@email.com"
                className="h-10"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
              />
              </div>
              {errors.email && (
                <p id="email-error" role="alert" className="text-sm font-medium text-destructive">
                  {errors.email}
                </p>
              )}

              <Button
                className="w-full"
                onClick={handleSignUp}
                disabled={isLoading}
              >
              <UserPlus className="mr-2 h-4 w-4" />
              {isLoading ? "创建中..." : "注册并开始学习"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">已有账户</span>
              </div>
            </div>

            <Link href="/auth/signin">
              <Button variant="outline" className="w-full bg-transparent">
                前往登录
              </Button>
            </Link>
          </CardContent>
        </Card>

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

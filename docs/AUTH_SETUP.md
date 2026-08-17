# ⚠️ 认证系统设置指南（规划文档 · 当前未实现）

> **重要前提（ drift 警告）**：本文档描述的是**规划中的真实后端认证方案**（Auth.js + Supabase）。
> **当前代码（main 分支）尚未实现该方案**。线上实际运行的是前端模拟认证：
> - 认证态：`lib/mock-auth.tsx`（React Context + `localStorage`，无密码、无 OAuth、无数据库）
> - 业务态：`lib/mock-store.ts`（用户/进度/收藏/连击，同样 localStorage 持久化）
>
> **请勿依据本文档部署真实认证**——它需要先在代码层落地 `next-auth`、创建 API routes、接入数据库后，本文档才生效。
> 此文档保留作为未来升级到真实后端的实施蓝图。

---

## 概述（目标态）
本平台**计划**使用 Auth.js (NextAuth) 实现认证，支持 Google 和 GitHub OAuth 登录，并基于 Supabase 存储用户数据。

## 环境变量配置

### 1. 生成 NextAuth Secret
```bash
openssl rand -base64 32
```
将生成的值设置为 `NEXTAUTH_SECRET`

### 2. 配置 Google OAuth
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据
   - 应用类型: Web 应用
   - 授权重定向 URI: `http://localhost:3000/api/auth/callback/google` (开发环境)
   - 生产环境: `https://your-domain.com/api/auth/callback/google`
5. 复制 Client ID 和 Client Secret

### 3. 配置 GitHub OAuth
1. 访问 [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写信息:
   - Application name: AI Engineering Demo Platform
   - Homepage URL: `http://localhost:3000` (开发环境)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. 复制 Client ID 和 Client Secret

## 数据库设置（目标态：Supabase）

> 注意：原 `scripts/01-create-auth-tables.sql` 已删除（当时引用了不存在的 Supabase 实例）。
> 待真实后端落地时，应重新生成与所选数据库匹配的建表脚本。

1. 从 v0 Connect 面板添加 Supabase 集成
2. 配置 Row Level Security (RLS) 策略:

```sql
-- Enable RLS on all auth tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own bookmarks" ON user_bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own streaks" ON user_streaks
  FOR ALL USING (auth.uid() = user_id);
```

## 功能说明（目标态）

### 登录流程
1. 用户点击"登录"按钮
2. 选择 Google 或 GitHub 登录
3. OAuth 授权后重定向到仪表板

### 个人仪表板
- 查看学习统计（完成案例、收藏数、学习天数）
- 追踪各案例的学习进度
- 管理收藏的演示案例

### 学习追踪
- 自动记录用户访问的案例
- 计算学习进度百分比
- 追踪连续学习天数

## 落地前置条件（实施 Checklist）
在本文档生效前，代码侧必须完成：
1. 移除 `lib/mock-auth.tsx` / `lib/mock-store.ts` 的模拟层
2. 新增 `lib/auth.ts`（Auth.js + Supabase adapter）
3. 创建 `app/api/auth/[...nextauth]/route.ts` 等 API routes
4. 在演示页接入真实收藏/进度 API
5. 配置上述环境变量与数据库

## 故障排除
**Q: 登录后重定向到错误页面** —— 检查 `NEXTAUTH_URL` 是否正确设置
**Q: OAuth 回调失败** —— 确认 OAuth 应用的回调 URL 配置正确
**Q: 会话数据为空** —— 检查 `NEXTAUTH_SECRET` 是否正确配置

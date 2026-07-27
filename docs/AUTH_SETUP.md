# 认证系统设置指南

## 概述
本平台使用 Auth.js (NextAuth) 实现认证，支持 Google 和 GitHub OAuth 登录。

## 环境变量配置

### 1. 生成 NextAuth Secret
\`\`\`bash
openssl rand -base64 32
\`\`\`
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

## 数据库设置

### Supabase 集成 (推荐)

1. 从 v0 Connect 面板添加 Supabase 集成
2. 在 v0 Scripts 面板运行 `scripts/01-create-auth-tables.sql`
3. 配置 Row Level Security (RLS) 策略:

\`\`\`sql
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
\`\`\`

## 功能说明

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

## 下一步开发

待数据库配置完成后，需要：

1. 在 `lib/auth.ts` 中添加 Supabase adapter
2. 创建 API routes 用于收藏和进度更新
3. 在演示页面添加收藏和进度追踪按钮
4. 实现学习记录的实时同步

## 故障排除

### 常见问题

**Q: 登录后重定向到错误页面**
A: 检查 `NEXTAUTH_URL` 是否正确设置

**Q: OAuth 回调失败**
A: 确认 OAuth 应用的回调 URL 配置正确

**Q: 会话数据为空**
A: 检查 `NEXTAUTH_SECRET` 是否正确配置

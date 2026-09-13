// 实时职位数据 —— 由 WorkBuddy 定时自动化每日抓取并更新
// 数据来源：公开招聘平台搜索聚合（Boss直聘 / 猎聘 / 官方招聘官网 / 聚合站等）
// 注意：仅基于公开搜索结果，薪资为平台公开区间或「面议」，非全量实时数据。

// 细分方向（与「单独成列」对应，便于前端按方向筛选）
export type JobDirection = "AI Agent" | "大模型算法" | "RAG" | "多模态" | "Agent Infra"

export interface Job {
  company: string
  title: string
  direction: JobDirection
  location: string
  salary: string
  seniority: string
  education: string
  source: string
  link: string
  skills: string[]
}

// 最近一次抓取日期（YYYY-MM-DD）
export const jobsLastUpdated = "2026-09-13"

// 招聘方聚焦方向：大厂 + 头部 AI 独角兽
export const jobFocus = {
  label: "大厂 · 头部 AI 独角兽",
  companies: [
    "字节跳动", "腾讯", "阿里巴巴", "百度", "美团", "快手", "小红书", "蚂蚁集团", "华为", "小米",
    "深度求索 DeepSeek", "月之暗面 Moonshot", "MiniMax", "智谱 AI", "阶跃星辰 StepFun", "百川智能", "零一万物", "面壁智能",
  ],
}

// 抓取来源与统计口径
export const jobsStats = {
  tracked: 137, // 聚合站跟踪的 AI Agent Engineer 职位数
  companies: 76, // 覆盖公司数
  demandGrowth: "470%", // 大模型算法工程师需求同比增速
  talentGap: "8.7 万", // 大模型算法岗位人才缺口
}

// 各 AI 工程岗位薪资参考（月薪下限-上限 / 年薪参考），来源：Boss直聘·猎聘·职友集·脉脉 综合
export const salaryRanges: { role: string; monthly: string; annual: string }[] = [
  { role: "大模型算法工程师", monthly: "40-130K+", annual: "50-200 万" },
  { role: "LLMOps 工程师", monthly: "35-70K", annual: "42-84 万" },
  { role: "AI Agent 开发工程师", monthly: "15-55K", annual: "18-66 万" },
  { role: "RAG 工程师", monthly: "18-50K", annual: "22-60 万" },
]

// 当前聚合到的职位（聚焦大厂 + 头部 AI 独角兽，后续由定时任务覆盖更新）
// 抓取日期：2026-09-13，覆盖 18 家目标公司，共 24 条公开在招岗位
export const jobs: Job[] = [
  {
    company: "字节跳动",
    title: "LLM应用 / Agent / AI平台研发工程师-Data",
    direction: "AI Agent",
    location: "上海",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "字节跳动招聘",
    link: "https://jobs.bytedance.com/experienced/position/7634456497736534325/detail",
    skills: ["Agent 编排与决策链路", "Prompt 组织", "大模型工程化落地", "AI Coding", "可观测与降本"],
  },
  {
    company: "字节跳动",
    title: "AI Agent研发工程师-开发者服务",
    direction: "Agent Infra",
    location: "深圳",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "字节跳动招聘",
    link: "https://jobs.bytedance.com/experienced/position/7428873140916554010/detail",
    skills: ["Agent Harness", "RAG 优化", "MCP 与工具开发", "上下文工程", "研发全流程 Agent 化"],
  },
  {
    company: "腾讯",
    title: "智能体应用技术算法工程师（TEG）",
    direction: "AI Agent",
    location: "北京",
    salary: "面议",
    seniority: "3 年+",
    education: "本科+",
    source: "腾讯招聘",
    link: "https://careers.tencent.com/jobdesc.html?postId=2079104781984645120",
    skills: ["智能体编排", "工具调用与记忆管理", "多智能体协作", "Harness Engineering", "RAG / Text2SQL"],
  },
  {
    company: "腾讯",
    title: "元宝搜索部-Agent算法工程师（VLM）",
    direction: "多模态",
    location: "北京",
    salary: "面议",
    seniority: "3 年+",
    education: "硕士+",
    source: "腾讯招聘",
    link: "https://careers.tencent.com/jobdesc.html?postId=2066829103750889472",
    skills: ["VLM Agent", "多模态理解", "工具调用", "记忆机制", "RL 视觉推理"],
  },
  {
    company: "阿里巴巴",
    title: "千问事业部-大模型应用算法工程师(Agent 方向)",
    direction: "AI Agent",
    location: "北京",
    salary: "面议",
    seniority: "1 年+",
    education: "本科+",
    source: "夸克招聘",
    link: "https://talent.quark.cn/off-campus/position-detail?lang=zh&positionId=7000011004",
    skills: ["广告 Agent", "Skills 进化", "Agentic RL", "Harness", "RAG"],
  },
  {
    company: "阿里巴巴",
    title: "千问事业部-MOS实验室-AI Agent算法专家(任务助理方向)",
    direction: "AI Agent",
    location: "北京 / 杭州 / 广州",
    salary: "面议",
    seniority: "2 年+",
    education: "硕士+",
    source: "夸克招聘",
    link: "https://talent.quark.cn/off-campus/position-detail?lang=zh&positionId=7000026601",
    skills: ["Multi-Agent Orchestration", "Agentic RL", "自我进化", "工具链集成", "效果评测"],
  },
  {
    company: "百度",
    title: "大模型算法工程师(J104493)",
    direction: "AI Agent",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "百度招聘",
    link: "https://talent.baidu.com/jobs/detail/SOCIAL/57595856-2688-42e3-b21d-6e2ea6b27a22",
    skills: ["智能体系统", "ReAct/CoT", "SFT/RLHF", "RAG", "多智能体协同"],
  },
  {
    company: "美团",
    title: "大模型智能体算法工程师",
    direction: "AI Agent",
    location: "北京 / 上海 / 深圳",
    salary: "面议",
    seniority: "应届",
    education: "本科+",
    source: "美团招聘",
    link: "https://zhaopin.meituan.com/web/position/detail?highlightType=campus&jobUnionId=4697304732",
    skills: ["大模型智能体", "推理与规划", "复杂指令遵循", "知识注入", "偏好对齐"],
  },
  {
    company: "美团",
    title: "【北斗】大模型算法工程师 SFT/RL/Agent方向",
    direction: "AI Agent",
    location: "北京",
    salary: "面议",
    seniority: "校招",
    education: "本科+",
    source: "美团招聘",
    link: "https://campus.niuqizp.com/job-vyr5zMnaC.html",
    skills: ["决策智能体", "SFT/DPO/GRPO/PPO", "RLVR", "Harness 设计", "离线评测"],
  },
  {
    company: "快手",
    title: "【快Star】AI Agent大模型算法工程师",
    direction: "AI Agent",
    location: "北京",
    salary: "4-6 万·16薪",
    seniority: "不限",
    education: "硕士+",
    source: "全职招聘网",
    link: "https://m.quanzhi.com/job/detail/6a1f906b1433e769ad6235ae",
    skills: ["Planning/Reasoning", "Tool Use", "Memory", "RAG", "Multi-Agent"],
  },
  {
    company: "小红书",
    title: "AI Agent & LLM Engineering",
    direction: "Agent Infra",
    location: "上海 / 北京 / 杭州",
    salary: "面议",
    seniority: "3 年+",
    education: "本科+",
    source: "小红书官网",
    link: "https://jobs.niuqizp.com/job-vwl55tCLa.html",
    skills: ["AI 编码智能体", "LLMOps", "RAG", "Skills", "端智能"],
  },
  {
    company: "小红书",
    title: "AI Agent 工程师(C端 运行时)",
    direction: "Agent Infra",
    location: "上海 / 北京",
    salary: "面议",
    seniority: "2 年+",
    education: "本科+",
    source: "小红书官网",
    link: "https://jobs.niuqizp.com/job-vmy55CnaC.html",
    skills: ["端云协同 Agentic Runtime", "端侧 LLM 推理引擎", "Agentloop", "Tool Use", "模型量化编译"],
  },
  {
    company: "蚂蚁集团",
    title: "AI算法专家(搜索推荐方向)-AIRS",
    direction: "AI Agent",
    location: "北京 / 杭州",
    salary: "面议",
    seniority: "3 年+",
    education: "本科+",
    source: "蚂蚁集团招聘",
    link: "https://talent.antgroup.com/off-campus-position?positionId=26042309771365",
    skills: ["生成式推荐", "LLM Query 理解", "智能体(Agent)体系", "RAG", "策略自动调优"],
  },
  {
    company: "华为",
    title: "Agent算法工程师/研究员",
    direction: "AI Agent",
    location: "上海",
    salary: "30-60K·14薪",
    seniority: "应届",
    education: "硕士+",
    source: "猎聘",
    link: "https://m.liepin.com/lptjob/84153729",
    skills: ["Agent 范式突破", "Agent Memory", "强化学习", "多智能体协作", "AI Coding"],
  },
  {
    company: "小米",
    title: "顶尖应届-Agent infra Engineer-MiMo",
    direction: "Agent Infra",
    location: "北京",
    salary: "面议",
    seniority: "校招",
    education: "本科+",
    source: "小米集团招聘",
    link: "https://xiaomi.jobs.f.mioffice.cn/toptalent/position/7646708188821752083/detail",
    skills: ["Agent Harness", "Agent Runtime", "Reasoning/Planning/Tool/Memory", "推理优化", "MiMoCode"],
  },
  {
    company: "小米",
    title: "Agent Harness 研发工程师",
    direction: "Agent Infra",
    location: "武汉 / 北京",
    salary: "面议",
    seniority: "校招",
    education: "本科+",
    source: "小米集团招聘",
    link: "https://xiaomi.jobs.f.mioffice.cn/campus/position/7671284471720020243/detail",
    skills: ["自研 Harness 框架", "Agent Loop", "工具系统", "上下文管理", "记忆与状态管理"],
  },
  {
    company: "深度求索 DeepSeek",
    title: "Agent弹性计算研发工程师（弹性计算 DSec）",
    direction: "Agent Infra",
    location: "北京 / 杭州",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "DeepSeek 官网",
    link: "http://talent.deepseek.com/",
    skills: ["Agent 弹性计算", "DSec", "沙箱隔离", "系统栈调优", "RPC/分布式"],
  },
  {
    company: "MiniMax",
    title: "AI服务端工程师(Agent方向)",
    direction: "Agent Infra",
    location: "上海",
    salary: "40-60K·16薪",
    seniority: "5-10 年",
    education: "本科+",
    source: "猎聘",
    link: "https://m.liepin.com/job/1984221441.shtml",
    skills: ["Agent 系统架构", "任务调度", "上下文管理", "工具调用", "数据链路"],
  },
  {
    company: "月之暗面 Moonshot",
    title: "Coding Agent研发工程师(Kimi Code)",
    direction: "AI Agent",
    location: "北京 / 上海",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "月之暗面招聘",
    link: "https://app.mokahr.com/apply/moonshot/148506",
    skills: ["Coding Agent 执行循环", "工具系统", "上下文工程", "失败分析/评测", "MCP/Subagent"],
  },
  {
    company: "智谱 AI",
    title: "【智谱星】GLM后训练团队-算法工程师(Agent)",
    direction: "AI Agent",
    location: "北京",
    salary: "面议",
    seniority: "校招",
    education: "硕士+",
    source: "智谱 AI 招聘",
    link: "https://zhipu-ai.jobs.feishu.cn/zhipucampus/position/7563604293749098779/detail",
    skills: ["DeepResearch", "Code Agent", "长思维链推理", "SFT/DPO", "Agent 任务迁移"],
  },
  {
    company: "阶跃星辰 StepFun",
    title: "大模型应用算法工程师（Agent / 多模态）",
    direction: "AI Agent",
    location: "北京 / 上海",
    salary: "面议",
    seniority: "校招",
    education: "本科+",
    source: "阶跃星辰招聘",
    link: "https://www.stepfun.com/company",
    skills: ["DeepResearch Agent", "RL", "工具调用", "多模态", "规划与反思"],
  },
  {
    company: "百川智能",
    title: "【源点顶尖人才计划】Agent 算法工程师",
    direction: "AI Agent",
    location: "北京",
    salary: "面议",
    seniority: "应届",
    education: "本科+",
    source: "百川智能招聘",
    link: "https://campus.niuqizp.com/job-vml5aznta.html",
    skills: ["Agent 核心算法", "工具调用", "记忆", "Agent Loop", "Harness"],
  },
  {
    company: "零一万物",
    title: "AI算法工程师(智能体)",
    direction: "AI Agent",
    location: "北京",
    salary: "27-45K·14薪",
    seniority: "3 年+",
    education: "硕士+",
    source: "零一万物招聘",
    link: "https://01ai.jobs.feishu.cn/index/position/7605812208450734374/detail",
    skills: ["Agent 架构", "Prompt/CoT/ToT", "Tool Use", "SFT/DPO", "多智能体协同"],
  },
  {
    company: "面壁智能",
    title: "大模型算法工程师(AI Agent)",
    direction: "AI Agent",
    location: "北京",
    salary: "面议",
    seniority: "3-5 年",
    education: "硕士+",
    source: "面壁智能招聘",
    link: "https://m.liepin.com/company/13461757/",
    skills: ["Agent 框架搭建", "RAG 全流程优化", "工具调用", "复杂任务规划", "模型微调"],
  },
]

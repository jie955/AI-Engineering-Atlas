// 实时职位数据 —— 由 WorkBuddy 定时自动化每日抓取并更新
// 数据来源：公开招聘平台搜索聚合（Boss直聘 / 猎聘 / 官方招聘官网 / 聚合站等）
// 注意：仅基于公开搜索结果，薪资为平台公开区间或「面议」，非全量实时数据。

export interface Job {
  company: string
  title: string
  location: string
  salary: string
  seniority: string
  education: string
  source: string
  link: string
  skills: string[]
}

// 最近一次抓取日期（YYYY-MM-DD）
export const jobsLastUpdated = "2026-09-05"

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
// 抓取日期：2026-09-05，覆盖 18 家目标公司，共 24 条公开在招岗位
export const jobs: Job[] = [
  {
    company: "字节跳动",
    title: "LLM应用/Agent/AI平台研发工程师-Data",
    location: "上海",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "字节跳动招聘",
    link: "https://jobs.bytedance.com/experienced/position/7634456497736534325/detail?sourceJobId=7623421136101099829",
    skills: ["Agent 编排", "Prompt 组织", "决策链路", "评测闭环", "AI Coding"],
  },
  {
    company: "字节跳动",
    title: "Agent技术研发工程师-火山方舟大模型平台",
    location: "杭州",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "字节跳动招聘",
    link: "https://jobs.bytedance.com/experienced/m/position/detail/7654959567977466165",
    skills: ["Agent 运行时", "执行引擎", "云原生", "可观测性", "上下文管理"],
  },
  {
    company: "字节跳动",
    title: "AI Agent开发工程师（校招）",
    location: "北京 / 上海 / 杭州",
    salary: "面议",
    seniority: "校招",
    education: "本科",
    source: "牛客网",
    link: "https://www.nowcoder.com/jobs/detail/446897?pageSource=5026&deliverSource=26",
    skills: ["Agent Harness", "Skills & CLI", "规模化验证", "Coding Agent", "Trae"],
  },
  {
    company: "腾讯",
    title: "AI协作工具- AI Agent研发工程师",
    location: "深圳",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "腾讯招聘",
    link: "https://careers.tencent.com/jobdesc.html?postId=2074485449791029248",
    skills: ["Agent 编排", "Tool/Skill 调用", "RAG", "MCP", "Function Calling"],
  },
  {
    company: "腾讯",
    title: "AI应用开发工程师-Agent方向",
    location: "深圳",
    salary: "面议",
    seniority: "1 年+",
    education: "本科+",
    source: "腾讯招聘",
    link: "https://careers.tencent.com/jobdesc.html?postId=2026845083588001792",
    skills: ["Planning", "Long-term Memory", "RAG", "Durable Execution", "MCP"],
  },
  {
    company: "深度求索 DeepSeek",
    title: "Agent Harness 研发工程师",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "DeepSeek 官网",
    link: "http://talent.deepseek.com/",
    skills: ["Harness", "Agent Infra", "代码智能体", "模型适配", "Agent Loop"],
  },
  {
    company: "MiniMax",
    title: "AI Agent 平台研发工程师",
    location: "北京",
    salary: "30-60K/月",
    seniority: "不限",
    education: "本科+",
    source: "DataHub 数据社区",
    link: "https://datahub.ac.cn/ai-jobs/topics/minimax-jobs.html",
    skills: ["Agent 评测", "Pipeline 编排", "LLM 网关", "Token 计量", "多供应商接入"],
  },
  {
    company: "月之暗面 Moonshot",
    title: "资深 Agent 研发工程师",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "月之暗面招聘",
    link: "https://app.mokahr.com/apply/moonshot/148506",
    skills: ["Agent", "MCP", "Skills", "Sandbox", "多智能体"],
  },
  {
    company: "智谱 AI",
    title: "26届校招-agent算法工程师",
    location: "北京",
    salary: "面议",
    seniority: "校招",
    education: "硕士+",
    source: "智谱 AI 招聘",
    link: "https://zhipu-ai.jobs.feishu.cn/zhipucampus/position/7530590286038075686/detail",
    skills: ["AutoGLM", "SFT/RL", "GUI Agent", "Function Call"],
  },
  {
    company: "智谱 AI",
    title: "【智谱星】26届校招-强化学习算法工程师",
    location: "北京",
    salary: "面议",
    seniority: "校招",
    education: "硕士/博士",
    source: "智谱 AI 招聘",
    link: "https://zhipu-ai.jobs.feishu.cn/zhipucampus/position/7532442163956812082/detail",
    skills: ["RL", "GUI/API Agent", "奖励模型", "分布式 RL", "LLM"],
  },
  {
    company: "阶跃星辰 StepFun",
    title: "全栈工程师（AI Coding Agent 方向）",
    location: "北京",
    salary: "35-60K/月",
    seniority: "不限",
    education: "本科+",
    source: "DataHub 数据社区",
    link: "https://datahub.ac.cn/ai-jobs/topics/ai-application-engineer-jobs.html",
    skills: ["AI Coding", "Coding Agent", "Workflow", "交互设计", "模型产品化"],
  },
  {
    company: "百川智能",
    title: "大模型算法工程师（后训练）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "硕士/博士",
    source: "官方招聘",
    link: "https://hiringcafe.com/job/baichuan-ai-beijing-beijing-g72dqxg7crbbeyoh",
    skills: ["Post-training", "RLHF", "SFT", "Agent 优化"],
  },
  {
    company: "零一万物",
    title: "AI 算法工程师（智能体）",
    location: "北京",
    salary: "面议",
    seniority: "3 年+",
    education: "硕士+",
    source: "零一万物招聘",
    link: "https://01ai.jobs.feishu.cn/index/position/7605812208450734374/detail",
    skills: ["Agent 架构", "LangGraph", "SFT/DPO", "RAG"],
  },
  {
    company: "面壁智能",
    title: "大模型 Agent 应用开发工程师",
    location: "北京",
    salary: "30-50K/月",
    seniority: "不限",
    education: "本科+",
    source: "DataHub 数据社区",
    link: "https://datahub.ac.cn/ai-jobs/topics/ai-application-engineer-jobs.html",
    skills: ["Agent/Multi-Agent", "RAG", "数据合成", "模型微调", "垂直领域落地"],
  },
  {
    company: "阿里巴巴",
    title: "大模型和智能体算法工程师",
    location: "北京",
    salary: "面议",
    seniority: "校招",
    education: "硕士+",
    source: "牛客优聘",
    link: "https://mnowpick.nowcoder.com/m/detail/index?jobId=389786",
    skills: ["Agent", "RAG", "LLM", "强化学习", "广告 Agent"],
  },
  {
    company: "百度",
    title: "大模型算法工程师（J104493）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "百度招聘",
    link: "https://talent.baidu.com/jobs/detail/SOCIAL/57595856-2688-42e3-b21d-6e2ea6b27a22",
    skills: ["Agent", "ReAct/CoT", "SFT/RLHF", "RAG", "多模态智能体"],
  },
  {
    company: "美团",
    title: "大模型应用算法工程师 - 商业分析智能体 (BA Agent)",
    location: "北京 / 上海",
    salary: "面议",
    seniority: "3 年+",
    education: "硕士+",
    source: "美团招聘",
    link: "https://zhaopin.meituan.com/web/position/detail?jobUnionId=3852641829",
    skills: ["Multi-Agent", "AgentRL", "NL2SQL", "Code Generation", "BA Agent"],
  },
  {
    company: "美团",
    title: "履约技术 - AI Agent 算法工程师（定价补贴方向）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "美团官网",
    link: "https://jobs.niuqizp.com/job-vsU5NtnMt.html",
    skills: ["运营 Agent", "工具调用", "Memory", "RAG", "Planning"],
  },
  {
    company: "快手",
    title: "【快Star】AI Agent算法专家-智能创作-【可灵AI专项】",
    location: "北京",
    salary: "面议",
    seniority: "校招",
    education: "硕士/MBA",
    source: "全职招聘网",
    link: "https://www.quanzhi.com/job/6a8a63d2c24b0728e63f3ed9",
    skills: ["智能创作 Agent", "AIGC", "RAG", "Agentic RL", "多模态"],
  },
  {
    company: "小红书",
    title: "AI Agent算法工程师(企业智能)",
    location: "北京 / 上海",
    salary: "面议",
    seniority: "1-3 年",
    education: "本科+",
    source: "小红书官网",
    link: "https://jobs.niuqizp.com/job-vYm5NN5ZC.html",
    skills: ["Agent", "RAG", "Prompt Engineering", "Workflow", "Context Engineering"],
  },
  {
    company: "蚂蚁集团",
    title: "大模型智能体优化算法",
    location: "北京 / 上海 / 杭州",
    salary: "面议",
    seniority: "校招",
    education: "硕士/博士",
    source: "蚂蚁集团招聘",
    link: "https://talent.antgroup.com/campus-full-list?depts=L3479",
    skills: ["Agent", "SFT/RL", "多智能体", "MCP"],
  },
  {
    company: "小米",
    title: "顶尖应届-Agent Harness算法工程师-大模型",
    location: "北京",
    salary: "15-30K·14薪",
    seniority: "应届",
    education: "硕士/博士",
    source: "猎聘",
    link: "https://m.liepin.com/lptjob/85239407",
    skills: ["Agent Harness", "Agentic Memory", "Agentic RL", "进化搜索"],
  },
  {
    company: "小米",
    title: "顶尖应届-垂域Agentic大模型算法工程师-AI实验室",
    location: "北京",
    salary: "15-30K·15薪",
    seniority: "应届",
    education: "博士",
    source: "猎聘",
    link: "https://m.liepin.com/lptjob/85239971",
    skills: ["垂域 Agentic", "Harness 优化", "Agentic RL", "强化微调", "多模态对齐"],
  },
  {
    company: "华为",
    title: "agent算法工程师/研究员",
    location: "上海",
    salary: "30-60K·14薪",
    seniority: "应届",
    education: "硕士+",
    source: "猎聘",
    link: "https://m.liepin.com/lptjob/84153729",
    skills: ["Agent Memory", "多智能体", "AI Coding", "强化学习"],
  },
]

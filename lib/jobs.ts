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
export const jobsLastUpdated = "2026-09-03"

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
export const jobs: Job[] = [
  {
    company: "深度求索 DeepSeek",
    title: "Agent Harness 研究员 / 工程师",
    location: "北京 / 杭州",
    salary: "年薪 42-100 万",
    seniority: "不限",
    education: "硕士+",
    source: "DeepSeek 官网",
    link: "http://talent.deepseek.com/",
    skills: ["Harness", "Agent Infra", "代码智能体"],
  },
  {
    company: "深度求索 DeepSeek",
    title: "Agent Infra 研发工程师",
    location: "北京 / 杭州",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "DeepSeek 官网",
    link: "http://talent.deepseek.com/",
    skills: ["Agent Infra", "分布式", "CUDA"],
  },
  {
    company: "月之暗面 Moonshot",
    title: "资深 Agent 研发工程师",
    location: "北京 / 上海",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "官方招聘",
    link: "https://jobspring.pro/job/j3957053/agent-moonshot",
    skills: ["Agent", "Go", "MCP", "Skills", "Sandbox"],
  },
  {
    company: "MiniMax",
    title: "AGI 服务端工程师（AI Agent）",
    location: "上海",
    salary: "30-80K/月",
    seniority: "3-5 年",
    education: "本科+",
    source: "职友集",
    link: "https://www.jobui.com/company/21399840/",
    skills: ["AI Agent", "服务端", "LLM"],
  },
  {
    company: "MiniMax",
    title: "大语言模型算法工程师",
    location: "北京",
    salary: "40-70K/月",
    seniority: "不限",
    education: "不限",
    source: "DataHub 数据社区",
    link: "https://datahub.ac.cn/ai-jobs/topics/minimax-jobs.html",
    skills: ["LLM", "PyTorch", "机器学习"],
  },
  {
    company: "智谱 AI",
    title: "代码大模型算法工程师（CodingAgent）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "硕士/博士",
    source: "智谱 AI 招聘",
    link: "https://zhipu-ai.jobs.feishu.cn/zhipucampus/position/7539835713145358633/detail",
    skills: ["CodingAgent", "SFT/RL", "Megatron", "GLM"],
  },
  {
    company: "阶跃星辰 StepFun",
    title: "AI Agent 算法工程师",
    location: "北京 / 上海",
    salary: "30-50K/月",
    seniority: "不限",
    education: "本科+",
    source: "官网",
    link: "https://www.stepfun.com",
    skills: ["Agent", "LLM", "强化学习"],
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
    source: "官方招聘",
    link: "https://01ai.jobs.feishu.cn/index/position/7605812208450734374/detail",
    skills: ["Agent 架构", "LangGraph", "SFT/DPO", "RAG"],
  },
  {
    company: "零一万物",
    title: "多模态内容审核算法工程师（Agent）",
    location: "北京",
    salary: "面议",
    seniority: "3 年+",
    education: "本科+",
    source: "官方招聘",
    link: "https://01ai.jobs.feishu.cn/index/position/7662267796738541833/detail",
    skills: ["多模态审核 Agent", "内容安全", "多语言微调"],
  },
  {
    company: "面壁智能",
    title: "强化学习算法工程师（大模型）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "硕士+",
    source: "牛客网",
    link: "https://www.nowcoder.com/jobs/detail/376369",
    skills: ["强化学习", "PPO/GRPO", "大模型", "Agent 能力"],
  },
  {
    company: "字节跳动",
    title: "语音/多模态大模型算法工程师（Speech/Omni/Agent 方向）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "硕士/博士",
    source: "字节跳动招聘",
    link: "https://jobs.bytedance.com/campus/position/7654892323781216565/detail",
    skills: ["多模态", "Agent", "Tool Use", "Multi-Agent"],
  },
  {
    company: "字节跳动",
    title: "多模态大模型算法工程师（Commercial AI）",
    location: "上海",
    salary: "面议",
    seniority: "不限",
    education: "硕士+",
    source: "字节跳动招聘",
    link: "https://jobs.bytedance.com/experienced/position/7506517987350268167/detail",
    skills: ["VLM", "多模态 Agent", "RAG", "RL"],
  },
  {
    company: "腾讯",
    title: "AI Agent 研发工程师（AI 协作工具）",
    location: "深圳",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "腾讯招聘",
    link: "https://careers.tencent.com/jobdesc.html?postId=2074485449791029248",
    skills: ["Agent 编排", "RAG", "MCP", "Function Calling"],
  },
  {
    company: "腾讯",
    title: "AI 应用开发工程师（Agent 方向）",
    location: "深圳",
    salary: "面议",
    seniority: "1 年+",
    education: "本科+",
    source: "腾讯招聘",
    link: "https://careers.tencent.com/jobdesc.html?postId=2026845083588001792",
    skills: ["Agent", "Memory", "RAG", "Durable Execution"],
  },
  {
    company: "阿里巴巴",
    title: "多模态大模型与 Agent 算法工程师（内容理解方向）",
    location: "北京",
    salary: "30-50K/月",
    seniority: "不限",
    education: "硕士+",
    source: "猎聘",
    link: "https://m.liepin.com/job/1985156851.shtml",
    skills: ["VLM", "Agent 系统", "RLHF/DPO", "Multi-Agent"],
  },
  {
    company: "百度",
    title: "大模型算法工程师（智能体系统）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "百度招聘",
    link: "https://talent.baidu.com/jobs/detail/SOCIAL/57595856-2688-42e3-b21d-6e2ea6b27a22",
    skills: ["Agent", "ReAct/CoT", "SFT/RLHF", "RAG"],
  },
  {
    company: "美团",
    title: "大模型应用算法工程师（BA Agent）",
    location: "北京 / 上海",
    salary: "面议",
    seniority: "3 年+",
    education: "硕士+",
    source: "美团招聘",
    link: "https://zhaopin.meituan.com/web/position/detail?jobUnionId=3852641829",
    skills: ["Multi-Agent", "AgentRL", "NL2SQL", "Code Generation"],
  },
  {
    company: "快手",
    title: "【快Star】大语言模型算法工程师",
    location: "北京",
    salary: "面议",
    seniority: "校招",
    education: "硕士/博士",
    source: "官方招聘",
    link: "https://www.quanzhi.com/job/6a5f449162f6005b2b2647ec",
    skills: ["LLM", "预训练", "模型对齐", "Agent", "RAG"],
  },
  {
    company: "快手",
    title: "【快Star】多模态大模型算法工程师",
    location: "北京",
    salary: "20-40K·16 薪",
    seniority: "校招",
    education: "不限",
    source: "牛客网",
    link: "https://www.nowcoder.com/jobs/detail/453841",
    skills: ["多模态", "后训练", "Agent", "工具调用"],
  },
  {
    company: "小红书",
    title: "AI Agent 算法工程师（企业智能）",
    location: "北京 / 上海",
    salary: "面议",
    seniority: "1-3 年",
    education: "本科+",
    source: "小红书官网",
    link: "https://jobs.niuqizp.com/job-vYm5NN5ZC.html",
    skills: ["Agent", "RAG", "Prompt Engineering", "Workflow"],
  },
  {
    company: "小红书",
    title: "大模型 Agent 算法专家",
    location: "上海 / 北京",
    salary: "面议",
    seniority: "不限",
    education: "硕士+",
    source: "小红书官网",
    link: "https://jobs.niuqizp.com/job-vyy55ZtzN.html",
    skills: ["Agent 架构", "RAG", "Multi-Agent", "SFT/RL"],
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
    company: "华为",
    title: "AI 算法工程师（Agent/大模型/多模态）",
    location: "深圳",
    salary: "面议",
    seniority: "校招",
    education: "本科+",
    source: "官方招聘",
    link: "https://www.shushuqiuzhi.com/position/341921",
    skills: ["Agent", "大模型", "多模态", "AI Infra"],
  },
  {
    company: "小米",
    title: "Agent Harness 算法工程师",
    location: "北京",
    salary: "15-30K·14 薪",
    seniority: "应届",
    education: "硕士/博士",
    source: "猎聘",
    link: "https://m.liepin.com/lptjob/85239407",
    skills: ["Agent Harness", "Agentic Memory", "Agentic RL"],
  },
]

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
export const jobsLastUpdated = "2026-08-27"

// 招聘方聚焦方向：大厂 + 头部 AI 独角兽
export const jobFocus = {
  label: "大厂 · 头部 AI 独角兽",
  companies: [
    "字节跳动", "腾讯", "阿里巴巴", "百度", "美团", "小红书", "蚂蚁集团",
    "深度求索 DeepSeek", "月之暗面 Moonshot", "MiniMax", "智谱 AI", "阶跃星辰 StepFun", "百川智能", "零一万物",
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
    link: "https://www.deepseek.com",
    skills: ["Harness", "Agent Infra", "代码智能体"],
  },
  {
    company: "深度求索 DeepSeek",
    title: "大模型训练 / 推理框架工程师",
    location: "北京 / 杭州",
    salary: "40-70K/月",
    seniority: "不限",
    education: "本科+",
    source: "DeepSeek 官网",
    link: "https://www.deepseek.com",
    skills: ["分布式训练", "RL", "推理优化"],
  },
  {
    company: "月之暗面 Moonshot",
    title: "高级 Agent 研发工程师",
    location: "北京 / 上海",
    salary: "30-50K/月",
    seniority: "不限",
    education: "硕士+",
    source: "官网",
    link: "https://careers.kimi.com",
    skills: ["Agent", "大模型", "推理引擎"],
  },
  {
    company: "月之暗面 Moonshot",
    title: "多模态大模型算法工程师",
    location: "北京",
    salary: "30-50K/月",
    seniority: "不限",
    education: "硕士+",
    source: "Boss 直聘",
    link: "https://www.zhipin.com",
    skills: ["多模态", "预训练", "RLHF"],
  },
  {
    company: "阶跃星辰 StepFun",
    title: "AI Agent 算法工程师",
    location: "北京 / 上海",
    salary: "30-50K/月",
    seniority: "硕士",
    education: "硕士+",
    source: "官网",
    link: "https://www.stepfun.com",
    skills: ["Agent", "LLM", "多模态"],
  },
  {
    company: "阶跃星辰 StepFun",
    title: "Agent Infra 开发工程师",
    location: "北京 / 上海",
    salary: "30-50K/月",
    seniority: "不限",
    education: "本科+",
    source: "官网",
    link: "https://www.stepfun.com",
    skills: ["Agent Infra", "分布式", "CUDA"],
  },
  {
    company: "MiniMax",
    title: "大模型算法工程师",
    location: "上海",
    salary: "30-50K/月",
    seniority: "1-3 年",
    education: "硕士",
    source: "Boss 直聘",
    link: "https://www.zhipin.com",
    skills: ["LLM", "微调", "PyTorch"],
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
    company: "智谱 AI",
    title: "大模型算法工程师",
    location: "北京",
    salary: "30-50K/月",
    seniority: "不限",
    education: "硕士+",
    source: "智谱官网",
    link: "https://www.zhipuai.cn",
    skills: ["GLM", "微调", "推理优化"],
  },
  {
    company: "智谱 AI",
    title: "代码大模型算法工程师（CodingAgent）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "硕士/博士",
    source: "官方招聘",
    link: "https://www.zhipuai.cn",
    skills: ["CodingAgent", "SFT/RL", "Megatron"],
  },
  {
    company: "字节跳动",
    title: "大模型算法工程师",
    location: "深圳 · 南山",
    salary: "40-80K/月",
    seniority: "不限",
    education: "硕士/博士",
    source: "官方招聘",
    link: "https://jobs.bytedance.com",
    skills: ["LLM", "AIGC"],
  },
  {
    company: "字节跳动",
    title: "多模态大模型算法工程师",
    location: "北京 · 海淀",
    salary: "26-45K·15 薪",
    seniority: "不限",
    education: "本科+",
    source: "猎聘",
    link: "https://m.liepin.com/job/1984003213.shtml",
    skills: ["VLM", "RAG", "Agent 工具调用"],
  },
  {
    company: "小红书",
    title: "AI Agent & LLM Engineering",
    location: "上海 / 北京 / 杭州",
    salary: "面议",
    seniority: "3 年+",
    education: "本科+",
    source: "小红书官网",
    link: "https://jobs.niuqizp.com/job-vwl55tCLa.html",
    skills: ["RAG", "Skills", "Prompt Engineering", "LLMOps"],
  },
  {
    company: "腾讯",
    title: "AI 产品经理（AI 平台 Agent 方向）",
    location: "深圳",
    salary: "面议",
    seniority: "1 年+",
    education: "本科+",
    source: "腾讯官方招聘",
    link: "https://careers.tencent.com",
    skills: ["Agent 流程", "观测", "安全"],
  },
  {
    company: "百川智能",
    title: "大模型算法工程师（后训练）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "硕士/博士",
    source: "飞书招聘",
    link: "https://cq6qe6bvfr6.jobs.feishu.cn/baichuanzhaopin/m/position/detail/7434429533023865098",
    skills: ["Post-training", "RLHF", "SFT", "Agent 优化"],
  },
  {
    company: "零一万物",
    title: "多模态内容审核算法工程师（Agent）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "硕士+",
    source: "面试马",
    link: "https://www.mianshima.com/job/159/7662267796738541833",
    skills: ["多模态审核 Agent", "内容安全", "多语言微调"],
  },
  {
    company: "面壁智能",
    title: "端侧大模型算法工程师（前进四计划）",
    location: "北京 / 上海 / 深圳等六城",
    salary: "面议 · 期权",
    seniority: "应届",
    education: "硕士/博士",
    source: "官网",
    link: "https://www.modelbest.cn",
    skills: ["端侧大模型", "MiniCPM", "强化学习", "AI4AI"],
  },
  {
    company: "阿里巴巴",
    title: "多模态算法工程师（Agent 方向）",
    location: "杭州 · 余杭",
    salary: "30-60K·16 薪",
    seniority: "1-3 年",
    education: "硕士",
    source: "Boss 直聘",
    link: "https://www.zhipin.com/zhaopin/a5fbc92e684bbf0c1nB52t--EQ~~",
    skills: ["GUI Agent", "多模态", "VLM"],
  },
  {
    company: "阿里巴巴",
    title: "Agent 算法工程师（阿里安全）",
    location: "杭州",
    salary: "35-65K·16 薪",
    seniority: "不限",
    education: "本科",
    source: "Boss 直聘",
    link: "https://www.zhipin.com/zhaopin/a5fbc92e684bbf0c1nB52t--EQ~~",
    skills: ["Agent 架构", "上下文", "记忆", "工具调用"],
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
    company: "百度",
    title: "大模型算法工程师（文心智能体策略）",
    location: "北京",
    salary: "面议",
    seniority: "不限",
    education: "本科+",
    source: "百度招聘",
    link: "https://talent.baidu.com/jobs/detail/SOCIAL/7752619e-42af-40fb-b6f0-47683e224e9f",
    skills: ["提示词工程", "大模型调优", "RAG"],
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
    company: "美团",
    title: "大模型和智能体应用算法（AIBD）",
    location: "北京 / 上海",
    salary: "面议",
    seniority: "2 年+",
    education: "本科+",
    source: "美团招聘",
    link: "https://zhaopin.meituan.com/web/position/detail?highlightType=social&jobUnionId=4136761943",
    skills: ["大模型推理", "多模态训练", "智能体"],
  },
  {
    company: "蚂蚁集团",
    title: "Agent 算法工程师",
    location: "上海 · 浦东",
    salary: "30-60K·15 薪",
    seniority: "3-5 年",
    education: "本科+",
    source: "猎聘",
    link: "https://m.liepin.com/job/1984802501.shtml",
    skills: ["Agentic AI", "任务拆解", "规划推理", "工具调用"],
  },
  {
    company: "蚂蚁集团",
    title: "智能体与大模型应用工程",
    location: "杭州",
    salary: "30-60K",
    seniority: "1-3 年",
    education: "本科+",
    source: "猎聘",
    link: "https://m.liepin.com/job/1983923335.shtml",
    skills: ["Agent 记忆系统", "规划引擎", "Tool/Skills", "Harness"],
  },
]

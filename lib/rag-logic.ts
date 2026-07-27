import { MENU_INDEX, HISTORY_INDEX, USER_ID } from "./rag-data"
import type { MenuItem, HistoryItem } from "./rag-data"

export interface RetrievalData {
  menuResults: MenuItem[]
  historyResults: HistoryItem[]
  keywords: string[]
}

export interface GenerationResult {
  finalDish: string
  reason: string
  isPersonalized: boolean
  historyComments?: string
}

export function simulateRetrieval(query: string): RetrievalData {
  // Extract keywords
  const keywords: string[] = []
  if (query.includes("温暖")) keywords.push("温暖")
  if (query.includes("辣")) keywords.push("辣")
  if (query.includes("胃")) keywords.push("胃")

  const metadataFilter = { user_id: USER_ID }

  // Retrieve from menu index
  let menuResults = MENU_INDEX.filter(
    (item) =>
      (query.includes("辣") && item.flavor.includes("辣")) || (query.includes("温暖") && item.type.includes("热")),
  )

  // Prioritize gentle options if stomach issues mentioned
  if (query.includes("胃")) {
    menuResults = menuResults.sort((a, b) => {
      if (a.flavor === "清淡") return -1
      if (b.flavor === "清淡") return 1
      return 0
    })
  }

  // Retrieve from history index
  const historyResults = HISTORY_INDEX.filter(
    (item) =>
      item.user_id === metadataFilter.user_id &&
      keywords.some((k) => item.context.includes(k) || item.dish.includes(k) || item.comment.includes(k)),
  )

  return { menuResults, historyResults, keywords }
}

export function generateRecommendation(query: string, retrievalData: RetrievalData): GenerationResult {
  const { menuResults, historyResults } = retrievalData
  let finalDish = ""
  let reason = "根据您的需求和知识库生成结果:"
  let isPersonalized = false

  const historyComments = historyResults
    .map((h) => `用户历史记录: 曾评价 ${h.dish} 为 ${h.rating} 星,评论: "${h.comment}"。`)
    .join("\n")

  const hasNegativeSpicyHistory = historyResults.some((h) => h.dish === "麻辣火锅" && h.rating < 3)

  if (hasNegativeSpicyHistory && query.includes("辣") && query.includes("胃")) {
    const gentleDish = menuResults.find((d) => d.dish === "清汤面")

    if (gentleDish) {
      finalDish = gentleDish.dish
      const negativeRating = historyResults.find((h) => h.dish === "麻辣火锅")?.rating
      reason += `\n\n• 个性化决策: 虽然您想吃辣,但系统检索到您的历史记录显示 (Rating: ${negativeRating} 星) 对麻辣火锅有过负面反馈 (胃不适)。\n\n• 最终推荐: 推荐更温和的 ${finalDish},并建议将辣椒油独立打包,让您自行控制辣度,以避免重蹈覆辙。\n\n• 知识依据: 菜单知识库 (Index A) 确认 ${finalDish} 温暖滋补。用户历史库 (Index B) 确认您的胃部敏感。`
      isPersonalized = true
    }
  } else {
    const defaultDish = menuResults.find((d) => d.dish === "酸辣粉") || menuResults[0]
    if (defaultDish) {
      finalDish = defaultDish.dish
      reason += `\n\n• 决策: 推荐 ${finalDish}。\n\n• 理由: 菜品符合 '温暖' 和 '辣' 的基本需求。\n\n• 知识依据: 菜单知识库 (Index A) 确认。无特殊个性化风险。`
    } else {
      finalDish = "无匹配项"
      reason += "\n\n未在知识库中找到符合所有条件的菜品。"
    }
  }

  return { finalDish, reason, isPersonalized, historyComments }
}

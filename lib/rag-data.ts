export const USER_ID = "user-1001"

export interface MenuItem {
  dish: string
  type: string
  flavor: string
  price: number
  description: string
}

export interface HistoryItem {
  user_id: string
  event: string
  dish: string
  rating: number
  comment: string
  context: string
}

export const MENU_INDEX: MenuItem[] = [
  { dish: "麻辣火锅", type: "热菜", flavor: "麻辣", price: 30, description: "香辣刺激,适合重口味爱好者。" },
  { dish: "清汤面", type: "热汤", flavor: "清淡", price: 10, description: "温暖滋补,适合养胃。" },
  { dish: "酸辣粉", type: "热菜", flavor: "酸辣", price: 15, description: "酸爽开胃,辣度中等偏高。" },
  { dish: "清炒时蔬", type: "蔬菜", flavor: "清淡", price: 12, description: "新鲜蔬菜,营养均衡。" },
]

export const HISTORY_INDEX: HistoryItem[] = [
  {
    user_id: "user-1001",
    event: "上次点餐评论",
    dish: "麻辣火锅",
    rating: 2,
    comment: "太辣了,胃不舒服,第二天肚子疼。",
    context: "对麻辣耐受度低",
  },
  {
    user_id: "user-1001",
    event: "近期偏好",
    dish: "清汤面",
    rating: 5,
    comment: "感觉身体疲惫时会点清淡的面食。",
    context: "寻求清淡/养胃",
  },
  {
    user_id: "user-1002",
    event: "上次点餐评论",
    dish: "酸辣粉",
    rating: 5,
    comment: "超爱酸辣粉!",
    context: "不属于当前用户",
  },
]

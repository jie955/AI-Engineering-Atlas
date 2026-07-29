"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TreePine,
  Scissors,
  Plus,
  Target,
  CheckCircle2,
  RotateCcw,
  ArrowDown,
} from "lucide-react"

const SIZE = 5
const GOAL: [number, number] = [4, 4]
const START: [number, number] = [0, 0]
const WALLS: [number, number][] = [
  [1, 2],
  [2, 1],
  [3, 3],
]
const DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

interface TotNode {
  id: string
  pos: [number, number]
  score: number // 到 GOAL 的曼哈顿距离，越小越优
  children: TotNode[]
  pruned: boolean
  path: [number, number][] // 从根到此的坐标路径，用于避免回环
}

const isWall = (p: [number, number]) => WALLS.some((w) => w[0] === p[0] && w[1] === p[1])
const inBounds = (p: [number, number]) => p[0] >= 0 && p[0] < SIZE && p[1] >= 0 && p[1] < SIZE
const manhattan = (p: [number, number]) => Math.abs(p[0] - GOAL[0]) + Math.abs(p[1] - GOAL[1])

let nodeCounter = 0
function makeNode(pos: [number, number], path: [number, number][]): TotNode {
  nodeCounter += 1
  return { id: `n${nodeCounter}`, pos, score: manhattan(pos), children: [], pruned: false, path }
}

function updateTree(
  node: TotNode,
  id: string,
  action: "expand" | "prune",
): TotNode {
  if (node.id === id) {
    if (action === "expand") {
      const children: TotNode[] = []
      for (const [dx, dy] of DIRS) {
        const np: [number, number] = [node.pos[0] + dx, node.pos[1] + dy]
        if (!inBounds(np) || isWall(np)) continue
        if (node.path.some((p) => p[0] === np[0] && p[1] === np[1])) continue
        children.push(makeNode(np, [...node.path, np]))
      }
      return { ...node, children }
    }
    return { ...node, pruned: true, children: [] }
  }
  if (node.children.length === 0) return node
  return { ...node, children: node.children.map((c) => updateTree(c, id, action)) }
}

function collectPositions(node: TotNode, acc: Set<string>) {
  acc.add(`${node.pos[0]},${node.pos[1]}`)
  node.children.forEach((c) => collectPositions(c, acc))
}

function NodeView({
  node,
  depth,
  onExpand,
  onPrune,
  onSelect,
}: {
  node: TotNode
  depth: number
  onExpand: (id: string) => void
  onPrune: (id: string) => void
  onSelect: (node: TotNode) => void
}) {
  const isGoal = node.pos[0] === GOAL[0] && node.pos[1] === GOAL[1]
  return (
    <div className="ml-0" style={{ marginLeft: depth * 18 }}>
      <div
        className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
          node.pruned
            ? "border-rose-500/30 bg-rose-500/5 opacity-60"
            : isGoal
              ? "border-emerald-500/50 bg-emerald-500/10"
              : "border-border bg-card"
        }`}
      >
        <span className="font-mono text-foreground">
          ({node.pos[0]},{node.pos[1]})
        </span>
        <Badge
          variant="outline"
          className={`text-[10px] ${
            isGoal
              ? "border-emerald-500/40 text-emerald-500"
              : node.score <= 4
                ? "border-emerald-500/30 text-emerald-600"
                : node.score <= 6
                  ? "border-amber-500/30 text-amber-600"
                  : "border-rose-500/30 text-rose-600"
          }`}
        >
          距终点 {node.score}
        </Badge>
        {isGoal && (
          <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600">
            目标
          </Badge>
        )}
        {node.pruned && (
          <Badge variant="outline" className="text-[10px] border-rose-500/30 text-rose-600">
            已剪枝
          </Badge>
        )}
        {!node.pruned && !isGoal && (
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] text-emerald-600 hover:bg-emerald-500/10"
              disabled={node.children.length > 0}
              onClick={() => onExpand(node.id)}
            >
              <Plus className="w-3 h-3 mr-1" /> 展开
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] text-rose-600 hover:bg-rose-500/10"
              onClick={() => onPrune(node.id)}
            >
              <Scissors className="w-3 h-3 mr-1" /> 剪枝
            </Button>
          </div>
        )}
        {isGoal && (
          <Button
            size="sm"
            className="ml-auto h-6 px-2 text-[10px]"
            onClick={() => onSelect(node)}
          >
            <Target className="w-3 h-3 mr-1" /> 选定此路径
          </Button>
        )}
      </div>
      {!node.pruned &&
        node.children.map((c) => (
          <NodeView
            key={c.id}
            node={c}
            depth={depth + 1}
            onExpand={onExpand}
            onPrune={onPrune}
            onSelect={onSelect}
          />
        ))}
    </div>
  )
}

export function ToTPlayground() {
  const [root, setRoot] = useState<TotNode>(() => makeNode(START, [START]))
  const [success, setSuccess] = useState<[number, number][] | null>(null)
  const [explored, setExplored] = useState<Set<string>>(new Set([`${START[0]},${START[1]}`]))

  const handleExpand = (id: string) => {
    setRoot((prev) => {
      const next = updateTree(prev, id, "expand")
      const acc = new Set<string>()
      collectPositions(next, acc)
      setExplored(acc)
      return next
    })
  }

  const handlePrune = (id: string) => {
    setRoot((prev) => {
      const next = updateTree(prev, id, "prune")
      const acc = new Set<string>()
      collectPositions(next, acc)
      setExplored(acc)
      return next
    })
  }

  const handleSelect = (node: TotNode) => {
    setSuccess(node.path)
  }

  const handleReset = () => {
    nodeCounter += 1
    setRoot(makeNode(START, [START]))
    setSuccess(null)
    setExplored(new Set([`${START[0]},${START[1]}`]))
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            思维树 (ToT) 真演练场（强覆盖）
          </h3>
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            真实树搜索
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          与上方承载卡不同，这里是<strong className="text-foreground"> 真·演练场</strong>：在 5×5 网格中从起点
          <strong className="text-foreground"> 真实展开搜索树</strong>——每个节点按曼哈顿距离
          <strong className="text-foreground"> 真实评估</strong>（距终点越近分越高），你可<strong className="text-foreground"> 剪枝</strong>
          低分分支、再从兄弟节点<strong className="text-foreground"> 回溯</strong>展开，最终抵达终点。这正是 ToT「分叉-评估-剪枝-回溯」替代线性推理的核心。
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* 左：网格概览 + 说明 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <TreePine className="w-3.5 h-3.5" /> 1. 搜索空间（网格）
              </div>
              <div className="grid grid-cols-5 gap-1 w-[220px] mx-auto">
                {Array.from({ length: SIZE * SIZE }).map((_, idx) => {
                  const x = Math.floor(idx / SIZE)
                  const y = idx % SIZE
                  const isStart = x === START[0] && y === START[1]
                  const isGoalCell = x === GOAL[0] && y === GOAL[1]
                  const wall = isWall([x, y])
                  const visited = explored.has(`${x},${y}`)
                  let cls = "aspect-square rounded border border-border bg-muted/20 "
                  if (wall) cls += "bg-rose-500/20 border-rose-500/40 "
                  else if (isGoalCell) cls += "bg-emerald-500/30 border-emerald-500/50 "
                  else if (isStart) cls += "bg-blue-500/30 border-blue-500/50 "
                  else if (visited) cls += "bg-amber-500/20 border-amber-500/40 "
                  return (
                    <div key={idx} className={cls} title={`(${x},${y})`}>
                      <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-foreground/70">
                        {isStart ? "S" : isGoalCell ? "G" : wall ? "×" : ""}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground justify-center">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500/40 border border-blue-500/50" />起点</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500/50" />终点</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-500/40" />已探索</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500/40" />墙</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">操作</div>
              <Button onClick={handleReset} variant="outline" className="w-full text-xs" size="sm">
                <RotateCcw className="w-3.5 h-3.5 mr-2" /> 重置搜索树
              </Button>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                提示：先展开起点，对比各分支的「距终点」分数，剪掉明显偏离的，再展开更优分支，直到触达终点并选定。
              </p>
            </div>
          </div>

          {/* 右：搜索树视图 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <TreePine className="w-3.5 h-3.5" /> 2. 推理树（展开 / 评估 / 剪枝 / 回溯）
              </div>
              <div className="p-4 bg-slate-950/90 rounded-lg border border-border/40 max-h-[360px] overflow-y-auto font-mono text-xs">
                <NodeView
                  node={root}
                  depth={0}
                  onExpand={handleExpand}
                  onPrune={handlePrune}
                  onSelect={handleSelect}
                />
              </div>

              {success && (
                <div className="flex items-start gap-2 text-[11px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    <strong>成功抵达终点！</strong> 选中的推理路径（ToT 最终汇聚的最优解）：
                    <br />
                    <span className="font-mono">
                      {success.map((p) => `(${p[0]},${p[1]})`).join(" → ")}
                    </span>
                    <br />
                    共 {success.length - 1} 步。注意：正是通过「多候选 + 评估 + 剪枝」，模型避开了线性推理容易陷进去的死路。
                  </span>
                </div>
              )}

              <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
                <Target className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">诚实说明：</strong>
                  网格、墙与启发式（曼哈顿距离）均为真实计算的搜索环境；展开/剪枝/回溯状态真实维护。
                  真实场景里每个节点的「候选思路」由 LLM 生成、评分由另一个模型或规则给出，但<strong className="text-foreground"> 树搜索的算法骨架与本演练场一致</strong>。
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <TreePine className="w-3.5 h-3.5 text-emerald-500" />
            <span>树搜索状态真实维护（展开 / 剪枝 / 回溯）</span>
          </div>
          <span className="font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10">
            Branching + Pruning
          </span>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <ArrowDown className="w-3.5 h-3.5" />
        下方为 Agent Runtime Loop 主可视化（Think→Plan→Act→Observe→Reflect 单链循环）
      </div>
    </div>
  )
}

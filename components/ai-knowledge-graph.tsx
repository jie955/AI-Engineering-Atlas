"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

interface NodeData {
  id: string
  label: string
  position: [number, number, number]
  color: string
  link?: string
  description: string
}

const nodes: NodeData[] = [
  {
    id: "llm",
    label: "大模型",
    position: [0, 1.8, 0],
    color: "#B85C3A",
    link: "/demos/prompt-optimizer",
    description: "提示词工程与模型优化",
  },
  {
    id: "rag",
    label: "RAG",
    position: [-2.5, 0, 0],
    color: "#6B7B5E",
    link: "/demos/rag-decision",
    description: "检索增强生成系统",
  },
  {
    id: "agent",
    label: "Agent",
    position: [2.5, 0, 0],
    color: "#8B3D2A",
    link: "/demos/multi-agent",
    description: "智能体协作系统",
  },
  {
    id: "multimodal",
    label: "多模态",
    position: [-1.8, -1.8, 0],
    color: "#A67C5B",
    description: "跨模态理解与生成",
  },
  {
    id: "engineering",
    label: "工程化",
    position: [1.8, -1.8, 0],
    color: "#D4A574",
    description: "生产级部署与优化",
  },
]

const connections = [
  ["llm", "rag"],
  ["llm", "agent"],
  ["llm", "multimodal"],
  ["rag", "agent"],
  ["agent", "engineering"],
  ["multimodal", "engineering"],
]

export default function AIKnowledgeGraph() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const [rotation, setRotation] = useState({ x: 0.2, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const dragStart = useRef({ x: 0, y: 0 })
  const rotationStart = useRef({ x: 0, y: 0 })

  // Auto rotate when not dragging or hovering
  useEffect(() => {
    let frameId: number
    const tick = () => {
      if (!isDragging && !hoveredNode) {
        setRotation((prev) => ({
          ...prev,
          y: prev.y + 0.003,
        }))
      }
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [isDragging, hoveredNode])

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    rotationStart.current = { x: rotation.x, y: rotation.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    const sensitivity = 0.005
    setRotation({
      x: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationStart.current.x - dy * sensitivity)),
      y: rotationStart.current.y - dx * sensitivity,
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  // 3D perspective projection calculations
  const projectedMap = useMemo(() => {
    const cosY = Math.cos(rotation.y)
    const sinY = Math.sin(rotation.y)
    const cosX = Math.cos(rotation.x)
    const sinX = Math.sin(rotation.x)

    const map: Record<string, { px: number; py: number; pz: number; depthScale: number }> = {}
    nodes.forEach((node) => {
      const [x, y, z] = node.position

      // Rotate around Y-axis
      const x1 = x * cosY - z * sinY
      const z1 = x * sinY + z * cosY

      // Rotate around X-axis
      const y2 = y * cosX - z1 * sinX
      const z2 = y * sinX + z1 * cosX

      // Perspective scale factor
      const fov = 8
      const depthScale = fov / (fov + z2)

      // Project onto 800x600 canvas coordinate space
      const scale = 115
      const cx = 400
      const cy = 300
      const px = x1 * depthScale * scale + cx
      const py = y2 * depthScale * scale + cy

      map[node.id] = { px, py, pz: z2, depthScale }
    })
    return map
  }, [rotation])

  // Sort nodes back-to-front (depth buffer logic)
  const depthSortedNodes = useMemo(() => {
    return nodes
      .map((node) => ({
        ...node,
        ...projectedMap[node.id],
      }))
      .sort((a, b) => b.pz - a.pz)
  }, [projectedMap])

  // Prepare connection line data
  const renderedConnections = useMemo(() => {
    return connections
      .map(([startId, endId], index) => {
        const start = projectedMap[startId]
        const end = projectedMap[endId]
        if (!start || !end) return null
        return {
          key: `${startId}-${endId}-${index}`,
          x1: start.px,
          y1: start.py,
          x2: end.px,
          y2: end.py,
          avgDepth: (start.pz + end.pz) / 2,
        }
      })
      .filter(Boolean) as Array<{ key: string; x1: number; y1: number; x2: number; y2: number; avgDepth: number }>
  }, [projectedMap])

  const hoveredNodeData = nodes.find((n) => n.id === hoveredNode)
  const hoveredNodeProjected = hoveredNode ? projectedMap[hoveredNode] : null

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden touch-none"
    >
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <filter id="glow-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Spherical radial gradients for warm paper-like elements */}
          <radialGradient id="grad-llm" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E68A6C" />
            <stop offset="50%" stopColor="#B85C3A" />
            <stop offset="100%" stopColor="#8B3D2A" />
          </radialGradient>
          <radialGradient id="grad-rag" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#8B9A7E" />
            <stop offset="50%" stopColor="#6B7B5E" />
            <stop offset="100%" stopColor="#4E5945" />
          </radialGradient>
          <radialGradient id="grad-agent" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#B85C3A" />
            <stop offset="50%" stopColor="#8B3D2A" />
            <stop offset="100%" stopColor="#5C2418" />
          </radialGradient>
          <radialGradient id="grad-multimodal" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#C59F7F" />
            <stop offset="50%" stopColor="#A67C5B" />
            <stop offset="100%" stopColor="#7D593C" />
          </radialGradient>
          <radialGradient id="grad-engineering" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F0C99E" />
            <stop offset="50%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#B08251" />
          </radialGradient>
        </defs>

        {/* 1. Draw connection lines (drawn behind front nodes) */}
        <g>
          {renderedConnections.map((conn) => (
            <g key={conn.key}>
              {/* Backing halo line */}
              <line
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x2}
                y2={conn.y2}
                stroke="#E8E2DB"
                strokeWidth={4}
                strokeLinecap="round"
                opacity={0.3}
              />
              {/* Main glowing connection line */}
              <line
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x2}
                y2={conn.y2}
                stroke="#6B6560"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.35}
              />
              {/* Active animated cyber particles running across paths */}
              <circle r={2.5} fill="#B85C3A" filter="url(#glow-effect)" opacity={0.75}>
                <animateMotion
                  dur="4.5s"
                  repeatCount="indefinite"
                  path={`M ${conn.x1} ${conn.y1} L ${conn.x2} ${conn.y2}`}
                />
              </circle>
            </g>
          ))}
        </g>

        {/* 2. Draw 3D projected spheres sorted back-to-front */}
        <g>
          {depthSortedNodes.map((node) => {
            const isHovered = hoveredNode === node.id
            const baseRadius = 26
            const radius = baseRadius * node.depthScale * (isHovered ? 1.2 : 1)

            return (
              <g
                key={node.id}
                className="cursor-pointer select-none"
                onPointerOver={() => setHoveredNode(node.id)}
                onPointerOut={() => setHoveredNode(null)}
                onClick={() => node.link && router.push(node.link)}
              >
                {/* Glow layer when hovered or active */}
                <circle
                  cx={node.px}
                  cy={node.py}
                  r={radius * 1.6}
                  fill={node.color}
                  opacity={isHovered ? 0.35 : 0.08}
                  filter="url(#glow-effect)"
                  className="transition-all duration-300"
                />

                {/* 3D Sphere outer shell */}
                <circle
                  cx={node.px}
                  cy={node.py}
                  r={radius}
                  fill={`url(#grad-${node.id})`}
                  stroke={isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.25)"}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-200"
                />

                {/* Light reflection gloss to amplify 3D feel */}
                <circle
                  cx={node.px - radius * 0.25}
                  cy={node.py - radius * 0.25}
                  r={radius * 0.25}
                  fill="#ffffff"
                  opacity={0.35}
                  className="transition-all duration-200"
                />

                {/* Node Text Label with smart perspective-scaled sizing */}
                <text
                  x={node.px}
                  y={node.py + radius + 20}
                  textAnchor="middle"
                  fill="#2A2A2A"
                  fontSize={11.5 * node.depthScale}
                  fontWeight="bold"
                  className="pointer-events-none select-none opacity-95 transition-all duration-200"
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* 3. Scalable dynamic Tooltip overlayed via percentage positioning */}
      {hoveredNodeData && hoveredNodeProjected && (
        <div
          className="absolute pointer-events-none bg-white/95 backdrop-blur-md border border-hairline rounded-lg px-4 py-2.5 shadow-xl transition-all duration-150 ease-out"
          style={{
            left: `${(hoveredNodeProjected.px / 800) * 100}%`,
            top: `${(hoveredNodeProjected.py / 600) * 100 - 9}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-center min-w-[140px]">
            <p className="text-xs font-bold text-[#2A2A2A] tracking-wide">
              {hoveredNodeData.label}
            </p>
            <p className="text-[11px] text-[#6B6560] mt-1 whitespace-nowrap">
              {hoveredNodeData.description}
            </p>
            {hoveredNodeData.link && (
              <p className="text-[10px] text-[#B85C3A] mt-1.5 font-semibold animate-pulse">
                点击进入演示领域
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Text, Html } from "@react-three/drei"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import * as THREE from "three"

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
    position: [0, 2, 0],
    color: "#8b5cf6",
    link: "/demos/prompt-optimizer",
    description: "提示词工程与模型优化",
  },
  {
    id: "rag",
    label: "RAG",
    position: [-3, 0, 0],
    color: "#3b82f6",
    link: "/demos/rag-decision",
    description: "检索增强生成系统",
  },
  {
    id: "agent",
    label: "Agent",
    position: [3, 0, 0],
    color: "#10b981",
    link: "/demos/multi-agent",
    description: "智能体协作系统",
  },
  {
    id: "multimodal",
    label: "多模态",
    position: [-2, -2, 0],
    color: "#f59e0b",
    description: "跨模态理解与生成",
  },
  {
    id: "engineering",
    label: "工程化",
    position: [2, -2, 0],
    color: "#ec4899",
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

function Node({ data }: { data: NodeData }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    if (data.link) {
      router.push(data.link)
    }
  }

  return (
    <group position={data.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      <Text
        position={[0, -0.9, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {data.label}
      </Text>

      {hovered && (
        <Html center distanceFactor={8}>
          <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg px-4 py-2 shadow-lg pointer-events-none">
            <p className="text-sm font-medium text-foreground whitespace-nowrap">{data.description}</p>
            {data.link && <p className="text-xs text-primary mt-1">点击查看演示</p>}
          </div>
        </Html>
      )}
    </group>
  )
}

function Connection({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#4b5563" opacity={0.3} transparent linewidth={2} />
    </line>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />

      {connections.map(([startId, endId], index) => {
        const startNode = nodes.find((n) => n.id === startId)
        const endNode = nodes.find((n) => n.id === endId)
        if (!startNode || !endNode) return null
        return <Connection key={index} start={startNode.position} end={endNode.position} />
      })}

      {nodes.map((node) => (
        <Node key={node.id} data={node} />
      ))}
    </>
  )
}

export default function AIKnowledgeGraph() {
  return (
    <Canvas className="w-full h-full">
      <Scene />
    </Canvas>
  )
}

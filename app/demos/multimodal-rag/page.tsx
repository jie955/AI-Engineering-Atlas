"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  XCircle,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Image as ImageIcon,
  Table as TableIcon,
  Layers,
  LineChart,
  Grid,
  Info,
  Sliders,
  Database,
  Eye,
  BookOpen,
  Zap,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

// --- HIGH-FIDELITY PRESET QA DATA ---
const presets = [
  {
    query: "2025年Q3中，华东区的净利润环比增长率是多少？",
    legacy: {
      score: 35,
      retrievalSuccess: false,
      answer: "抱歉，根据已知文本上下文，未找到华东地区2025年Q3净利润的环比增长率。由于财务报告中的表格排版混乱错位，且折线图（image_02.png）在纯文本流中完全不可读，Q3数据全损缺失，导致无法进行相关环比计算。",
      chunks: [
        { id: "leg-1", type: "text", content: "2025年企业财务汇报。我们对华东和华南两个大区进行了全面的审计。以下是数据详情表格...", contextRange: "文档顶部段落 (Naively Split)" },
        { id: "leg-2", type: "text", content: "季度 华东利润 华南利润 Q1 120k Q2 140k Q3 待定 Q4 待定", contextRange: "排版混乱的表格切片 (Context Lost)" },
        { id: "leg-3", type: "text", content: "关于环比计算的说明。请参考汇报中的折线图走势，折线图显示了下半年的显著反弹趋势...", contextRange: "孤立无上下文切片 (No image parsed)" }
      ]
    },
    advanced: {
      score: 98,
      retrievalSuccess: true,
      answer: "2025年Q3中，华东区的净利润为 **¥185,000**，其环比增长率为 **+32.1%**（从 Q2 的 ¥140,000 增长至 Q3 的 ¥185,000）。此项数据已通过多模态混合解析流成功从排版复杂的财务报表及图表 `image_02.png` 中提取，并与 Late Chunking 全局特征对齐完成双重校验。",
      chunks: [
        { id: "adv-1", type: "text", content: "2025年企业财务汇报。我们对华东和华南两个大区进行了全面的审计。以下是数据详情表格...", contextRange: "Late Chunking (携带全局注意力语义)" },
        { id: "adv-2", type: "table", content: "| 季度 | 华东区净利润 | 华南区净利润 | 环比增长 (华东) |\n|---|---|---|---|\n| Q1 | ¥120,000 | ¥150,000 | 基期 |\n| Q2 | ¥140,000 | ¥160,000 | +16.7% |\n| Q3 | ¥185,000 | ¥175,000 | +32.1% |\n| Q4 | ¥210,000 | ¥190,000 | +13.5% |", contextRange: "OCR-Table 视觉网格物理结构还原" },
        { id: "adv-3", type: "vision", content: "[Vision Caption]: 成功定位 image_02.png 并解析折线图：华东区折线在Q3的斜率明显变陡，标注数值为 +32.1%，对应的 Y 轴绝对值为 18.5万，与表格Q3数据完美对齐。", contextRange: "联合多模态语义对齐" }
      ]
    }
  },
  {
    query: "下半年华东区与华南区的财务走势对比分析",
    legacy: {
      score: 42,
      retrievalSuccess: false,
      answer: "财务报告中的下半年（Q3与Q4）表格由于存在单元格合并，传统解析流仅能抓取到“Q1 120k”与“Q2 140k”。对于Q3和Q4，纯文本切片中显示为缺失，折线图走势提示为“image_02.png”而无法加载。因此无法在下半年维度上对两大区进行对齐对比。",
      chunks: [
        { id: "leg-2", type: "text", content: "季度 华东利润 华南利润 Q1 120k Q2 140k Q3 待定 Q4 待定", contextRange: "断裂表格碎片" },
        { id: "leg-3", type: "text", content: "折线图显示了下半年的显著反弹趋势，华东表现优于华南...", contextRange: "无量化指标切片" }
      ]
    },
    advanced: {
      score: 96,
      retrievalSuccess: true,
      answer: "在2025年下半年，**华东区**展现出极其强劲的反弹与领跑之势。其净利润从Q2的 ¥140,000 增长 32.1% 达到 Q3 的 **¥185,000**，并于 Q4 达到 **¥210,000** 的全年峰值；而**华南区**下半年则保持稳健攀升，Q3 利润为 **¥175,000**，Q4 利润为 **¥190,000**。该分析通过视觉大模型对折线图（`image_02.png`）的趋势拟合，与 OCR 提取出的完整结构化表格数据进行了交叉校验，数据可信度极高。",
      chunks: [
        { id: "adv-2", type: "table", content: "| 季度 | 华东区净利润 | 华南区净利润 | 环比增长 (华东) |\n| Q3 | ¥185,000 | ¥175,000 | +32.1% |\n| Q4 | ¥210,000 | ¥190,000 | +13.5% |", contextRange: "OCR-Table 视觉单元格重构" },
        { id: "adv-3", type: "vision", content: "[Vision Caption]: 折线图 image_02.png 显示下半年华东区（绿色实线）以陡峭斜率上升，于 Q3 交叉并超越华南区（橙色虚线），并在 Q4 达到顶峰 21万。走势数据与还原出的财务表格完全一致。", contextRange: "多模态向量联合映射" }
      ]
    }
  },
  {
    query: "是否存在因为表格合并单元格导致的数据盲区？",
    legacy: {
      score: 20,
      retrievalSuccess: false,
      answer: "是的，存在严重的数据盲区。由于财务报表中的 Q3 为跨行/跨列合并单元格，传统解析器（如 PDFMiner）在提取时无法重建表头与网格关系，导致 Q3 的数值被截断丢失。同时由于没有视觉感知能力，无法理解 image_02.png 图表，导致 Q3 与 Q4 的关键增长数据彻底成为盲区。",
      chunks: [
        { id: "leg-2", type: "text", content: "季度 华东利润 华南利润 Q1 120k Q2 140k Q3 待定 Q4 待定", contextRange: "排版混乱的表格切片" }
      ]
    },
    advanced: {
      score: 99,
      retrievalSuccess: true,
      answer: "在**多模态混合解析流**下不存在任何数据盲区。通过 Layout-Aware 定位技术，系统自动在 PDF 原件中将该表格标记为视觉重点块，调用表格还原算法（OCR-Table Reconstruction）补全了合并单元格的逻辑层级关系，精准找回了原本会丢失的 Q3 华东 ¥185,000 与华南 ¥175,000 的真实数据。此外，通过多模态 Late Chunking，使得检索单元自带文档的整体元数据，完全避免了传统分块导致的数据孤岛现象。",
      chunks: [
        { id: "adv-2", type: "table", content: "[Table Boundary Recovered]: 通过坐标反投影与线框检测，将合并单元格 Q3 (合并项) 分解并还原为两条物理记录，保留华东 ¥185,000 和华南 ¥175,000 的独立单元格对齐。", contextRange: "Layout Bounding Box 物理反投" },
        { id: "adv-1", type: "text", content: "2025年企业财务汇报... 华东和华南两个大区进行了全面的审计...", contextRange: "Late Chunking (防数据孤岛编码)" }
      ]
    }
  }
]

export default function MultimodalRagPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<"legacy" | "advanced">("advanced")
  const [testQuery, setTestQuery] = useState(presets[0].query)
  const [isSearching, setIsSearching] = useState(false)
  const [searchCompleted, setSearchCompleted] = useState(true)
  const [searchPhase, setSearchPhase] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [pdfMode, setPdfMode] = useState<"raw" | "layout" | "late-chunking">("layout")
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0)

  // Trigger search simulation on query selection
  const handlePresetSelect = (idx: number) => {
    setSelectedPresetIdx(idx)
    setTestQuery(presets[idx].query)
    triggerSearch(presets[idx].query)
  }

  const triggerSearch = (queryText: string) => {
    setIsSearching(true)
    setSearchCompleted(false)
    setSearchPhase(1)

    // Simulating advanced multi-stage pipeline alignment
    const t1 = setTimeout(() => setSearchPhase(2), 300)
    const t2 = setTimeout(() => setSearchPhase(3), 600)
    const t3 = setTimeout(() => setSearchPhase(4), 900)
    const t4 = setTimeout(() => {
      setIsSearching(false)
      setSearchCompleted(true)
      setSearchPhase(0)
    }, 1200)
  }

  const handleRunSearch = () => {
    triggerSearch(testQuery)
  }

  // Fallback solver for user input queries
  const getResponseForQuery = (query: string, strategy: "legacy" | "advanced") => {
    const matchedPreset = presets.find(p => query.includes(p.query) || p.query.includes(query))
    if (matchedPreset) {
      return strategy === "advanced" ? matchedPreset.advanced : matchedPreset.legacy
    }

    if (strategy === "advanced") {
      return {
        score: 88,
        retrievalSuccess: true,
        answer: `[多模态混合解析] 已针对您的提问“${query}”运行全局多模态编码。系统通过 Late Chunking 检索定位到 Q3 财务报表模块与关联走势图 image_02.png，成功还原了复杂的网格结构，并识别出华东地区下半年的强劲环比增长。详细召回数据已在下方切片中展示。`,
        chunks: [
          { id: "custom-adv-1", type: "text", content: `根据全局语义检索到财务汇报文本：本期审计涵盖华东区与华南区，重点评估下半年反弹情况...`, contextRange: "Late Chunking 全局注意力" },
          { id: "custom-adv-2", type: "table", content: `| 季度 | 华东区净利润 | 华南区净利润 |\n| Q3 | ¥185,000 | ¥175,000 |\n| Q4 | ¥210,000 | ¥190,000 |`, contextRange: "OCR-Table 还原" },
          { id: "custom-adv-3", type: "vision", content: `[Vision Caption]: image_02.png (走势折线图) 展示华东区在 Q3 突破拐点，呈现向上陡峭斜率，数值标识为 +32.1%。`, contextRange: "跨模态联合编码" }
        ]
      }
    } else {
      return {
        score: 30,
        retrievalSuccess: false,
        answer: `[传统纯文本流] 针对提问“${query}”，传统解析流仅能检索到文本零碎段落。由于无法处理合并单元格以及 image_02.png 图像，大量关键上下文被截断或标记为未知，无法提供完整的业务指标推导。`,
        chunks: [
          { id: "custom-leg-1", type: "text", content: "季度 华东利润 华南利润 Q1 120k Q2 140k ... Q3 待定 ... [图像未处理: image_02.png]", contextRange: "截断纯文本" }
        ]
      }
    }
  }

  const activeOutput = getResponseForQuery(testQuery, selectedStrategy)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-16">
      {/* Editorial Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted text-text-secondary hover:text-text-primary transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-accent-primary/15 text-accent-primary border border-accent-primary/20">
                  RAG Series No.04
                </span>
                <h1 className="text-lg font-bold text-text-primary tracking-tight">多模态 RAG 与高级解析工程</h1>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Layout-Aware (布局感知) 物理切片 · Late Chunking (延迟切片) · 跨模态向量联合召回与推理
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-positive/10 text-status-positive border border-status-positive/20">
              <span className="w-1.5 h-1.5 rounded-full bg-status-positive animate-pulse" />
              ENGINE: ACTIVE
            </span>
            <span className="hidden md:inline px-2.5 py-1 rounded-full bg-muted text-text-secondary border border-border">
              MODEL: GEMINI-2.5-FLASH
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* IA Section 1: Hero Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-5 rounded-xl border border-border relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2.5 text-text-secondary mb-2">
              <TableIcon className="w-4 h-4 text-accent-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">表格逻辑恢复率</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-accent-primary font-mono text-display">100%</span>
              <span className="text-xs text-text-secondary">vs 35% (传统文本流)</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
              Layout Bounding Box 网格对齐还原，完美恢复合并单元格中的隐藏逻辑。
            </p>
          </div>

          <div className="bg-card p-5 rounded-xl border border-border relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-status-positive/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2.5 text-text-secondary mb-2">
              <Layers className="w-4 h-4 text-status-positive" />
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">长语境关联留存</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-status-positive font-mono text-display">+180%</span>
              <span className="text-xs text-text-secondary">Late Chunking 词嵌入</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
              不截断注意力矩阵，让切片携带完整文档层级语义，告别碎片数据孤岛。
            </p>
          </div>

          <div className="bg-card p-5 rounded-xl border border-border relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-status-warning/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2.5 text-text-secondary mb-2">
              <LineChart className="w-4 h-4 text-status-warning" />
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">跨模态对齐精度</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-status-warning font-mono text-display">98.4%</span>
              <span className="text-xs text-text-secondary">联合向量映射</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
              将 image_02.png 的走势图坐标与表格文本重合映射，双向提取，双重校验。
            </p>
          </div>
        </div>

        {/* IA Section 2: Core Workspace (Bento Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Columns): Interactive Source Document Canvas */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-1.5 font-mono">
                <FileText className="w-4 h-4" />
                I. 混合源文档物理快照
              </h2>
              <Badge variant="outline" className="text-[10px] text-text-secondary border-border bg-card">
                CONFIDENTIAL A4
              </Badge>
            </div>

            <Card className="bg-card border-border overflow-hidden shadow-sm relative">
              {/* Document View Controllers */}
              <div className="bg-muted/75 border-b border-border p-2 flex items-center justify-between">
                <span className="text-[10px] font-mono font-medium text-text-secondary px-2">
                  VIEW MODE:
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={pdfMode === "raw" ? "secondary" : "ghost"}
                    onClick={() => setPdfMode("raw")}
                    className={`h-7 text-[10px] font-medium px-2.5 ${
                      pdfMode === "raw" ? "bg-card text-text-primary border border-border/40" : "text-text-secondary"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    原件
                  </Button>
                  <Button
                    size="sm"
                    variant={pdfMode === "layout" ? "secondary" : "ghost"}
                    onClick={() => setPdfMode("layout")}
                    className={`h-7 text-[10px] font-medium px-2.5 ${
                      pdfMode === "layout" ? "bg-card text-accent-primary border border-border/40" : "text-text-secondary"
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5 mr-1 text-accent-primary" />
                    布局解析框
                  </Button>
                  <Button
                    size="sm"
                    variant={pdfMode === "late-chunking" ? "secondary" : "ghost"}
                    onClick={() => setPdfMode("late-chunking")}
                    className={`h-7 text-[10px] font-medium px-2.5 ${
                      pdfMode === "late-chunking" ? "bg-card text-status-positive border border-border/40" : "text-text-secondary"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 mr-1 text-status-positive" />
                    全局编码
                  </Button>
                </div>
              </div>

              {/* Physical Paper Page Mockup */}
              <div className="p-6 bg-white min-h-[560px] relative text-neutral-800 font-serif leading-relaxed text-xs shadow-inner">
                {/* Paper header watermarks */}
                <div className="border-b border-neutral-200 pb-2 mb-4 font-mono text-[9px] text-neutral-400 flex justify-between uppercase tracking-wider">
                  <span>CONFIDENTIAL INTERNAL USE ONLY</span>
                  <span>Doc ID: GR-2025-09</span>
                </div>

                {/* Paper Body */}
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight font-sans mb-3 text-center">
                  2025年度企业财务中期汇报与资产走势
                </h3>
                
                <p className="text-[11px] mb-4 text-justify text-neutral-600">
                  我们对华东和华南两个大区进行了全面的审计。以下是数据详情表格。本期重点观察下半年度，由于合并结算导致的账面资产调整。请参考本报告附带的折线图走势。
                </p>

                {/* Interactive Bounding Box for Table Block */}
                <div className={`p-2.5 my-4 rounded border transition-all duration-300 relative ${
                  pdfMode === "layout" 
                    ? "border-accent-primary bg-accent-primary/5 shadow-sm" 
                    : pdfMode === "late-chunking"
                    ? "border-status-positive/30 bg-status-positive/5"
                    : "border-neutral-200 bg-neutral-50/50"
                }`}>
                  {/* Bounding Box Label */}
                  {pdfMode === "layout" && (
                    <div className="absolute -top-2.5 -left-1 bg-accent-primary text-white font-mono text-[8px] px-1.5 py-0.5 rounded font-bold shadow-sm uppercase tracking-widest animate-fade-in">
                      [Box_01: Grid Table Extractor]
                    </div>
                  )}
                  {pdfMode === "late-chunking" && (
                    <div className="absolute -top-2.5 -left-1 bg-status-positive text-white font-mono text-[8px] px-1.5 py-0.5 rounded font-bold shadow-sm uppercase tracking-widest animate-fade-in">
                      [Chunk_02: Long Attention Span]
                    </div>
                  )}

                  {/* Document Grid Table inside Paper */}
                  <div className="font-mono text-[9px] text-neutral-600 space-y-1">
                    <div className="grid grid-cols-4 border-b border-neutral-300 pb-1 text-neutral-800 font-bold">
                      <span>季度</span>
                      <span>华东利润</span>
                      <span>华南利润</span>
                      <span>环比(华东)</span>
                    </div>
                    <div className="grid grid-cols-4 border-b border-neutral-100 py-1 text-neutral-500">
                      <span>Q1</span>
                      <span>¥120,000</span>
                      <span>¥150,000</span>
                      <span>基期</span>
                    </div>
                    <div className="grid grid-cols-4 border-b border-neutral-100 py-1 text-neutral-500">
                      <span>Q2</span>
                      <span>¥140,000</span>
                      <span>¥160,000</span>
                      <span>+16.7%</span>
                    </div>
                    
                    {/* Merged complex row */}
                    <div className="grid grid-cols-4 py-1.5 bg-status-warning/10 font-bold border-b border-neutral-200">
                      <span className="text-status-warning">Q3 (合并项)</span>
                      <span className="text-neutral-800">¥185,000</span>
                      <span className="text-neutral-500">¥175,000</span>
                      <span className="text-status-warning">+32.1%</span>
                    </div>
                    <div className="grid grid-cols-4 py-1 text-neutral-500">
                      <span>Q4</span>
                      <span>¥210,000</span>
                      <span>¥190,000</span>
                      <span>+13.5%</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] mb-4 text-justify text-neutral-600">
                  从下半年折线走势可以看出，华东区自Q3开始斜率显著陡峭，并最终在Q4实现了整体收益的反超与拉升。
                </p>

                {/* Interactive Bounding Box for Chart Block */}
                <div className={`p-2.5 my-4 rounded border transition-all duration-300 relative ${
                  pdfMode === "layout"
                    ? "border-accent-primary bg-accent-primary/5 shadow-sm"
                    : pdfMode === "late-chunking"
                    ? "border-status-positive/30 bg-status-positive/5"
                    : "border-neutral-200 bg-neutral-50/50"
                }`}>
                  {/* Bounding Box Label */}
                  {pdfMode === "layout" && (
                    <div className="absolute -top-2.5 -left-1 bg-accent-primary text-white font-mono text-[8px] px-1.5 py-0.5 rounded font-bold shadow-sm uppercase tracking-widest animate-fade-in">
                      [Box_02: Vision OCR Caption]
                    </div>
                  )}
                  {pdfMode === "late-chunking" && (
                    <div className="absolute -top-2.5 -left-1 bg-status-positive text-white font-mono text-[8px] px-1.5 py-0.5 rounded font-bold shadow-sm uppercase tracking-widest animate-fade-in">
                      [Chunk_03: Latent Image Descriptor]
                    </div>
                  )}

                  {/* Simulated Chart Container */}
                  <div className="h-32 bg-neutral-50 rounded border border-neutral-200 flex flex-col justify-between p-2">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-1 font-sans text-[8px] text-neutral-500">
                      <span className="flex items-center gap-1 font-bold">
                        <LineChart className="w-3 h-3 text-accent-primary" />
                        华东/华南区利润走势图 (image_02.png)
                      </span>
                      <span>单位: 万元</span>
                    </div>
                    
                    {/* SVG Line Chart in Paper with Earth Tone Accents */}
                    <div className="flex-1 flex items-end justify-between px-6 pb-2 pt-4 relative">
                      {/* Grid guidelines */}
                      <div className="absolute inset-x-0 bottom-2 top-0 flex flex-col justify-between pointer-events-none">
                        <div className="border-b border-neutral-200/50 w-full" />
                        <div className="border-b border-neutral-200/50 w-full" />
                        <div className="border-b border-neutral-200/50 w-full" />
                      </div>

                      <div className="flex flex-col items-center z-10">
                        <span className="text-[8px] text-neutral-400 font-mono">Q1</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 absolute bottom-3.5 left-6" />
                      </div>
                      <div className="flex flex-col items-center z-10">
                        <span className="text-[8px] text-neutral-400 font-mono">Q2</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 absolute bottom-5 left-24" />
                      </div>
                      <div className="flex flex-col items-center z-10">
                        <span className="text-[8px] text-status-warning font-sans font-bold">Q3</span>
                        <div className="w-2 h-2 rounded-full bg-accent-primary absolute bottom-[46px] left-[155px] shadow-[0_0_6px_rgba(184,92,58,0.4)] animate-pulse" />
                      </div>
                      <div className="flex flex-col items-center z-10">
                        <span className="text-[8px] text-neutral-400 font-mono">Q4</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 absolute bottom-14 right-6" />
                      </div>
                      
                      {/* SVG connection lines matching earth tones */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* East Region (Primary Terracotta Line) */}
                        <path d="M 28 92 L 98 86 L 165 44 L 232 30" fill="none" stroke="#B85C3A" strokeWidth="2" />
                        {/* South Region (Secondary Soft Ocher Line) */}
                        <path d="M 28 80 L 98 76 L 165 50 L 232 40" fill="none" stroke="#D4A574" strokeWidth="1.5" strokeDasharray="3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Decorative PDF Footer */}
                <div className="absolute bottom-3 inset-x-6 pt-1 border-t border-neutral-100 flex justify-between items-center font-mono text-[8px] text-neutral-400">
                  <span>PAGE 1 OF 1</span>
                  <span>AUDITED BY BAKER METRICS CO.</span>
                </div>
              </div>
            </Card>

            {/* Late Chunking Technical Blueprint Block */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-accent-primary" />
                切片技术图解 (Chunking Engineering)
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-status-warning flex items-center gap-1 font-mono">
                      ❌ 早期物理切片 (Early Chunking)
                    </span>
                    <span className="text-[9px] font-mono text-text-secondary">Context Fragmented</span>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-relaxed">
                    长文档直接截断为固定 500 Token 碎片。<strong>编码时每个碎片各自独立</strong>。检索“Q3环比”时，对应切片由于丢失了首段的“2025年企业财务”年份主语，最终无法与提问对齐召回。
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-status-positive/5 border border-status-positive/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-status-positive flex items-center gap-1 font-mono">
                      🚀 延迟注意力切片 (Late Chunking)
                    </span>
                    <Badge className="bg-status-positive/10 text-status-positive text-[8px] py-0 px-1.5 border border-status-positive/15">
                      Global Attention
                    </Badge>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-relaxed">
                    <strong>一整篇文档送入 Encoder</strong> 生成关联矩阵，保留全局 Token 注意力交互。在此之上按照物理段落进行边界切片，使得<strong>每个 Chunk 在检索时天然自带上下文元语义</strong>，大幅提升匹配率。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 Columns): Strategy Playground & Evaluation Arena */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Title */}
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-1.5 font-mono">
                <Cpu className="w-4 h-4" />
                II. 评测沙箱与策略对比
              </h2>
              <span className="text-[10px] font-mono text-text-secondary">EVALUATION SANDBOX v2.0</span>
            </div>

            {/* Parsing Strategy Console */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-accent-primary" />
                  解析策略切换控制台
                </CardTitle>
                <CardDescription className="text-xs text-text-secondary">
                  对比传统解析器（PDFMiner等纯文本流）与集成多模态大模型的最新 Late Chunking 检索流在数据对齐上的差异。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 p-1 bg-muted rounded-lg border border-border/40">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedStrategy("legacy")}
                    className={`h-9 text-xs font-semibold rounded-md transition-all ${
                      selectedStrategy === "legacy"
                        ? "bg-white text-text-primary shadow-sm border border-border"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    传统纯文本解析流
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedStrategy("advanced")}
                    className={`h-9 text-xs font-semibold rounded-md transition-all ${
                      selectedStrategy === "advanced"
                        ? "bg-accent-primary text-white shadow-sm hover:bg-accent-deep"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    多模态混合 + Late Chunking
                  </Button>
                </div>

                {/* Parsing Tech Badges based on active strategy */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedStrategy === "advanced" ? (
                    <>
                      <Badge className="bg-status-positive/10 text-status-positive border border-status-positive/20 text-[9px] font-mono">Vision-OCR-Table</Badge>
                      <Badge className="bg-status-positive/10 text-status-positive border border-status-positive/20 text-[9px] font-mono">Late Chunking</Badge>
                      <Badge className="bg-status-positive/10 text-status-positive border border-status-positive/20 text-[9px] font-mono">Dynamic Multi-Modal Mapping</Badge>
                      <Badge className="bg-status-positive/10 text-status-positive border border-status-positive/20 text-[9px] font-mono">Gemini 2.5 Fusion</Badge>
                    </>
                  ) : (
                    <>
                      <Badge className="bg-status-warning/10 text-status-warning border border-status-warning/20 text-[9px] font-mono">Naive Text-Extractor</Badge>
                      <Badge className="bg-status-warning/10 text-status-warning border border-status-warning/20 text-[9px] font-mono">Fixed Sliding Window</Badge>
                      <Badge className="bg-status-warning/10 text-status-warning border border-status-warning/20 text-[9px] font-mono">Pure-Text Tokenizer</Badge>
                      <Badge className="bg-status-warning/10 text-status-warning border border-status-warning/20 text-[9px] font-mono">Image Ignored</Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* QA Evaluation Sandbox */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <Search className="w-4 h-4 text-accent-primary" />
                  RAG 问答模拟评测区
                </CardTitle>
                <CardDescription className="text-xs text-text-secondary">
                  选择下方内置的标准企业审计预置问题，或者输入自定义问句。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                
                {/* Clickable Preset Questions */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider font-mono">
                    标准评估预设问句 (Standard Evaluator Presets)：
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePresetSelect(idx)}
                        className={`text-left p-3 rounded-lg text-xs font-medium transition-all flex items-start justify-between gap-3 border ${
                          selectedPresetIdx === idx
                            ? "border-accent-primary bg-accent-primary/5 text-accent-primary shadow-[0_2px_8px_rgba(184,92,58,0.05)]"
                            : "border-border hover:border-text-secondary/50 hover:bg-muted text-text-primary bg-card"
                        }`}
                      >
                        <span className="flex items-start gap-2">
                          <span className={`font-mono text-[10px] h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                            selectedPresetIdx === idx ? "bg-accent-primary text-white" : "bg-muted text-text-secondary"
                          }`}>
                            0{idx + 1}
                          </span>
                          <span className="leading-relaxed">{preset.query}</span>
                        </span>
                        <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 transition-transform ${
                          selectedPresetIdx === idx ? "transform translate-x-1" : ""
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Query Input Sandbox */}
                <div className="space-y-2.5 pt-2 border-t border-border">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider font-mono">
                    交互式自定义输入 Sandbox：
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                      <input
                        type="text"
                        value={testQuery}
                        onChange={(e) => {
                          setTestQuery(e.target.value)
                          setSelectedPresetIdx(-1) // Clear active preset tag on custom input
                        }}
                        placeholder="输入你的业务问答提问..."
                        className="w-full bg-muted border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary focus:bg-card transition-all placeholder:text-text-secondary/60"
                      />
                    </div>
                    <Button
                      onClick={handleRunSearch}
                      disabled={isSearching}
                      className="bg-accent-primary hover:bg-accent-deep text-white font-semibold text-xs px-4"
                    >
                      {isSearching ? "检索计算中..." : "运行 RAG"}
                    </Button>
                  </div>
                </div>

                {/* Pipeline Execution Animation Indicator */}
                <AnimatePresence mode="wait">
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-muted/70 p-4 rounded-xl border border-border/80 font-mono text-[11px] space-y-3 overflow-hidden shadow-inner"
                    >
                      <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                        <span className="text-accent-primary font-bold animate-pulse flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 animate-spin" />
                          RAG Pipeline Tracer Active
                        </span>
                        <span>[TRACING...]</span>
                      </div>

                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 transition-opacity ${searchPhase >= 1 ? "opacity-100" : "opacity-30"}`}>
                          <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                            searchPhase > 1 ? "bg-status-positive text-white" : "bg-accent-primary text-white animate-pulse"
                          }`}>✓</span>
                          <span className={searchPhase === 1 ? "text-accent-primary font-bold" : "text-text-primary"}>
                            [阶段 1/4] 对齐向量嵌入 (Query Embedded Generation)
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 transition-opacity ${searchPhase >= 2 ? "opacity-100" : "opacity-30"}`}>
                          <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                            searchPhase > 2 ? "bg-status-positive text-white" : searchPhase === 2 ? "bg-accent-primary text-white animate-pulse" : "bg-neutral-300"
                          }`}>{searchPhase > 2 ? "✓" : "2"}</span>
                          <span className={searchPhase === 2 ? "text-accent-primary font-bold" : "text-text-primary"}>
                            [阶段 2/4] 检索 Late Chunking 特征索引 (Dense Indexing Match)
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 transition-opacity ${searchPhase >= 3 ? "opacity-100" : "opacity-30"}`}>
                          <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                            searchPhase > 3 ? "bg-status-positive text-white" : searchPhase === 3 ? "bg-accent-primary text-white animate-pulse" : "bg-neutral-300"
                          }`}>{searchPhase > 3 ? "✓" : "3"}</span>
                          <span className={searchPhase === 3 ? "text-accent-primary font-bold" : "text-text-primary"}>
                            [阶段 3/4] 混合 OCR 与 image_02.png 多模态数据反投影
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 transition-opacity ${searchPhase >= 4 ? "opacity-100" : "opacity-30"}`}>
                          <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                            searchPhase >= 4 ? "bg-accent-primary text-white animate-pulse" : "bg-neutral-300"
                          }`}>4</span>
                          <span className={searchPhase === 4 ? "text-accent-primary font-bold" : "text-text-primary"}>
                            [阶段 4/4] 融合 Rerank 并调用大模型生成答案 (LLM Synthesis)
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search Completed Output Panels */}
                {searchCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-5"
                  >
                    {/* Key Metrics row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3.5 bg-muted rounded-xl border border-border/80">
                        <span className="text-[10px] text-text-secondary font-mono block uppercase">检索置信度得分 (Confidence)：</span>
                        <div className="flex items-baseline gap-1.5 mt-1.5">
                          <span className={`text-2xl font-extrabold font-mono text-display ${
                            activeOutput.retrievalSuccess ? "text-status-positive" : "text-status-warning"
                          }`}>
                            {activeOutput.score}%
                          </span>
                          <span className="text-[9px] text-text-secondary font-mono">
                            {activeOutput.score >= 80 ? "HIGH CONFIDENCE" : "RISK DETECTED"}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-muted rounded-xl border border-border/80">
                        <span className="text-[10px] text-text-secondary font-mono block uppercase">双向跨模态对齐状态：</span>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          {activeOutput.retrievalSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-status-positive" />
                              <span className="text-xs text-status-positive font-bold">校验通过 - 结构无损</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-status-warning" />
                              <span className="text-xs text-status-warning font-bold">校验失败 - 图表全损</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* LLM Generation Answer Box */}
                    <div className="p-4 bg-muted rounded-xl border border-border space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-bold">
                          <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
                          LLM 生成回复 (Model Response)
                        </div>
                        <Badge className={`${
                          activeOutput.retrievalSuccess ? "bg-status-positive/10 text-status-positive" : "bg-status-warning/10 text-status-warning"
                        } text-[9px] border-none font-mono py-0`}>
                          {selectedStrategy.toUpperCase()} STREAM
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-text-primary leading-relaxed font-sans bg-card p-3 rounded-lg border border-border/60">
                        {activeOutput.answer}
                      </div>
                    </div>

                    {/* Recalled Source Chunks */}
                    <div className="space-y-3">
                      <div className="text-xs text-text-secondary font-bold flex items-center gap-1.5 uppercase font-mono">
                        <Database className="w-4 h-4 text-accent-primary" />
                        召回的物理对齐分块 (Retrieved Source Chunks)
                      </div>
                      
                      <div className="space-y-2.5">
                        {activeOutput.chunks.map((chunk, idx) => (
                          <div key={chunk.id} className="p-3.5 bg-card rounded-xl border border-border text-[11px] space-y-3.5 hover:shadow-sm transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-text-secondary font-mono font-bold text-[10px]">
                                [CHUNK_0{idx + 1}]
                              </span>
                              <div className="flex gap-1.5">
                                <Badge variant="outline" className="text-[9px] text-text-secondary border-border/80 font-mono py-0">
                                  {chunk.type.toUpperCase()}
                                </Badge>
                                <Badge className="bg-muted text-text-secondary text-[8.5px] border-none py-0 font-mono">
                                  {chunk.contextRange}
                                </Badge>
                              </div>
                            </div>
                            
                            <pre className="text-text-primary font-mono text-[10px] leading-relaxed break-all whitespace-pre-wrap bg-muted p-2.5 rounded border border-border/50 max-h-48 overflow-y-auto">
                              {chunk.content}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>

        {/* IA Section 3: Engineering Whitepaper (Horizontal Architecture) */}
        <section className="pt-8 border-t border-border">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary font-mono">
              III. 技术架构与工程白皮书 (Technical Architecture)
            </h2>
            <p className="text-xs text-text-secondary mt-1.5">
              解读混合多模态检索底层技术链：布局边界识别、整幅文档注意力关联、混合高维向量空间。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-card rounded-xl border border-border space-y-2.5 hover:shadow-sm transition-shadow">
              <h3 className="text-xs font-bold text-accent-primary flex items-center gap-1.5 uppercase font-mono">
                <Grid className="w-4 h-4" />
                1. Vision Bounding Box (布局提取)
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                利用物理坐标反投影技术，Layout-Aware 会在前置阶段对 PDF 的 A4 画布运行骨架和表格线框识别，获得精确的位置矩阵，从而将原本容易错乱混淆的复杂合并单元格完美保留为 Markdown 结构。
              </p>
            </div>

            <div className="p-5 bg-card rounded-xl border border-border space-y-2.5 hover:shadow-sm transition-shadow">
              <h3 className="text-xs font-bold text-status-positive flex items-center gap-1.5 uppercase font-mono">
                <Layers className="w-4 h-4" />
                2. Late Chunking (延迟全局词嵌入)
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                常规切割无法应对数据和年份关联被无情砍断的情况。Late Chunking 使用整篇输入在自注意力（Self-Attention）生成完整的相关性系数后再物理切断，赋予每个分块全文档级的长文本语境视野。
              </p>
            </div>

            <div className="p-5 bg-card rounded-xl border border-border space-y-2.5 hover:shadow-sm transition-shadow">
              <h3 className="text-xs font-bold text-status-warning flex items-center gap-1.5 uppercase font-mono">
                <Sparkles className="w-4 h-4" />
                3. Cross-Modal Fusion (跨模态对齐)
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                在统一映射的高维多模态向量库内，当检索提问指向趋势时，不仅直接召回带有结构性数据的 Markdown 切片，还能双向匹配到视觉模型描述的折线图，交由大模型完成终极大一统推理。
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

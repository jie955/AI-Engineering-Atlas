import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Compass, ArrowRight } from "lucide-react"

export interface CarrierTechnique {
  n: string
  name: string
  desc: string
  example?: string
  pros?: string[]
  cons?: string[]
  /** 是否为「强覆盖」——已在本页配真演练场，渲染时改用绿色徽章并提示向下查看。 */
  strong?: boolean
}

interface AtlasTechniqueCarrierProps {
  techniques: CarrierTechnique[]
  intro?: string
  /** 是否渲染顶部「关联地图」横幅。若父页面已有反向互链横幅（如 prompt-optimizer），设为 false 仅渲染技术卡片。 */
  showHeader?: boolean
  /** 整体覆盖基调：weak=琥珀色「扩展承载（弱覆盖）」；strong=绿色「已覆盖技术承载（强覆盖）」。 */
  tone?: "weak" | "strong"
}

export function AtlasTechniqueCarrier({
  techniques,
  intro,
  showHeader = true,
  tone = "weak",
}: AtlasTechniqueCarrierProps) {
  const isStrong = tone === "strong"
  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-4">
          <Compass className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                关联 · 提示工程技术全景
              </span>
              <Link
                href="/demos/prompt-engineering-techniques"
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                查看完整技术地图 <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {intro ??
                "本节点承载了 Atlas《提示工程技术全景》中以下原为空白的技术项，现已补充其思想说明与示例。"}
            </p>
          </div>
        </div>
      )}

      <Card className={`p-6 ${isStrong ? "border-emerald-500/30 bg-emerald-500/[0.03]" : "border-amber-500/20 bg-amber-500/[0.03]"}`}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isStrong ? "bg-emerald-500" : "bg-amber-500"}`} />
            {isStrong
              ? "已覆盖技术承载（强覆盖）"
              : showHeader
                ? "扩展技术承载（弱覆盖）"
                : "Atlas 扩展技术承载（新增弱覆盖）"}
          </h3>
          <Badge variant="outline" className={`text-xs ${isStrong ? "border-emerald-500/30 text-emerald-600" : "border-amber-500/30 text-amber-600"}`}>
            {isStrong ? "已覆盖" : "弱 / 泛化"}
          </Badge>
        </div>
        {!showHeader && intro && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{intro}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {techniques.map((t) => (
            <div
              key={t.n}
              className={`p-4 rounded-xl bg-card border space-y-2.5 ${
                t.strong ? "border-emerald-500/40" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono shrink-0 ${
                    t.strong
                      ? "border-emerald-500/30 text-emerald-600"
                      : "border-amber-500/30 text-amber-600"
                  }`}
                >
                  #{t.n}
                </Badge>
                <h4 className="text-sm font-bold text-foreground leading-tight">{t.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              {t.strong && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>强覆盖 · 本节点已配专门承载</span>
                </div>
              )}
              {t.example && (
                <div className="p-3 bg-muted/60 dark:bg-muted/40 rounded-lg border border-border/40 text-[11px] font-mono leading-relaxed text-foreground/90 whitespace-pre-wrap max-h-[140px] overflow-y-auto">
                  {t.example}
                </div>
              )}
              {(t.pros || t.cons) && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40 text-[11px]">
                  {t.pros && (
                    <div>
                      <span className="font-semibold text-emerald-500 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> 优势
                      </span>
                      <ul className="space-y-1 text-muted-foreground">
                        {t.pros.map((p, i) => (
                          <li key={i} className="list-disc list-inside">
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {t.cons && (
                    <div>
                      <span className="font-semibold text-amber-500 flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" /> 局限
                      </span>
                      <ul className="space-y-1 text-muted-foreground">
                        {t.cons.map((c, i) => (
                          <li key={i} className="list-disc list-inside">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

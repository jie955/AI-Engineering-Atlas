import type { RetrievalData, GenerationResult } from "@/lib/rag-logic"

export interface RagState {
  query: string
  retrievalData: RetrievalData
  generationResult: GenerationResult
}

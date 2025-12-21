// src/types/modalidade.ts

export interface Modalidade {
  id: string

  /** Nome da modalidade (ex: Futebol, Atletismo) */
  nome: string

  /** Texto histórico / descritivo */
  historia?: string

  /** URL do pictograma ou ícone */
  pictogramaUrl?: string

  /** Data de criação (ISO string vinda do backend) */
  criadoEm?: string
}

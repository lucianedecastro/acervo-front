// src/types/modalidade.ts

export interface Modalidade {
  id: string
  nome: string

  /** URL pública do pictograma/ícone */
  pictogramaUrl?: string

  /** Texto histórico/descritivo */
  historia?: string

  /** IDs ou metadados das fotos (fase futura) */
  fotos?: unknown[]

  /** ID da foto principal */
  fotoDestaqueId?: string

  /** ISO string vinda do backend (Instant) */
  criadoEm?: string
}

/* =====================================================
   Tipo Modalidade
   Alinhado com Swagger
   ===================================================== */

export interface Modalidade {
  /** ID único */
  id: string

  /** Nome da modalidade */
  nome: string

  /** Slug opcional (quando existir) */
  slug?: string

  /** Texto histórico */
  historia?: string

  /** URL do pictograma */
  pictogramaUrl?: string

  /** Flag de ativação (admin) */
  ativa?: boolean

  /** Auditoria (admin) */
  criadoEm?: string
  atualizadoEm?: string
}

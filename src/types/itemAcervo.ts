/* =====================================================
   Tipos relacionados ao ITEM DE ACERVO
   Alinhado com Swagger (/acervo)
   ===================================================== */

import { Foto } from "./atleta"

/* ==========================
   Status do item
   ========================== */
export type StatusItem =
  | "RASCUNHO"
  | "PUBLICADO"
  | "ARQUIVADO"

/* ==========================
   Item de Acervo (ADMIN / ATLETA)
   ========================== */
export interface ItemAcervo {
  id: string

  titulo: string
  descricao: string

  /**
   * ISO string
   */
  dataAquisicao?: string

  status: StatusItem

  /**
   * Relacionamentos
   */
  atletaId: string
  modalidadeId: string

  /**
   * Galeria (opcional)
   */
  fotos?: Foto[]
}

/* ==========================
   DTO de criação / edição
   ========================== */
export interface ItemAcervoCreateDTO {
  titulo: string
  descricao: string

  atletaId: string
  modalidadeId: string

  dataAquisicao?: string
}

/* ==========================
   DTO público / listagem
   ========================== */
export interface ItemAcervoResponseDTO {
  id: string

  titulo: string
  descricao: string

  status: StatusItem

  /**
   * Dados resolvidos pelo backend
   */
  atletaNome: string
  modalidadeNome: string

  /**
   * Thumb principal
   */
  fotoPrincipalUrl?: string
}

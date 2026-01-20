/* =====================================================
   Tipos relacionados a ATLETA
   Alinhado com Swagger (Público / Atleta / Admin)
   ===================================================== */

/* ==========================
   Foto
   ========================== */
export interface Foto {
  id: string
  url: string
  isDestaque: boolean
}

/* ==========================
   Dashboard do atleta
   GET /dashboard/atleta
   ========================== */
export interface DashboardAtletaDTO {
  totalMeusItens: number
  itensPublicados: number
  itensEmRascunho: number
  itensNoMemorial: number
  totalLicenciamentosVendidos: number
  saldoTotalAtleta: number
}

/* ==========================
   Enums
   ========================== */
export type RoleUsuario = "ROLE_ADMIN" | "ROLE_ATLETA"

export type StatusVerificacaoAtleta =
  | "PENDENTE"
  | "VERIFICADO"
  | "REJEITADO"

export type StatusAtleta =
  | "ATIVO"
  | "INATIVO"
  | "ESPOLIO"

/* ==========================
   Atleta (modelo retornado pela API)
   ========================== */
export interface Atleta {
  id: string

  nome: string
  nomeSocial?: string

  /**
   * ⚠️ Campos sensíveis
   * Só vêm em /atletas/me ou admin
   */
  email?: string
  role?: RoleUsuario

  biografia: string

  /**
   * Array simples (Swagger)
   */
  modalidades: string[]

  statusVerificacao?: StatusVerificacaoAtleta
  statusAtleta?: StatusAtleta

  /**
   * Galeria (pode vir vazia)
   */
  fotos?: Foto[]
}

/* ==========================
   DTO de criação / edição (ADMIN)
   ========================== */
export interface AtletaFormDTO {
  nome: string
  biografia: string
  modalidades: string[]

  /**
   * Fotos atuais
   */
  fotos: Foto[]

  /**
   * Foto destaque
   */
  fotoDestaqueId?: string

  /**
   * Fotos removidas
   */
  fotosRemovidas: string[]
}

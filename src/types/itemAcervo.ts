/* =====================================================
   Tipos relacionados ao ITEM DE ACERVO
   Alinhado com Swagger (/acervo)
   ===================================================== */

/* ==========================
   DTO de Foto (INLINE)
   ========================== */
export interface FotoDTO {
  id?: string
  publicId: string
  legenda?: string
  ehDestaque?: boolean
  url: string
  filename: string;
  autorNomePublico?: string
  licenciamentoPermitido?: boolean
}

/* ==========================
   Status do item
   ========================== */
export type StatusItem =
  | "RASCUNHO"
  | "PUBLICADO"
  | "DISPONIVEL_LICENCIAMENTO"
  | "MEMORIAL"
  | "ARQUIVADO"

/* ==========================
   Tipo do item
   ========================== */
export type TipoItemAcervo =
  | "FOTO"
  | "DOCUMENTO"
  | "VIDEO"
  | "OBJETO"

/* ==========================
   DTO de criação / edição
   ========================== */
export interface ItemAcervoCreateDTO {

  /* ======================
     Conteúdo editorial
     ====================== */
  titulo: string
  descricao: string
  local?: string
  dataOriginal?: string
  procedencia?: string
  fotografoDoador?: string

  /* ======================
     Tipificação
     ====================== */
  tipo: TipoItemAcervo
  status: StatusItem

  /* ======================
     Licenciamento
     ====================== */
  precoBaseLicenciamento?: number
  disponivelParaLicenciamento: boolean
  itemHistorico: boolean
  restricoesUso?: string

  /* ======================
     Relacionamentos
     ====================== */
  modalidadeId: string
  atletasIds: string[]

  /* ======================
     Mídia
     ====================== */
  fotos?: FotoDTO[]

  /* ======================
     Curadoria
     ====================== */
  curadorResponsavel?: string
}

/* ==========================
   DTO de resposta
   ========================== */
export interface ItemAcervoResponseDTO {
  id: string
  titulo: string
  descricao: string
  local?: string
  dataOriginal?: string
  procedencia?: string
  tipo: TipoItemAcervo
  status: StatusItem
  precoBaseLicenciamento?: number
  disponivelParaLicenciamento?: boolean
  itemHistorico?: boolean
  modalidadeId: string
  atletasIds: string[]
  fotos?: FotoDTO[]
  criadoEm: string
  atualizadoEm: string
}

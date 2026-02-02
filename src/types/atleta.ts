/* =====================================================
   TIPOS PARA ATLETA
   Sincronizado com DTOs reais do backend
   ===================================================== */

/* =====================
   ENUMS
   ===================== */

export type CategoriaAtleta = "HISTORICA" | "ATIVA" | "ESPOLIO"

export type StatusVerificacao = "PENDENTE" | "VERIFICADO" | "REJEITADO"

export type StatusAtleta = "ATIVO" | "INATIVO" | "SUSPENSO"

export type TipoChavePix =
  | "CPF"
  | "EMAIL"
  | "TELEFONE"
  | "ALEATORIA"
  | "NENHUM"

/* =====================
   DTO – FOTO DE PERFIL (PÚBLICA)
   ===================== */

export interface FotoPerfilPublicaDTO {
  publicId: string
  url: string
}

/* =====================
   MODELO PRINCIPAL
   ===================== */

export interface Atleta {
  id: string
  nome: string
  nomeSocial?: string
  slug: string
  cpf: string
  email: string
  role: string

  modalidadesIds?: string[] | null
  biografia: string
  categoria: CategoriaAtleta

  contratoAssinado: boolean
  linkContratoDigital?: string
  dataAssinaturaContrato?: string

  statusVerificacao: StatusVerificacao
  observacoesAdmin?: string
  dataVerificacao?: string

  nomeRepresentante?: string
  cpfRepresentante?: string
  vinculoRepresentante?: string

  dadosContato?: string
  tipoChavePix: TipoChavePix
  chavePix: string
  banco: string
  agencia: string
  conta: string
  tipoConta: string

  percentualRepasse: number
  comissaoPlataformaDiferenciada: number

  /**
   * LEGADO — mantido por compatibilidade
   * Pode apontar para hero antigo ou fallback
   */
  fotoDestaqueUrl?: string
  fotoDestaqueId?: string

  /**
   * NOVO — foto de perfil pública (avatar)
   * Usada como fallback visual no frontend
   */
  fotoPerfil?: FotoPerfilPublicaDTO | null

  statusAtleta: StatusAtleta
  criadoEm: string
  atualizadoEm: string
}

/* =====================
   DTO – REGISTRO INICIAL
   (AtletaRegistroDTO)
   ===================== */

export interface AtletaRegistroDTO {
  nome: string
  email: string
  senha: string
  cpf: string
  slug?: string
  categoria: CategoriaAtleta
}

/* =====================
   DTO – CADASTRO / UPDATE
   (AtletaFormDTO)
   ===================== */

export interface AtletaFormDTO {
  nome: string
  nomeSocial?: string
  cpf: string
  email: string
  senha?: string

  modalidades: string[]
  biografia: string
  categoria: CategoriaAtleta

  nomeRepresentante?: string
  cpfRepresentante?: string
  vinculoRepresentante?: string

  contratoAssinado?: boolean
  linkContratoDigital?: string
  dadosContato?: string

  tipoChavePix: TipoChavePix
  chavePix?: string
  banco?: string
  agencia?: string
  conta?: string
  tipoConta?: string

  comissaoPlataformaDiferenciada?: number

  /**
   * LEGADO — não usado no novo fluxo de imagens
   */
  fotoDestaqueId?: string

  statusAtleta?: StatusAtleta
}

/* =====================
   DASHBOARD
   ===================== */

export interface DashboardAtletaDTO {
  totalMeusItens: number
  itensPublicados: number
  itensEmRascunho: number
  itensNoMemorial: number
  totalLicenciamentosVendidos: number
  saldoTotalAtleta: number
}

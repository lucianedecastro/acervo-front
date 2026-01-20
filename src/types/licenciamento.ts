/* =====================================================
   Tipos de Licenciamento e Transações
   Alinhado ao Swagger
   ===================================================== */

export interface SimulacaoLicenciamentoDTO {
  itemAcervoId: string
  tipoUso: string
  valorBruto: number
}

export interface ResultadoSimulacaoDTO {
  valorBruto: number
  percentualAtleta: number
  percentualPlataforma: number
  valorAtleta: number
  valorPlataforma: number
}

export interface EfetivarLicenciamentoDTO {
  itemAcervoId: string
  tipoUso: string
  valorBruto: number
  observacao?: string
}

export interface TransacaoLicenciamento {
  id: string
  atletaId: string
  itemAcervoId: string
  tipoUso: string
  valorBruto: number
  valorAtleta: number
  valorPlataforma: number
  criadoEm: string
}

export interface ExtratoLicenciamentoDTO {
  totalBruto: number
  totalAtleta: number
  totalPlataforma: number
  transacoes: TransacaoLicenciamento[]
}

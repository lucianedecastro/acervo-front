/* =====================================================
   Tipos de Licenciamento e Transações
   Alinhado 100% ao backend atual
   ===================================================== */

export interface SimulacaoLicenciamentoDTO {
  itemAcervoId: string
  atletaId: string
  tipoUso: string
  prazoMeses: number
}

export interface ResultadoSimulacaoDTO {
  itemTitulo: string
  valorTotal: number
  repasseAtleta: number
  comissaoPlataforma: number
  chavePixAtleta: string
}

export interface TransacaoLicenciamentoDTO {
  id: string
  itemAcervoId: string
  atletaId: string
  valorTotal: number
  valorRepasseAtleta: number
  dataTransacao: string
  status: string
  tipoLicenca: string
}

export interface ExtratoLicenciamentoDTO {
  nomeAtleta: string
  saldoTotal: number
  transacoes: TransacaoLicenciamentoDTO[]
}

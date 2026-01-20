export interface ConfiguracaoFiscal {
  id: string

  percentualRepasseAtleta: number
  percentualComissaoPlataforma: number

  observacaoLegal?: string

  atualizadoEm?: string
  atualizadoPor?: string
}

export interface ConfiguracaoFiscalDTO {
  percentualRepasseAtleta: number
  percentualComissaoPlataforma: number
  observacaoLegal?: string
}

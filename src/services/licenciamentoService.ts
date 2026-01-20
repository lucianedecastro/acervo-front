/* =====================================================
   SERVIÇO: LICENCIAMENTO / FINANCEIRO
   Totalmente alinhado ao Swagger
   ===================================================== */

import api from "@/services/api"

/* ======================
   TIPOS
   ====================== */

export interface LicenciamentoDTO {
  id: string
  data: string
  atletaNome: string
  itemTitulo: string
  tipoLicenca: string
  valorBruto: number
  repasseAtleta: number
  status: string
}

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

export interface TransacaoLicenciamento {
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
  transacoes: TransacaoLicenciamento[]
}

/* ======================
   SERVICE
   ====================== */

export const licenciamentoService = {
  /* ===== ATLETA ===== */

  // GET /licenciamento/extrato/atleta/{atletaId}
  async buscarExtratoPorAtleta(atletaId: string): Promise<LicenciamentoDTO[]> {
    const response = await api.get<LicenciamentoDTO[]>(
      `/licenciamento/extrato/atleta/${atletaId}`
    )
    return response.data
  },

  /* ===== ADMIN ===== */

  // GET /licenciamento/extrato/consolidado/{atletaId}
  async buscarExtratoConsolidado(
    atletaId: string
  ): Promise<ExtratoLicenciamentoDTO> {
    const response = await api.get<ExtratoLicenciamentoDTO>(
      `/licenciamento/extrato/consolidado/${atletaId}`
    )
    return response.data
  },

  // GET /licenciamentos
  async listarTodos(): Promise<LicenciamentoDTO[]> {
    const response = await api.get<LicenciamentoDTO[]>("/licenciamentos")
    return response.data
  },

  // GET /licenciamentos/{id}
  async buscarPorId(id: string): Promise<LicenciamentoDTO> {
    const response = await api.get<LicenciamentoDTO>(`/licenciamentos/${id}`)
    return response.data
  },

  /* ===== SIMULAÇÃO ===== */

  // POST /licenciamento/simular
  async simular(
    payload: SimulacaoLicenciamentoDTO
  ): Promise<ResultadoSimulacaoDTO> {
    const response = await api.post<ResultadoSimulacaoDTO>(
      "/licenciamento/simular",
      payload
    )
    return response.data
  },
}

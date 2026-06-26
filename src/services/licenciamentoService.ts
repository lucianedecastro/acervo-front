/* =====================================================
   SERVIÇO: LICENCIAMENTO / FINANCEIRO
   Contrato fiel ao Swagger e Backend
   ===================================================== */

import api from "@/services/api"
import {
  SimulacaoLicenciamentoDTO,
  ResultadoSimulacaoDTO,
  ExtratoLicenciamentoDTO,
  TransacaoLicenciamentoDTO,
} from "@/types/licenciamento"

export const licenciamentoService = {
  /* ======================
     ATLETA
     ====================== */

  // GET /licenciamento/extrato/atleta/{atletaId}
  async buscarExtratoPorAtleta(
    atletaId: string
  ): Promise<TransacaoLicenciamentoDTO[]> {
    const response = await api.get<TransacaoLicenciamentoDTO[]>(
      `/licenciamento/extrato/atleta/${atletaId}`
    )
    return response.data
  },

  /* ======================
     ADMIN
     ====================== */

  // GET /licenciamento/extrato/consolidado/{atletaId}
  async buscarExtratoConsolidado(
    atletaId: string
  ): Promise<ExtratoLicenciamentoDTO> {
    const response = await api.get<ExtratoLicenciamentoDTO>(
      `/licenciamento/extrato/consolidado/${atletaId}`
    )
    return response.data
  },

  /**
   * ⚠️ Esta rota não existe no backend atual (confirmado em
   * 26/06) — o endpoint real para extrato por atleta é
   * /licenciamento/extrato/atleta/{atletaId}, igual a
   * buscarExtratoPorAtleta() acima. Mantida aqui sem uso até
   * decidirmos remover de vez.
   */
  // GET /licenciamento/transacoes/atleta/{atletaId}
  async listarTransacoesPorAtleta(
    atletaId: string
  ): Promise<TransacaoLicenciamentoDTO[]> {
    const response = await api.get<TransacaoLicenciamentoDTO[]>(
      `/licenciamento/transacoes/atleta/${atletaId}`
    )
    return response.data
  },

  /**
   * Lista todas as transações, sem filtro por atleta.
   * Uso exclusivo da visão administrativa geral (AdminVendas).
   */
  // GET /licenciamento/admin/transacoes
  async listarTodasTransacoes(): Promise<TransacaoLicenciamentoDTO[]> {
    const response = await api.get<TransacaoLicenciamentoDTO[]>(
      "/licenciamento/admin/transacoes"
    )
    return response.data
  },

  /* ======================
     SIMULAÇÃO
     ====================== */

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
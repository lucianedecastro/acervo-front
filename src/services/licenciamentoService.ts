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

  // GET /licenciamento/transacoes/atleta/{atletaId}
  async listarTransacoesPorAtleta(
    atletaId: string
  ): Promise<TransacaoLicenciamentoDTO[]> {
    const response = await api.get<TransacaoLicenciamentoDTO[]>(
      `/licenciamento/transacoes/atleta/${atletaId}`
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

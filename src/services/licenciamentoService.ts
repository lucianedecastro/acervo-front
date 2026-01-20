import api from "@/services/api"
import {
  SimulacaoLicenciamentoDTO,
  ResultadoSimulacaoDTO,
  EfetivarLicenciamentoDTO,
  TransacaoLicenciamento,
  ExtratoLicenciamentoDTO,
} from "@/types/licenciamento"

export const licenciamentoService = {
  /* ==========================
     SIMULAÇÃO
     ========================== */
  async simular(
    data: SimulacaoLicenciamentoDTO
  ): Promise<ResultadoSimulacaoDTO> {
    const response = await api.post<ResultadoSimulacaoDTO>(
      "/licenciamento/simular",
      data
    )
    return response.data
  },

  /* ==========================
     EFETIVAÇÃO
     ========================== */
  async efetivar(
    data: EfetivarLicenciamentoDTO
  ): Promise<TransacaoLicenciamento> {
    const response = await api.post<TransacaoLicenciamento>(
      "/licenciamento/efetivar",
      data
    )
    return response.data
  },

  /* ==========================
     EXTRATOS – ATLETA
     ========================== */
  async extratoAtleta(
    atletaId: string
  ): Promise<ExtratoLicenciamentoDTO> {
    const response = await api.get<ExtratoLicenciamentoDTO>(
      `/licenciamento/extrato/atleta/${atletaId}`
    )
    return response.data
  },

  /* ==========================
     EXTRATO CONSOLIDADO – ADMIN
     ========================== */
  async extratoConsolidado(
    atletaId: string
  ): Promise<ExtratoLicenciamentoDTO> {
    const response = await api.get<ExtratoLicenciamentoDTO>(
      `/licenciamento/extrato/consolidado/${atletaId}`
    )
    return response.data
  },
}

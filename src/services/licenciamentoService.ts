import api from "@/services/api";
import {
  SimulacaoLicenciamentoDTO,
  ResultadoSimulacaoDTO,
  EfetivarLicenciamentoDTO,
  TransacaoLicenciamento,
  ExtratoLicenciamentoDTO,
} from "@/types/licenciamento";

export const licenciamentoService = {
  /* ==========================
      SIMULAÇÃO (Imagem 7)
     ========================== */
  async simular(data: SimulacaoLicenciamentoDTO): Promise<ResultadoSimulacaoDTO> {
    const response = await api.post<ResultadoSimulacaoDTO>("/licenciamento/simular", data);
    return response.data;
  },

  /* ==========================
      EFETIVAÇÃO (Imagem 10)
     ========================== */
  async efetivar(data: EfetivarLicenciamentoDTO): Promise<TransacaoLicenciamento> {
    const response = await api.post<TransacaoLicenciamento>("/licenciamento/efetivar", data);
    return response.data;
  },

  /* ==========================
      EXTRATO HISTÓRICO - ATLETA (Imagem 9)
      Retorna um array de transações puras
     ========================== */
  async extratoAtleta(atletaId: string): Promise<TransacaoLicenciamento[]> {
    const response = await api.get<TransacaoLicenciamento[]>(`/licenciamento/extrato/atleta/${atletaId}`);
    return response.data;
  },

  /* ==========================
      EXTRATO CONSOLIDADO - ADMIN (Imagem 5)
      Retorna Objeto com Nome, Saldo e Transações
     ========================== */
  async extratoConsolidado(atletaId: string): Promise<ExtratoLicenciamentoDTO> {
    const response = await api.get<ExtratoLicenciamentoDTO>(`/licenciamento/extrato/consolidado/${atletaId}`);
    return response.data;
  },
};
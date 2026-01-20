/* =====================================================
   SERVIÇO: LICENCIAMENTOS (VENDAS)
   ===================================================== */

import api from "./api";

export interface LicenciamentoDTO {
  id: string;
  data: string;
  atletaNome: string;
  itemTitulo: string;
  tipoLicenca: string;
  valorBruto: number;
  repasseAtleta: number;
  status: string;
}

export const licenciamentoService = {
  /**
   * Mantendo o nome que seus componentes existentes já usam
   * GET /licenciamentos/atleta/{atletaId}
   */
  async buscarExtratoPorAtleta(atletaId: string): Promise<LicenciamentoDTO[]> {
    const response = await api.get<LicenciamentoDTO[]>(`/licenciamentos/atleta/${atletaId}`);
    return response.data;
  },

  /**
   * NOVO: Para a base global administrativa
   * GET /licenciamentos
   */
  async listarTodos(): Promise<LicenciamentoDTO[]> {
    const response = await api.get<LicenciamentoDTO[]>("/licenciamentos");
    return response.data;
  },

  /**
   * GET /licenciamentos/{id}
   */
  async buscarPorId(id: string): Promise<LicenciamentoDTO> {
    const response = await api.get<LicenciamentoDTO>(`/licenciamentos/${id}`);
    return response.data;
  }
};
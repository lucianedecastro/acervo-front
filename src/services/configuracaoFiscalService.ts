import api from "@/services/api";
import {
  ConfiguracaoFiscal,
  ConfiguracaoFiscalDTO,
} from "@/types/configuracaoFiscal";

export const configuracaoFiscalService = {
  /**
   * Busca as taxas fiscais atuais
   * GET /configuracoes/fiscal (Imagem 13)
   */
  async buscar(): Promise<ConfiguracaoFiscal> {
    const response = await api.get<ConfiguracaoFiscal>(
      "/configuracoes/fiscal"
    );
    return response.data;
  },

  /**
   * Atualiza as regras de taxas globais
   * PUT /configuracoes/fiscal (Imagem 14)
   */
  async atualizar(
    data: ConfiguracaoFiscalDTO
  ): Promise<ConfiguracaoFiscal> {
    const response = await api.put<ConfiguracaoFiscal>(
      "/configuracoes/fiscal",
      data
    );
    return response.data;
  },
};
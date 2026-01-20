import api from "@/services/api"
import {
  ConfiguracaoFiscal,
  ConfiguracaoFiscalDTO,
} from "@/types/configuracaoFiscal"

export const configuracaoFiscalService = {
  /**
   * Busca configuração fiscal atual
   * GET /configuracao-fiscal
   */
  async buscar(): Promise<ConfiguracaoFiscal> {
    const response = await api.get<ConfiguracaoFiscal>(
      "/configuracao-fiscal"
    )
    return response.data
  },

  /**
   * Atualiza regras fiscais
   * PUT /configuracao-fiscal
   */
  async atualizar(
    data: ConfiguracaoFiscalDTO
  ): Promise<ConfiguracaoFiscal> {
    const response = await api.put<ConfiguracaoFiscal>(
      "/configuracao-fiscal",
      data
    )
    return response.data
  },
}

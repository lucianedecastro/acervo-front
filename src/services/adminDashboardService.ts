/* =====================================================
   SERVIÇO: ADMIN DASHBOARD
   Funcionalidade: Consolidação de KPIs para o Gestor
   ===================================================== */

import api from "@/services/api";

// Exportação explícita do Tipo conforme sua imagem
export interface AdminDashboardStatsDTO {
  totalAtletas: number;
  totalItensAcervo: number;
  totalModalidades: number;
  itensAguardandoPublicacao: number;
  faturamentoTotalBruto: number;
  totalComissoesPlataforma: number;
}

export const adminDashboardService = {
  /**
   * Busca os indicadores globais para o painel administrativo
   * GET /admin/dashboard/resumo
   */
  async obterResumo(): Promise<AdminDashboardStatsDTO> {
    const response = await api.get<AdminDashboardStatsDTO>("/admin/dashboard/resumo");
    return response.data;
  }
};
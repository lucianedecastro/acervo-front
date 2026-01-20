import api from "@/services/api"

export interface AdminDashboardStatsDTO {
  totalAtletas: number
  totalItensAcervo: number
  totalModalidades: number
  itensAguardandoPublicacao: number
  itensPorTipo: Record<string, number>
  faturamentoTotalBruto: number
  totalComissoesPlataforma: number
}

export const adminDashboardService = {
  async obterResumo(): Promise<AdminDashboardStatsDTO> {
    const response = await api.get<AdminDashboardStatsDTO>("/dashboard/admin")
    return response.data
  },
}

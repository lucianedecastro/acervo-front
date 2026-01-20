/* =====================================================
   SERVIÇO: ATLETA
   Funcionalidade: Gestão de Atletas (Público, Me e Admin)
   ===================================================== */

import api from "@/services/api"
import { Atleta, AtletaUpdateDTO, DashboardAtletaDTO } from "@/types/atleta"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

// Interface para a rota de perfil completa (Swagger)
interface PerfilPublicoResponse {
  atleta: Atleta
  itens: ItemAcervoResponseDTO[]
}

export const atletaService = {
  /* =====================================================
      1. ROTAS PÚBLICAS
     ===================================================== */

  // Lista atletas para vitrine pública
  async listarPublico(): Promise<Atleta[]> {
    const response = await api.get<Atleta[]>("/atletas")
    return response.data
  },

  // Perfil público por slug
  async buscarPerfilPublico(slug: string): Promise<PerfilPublicoResponse> {
    const response = await api.get<PerfilPublicoResponse>(`/atletas/perfil/${slug}`)
    return response.data
  },

  /* =====================================================
      2. VISÃO DA ATLETA LOGADA
     ===================================================== */

  async buscarMeuPerfil(): Promise<Atleta> {
    const response = await api.get<Atleta>("/atletas/me")
    return response.data
  },

  async buscarDashboard(): Promise<DashboardAtletaDTO> {
    const response = await api.get<DashboardAtletaDTO>("/dashboard/atleta")
    return response.data
  },

  /* =====================================================
      3. VISÃO ADMINISTRATIVA
     ===================================================== */

  /**
   * Lista todas as atletas (Admin)
   * ⚠️ IMPORTANTE:
   * O backend NÃO possui /atletas/admin
   * A distinção admin ocorre por ROLE no token
   */
  async listarTodasAdmin(): Promise<Atleta[]> {
    const response = await api.get<Atleta[]>("/atletas")
    return response.data
  },

  async buscarPorId(id: string): Promise<Atleta> {
    const response = await api.get<Atleta>(`/atletas/${id}`)
    return response.data
  },

  async criar(payload: AtletaUpdateDTO): Promise<void> {
    await api.post("/atletas", payload)
  },

  async atualizar(id: string, data: AtletaUpdateDTO): Promise<Atleta> {
    const response = await api.put<Atleta>(`/atletas/${id}`, data)
    return response.data
  },

  /* =====================================================
      4. CURADORIA E VERIFICAÇÃO
     ===================================================== */

  async verificarAtleta(
    id: string,
    status: "PENDENTE" | "VERIFICADO" | "REJEITADO" | "MEMORIAL_PUBLICO",
    observacoes?: string
  ): Promise<Atleta> {
    const response = await api.patch<Atleta>(
      `/atletas/${id}/verificacao`,
      null,
      {
        params: {
          status,
          observacoes: observacoes || undefined,
        },
      }
    )
    return response.data
  },

  async remover(id: string): Promise<void> {
    await api.delete(`/atletas/${id}`)
  },
}

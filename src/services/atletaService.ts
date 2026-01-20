import api from "@/services/api"
import {
  Atleta,
  AtletaFormDTO,
  DashboardAtletaDTO,
} from "@/types/atleta"

/**
 * Serviço de Atletas
 * Alinhado com AtletaController (backend)
 */
export const atletaService = {
  /* ==========================
     ROTAS PÚBLICAS
     ========================== */

  /**
   * GET /atletas
   */
  async listarTodas(): Promise<Atleta[]> {
    const { data } = await api.get<Atleta[]>("/atletas")
    return data
  },

  /**
   * GET /atletas/{id}
   */
  async buscarPorId(id: string): Promise<Atleta> {
    const { data } = await api.get<Atleta>(`/atletas/${id}`)
    return data
  },

  /* ==========================
     ROTAS DA ATLETA LOGADA
     ========================== */

  /**
   * GET /atletas/me
   */
  async buscarMeuPerfil(): Promise<Atleta> {
    const { data } = await api.get<Atleta>("/atletas/me")
    return data
  },

  /**
   * GET /dashboard/atleta
   */
  async buscarDashboard(): Promise<DashboardAtletaDTO> {
    const { data } = await api.get<DashboardAtletaDTO>("/dashboard/atleta")
    return data
  },

  /* ==========================
     ROTAS ADMIN
     ========================== */

  /**
   * POST /atletas
   */
  async criar(payload: AtletaFormDTO): Promise<Atleta> {
    const { data } = await api.post<Atleta>("/atletas", payload)
    return data
  },

  /**
   * PUT /atletas/{id}
   */
  async atualizar(
    id: string,
    payload: AtletaFormDTO
  ): Promise<Atleta> {
    const { data } = await api.put<Atleta>(`/atletas/${id}`, payload)
    return data
  },

  /**
   * DELETE /atletas/{id}
   */
  async remover(id: string): Promise<void> {
    await api.delete(`/atletas/${id}`)
  },
}

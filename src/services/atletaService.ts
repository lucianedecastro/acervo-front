/* =====================================================
   SERVIÇO: ATLETA
   Funcionalidade: Gestão de Atletas (Público, Me e Admin)
   ===================================================== */

import api from "@/services/api"
import {
  Atleta,
  AtletaFormDTO,
  AtletaRegistroDTO,
  DashboardAtletaDTO,
} from "@/types/atleta"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

// Interface para a rota de perfil público (Swagger)
interface PerfilPublicoResponse {
  atleta: Atleta
  itens: ItemAcervoResponseDTO[]
}

export const atletaService = {
  /* =====================================================
      1. ROTAS PÚBLICAS
     ===================================================== */

  async listarPublico(): Promise<Atleta[]> {
    const response = await api.get<Atleta[]>("/atletas")
    return response.data
  },

  async buscarPerfilPublico(slug: string): Promise<PerfilPublicoResponse> {
    const response = await api.get<PerfilPublicoResponse>(
      `/atletas/perfil/${slug}`
    )
    return response.data
  },

  /* =====================================================
      2. REGISTRO (PRIMEIRA INTERAÇÃO)
     ===================================================== */

  async registrar(payload: AtletaRegistroDTO): Promise<void> {
    await api.post("/atletas/registro", payload)
  },

  /* =====================================================
      3. VISÃO DA ATLETA LOGADA
     ===================================================== */

  async buscarMeuPerfil(): Promise<Atleta> {
    const response = await api.get<Atleta>("/atletas/me")
    return response.data
  },

  async buscarDashboard(): Promise<DashboardAtletaDTO> {
    const response = await api.get<DashboardAtletaDTO>("/dashboard/atleta")
    return response.data
  },

  async completarCadastro(payload: AtletaFormDTO): Promise<Atleta> {
    const response = await api.post<Atleta>("/atletas", payload)
    return response.data
  },

  /* =====================================================
      4. VISÃO ADMINISTRATIVA
     ===================================================== */

  async listarTodasAdmin(): Promise<Atleta[]> {
    const response = await api.get<Atleta[]>("/atletas")
    return response.data
  },

  async buscarPorId(id: string): Promise<Atleta> {
    const response = await api.get<Atleta>(`/atletas/${id}`)
    return response.data
  },

  async criar(payload: AtletaFormDTO): Promise<Atleta> {
    const response = await api.post<Atleta>("/atletas", payload)
    return response.data
  },

  async atualizar(id: string, data: AtletaFormDTO): Promise<Atleta> {
    const response = await api.put<Atleta>(`/atletas/${id}`, data)
    return response.data
  },

  /* =====================================================
      5. CURADORIA E VERIFICAÇÃO
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

  /* =====================================================
      6. UPLOADS DE IMAGEM (NOVO FLUXO)
      - NÃO passam pelo form
      - NÃO usam mediaService
     ===================================================== */

  /**
   * Upload da foto de perfil pública (avatar)
   */
  async uploadFotoPerfil(atletaId: string, file: File): Promise<void> {
    const formData = new FormData()
    formData.append("file", file)

    await api.post(`/atletas/${atletaId}/foto-perfil`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  /**
   * Upload da foto de destaque (hero)
   */
  async uploadFotoDestaque(atletaId: string, file: File): Promise<void> {
    const formData = new FormData()
    formData.append("file", file)

    await api.post(`/atletas/${atletaId}/foto-destaque`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
}

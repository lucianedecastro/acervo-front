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
      - Atleta cria conta (nome, email, senha, cpf, categoria)
     ===================================================== */

  async registrar(payload: AtletaRegistroDTO): Promise<void> {
    await api.post("/atletas/registro", payload)
  },

  /* =====================================================
      3. VISÃO DA ATLETA LOGADA
      - Completar cadastro após login
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
      - Criação manual (Histórica / Espólio)
      - Edição técnica completa
     ===================================================== */

  async listarTodasAdmin(): Promise<Atleta[]> {
    const response = await api.get<Atleta[]>("/atletas")
    return response.data
  },

  async buscarPorId(id: string): Promise<Atleta> {
    const response = await api.get<Atleta>(`/atletas/${id}`)
    return response.data
  },

  /**
   * CRIAÇÃO ADMINISTRATIVA
   * Usado para:
   * - Atletas Históricas
   * - Espólios
   * - Inserções curatoriais (acervo 1900+)
   */
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
}

/* =====================================================
   SERVIÇO: ATLETA
   Funcionalidade: Gestão de Atletas (Público, Me e Admin)
   ===================================================== */

import api from "@/services/api";
import { Atleta, AtletaUpdateDTO, DashboardAtletaDTO } from "@/types/atleta";
import { ItemAcervoResponseDTO } from "@/types/itemAcervo";

// Interface para a rota de perfil completa que o Swagger pede (Imagem afe015)
interface PerfilPublicoResponse {
  atleta: Atleta;
  itens: ItemAcervoResponseDTO[];
}

export const atletaService = {
  /* =====================================================
      1. ROTAS PÚBLICAS
     ===================================================== */
  
  // Lista atletas para a vitrine - GET /atletas (Imagem afdfd4)
  async listarPublico(): Promise<Atleta[]> {
    const response = await api.get<Atleta[]>("/atletas");
    return response.data;
  },

  // Busca perfil completo (Dados + Itens) - GET /atletas/perfil/{slug} (Imagem afe015)
  async buscarPerfilPublico(slug: string): Promise<PerfilPublicoResponse> {
    const response = await api.get<PerfilPublicoResponse>(`/atletas/perfil/${slug}`);
    return response.data;
  },

  /* =====================================================
      2. VISÃO DA ATLETA LOGADA (Área Privada)
     ===================================================== */
  
  async buscarMeuPerfil(): Promise<Atleta> {
    const response = await api.get<Atleta>("/atletas/me");
    return response.data;
  },

  async buscarDashboard(): Promise<DashboardAtletaDTO> {
    const response = await api.get<DashboardAtletaDTO>("/dashboard/atleta");
    return response.data;
  },

  /* =====================================================
      3. VISÃO ADMINISTRATIVA
     ===================================================== */
  
  // Lista todas as atletas para o Admin - GET /atletas/admin (Resolve erro bacf84)
  async listarTodasAdmin(): Promise<Atleta[]> {
    const response = await api.get<Atleta[]>("/atletas/admin");
    return response.data;
  },

  // Busca uma atleta por ID para o AtletaForm (Swagger image_a25301)
  async buscarPorId(id: string): Promise<Atleta> {
    const response = await api.get<Atleta>(`/atletas/${id}`);
    return response.data;
  },

  // Cadastro de nova atleta - POST /atletas (Swagger image_bae28b)
  async criar(payload: AtletaUpdateDTO): Promise<void> {
    await api.post("/atletas", payload);
  },

  // Atualização total da atleta - PUT /atletas/{id}
  async atualizar(id: string, data: AtletaUpdateDTO): Promise<Atleta> {
    const response = await api.put<Atleta>(`/atletas/${id}`, data);
    return response.data;
  },

  /* =====================================================
      4. CURADORIA E VERIFICAÇÃO (ACEITE)
     ===================================================== */

  // Aprova ou rejeita verificação - PATCH /atletas/{id}/verificacao (Imagem bae2e7)
  async verificarAtleta(
    id: string, 
    status: "PENDENTE" | "VERIFICADO" | "REJEITADO" | "MEMORIAL_PUBLICO", 
    observacoes?: string
  ): Promise<Atleta> {
    const response = await api.patch<Atleta>(`/atletas/${id}/verificacao`, null, {
      params: { 
        status, 
        observacoes: observacoes || undefined 
      }
    });
    return response.data;
  },

  // Exclusão de atleta - DELETE /atletas/{id}
  async remover(id: string): Promise<void> {
    await api.delete(`/atletas/${id}`);
  }
};
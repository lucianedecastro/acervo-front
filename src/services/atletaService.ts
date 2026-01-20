/* =====================================================
   SERVIÇO: ATLETA
   Funcionalidade: Gestão de Atletas (Público, Me e Admin)
   Alinhado ao Swagger: Imagens a1cbf9, a25301 e ad3063
   ===================================================== */

import api from "@/services/api";
import { Atleta, AtletaUpdateDTO, DashboardAtletaDTO } from "@/types/atleta";

export const atletaService = {
  /* =====================================================
      1. ROTAS PÚBLICAS (Acessíveis por qualquer visitante)
     ===================================================== */
  
  // Lista atletas para a vitrine (Imagem 1.1)
  async listarPublico(): Promise<Atleta[]> {
    const response = await api.get<Atleta[]>("/atletas/public");
    return response.data;
  },

  // Busca detalhe pelo slug para a vitrine pública (Imagem 1.1)
  async buscarPorSlug(slug: string): Promise<Atleta> {
    const response = await api.get<Atleta>(`/atletas/public/${slug}`);
    return response.data;
  },

  /* =====================================================
      2. VISÃO DA ATLETA LOGADA (Área Privada)
     ===================================================== */
  
  // Perfil completo da atleta logada (Swagger image_a1cbf9)
  async buscarMeuPerfil(): Promise<Atleta> {
    const response = await api.get<Atleta>("/atletas/me");
    return response.data;
  },

  // Indicadores do dashboard da atleta (Imagem 1.1)
  async buscarDashboard(): Promise<DashboardAtletaDTO> {
    const response = await api.get<DashboardAtletaDTO>("/dashboard/atleta");
    return response.data;
  },

  /* =====================================================
      3. VISÃO ADMINISTRATIVA (Controle Total)
     ===================================================== */
  
  // Lista todas as atletas para o grid do Admin (Swagger image_a25301)
  async listarTodasAdmin(): Promise<Atleta[]> {
    const response = await api.get<Atleta[]>("/atletas");
    return response.data;
  },

  // Busca uma atleta por ID para o AtletaForm (Swagger image_a25301)
  async buscarPorId(id: string): Promise<Atleta> {
    const response = await api.get<Atleta>(`/atletas/${id}`);
    return response.data;
  },

  // Cadastro de nova atleta - POST /atletas (Resolve erro image_ad1e1f)
  async criar(payload: AtletaUpdateDTO): Promise<void> {
    await api.post("/atletas", payload);
  },

  // Atualização total da atleta - PUT /atletas/{id} (Swagger image_a25301)
  async atualizar(id: string, data: AtletaUpdateDTO): Promise<Atleta> {
    const response = await api.put<Atleta>(`/atletas/${id}`, data);
    return response.data;
  },

  // Validação administrativa (Imagem 1.12)
  async verificarAtleta(id: string, status: "VERIFICADO" | "REJEITADO", observacoes?: string): Promise<void> {
    await api.patch(`/atletas/${id}/verificacao`, { status, observacoes });
  },

  // Exclusão de atleta - DELETE /atletas/{id} (Resolve erro image_aca97a)
  async remover(id: string): Promise<void> {
    await api.delete(`/atletas/${id}`);
  }
};
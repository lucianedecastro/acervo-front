/* =====================================================
   SERVIÇO: MODALIDADE
   Funcionalidade: Gestão de Categorias Esportivas
   Endpoints: Imagens ad92b5, ad927c, ad9241, ad91df
   ===================================================== */

import api from "./api";
import { Modalidade, ModalidadeDTO } from "@/types/modalidade";

export const modalidadeService = {
  /**
   * Lista TODAS as modalidades (ativas e inativas) para o Admin
   * GET /modalidades/admin (Imagem ad92b5)
   */
  async listarAdmin(): Promise<Modalidade[]> {
    const response = await api.get<Modalidade[]>("/modalidades/admin");
    return response.data;
  },

  /**
   * Busca detalhe público pelo Slug (Visitantes)
   * GET /modalidades/slug/{slug} (Imagem ad927c)
   */
  async buscarPorSlug(slug: string): Promise<Modalidade> {
    const response = await api.get<Modalidade>(`/modalidades/slug/${slug}`);
    return response.data;
  },

  /**
   * Busca detalhe completo para o formulário de edição
   * GET /modalidades/{id}
   */
  async buscarPorId(id: string): Promise<Modalidade> {
    const response = await api.get<Modalidade>(`/modalidades/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova modalidade esportiva
   * POST /modalidades (Imagem ad9241)
   */
  async criar(payload: ModalidadeDTO): Promise<Modalidade> {
    const response = await api.post<Modalidade>("/modalidades", payload);
    return response.data;
  },

  /**
   * Atualiza dados de uma modalidade existente
   * PUT /modalidades/{id} (Imagem ad91df)
   */
  async atualizar(id: string, payload: ModalidadeDTO): Promise<Modalidade> {
    const response = await api.put<Modalidade>(`/modalidades/${id}`, payload);
    return response.data;
  },

  /**
   * Remove permanentemente uma modalidade
   * DELETE /modalidades/{id} (Imagem ad9203)
   */
  async remover(id: string): Promise<void> {
    await api.delete(`/modalidades/${id}`);
  }
};
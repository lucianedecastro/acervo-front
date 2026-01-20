/* =====================================================
   SERVIÇO: MODALIDADE
   URLs corrigidas conforme Swagger (Imagens ae919f a ae9241)
   ===================================================== */

import api from "./api";
import { Modalidade, ModalidadeDTO, ModalidadePublicaDTO } from "@/types/modalidade";

export const modalidadeService = {
  /**
   * GET /modalidades
   * Lista modalidades ativas para o público (Vitrine)
   */
  async listarPublico(): Promise<ModalidadePublicaDTO[]> {
    const response = await api.get<ModalidadePublicaDTO[]>("/modalidades");
    return response.data;
  },

  /**
   * GET /modalidades/admin
   * Lista todas as modalidades para gestão do Admin
   */
  async listarAdmin(): Promise<Modalidade[]> {
    const response = await api.get<Modalidade[]>("/modalidades/admin");
    return response.data;
  },

  /**
   * GET /modalidades/slug/{slug}
   * Busca modalidade ativa pelo Slug (URL Amigável)
   */
  async buscarPorSlug(slug: string): Promise<ModalidadePublicaDTO> {
    const response = await api.get<ModalidadePublicaDTO>(`/modalidades/slug/${slug}`);
    return response.data;
  },

  /**
   * GET /modalidades/{id}
   * Busca por ID (Usado em formulários de edição)
   */
  async buscarPorId(id: string): Promise<Modalidade> {
    const response = await api.get<Modalidade>(`/modalidades/${id}`);
    return response.data;
  },

  /**
   * POST /modalidades
   * Cria nova modalidade
   */
  async criar(payload: ModalidadeDTO): Promise<Modalidade> {
    const response = await api.post<Modalidade>("/modalidades", payload);
    return response.data;
  },

  /**
   * PUT /modalidades/{id}
   * Atualiza modalidade existente
   */
  async atualizar(id: string, payload: ModalidadeDTO): Promise<Modalidade> {
    const response = await api.put<Modalidade>(`/modalidades/${id}`, payload);
    return response.data;
  },

  /**
   * DELETE /modalidades/{id}
   * Remove uma modalidade
   */
  async remover(id: string): Promise<void> {
    await api.delete(`/modalidades/${id}`);
  }
};
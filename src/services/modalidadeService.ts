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
   *
   * IMPORTANTE:
   * - Este endpoint é apenas editorial
   * - Uploads de imagens ocorrem em endpoints próprios
   */
  async atualizar(id: string, payload: ModalidadeDTO): Promise<Modalidade> {
    const response = await api.put<Modalidade>(`/modalidades/${id}`, payload);
    return response.data;
  },

  /**
   * POST /modalidades/{id}/foto-destaque/upload
   * Upload da foto de destaque da modalidade
   */
  async uploadFotoDestaque(id: string, file: File): Promise<Modalidade> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<Modalidade>(
      `/modalidades/${id}/foto-destaque/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  /**
   * POST /modalidades/{id}/pictograma/upload
   * Upload do pictograma da modalidade
   *
   * OBS:
   * - Endpoint espelha o fluxo da foto de destaque
   * - Backend decide publicId e persistência
   */
  async uploadPictograma(id: string, file: File): Promise<Modalidade> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<Modalidade>(
      `/modalidades/${id}/pictograma/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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

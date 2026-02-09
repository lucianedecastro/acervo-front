/* =====================================================
   SERVIÇO: ITENS DE ACERVO
   Alinhado com ItemAcervoController (Swagger)
   ===================================================== */

import api from "@/services/api";
// Sincronizado com o seu arquivo de tipos
import { ItemAcervoResponseDTO, ItemAcervoCreateDTO } from "@/types/itemAcervo";

export const itemAcervoService = {
  // GET /acervo - Público
  async listarPublicados(): Promise<ItemAcervoResponseDTO[]> {
    const response = await api.get<ItemAcervoResponseDTO[]>("/acervo");
    return response.data;
  },

  // GET /acervo/admin - Gestor
  async listarAdmin(): Promise<ItemAcervoResponseDTO[]> {
    const response = await api.get<ItemAcervoResponseDTO[]>("/acervo/admin");
    return response.data;
  },

  // NOVO: Necessário para o componente AtletaPerfil.tsx
  async listarPorAtleta(atletaId: string): Promise<ItemAcervoResponseDTO[]> {
    const response = await api.get<ItemAcervoResponseDTO[]>(`/acervo/atleta/${atletaId}`);
    return response.data;
  },

  // POST /acervo - Criação do item
  async criar(payload: ItemAcervoCreateDTO): Promise<ItemAcervoResponseDTO> {
    const response = await api.post<ItemAcervoResponseDTO>("/acervo", payload);
    return response.data;
  },

  // DELETE /acervo/{id} - Remoção do item
  async remover(id: string): Promise<void> {
    await api.delete(`/acervo/${id}`);
  },

  /* =====================================================
     UPLOAD DE IMAGENS DO ITEM (CLOUDINARY + WATERMARK)
     ===================================================== */

  // POST /acervo/upload
  // Upload genérico de imagem (backend aplica watermark e baixa resolução)
  async uploadImagem(file: File): Promise<{
    publicId: string;
    urlVisualizacao: string;
  }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/acervo/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // POST /acervo/{itemId}/fotos
  // Associa a imagem protegida ao item de acervo
  async associarImagem(
    itemId: string,
    payload: {
      publicId: string;
      urlVisualizacao: string;
    }
  ): Promise<void> {
    await api.post(`/acervo/${itemId}/fotos`, payload);
  }
};

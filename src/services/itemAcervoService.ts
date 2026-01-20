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

  async criar(payload: ItemAcervoCreateDTO): Promise<ItemAcervoResponseDTO> {
    const response = await api.post<ItemAcervoResponseDTO>("/acervo", payload);
    return response.data;
  },

  async remover(id: string): Promise<void> {
    await api.delete(`/acervo/${id}`);
  }
};
import api from "./api";
import { 
  ItemAcervo, 
  ItemAcervoCreateDTO, 
  ItemAcervoResponseDTO 
} from "../types/itemAcervo";
import { Foto } from "../types/atleta";

export const itemAcervoService = {
  /* =====================================================
     CONSULTA PÚBLICA
     ===================================================== */

  // GET /acervo - Apenas itens PUBLICADOS 
  listarPublicados: async () => {
    const response = await api.get<ItemAcervoResponseDTO[]>("/acervo");
    return response.data;
  },

  // GET /acervo/{id} - Item específico PUBLICADO 
  buscarPublicadoPorId: async (id: string) => {
    const response = await api.get<ItemAcervoResponseDTO>(`/acervo/${id}`);
    return response.data;
  },

  // GET /acervo/atleta/{atletaId} - Itens de uma atleta específica 
  listarPorAtleta: async (atletaId: string) => {
    const response = await api.get<ItemAcervoResponseDTO[]>(`/acervo/atleta/${atletaId}`);
    return response.data;
  },

  /* =====================================================
     ADMIN / CURADORIA (JWT)
     ===================================================== */

  // GET /acervo/admin - Todos os itens (Rascunho + Publicado) 
  listarTodosAdmin: async () => {
    const response = await api.get<ItemAcervo[]>("/acervo/admin");
    return response.data;
  },

  // POST /acervo - Cria novo item como RASCUNHO 
  criar: async (item: ItemAcervoCreateDTO) => {
    const response = await api.post<ItemAcervo>("/acervo", item);
    return response.data;
  },

  // PUT /acervo/{id} - Atualiza dados do item 
  atualizar: async (id: string, item: ItemAcervoCreateDTO) => {
    const response = await api.put<ItemAcervo>(`/acervo/${id}`, item);
    return response.data;
  },

  // POST /acervo/{id}/publicar - Muda status para PUBLICADO 
  publicar: async (id: string) => {
    const response = await api.post<ItemAcervo>(`/acervo/${id}/publicar`);
    return response.data;
  },

  // DELETE /acervo/{id} - Remove item 
  remover: async (id: string) => {
    await api.delete(`/acervo/${id}`);
  },

  /* =====================================================
     UPLOAD DE FOTO COM METADADOS
     ===================================================== */

  /**
   * POST /acervo/{id}/fotos
   * Envia multipart/form-data com 'file' e 'metadata' 
   */
  uploadFotoComMetadata: async (itemId: string, file: File, metadata: Partial<Foto>) => {
    const formData = new FormData();
    formData.append("file", file);
    
    // O backend espera um @RequestPart("metadata") que é um FotoDTO 
    const blobMetadata = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    formData.append("metadata", blobMetadata);

    const response = await api.post<Foto>(`/acervo/${itemId}/fotos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
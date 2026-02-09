/* =====================================================
   SERVIÇO: ITENS DE ACERVO
   Alinhado com ItemAcervoController (Swagger)
   ===================================================== */

import api from "@/services/api"
import {
  ItemAcervoResponseDTO,
  ItemAcervoCreateDTO
} from "@/types/itemAcervo"

export const itemAcervoService = {

  /* ======================
     CONSULTAS
     ====================== */

  /**
   * Lista itens públicos do acervo
   * - Utilizado em galerias públicas
   * - Cada item pode conter fotos com publicId e version (Cloudinary)
   */
  async listarPublicados(): Promise<ItemAcervoResponseDTO[]> {
    const response = await api.get("/acervo")
    return response.data
  },

  /**
   * Lista itens para contexto administrativo
   */
  async listarAdmin(): Promise<ItemAcervoResponseDTO[]> {
    const response = await api.get("/acervo/admin")
    return response.data
  },

  /**
   * Lista itens do acervo vinculados a uma atleta específica
   * - Utilizado na visualização de acervo por atleta
   */
  async listarPorAtleta(atletaId: string): Promise<ItemAcervoResponseDTO[]> {
    const response = await api.get(`/acervo/atleta/${atletaId}`)
    return response.data
  },

  /**
   * Busca um item específico pelo ID para exibição detalhada
   * - Necessário para o componente ItemAcervoDetail
   * - O backend deve retornar, nas fotos:
   *   - publicId (Cloudinary)
   *   - version (Cloudinary)
   *   - url (fallback original)
   */
  async obterPorId(id: string): Promise<ItemAcervoResponseDTO> {
    const response = await api.get(`/acervo/${id}`)
    return response.data
  },

  /* ======================
     CRIAÇÃO
     ====================== */

  /**
   * Cria um novo item de acervo
   * - Não realiza upload de mídia
   * - As fotos são adicionadas em etapa posterior
   */
  async criar(payload: ItemAcervoCreateDTO): Promise<ItemAcervoResponseDTO> {
    const response = await api.post("/acervo", payload)
    return response.data
  },

  /* ======================
     PUBLICAÇÃO
     ====================== */

  /**
   * Publica um item do acervo
   * - Torna o item visível em contextos públicos
   */
  async publicar(itemId: string): Promise<void> {
    await api.post(`/acervo/${itemId}/publicar`)
  },

  /* ======================
     REMOÇÃO
     ====================== */

  /**
   * Remove um item do acervo
   * - Uso restrito a contexto administrativo
   */
  async remover(id: string): Promise<void> {
    await api.delete(`/acervo/${id}`)
  },

  /* ======================
     UPLOAD DE IMAGEM
     ====================== */

  /**
   * Adiciona uma foto a um item do acervo
   * - Upload via multipart/form-data
   * - O backend é responsável por:
   *   - Enviar ao Cloudinary
   *   - Persistir publicId, version e url retornados
   */
  async adicionarFoto(
    itemId: string,
    file: File,
    metadata: any
  ): Promise<void> {

    const formData = new FormData()
    formData.append("file", file)
    formData.append("metadata", JSON.stringify(metadata))

    await api.post(`/acervo/${itemId}/fotos`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  }
}

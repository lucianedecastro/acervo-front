import api from "@/services/api"
import {
  ItemAcervo,
  ItemAcervoCreateDTO,
  ItemAcervoResponseDTO,
} from "@/types/itemAcervo"
import { Foto } from "@/types/atleta"

/**
 * Serviço de Itens de Acervo
 * Alinhado com ItemAcervoController (Swagger)
 */
export const itemAcervoService = {
  /* =====================================================
     CONSULTA PÚBLICA
     ===================================================== */

  /**
   * GET /acervo
   */
  async listarPublicados(): Promise<ItemAcervoResponseDTO[]> {
    const { data } = await api.get<ItemAcervoResponseDTO[]>("/acervo")
    return data
  },

  /**
   * GET /acervo/{id}
   */
  async buscarPublicadoPorId(
    id: string
  ): Promise<ItemAcervoResponseDTO> {
    const { data } = await api.get<ItemAcervoResponseDTO>(
      `/acervo/${id}`
    )
    return data
  },

  /**
   * GET /acervo/atleta/{atletaId}
   */
  async listarPorAtleta(
    atletaId: string
  ): Promise<ItemAcervoResponseDTO[]> {
    const { data } = await api.get<ItemAcervoResponseDTO[]>(
      `/acervo/atleta/${atletaId}`
    )
    return data
  },

  /* =====================================================
     ADMIN / CURADORIA
     ===================================================== */

  /**
   * GET /acervo/admin
   */
  async listarTodosAdmin(): Promise<ItemAcervo[]> {
    const { data } = await api.get<ItemAcervo[]>("/acervo/admin")
    return data
  },

  /**
   * GET /acervo/admin/{id}
   */
  async buscarPorIdAdmin(id: string): Promise<ItemAcervo> {
    const { data } = await api.get<ItemAcervo>(
      `/acervo/admin/${id}`
    )
    return data
  },

  /**
   * POST /acervo
   */
  async criar(
    payload: ItemAcervoCreateDTO
  ): Promise<ItemAcervo> {
    const { data } = await api.post<ItemAcervo>(
      "/acervo",
      payload
    )
    return data
  },

  /**
   * PUT /acervo/{id}
   */
  async atualizar(
    id: string,
    payload: ItemAcervoCreateDTO
  ): Promise<ItemAcervo> {
    const { data } = await api.put<ItemAcervo>(
      `/acervo/${id}`,
      payload
    )
    return data
  },

  /**
   * POST /acervo/{id}/publicar
   */
  async publicar(id: string): Promise<ItemAcervo> {
    const { data } = await api.post<ItemAcervo>(
      `/acervo/${id}/publicar`
    )
    return data
  },

  /**
   * DELETE /acervo/{id}
   */
  async remover(id: string): Promise<void> {
    await api.delete(`/acervo/${id}`)
  },

  /* =====================================================
     UPLOAD DE FOTO COM METADADOS
     ===================================================== */

  /**
   * POST /acervo/{id}/fotos
   */
  async uploadFotoComMetadata(
    itemId: string,
    file: File,
    metadata: Partial<Foto>
  ): Promise<Foto> {
    const formData = new FormData()
    formData.append("file", file)

    formData.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      })
    )

    const { data } = await api.post<Foto>(
      `/acervo/${itemId}/fotos`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )

    return data
  },
}

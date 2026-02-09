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

  async listarPublicados(): Promise<ItemAcervoResponseDTO[]> {
    const response = await api.get("/acervo")
    return response.data
  },

  async listarAdmin(): Promise<ItemAcervoResponseDTO[]> {
    const response = await api.get("/acervo/admin")
    return response.data
  },

  async listarPorAtleta(atletaId: string): Promise<ItemAcervoResponseDTO[]> {
    const response = await api.get(`/acervo/atleta/${atletaId}`)
    return response.data
  },

  /* ======================
     CRIAÇÃO
     ====================== */

  async criar(payload: ItemAcervoCreateDTO): Promise<ItemAcervoResponseDTO> {
    const response = await api.post("/acervo", payload)
    return response.data
  },

  /* ======================
     PUBLICAÇÃO
     ====================== */

  async publicar(itemId: string): Promise<void> {
    await api.post(`/acervo/${itemId}/publicar`)
  },

  /* ======================
     REMOÇÃO
     ====================== */

  async remover(id: string): Promise<void> {
    await api.delete(`/acervo/${id}`)
  },

  /* ======================
     UPLOAD DE IMAGEM
     ====================== */

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

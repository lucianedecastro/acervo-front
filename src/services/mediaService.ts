import api from "@/services/api"
import { Foto } from "@/types/atleta"

/**
 * Serviço genérico de upload de mídia
 * A rota é passada dinamicamente
 *
 * Ex:
 * - /acervo/{id}/fotos
 * - /atletas/{id}/foto
 */
export const mediaService = {
  async upload(
    endpoint: string,
    file: File,
    metadata?: Record<string, any>
  ): Promise<Foto> {
    const formData = new FormData()
    formData.append("file", file)

    if (metadata) {
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], {
          type: "application/json",
        })
      )
    }

    const { data } = await api.post<Foto>(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    return data
  },
}

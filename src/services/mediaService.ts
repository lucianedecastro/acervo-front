/* =====================================================
   SERVIÇO: MÍDIA (Upload Genérico)
   Status: Corrigido - Tipagem e Parâmetros Sincronizados
   ===================================================== */

import api from "@/services/api"

/**
 * Interface de resposta para upload de mídia unificado
 */
export interface MediaResponse {
  id: string;
  url: string;
  publicId: string;
}

export const mediaService = {
  /**
   * Realiza o upload de um arquivo para o backend
   * @param file Arquivo vindo do input type="file"
   * @param endpoint Rota opcional (padrão: /media/upload)
   */
  async upload(
    file: File,
    endpoint: string = "/media/upload"
  ): Promise<MediaResponse> {
    const formData = new FormData()
    formData.append("file", file)

    // O backend processa o multipart/form-data e retorna os dados da imagem no Cloudinary
    const { data } = await api.post<MediaResponse>(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    return data
  },
}
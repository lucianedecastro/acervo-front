/* =====================================================
   SERVIÇO: MÍDIA E UPLOAD (CLOUDINARY)
   Sincronizado com Swagger: POST /acervo/upload
   ===================================================== */

import api from "./api";

// Interface baseada na resposta do Swagger
export interface MediaUploadResponse {
  id: string;
  publicId: string;
  url: string;
  filename: string;
  ehDestaque: boolean;
}

export const mediaService = {
  /**
   * Upload de mídia bruta
   * Resolve erro ts(2554) no AtletaForm
   */
  async upload(file: File, endpoint: string = "/acervo/upload"): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<MediaUploadResponse>(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  }
};
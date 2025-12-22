import api from "./api";
import { Foto } from "../types/atleta";

export const mediaService = {
  upload: async (file: File): Promise<Foto> => {
    const formData = new FormData();
    formData.append("file", file);

    // Endpoint esperado no seu backend (ajuste se o nome for diferente)
    const response = await api.post<Foto>("/acervo/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
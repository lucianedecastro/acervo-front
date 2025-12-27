import api from "./api";
import { Atleta, AtletaFormDTO } from "../types/atleta";

export const atletaService = {
  // Chamada pública
  listarTodas: async () => {
    const response = await api.get<Atleta[]>("/atletas");
    return response.data;
  },

  // Chamada pública
  buscarPorId: async (id: string) => {
    const response = await api.get<Atleta>(`/atletas/${id}`);
    return response.data;
  },

  // Chamada protegida (Admin)
  criar: async (atleta: AtletaFormDTO) => {
    const response = await api.post<Atleta>("/atletas", atleta);
    return response.data;
  },

  // Chamada protegida (Admin)
  atualizar: async (id: string, atleta: AtletaFormDTO) => {
    const response = await api.put<Atleta>(`/atletas/${id}`, atleta);
    return response.data;
  },

  // Chamada protegida (Admin)
  remover: async (id: string) => {
    return await api.delete(`/atletas/${id}`);
  },
};
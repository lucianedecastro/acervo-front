import api from "@/services/api"
import { Modalidade } from "@/types/modalidade"

export interface ModalidadeInput {
  nome: string
  historia?: string
  pictogramaUrl?: string
}

export const ModalidadeService = {
  listar(): Promise<Modalidade[]> {
    return api.get("/modalidades").then(res => res.data)
  },

  buscarPorId(id: string): Promise<Modalidade> {
    return api.get(`/modalidades/${id}`).then(res => res.data)
  },

  criar(data: ModalidadeInput): Promise<Modalidade> {
    return api.post("/modalidades", data).then(res => res.data)
  },

  atualizar(id: string, data: ModalidadeInput): Promise<Modalidade> {
    return api.put(`/modalidades/${id}`, data).then(res => res.data)
  },

  remover(id: string): Promise<void> {
    return api.delete(`/modalidades/${id}`)
  }
}

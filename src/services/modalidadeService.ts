import api from "./api"
import { Modalidade } from "../types/modalidade"

/**
 * Serviço de Modalidades
 * Alinhado com o backend (ModalidadeController)
 */
export const modalidadeService = {
  /**
   * Lista todas as modalidades (rota pública)
   * GET /modalidades
   */
  listar(): Promise<Modalidade[]> {
    return api.get<Modalidade[]>("/modalidades")
      .then(response => response.data)
  },

  /**
   * Busca modalidade por ID (rota pública)
   * GET /modalidades/{id}
   */
  buscarPorId(id: string): Promise<Modalidade> {
    return api.get<Modalidade>(`/modalidades/${id}`)
      .then(response => response.data)
  },

  /**
   * Cria nova modalidade (rota ADMIN – JWT)
   * POST /modalidades
   */
  criar(data: {
    nome: string
    historia?: string
    pictogramaUrl?: string
  }): Promise<Modalidade> {
    return api.post<Modalidade>("/modalidades", data)
      .then(response => response.data)
  },

  /**
   * Atualiza modalidade existente (rota ADMIN – JWT)
   * PUT /modalidades/{id}
   */
  atualizar(
    id: string,
    data: {
      nome: string
      historia?: string
      pictogramaUrl?: string
    }
  ): Promise<Modalidade> {
    return api.put<Modalidade>(`/modalidades/${id}`, data)
      .then(response => response.data)
  },

  /**
   * Remove modalidade (rota ADMIN – JWT)
   * DELETE /modalidades/{id}
   */
  remover(id: string): Promise<void> {
    return api.delete(`/modalidades/${id}`)
      .then(() => undefined)
  }
}

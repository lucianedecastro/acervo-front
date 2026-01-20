import api from "./api"
import { Modalidade } from "@/types/modalidade"

/**
 * DTOs explícitos (Swagger-aligned)
 */
export interface ModalidadeCreateDTO {
  nome: string
  historia?: string
  pictogramaUrl?: string
}

export interface ModalidadeUpdateDTO extends ModalidadeCreateDTO {
  ativa?: boolean
}

/**
 * Serviço de Modalidades
 */
export const modalidadeService = {
  /**
   * GET /modalidades (pública)
   */
  async listar(): Promise<Modalidade[]> {
    const { data } = await api.get<Modalidade[]>("/modalidades")
    return data
  },

  /**
   * GET /modalidades/{id} (pública)
   */
  async buscarPorId(id: string): Promise<Modalidade> {
    const { data } = await api.get<Modalidade>(`/modalidades/${id}`)
    return data
  },

  /**
   * POST /modalidades (ADMIN)
   */
  async criar(payload: ModalidadeCreateDTO): Promise<Modalidade> {
    const { data } = await api.post<Modalidade>("/modalidades", payload)
    return data
  },

  /**
   * PUT /modalidades/{id} (ADMIN)
   */
  async atualizar(
    id: string,
    payload: ModalidadeUpdateDTO
  ): Promise<Modalidade> {
    const { data } = await api.put<Modalidade>(
      `/modalidades/${id}`,
      payload
    )
    return data
  },

  /**
   * DELETE /modalidades/{id} (ADMIN)
   * Backend retorna 204
   */
  async remover(id: string): Promise<void> {
    await api.delete(`/modalidades/${id}`)
  },
}

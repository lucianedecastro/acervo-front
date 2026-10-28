import api from "./api"

export type CategoriaFotografa = "ATIVA" | "HISTORICA" | "ESPOLIO"

export interface FotografaRegistroDTO {
  nome: string
  nomeSocial?: string
  email: string
  senha: string
  cpf?: string
  biografia?: string
  registroProfissional?: string
  linkRedeSocialPrincipal?: string
  categoria: CategoriaFotografa
}

export const fotografaService = {
  /**
   * POST /fotografas/cadastro
   * Autocadastro público: a conta nasce pendente de aprovação pela curadoria.
   */
  async registrar(payload: FotografaRegistroDTO): Promise<void> {
    await api.post("/fotografas/cadastro", payload)
  },
}

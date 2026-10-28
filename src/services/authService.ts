import api from "./api"

export const authService = {
  /**
   * POST /auth/esqueci-senha
   * A API responde sempre igual, exista ou não a conta.
   */
  async esqueciSenha(email: string): Promise<void> {
    await api.post("/auth/esqueci-senha", { email })
  },

  /**
   * POST /auth/redefinir-senha
   * Usa o token recebido por e-mail (link de uso único, válido por 1 hora).
   */
  async redefinirSenha(token: string, novaSenha: string): Promise<void> {
    await api.post("/auth/redefinir-senha", { token, novaSenha })
  },
}

import { AxiosError } from "axios"

/**
 * Traduz erros da API de cadastro em uma mensagem para o usuário.
 * - 409: e-mail/CPF já cadastrado
 * - 400: primeiro campo inválido informado pela API
 */
export function mensagemErroCadastro(err: unknown): string {
  const resposta = (err as AxiosError<{ error?: string; campos?: Record<string, string> }>)?.response

  if (resposta?.status === 409) {
    return "Já existe um cadastro com este e-mail, CPF ou nome. Tente fazer login."
  }

  if (resposta?.status === 400) {
    const campos = resposta.data?.campos
    const primeiro = campos ? Object.entries(campos)[0] : undefined
    if (primeiro) return `${primeiro[0]}: ${primeiro[1]}`
    if (resposta.data?.error) return resposta.data.error
  }

  return "Não foi possível concluir o cadastro. Tente novamente em instantes."
}

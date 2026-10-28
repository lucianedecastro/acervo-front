import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { AxiosError } from "axios"
import { Lock } from "lucide-react"
import PasswordInput from "@/components/PasswordInput"
import { authService } from "@/services/authService"

const inputClass =
  "w-full pl-10 pr-11 py-3 border border-acl-line rounded-sm text-sm bg-white focus:outline-none focus:border-acl-gold-deep transition-colors"

export default function RedefinirSenha() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get("token") ?? ""

  const [senha, setSenha] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (senha !== confirmar) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)
    try {
      await authService.redefinirSenha(token, senha)
      alert("Senha redefinida com sucesso. Faça login com a nova senha.")
      navigate("/login", { replace: true })
    } catch (err) {
      const resposta = (err as AxiosError<{ error?: string; campos?: Record<string, string> }>).response
      if (resposta?.status === 400) {
        const campo = resposta.data?.campos ? Object.values(resposta.data.campos)[0] : undefined
        setError(campo ?? resposta.data?.error ?? "Link inválido ou expirado.")
      } else {
        setError("Não foi possível redefinir a senha agora. Tente novamente em instantes.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-acl-cream py-12 px-4 sm:px-6">
      <div className="w-full max-w-md card-editorial p-6 sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink mb-2">Nova senha</h1>
          <p className="text-acl-muted text-sm">Escolha uma nova senha para acessar sua conta.</p>
        </div>

        {!token ? (
          <div className="space-y-6 text-center" role="alert">
            <p className="text-sm text-acl-wine">
              Link inválido. Peça uma nova redefinição de senha.
            </p>
            <Link to="/esqueci-senha" className="btn-secondary-light inline-block">
              Pedir novo link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-acl-ink-soft mb-2">Nova senha (mínimo de 8 caracteres)</label>
              <div className="relative">
                <Lock className="z-10 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted" size={16} />
                <PasswordInput value={senha} onChange={e => setSenha(e.target.value)} required minLength={8}
                               maxLength={72} autoComplete="new-password" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-acl-ink-soft mb-2">Confirmar nova senha</label>
              <div className="relative">
                <Lock className="z-10 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted" size={16} />
                <PasswordInput value={confirmar} onChange={e => setConfirmar(e.target.value)} required
                               minLength={8} maxLength={72} autoComplete="new-password" className={inputClass} />
              </div>
            </div>

            {error && (
              <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3" role="alert">
                <p className="text-acl-wine text-sm text-center">{error}</p>
                {error.toLowerCase().includes("link") && (
                  <p className="text-center mt-2">
                    <Link to="/esqueci-senha" className="text-sm underline text-acl-wine">Pedir novo link</Link>
                  </p>
                )}
              </div>
            )}

            <button type="submit" disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

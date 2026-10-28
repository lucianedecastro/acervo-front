import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail } from "lucide-react"
import { authService } from "@/services/authService"

export default function EsqueciSenha() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await authService.esqueciSenha(email.trim())
      setEnviado(true)
    } catch {
      setError("Não foi possível enviar o pedido agora. Tente novamente em instantes.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-acl-cream py-12 px-4 sm:px-6">
      <div className="w-full max-w-md card-editorial p-6 sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink mb-2">Recuperar senha</h1>
          <p className="text-acl-muted text-sm">
            Informe o e-mail da sua conta e enviaremos um link para escolher uma nova senha.
          </p>
        </div>

        {enviado ? (
          <div className="space-y-6 text-center" role="status">
            <p className="text-sm text-acl-ink-soft">
              Se o e-mail estiver cadastrado, você receberá as instruções em instantes. Confira
              também a caixa de spam. O link vale por 1 hora.
            </p>
            <Link to="/login" className="btn-secondary-light inline-block">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-acl-ink-soft mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border border-acl-line rounded-sm text-sm bg-white focus:outline-none focus:border-acl-gold-deep transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3" role="alert">
                <p className="text-acl-wine text-sm text-center">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Enviando..." : "Enviar link de redefinição"}
            </button>

            <p className="text-center text-sm text-acl-ink-soft">
              <Link to="/login" className="underline hover:text-acl-gold-deep">Voltar ao login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

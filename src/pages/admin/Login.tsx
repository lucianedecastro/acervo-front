import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/services/api"
import { useAuth } from "@/auth/AuthContext"
import { Lock, Mail } from "lucide-react"

interface LoginResponse {
  token: string
}

export default function Login() {
  const navigate = useNavigate()
  const { login, role, isAuthenticated, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated && role) {
      if (role === "ROLE_ADMIN") {
        navigate("/admin", { replace: true })
      } else if (role === "ROLE_ATLETA") {
        navigate("/dashboard/atleta", { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    }
  }, [isAuthenticated, role, navigate, isLoading])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data } = await api.post<LoginResponse>("/auth/login", {
        email,
        senha,
      })

      if (!data?.token) {
        throw new Error("Token não retornado")
      }

      login(data.token)
    } catch (err: any) {
      console.error("Erro no login:", err)
      if (err.response?.status === 401) {
        setError("Email ou senha inválidos.")
      } else {
        setError("Erro ao realizar login.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-acl-cream px-4">
        <div className="text-center">
          <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
          <p className="text-sm text-acl-muted">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-acl-cream py-12 px-4 sm:px-6">
      <div className="w-full max-w-md card-editorial p-6 sm:p-8">

        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink mb-2">
            Acesso ao acervo
          </h1>
          <p className="text-acl-muted text-sm">
            Entre com suas credenciais para gerenciar seu acervo.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-xs text-acl-ink-soft mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted"
                size={16}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-acl-line rounded-sm text-sm bg-white focus:outline-none focus:border-acl-gold-deep transition-colors"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xs text-acl-ink-soft mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-acl-muted"
                size={16}
              />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 border border-acl-line rounded-sm text-sm bg-white focus:outline-none focus:border-acl-gold-deep transition-colors"
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3">
              <p className="text-acl-wine text-sm text-center">
                {error}
              </p>
            </div>
          )}

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <p className="text-xs text-acl-muted">
            * Acesso restrito a atletas e administradores cadastrados.
          </p>
        </footer>
      </div>
    </div>
  )
}
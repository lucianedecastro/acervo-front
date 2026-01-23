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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black uppercase mb-2 sm:mb-3 tracking-tight">
            Acesso ao Acervo
          </h1>
          <p className="text-gray-600 font-bold text-sm sm:text-base">
            Entre com suas credenciais para gerenciar seu acervo.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
                strokeWidth={2.5}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full pl-10 sm:pl-12 pr-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
              Senha
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
                strokeWidth={2.5}
              />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 sm:pl-12 pr-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-500 border-4 border-black rounded-lg p-3 sm:p-4">
              <p className="text-white font-black uppercase text-xs sm:text-sm text-center">
                {error}
              </p>
            </div>
          )}

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-[#D4A244] text-black font-black uppercase text-sm sm:text-base border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        {/* Footer */}
        <footer className="mt-5 sm:mt-6 text-center">
          <p className="text-xs text-gray-600 font-semibold">
            * Acesso restrito a atletas e administradores cadastrados.
          </p>
        </footer>
      </div>
    </div>
  )
}

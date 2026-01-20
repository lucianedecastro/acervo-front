import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "@/services/api"
import { useAuth } from "@/auth/AuthContext"

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

  /* ==========================
     REDIRECT APÓS LOGIN
     ========================== */
  useEffect(() => {
    // Se ainda está carregando o estado de auth, não redireciona ainda
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

  /* ==========================
     SUBMIT
     ========================== */
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
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Carregando...</p>
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "420px", margin: "0 auto" }}>
      <h1>Acesso ao Acervo</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            style={{ width: '100%', padding: '8px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Senha</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px' }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  )
}
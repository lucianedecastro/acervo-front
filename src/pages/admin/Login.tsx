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
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <main style={containerStyle}>
      <div style={cardStyle}>
        <header style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.8rem", color: "#111", marginBottom: "0.5rem" }}>
            Acesso ao Acervo
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Entre com suas credenciais para gerenciar seu acervo.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              style={inputStyle}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            style={loading ? { ...buttonStyle, opacity: 0.7, cursor: 'not-allowed' } : buttonStyle}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <footer style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.8rem", color: "#888", lineHeight: "1.4" }}>
            * Acesso restrito a atletas e administradores cadastrados.
          </p>
        </footer>
      </div>
    </main>
  )
}

/* =========================
   ESTILOS (CSS-IN-JS)
   ========================= */

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 1.5rem",
  minHeight: "70vh", // Garante que fique centralizado verticalmente na área útil
}

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "#fff",
  padding: "2.5rem",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  border: "1px solid #eee",
}

const inputGroupStyle: React.CSSProperties = {
  marginBottom: "1.2rem",
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
  fontWeight: "500",
  color: "#444",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  outline: "none",
  transition: "border-color 0.2s",
}

const errorStyle: React.CSSProperties = {
  color: "#d93025",
  fontSize: "0.85rem",
  marginBottom: "1rem",
  textAlign: "center",
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.9rem",
  backgroundColor: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.2s",
  marginTop: "0.5rem",
}
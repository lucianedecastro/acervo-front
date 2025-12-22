import { useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "@/services/api"
import { useAuth } from "@/auth/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const response = await api.post("/admin/login", {
        email,
        senha,
      })

      const token = response.data?.token

      if (!token || typeof token !== "string") {
        throw new Error("Token inválido recebido da API")
      }

      login(token)
      setSuccess("Login realizado com sucesso. Redirecionando...")

      // pequeno delay só para UX (feedback visual)
      setTimeout(() => {
        navigate("/admin/modalidades")
      }, 800)

    } catch (err: any) {
      console.error("Erro no login:", err)

      if (err.response?.status === 401) {
        setError("Email ou senha inválidos.")
      } else {
        setError("Erro inesperado ao realizar login. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "420px", margin: "0 auto" }}>
      <h1>Login Administrativo</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: "green", marginBottom: "1rem" }}>
            {success}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  )
}

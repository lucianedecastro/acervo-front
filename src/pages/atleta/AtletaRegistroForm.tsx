import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { CategoriaAtleta } from "@/types/atleta"

export default function AtletaRegistroForm() {
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [cpf, setCpf] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("ATIVA")

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      nome,
      email,
      senha,
      cpf,
      // slug normalmente é gerado no backend
      categoria,
    }

    try {
      await atletaService.registrar(payload)
      alert("Cadastro realizado com sucesso. Faça login para continuar.")
      navigate("/login")
    } catch {
      alert("Erro ao realizar cadastro.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ maxWidth: 480, margin: "0 auto", padding: "2rem" }}>
      <h1>Criar conta de atleta</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
      >
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome completo"
          required
        />

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />

        <input
          value={cpf}
          onChange={e => setCpf(e.target.value)}
          placeholder="CPF"
          required
        />

        <input
          value={senha}
          onChange={e => setSenha(e.target.value)}
          placeholder="Senha"
          type="password"
          required
        />

        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value as CategoriaAtleta)}
        >
          <option value="ATIVA">ATIVA</option>
          <option value="HISTORICA">HISTÓRICA</option>
          <option value="ESPOLIO">ESPÓLIO</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Criando conta..." : "Registrar"}
        </button>
      </form>
    </section>
  )
}

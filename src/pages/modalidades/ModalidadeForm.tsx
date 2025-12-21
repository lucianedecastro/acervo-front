import { useState } from "react"
import { ModalidadeService } from "@/services/modalidadeService"

export function ModalidadeForm() {
  const [nome, setNome] = useState("")
  const [historia, setHistoria] = useState("")
  const [pictogramaUrl, setPictogramaUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await ModalidadeService.criar({
        nome,
        historia,
        pictogramaUrl,
      })

      alert("Modalidade criada com sucesso!")
      setNome("")
      setHistoria("")
      setPictogramaUrl("")
    } catch (err) {
      console.error(err)
      setError("Erro ao criar modalidade.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nova Modalidade</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
      />

      <input
        placeholder="URL do pictograma"
        value={pictogramaUrl}
        onChange={e => setPictogramaUrl(e.target.value)}
      />

      <textarea
        placeholder="História da modalidade"
        value={historia}
        onChange={e => setHistoria(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  )
}

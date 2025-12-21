import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { modalidadeService } from "../../services/modalidadeService"
import { Modalidade } from "../../types/modalidade"

export default function ModalidadeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [historia, setHistoria] = useState("")
  const [pictogramaUrl, setPictogramaUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = Boolean(id)

  /* ==========================
     CARREGAR MODALIDADE (EDIÇÃO)
     ========================== */
  useEffect(() => {
    if (!id) return

    setLoading(true)

    modalidadeService
      .buscarPorId(id)
      .then((data: Modalidade) => {
        setNome(data.nome)
        setHistoria(data.historia || "")
        setPictogramaUrl(data.pictogramaUrl || "")
      })
      .catch((err) => {
        console.error("Erro ao carregar modalidade:", err)
        setError("Erro ao carregar modalidade.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  /* ==========================
     SUBMIT
     ========================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      nome,
      historia,
      pictogramaUrl
    }

    try {
      if (isEdit && id) {
        await modalidadeService.atualizar(id, payload)
      } else {
        await modalidadeService.criar(payload)
      }

      navigate("/admin/modalidades")
    } catch (err) {
      console.error("Erro ao salvar modalidade:", err)
      setError("Erro ao salvar modalidade.")
    } finally {
      setLoading(false)
    }
  }

  /* ==========================
     RENDER
     ========================== */
  return (
    <section>
      <h1>{isEdit ? "Editar Modalidade" : "Nova Modalidade"}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label>URL do pictograma</label>
          <input
            type="text"
            value={pictogramaUrl}
            onChange={(e) => setPictogramaUrl(e.target.value)}
          />
        </div>

        <div>
          <label>História</label>
          <textarea
            value={historia}
            onChange={(e) => setHistoria(e.target.value)}
            rows={6}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </section>
  )
}

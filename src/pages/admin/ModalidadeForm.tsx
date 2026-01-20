import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {
  modalidadeService,
  ModalidadeCreateDTO,
  ModalidadeUpdateDTO,
} from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"

export default function ModalidadeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [historia, setHistoria] = useState("")
  const [pictogramaUrl, setPictogramaUrl] = useState("")
  const [ativa, setAtiva] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = Boolean(id)

  /* ==========================
     CARREGAR (EDIÇÃO)
     ========================== */
  useEffect(() => {
    if (!id) return

    async function carregar() {
      try {
        setLoading(true)

        const data: Modalidade =
          await modalidadeService.buscarPorId(id as string)

        setNome(data.nome)
        setHistoria(data.historia || "")
        setPictogramaUrl(data.pictogramaUrl || "")
        setAtiva(data.ativa !== false)
      } catch (err) {
        console.error("Erro ao carregar modalidade:", err)
        setError("Erro ao carregar modalidade.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [id])

  /* ==========================
     SUBMIT
     ========================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isEdit && id) {
        const payload: ModalidadeUpdateDTO = {
          nome,
          historia,
          pictogramaUrl,
          ativa,
        }

        await modalidadeService.atualizar(id as string, payload)
      } else {
        const payload: ModalidadeCreateDTO = {
          nome,
          historia,
          pictogramaUrl,
        }

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

        {isEdit && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={ativa}
                onChange={(e) => setAtiva(e.target.checked)}
              />
              Modalidade ativa
            </label>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </section>
  )
}

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import { modalidadeService } from "../../services/modalidadeService"
import { Modalidade } from "../../types/modalidade"

export default function ModalidadeDetail() {
  const { id } = useParams<{ id: string }>()
  const [modalidade, setModalidade] = useState<Modalidade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("ID da modalidade não informado.")
      setLoading(false)
      return
    }

    modalidadeService
      .buscarPorId(id)
      .then((data) => {
        setModalidade(data)
      })
      .catch((err) => {
        console.error("Erro ao buscar modalidade:", err)
        setError("Modalidade não encontrada.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <p>Carregando modalidade...</p>
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>
  }

  if (!modalidade) {
    return <p>Modalidade não encontrada.</p>
  }

  return (
    <article>
      <Link to="/modalidades">← Voltar para modalidades</Link>

      <h1>{modalidade.nome}</h1>

      {modalidade.pictogramaUrl && (
        <img
          src={modalidade.pictogramaUrl}
          alt={modalidade.nome}
          style={{ maxWidth: "200px", marginBottom: "1rem" }}
        />
      )}

      {modalidade.historia && (
        <p>{modalidade.historia}</p>
      )}
    </article>
  )
}

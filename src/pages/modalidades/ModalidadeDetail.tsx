import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Modalidade } from "@/types/modalidade"
import { ModalidadeService } from "@/services/modalidadeService"

export function ModalidadeDetail() {
  const { id } = useParams()
  const [modalidade, setModalidade] = useState<Modalidade | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    if (!id) return

    ModalidadeService.buscarPorId(id)
      .then(setModalidade)
      .catch((err) => {
        console.error(err)
        setErro("Modalidade não encontrada.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <p>Carregando modalidade...</p>
  }

  if (erro) {
    return <p style={{ color: "red" }}>{erro}</p>
  }

  if (!modalidade) {
    return <p>Modalidade não encontrada.</p>
  }

  return (
    <article>
      <h1>{modalidade.nome}</h1>

      {modalidade.pictogramaUrl && (
        <img
          src={modalidade.pictogramaUrl}
          alt={`Pictograma da modalidade ${modalidade.nome}`}
          style={{ maxWidth: "200px", marginBottom: "1rem" }}
        />
      )}

      {modalidade.historia && (
        <section>
          <h2>História</h2>
          <p>{modalidade.historia}</p>
        </section>
      )}
    </article>
  )
}

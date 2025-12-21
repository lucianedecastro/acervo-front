import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"

export default function ModalidadesList() {
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    modalidadeService
      .listar()
      .then(setModalidades)
      .catch((err) => {
        console.error("Erro ao carregar modalidades:", err)
        setError("Não foi possível carregar as modalidades.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p>Carregando modalidades...</p>
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>
  }

  return (
    <section>
      <h1>Modalidades</h1>

      {modalidades.length === 0 ? (
        <p>Nenhuma modalidade cadastrada.</p>
      ) : (
        <ul>
          {modalidades.map((modalidade) => (
            <li key={modalidade.id}>
              <Link to={`/modalidades/${modalidade.id}`}>
                {modalidade.nome}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

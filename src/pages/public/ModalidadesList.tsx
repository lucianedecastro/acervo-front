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
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>Modalidades</h1>
      <p>
        Explore as modalidades que compõem o acervo da mulher brasileira no esporte.
      </p>

      {modalidades.length === 0 ? (
        <p>Nenhuma modalidade cadastrada.</p>
      ) : (
        <ul style={{ marginTop: "2rem" }}>
          {modalidades.map((modalidade) => (
            <li key={modalidade.id} style={{ marginBottom: "1rem" }}>
              <Link
                to={`/modalidades/${modalidade.id}`}
                style={{ textDecoration: "none" }}
              >
                <strong>{modalidade.nome}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

import { useEffect, useState } from "react"
import { Modalidade } from "@/types/modalidade"
import { ModalidadeService } from "@/services/modalidadeService"

export function ModalidadesList() {
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    ModalidadeService.listar()
      .then(setModalidades)
      .catch(err => {
        console.error(err)
        setError("Erro ao carregar modalidades.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando modalidades...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <section>
      <h1>Modalidades</h1>

      {modalidades.length === 0 ? (
        <p>Nenhuma modalidade cadastrada.</p>
      ) : (
        <ul>
          {modalidades.map(m => (
            <li key={m.id}>
              <strong>{m.nome}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

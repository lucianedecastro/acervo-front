import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { modalidadeService } from "../../services/modalidadeService"
import { Modalidade } from "../../types/modalidade"

export default function AdminModalidades() {
  const navigate = useNavigate()

  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
     CARREGAR MODALIDADES
     ========================== */
  function carregarModalidades() {
    setLoading(true)
    setError(null)

    modalidadeService
      .listar()
      .then(setModalidades)
      .catch((err) => {
        console.error("Erro ao carregar modalidades:", err)
        setError("Erro ao carregar modalidades.")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    carregarModalidades()
  }, [])

  /* ==========================
     REMOVER
     ========================== */
  async function handleRemover(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover esta modalidade?"
    )

    if (!confirmar) return

    try {
      await modalidadeService.remover(id)
      carregarModalidades()
    } catch (err) {
      console.error("Erro ao remover modalidade:", err)
      alert("Erro ao remover modalidade.")
    }
  }

  /* ==========================
     RENDER
     ========================== */
  if (loading) {
    return <p>Carregando modalidades...</p>
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>
  }

  return (
    <section>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Gerenciar Modalidades</h1>

        <button onClick={() => navigate("/admin/modalidades/nova")}>
          + Nova Modalidade
        </button>
      </header>

      {modalidades.length === 0 ? (
        <p>Nenhuma modalidade cadastrada.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Nome</th>
              <th style={{ width: "200px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {modalidades.map((modalidade) => (
              <tr key={modalidade.id}>
                <td>{modalidade.nome}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/admin/modalidades/editar/${modalidade.id}`)
                    }
                  >
                    Editar
                  </button>

                  <button
                    style={{ marginLeft: "0.5rem" }}
                    onClick={() => handleRemover(modalidade.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

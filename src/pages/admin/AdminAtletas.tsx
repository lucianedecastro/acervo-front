import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { atletaService } from "../../services/atletaService"
import { Atleta } from "../../types/atleta"

export default function AdminAtletas() {
  const navigate = useNavigate()

  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
      CARREGAR ATLETAS
     ========================== */
  function carregarAtletas() {
    setLoading(true)
    setError(null)

    atletaService
      .listarTodas()
      .then(setAtletas)
      .catch((err) => {
        console.error("Erro ao carregar atletas:", err)
        setError("Erro ao carregar a lista de atletas.")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    carregarAtletas()
  }, [])

  /* ==========================
      REMOVER
     ========================== */
  async function handleRemover(id: string) {
    if (!id) return

    const confirmar = window.confirm(
      "Tem certeza que deseja remover esta atleta? Esta ação não pode ser desfeita."
    )

    if (!confirmar) return

    try {
      await atletaService.remover(id)
      carregarAtletas()
    } catch (err) {
      console.error("Erro ao remover atleta:", err)
      alert("Erro ao remover atleta.")
    }
  }

  /* ==========================
      RENDER
     ========================== */
  if (loading) {
    return <p>Carregando atletas...</p>
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>
  }

  return (
    <section>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Gerenciar Atletas</h1>

        <button 
          onClick={() => navigate("/admin/atletas/nova")}
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          + Nova Atleta
        </button>
      </header>

      {atletas.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>Nenhuma atleta cadastrada no acervo.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Nome</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Modalidade</th>
              <th style={{ width: "200px", padding: "0.5rem" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {atletas.map((atleta) => (
              <tr key={atleta.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>{atleta.nome}</td>
                <td style={{ padding: "0.5rem" }}>{atleta.modalidade}</td>
                <td style={{ padding: "0.5rem" }}>
                  <button
                    onClick={() =>
                      navigate(`/admin/atletas/editar/${atleta.id}`)
                    }
                  >
                    Editar
                  </button>

                  <button
                    style={{ marginLeft: "0.5rem", color: "red" }}
                    onClick={() => atleta.id && handleRemover(atleta.id)}
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
import { useEffect, useState } from "react"
import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"

export default function AdminAtletas() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarAtletas() {
      try {
        setLoading(true)
        setError(null)

        // Endpoint ADMIN correto
        const data = await atletaService.listarTodasAdmin()
        setAtletas(data)
      } catch (err) {
        console.error("Erro ao carregar atletas:", err)
        setError("Erro ao carregar a lista de atletas.")
      } finally {
        setLoading(false)
      }
    }

    carregarAtletas()
  }, [])

  if (loading) {
    return <div style={{ padding: "2rem" }}>Carregando atletas...</div>
  }

  if (error) {
    return <div style={{ padding: "2rem", color: "red" }}>{error}</div>
  }

  return (
    <section style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Gestão de Atletas</h1>

      {atletas.length === 0 ? (
        <p>Nenhuma atleta cadastrada.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Categoria</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Modalidades</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {atletas.map((atleta) => (
              <tr key={atleta.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{atleta.nome}</td>
                <td style={tdStyle}>{atleta.email}</td>
                <td style={tdStyle}>{atleta.categoria}</td>
                <td style={tdStyle}>{atleta.statusAtleta}</td>
                <td style={tdStyle}>{atleta.modalidadesIds.length ?? 0}</td>
                <td style={tdStyle}>
                  {/* em breve: editar / verificar / remover */}
                  —
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.75rem",
  fontSize: "0.85rem",
  color: "#555",
}

const tdStyle: React.CSSProperties = {
  padding: "0.75rem",
  fontSize: "0.9rem",
}

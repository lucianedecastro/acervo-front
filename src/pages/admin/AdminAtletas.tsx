import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"

export default function AdminAtletas() {
  const navigate = useNavigate()
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
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}
      >
        <h1>Gestão de Atletas</h1>
        {/* Mantendo o padrão de botão de adição caso precise criar uma nova futuramente */}
        <button 
          onClick={() => navigate("/admin/atletas/nova")}
          style={addButtonStyle}
        >
          + Nova Atleta
        </button>
      </header>

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
                {/* CORREÇÃO AQUI: Adicionado ?. para evitar erro se modalidadesIds for null */}
                <td style={tdStyle}>{atleta.modalidadesIds?.length ?? 0}</td>
                <td style={tdStyle}>
                  <button
                    style={actionButtonStyle("#3182ce")}
                    onClick={() => navigate(`/admin/atletas/editar/${atleta.id}`)}
                  >
                    Editar
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

const addButtonStyle: React.CSSProperties = { 
  backgroundColor: "#1a1a1a", 
  color: "white", 
  padding: "0.6rem 1.2rem", 
  border: "none", 
  borderRadius: "4px", 
  cursor: "pointer", 
  fontWeight: "bold" 
}

const actionButtonStyle = (color: string): React.CSSProperties => ({
  backgroundColor: "transparent",
  border: `1px solid ${color}`,
  color: color,
  padding: "0.4rem 0.8rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.8rem"
})

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
/* =====================================================
   GESTÃO DE ATLETAS (ADMIN)
   Funcionalidade: Listagem, Edição e Exclusão
   Alinhado ao Swagger: GET /atletas e DELETE /atletas/{id}
   ===================================================== */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"

export default function AdminAtletas() {
  const navigate = useNavigate()

  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
      CARREGAR ATLETAS (ADMIN)
     ========================== */
  async function carregarAtletas() {
    try {
      setLoading(true)
      setError(null)

      // Chamando o método administrativo que retorna dados completos
      const data = await atletaService.listarTodasAdmin() 
      setAtletas(data)
    } catch (err) {
      console.error("Erro ao carregar atletas:", err)
      setError("Erro ao carregar a lista de atletas.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarAtletas()
  }, [])

  /* ==========================
      REMOVER ATLETA
     ========================== */
  async function handleRemover(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover esta atleta? Esta ação não pode ser desfeita e removerá o acesso dela ao sistema."
    )

    if (!confirmar) return

    try {
      // Certifique-se que o método 'remover' existe no atletaService.ts
      // Se não existir, adicione: remover(id: string) { return api.delete(`/atletas/${id}`); }
      await atletaService.remover(id) 
      alert("Atleta removida com sucesso!")
      carregarAtletas()
    } catch (err) {
      console.error("Erro ao remover atleta:", err)
      alert("Erro ao remover atleta. Verifique se ela possui itens vinculados.")
    }
  }

  /* ==========================
      RENDERIZAÇÃO
     ========================== */
  if (loading) return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Carregando base de atletas...</p>
    </div>
  )

  if (error) return (
    <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
      <p>{error}</p>
      <button onClick={carregarAtletas}>Tentar novamente</button>
    </div>
  )

  return (
    <section style={{ padding: "1rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}
      >
        <h1 style={{ fontSize: "1.8rem", color: "#1a1a1a" }}>Gerenciar Atletas</h1>

        <button 
          onClick={() => navigate("/admin/atletas/nova")}
          style={{
            backgroundColor: "#27ae60",
            color: "white",
            padding: "0.6rem 1.2rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          + Nova Atleta
        </button>
      </header>

      {atletas.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", marginTop: "3rem" }}>
          Nenhuma atleta cadastrada no acervo.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Categoria</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {atletas.map((atleta) => (
                <tr
                  key={atleta.id}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td style={tdStyle}>
                    <strong>{atleta.nome}</strong>
                    <br />
                    <small style={{ color: "#888" }}>{atleta.email}</small>
                  </td>

                  <td style={tdStyle}>
                    <span style={badgeStyle("#e9ecef", "#495057")}>
                      {atleta.categoria}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <span style={badgeStyle(
                      atleta.statusVerificacao === "VERIFICADO" ? "#d4edda" : "#fff3cd",
                      atleta.statusVerificacao === "VERIFICADO" ? "#155724" : "#856404"
                    )}>
                      {atleta.statusVerificacao || "PENDENTE"}
                    </span>
                  </td>

                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button
                      style={actionButtonStyle("#3498db")}
                      onClick={() => navigate(`/admin/atletas/editar/${atleta.id}`)}
                    >
                      Editar
                    </button>

                    <button
                      style={actionButtonStyle("#e74c3c")}
                      onClick={() => handleRemover(atleta.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* ==========================
    ESTILOS AUXILIARES
   ========================== */

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "1rem",
  color: "#444",
  fontSize: "0.9rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em"
}

const tdStyle: React.CSSProperties = {
  padding: "1rem",
  verticalAlign: "middle"
}

const badgeStyle = (bg: string, color: string): React.CSSProperties => ({
  backgroundColor: bg,
  color: color,
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  fontWeight: "bold",
  textTransform: "uppercase"
})

const actionButtonStyle = (color: string): React.CSSProperties => ({
  marginLeft: "0.5rem",
  backgroundColor: "transparent",
  border: `1px solid ${color}`,
  color: color,
  padding: "0.4rem 0.8rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.85rem",
  transition: "all 0.2s"
})
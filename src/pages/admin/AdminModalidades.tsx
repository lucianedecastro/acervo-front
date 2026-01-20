/* =====================================================
   GESTÃO DE MODALIDADES (ADMIN)
   Funcionalidade: Listagem, Edição e Exclusão
   Alinhado ao Swagger: GET /modalidades/admin e DELETE /modalidades/{id}
   ===================================================== */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"

export default function AdminModalidades() {
  const navigate = useNavigate()

  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
      CARREGAR MODALIDADES (ADMIN)
     ========================== */
  async function carregarModalidades() {
    try {
      setLoading(true)
      setError(null)

      // Admin utiliza a rota de listagem completa (ativas e inativas)
      const data = await modalidadeService.listarAdmin() 
      setModalidades(data)
    } catch (err) {
      console.error("Erro ao carregar modalidades administrativas:", err)
      setError("Não foi possível carregar a lista de modalidades.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarModalidades()
  }, [])

  /* ==========================
      REMOVER MODALIDADE
     ========================== */
  async function handleRemover(id: string) {
    const confirmar = window.confirm(
      "Atenção: Remover uma modalidade pode afetar os atletas vinculados. Deseja continuar?"
    )

    if (!confirmar) return

    try {
      // Alinhado ao DELETE /modalidades/{id} (Imagem ad9203)
      await modalidadeService.remover(id) 
      
      // ESTRATÉGIA DE LIMPEZA DE ESTADO LOCAL:
      // Removemos o item da lista visual IMEDIATAMENTE para evitar "fantasmas"
      setModalidades(prev => prev.filter(m => m.id !== id))
      
      alert("Modalidade removida com sucesso!")
    } catch (err) {
      console.error("Erro ao remover modalidade:", err)
      alert("Erro ao remover modalidade. Verifique se existem atletas vinculados ou se o item já foi removido.")
      // Se deu erro, recarregamos a lista oficial do banco para sincronizar
      carregarModalidades()
    }
  }

  /* ==========================
      RENDERIZAÇÃO
     ========================== */
  if (loading) return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <p>Sincronizando base de modalidades...</p>
    </div>
  )

  if (error) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#d93025" }}>
      <p>{error}</p>
      <button onClick={carregarModalidades} style={retryButtonStyle}>Tentar novamente</button>
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
        <h1 style={{ fontSize: "1.8rem", color: "#1a1a1a" }}>Gerenciar Modalidades</h1>

        <button 
          onClick={() => navigate("/admin/modalidades/nova")}
          style={addButtonStyle}
        >
          + Nova Modalidade
        </button>
      </header>

      {modalidades.length === 0 ? (
        <div style={emptyStateStyle}>
          Nenhuma modalidade cadastrada no sistema.
        </div>
      ) : (
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadTrStyle}>
                <th style={thStyle}>Ícone</th>
                <th style={thStyle}>Modalidade / URL</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Gestão</th>
              </tr>
            </thead>
            <tbody>
              {modalidades.map((modalidade) => (
                <tr key={modalidade.id} style={trStyle}>
                  <td style={tdStyle}>
                    {modalidade.pictogramaUrl ? (
                      <img 
                        src={modalidade.pictogramaUrl} 
                        alt={modalidade.nome} 
                        style={pictoStyle} 
                      />
                    ) : (
                      <div style={pictoPlaceholderStyle}>N/A</div>
                    )}
                  </td>
                  
                  <td style={tdStyle}>
                    <strong style={{ color: "#2d3748" }}>{modalidade.nome}</strong>
                    <br />
                    <code style={{ fontSize: "0.75rem", color: "#718096" }}>/{modalidade.slug}</code>
                  </td>

                  <td style={tdStyle}>
                    <span style={badgeStyle(!!modalidade.ativa)}>
                      {modalidade.ativa ? "Ativa" : "Inativa"}
                    </span>
                  </td>

                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button
                      style={actionButtonStyle("#3182ce")}
                      onClick={() => navigate(`/admin/modalidades/editar/${modalidade.id}`)}
                    >
                      Editar
                    </button>

                    <button
                      style={actionButtonStyle("#e53e3e")}
                      onClick={() => handleRemover(modalidade.id)}
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
    ESTILOS
   ========================== */
const addButtonStyle: React.CSSProperties = { backgroundColor: "#1a1a1a", color: "white", padding: "0.7rem 1.4rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem" }
const retryButtonStyle: React.CSSProperties = { marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer", backgroundColor: "#f7fafc", border: "1px solid #cbd5e0", borderRadius: "4px" }
const tableWrapperStyle: React.CSSProperties = { backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflow: "hidden", border: "1px solid #eee" }
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" }
const theadTrStyle: React.CSSProperties = { backgroundColor: "#fafafa", borderBottom: "1px solid #eee" }
const thStyle: React.CSSProperties = { textAlign: "left", padding: "1rem", fontSize: "0.75rem", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }
const trStyle: React.CSSProperties = { borderBottom: "1px solid #f5f5f5" }
const tdStyle: React.CSSProperties = { padding: "1rem", verticalAlign: "middle" }
const pictoStyle: React.CSSProperties = { width: "32px", height: "32px", objectFit: "contain", filter: "grayscale(100%)" }
const pictoPlaceholderStyle: React.CSSProperties = { width: "32px", height: "32px", backgroundColor: "#f5f5f5", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#ccc" }
const badgeStyle = (ativa: boolean): React.CSSProperties => ({ backgroundColor: ativa ? "#e6fffa" : "#fff5f5", color: ativa ? "#2c7a7b" : "#c53030", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" })
const actionButtonStyle = (color: string): React.CSSProperties => ({ marginLeft: "0.5rem", backgroundColor: "transparent", border: `1px solid ${color}`, color: color, padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", transition: "all 0.2s" })
const emptyStateStyle: React.CSSProperties = { padding: "5rem", textAlign: "center", backgroundColor: "#fafafa", borderRadius: "8px", border: "1px dashed #ddd", color: "#999" }
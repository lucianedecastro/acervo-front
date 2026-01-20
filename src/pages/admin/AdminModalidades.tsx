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
      // Certifique-se de que este método existe no modalidadeService.ts
      const data = await modalidadeService.listarAdmin() 
      setModalidades(data)
    } catch (err) {
      console.error("Erro ao carregar modalidades administrativas:", err)
      setError("Não foi possível carregar a lista de modalidades.")
    } finally {
      setLoading(false)
    }
  }

  // CORREÇÃO: Chamando a função correta de modalidades
  useEffect(() => {
    carregarModalidades()
  }, [])

  /* ==========================
      REMOVER MODALIDADE
     ========================== */
  async function handleRemover(id: string) {
    const confirmar = window.confirm(
      "Atenção: Remover uma modalidade pode afetar os itens de acervo vinculados a ela. Deseja continuar?"
    )

    if (!confirmar) return

    try {
      // Alinhado ao DELETE /modalidades/{id} (Imagem ac4748)
      await modalidadeService.remover(id) 
      alert("Modalidade removida com sucesso!")
      carregarModalidades()
    } catch (err) {
      console.error("Erro ao remover modalidade:", err)
      alert("Erro ao remover modalidade. Verifique se existem atletas ou itens vinculados.")
    }
  }

  /* ==========================
      RENDERIZAÇÃO
     ========================== */
  if (loading) return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <p>Carregando base de modalidades...</p>
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
                <th style={thStyle}>Pictograma</th>
                <th style={thStyle}>Nome da Modalidade</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Ações</th>
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
                    <small style={{ color: "#718096" }}>Slug: {modalidade.slug}</small>
                  </td>

                  <td style={tdStyle}>
                    {/* CORREÇÃO: Garantindo o tipo booleano no badge */}
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
    ESTILOS (MANTIDOS)
   ========================== */
const addButtonStyle: React.CSSProperties = { backgroundColor: "#2f855a", color: "white", padding: "0.7rem 1.4rem", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }
const retryButtonStyle: React.CSSProperties = { marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer", backgroundColor: "#f7fafc", border: "1px solid #cbd5e0", borderRadius: "4px" }
const tableWrapperStyle: React.CSSProperties = { backgroundColor: "white", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden", border: "1px solid #edf2f7" }
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" }
const theadTrStyle: React.CSSProperties = { backgroundColor: "#f7fafc", borderBottom: "2px solid #edf2f7" }
const thStyle: React.CSSProperties = { textAlign: "left", padding: "1.2rem 1rem", fontSize: "0.85rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.05em" }
const trStyle: React.CSSProperties = { borderBottom: "1px solid #edf2f7", transition: "background-color 0.2s" }
const tdStyle: React.CSSProperties = { padding: "1rem", verticalAlign: "middle" }
const pictoStyle: React.CSSProperties = { width: "40px", height: "40px", objectFit: "contain", backgroundColor: "#f7fafc", padding: "4px", borderRadius: "4px" }
const pictoPlaceholderStyle: React.CSSProperties = { width: "40px", height: "40px", backgroundColor: "#edf2f7", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#a0aec0" }
const badgeStyle = (ativa: boolean): React.CSSProperties => ({ backgroundColor: ativa ? "#c6f6d5" : "#fed7d7", color: ativa ? "#22543d" : "#822727", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" })
const actionButtonStyle = (color: string): React.CSSProperties => ({ marginLeft: "0.5rem", backgroundColor: "white", border: `1px solid ${color}`, color: color, padding: "0.5rem 0.9rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "500", transition: "all 0.2s" })
const emptyStateStyle: React.CSSProperties = { padding: "4rem", textAlign: "center", backgroundColor: "#f7fafc", borderRadius: "10px", border: "2px dashed #edf2f7", color: "#a0aec0" }
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import {
  Atleta,
  CategoriaAtleta,
  StatusAtleta,
  StatusVerificacao,
} from "@/types/atleta"

/* =====================================================
   LISTAGEM E CURADORIA DE ATLETAS (ADMIN)
   - Exclusão integrada ao backend Java
   - Filtros Estilizados
   ===================================================== */

export default function AdminAtletas() {
  const navigate = useNavigate()
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaAtleta | "ALL">("ALL")
  const [filtroStatus, setFiltroStatus] = useState<StatusAtleta | "ALL">("ALL")
  const [filtroVerificacao, setFiltroVerificacao] = useState<StatusVerificacao | "ALL">("ALL")

  async function carregar() {
    try {
      setLoading(true)
      const data = await atletaService.listarTodasAdmin()
      setAtletas(data)
    } catch (err) { setError("Erro ao sincronizar com o servidor.") }
    finally { setLoading(false) }
  }

  useEffect(() => { carregar() }, [])

  async function handleRemover(id: string, nome: string) {
    if (!window.confirm(`Tem certeza que deseja remover ${nome} do acervo permanentemente?`)) return
    try {
      await atletaService.remover(id)
      carregar() // Recarrega a lista após exclusão
    } catch { alert("Erro ao remover atleta.") }
  }

  const atletasFiltradas = useMemo(() => {
    return atletas.filter((a) => {
      if (filtroCategoria !== "ALL" && a.categoria !== filtroCategoria) return false
      if (filtroStatus !== "ALL" && a.statusAtleta !== filtroStatus) return false
      if (filtroVerificacao !== "ALL" && a.statusVerificacao !== filtroVerificacao) return false
      return true
    })
  }, [atletas, filtroCategoria, filtroStatus, filtroVerificacao])

  if (loading) return <div style={{ padding: "3rem" }}>Sincronizando acervo...</div>

  return (
    <section style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem" }}>Gestão do Acervo</h1>
          <p style={{ color: "#718096" }}>Administração técnica de perfis esportivos</p>
        </div>
        <button onClick={() => navigate("/admin/atletas/nova")} style={btnAddStyle}>+ Nova Atleta</button>
      </header>

      {/* FILTROS */}
      <div style={filterBarContainer}>
        <select style={selectStyle} value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value as any)}>
          <option value="ALL">Todas as Categorias</option>
          <option value="ATIVA">ATIVA</option>
          <option value="HISTORICA">HISTÓRICA</option>
          <option value="ESPOLIO">ESPÓLIO</option>
        </select>
        <select style={selectStyle} value={filtroVerificacao} onChange={e => setFiltroVerificacao(e.target.value as any)}>
          <option value="ALL">Status de Verificação</option>
          <option value="PENDENTE">PENDENTE</option>
          <option value="VERIFICADO">VERIFICADO</option>
        </select>
        <button style={btnResetStyle} onClick={() => { setFiltroCategoria("ALL"); setFiltroStatus("ALL"); setFiltroVerificacao("ALL"); }}>Limpar Filtros</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
        <thead>
          <tr style={{ backgroundColor: "#f7fafc", borderBottom: "2px solid #edf2f7" }}>
            <th style={thStyle}>Nome</th>
            <th style={thStyle}>Categoria</th>
            <th style={thStyle}>Verificação</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {atletasFiltradas.map(a => (
            <tr key={a.id} style={{ borderBottom: "1px solid #edf2f7" }}>
              <td style={tdStyle}><strong>{a.nome}</strong></td>
              <td style={tdStyle}>{a.categoria}</td>
              <td style={tdStyle}>{a.statusVerificacao}</td>
              <td style={tdStyle}>{a.statusAtleta}</td>
              <td style={tdStyle}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => navigate(`/admin/atletas/editar/${a.id}`)} style={btnEditStyle}>Editar</button>
                  <button onClick={() => handleRemover(a.id, a.nome)} style={btnDeleteStyle}>Excluir</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// Estilos
const btnAddStyle: React.CSSProperties = { backgroundColor: "#2d3748", color: "white", padding: "0.75rem 1.5rem", borderRadius: "6px", border: "none", fontWeight: "bold", cursor: "pointer" }
const filterBarContainer: React.CSSProperties = { display: "flex", gap: "1rem", marginBottom: "1.5rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }
const selectStyle: React.CSSProperties = { padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e0", minWidth: "180px" }
const btnResetStyle: React.CSSProperties = { background: "none", border: "none", color: "#3182ce", cursor: "pointer", fontSize: "0.9rem" }
const thStyle: React.CSSProperties = { padding: "1rem", textAlign: "left", fontSize: "0.75rem", color: "#4a5568", textTransform: "uppercase" }
const tdStyle: React.CSSProperties = { padding: "1rem", fontSize: "0.9rem" }
const btnEditStyle: React.CSSProperties = { padding: "0.4rem 0.8rem", background: "#ebf8ff", color: "#3182ce", border: "1px solid #bee3f8", borderRadius: "4px", cursor: "pointer" }
const btnDeleteStyle: React.CSSProperties = { padding: "0.4rem 0.8rem", background: "#fff5f5", color: "#e53e3e", border: "1px solid #fed7d7", borderRadius: "4px", cursor: "pointer" }
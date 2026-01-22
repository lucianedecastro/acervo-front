import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import {
  Atleta,
  CategoriaAtleta,
  StatusAtleta,
  StatusVerificacao,
} from "@/types/atleta"

export default function AdminAtletas() {
  const navigate = useNavigate()

  /* =======================
      ESTADO BASE
     ======================= */
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* =======================
      FILTROS
     ======================= */
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaAtleta | "ALL">("ALL")
  const [filtroStatus, setFiltroStatus] = useState<StatusAtleta | "ALL">("ALL")
  const [filtroVerificacao, setFiltroVerificacao] = useState<StatusVerificacao | "ALL">("ALL")

  /* =======================
      LOAD INICIAL
     ======================= */
  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        const data = await atletaService.listarTodasAdmin()
        setAtletas(data)
      } catch (err) {
        console.error(err)
        setError("Erro ao carregar atletas.")
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  /* =======================
      FILTRAGEM EM MEMÓRIA
     ======================= */
  const atletasFiltradas = useMemo(() => {
    return atletas.filter((a) => {
      if (filtroCategoria !== "ALL" && a.categoria !== filtroCategoria) return false
      if (filtroStatus !== "ALL" && a.statusAtleta !== filtroStatus) return false
      if (filtroVerificacao !== "ALL" && a.statusVerificacao !== filtroVerificacao) return false
      return true
    })
  }, [atletas, filtroCategoria, filtroStatus, filtroVerificacao])

  if (loading) return <div style={{ padding: "2rem" }}>Carregando atletas…</div>
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>

  return (
    <section style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      {/* HEADER */}
      <header style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.8rem" }}>Gestão de Atletas</h1>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>
            Curadoria, criação histórica e validação do acervo esportivo
          </p>
        </div>

        <button onClick={() => navigate("/admin/atletas/nova")} style={addButtonStyle}>
          + Nova Atleta
        </button>
      </header>

      {/* FILTROS ESTILIZADOS */}
      <div style={filtersContainerStyle}>
        <select
          style={selectStyle}
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value as CategoriaAtleta | "ALL")}
        >
          <option value="ALL">Todas as Categorias</option>
          <option value="ATIVA">ATIVA</option>
          <option value="HISTORICA">HISTÓRICA</option>
          <option value="ESPOLIO">ESPÓLIO</option>
        </select>

        <select
          style={selectStyle}
          value={filtroVerificacao}
          onChange={(e) => setFiltroVerificacao(e.target.value as StatusVerificacao | "ALL")}
        >
          <option value="ALL">Todas as Verificações</option>
          <option value="PENDENTE">PENDENTE</option>
          <option value="VERIFICADO">VERIFICADO</option>
          <option value="REJEITADO">REJEITADO</option>
        </select>

        <select
          style={selectStyle}
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as StatusAtleta | "ALL")}
        >
          <option value="ALL">Todos os Status</option>
          <option value="ATIVO">ATIVO</option>
          <option value="INATIVO">INATIVO</option>
          <option value="SUSPENSO">SUSPENSO</option>
        </select>
      </div>

      {/* TABELA */}
      {atletasFiltradas.length === 0 ? (
        <p style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
          Nenhuma atleta encontrada com os filtros atuais.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee" }}>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Categoria</th>
                <th style={thStyle}>Verificação</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Modalidades</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {atletasFiltradas.map((atleta) => {
                const isNova =
                  atleta.statusVerificacao === "PENDENTE" &&
                  atleta.criadoEm &&
                  Date.now() - new Date(atleta.criadoEm).getTime() < 1000 * 60 * 60 * 24

                return (
                  <tr
                    key={atleta.id}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: isNova ? "#fffbea" : "transparent",
                    }}
                  >
                    <td style={tdStyle}><strong>{atleta.nome}</strong></td>
                    <td style={tdStyle}>{atleta.email || "—"}</td>
                    <td style={tdStyle}>{atleta.categoria}</td>
                    <td style={tdStyle}>{atleta.statusVerificacao}</td>
                    <td style={tdStyle}>{atleta.statusAtleta}</td>
                    <td style={tdStyle}>{atleta.modalidadesIds?.length ?? 0}</td>
                    <td style={tdStyle}>
                      <button
                        style={actionButtonStyle}
                        onClick={() => navigate(`/admin/atletas/editar/${atleta.id}`)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* =======================
    ESTILOS
   ======================= */

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "2rem",
}

const filtersContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  marginBottom: "2rem",
  padding: "1rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
}

const selectStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  border: "1px solid #ddd",
  backgroundColor: "white",
  fontSize: "0.85rem",
  color: "#333",
  outline: "none",
  cursor: "pointer",
  minWidth: "180px"
}

const addButtonStyle: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  color: "white",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "0.9rem",
}

const actionButtonStyle: React.CSSProperties = {
  backgroundColor: "white",
  border: "1px solid #3182ce",
  color: "#3182ce",
  padding: "0.4rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.8rem",
  fontWeight: 500,
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "1rem 0.75rem",
  fontSize: "0.75rem",
  color: "#718096",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}

const tdStyle: React.CSSProperties = {
  padding: "1rem 0.75rem",
  fontSize: "0.9rem",
  color: "#2d3748",
}
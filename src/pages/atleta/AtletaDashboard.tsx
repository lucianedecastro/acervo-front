import { useEffect, useState } from "react"
import { atletaService } from "@/services/atletaService"
import { DashboardAtletaDTO } from "@/types/atleta"

export default function AtletaDashboard() {
  const [data, setData] = useState<DashboardAtletaDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
      CARREGAR DASHBOARD
     ========================== */
  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        const dashboard = await atletaService.buscarDashboard()
        setData(dashboard)
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err)
        setError("Não foi possível carregar seus dados financeiros no momento.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  /* ==========================
      ESTADOS DE CARREGAMENTO / ERRO
     ========================== */
  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>
        <p>Sincronizando com o acervo...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p style={{ color: "#d93025", fontWeight: "bold" }}>
          {error || "Erro ao carregar dashboard."}
        </p>
      </div>
    )
  }

  /* ==========================
      RENDERIZAÇÃO
     ========================== */
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ color: "#1a1a1a", fontSize: "2.2rem", marginBottom: "0.5rem" }}>
          Meu Painel Financeiro
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          Acompanhamento de vendas e acervo em tempo real.
        </p>
      </header>

      <div style={gridStyle}>
        {/* Card: Saldo */}
        <div style={cardStyle("#27ae60")}>
          <small style={labelStyle}>Saldo Disponível</small>
          <h2 style={valueStyle}>
            {data.saldoTotalAtleta.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>
        </div>

        {/* Card: Itens Publicados */}
        <div style={cardStyle("#2980b9")}>
          <small style={labelStyle}>Itens Publicados</small>
          <h2 style={valueStyle}>{data.itensPublicados}</h2>
        </div>

        {/* Card: Licenciamentos */}
        <div style={cardStyle("#8e44ad")}>
          <small style={labelStyle}>Licenciamentos Vendidos</small>
          <h2 style={valueStyle}>
            {data.totalLicenciamentosVendidos}
          </h2>
        </div>

        {/* Card: Total Geral */}
        <div style={cardStyle("#7f8c8d")}>
          <small style={labelStyle}>Total de Itens (Geral)</small>
          <h2 style={valueStyle}>{data.totalMeusItens}</h2>
        </div>
      </div>
    </div>
  )
}

/* ==========================
    ESTILOS (CSS-IN-JS)
   ========================== */
const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "24px",
}

const cardStyle = (color: string): React.CSSProperties => ({
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  borderTop: `6px solid ${color}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
})

const labelStyle: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontWeight: "600",
  color: "#718096",
  fontSize: "0.75rem",
}

const valueStyle: React.CSSProperties = {
  margin: "12px 0 0 0",
  fontSize: "2rem",
  color: "#1a202c",
  fontWeight: "700",
}
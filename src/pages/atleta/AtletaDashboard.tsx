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
        setError("Não foi possível carregar seus dados financeiros.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  /* ==========================
     STATES
     ========================== */
  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        Sincronizando com o acervo...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        {error || "Erro ao carregar dashboard."}
      </div>
    )
  }

  /* ==========================
     RENDER
     ========================== */
  return (
    <main style={{ padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#2c3e50" }}>Meu Painel Financeiro</h1>
        <p>Acompanhamento de vendas e acervo em tempo real.</p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Saldo */}
        <div style={cardStyle("#27ae60")}>
          <small>Saldo Disponível</small>
          <h2 style={valueStyle}>
            {data.saldoTotalAtleta.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>
        </div>

        {/* Itens Publicados */}
        <div style={cardStyle("#2980b9")}>
          <small>Itens Publicados</small>
          <h2 style={valueStyle}>{data.itensPublicados}</h2>
        </div>

        {/* Licenciamentos */}
        <div style={cardStyle("#8e44ad")}>
          <small>Licenciamentos Vendidos</small>
          <h2 style={valueStyle}>
            {data.totalLicenciamentosVendidos}
          </h2>
        </div>

        {/* Total Geral */}
        <div style={cardStyle("#7f8c8d")}>
          <small>Total de Itens (Geral)</small>
          <h2 style={valueStyle}>{data.totalMeusItens}</h2>
        </div>
      </div>
    </main>
  )
}

/* ==========================
   STYLES
   ========================== */
const cardStyle = (color: string) => ({
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  borderTop: `5px solid ${color}`,
})

const valueStyle = {
  margin: "10px 0 0 0",
  fontSize: "1.8rem",
  color: "#333",
}

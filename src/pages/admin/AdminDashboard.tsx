import { useEffect, useState } from "react"
import {
  adminDashboardService,
  AdminDashboardStatsDTO,
} from "@/services/adminDashboardService"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStatsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const data = await adminDashboardService.obterResumo()
        setStats(data)
      } catch (err) {
        console.error("Erro ao carregar dashboard admin:", err)
        setError("Não foi possível carregar os indicadores do sistema.")
      } finally {
        setLoading(false)
      }
    }

    carregarDashboard()
  }, [])

  if (loading) {
    return <div style={{ padding: "2rem" }}>Carregando indicadores globais…</div>
  }

  if (error || !stats) {
    return <div style={{ padding: "2rem", color: "red" }}>{error}</div>
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Dashboard Administrativo</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Card label="Total de Atletas" value={stats.totalAtletas} />
        <Card label="Itens no Acervo" value={stats.totalItensAcervo} />
        <Card label="Modalidades" value={stats.totalModalidades} />
        <Card label="Itens Aguardando Publicação" value={stats.itensAguardandoPublicacao} />
        <Card
          label="Faturamento Bruto"
          value={`R$ ${stats.faturamentoTotalBruto.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
        />
        <Card
          label="Comissões da Plataforma"
          value={`R$ ${stats.totalComissoesPlataforma.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
        />
      </div>
    </div>
  )
}

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={cardStyle}>
      <span style={labelStyle}>{label}</span>
      <strong style={numberStyle}>{value}</strong>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  padding: "1.5rem",
  backgroundColor: "white",
  borderRadius: "8px",
  border: "1px solid #eee",
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#666",
  fontSize: "0.85rem",
  textTransform: "uppercase",
}

const numberStyle: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: "bold",
}

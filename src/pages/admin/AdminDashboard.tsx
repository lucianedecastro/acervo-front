import { useEffect, useState } from "react"
import { atletaService } from "@/services/atletaService"
import { itemAcervoService } from "@/services/itemAcervoService"
import { licenciamentoService } from "@/services/licenciamentoService"

interface DashboardStats {
  totalAtletas: number
  totalItensAcervo: number
  faturamentoTotalBruto: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAtletas: 0,
    totalItensAcervo: 0,
    faturamentoTotalBruto: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const [atletas, itens] = await Promise.all([
          atletaService.listarTodasAdmin(),       // ✔ existe
          itemAcervoService.listarAdmin(),   // ✅ CORRETO
        ])

        let faturamento = 0
        try {
          const vendas = await licenciamentoService.listarTodos()
          faturamento = vendas.reduce(
            (acc, v) => acc + (v.valorBruto || 0),
            0
          )
        } catch {
          faturamento = 0
        }

        setStats({
          totalAtletas: atletas.length,
          totalItensAcervo: itens.length,
          faturamentoTotalBruto: faturamento,
        })
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

  if (error) {
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
        <Card
          label="Faturamento Bruto"
          value={`R$ ${stats.faturamentoTotalBruto.toLocaleString("pt-BR", {
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

const cardStyle = {
  padding: "1.5rem",
  backgroundColor: "white",
  borderRadius: "8px",
  border: "1px solid #eee",
}

const labelStyle = {
  display: "block",
  color: "#666",
  fontSize: "0.85rem",
  textTransform: "uppercase" as const,
}

const numberStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
}

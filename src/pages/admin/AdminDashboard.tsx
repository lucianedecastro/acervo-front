import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  adminDashboardService,
  AdminDashboardStatsDTO,
} from "@/services/adminDashboardService"

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [data, setData] = useState<AdminDashboardStatsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        const resumo = await adminDashboardService.obterResumo()
        setData(resumo)
      } catch (err) {
        console.error("Erro ao carregar dashboard admin:", err)
        setError("Não foi possível carregar o painel administrativo.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  if (loading) {
    return <p>Carregando painel administrativo...</p>
  }

  if (error || !data) {
    return <p style={{ color: "red" }}>{error}</p>
  }

  return (
    <section>
      <h1 style={{ marginBottom: "2rem" }}>Painel Administrativo</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Card titulo="Atletas" valor={data.totalAtletas} />
        <Card titulo="Itens de Acervo" valor={data.totalItensAcervo} />
        <Card titulo="Modalidades" valor={data.totalModalidades} />
        <Card
          titulo="Aguardando Publicação"
          valor={data.itensAguardandoPublicacao}
        />
        <Card
          titulo="Faturamento Bruto"
          valor={data.faturamentoTotalBruto.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        />
        <Card
          titulo="Comissão da Plataforma"
          valor={data.totalComissoesPlataforma.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        />
      </div>

      {/* ===== AÇÕES ===== */}
      <div style={{ marginTop: "3rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate("/admin/atletas")}>Gerenciar Atletas</button>
        <button onClick={() => navigate("/admin/modalidades")}>
          Gerenciar Modalidades
        </button>
        <button onClick={() => navigate("/admin/configuracao-fiscal")}>
          Configuração Fiscal
        </button>
      </div>
    </section>
  )
}

function Card({
  titulo,
  valor,
}: {
  titulo: string
  valor: string | number
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: "8px",
        padding: "1.5rem",
      }}
    >
      <small style={{ color: "#666" }}>{titulo}</small>
      <h2 style={{ marginTop: "0.5rem" }}>{valor}</h2>
    </div>
  )
}

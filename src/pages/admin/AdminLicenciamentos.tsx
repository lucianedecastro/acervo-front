import { useEffect, useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import {
  ExtratoLicenciamentoDTO,
  TransacaoLicenciamento,
} from "@/types/licenciamento"

export default function AdminLicenciamentos() {
  const [extrato, setExtrato] = useState<ExtratoLicenciamentoDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)

        /**
         * Neste primeiro momento:
         * - usamos extrato consolidado
         * - backend já agrega tudo
         * - depois podemos filtrar por atleta
         */
        const data = await licenciamentoService.extratoConsolidado("all")

        setExtrato(data)
      } catch (err) {
        console.error("Erro ao carregar licenciamento:", err)
        setError("Erro ao carregar transações de licenciamento.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  if (loading) {
    return <p>Carregando transações de licenciamento...</p>
  }

  if (error || !extrato) {
    return <p style={{ color: "red" }}>{error}</p>
  }

  return (
    <section>
      <h1 style={{ marginBottom: "2rem" }}>
        Licenciamentos & Transações
      </h1>

      {/* ======================
          RESUMO FINANCEIRO
         ====================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <ResumoCard
          titulo="Total Bruto"
          valor={formatarMoeda(extrato.totalBruto)}
        />
        <ResumoCard
          titulo="Repasse às Atletas"
          valor={formatarMoeda(extrato.totalAtleta)}
        />
        <ResumoCard
          titulo="Comissão da Plataforma"
          valor={formatarMoeda(extrato.totalPlataforma)}
        />
      </div>

      {/* ======================
          TABELA DE TRANSAÇÕES
         ====================== */}
      {extrato.transacoes.length === 0 ? (
        <p>Nenhuma transação registrada.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #eee" }}>
              <th align="left">Data</th>
              <th align="left">Item</th>
              <th align="left">Tipo de Uso</th>
              <th align="right">Valor Bruto</th>
              <th align="right">Atleta</th>
              <th align="right">Plataforma</th>
            </tr>
          </thead>

          <tbody>
            {extrato.transacoes.map((t: TransacaoLicenciamento) => (
              <tr
                key={t.id}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td>{formatarData(t.criadoEm)}</td>
                <td>{t.itemAcervoId}</td>
                <td>{t.tipoUso}</td>
                <td align="right">{formatarMoeda(t.valorBruto)}</td>
                <td align="right">{formatarMoeda(t.valorAtleta)}</td>
                <td align="right">
                  {formatarMoeda(t.valorPlataforma)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

/* ======================
   COMPONENTES AUXILIARES
   ====================== */

function ResumoCard({
  titulo,
  valor,
}: {
  titulo: string
  valor: string
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

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatarData(dataIso: string) {
  return new Date(dataIso).toLocaleDateString("pt-BR")
}

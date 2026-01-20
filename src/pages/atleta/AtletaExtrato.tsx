import { useEffect, useState } from "react"

import { licenciamentoService } from "@/services/licenciamentoService"
import { ExtratoLicenciamentoDTO } from "@/types/licenciamento"

export default function AtletaExtrato() {
  const [extrato, setExtrato] = useState<ExtratoLicenciamentoDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
     CARREGAR EXTRATO
     ========================== */
  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        setError(null)

        // backend resolve atleta via token
        const data = await licenciamentoService.extratoAtleta("me")
        setExtrato(data)
      } catch (err) {
        console.error("Erro ao carregar extrato:", err)
        setError("Não foi possível carregar seu extrato financeiro.")
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
        Carregando seu extrato financeiro...
      </div>
    )
  }

  if (error || !extrato) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        {error || "Extrato indisponível."}
      </div>
    )
  }

  /* ==========================
     RENDER
     ========================== */
  return (
    <main style={{ padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#2c3e50" }}>Meu Extrato Financeiro</h1>
        <p>Acompanhe seus ganhos com licenciamento de acervo.</p>
      </header>

      {/* ===== RESUMO ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "2.5rem",
        }}
      >
        <div style={cardStyle("#27ae60")}>
          <small>Total Recebido</small>
          <h2 style={valueStyle}>
            {extrato.totalAtleta.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>
        </div>

        <div style={cardStyle("#2980b9")}>
          <small>Total Bruto</small>
          <h2 style={valueStyle}>
            {extrato.totalBruto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>
        </div>

        <div style={cardStyle("#7f8c8d")}>
          <small>Repasse Plataforma</small>
          <h2 style={valueStyle}>
            {extrato.totalPlataforma.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>
        </div>
      </div>

      {/* ===== TABELA ===== */}
      {extrato.transacoes.length === 0 ? (
        <p>Nenhuma transação registrada até o momento.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #eee" }}>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Tipo de Uso</th>
              <th style={thStyle}>Valor Bruto</th>
              <th style={thStyle}>Meu Repasse</th>
            </tr>
          </thead>

          <tbody>
            {extrato.transacoes.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>
                  {new Date(t.criadoEm).toLocaleDateString("pt-BR")}
                </td>
                <td style={tdStyle}>{t.itemAcervoId}</td>
                <td style={tdStyle}>{t.tipoUso}</td>
                <td style={tdStyle}>
                  {t.valorBruto.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td style={tdStyle}>
                  {t.valorAtleta.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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

const thStyle = {
  textAlign: "left" as const,
  padding: "0.6rem",
  fontSize: "0.9rem",
}

const tdStyle = {
  padding: "0.6rem",
  fontSize: "0.9rem",
}

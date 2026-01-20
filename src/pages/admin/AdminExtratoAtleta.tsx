import { useState } from "react"

import { licenciamentoService } from "@/services/licenciamentoService"
import { ExtratoLicenciamentoDTO } from "@/types/licenciamento"

export default function AdminExtratoAtleta() {
  const [atletaId, setAtletaId] = useState("")
  const [extrato, setExtrato] = useState<ExtratoLicenciamentoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
     BUSCAR EXTRATO
     ========================== */
  async function handleBuscar() {
    if (!atletaId.trim()) {
      setError("Informe o ID da atleta.")
      return
    }

    if (loading) return

    try {
      setLoading(true)
      setError(null)

      const data =
        await licenciamentoService.extratoConsolidado(atletaId.trim())

      setExtrato(data)
    } catch (err) {
      console.error("Erro ao buscar extrato:", err)
      setError("Não foi possível carregar o extrato da atleta.")
      setExtrato(null)
    } finally {
      setLoading(false)
    }
  }

  /* ==========================
     RENDER
     ========================== */
  return (
    <section>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1>Extrato Consolidado por Atleta</h1>
        <p style={{ color: "#666", marginTop: "0.4rem" }}>
          Consulta financeira completa de licenciamento por atleta.
        </p>
      </header>

      {/* ===== FORM ===== */}
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          gap: "1rem",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1 }}>
          <label>ID da Atleta</label>
          <input
            type="text"
            value={atletaId}
            onChange={(e) => {
              setAtletaId(e.target.value)
              setError(null)
            }}
            placeholder="Ex: 65f2c9e1a4..."
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          onClick={handleBuscar}
          disabled={loading}
          style={{ padding: "0.6rem 1.2rem", cursor: "pointer" }}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ===== RESULTADO ===== */}
      {extrato && (
        <>
          {/* RESUMO */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            <div style={cardStyle}>
              <small>Total Bruto</small>
              <strong>
                {extrato.totalBruto.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>

            <div style={cardStyle}>
              <small>Total Atleta</small>
              <strong>
                {extrato.totalAtleta.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>

            <div style={cardStyle}>
              <small>Total Plataforma</small>
              <strong>
                {extrato.totalPlataforma.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
          </div>

          {/* TABELA */}
          {extrato.transacoes.length === 0 ? (
            <p>Nenhuma transação encontrada para esta atleta.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>Item</th>
                  <th style={thStyle}>Tipo de Uso</th>
                  <th style={thStyle}>Valor Bruto</th>
                  <th style={thStyle}>Repasse Atleta</th>
                  <th style={thStyle}>Plataforma</th>
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
                    <td style={tdStyle}>
                      {t.valorPlataforma.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  )
}

/* ==========================
   STYLES
   ========================== */
const cardStyle = {
  padding: "1rem",
  background: "#f9f9f9",
  borderRadius: "6px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.4rem",
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

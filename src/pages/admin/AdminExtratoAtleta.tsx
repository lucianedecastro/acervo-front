/* =====================================================
   EXTRATO CONSOLIDADO - VISÃO ADMIN
   Endpoint: GET /licenciamento/extrato/consolidado/{atletaId}
   ===================================================== */

import { useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { ExtratoLicenciamentoDTO } from "@/types/licenciamento"

export default function AdminExtratoAtleta() {
  const [atletaId, setAtletaId] = useState("")
  const [extrato, setExtrato] = useState<ExtratoLicenciamentoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ======================
     BUSCAR EXTRATO
     ====================== */
  async function handleBuscar() {
    const id = atletaId.trim()

    if (!id) {
      setError("Por favor, informe o ID da atleta para consulta.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await (
        licenciamentoService as unknown as {
          extratoConsolidado: (
            atletaId: string
          ) => Promise<ExtratoLicenciamentoDTO>
        }
      ).extratoConsolidado(id)

      setExtrato(data)
    } catch (err) {
      console.error("Erro ao buscar extrato administrativo:", err)
      setError("Não foi possível localizar o extrato para o ID informado.")
      setExtrato(null)
    } finally {
      setLoading(false)
    }
  }

  const volumeBruto =
    extrato?.transacoes.reduce((acc, t) => acc + t.valorTotal, 0) ?? 0

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1a1a1a" }}>
          Auditoria de Extratos
        </h1>
        <p style={{ color: "#666" }}>
          Consulta consolidada de saldos e histórico de licenciamentos por atleta.
        </p>
      </header>

      {/* ===== FORMULÁRIO ===== */}
      <div style={searchContainerStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Identificador (ID) da Atleta</label>
          <input
            type="text"
            value={atletaId}
            onChange={(e) => {
              setAtletaId(e.target.value.trimStart())
              setError(null)
            }}
            placeholder="Cole o ID da atleta aqui"
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleBuscar}
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? "#ccc" : "#1a1a1a",
          }}
        >
          {loading ? "Processando..." : "Consultar Extrato"}
        </button>
      </div>

      {error && <div style={errorBoxStyle}>{error}</div>}

      {/* ===== RESULTADO ===== */}
      {extrato && (
        <>
          <div style={headerAtletaStyle}>
            <h2 style={{ margin: 0 }}>Atleta: {extrato.nomeAtleta}</h2>
          </div>

          <div style={gridCardsStyle}>
            <ResumoCard
              label="Saldo Total (Repasses)"
              valor={formatarMoeda(extrato.saldoTotal)}
              cor="#27ae60"
            />

            <ResumoCard
              label="Volume Bruto Negociado"
              valor={formatarMoeda(volumeBruto)}
              cor="#2980b9"
            />
          </div>

          <div style={tableWrapperStyle}>
            <h3 style={{ marginBottom: "1rem" }}>Histórico de Licenças</h3>

            {extrato.transacoes.length === 0 ? (
              <p style={{ color: "#888" }}>
                Nenhuma transação registrada para este perfil.
              </p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Data</th>
                    <th style={thStyle}>Item ID</th>
                    <th style={thStyle}>Licença</th>
                    <th style={thStyle}>Total Bruto</th>
                    <th style={thStyle}>Repasse Atleta</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {extrato.transacoes.map((t) => (
                    <tr key={t.id} style={trStyle}>
                      <td style={tdStyle}>
                        {formatarData(t.dataTransacao)}
                      </td>
                      <td style={tdStyle}>{t.itemAcervoId}</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle}>{t.tipoLicenca}</span>
                      </td>
                      <td style={tdStyle}>
                        {formatarMoeda(t.valorTotal)}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: "#27ae60",
                          fontWeight: "bold",
                        }}
                      >
                        {formatarMoeda(t.valorRepasseAtleta)}
                      </td>
                      <td style={tdStyle}>{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </section>
  )
}

/* ======================
    HELPERS & STYLES
   ====================== */

const formatarMoeda = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR")

function ResumoCard({
  label,
  valor,
  cor,
}: {
  label: string
  valor: string
  cor: string
}) {
  return (
    <div style={{ ...cardStyleBase, borderLeft: `5px solid ${cor}` }}>
      <small style={cardLabelStyle}>{label}</small>
      <strong style={cardValueStyle}>{valor}</strong>
    </div>
  )
}

const searchContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  marginBottom: "2.5rem",
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "8px",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e0",
  marginTop: "0.5rem",
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: "bold",
  color: "#4a5568",
}

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
}

const errorBoxStyle: React.CSSProperties = {
  padding: "1rem",
  backgroundColor: "#fff5f5",
  color: "#c53030",
  borderRadius: "6px",
  marginBottom: "2rem",
}

const headerAtletaStyle: React.CSSProperties = {
  marginBottom: "2rem",
  padding: "1rem",
  backgroundColor: "#f8fafc",
  borderLeft: "4px solid #1a1a1a",
}

const gridCardsStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1.5rem",
  marginBottom: "3rem",
}

const cardStyleBase: React.CSSProperties = {
  padding: "1.5rem",
  backgroundColor: "#fff",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
}

const cardLabelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#718096",
  textTransform: "uppercase",
}

const cardValueStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  color: "#1a202c",
}

const tableWrapperStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "10px",
}

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
}

const trStyle: React.CSSProperties = {
  borderBottom: "1px solid #f7fafc",
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "1rem",
  fontSize: "0.85rem",
  color: "#a0aec0",
}

const tdStyle: React.CSSProperties = {
  padding: "1rem",
  fontSize: "0.9rem",
}

const badgeStyle: React.CSSProperties = {
  backgroundColor: "#edf2f7",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "0.75rem",
}

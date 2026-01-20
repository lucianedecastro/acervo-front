/* =====================================================
   EXTRATO CONSOLIDADO - VISÃO ADMIN
   Funcionalidade: Busca extrato financeiro por ID de Atleta
   Alinhado ao Swagger: GET /licenciamento/extrato/consolidado/{atletaId}
   ===================================================== */

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
      setError("Por favor, informe o ID da atleta para consulta.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Utiliza o serviço consolidado para Admin (Imagem 5 do Swagger)
      const data = await licenciamentoService.extratoConsolidado(atletaId.trim())

      setExtrato(data)
    } catch (err) {
      console.error("Erro ao buscar extrato administrativo:", err)
      setError("Não foi possível localizar o extrato para o ID informado.")
      setExtrato(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1a1a1a" }}>Auditoria de Extratos</h1>
        <p style={{ color: "#666" }}>
          Consulta consolidada de saldos e histórico de licenciamentos por atleta.
        </p>
      </header>

      {/* ===== FORMULÁRIO DE BUSCA ===== */}
      <div style={searchContainerStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Identificador (ID) da Atleta</label>
          <input
            type="text"
            value={atletaId}
            onChange={(e) => {
              setAtletaId(e.target.value)
              setError(null)
            }}
            placeholder="Cole o ID da atleta aqui (Ex: 65f2c...)"
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleBuscar}
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? "#ccc" : "#1a1a1a"
          }}
        >
          {loading ? "Processando..." : "Consultar Extrato"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#fff5f5", color: "#c53030", borderRadius: "6px", marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      {/* ===== RESULTADO DO CONSOLIDADO ===== */}
      {extrato && (
        <>
          <div style={{ marginBottom: "2rem", padding: "1rem", borderLeft: "4px solid #1a1a1a", backgroundColor: "#f8fafc" }}>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Atleta: {extrato.nomeAtleta}</h2>
          </div>

          <div style={gridCardsStyle}>
            <div style={cardStyle("#27ae60")}>
              <small style={cardLabelStyle}>Saldo Total (Repasses)</small>
              <strong style={cardValueStyle}>
                {extrato.saldoTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>

            {/* Campos calculados a partir da lista para visão do Admin */}
            <div style={cardStyle("#2980b9")}>
              <small style={cardLabelStyle}>Volume Bruto Negociado</small>
              <strong style={cardValueStyle}>
                {(extrato.transacoes.reduce((acc, t) => acc + t.valorTotal, 0)).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
          </div>

          {/* TABELA DE TRANSAÇÕES */}
          <div style={tableWrapperStyle}>
            <h3 style={{ marginBottom: "1rem" }}>Histórico de Licenças</h3>
            {extrato.transacoes.length === 0 ? (
              <p style={{ color: "#888" }}>Nenhuma transação registrada para este perfil.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #edf2f7" }}>
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
                    <tr key={t.id} style={{ borderBottom: "1px solid #f7fafc" }}>
                      <td style={tdStyle}>
                        {new Date(t.dataTransacao).toLocaleDateString("pt-BR")}
                      </td>
                      <td style={tdStyle}>{t.itemAcervoId}</td>
                      <td style={tdStyle}><span style={badgeStyle}>{t.tipoLicenca}</span></td>
                      <td style={tdStyle}>
                        {t.valorTotal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td style={{ ...tdStyle, color: "#27ae60", fontWeight: "bold" }}>
                        {t.valorRepasseAtleta.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
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

/* ==========================
    ESTILOS (CSS-IN-JS)
   ========================== */
const searchContainerStyle: React.CSSProperties = {
  marginBottom: "2.5rem",
  display: "flex",
  gap: "1rem",
  alignItems: "flex-end",
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e0",
  marginTop: "0.5rem"
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: "bold",
  color: "#4a5568"
}

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
}

const gridCardsStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1.5rem",
  marginBottom: "3rem"
}

const cardStyle = (color: string): React.CSSProperties => ({
  padding: "1.5rem",
  backgroundColor: "#fff",
  borderRadius: "10px",
  borderLeft: `5px solid ${color}`,
  boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
})

const cardLabelStyle: React.CSSProperties = { color: "#718096", fontSize: "0.8rem", textTransform: "uppercase" }
const cardValueStyle: React.CSSProperties = { fontSize: "1.5rem", color: "#1a202c" }

const tableWrapperStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
}

const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" }
const thStyle: React.CSSProperties = { textAlign: "left", padding: "1rem", fontSize: "0.85rem", color: "#a0aec0" }
const tdStyle: React.CSSProperties = { padding: "1rem", fontSize: "0.9rem" }
const badgeStyle: React.CSSProperties = { backgroundColor: "#edf2f7", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem" }
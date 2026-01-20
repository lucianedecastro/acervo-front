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

  async function handleBuscar() {
    const id = atletaId.trim()

    if (!id) {
      setError("Por favor, informe o ID da atleta para consulta.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await licenciamentoService.buscarExtratoConsolidado(id)
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
        <h1>Auditoria de Extratos</h1>
        <p>Consulta consolidada de saldos e histórico por atleta.</p>
      </header>

      <div style={searchContainerStyle}>
        <input
          type="text"
          value={atletaId}
          onChange={(e) => setAtletaId(e.target.value)}
          placeholder="ID da atleta"
          style={inputStyle}
        />
        <button onClick={handleBuscar} disabled={loading} style={buttonStyle}>
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </div>

      {error && <div style={errorBoxStyle}>{error}</div>}

      {extrato && (
        <>
          <h2>Atleta: {extrato.nomeAtleta}</h2>

          <p>
            <strong>Saldo Total:</strong>{" "}
            {extrato.saldoTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          <p>
            <strong>Volume Bruto:</strong>{" "}
            {volumeBruto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </>
      )}
    </section>
  )
}

/* ======================
   STYLES
   ====================== */

const searchContainerStyle = { display: "flex", gap: "1rem", marginBottom: "2rem" }
const inputStyle = { flex: 1, padding: "0.75rem" }
const buttonStyle = { padding: "0.75rem 1.5rem", cursor: "pointer" }
const errorBoxStyle = { color: "#c53030", marginTop: "1rem" }

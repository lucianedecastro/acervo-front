/* =====================================================
   LICENCIAMENTOS & TRANSAÇÕES (ADMIN)
   Extrato consolidado por atleta
   Endpoint: GET /licenciamento/extrato/consolidado/{atletaId}
   ===================================================== */

import { useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import {
  ExtratoLicenciamentoDTO,
  TransacaoLicenciamento,
} from "@/types/licenciamento"

export default function AdminLicenciamentos() {
  const [atletaId, setAtletaId] = useState("")
  const [extrato, setExtrato] = useState<ExtratoLicenciamentoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ======================
     BUSCAR EXTRATO
     ====================== */
  async function handleBuscar() {
    if (!atletaId.trim()) {
      setError("Informe o ID da atleta.")
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
      ).extratoConsolidado(atletaId.trim())

      setExtrato(data)
    } catch (err) {
      console.error(err)
      setError("Não foi possível carregar o extrato da atleta.")
      setExtrato(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Licenciamentos & Transações</h1>
        <p>Consulta consolidada de vendas e repasses por atleta.</p>
      </header>

      {/* ======================
           FORM
         ====================== */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="ID da atleta"
          value={atletaId}
          onChange={(e) => setAtletaId(e.target.value)}
          style={{ flex: 1, padding: "0.6rem" }}
        />
        <button onClick={handleBuscar} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ======================
           RESULTADO
         ====================== */}
      {extrato && (
        <>
          {/* RESUMO */}
          <div style={gridResumoStyle}>
            <ResumoCard
              titulo="Saldo Consolidado"
              valor={formatarMoeda(extrato.saldoTotal)}
              cor="#27ae60"
            />
            <ResumoCard
              titulo="Volume Bruto"
              valor={formatarMoeda(
                extrato.transacoes.reduce(
                  (acc, t) => acc + t.valorTotal,
                  0
                )
              )}
              cor="#2980b9"
            />
            <ResumoCard
              titulo="Licenças Emitidas"
              valor={extrato.transacoes.length.toString()}
              cor="#8e44ad"
            />
          </div>

          {/* TABELA */}
          <div style={tableContainerStyle}>
            {extrato.transacoes.length === 0 ? (
              <p>Nenhuma transação encontrada.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Item</th>
                    <th>Licença</th>
                    <th>Total</th>
                    <th>Repasse Atleta</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {extrato.transacoes.map(
                    (t: TransacaoLicenciamento) => (
                      <tr key={t.id}>
                        <td>{formatarData(t.dataTransacao)}</td>
                        <td>{t.itemAcervoId}</td>
                        <td>{t.tipoLicenca}</td>
                        <td>{formatarMoeda(t.valorTotal)}</td>
                        <td style={{ color: "#27ae60" }}>
                          {formatarMoeda(t.valorRepasseAtleta)}
                        </td>
                        <td>{t.status}</td>
                      </tr>
                    )
                  )}
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

function ResumoCard({
  titulo,
  valor,
  cor,
}: {
  titulo: string
  valor: string
  cor: string
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "1.5rem",
        borderLeft: `6px solid ${cor}`,
      }}
    >
      <small>{titulo}</small>
      <h2>{valor}</h2>
    </div>
  )
}

const formatarMoeda = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR")

const gridResumoStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2.5rem",
}

const tableContainerStyle: React.CSSProperties = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "8px",
}

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
}

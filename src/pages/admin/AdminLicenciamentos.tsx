/* =====================================================
   GERENCIAMENTO GLOBAL DE LICENCIAMENTOS (ADMIN)
   Funcionalidade: Visão geral de todas as vendas e repasses
   Alinhado ao Swagger: GET /licenciamento/extrato/consolidado/{atletaId}
   ===================================================== */

import { useEffect, useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { atletaService } from "@/services/atletaService" // Para buscar IDs se necessário
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
        setError(null)

        /**
         * NOTA: O endpoint consolidado exige um atletaId (Imagem 5/13).
         * Para uma visão 'Geral', o ideal seria um endpoint /admin/licenciamentos/all.
         * Por enquanto, utilizaremos o consolidado da primeira atleta ou um placeholder.
         */
        const data = await licenciamentoService.extratoConsolidado("all") 
        setExtrato(data)
      } catch (err) {
        console.error("Erro ao carregar licenciamento:", err)
        setError("Não foi possível carregar a base global de licenciamentos.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>
        Carregando histórico global de transações...
      </div>
    )
  }

  if (error || !extrato) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#d93025" }}>
        {error}
      </div>
    )
  }

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", color: "#1a1a1a" }}>
          Licenciamentos & Transações
        </h1>
        <p style={{ color: "#666" }}>Monitoramento global de vendas de ativos e repasses financeiros.</p>
      </header>

      {/* ======================
           RESUMO FINANCEIRO GLOBAL
           ====================== */}
      <div style={gridResumoStyle}>
        {/* Usando saldoTotal do Swagger (Imagem 5) */}
        <ResumoCard
          titulo="Saldo Consolidado (Repasses)"
          valor={formatarMoeda(extrato.saldoTotal)}
          cor="#27ae60"
        />
        <ResumoCard
          titulo="Volume Total Bruto"
          valor={formatarMoeda(extrato.transacoes.reduce((acc, t) => acc + t.valorTotal, 0))}
          cor="#2980b9"
        />
        <ResumoCard
          titulo="Total de Licenças Emitidas"
          valor={extrato.transacoes.length.toString()}
          cor="#8e44ad"
        />
      </div>

      {/* ======================
           TABELA DE TRANSAÇÕES
           ====================== */}
      <div style={tableContainerStyle}>
        <h3 style={{ marginBottom: "1.5rem" }}>Log de Operações</h3>
        
        {extrato.transacoes.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>
            Nenhuma venda registrada na plataforma ainda.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ borderBottom: "2px solid #edf2f7", textAlign: "left" }}>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>Item ID</th>
                  <th style={thStyle}>Atleta ID</th>
                  <th style={thStyle}>Licença</th>
                  <th style={thRightStyle}>Total Bruto</th>
                  <th style={thRightStyle}>Repasse Atleta</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>

              <tbody>
                {extrato.transacoes.map((t: TransacaoLicenciamento) => (
                  <tr key={t.id} style={trStyle}>
                    <td style={tdStyle}>{formatarData(t.dataTransacao)}</td>
                    <td style={tdStyle}><small>{t.itemAcervoId}</small></td>
                    <td style={tdStyle}><small>{t.atletaId}</small></td>
                    <td style={tdStyle}>
                      <span style={badgeStyle}>{t.tipoLicenca}</span>
                    </td>
                    <td style={tdRightStyle}>{formatarMoeda(t.valorTotal)}</td>
                    <td style={{ ...tdRightStyle, color: "#27ae60", fontWeight: "bold" }}>
                      {formatarMoeda(t.valorRepasseAtleta)}
                    </td>
                    <td style={tdStyle}>
                      <small style={{ color: t.status === 'CONCLUIDO' ? '#27ae60' : '#f39c12' }}>
                        {t.status}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

/* ======================
    ESTILOS E HELPERS
   ====================== */

function ResumoCard({ titulo, valor, cor }: { titulo: string; valor: string; cor: string }) {
  return (
    <div style={{
      background: "#fff",
      borderLeft: `6px solid ${cor}`,
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
    }}>
      <small style={{ color: "#718096", fontWeight: "600", textTransform: "uppercase" }}>{titulo}</small>
      <h2 style={{ marginTop: "0.5rem", color: "#1a202c" }}>{valor}</h2>
    </div>
  )
}

const formatarMoeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatarData = (dataIso: string) => new Date(dataIso).toLocaleDateString("pt-BR");

const gridResumoStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1.5rem",
  marginBottom: "3rem",
}

const tableContainerStyle: React.CSSProperties = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  border: "1px solid #f0f0f0"
}

const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" }
const trStyle: React.CSSProperties = { borderBottom: "1px solid #f7fafc" }
const thStyle: React.CSSProperties = { padding: "1rem", fontSize: "0.8rem", color: "#a0aec0", textTransform: "uppercase" }
const thRightStyle: React.CSSProperties = { ...thStyle, textAlign: "right" }
const tdStyle: React.CSSProperties = { padding: "1rem", fontSize: "0.9rem", color: "#4a5568" }
const tdRightStyle: React.CSSProperties = { ...tdStyle, textAlign: "right" }
const badgeStyle: React.CSSProperties = { backgroundColor: "#edf2f7", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }
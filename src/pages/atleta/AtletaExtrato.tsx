/* =====================================================
   MEU EXTRATO FINANCEIRO (VISÃO ATLETA)
   Funcionalidade: Dashboard de ganhos da atleta logada
   Sincronizado com: buscarExtratoPorAtleta do licenciamentoService
   ===================================================== */

import { useEffect, useState } from "react"
import { licenciamentoService, LicenciamentoDTO } from "@/services/licenciamentoService"
import { atletaService } from "@/services/atletaService"

export default function AtletaExtrato() {
  // Estado para armazenar a lista de licenciamentos (Extrato)
  const [transacoes, setTransacoes] = useState<LicenciamentoDTO[]>([])
  const [nomeAtleta, setNomeAtleta] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
      CARREGAR EXTRATO DINÂMICO
     ========================== */
  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        setError(null)

        // 1. Busca o perfil da atleta logada para capturar o ID real do banco
        const perfil = await atletaService.buscarMeuPerfil()
        
        if (!perfil || !perfil.id) {
          throw new Error("Identificação da atleta não encontrada.")
        }

        setNomeAtleta(perfil.nome)

        // 2. Busca a lista de licenciamentos vinculados à atleta
        // CORREÇÃO: Utilizando o nome correto do método no service
        const data = await licenciamentoService.buscarExtratoPorAtleta(perfil.id)
        setTransacoes(data)
      } catch (err) {
        console.error("Erro ao carregar extrato:", err)
        setError("Não foi possível carregar seu extrato financeiro no momento.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  /* ==========================
      CÁLCULOS DE RESUMO
     ========================== */
  const saldoTotalRepasse = transacoes.reduce((acc, t) => acc + (t.repasseAtleta || 0), 0)

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>
        Carregando seu extrato financeiro...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p style={{ color: "#d93025", fontWeight: "bold" }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ color: "#1a1a1a", fontSize: "2.2rem", marginBottom: "0.5rem" }}>
          Meu Extrato Financeiro
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          Bem-vinda, {nomeAtleta}. Acompanhe seus ganhos com o licenciamento de acervo.
        </p>
      </header>

      {/* ===== RESUMO (CARDS) ===== */}
      <div style={gridStyle}>
        <div style={cardStyle("#27ae60")}>
          <small style={labelStyle}>Saldo Total (Meu Repasse)</small>
          <h2 style={valueStyle}>
            {saldoTotalRepasse.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>
        </div>

        <div style={cardStyle("#2980b9")}>
          <small style={labelStyle}>Status do Perfil</small>
          <h2 style={{ ...valueStyle, fontSize: "1.4rem" }}>Acervo Verificado</h2>
        </div>

        <div style={cardStyle("#7f8c8d")}>
          <small style={labelStyle}>Total de Licenças</small>
          <h2 style={valueStyle}>{transacoes.length}</h2>
        </div>
      </div>

      {/* ===== TABELA DE TRANSAÇÕES ===== */}
      <section style={tableSectionStyle}>
        <h3 style={{ marginBottom: "1.5rem", color: "#1a1a1a" }}>Histórico de Licenciamentos</h3>
        
        {transacoes.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", background: "#f9f9f9", borderRadius: "8px" }}>
            <p style={{ color: "#888" }}>Nenhuma transação registrada até o momento.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>Item do Acervo</th>
                  <th style={thStyle}>Tipo Licença</th>
                  <th style={thStyle}>Valor Bruto</th>
                  <th style={thStyle}>Meu Repasse</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t) => (
                  <tr key={t.id} style={trStyle}>
                    <td style={tdStyle}>
                      {new Date(t.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td style={tdStyle}><strong>{t.itemTitulo}</strong></td>
                    <td style={tdStyle}>
                      <span style={badgeStyle}>{t.tipoLicenca}</span>
                    </td>
                    <td style={tdStyle}>
                      {t.valorBruto.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td style={{ ...tdStyle, color: "#27ae60", fontWeight: "bold" }}>
                      {t.repasseAtleta.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ 
                        color: t.status === "CONCLUIDO" || t.status === "PAGO" ? "#27ae60" : "#f39c12",
                        fontWeight: "600",
                        fontSize: "0.85rem"
                      }}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

/* ==========================
    ESTILOS (CSS-IN-JS)
   ========================== */
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", marginBottom: "3.5rem" }
const cardStyle = (color: string): React.CSSProperties => ({ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", borderLeft: `6px solid ${color}`, borderTop: "1px solid #f0f0f0" })
const labelStyle: React.CSSProperties = { textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600", color: "#718096", fontSize: "0.75rem" }
const valueStyle: React.CSSProperties = { margin: "8px 0 0 0", fontSize: "1.8rem", color: "#1a202c", fontWeight: "700" }
const tableSectionStyle: React.CSSProperties = { background: "#fff", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #f0f0f0" }
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" }
const thStyle: React.CSSProperties = { textAlign: "left", padding: "1rem", fontSize: "0.85rem", color: "#718096", textTransform: "uppercase", letterSpacing: "0.05em" }
const trStyle: React.CSSProperties = { borderBottom: "1px solid #f7f7f7" }
const tdStyle: React.CSSProperties = { padding: "1.2rem 1rem", fontSize: "0.95rem", color: "#4a5568" }
const badgeStyle: React.CSSProperties = { backgroundColor: "#edf2f7", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", color: "#4a5568", fontWeight: "500" }
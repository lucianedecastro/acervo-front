/* =====================================================
   GESTÃO DE CONFIGURAÇÃO FISCAL (ADMIN)
   Funcionalidade: Controle de Taxas de Repasse e Comissão
   Alinhado ao Swagger: GET/PUT /configuracoes/fiscal
   ===================================================== */

import { useEffect, useState } from "react"
import { configuracaoFiscalService } from "@/services/configuracaoFiscalService"
import {
  ConfiguracaoFiscal,
  ConfiguracaoFiscalDTO,
} from "@/types/configuracaoFiscal"

export default function AdminConfiguracaoFiscal() {
  const [config, setConfig] = useState<ConfiguracaoFiscal | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estados do formulário
  const [repasseAtleta, setRepasseAtleta] = useState(0)
  const [comissaoPlataforma, setComissaoPlataforma] = useState(0)
  const [observacaoLegal, setObservacaoLegal] = useState("")

  /* ==========================
      CARREGAR CONFIGURAÇÕES
     ========================== */
  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        setError(null)
        // Busca via serviço alinhado ao endpoint /configuracoes/fiscal
        const data = await configuracaoFiscalService.buscar()

        setConfig(data)
        // No banco os valores podem ser decimais (0.85), multiplicamos por 100 para o input humano
        setRepasseAtleta(data.percentualRepasseAtleta * 100)
        setComissaoPlataforma(data.percentualComissaoPlataforma * 100)
        setObservacaoLegal(data.observacaoLegal || "")
      } catch (err) {
        console.error("Erro ao carregar configurações fiscais:", err)
        setError("Não foi possível carregar as regras fiscais atuais.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  /* ==========================
      SALVAR ALTERAÇÕES
     ========================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validação simples: a soma das taxas deve ser 100%
    if (repasseAtleta + comissaoPlataforma !== 100) {
      alert("A soma do repasse e da comissão deve ser exatamente 100%.")
      return
    }

    setSaving(true)

    const payload: ConfiguracaoFiscalDTO = {
      // Convertemos de volta para decimal antes de enviar ao backend
      percentualRepasseAtleta: repasseAtleta / 100,
      percentualComissaoPlataforma: comissaoPlataforma / 100,
      observacaoLegal,
    }

    try {
      const atualizado = await configuracaoFiscalService.atualizar(payload)
      setConfig(atualizado)
      alert("Configuração fiscal global atualizada com sucesso!")
    } catch (err) {
      console.error("Erro ao salvar configuração fiscal:", err)
      alert("Erro ao salvar as novas taxas.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ padding: "2rem", textAlign: "center" }}>Carregando regras fiscais...</div>
  )
  
  if (error) return (
    <div style={{ padding: "2rem", textAlign: "center", color: "#d93025" }}>{error}</div>
  )

  return (
    <section style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1a1a1a" }}>Configuração Fiscal do Acervo</h1>
        <p style={{ color: "#666" }}>
          Defina as taxas padrão para todos os licenciamentos da plataforma.
        </p>
      </header>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>% Repasse para Atleta</label>
          <input
            type="number"
            step="0.01"
            style={inputStyle}
            value={repasseAtleta}
            onChange={(e) => setRepasseAtleta(Number(e.target.value))}
            required
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>% Comissão da Plataforma</label>
          <input
            type="number"
            step="0.01"
            style={inputStyle}
            value={comissaoPlataforma}
            onChange={(e) => setComissaoPlataforma(Number(e.target.value))}
            required
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Observação Legal (Exibida em contratos/faturas)</label>
          <textarea
            rows={4}
            style={{ ...inputStyle, fontFamily: "inherit" }}
            value={observacaoLegal}
            onChange={(e) => setObservacaoLegal(e.target.value)}
          />
        </div>

        <div style={infoBoxStyle}>
          <small>
            <strong>Última atualização:</strong> {config?.atualizadoEm ? new Date(config.atualizadoEm).toLocaleString("pt-BR") : "N/A"}<br />
            <strong>Por:</strong> {config?.atualizadoPor || "Sistema"}
          </small>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          style={{
            ...buttonStyle,
            backgroundColor: saving ? "#ccc" : "#1a1a1a"
          }}
        >
          {saving ? "Processando..." : "Salvar Configuração"}
        </button>
      </form>
    </section>
  )
}

/* ==========================
    ESTILOS (CSS-IN-JS)
   ========================== */

const formStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: "1px solid #eee"
}

const inputGroupStyle: React.CSSProperties = {
  marginBottom: "1.5rem"
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "600",
  fontSize: "0.9rem",
  color: "#4a5568"
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e0",
  fontSize: "1rem"
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  marginTop: "1rem"
}

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  padding: "1rem",
  borderRadius: "6px",
  marginBottom: "1.5rem",
  color: "#718096",
  fontSize: "0.85rem",
  border: "1px solid #edf2f7"
}
/* =====================================================
   SIMULAÇÃO DE LICENCIAMENTO (ADMIN)
   Funcionalidade: Cálculo prévio de repasses e comissões
   Alinhado ao Swagger: POST /licenciamento/simular
   ===================================================== */

import { useEffect, useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { itemAcervoService } from "@/services/itemAcervoService"
import {
  ResultadoSimulacaoDTO,
  SimulacaoLicenciamentoDTO,
} from "@/types/licenciamento"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

export default function AdminSimulacaoLicenciamento() {
  const [itens, setItens] = useState<ItemAcervoResponseDTO[]>([])
  
  // Estados do formulário alinhados ao Swagger
  const [itemAcervoId, setItemAcervoId] = useState("")
  const [atletaId, setAtletaId] = useState("") 
  const [tipoUso, setTipoUso] = useState("")
  const [valorBruto, setValorBruto] = useState<number>(0)
  const [prazoMeses, setPrazoMeses] = useState<number>(12) 

  const [resultado, setResultado] = useState<ResultadoSimulacaoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
      CARREGAR ITENS PUBLICADOS
     ========================== */
  useEffect(() => {
    itemAcervoService
      .listarPublicados()
      .then(setItens)
      .catch((err) => {
        console.error("Erro ao carregar itens:", err)
        setError("Não foi possível carregar os itens do acervo para simulação.")
      })
  }, [])

  /* ==========================
      LOGICA DE SELEÇÃO DE ITEM
     ========================== */
  const handleItemChange = (id: string) => {
    setItemAcervoId(id)
    // CORREÇÃO: Usando casting temporário 'as any' se o seu Tipo ainda não estiver atualizado
    // O ideal é adicionar 'atletaId: string' no arquivo @/types/itemAcervo.ts
    const itemSelecionado = itens.find(i => i.id === id) as any;
    
    if (itemSelecionado) {
      setAtletaId(itemSelecionado.atletaId || "")
    }
  }

  /* ==========================
      EXECUTAR SIMULAÇÃO
     ========================== */
  async function handleSimular(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResultado(null)

    if (!atletaId) {
      setError("Selecione um item que possua uma atleta vinculada.")
      return
    }

    const payload: SimulacaoLicenciamentoDTO = {
      itemAcervoId,
      atletaId, 
      tipoUso,
      prazoMeses, 
    }

    try {
      setLoading(true)
      const data = await licenciamentoService.simular(payload)
      setResultado(data)
    } catch (err) {
      console.error("Erro ao simular licenciamento:", err)
      setError("Erro ao realizar simulação. Verifique os parâmetros informados.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1a1a1a" }}>Simulação de Licenciamento</h1>
        <p style={{ color: "#666" }}>Calcule o faturamento e os repasses antes de efetivar a venda.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        
        {/* ===== FORMULÁRIO (Lado Esquerdo) ===== */}
        <form onSubmit={handleSimular} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Item do Acervo</label>
            <select
              style={inputStyle}
              value={itemAcervoId}
              onChange={(e) => handleItemChange(e.target.value)}
              required
            >
              <option value="">Selecione um item...</option>
              {itens.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.titulo} — {item.atletaNome}
                </option>
              ))}
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Finalidade / Tipo de Uso</label>
            <input
              type="text"
              style={inputStyle}
              value={tipoUso}
              onChange={(e) => setTipoUso(e.target.value)}
              placeholder="Ex: Editorial, Publicitário..."
              required
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ ...inputGroupStyle, flex: 2 }}>
              <label style={labelStyle}>Valor Bruto (R$)</label>
              <input
                type="number"
                style={inputStyle}
                min={0}
                step={0.01}
                value={valorBruto}
                onChange={(e) => setValorBruto(Number(e.target.value))}
                required
              />
            </div>
            <div style={{ ...inputGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Prazo (Meses)</label>
              <input
                type="number"
                style={inputStyle}
                value={prazoMeses}
                onChange={(e) => setPrazoMeses(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...buttonStyle,
              backgroundColor: loading ? "#ccc" : "#1a1a1a"
            }}
          >
            {loading ? "Calculando..." : "Realizar Simulação"}
          </button>
        </form>

        {/* ===== RESULTADO (Lado Direito) ===== */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {error && (
            <div style={{ padding: "1rem", backgroundColor: "#fff5f5", color: "#c53030", borderRadius: "8px" }}>
              {error}
            </div>
          )}

          {resultado && (
            <div style={resultBoxStyle}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
                Projeção de Repasse: {resultado.itemTitulo}
              </h2>

              <ResumoLinha label="Valor Total da Venda" valor={formatarMoeda(resultado.valorTotal)} />
              <ResumoLinha 
                label="Repasse Líquido Atleta" 
                valor={formatarMoeda(resultado.repasseAtleta)} 
                destaque="#27ae60" 
              />
              <ResumoLinha label="Comissão Plataforma" valor={formatarMoeda(resultado.comissaoPlataforma)} />
              
              <div style={pixInfoStyle}>
                <small><strong>Chave PIX Destinatária:</strong> {resultado.chavePixAtleta}</small>
              </div>

              <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#ebf8ff", borderRadius: "6px", fontSize: "0.85rem", color: "#2c5282" }}>
                * Os valores acima são simulações baseadas nas taxas fiscais vigentes.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ==========================
    COMPONENTES E ESTILOS
   ========================== */

function ResumoLinha({ label, valor, destaque }: { label: string; valor: string; destaque?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.8rem 0", borderBottom: "1px dashed #edf2f7" }}>
      <span style={{ color: "#4a5568", fontWeight: "500" }}>{label}:</span>
      <strong style={{ color: destaque || "#1a202c", fontSize: destaque ? "1.1rem" : "1rem" }}>{valor}</strong>
    </div>
  )
}

const formatarMoeda = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formStyle: React.CSSProperties = { background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }
const inputGroupStyle: React.CSSProperties = { marginBottom: "1.2rem" }
const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.85rem", color: "#4a5568" }
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "1rem" }
const buttonStyle: React.CSSProperties = { width: "100%", padding: "1rem", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", marginTop: "1rem" }
const resultBoxStyle: React.CSSProperties = { background: "#fff", padding: "2rem", borderRadius: "12px", border: "2px solid #1a1a1a", boxShadow: "0 10px 15px rgba(0,0,0,0.05)" }
const pixInfoStyle: React.CSSProperties = { marginTop: "1.5rem", color: "#718096", fontStyle: "italic" }
/* =====================================================
   SIMULAÇÃO DE LICENCIAMENTO (ADMIN)
   POST /licenciamento/simular
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

  const [itemAcervoId, setItemAcervoId] = useState("")
  const [atletaId, setAtletaId] = useState("")
  const [tipoUso, setTipoUso] = useState("")
  const [prazoMeses, setPrazoMeses] = useState<number>(12)

  const [resultado, setResultado] = useState<ResultadoSimulacaoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
     CARREGAR ITENS PUBLICADOS
     ========================== */
  useEffect(() => {
    async function carregarItens() {
      try {
        const data = await itemAcervoService.listarPublicados()
        setItens(data)
      } catch (err) {
        console.error(err)
        setError("Não foi possível carregar os itens do acervo.")
      }
    }

    carregarItens()
  }, [])

  /* ==========================
     SELEÇÃO DE ITEM
     ========================== */
  function handleItemChange(id: string) {
    setItemAcervoId(id)

    const item = itens.find((i) => i.id === id)

    const atletaRelacionado =
      (item as unknown as { atletaId?: string })?.atletaId ?? ""

    setAtletaId(atletaRelacionado)
  }

  /* ==========================
     SIMULAR
     ========================== */
  async function handleSimular(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResultado(null)

    if (!itemAcervoId || !atletaId) {
      setError("Selecione um item válido com atleta vinculada.")
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

      const data = await (
        licenciamentoService as unknown as {
          simular: (
            payload: SimulacaoLicenciamentoDTO
          ) => Promise<ResultadoSimulacaoDTO>
        }
      ).simular(payload)

      setResultado(data)
    } catch (err) {
      console.error(err)
      setError("Erro ao realizar a simulação.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Simulação de Licenciamento</h1>
        <p>Calcule os repasses antes de efetivar a venda.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <form onSubmit={handleSimular} style={formStyle}>
          <label>Item do Acervo</label>
          <select
            value={itemAcervoId}
            onChange={(e) => handleItemChange(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {itens.map((item) => (
              <option key={item.id} value={item.id}>
                {item.titulo} — {item.atletaNome}
              </option>
            ))}
          </select>

          <label>Tipo de Uso</label>
          <input
            value={tipoUso}
            onChange={(e) => setTipoUso(e.target.value)}
            required
          />

          <label>Prazo (meses)</label>
          <input
            type="number"
            min={1}
            value={prazoMeses}
            onChange={(e) => setPrazoMeses(Number(e.target.value))}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Calculando..." : "Simular"}
          </button>
        </form>

        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {resultado && (
            <div style={resultBoxStyle}>
              <h2>{resultado.itemTitulo}</h2>
              <p>Valor Total: {formatarMoeda(resultado.valorTotal)}</p>
              <p style={{ color: "#27ae60" }}>
                Repasse Atleta: {formatarMoeda(resultado.repasseAtleta)}
              </p>
              <p>
                Comissão Plataforma:{" "}
                {formatarMoeda(resultado.comissaoPlataforma)}
              </p>
              <small>PIX: {resultado.chavePixAtleta}</small>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ==========================
   ESTILOS
   ========================== */
const formStyle: React.CSSProperties = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "8px",
}

const resultBoxStyle: React.CSSProperties = {
  background: "#fff",
  padding: "2rem",
  border: "2px solid #000",
}

const formatarMoeda = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

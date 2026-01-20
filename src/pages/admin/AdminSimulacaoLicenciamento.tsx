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
  const [tipoUso, setTipoUso] = useState("")
  const [valorBruto, setValorBruto] = useState<number>(0)

  const [resultado, setResultado] =
    useState<ResultadoSimulacaoDTO | null>(null)

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
        setError("Erro ao carregar itens do acervo.")
      })
  }, [])

  /* ==========================
     SIMULAR
     ========================== */
  async function handleSimular(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResultado(null)

    const payload: SimulacaoLicenciamentoDTO = {
      itemAcervoId,
      tipoUso,
      valorBruto,
    }

    try {
      setLoading(true)
      const data = await licenciamentoService.simular(payload)
      setResultado(data)
    } catch (err) {
      console.error("Erro ao simular licenciamento:", err)
      setError("Erro ao realizar simulação.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h1>Simulação de Licenciamento</h1>

      {/* ======================
          FORMULÁRIO
         ====================== */}
      <form
        onSubmit={handleSimular}
        style={{
          marginTop: "2rem",
          maxWidth: "520px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div>
          <label>Item do Acervo</label>
          <select
            value={itemAcervoId}
            onChange={(e) => setItemAcervoId(e.target.value)}
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

        <div>
          <label>Tipo de Uso</label>
          <input
            type="text"
            value={tipoUso}
            onChange={(e) => setTipoUso(e.target.value)}
            placeholder="Editorial, Educacional, Institucional..."
            required
          />
        </div>

        <div>
          <label>Valor Bruto (R$)</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={valorBruto}
            onChange={(e) => setValorBruto(Number(e.target.value))}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Simulando..." : "Simular"}
        </button>
      </form>

      {/* ======================
          RESULTADO
         ====================== */}
      {error && (
        <p style={{ color: "red", marginTop: "1.5rem" }}>{error}</p>
      )}

      {resultado && (
        <div
          style={{
            marginTop: "3rem",
            padding: "1.5rem",
            border: "1px solid #e5e5e5",
            borderRadius: "8px",
            maxWidth: "520px",
          }}
        >
          <h2>Resultado da Simulação</h2>

          <ResumoLinha
            label="Valor Bruto"
            valor={formatarMoeda(resultado.valorBruto)}
          />
          <ResumoLinha
            label="Repasse à Atleta"
            valor={formatarMoeda(resultado.valorAtleta)}
          />
          <ResumoLinha
            label="Comissão da Plataforma"
            valor={formatarMoeda(resultado.valorPlataforma)}
          />
          <ResumoLinha
            label="Percentual Atleta"
            valor={`${resultado.percentualAtleta}%`}
          />
          <ResumoLinha
            label="Percentual Plataforma"
            valor={`${resultado.percentualPlataforma}%`}
          />
        </div>
      )}
    </section>
  )
}

/* ======================
   COMPONENTES AUX
   ====================== */

function ResumoLinha({
  label,
  valor,
}: {
  label: string
  valor: string
}) {
  return (
    <p
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "0.6rem",
      }}
    >
      <strong>{label}</strong>
      <span>{valor}</span>
    </p>
  )
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

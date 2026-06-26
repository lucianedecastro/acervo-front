import { useEffect, useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { itemAcervoService } from "@/services/itemAcervoService"
import { ResultadoSimulacaoDTO, SimulacaoLicenciamentoDTO } from "@/types/licenciamento"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"
import { Calculator, CheckCircle } from "lucide-react"

export default function AdminSimulacaoLicenciamento() {
  const [itens, setItens] = useState<ItemAcervoResponseDTO[]>([])
  const [itemAcervoId, setItemAcervoId] = useState("")
  const [atletaId, setAtletaId] = useState("")
  const [tipoUso, setTipoUso] = useState("")
  const [prazoMeses, setPrazoMeses] = useState<number>(12)
  const [resultado, setResultado] = useState<ResultadoSimulacaoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  function handleItemChange(id: string) {
    setItemAcervoId(id)
    const item = itens.find((i) => i.id === id)
    const atletaRelacionado = (item as unknown as { atletaId?: string })?.atletaId ?? ""
    setAtletaId(atletaRelacionado)
  }

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
      const data = await licenciamentoService.simular(payload)
      setResultado(data)
    } catch (err) {
      console.error(err)
      setError("Erro ao realizar a simulação.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink flex items-center gap-3 mb-1">
          <Calculator size={24} className="text-acl-gold-deep" />
          Simulação de licenciamento
        </h1>
        <p className="text-acl-muted text-sm">
          Calcule os repasses antes de efetivar a venda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <form onSubmit={handleSimular} className="card-editorial p-6 space-y-5">

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Item do acervo</label>
            <select
              value={itemAcervoId}
              onChange={(e) => handleItemChange(e.target.value)}
              required
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
            >
              <option value="">Selecione...</option>
              {itens.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.titulo} — {(item as any).atletaNome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Tipo de uso</label>
            <input
              value={tipoUso}
              onChange={(e) => setTipoUso(e.target.value)}
              required
              placeholder="Ex: Editorial, Comercial, etc."
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
            />
          </div>

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Prazo (meses)</label>
            <input
              type="number"
              min={1}
              value={prazoMeses}
              onChange={(e) => setPrazoMeses(Number(e.target.value))}
              required
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Calculando..." : "Simular licenciamento"}
          </button>
        </form>

        {/* Resultado */}
        <div>
          {error && (
            <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-4 mb-4">
              <p className="text-acl-wine text-sm">{error}</p>
            </div>
          )}

          {resultado && (
            <div className="card-editorial p-6">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle size={20} className="text-green-600" />
                <h2 className="font-serif text-lg text-acl-ink">Simulação concluída</h2>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-acl-line">
                  <p className="text-xs text-acl-muted mb-1">Item</p>
                  <p className="text-base text-acl-ink">{resultado.itemTitulo}</p>
                </div>

                <div className="pb-4 border-b border-acl-line">
                  <p className="text-xs text-acl-muted mb-1">Valor total</p>
                  <p className="text-2xl font-serif text-acl-ink">
                    {resultado.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>

                <div className="pb-4 border-b border-acl-line">
                  <p className="text-xs text-acl-muted mb-1">Repasse atleta</p>
                  <p className="text-2xl font-serif text-acl-gold-deep">
                    {resultado.repasseAtleta.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>

                <div className="pb-4 border-b border-acl-line">
                  <p className="text-xs text-acl-muted mb-1">Comissão plataforma</p>
                  <p className="text-lg text-acl-ink-soft">
                    {resultado.comissaoPlataforma.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>

                <div className="bg-acl-cream rounded-sm p-4">
                  <p className="text-xs text-acl-muted mb-1">Chave Pix</p>
                  <p className="text-sm text-acl-ink-soft break-all">{resultado.chavePixAtleta}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
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
      const data = await (licenciamentoService as unknown as {
        simular: (payload: SimulacaoLicenciamentoDTO) => Promise<ResultadoSimulacaoDTO>
      }).simular(payload)
      setResultado(data)
    } catch (err) {
      console.error(err)
      setError("Erro ao realizar a simulação.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Calculator size={36} strokeWidth={3} className="sm:w-12 sm:h-12" />
          <span className="leading-tight">Simulação de Licenciamento</span>
        </h1>
        <p className="text-gray-600 font-bold text-sm sm:text-base lg:text-lg mt-3">
          Calcule os repasses antes de efetivar a venda.
        </p>
        <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-3"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Formulário */}
        <form onSubmit={handleSimular} className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">

          <div>
            <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">Item do Acervo</label>
            <select
              value={itemAcervoId}
              onChange={(e) => handleItemChange(e.target.value)}
              required
              className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            >
              <option value="">Selecione...</option>
              {itens.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.titulo} — {item.atletaNome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">Tipo de Uso</label>
            <input
              value={tipoUso}
              onChange={(e) => setTipoUso(e.target.value)}
              required
              placeholder="Ex: Editorial, Comercial, etc."
              className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">Prazo (meses)</label>
            <input
              type="number"
              min={1}
              value={prazoMeses}
              onChange={(e) => setPrazoMeses(Number(e.target.value))}
              required
              className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-[#D4A244] text-black font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Calculando..." : "Simular Licenciamento"}
          </button>
        </form>

        {/* Resultado */}
        <div>
          {error && (
            <div className="bg-red-500 border-4 sm:border-6 border-black rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-white font-black text-sm sm:text-base lg:text-lg uppercase">{error}</p>
            </div>
          )}

          {resultado && (
            <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <CheckCircle size={28} strokeWidth={3} className="text-green-600 sm:w-8 sm:h-8" />
                <h2 className="text-xl sm:text-2xl font-black uppercase">Simulação Concluída</h2>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b-4 border-gray-200">
                  <p className="text-xs sm:text-sm font-black uppercase text-gray-600 mb-1">Item</p>
                  <p className="text-lg sm:text-xl font-black">{resultado.itemTitulo}</p>
                </div>

                <div className="pb-4 border-b-4 border-gray-200">
                  <p className="text-xs sm:text-sm font-black uppercase text-gray-600 mb-1">Valor Total</p>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">
                    {resultado.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>

                <div className="pb-4 border-b-4 border-gray-200">
                  <p className="text-xs sm:text-sm font-black uppercase text-gray-600 mb-1">Repasse Atleta</p>
                  <p className="text-2xl sm:text-3xl font-black text-green-600">
                    {resultado.repasseAtleta.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>

                <div className="pb-4 border-b-4 border-gray-200">
                  <p className="text-xs sm:text-sm font-black uppercase text-gray-600 mb-1">Comissão Plataforma</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-700">
                    {resultado.comissaoPlataforma.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <p className="text-xs font-black uppercase text-gray-600 mb-1">Chave PIX</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-800 break-all">{resultado.chavePixAtleta}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

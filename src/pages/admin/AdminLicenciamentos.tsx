import { useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { ExtratoLicenciamentoDTO, TransacaoLicenciamentoDTO } from "@/types/licenciamento"
import { Search, DollarSign, ShoppingBag, FileText, Calendar, CheckCircle } from "lucide-react"

export default function AdminVendas() {
  const [atletaId, setAtletaId] = useState("")
  const [extrato, setExtrato] = useState<ExtratoLicenciamentoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleBuscar() {
    if (!atletaId) {
      setError("Informe o ID da atleta.")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await licenciamentoService.buscarExtratoConsolidado(atletaId)
      setExtrato(data)
    } catch (err) {
      console.error(err)
      setError("Não foi possível carregar o extrato da atleta.")
      setExtrato(null)
    } finally {
      setLoading(false)
    }
  }

  const volumeBruto = extrato?.transacoes.reduce((acc, t) => acc + t.valorTotal, 0) || 0

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black">
          Licenciamentos & Transações
        </h1>
        <p className="text-gray-600 font-bold text-sm sm:text-base mb-3">
          Consulta consolidada de vendas e repasses por atleta.
        </p>
        <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
      </div>

      {/* Card de Busca */}
      <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="ID da atleta"
            value={atletaId}
            onChange={(e) => setAtletaId(e.target.value)}
            className="flex-1 px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
          />
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="px-6 py-3 bg-[#D4A244] text-black font-black uppercase text-xs border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Search size={18} strokeWidth={3} />
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-100 border-4 border-red-500 rounded-xl p-4">
          <p className="text-red-700 font-black text-sm">{error}</p>
        </div>
      )}

      {/* Resultado */}
      {extrato && (
        <>
          {/* Cards Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 - Saldo */}
            <div className="bg-black text-white border-4 sm:border-6 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(212,162,68,1)] hover:shadow-[4px_4px_0px_0px_rgba(212,162,68,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={24} strokeWidth={3} className="text-[#D4A244]" />
                <p className="text-xs font-black uppercase text-gray-400">Saldo Consolidado</p>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#D4A244]">
                {extrato.saldoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>

            {/* Card 2 - Volume Bruto */}
            <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag size={24} strokeWidth={3} className="text-black" />
                <p className="text-xs font-black uppercase text-gray-500">Volume Bruto</p>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-black">
                {volumeBruto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>

            {/* Card 3 - Licenças */}
            <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={24} strokeWidth={3} className="text-black" />
                <p className="text-xs font-black uppercase text-gray-500">Licenças Emitidas</p>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-black">{extrato.transacoes.length}</p>
            </div>
          </div>

          {/* Tabela Desktop / Cards Mobile */}
          <div className="bg-white border-4 sm:border-6 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            {extrato.transacoes.length === 0 ? (
              <div className="p-8 sm:p-16 text-center">
                <p className="text-lg sm:text-xl font-black uppercase text-gray-500">Nenhuma transação encontrada.</p>
              </div>
            ) : (
              <>
                {/* TABELA - DESKTOP (≥768px) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-black text-white border-b-4 border-black">
                        <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Data</th>
                        <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Item</th>
                        <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Licença</th>
                        <th className="text-right p-4 font-black uppercase text-xs tracking-wider">Total</th>
                        <th className="text-right p-4 font-black uppercase text-xs tracking-wider">Repasse</th>
                        <th className="text-center p-4 font-black uppercase text-xs tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extrato.transacoes.map((t: TransacaoLicenciamentoDTO, index) => (
                        <tr
                          key={t.id}
                          className={`border-b-4 border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} strokeWidth={3} className="text-gray-500" />
                              <span className="font-bold text-sm">
                                {new Date(t.dataTransacao).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <code className="text-xs font-bold text-gray-600">{t.itemAcervoId}</code>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-gray-200 border-2 border-black rounded-md font-black text-xs uppercase">
                              {t.tipoLicenca}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-sm">
                            {t.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="p-4 text-right font-black text-sm text-green-600">
                            {t.valorRepasseAtleta.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 border-2 border-black rounded-md font-black text-xs uppercase ${t.status === "APROVADO" ? "bg-green-400" : "bg-yellow-300"
                              }`}>
                              <CheckCircle size={14} strokeWidth={3} />
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CARDS - MOBILE (<768px) */}
                <div className="md:hidden divide-y-4 divide-gray-200">
                  {extrato.transacoes.map((t: TransacaoLicenciamentoDTO) => (
                    <div key={t.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} strokeWidth={3} className="text-gray-500" />
                          <span className="text-xs font-bold text-gray-500">
                            {new Date(t.dataTransacao).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <span className={`px-2 py-1 border-2 border-black rounded-md font-black text-[10px] uppercase ${t.status === "APROVADO" ? "bg-green-400" : "bg-yellow-300"
                          }`}>
                          {t.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">
                          <strong className="font-black">Item:</strong> <code>{t.itemAcervoId}</code>
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong className="font-black">Licença:</strong> {t.tipoLicenca}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total</p>
                          <p className="font-bold text-sm">
                            {t.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Repasse</p>
                          <p className="font-black text-sm text-green-600">
                            {t.valorRepasseAtleta.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

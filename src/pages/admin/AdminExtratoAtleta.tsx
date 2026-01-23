import { useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { ExtratoLicenciamentoDTO } from "@/types/licenciamento"
import { Search, FileText } from "lucide-react"

export default function AdminExtratoAtleta() {
  const [atletaId, setAtletaId] = useState("")
  const [extrato, setExtrato] = useState<ExtratoLicenciamentoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleBuscar() {
    const id = atletaId.trim()

    if (!id) {
      setError("Por favor, informe o ID da atleta para consulta.")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await licenciamentoService.buscarExtratoConsolidado(id)
      setExtrato(data)
    } catch (err) {
      console.error("Erro ao buscar extrato administrativo:", err)
      setError("Não foi possível localizar o extrato para o ID informado.")
      setExtrato(null)
    } finally {
      setLoading(false)
    }
  }

  const volumeBruto = extrato?.transacoes.reduce((acc, t) => acc + t.valorTotal, 0) ?? 0

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <FileText size={36} strokeWidth={3} className="sm:w-12 sm:h-12" />
          <span className="leading-tight">Auditoria de Extratos</span>
        </h1>
        <p className="text-gray-600 font-bold text-sm sm:text-base lg:text-lg mt-3">
          Consulta consolidada de saldos e histórico por atleta.
        </p>
        <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-3"></div>
      </div>

      {/* Busca */}
      <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            value={atletaId}
            onChange={(e) => setAtletaId(e.target.value)}
            placeholder="ID da atleta"
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-4 border-gray-300 rounded-lg font-bold text-base sm:text-lg focus:outline-none focus:border-[#D4A244] transition-colors"
          />
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-[#D4A244] text-black font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50"
          >
            <Search size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 border-4 sm:border-6 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-white font-black text-sm sm:text-base lg:text-lg uppercase">{error}</p>
        </div>
      )}

      {extrato && (
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl sm:text-3xl font-black uppercase mb-6 sm:mb-8 pb-4 border-b-4 border-gray-200">
            {extrato.nomeAtleta}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-green-100 border-4 border-green-600 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm font-black uppercase text-green-700 mb-2">Saldo Total</p>
              <p className="text-3xl sm:text-4xl font-black text-green-700">
                {extrato.saldoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>

            <div className="bg-blue-100 border-4 border-blue-600 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm font-black uppercase text-blue-700 mb-2">Volume Bruto</p>
              <p className="text-3xl sm:text-4xl font-black text-blue-700">
                {volumeBruto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

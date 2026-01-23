import { useEffect, useState } from "react"
import { atletaService } from "@/services/atletaService"
import { DashboardAtletaDTO } from "@/types/atleta"
import { Wallet, ShoppingBag, Image, FileText, Clock, Edit } from "lucide-react"

export default function AtletaDashboard() {
  const [data, setData] = useState<DashboardAtletaDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        const dashboard = await atletaService.buscarDashboard()
        setData(dashboard)
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err)
        setError("Não foi possível carregar seus dados financeiros no momento.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Sincronizando com o acervo...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-black text-red-600 mb-4 uppercase">{error || "Erro ao carregar dashboard."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black">
          Meu Painel Financeiro
        </h1>
        <p className="text-gray-600 font-bold text-sm sm:text-base mb-3">
          Acompanhamento de vendas e acervo em tempo real
        </p>
        <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
      </div>

      {/* Grid Principal - Cards Financeiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 - Saldo Total */}
        <div className="bg-black border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(212,162,68,1)] sm:shadow-[8px_8px_0px_0px_rgba(212,162,68,1)] hover:shadow-[4px_4px_0px_0px_rgba(212,162,68,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Wallet size={28} strokeWidth={3} className="text-[#D4A244]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
            Saldo Total Disponível
          </p>
          <p className="text-2xl sm:text-3xl font-black text-[#D4A244] break-words">
            {data.saldoTotalAtleta.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        {/* Card 2 - Licenciamentos */}
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag size={28} strokeWidth={3} className="text-gray-700" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
            Licenciamentos Vendidos
          </p>
          <p className="text-4xl sm:text-5xl font-black text-black">
            {data.totalLicenciamentosVendidos}
          </p>
        </div>

        {/* Card 3 - Itens Publicados */}
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Image size={28} strokeWidth={3} className="text-gray-700" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
            Itens Publicados
          </p>
          <p className="text-4xl sm:text-5xl font-black text-black">
            {data.itensPublicados}
          </p>
        </div>

        {/* Card 4 - Total no Acervo */}
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <FileText size={28} strokeWidth={3} className="text-gray-700" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
            Total no Acervo
          </p>
          <p className="text-4xl sm:text-5xl font-black text-black">
            {data.totalMeusItens}
          </p>
        </div>
      </div>

      {/* Grid Secundário - Detalhamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card Memorial */}
        <div className="bg-[#D4A244] border-4 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-gray-800 mb-2">
                Em Memorial
              </p>
              <p className="text-3xl font-black text-black">
                {data.itensNoMemorial}
              </p>
            </div>
            <Clock size={32} strokeWidth={3} className="text-black" />
          </div>
        </div>

        {/* Card Rascunho */}
        <div className="bg-white border-4 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Em Rascunho
              </p>
              <p className="text-3xl font-black text-black">
                {data.itensEmRascunho}
              </p>
            </div>
            <Edit size={32} strokeWidth={3} className="text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  )
}

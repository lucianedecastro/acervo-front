import { useEffect, useState } from "react"
import { Users, Package, Trophy, Clock, DollarSign, Percent } from "lucide-react"

interface DashboardStats {
  totalAtletas: number
  itensNoAcervo: number
  modalidades: number
  itensAguardandoPublicacao: number
  faturamentoBruto: number
  comissoesPlataforma: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAtletas: 4,
    itensNoAcervo: 5,
    modalidades: 11,
    itensAguardandoPublicacao: 0,
    faturamentoBruto: 1500.0,
    comissoesPlataforma: 225.0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Aqui você faria a chamada real à API
    // const data = await dashboardService.buscarEstatisticas()
    // setStats(data)
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">
            Carregando estatísticas...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="border-b-4 border-black pb-4 sm:pb-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-3 sm:mb-4 text-black leading-tight">
          Dashboard Administrativo
        </h1>
        <div className="w-24 sm:w-32 h-1 bg-black rounded-full"></div>
      </div>

      {/* Grid de Métricas - Primeira Linha (Cards Brancos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Card 1 - Total de Atletas */}
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Users size={28} strokeWidth={3} className="text-gray-700 sm:w-9 sm:h-9" />
          </div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
            Total de Atletas
          </p>
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-black">
            {stats.totalAtletas}
          </p>
        </div>

        {/* Card 2 - Itens no Acervo */}
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Package size={28} strokeWidth={3} className="text-gray-700 sm:w-9 sm:h-9" />
          </div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
            Itens no Acervo
          </p>
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-black">
            {stats.itensNoAcervo}
          </p>
        </div>

        {/* Card 3 - Modalidades */}
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Trophy size={28} strokeWidth={3} className="text-gray-700 sm:w-9 sm:h-9" />
          </div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
            Modalidades
          </p>
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-black">
            {stats.modalidades}
          </p>
        </div>
      </div>

      {/* Segunda Linha - Cards Coloridos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Card 4 - Aguardando Publicação (Dourado) */}
        <div className="bg-[#D4A244] border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Clock size={28} strokeWidth={3} className="text-black sm:w-9 sm:h-9" />
          </div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-wide text-gray-800 mb-2">
            Itens Aguardando Publicação
          </p>
          <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-black">
            {stats.itensAguardandoPublicacao}
          </p>
        </div>

        {/* Card 5 - Faturamento Bruto (Preto) */}
        <div className="bg-black border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(212,162,68,1)] hover:shadow-[4px_4px_0px_0px_rgba(212,162,68,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <DollarSign size={28} strokeWidth={3} className="text-[#D4A244] sm:w-9 sm:h-9" />
          </div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-400 mb-2">
            Faturamento Bruto
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white break-words">
            {stats.faturamentoBruto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        {/* Card 6 - Comissões da Plataforma (Preto) */}
        <div className="bg-black border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(212,162,68,1)] hover:shadow-[4px_4px_0px_0px_rgba(212,162,68,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Percent size={28} strokeWidth={3} className="text-[#D4A244] sm:w-9 sm:h-9" />
          </div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-400 mb-2">
            Comissões da Plataforma
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white break-words">
            {stats.comissoesPlataforma.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

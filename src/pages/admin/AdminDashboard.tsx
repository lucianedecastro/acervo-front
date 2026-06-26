import { useEffect, useState } from "react"
import { Users, Package, Trophy, Clock, DollarSign, Percent } from "lucide-react"
import { adminDashboardService, AdminDashboardStatsDTO } from "@/services/adminDashboardService"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStatsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminDashboardService
      .obterResumo()
      .then(setStats)
      .catch((err) => {
        console.error("Erro ao carregar estatísticas do dashboard:", err)
        setError("Não foi possível carregar as estatísticas no momento.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
          <p className="text-sm text-acl-muted">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <p className="text-acl-wine text-sm text-center">
          {error || "Estatísticas indisponíveis."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-acl-line pb-5">
        <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink">
          Dashboard administrativo
        </h1>
      </div>

      {/* Primeira linha — contagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="card-editorial p-6">
          <Users size={22} strokeWidth={1.5} className="text-acl-ink-soft mb-3" />
          <p className="text-xs text-acl-muted mb-2">Total de atletas</p>
          <p className="text-3xl sm:text-4xl font-serif text-acl-ink">{stats.totalAtletas}</p>
        </div>

        <div className="card-editorial p-6">
          <Package size={22} strokeWidth={1.5} className="text-acl-ink-soft mb-3" />
          <p className="text-xs text-acl-muted mb-2">Itens no acervo</p>
          <p className="text-3xl sm:text-4xl font-serif text-acl-ink">{stats.totalItensAcervo}</p>
        </div>

        <div className="card-editorial p-6">
          <Trophy size={22} strokeWidth={1.5} className="text-acl-ink-soft mb-3" />
          <p className="text-xs text-acl-muted mb-2">Modalidades</p>
          <p className="text-3xl sm:text-4xl font-serif text-acl-ink">{stats.totalModalidades}</p>
        </div>
      </div>

      {/* Segunda linha — atenção e financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="card-editorial p-6 border-acl-gold-deep">
          <Clock size={22} strokeWidth={1.5} className="text-acl-gold-deep mb-3" />
          <p className="text-xs text-acl-muted mb-2">Itens aguardando publicação</p>
          <p className="text-3xl sm:text-4xl font-serif text-acl-ink">{stats.itensAguardandoPublicacao}</p>
        </div>

        <div className="bg-acl-ink rounded p-6">
          <DollarSign size={22} strokeWidth={1.5} className="text-acl-gold mb-3" />
          <p className="text-xs text-acl-cream/60 mb-2">Faturamento bruto</p>
          <p className="text-2xl sm:text-3xl font-serif text-acl-cream break-words">
            {stats.faturamentoTotalBruto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        <div className="bg-acl-ink rounded p-6">
          <Percent size={22} strokeWidth={1.5} className="text-acl-gold mb-3" />
          <p className="text-xs text-acl-cream/60 mb-2">Comissões da plataforma</p>
          <p className="text-2xl sm:text-3xl font-serif text-acl-cream break-words">
            {stats.totalComissoesPlataforma.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
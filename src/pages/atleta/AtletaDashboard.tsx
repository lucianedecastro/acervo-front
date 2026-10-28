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
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <div className="text-center">
          <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" aria-hidden="true" />
          <p className="text-sm text-acl-muted">Carregando seus dados...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <p className="text-acl-wine text-sm text-center" role="alert">
          {error || "Erro ao carregar o painel."}
        </p>
      </div>
    )
  }

  const moeda = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="space-y-8">
      <div className="border-b border-acl-line pb-5">
        <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink">Meu painel</h1>
        <p className="text-acl-muted text-sm mt-1">Acompanhamento de vendas e do seu acervo</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-acl-ink rounded p-6">
          <Wallet size={22} strokeWidth={1.5} className="text-acl-gold mb-3" aria-hidden="true" />
          <p className="text-xs text-acl-cream/70 mb-2">Saldo total disponível</p>
          <p className="text-2xl sm:text-3xl font-serif text-acl-cream break-words">
            {moeda(data.saldoTotalAtleta)}
          </p>
        </div>

        <div className="card-editorial p-6">
          <ShoppingBag size={22} strokeWidth={1.5} className="text-acl-ink-soft mb-3" aria-hidden="true" />
          <p className="text-xs text-acl-muted mb-2">Licenciamentos vendidos</p>
          <p className="text-3xl sm:text-4xl font-serif text-acl-ink">{data.totalLicenciamentosVendidos}</p>
        </div>

        <div className="card-editorial p-6">
          <Image size={22} strokeWidth={1.5} className="text-acl-ink-soft mb-3" aria-hidden="true" />
          <p className="text-xs text-acl-muted mb-2">Itens publicados</p>
          <p className="text-3xl sm:text-4xl font-serif text-acl-ink">{data.itensPublicados}</p>
        </div>

        <div className="card-editorial p-6">
          <FileText size={22} strokeWidth={1.5} className="text-acl-ink-soft mb-3" aria-hidden="true" />
          <p className="text-xs text-acl-muted mb-2">Total no acervo</p>
          <p className="text-3xl sm:text-4xl font-serif text-acl-ink">{data.totalMeusItens}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="card-editorial p-6 border-acl-gold-deep flex items-center justify-between">
          <div>
            <p className="text-xs text-acl-muted mb-2">Em memorial</p>
            <p className="text-3xl font-serif text-acl-ink">{data.itensNoMemorial}</p>
          </div>
          <Clock size={26} strokeWidth={1.5} className="text-acl-gold-text" aria-hidden="true" />
        </div>

        <div className="card-editorial p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-acl-muted mb-2">Em rascunho</p>
            <p className="text-3xl font-serif text-acl-ink">{data.itensEmRascunho}</p>
          </div>
          <Edit size={26} strokeWidth={1.5} className="text-acl-ink-soft" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

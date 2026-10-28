import { useEffect, useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { atletaService } from "@/services/atletaService"
import { TransacaoLicenciamentoDTO } from "@/types/licenciamento"
import { DollarSign, Calendar, FileText, CheckCircle, Clock } from "lucide-react"

export default function AtletaExtrato() {
  const [transacoes, setTransacoes] = useState<TransacaoLicenciamentoDTO[]>([])
  const [nomeAtleta, setNomeAtleta] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        const atleta = await atletaService.buscarMeuPerfil()
        setNomeAtleta(atleta.nome)

        const data = await licenciamentoService.buscarExtratoPorAtleta(atleta.id)
        setTransacoes(data)
      } catch (err) {
        console.error(err)
        setError("Erro ao carregar extrato.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  const saldo = transacoes.reduce((acc, t) => acc + t.valorRepasseAtleta, 0)

  const moeda = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const estiloStatus = (status: string) =>
    status === "APROVADO" ? "bg-green-50 text-green-700" : "bg-acl-gold/15 text-acl-gold-text"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <div className="text-center">
          <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" aria-hidden="true" />
          <p className="text-sm text-acl-muted">Carregando extrato...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <p className="text-acl-wine text-sm text-center" role="alert">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-acl-line pb-5">
        <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink">Meu extrato</h1>
        <p className="text-acl-muted text-sm mt-1">Atleta: {nomeAtleta}</p>
      </div>

      <div className="bg-acl-ink rounded p-6">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={22} strokeWidth={1.5} className="text-acl-gold" aria-hidden="true" />
          <p className="text-xs text-acl-cream/70">Saldo total</p>
        </div>
        <p className="text-3xl sm:text-4xl font-serif text-acl-gold">{moeda(saldo)}</p>
      </div>

      {transacoes.length === 0 ? (
        <div className="card-editorial p-12 text-center">
          <p className="text-sm text-acl-muted">Nenhuma transação registrada.</p>
        </div>
      ) : (
        <div className="card-editorial overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">Transações de licenciamento e valores de repasse</caption>
              <thead>
                <tr className="border-b border-acl-line">
                  <th scope="col" className="text-left p-4 text-xs text-acl-muted">Data</th>
                  <th scope="col" className="text-left p-4 text-xs text-acl-muted">Item</th>
                  <th scope="col" className="text-left p-4 text-xs text-acl-muted">Licença</th>
                  <th scope="col" className="text-right p-4 text-xs text-acl-muted">Valor total</th>
                  <th scope="col" className="text-right p-4 text-xs text-acl-muted">Seu repasse</th>
                  <th scope="col" className="text-center p-4 text-xs text-acl-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t) => (
                  <tr key={t.id} className="border-b border-acl-line">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-acl-muted" aria-hidden="true" />
                        <span className="text-sm text-acl-ink-soft">
                          {new Date(t.dataTransacao).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-xs text-acl-muted">{t.itemAcervoId}</code>
                    </td>
                    <td className="p-4 text-sm text-acl-ink-soft">{t.tipoLicenca}</td>
                    <td className="p-4 text-right text-sm text-acl-ink">{moeda(t.valorTotal)}</td>
                    <td className="p-4 text-right font-serif text-base text-green-700">{moeda(t.valorRepasseAtleta)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs ${estiloStatus(t.status)}`}>
                        {t.status === "APROVADO"
                          ? <CheckCircle size={12} aria-hidden="true" />
                          : <Clock size={12} aria-hidden="true" />}
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-acl-line">
            {transacoes.map((t) => (
              <div key={t.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-acl-muted mb-1">Data</p>
                    <p className="text-sm text-acl-ink">{new Date(t.dataTransacao).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-sm text-[11px] ${estiloStatus(t.status)}`}>{t.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-acl-muted mb-1">Licença</p>
                    <p className="text-acl-ink">{t.tipoLicenca}</p>
                  </div>
                  <div>
                    <p className="text-xs text-acl-muted mb-1">Valor total</p>
                    <p className="text-acl-ink">{moeda(t.valorTotal)}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-acl-line">
                  <p className="text-xs text-acl-muted mb-1">Seu repasse</p>
                  <p className="text-xl font-serif text-green-700">{moeda(t.valorRepasseAtleta)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

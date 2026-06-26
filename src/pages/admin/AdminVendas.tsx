import { useEffect, useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { TransacaoLicenciamentoDTO } from "@/types/licenciamento"
import { DollarSign, Search, Calendar, CheckCircle, X } from "lucide-react"

const statusLabel: Record<string, string> = {
  APROVADO: "Aprovado",
  PENDENTE: "Pendente",
  CANCELADO: "Cancelado",
}

export default function AdminVendas() {
  const [vendas, setVendas] = useState<TransacaoLicenciamentoDTO[]>([])
  const [vendasFiltradas, setVendasFiltradas] = useState<TransacaoLicenciamentoDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [atletaId, setAtletaId] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<string>("TODOS")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  useEffect(() => {
    licenciamentoService
      .listarTodasTransacoes()
      .then(data => {
        setVendas(data)
        setVendasFiltradas(data)
      })
      .catch((err) => {
        console.error("Erro ao carregar vendas:", err)
        setError("Erro ao carregar licenciamentos.")
      })
      .finally(() => setLoading(false))
  }, [])

  function aplicarFiltros() {
    let resultado = [...vendas]

    if (atletaId.trim()) {
      resultado = resultado.filter(v =>
        v.atletaId.toLowerCase().includes(atletaId.toLowerCase())
      )
    }

    if (statusFiltro !== "TODOS") {
      resultado = resultado.filter(v => v.status === statusFiltro)
    }

    if (dataInicio) {
      resultado = resultado.filter(v =>
        new Date(v.dataTransacao) >= new Date(dataInicio)
      )
    }

    if (dataFim) {
      resultado = resultado.filter(v =>
        new Date(v.dataTransacao) <= new Date(dataFim)
      )
    }

    setVendasFiltradas(resultado)
  }

  function limparFiltros() {
    setAtletaId("")
    setStatusFiltro("TODOS")
    setDataInicio("")
    setDataFim("")
    setVendasFiltradas(vendas)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
          <p className="text-sm text-acl-muted">Carregando vendas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-acl-wine text-sm">{error}</p>
      </div>
    )
  }

  const totalVendas = vendasFiltradas.reduce((acc, v) => acc + v.valorTotal, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink mb-1">
          Licenciamentos e transações
        </h1>
        <p className="text-acl-muted text-sm">
          Consulta consolidada de vendas e repasses por atleta.
        </p>
      </div>

      {/* Card de Busca */}
      <div className="card-editorial p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={atletaId}
            onChange={e => setAtletaId(e.target.value)}
            placeholder="ID da atleta"
            className="flex-1 px-3 py-2.5 border border-acl-line rounded-sm text-sm focus:outline-none focus:border-acl-gold-deep"
          />
          <button
            onClick={aplicarFiltros}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Search size={15} />
            Buscar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value)}
            className="px-3 py-2 border border-acl-line rounded-sm text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
          >
            <option value="TODOS">Todos os status</option>
            <option value="APROVADO">Aprovado</option>
            <option value="PENDENTE">Pendente</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          <input
            type="date"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
            className="px-3 py-2 border border-acl-line rounded-sm text-sm focus:outline-none focus:border-acl-gold-deep"
          />

          <input
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
            className="px-3 py-2 border border-acl-line rounded-sm text-sm focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={limparFiltros}
            className="px-4 py-2 text-xs text-acl-ink-soft hover:text-acl-gold-deep transition-colors flex items-center gap-2"
          >
            <X size={14} />
            Limpar
          </button>
        </div>
      </div>

      {/* Card Resumo */}
      <div className="bg-acl-ink rounded p-6">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={20} className="text-acl-gold" />
          <span className="text-xs text-acl-cream/60">Total faturado</span>
        </div>
        <p className="text-3xl sm:text-4xl font-serif text-acl-gold">
          {totalVendas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <p className="text-xs text-acl-cream/50 mt-2">
          {vendasFiltradas.length} transação(ões) encontrada(s)
        </p>
      </div>

      {/* Tabela */}
      <div className="card-editorial overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-acl-line">
                <th className="text-left p-4 text-xs text-acl-muted">Data</th>
                <th className="text-left p-4 text-xs text-acl-muted">Atleta ID</th>
                <th className="text-left p-4 text-xs text-acl-muted">Item ID</th>
                <th className="text-right p-4 text-xs text-acl-muted">Valor</th>
                <th className="text-center p-4 text-xs text-acl-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <p className="text-sm text-acl-muted">Nenhuma venda encontrada.</p>
                  </td>
                </tr>
              ) : (
                vendasFiltradas.map((v) => (
                  <tr key={v.id} className="border-b border-acl-line">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-acl-muted" />
                        <span className="text-sm text-acl-ink-soft">
                          {new Date(v.dataTransacao).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-xs text-acl-muted">{v.atletaId}</code>
                    </td>
                    <td className="p-4">
                      <code className="text-xs text-acl-muted">{v.itemAcervoId}</code>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm text-acl-ink">
                        {v.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs ${
                        v.status === "APROVADO" ? "bg-green-50 text-green-700" : "bg-acl-gold/15 text-acl-gold-deep"
                      }`}>
                        <CheckCircle size={12} />
                        {statusLabel[v.status] ?? v.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {vendasFiltradas.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-acl-muted">Nenhuma venda encontrada.</p>
            </div>
          ) : (
            <div className="divide-y divide-acl-line">
              {vendasFiltradas.map((v) => (
                <div key={v.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-acl-muted" />
                      <span className="text-xs text-acl-muted">
                        {new Date(v.dataTransacao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-sm text-[11px] ${
                      v.status === "APROVADO" ? "bg-green-50 text-green-700" : "bg-acl-gold/15 text-acl-gold-deep"
                    }`}>
                      {statusLabel[v.status] ?? v.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-acl-muted">
                      Atleta: <code>{v.atletaId}</code>
                    </p>
                    <p className="text-xs text-acl-muted">
                      Item: <code>{v.itemAcervoId}</code>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-acl-line">
                    <p className="text-xs text-acl-muted mb-1">Valor total</p>
                    <p className="text-lg font-serif text-acl-gold-deep">
                      {v.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
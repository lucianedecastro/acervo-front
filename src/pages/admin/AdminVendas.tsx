import { useEffect, useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { TransacaoLicenciamentoDTO } from "@/types/licenciamento"
import { DollarSign, Search, Filter, Calendar, CheckCircle, X } from "lucide-react"

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
      .listarTransacoesPorAtleta("geral")
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
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Carregando vendas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg sm:text-xl font-black text-red-600 uppercase text-center">{error}</p>
      </div>
    )
  }

  const totalVendas = vendasFiltradas.reduce((acc, v) => acc + v.valorTotal, 0)

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
        <div className="space-y-4">
          {/* Linha 1: Input + Botão Buscar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={atletaId}
              onChange={e => setAtletaId(e.target.value)}
              placeholder="ID da atleta"
              className="flex-1 px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            />
            <button
              onClick={aplicarFiltros}
              className="px-6 py-3 bg-[#D4A244] text-black font-black uppercase text-xs border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Search size={18} strokeWidth={3} />
              Buscar
            </button>
          </div>

          {/* Linha 2: Filtros Adicionais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={statusFiltro}
              onChange={e => setStatusFiltro(e.target.value)}
              className="px-3 py-2 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="APROVADO">APROVADO</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>

            <input
              type="date"
              value={dataInicio}
              onChange={e => setDataInicio(e.target.value)}
              className="px-3 py-2 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            />

            <input
              type="date"
              value={dataFim}
              onChange={e => setDataFim(e.target.value)}
              className="px-3 py-2 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            />
          </div>

          {/* Linha 3: Botão Limpar */}
          <div className="flex justify-end">
            <button
              onClick={limparFiltros}
              className="px-4 py-2 bg-gray-200 text-black font-black uppercase text-xs border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <X size={16} strokeWidth={3} />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Card Resumo */}
      <div className="bg-black text-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(212,162,68,1)] sm:shadow-[10px_10px_0px_0px_rgba(212,162,68,1)]">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign size={32} strokeWidth={3} className="text-[#D4A244]" />
          <span className="text-xs sm:text-sm font-black uppercase text-gray-400">Total Faturado</span>
        </div>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#D4A244]">
          {totalVendas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <p className="text-xs text-gray-400 mt-2 font-bold">
          {vendasFiltradas.length} transação(ões) encontrada(s)
        </p>
      </div>

      {/* Tabela */}
      <div className="bg-white border-4 sm:border-6 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white border-b-4 border-black">
                <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Data</th>
                <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Atleta ID</th>
                <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Item ID</th>
                <th className="text-right p-4 font-black uppercase text-xs tracking-wider">Valor</th>
                <th className="text-center p-4 font-black uppercase text-xs tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 sm:p-16 text-center">
                    <p className="text-lg sm:text-xl font-black uppercase text-gray-500">Nenhuma venda encontrada.</p>
                  </td>
                </tr>
              ) : (
                vendasFiltradas.map((v, index) => (
                  <tr
                    key={v.id}
                    className={`border-b-4 border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} strokeWidth={3} className="text-gray-500" />
                        <span className="font-bold text-sm">
                          {new Date(v.dataTransacao).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-xs font-bold text-gray-600">{v.atletaId}</code>
                    </td>
                    <td className="p-4">
                      <code className="text-xs font-bold text-gray-600">{v.itemAcervoId}</code>
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-block px-3 py-1 bg-[#D4A244] border-2 border-black rounded-md font-black text-xs">
                        {v.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 border-2 border-black rounded-md font-black text-xs uppercase ${v.status === "APROVADO" ? "bg-green-400" : "bg-yellow-300"
                        }`}>
                        <CheckCircle size={14} strokeWidth={3} />
                        {v.status}
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
              <p className="text-lg font-black uppercase text-gray-500">Nenhuma venda encontrada.</p>
            </div>
          ) : (
            <div className="divide-y-4 divide-gray-200">
              {vendasFiltradas.map((v) => (
                <div key={v.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} strokeWidth={3} className="text-gray-500" />
                      <span className="text-xs font-bold text-gray-500">
                        {new Date(v.dataTransacao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <span className={`px-2 py-1 border-2 border-black rounded-md font-black text-[10px] uppercase ${v.status === "APROVADO" ? "bg-green-400" : "bg-yellow-300"
                      }`}>
                      {v.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">
                      <strong className="font-black">Atleta:</strong> <code>{v.atletaId}</code>
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong className="font-black">Item:</strong> <code>{v.itemAcervoId}</code>
                    </p>
                  </div>

                  <div className="pt-2 border-t-2 border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Valor Total</p>
                    <p className="text-xl font-black text-[#D4A244]">
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

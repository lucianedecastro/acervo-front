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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Carregando extrato...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg font-black text-red-600 uppercase">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black">
          Meu Extrato
        </h1>
        <p className="text-gray-600 font-bold text-sm sm:text-base mb-3">
          Atleta: {nomeAtleta}
        </p>
        <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
      </div>

      {/* Card Saldo Total */}
      <div className="bg-black border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(212,162,68,1)] sm:shadow-[10px_10px_0px_0px_rgba(212,162,68,1)]">
        <div className="flex items-center gap-3 mb-3">
          <DollarSign size={32} strokeWidth={3} className="text-[#D4A244]" />
          <h2 className="text-xl sm:text-2xl font-black uppercase text-gray-400">Saldo Total</h2>
        </div>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#D4A244]">
          {saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      {/* Tabela de Transações */}
      {transacoes.length === 0 ? (
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-8 sm:p-16 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-lg font-black uppercase text-gray-500">Nenhuma transação registrada.</p>
        </div>
      ) : (
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          {/* TABELA - DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white border-b-4 border-black">
                  <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Data</th>
                  <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Item ID</th>
                  <th className="text-left p-4 font-black uppercase text-xs tracking-wider">Licença</th>
                  <th className="text-right p-4 font-black uppercase text-xs tracking-wider">Valor Total</th>
                  <th className="text-right p-4 font-black uppercase text-xs tracking-wider">Seu Repasse</th>
                  <th className="text-center p-4 font-black uppercase text-xs tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t, index) => (
                  <tr
                    key={t.id}
                    className={`border-b-4 border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
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
                      {t.valorTotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="p-4 text-right font-black text-base text-green-600">
                      {t.valorRepasseAtleta.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 border-2 border-black rounded-md font-black text-xs uppercase ${t.status === "APROVADO" ? "bg-green-400" : "bg-yellow-300"
                          }`}
                      >
                        {t.status === "APROVADO" ? (
                          <CheckCircle size={14} strokeWidth={3} />
                        ) : (
                          <Clock size={14} strokeWidth={3} />
                        )}
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARDS - MOBILE */}
          <div className="md:hidden divide-y-4 divide-gray-200">
            {transacoes.map((t) => (
              <div key={t.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-black uppercase text-gray-500 mb-1">Data</p>
                    <p className="text-sm font-bold">
                      {new Date(t.dataTransacao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 border-2 border-black rounded-md font-black text-[10px] uppercase ${t.status === "APROVADO" ? "bg-green-400" : "bg-yellow-300"
                      }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs font-black uppercase text-gray-500 mb-1">Licença</p>
                    <p className="font-bold">{t.tipoLicenca}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-gray-500 mb-1">Valor Total</p>
                    <p className="font-bold">
                      {t.valorTotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t-2 border-gray-200">
                  <p className="text-xs font-black uppercase text-green-600 mb-1">Seu Repasse</p>
                  <p className="text-xl font-black text-green-600">
                    {t.valorRepasseAtleta.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

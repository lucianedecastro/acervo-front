import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { itemAcervoService } from "@/services/itemAcervoService"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"
import { ArrowLeft, User, Building2, CreditCard, FileCheck, Package } from "lucide-react"

export default function AtletaPerfil() {
  const navigate = useNavigate()
  const [atleta, setAtleta] = useState<any | null>(null)
  const [itensAcervo, setItensAcervo] = useState<ItemAcervoResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setLoading(true)
        setError(null)

        const dadosAtleta = await atletaService.buscarMeuPerfil()

        if (!dadosAtleta || !dadosAtleta.id) {
          throw new Error("Identificação da atleta não encontrada.")
        }

        const itens = await itemAcervoService.listarPorAtleta(dadosAtleta.id)

        setAtleta(dadosAtleta)
        setItensAcervo(itens)
      } catch (err) {
        console.error("Erro ao carregar perfil da atleta:", err)
        setError("Não foi possível carregar seu perfil.")
      } finally {
        setLoading(false)
      }
    }

    carregarPerfil()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Sincronizando seus dados...</p>
        </div>
      </div>
    )
  }

  if (error || !atleta) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-black text-red-600 mb-4 uppercase">{error || "Perfil não encontrado."}</p>
          <button
            onClick={() => navigate("/dashboard/atleta")}
            className="px-6 py-3 bg-black text-white font-black uppercase text-xs border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/atleta")}
          className="px-4 py-2 bg-white text-black font-black uppercase text-xs border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={14} strokeWidth={3} />
          Voltar
        </button>
      </div>

      {/* Card Principal - Informações da Atleta */}
      <div className="bg-white border-4 sm:border-6 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-black border-b-4 sm:border-b-6 border-black p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#D4A244]">Meu Perfil</h1>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Foto */}
            <div className="flex justify-center lg:justify-start">
              {atleta.fotoDestaqueUrl ? (
                <img
                  src={atleta.fotoDestaqueUrl}
                  alt={atleta.nome}
                  className="w-48 h-48 sm:w-64 sm:h-64 object-cover border-6 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                />
              ) : (
                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-200 border-6 border-black rounded-xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <User size={64} strokeWidth={2} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">{atleta.nome}</h2>
                <p className="text-gray-600 font-bold text-sm sm:text-base mb-3">{atleta.email}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#D4A244] border-2 border-black rounded-md font-black text-xs uppercase">
                    {atleta.categoria}
                  </span>
                  <span
                    className={`px-3 py-1 border-2 border-black rounded-md font-black text-xs uppercase ${atleta.statusVerificacao === "VERIFICADO" ? "bg-green-400" : "bg-yellow-300"
                      }`}
                  >
                    {atleta.statusVerificacao}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biografia */}
      <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 mb-4">
          <User size={24} strokeWidth={3} className="text-black" />
          <h3 className="text-xl sm:text-2xl font-black uppercase">Minha Biografia</h3>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {atleta.biografia || "Nenhuma biografia cadastrada até o momento."}
        </p>
      </div>

      {/* Dados Financeiros */}
      <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={24} strokeWidth={3} className="text-black" />
          <h3 className="text-xl sm:text-2xl font-black uppercase">Dados para Repasse Financeiro</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <p className="text-xs font-black uppercase text-gray-500 mb-1">Banco</p>
            <p className="text-base font-bold text-black">{atleta.banco || "Não informado"}</p>
          </div>

          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <p className="text-xs font-black uppercase text-gray-500 mb-1">Agência / Conta</p>
            <p className="text-base font-bold text-black">
              {atleta.agencia || "-"} / {atleta.conta || "-"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <p className="text-xs font-black uppercase text-gray-500 mb-1">
              Chave PIX ({atleta.tipoChavePix})
            </p>
            <p className="text-base font-bold text-black break-words">{atleta.chavePix || "Não informada"}</p>
          </div>

          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <p className="text-xs font-black uppercase text-gray-500 mb-1">Status do Contrato</p>
            <p className="text-base font-bold text-black">
              {atleta.contratoAssinado ? "✅ Assinado" : "❌ Pendente"}
            </p>
          </div>
        </div>
      </div>

      {/* Meus Itens de Acervo */}
      {itensAcervo.length > 0 && (
        <div className="bg-white border-4 sm:border-6 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-4">
            <Package size={24} strokeWidth={3} className="text-black" />
            <h3 className="text-xl sm:text-2xl font-black uppercase">Meus Itens de Acervo</h3>
          </div>
          <p className="text-gray-600 font-bold text-sm mb-4">
            Itens vinculados à sua trajetória e disponíveis para licenciamento
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {itensAcervo.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                {item.fotoPrincipalUrl ? (
                  <img
                    src={item.fotoPrincipalUrl}
                    alt={item.titulo}
                    className="w-full h-40 object-cover border-b-4 border-black"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 border-b-4 border-black flex items-center justify-center">
                    <Package size={48} strokeWidth={2} className="text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="text-base font-black text-black mb-2">{item.titulo}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

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
          <div className="w-16 h-16 bg-acl-gold border border-acl-line rounded mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-medium">Sincronizando seus dados...</p>
        </div>
      </div>
    )
  }

  if (error || !atleta) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-medium text-acl-wine mb-4">{error || "Perfil não encontrado."}</p>
          <button
            onClick={() => navigate("/dashboard/atleta")}
            className="px-6 py-3 bg-acl-ink text-acl-cream font-medium text-xs border border-acl-line rounded-sm transition-all"
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
          className="px-4 py-2 bg-white text-acl-ink font-medium text-xs border border-acl-line rounded-sm transition-all flex items-center gap-2"
        >
          <ArrowLeft size={14} strokeWidth={3} />
          Voltar
        </button>
      </div>

      {/* Card Principal - Informações da Atleta */}
      <div className="bg-white border border-acl-line rounded overflow-hidden">
        <div className="bg-acl-ink border-b border-acl-line p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-acl-gold">Meu Perfil</h1>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Foto */}
            <div className="flex justify-center lg:justify-start">
              {atleta.fotoDestaqueUrl ? (
                <img
                  src={atleta.fotoDestaqueUrl}
                  alt={atleta.nome}
                  className="w-48 h-48 sm:w-64 sm:h-64 object-cover border border-acl-line rounded"
                />
              ) : (
                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-acl-cream border border-acl-line rounded flex items-center justify-center">
                  <User size={64} strokeWidth={2} className="text-acl-muted" />
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-medium text-acl-ink mb-2">{atleta.nome}</h2>
                <p className="text-acl-ink-soft font-medium text-sm sm:text-base mb-3">{atleta.email}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-acl-gold border border-acl-line rounded-sm font-medium text-xs">
                    {atleta.categoria}
                  </span>
                  <span
                    className={`px-3 py-1 border border-acl-line rounded-sm font-medium text-xs ${atleta.statusVerificacao === "VERIFICADO" ? "bg-green-50 text-green-700" : "bg-acl-gold/15 text-acl-gold-text"
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
      <div className="bg-white border border-acl-line rounded p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <User size={24} strokeWidth={3} className="text-acl-ink" />
          <h3 className="text-xl sm:text-2xl font-medium">Minha Biografia</h3>
        </div>
        <p className="text-acl-ink-soft leading-relaxed whitespace-pre-wrap">
          {atleta.biografia || "Nenhuma biografia cadastrada até o momento."}
        </p>
      </div>

      {/* Dados Financeiros */}
      <div className="bg-white border border-acl-line rounded p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={24} strokeWidth={3} className="text-acl-ink" />
          <h3 className="text-xl sm:text-2xl font-medium">Dados para Repasse Financeiro</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-acl-cream border-2 border-acl-line rounded-sm">
            <p className="text-xs font-medium text-acl-muted mb-1">Banco</p>
            <p className="text-base font-medium text-acl-ink">{atleta.banco || "Não informado"}</p>
          </div>

          <div className="p-4 bg-acl-cream border-2 border-acl-line rounded-sm">
            <p className="text-xs font-medium text-acl-muted mb-1">Agência / Conta</p>
            <p className="text-base font-medium text-acl-ink">
              {atleta.agencia || "-"} / {atleta.conta || "-"}
            </p>
          </div>

          <div className="p-4 bg-acl-cream border-2 border-acl-line rounded-sm">
            <p className="text-xs font-medium text-acl-muted mb-1">
              Chave PIX ({atleta.tipoChavePix})
            </p>
            <p className="text-base font-medium text-acl-ink break-words">{atleta.chavePix || "Não informada"}</p>
          </div>

          <div className="p-4 bg-acl-cream border-2 border-acl-line rounded-sm">
            <p className="text-xs font-medium text-acl-muted mb-1">Status do Contrato</p>
            <p className="text-base font-medium text-acl-ink">
              {atleta.contratoAssinado ? "✅ Assinado" : "❌ Pendente"}
            </p>
          </div>
        </div>
      </div>

      {/* Meus Itens de Acervo */}
      {itensAcervo.length > 0 && (
        <div className="bg-white border border-acl-line rounded p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package size={24} strokeWidth={3} className="text-acl-ink" />
            <h3 className="text-xl sm:text-2xl font-medium">Meus Itens de Acervo</h3>
          </div>
          <p className="text-acl-ink-soft font-medium text-sm mb-4">
            Itens vinculados à sua trajetória e disponíveis para licenciamento
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {itensAcervo.map((item) => (
              <div
                key={item.id}
                className="bg-acl-cream border border-acl-line rounded overflow-hidden transition-all"
              >
                {item.fotoPrincipalUrl ? (
                  <img
                    src={item.fotoPrincipalUrl}
                    alt={item.titulo}
                    className="w-full h-40 object-cover border-b border-acl-line"
                  />
                ) : (
                  <div className="w-full h-40 bg-acl-cream border-b border-acl-line flex items-center justify-center">
                    <Package size={48} strokeWidth={2} className="text-acl-muted" />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="text-base font-medium text-acl-ink mb-2">{item.titulo}</h4>
                  <p className="text-xs text-acl-ink-soft line-clamp-2">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

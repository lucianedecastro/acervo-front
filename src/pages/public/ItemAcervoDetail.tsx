import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"
import { ArrowLeft, ShieldCheck, Download, Info, Tag } from "lucide-react"
import { cloudinaryImage } from "@/utils/cloudinary"

export default function ItemAcervoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<ItemAcervoResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarItem() {
      if (!id) return
      try {
        const data = await itemAcervoService.obterPorId(id)
        setItem(data)
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarItem()
  }, [id])

  if (loading)
    return (
      <div className="p-10 text-center font-black uppercase">
        Carregando Detalhes do Acervo...
      </div>
    )

  if (!item)
    return (
      <div className="p-10 text-center font-black uppercase">
        Item não encontrado.
      </div>
    )

  /**
   * Resolução da imagem principal:
   * - Prioriza foto marcada como destaque
   * - Fallback para a primeira foto disponível
   * - Aplica marca d'água via helper centralizado do Cloudinary
   * - Mantém fallback de segurança para a imagem original
   */
  const fotoObj = item.fotos?.find((f) => f.ehDestaque) || item.fotos?.[0]

  /**
   * URL protegida com marca d'água (visualização pública):
   * - Gerada exclusivamente pelo helper cloudinaryImage
   * - Version precisa ser prefixada com "v" (ex: v1770640528)
   */
  const urlComProtecao =
    fotoObj?.publicId && fotoObj?.version
      ? cloudinaryImage({
          publicId: fotoObj.publicId,
          version: fotoObj.version,
          contexto: "detalhe-item",
        })
      : null

  /**
   * Imagem principal final:
   * - Prioriza versão protegida
   * - Fallback para URL original persistida no backend
   */
  const fotoPrincipal = urlComProtecao || fotoObj?.url

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-black uppercase hover:underline transition-all"
      >
        <ArrowLeft size={20} /> Voltar para a Galeria
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Coluna da Imagem */}
        <div className="space-y-4">
          <div className="relative border-8 border-black bg-gray-200 aspect-square overflow-hidden group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Camada de proteção contra menu de contexto */}
            <div
              className="absolute inset-0 z-10"
              onContextMenu={(e) => e.preventDefault()}
            />

            {fotoPrincipal ? (
              <img
                src={fotoPrincipal}
                alt={item.titulo}
                className="w-full h-full object-contain pointer-events-none"
                onError={(e) => {
                  /**
                   * Fallback de segurança:
                   * - Caso a URL protegida falhe (Cloudinary, cache, etc)
                   * - Reverte para a imagem original salva no backend
                   */
                  if (fotoObj?.url && e.currentTarget.src !== fotoObj.url) {
                    e.currentTarget.src = fotoObj.url
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full font-black text-gray-400 p-8 text-center uppercase">
                Imagem não disponível para este item
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 text-xs font-black uppercase z-20">
              Visualização Protegida
            </div>
          </div>

          <p className="text-xs font-bold text-gray-500 text-center uppercase tracking-widest">
            Proteção por marca d'água digital • Direitos Reservados
          </p>
        </div>

        {/* Coluna de Dados */}
        <div className="space-y-6">
          <header className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-block border-4 border-black bg-yellow-400 px-4 py-1 font-black uppercase text-xs">
                {item.modalidadeId ? "Futebol Feminino" : "Geral"}
              </span>
              <span className="inline-block border-4 border-black bg-white px-4 py-1 font-black uppercase text-xs">
                {item.tipo || "FOTO"}
              </span>
            </div>

            <h1 className="text-4xl font-black uppercase leading-tight border-b-4 border-black pb-2">
              {item.titulo}
            </h1>
          </header>

          <div className="space-y-2">
            <h3 className="flex items-center gap-2 font-black uppercase text-sm text-gray-500">
              <Info size={16} /> Descrição do Item
            </h3>
            <p className="text-lg font-bold leading-relaxed text-gray-800 italic">
              "{item.descricao || "Sem descrição informada no catálogo."}"
            </p>
          </div>

          {/* Card de Licenciamento */}
          <div className="bg-yellow-50 border-4 border-black p-6 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="shrink-0 text-black" size={28} />
              <div>
                <h4 className="font-black uppercase text-sm underline">
                  Regras de Licenciamento
                </h4>
                <p className="text-sm font-bold mt-1">
                  {item.disponivelParaLicenciamento
                    ? "✓ Este item está disponível para licenciamento comercial imediato."
                    : "⚠ Uso restrito: Este item requer análise da curadoria para fins comerciais."}
                </p>
              </div>
            </div>

            <button className="w-full bg-black text-white font-black uppercase p-4 flex items-center justify-center gap-2 hover:bg-yellow-600 hover:text-black transition-colors border-2 border-black">
              <Download size={20} />
              Solicitar Alta Resolução (TIFF/JPG)
            </button>
          </div>

          {/* Metadados Adicionais */}
          <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase">
            <div className="border-4 border-black p-4 bg-gray-50">
              <span className="block text-gray-500 mb-1">Procedência</span>
              <span className="text-sm">
                {item.procedencia || "Acervo Pessoal da Atleta"}
              </span>
            </div>
            <div className="border-4 border-black p-4 bg-gray-50">
              <span className="block text-gray-500 mb-1">
                Status de Catálogo
              </span>
              <span className="text-sm">
                {item.status === "MEMORIAL"
                  ? "Pesquisa Histórica"
                  : "Acervo Ativo"}
              </span>
            </div>
          </div>

          {/* Localização/Tags */}
          <div className="flex items-center gap-2 pt-4 border-t-2 border-black border-dashed">
            <Tag size={16} className="text-gray-400" />
            <span className="text-[10px] font-black uppercase text-gray-400">
              Local: {item.local || "Não informado"} • ID: {item.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
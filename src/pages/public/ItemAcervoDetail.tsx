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
      <div className="p-10 text-center font-black uppercase animate-pulse">
        Sincronizando Dados do Acervo...
      </div>
    )

  if (!item)
    return (
      <div className="p-10 text-center font-black uppercase text-red-600">
        Item não localizado no catálogo.
      </div>
    )

  /**
   * Resolução da imagem principal:
   * - Prioriza foto de destaque
   * - Fallback para a primeira foto disponível
   */
  const fotoObj = item.fotos?.find((f) => f.ehDestaque) || item.fotos?.[0]

  /**
   * URL protegida com marca d'água:
   * - Sempre derivada no frontend
   * - Contexto de detalhe (resolução maior)
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
   * Imagem principal:
   * - Utiliza apenas a URL derivada
   * - Não utiliza URL persistida como fallback técnico
   */
  const fotoPrincipal = urlComProtecao || null

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-black uppercase hover:text-yellow-600 transition-all border-b-2 border-transparent hover:border-yellow-600"
      >
        <ArrowLeft size={20} /> Voltar para a Galeria
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Coluna da Imagem */}
        <div className="space-y-4">
          <div className="relative border-8 border-black bg-gray-100 aspect-square overflow-hidden group shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            {/* Overlay de Proteção */}
            <div
              className="absolute inset-0 z-30 select-none"
              onContextMenu={(e) => e.preventDefault()}
            />

            {fotoPrincipal ? (
              <img
                src={fotoPrincipal}
                alt={item.titulo}
                className="w-full h-full object-contain pointer-events-none select-none z-10"
                onError={(e) => {
                  /**
                   * Em caso de erro:
                   * - removemos o src
                   * - mantemos apenas o fallback visual
                   */
                  e.currentTarget.style.display = "none"
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full font-black text-gray-300 p-8 text-center uppercase text-sm">
                Aguardando processamento da mídia
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 text-[10px] font-black uppercase z-40 shadow-[4px_4px_0px_0px_rgba(212,162,68,1)]">
              Visualização Protegida
            </div>
          </div>

          <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest leading-tight">
            Este arquivo contém marcas d&apos;água digitais invisíveis <br />
            Proteção por Direitos Autorais • Acervo Carmen Lydia
          </p>
        </div>

        {/* Coluna de Dados */}
        <div className="space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-block border-4 border-black bg-[#D4A244] px-4 py-1 font-black uppercase text-[10px]">
                {item.modalidadeId ? "Futebol Feminino" : "História Esportiva"}
              </span>
              <span className="inline-block border-4 border-black bg-white px-4 py-1 font-black uppercase text-[10px]">
                DOC / {item.tipo || "FOTOGRAFIA"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase leading-none border-b-6 border-black pb-4">
              {item.titulo}
            </h1>
          </header>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-black uppercase text-xs text-gray-400">
              <Info size={14} /> Contexto Histórico
            </h3>
            <p className="text-lg font-bold leading-snug text-gray-800 italic bg-gray-50 p-4 border-l-8 border-black">
              "{item.descricao || "Item catalogado sem descrição narrativa."}"
            </p>
          </div>

          {/* Licenciamento */}
          <div className="bg-white border-4 border-black p-6 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="shrink-0 text-[#D4A244]" size={32} strokeWidth={3} />
              <div>
                <h4 className="font-black uppercase text-xs">Licenciamento de Uso</h4>
                <p className="text-xs font-bold mt-1 text-gray-600">
                  {item.disponivelParaLicenciamento
                    ? "✓ Disponível para publicações editoriais e comerciais."
                    : "⚠ Uso restrito a fins de pesquisa acadêmica e jornalística."}
                </p>
              </div>
            </div>

            <button className="w-full bg-black text-white font-black uppercase p-4 flex items-center justify-center gap-3 hover:bg-[#D4A244] hover:text-black transition-all border-4 border-black active:translate-y-1">
              <Download size={20} strokeWidth={3} />
              Solicitar Original em Alta
            </button>
          </div>

          {/* Rodapé de Metadados */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border-4 border-black p-3 bg-gray-50">
              <span className="block text-[10px] font-black text-gray-400 uppercase mb-1">Procedência</span>
              <span className="text-xs font-black uppercase">
                {item.procedencia || "Acervo Carmen Lydia"}
              </span>
            </div>
            <div className="border-4 border-black p-3 bg-gray-50">
              <span className="block text-[10px] font-black text-gray-400 uppercase mb-1">Catálogo</span>
              <span className="text-xs font-black uppercase">
                {item.status === "MEMORIAL" ? "Arquivo Histórico" : "Exibição Ativa"}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t-4 border-black border-dotted">
            <span className="text-[9px] font-black uppercase text-gray-400 flex items-center gap-2">
              <Tag size={12} /> Local: {item.local || "Não identificado"} • Registro: {item.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

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
      <div className="p-10 text-center text-sm text-acl-muted animate-fade-pulse">
        Sincronizando dados do acervo...
      </div>
    )

  if (!item)
    return (
      <div className="p-10 text-center text-acl-wine">
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

  const fotoPrincipal = urlComProtecao || null

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-acl-cream">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-acl-ink-soft hover:text-acl-gold-deep transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para a galeria
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Coluna da Imagem */}
        <div className="space-y-4">
          <div className="relative border border-acl-line bg-white aspect-square overflow-hidden group">
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
              <div className="flex items-center justify-center h-full text-acl-muted p-8 text-center text-sm">
                Aguardando processamento da mídia
              </div>
            )}

            <div className="absolute bottom-3 right-3 bg-acl-ink text-acl-cream px-3 py-1.5 text-[11px] z-40">
              Visualização pública — original sob licenciamento
            </div>
          </div>

          <p className="text-xs text-acl-muted text-center leading-relaxed">
            Este arquivo contém marcas d&apos;água digitais invisíveis<br />
            Proteção por direitos autorais • Acervo Carmen Lydia
          </p>
        </div>

        {/* Coluna de Dados */}
        <div className="space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-block border border-acl-line bg-white px-3 py-1 text-xs text-acl-ink-soft">
                {item.modalidadeId ? "Futebol feminino" : "História esportiva"}
              </span>
              <span className="inline-block border border-acl-line bg-white px-3 py-1 text-xs text-acl-ink-soft">
                Doc / {item.tipo || "Fotografia"}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink border-b border-acl-line pb-5">
              {item.titulo}
            </h1>
          </header>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-xs text-acl-muted">
              <Info size={14} /> Contexto histórico
            </h3>
            <p className="aside-serif text-acl-ink-soft text-lg bg-white p-4 border-l-2 border-acl-gold-deep">
              {item.descricao || "Item catalogado sem descrição narrativa."}
            </p>
          </div>

          {/* Licenciamento */}
          <div className="bg-white border border-acl-line p-6 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="shrink-0 text-acl-gold-deep" size={26} strokeWidth={1.5} />
              <div>
                <h4 className="text-xs text-acl-ink mb-1">Licenciamento de uso</h4>
                <p className="text-xs text-acl-muted leading-relaxed">
                  {item.disponivelParaLicenciamento
                    ? "Disponível para publicações editoriais e comerciais."
                    : "Uso restrito a fins de pesquisa acadêmica e jornalística."}
                </p>
              </div>
            </div>

            <button className="w-full bg-acl-ink text-acl-cream text-sm py-3.5 flex items-center justify-center gap-3 hover:bg-acl-gold-deep hover:text-acl-ink transition-colors">
              <Download size={16} />
              Solicitar original em alta resolução
            </button>
          </div>

          {/* Rodapé de Metadados */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-acl-line p-3 bg-white">
              <span className="block text-[11px] text-acl-muted mb-1">Procedência</span>
              <span className="text-xs text-acl-ink">
                {item.procedencia || "Acervo Carmen Lydia"}
              </span>
            </div>
            <div className="border border-acl-line p-3 bg-white">
              <span className="block text-[11px] text-acl-muted mb-1">Catálogo</span>
              <span className="text-xs text-acl-ink">
                {item.status === "MEMORIAL" ? "Arquivo histórico" : "Exibição ativa"}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-acl-line">
            <span className="text-[11px] text-acl-muted flex items-center gap-2">
              <Tag size={12} /> Local: {item.local || "Não identificado"} • Registro: {item.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
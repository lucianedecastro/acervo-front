import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"
import { ArrowLeft } from "lucide-react"

import CardItemAcervo from "@/components/CardItemAcervo"

const categoriaLabel: Record<string, string> = {
  ATIVA: "Ativa",
  HISTORICA: "Histórica",
  ESPOLIO: "Espólio",
}

export default function AtletaDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [itensAcervo, setItensAcervo] = useState<ItemAcervoResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function carregar() {
      try {
        setLoading(true)
        setError(null)
        const data = await atletaService.buscarPerfilPublico(slug as string)
        setAtleta(data.atleta)
        setItensAcervo(data.itens || [])
      } catch (err) {
        console.error("Erro ao carregar perfil público:", err)
        setError("Perfil não encontrado ou temporariamente indisponível.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [slug])

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-acl-cream">
        <div className="text-center">
          <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
          <p className="text-sm text-acl-muted">Carregando história...</p>
        </div>
      </div>
    )

  if (error || !atleta)
    return (
      <div className="min-h-screen flex items-center justify-center bg-acl-cream px-6">
        <div className="text-center">
          <p className="text-acl-wine mb-6">{error}</p>
          <button
            onClick={() => navigate("/atletas")}
            className="btn-secondary-light"
          >
            Voltar para a galeria
          </button>
        </div>
      </div>
    )

  const imagemPrincipal =
    atleta.fotoDestaqueUrl ||
    atleta.fotoPerfil?.url ||
    null

  return (
    <main className="bg-acl-cream min-h-screen">
      {/* Botão Voltar */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-acl-ink-soft hover:text-acl-gold-deep transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      {/* Header */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-white p-2 border border-acl-line">
            {imagemPrincipal ? (
              <img
                src={imagemPrincipal}
                alt={atleta.nome}
                className="w-full aspect-[4/5] object-cover"
              />
            ) : (
              <div className="w-full aspect-[4/5] bg-acl-line/40 flex items-center justify-center">
                <span className="text-acl-muted text-xs">Imagem em pesquisa</span>
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow text-acl-gold-deep mb-3">
              {categoriaLabel[atleta.categoria] ?? atleta.categoria}
            </p>
            <h1 className="font-serif text-3xl md:text-5xl text-acl-ink">
              {atleta.nome}
            </h1>
          </div>
        </div>
      </section>

      {/* Biografia */}
      <section className="py-14 px-6 bg-white border-t border-acl-line">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-3">Biografia e trajetória</h2>
          <div className="w-12 h-px bg-acl-gold-deep mb-8" />
          <p className="text-acl-ink-soft leading-relaxed whitespace-pre-wrap">
            {atleta.biografia || "Biografia em fase de pesquisa."}
          </p>
        </div>
      </section>

      {/* Itens do Acervo */}
      {itensAcervo.length > 0 && (
        <section className="py-14 px-6 bg-acl-ink">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-acl-cream mb-10">Itens do acervo histórico</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {itensAcervo.map((item) => (
                <CardItemAcervo key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
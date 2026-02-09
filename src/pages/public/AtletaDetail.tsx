import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

// IMPORT NECESSÁRIO PARA O LINK FUNCIONAR
import CardItemAcervo from "@/components/CardItemAcervo"

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black mx-auto mb-4 animate-pulse"></div>
          <p className="text-lg font-black uppercase tracking-wide">
            Carregando história...
          </p>
        </div>
      </div>
    )

  if (error || !atleta)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-xl font-black text-red-600 mb-6 uppercase">
            {error}
          </p>
          <button
            onClick={() => navigate("/atletas")}
            className="px-8 py-3 bg-black text-white font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Voltar para Galeria
          </button>
        </div>
      </div>
    )

  const imagemPrincipal =
    atleta.fotoDestaqueUrl ||
    atleta.fotoPerfil?.url ||
    null

  return (
    <main className="bg-white min-h-screen">
      {/* Botão Voltar */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-white text-black font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
        >
          ← Voltar
        </button>
      </div>

      {/* Header */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            {imagemPrincipal ? (
              <img
                src={imagemPrincipal}
                alt={atleta.nome}
                className="w-full border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 border-8 border-black flex items-center justify-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-gray-600 font-black uppercase text-sm">
                  Imagem em Pesquisa
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="inline-block mb-4 px-6 py-2 bg-[#D4A244] border-4 border-black font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {atleta.categoria}
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase">
              {atleta.nome}
            </h1>
          </div>
        </div>
      </section>

      {/* Biografia */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black uppercase mb-4">
            Biografia e Trajetória
          </h2>
          <div className="w-24 h-2 bg-[#D4A244] mb-8 border-4 border-black"></div>
          <p className="whitespace-pre-wrap">
            {atleta.biografia || "Biografia em fase de pesquisa."}
          </p>
        </div>
      </section>

      {/* Itens do Acervo */}
      {itensAcervo.length > 0 && (
        <section className="py-16 px-6 bg-black text-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black uppercase mb-12 text-[#D4A244]">
              Itens do Acervo Histórico
            </h2>

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
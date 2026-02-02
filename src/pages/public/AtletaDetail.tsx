import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

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
        setItensAcervo(data.itens)
      } catch (err) {
        console.error("Erro ao carregar perfil público:", err)
        setError("Perfil não encontrado ou temporariamente indisponível.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#D4A244] border-6 border-black mx-auto mb-4 animate-pulse"></div>
        <p className="text-lg font-black uppercase tracking-wide">Carregando história...</p>
      </div>
    </div>
  )

  if (error || !atleta) return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="text-xl font-black text-red-600 mb-6 uppercase">{error}</p>
        <button
          onClick={() => navigate("/atletas")}
          className="px-8 py-3 bg-black text-white font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          Voltar para Galeria
        </button>
      </div>
    </div>
  )

  /**
   * REGRA DE IMAGEM (PERFIL PÚBLICO)
   * 1. Foto de destaque (hero)
   * 2. Foto de perfil (fallback visual)
   * 3. Placeholder
   */
  const imagemPrincipal =
    atleta.fotoDestaqueUrl ||
    atleta.fotoPerfil?.url ||
    null

  return (
    <main className="bg-white min-h-screen">

      {/* Botão Voltar - Neobrutalist */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-white text-black font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
        >
          ← Voltar
        </button>
      </div>

      {/* Header com Foto e Nome */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Foto */}
            <div className="order-2 md:order-1">
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

            {/* Nome e Categoria */}
            <div className="order-1 md:order-2">
              <div className="inline-block mb-4 px-6 py-2 bg-[#D4A244] border-4 border-black font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {atleta.categoria}
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-[1.1] tracking-tight mb-6">
                {atleta.nome}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Biografia */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight">
            Biografia e Trajetória
          </h2>
          <div className="w-24 h-2 bg-[#D4A244] mb-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>

          <div className="text-base md:text-lg leading-relaxed text-gray-800 whitespace-pre-wrap font-medium">
            {atleta.biografia || "Biografia em fase de pesquisa."}
          </div>
        </div>
      </section>

      {/* Itens do Acervo */}
      {itensAcervo.length > 0 && (
        <section className="py-16 px-6 bg-black text-white border-t-6 border-[#D4A244]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight text-[#D4A244]">
              Itens do Acervo Histórico
            </h2>
            <div className="w-24 h-2 bg-white mb-12 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {itensAcervo.map((item) => (
                <div
                  key={item.id}
                  className="bg-white text-black border-6 border-white shadow-[8px_8px_0px_0px_rgba(212,162,68,1)] hover:shadow-[4px_4px_0px_0px_rgba(212,162,68,1)] hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden"
                >
                  {item.fotoPrincipalUrl && (
                    <img
                      src={item.fotoPrincipalUrl}
                      alt={item.titulo}
                      className="w-full h-64 object-cover border-b-6 border-black"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-black uppercase mb-3 tracking-tight">
                      {item.titulo}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      {item.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}

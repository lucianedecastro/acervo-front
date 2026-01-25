import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { modalidadeService } from "@/services/modalidadeService"
import { ModalidadePublicaDTO } from "@/types/modalidade"

export default function ModalidadeDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [modalidade, setModalidade] = useState<ModalidadePublicaDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setError("Identificador da modalidade não informado.")
      setLoading(false)
      return
    }

    modalidadeService
      .buscarPorSlug(slug)
      .then((data) => setModalidade(data))
      .catch((err) => {
        console.error("Erro ao buscar modalidade:", err)
        setError("Não foi possível carregar os detalhes desta modalidade.")
      })
      .finally(() => setLoading(false))
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

  if (error || !modalidade)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-xl font-black text-red-600 mb-6 uppercase">
            {error}
          </p>
          <button
            onClick={() => navigate("/modalidades")}
            className="px-8 py-3 bg-black text-white font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Voltar para Lista
          </button>
        </div>
      </div>
    )

  /**
   * Foto de destaque (hero da modalidade)
   * - Usada exclusivamente no detail
   * - Pictograma NÃO é exibido nesta página
   */
  const fotoDestaqueUrl = modalidade.fotoDestaquePublicId
    ? `https://res.cloudinary.com/dcet9fpu0/image/upload/${modalidade.fotoDestaquePublicId}`
    : null

  return (
    <main className="bg-white min-h-screen">

      {/* Botão Voltar */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate("/modalidades")}
          className="px-6 py-3 bg-white text-black font-black uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
        >
          ← Voltar
        </button>
      </div>

      {/* FOTO DE DESTAQUE (HERO) */}
      {fotoDestaqueUrl && (
        <section className="relative h-[420px] w-full overflow-hidden border-b-6 border-black mt-8">
          <img
            src={fotoDestaqueUrl}
            alt={`Foto de destaque da modalidade ${modalidade.nome}`}
            className="w-full h-full object-cover"
          />
        </section>
      )}

      {/* TÍTULO DA MODALIDADE */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            {modalidade.nome}
          </h1>
        </div>
      </section>

      {/* História */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight">
            História e Contexto
          </h2>
          <div className="w-24 h-2 bg-[#D4A244] mb-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>

          <p className="text-base md:text-lg leading-relaxed text-gray-800 whitespace-pre-wrap font-medium">
            {modalidade.historia ||
              "Nenhuma descrição histórica disponível no momento."}
          </p>
        </div>
      </section>

      {/* Galeria Fotográfica */}
      {modalidade.fotos && modalidade.fotos.length > 0 && (
        <section className="py-16 px-6 bg-black text-white border-t-6 border-[#D4A244]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight text-[#D4A244]">
              Acervo Fotográfico
            </h2>
            <div className="w-24 h-2 bg-white mb-12 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modalidade.fotos.map((foto) => (
                <div
                  key={foto.publicId}
                  className="bg-white text-black border-6 border-white shadow-[8px_8px_0px_0px_rgba(212,162,68,1)] overflow-hidden"
                >
                  <img
                    src={foto.urlVisualizacao}
                    alt={foto.legenda}
                    className="w-full h-64 object-cover border-b-6 border-black"
                  />
                  {foto.legenda && (
                    <p className="p-4 text-sm font-medium leading-relaxed">
                      {foto.legenda}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

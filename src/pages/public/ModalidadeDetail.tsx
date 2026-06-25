import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { modalidadeService } from "@/services/modalidadeService"
import { ModalidadePublicaDTO } from "@/types/modalidade"
import { ArrowLeft } from "lucide-react"

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
      <div className="min-h-screen flex items-center justify-center bg-acl-cream">
        <div className="text-center">
          <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
          <p className="text-sm text-acl-muted">Carregando história...</p>
        </div>
      </div>
    )

  if (error || !modalidade)
    return (
      <div className="min-h-screen flex items-center justify-center bg-acl-cream px-6">
        <div className="text-center">
          <p className="text-acl-wine mb-6">{error}</p>
          <button
            onClick={() => navigate("/modalidades")}
            className="btn-secondary-light"
          >
            Voltar para a lista
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
    <main className="bg-acl-cream min-h-screen">

      {/* Botão Voltar */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate("/modalidades")}
          className="inline-flex items-center gap-2 text-sm text-acl-ink-soft hover:text-acl-gold-deep transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      {/* Foto de destaque */}
      {fotoDestaqueUrl && (
        <section className="mt-8 px-6">
          <div className="max-w-5xl mx-auto">
            <img
              src={fotoDestaqueUrl}
              alt={`Foto de destaque da modalidade ${modalidade.nome}`}
              className="w-full h-[360px] object-cover border border-acl-line"
            />
          </div>
        </section>
      )}

      {/* Título */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-5xl text-acl-ink">
            {modalidade.nome}
          </h1>
        </div>
      </section>

      {/* História */}
      <section className="py-14 px-6 bg-white border-t border-acl-line">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-3">História e contexto</h2>
          <div className="w-12 h-px bg-acl-gold-deep mb-8" />

          <p className="text-acl-ink-soft leading-relaxed whitespace-pre-wrap">
            {modalidade.historia ||
              "Nenhuma descrição histórica disponível no momento."}
          </p>
        </div>
      </section>

      {/* Galeria Fotográfica */}
      {modalidade.fotos && modalidade.fotos.length > 0 && (
        <section className="py-14 px-6 bg-acl-ink">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-acl-cream mb-10">Acervo fotográfico</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modalidade.fotos.map((foto) => (
                <div
                  key={foto.publicId}
                  className="bg-white overflow-hidden"
                >
                  <img
                    src={foto.urlVisualizacao}
                    alt={foto.legenda}
                    className="w-full h-64 object-cover"
                  />
                  {foto.legenda && (
                    <p className="p-4 text-sm text-acl-ink-soft leading-relaxed">
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
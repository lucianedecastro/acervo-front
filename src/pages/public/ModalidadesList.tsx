import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"

export default function ModalidadesList() {
  const navigate = useNavigate()
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    modalidadeService
      .listarAdmin()
      .then((data) => setModalidades(data.filter(m => m.ativa)))
      .catch((err) => {
        console.error("Erro ao carregar modalidades:", err)
        setError("Não foi possível carregar as modalidades no momento.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-acl-cream">
      <div className="text-center">
        <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
        <p className="text-sm text-acl-muted">Carregando modalidades...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-acl-cream px-6">
      <div className="text-center">
        <p className="text-acl-wine mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary-light"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )

  return (
    <main className="bg-acl-cream min-h-screen">

      {/* Hero */}
      <section className="bg-acl-ink py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="eyebrow text-acl-gold mb-5">Categorias esportivas</p>
          <h1 className="font-serif text-3xl md:text-5xl text-acl-cream mb-5">
            Modalidades
          </h1>
          <p className="text-acl-cream/70 max-w-2xl mx-auto leading-relaxed">
            Explore as modalidades esportivas que compõem o acervo e entenda os contextos
            históricos da presença feminina em cada uma delas.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {modalidades.length === 0 ? (
            <p className="text-center text-acl-muted">
              Nenhuma modalidade disponível para visualização no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {modalidades.map((modalidade) => (
                <article
                  key={modalidade.id}
                  onClick={() => navigate(`/modalidades/${modalidade.slug}`)}
                  className="card-editorial cursor-pointer overflow-hidden hover:border-acl-gold-deep transition-colors"
                >
                  <div className="w-full h-32 bg-white border-b border-acl-line flex items-center justify-center p-5">
                    {modalidade.pictogramaUrl ? (
                      <img
                        src={modalidade.pictogramaUrl}
                        alt={`Ícone de ${modalidade.nome}`}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-acl-line rounded-sm" />
                    )}
                  </div>

                  <div className="p-5 text-center">
                    <h2 className="font-serif text-base text-acl-ink mb-2">
                      {modalidade.nome}
                    </h2>
                    <span className="text-xs text-acl-gold-deep">
                      Explorar história →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  )
}
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"

const categoriaLabel: Record<string, string> = {
  ATIVA: "Ativa",
  HISTORICA: "Histórica",
  ESPOLIO: "Espólio",
}

export default function AtletasList() {
  const navigate = useNavigate()
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    atletaService
      .listarPublico()
      .then(setAtletas)
      .catch((err) => {
        console.error("Erro ao carregar vitrine de atletas:", err)
        setError("Não foi possível carregar o acervo de atletas no momento.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-acl-cream">
      <div className="text-center">
        <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
        <p className="text-sm text-acl-muted">Carregando trajetórias...</p>
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
          <p className="eyebrow text-acl-gold mb-5">Acervo histórico</p>
          <h1 className="font-serif text-3xl md:text-5xl text-acl-cream mb-5">
            Atletas
          </h1>
          <p className="text-acl-cream/70 max-w-2xl mx-auto leading-relaxed">
            Conheça as mulheres que transformaram o esporte brasileiro através de seus acervos pessoais.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {atletas.length === 0 ? (
            <p className="text-center text-acl-muted">
              O acervo está sendo atualizado. Volte em breve.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {atletas.map((atleta) => {
                /**
                 * REGRA DE IMAGEM
                 * 1. Foto de destaque (hero)
                 * 2. Foto de perfil (fallback)
                 * 3. Placeholder
                 */
                const imagemUrl =
                  atleta.fotoDestaqueUrl ||
                  atleta.fotoPerfil?.url ||
                  null

                return (
                  <article
                    key={atleta.id}
                    onClick={() => navigate(`/atleta/${atleta.slug}`)}
                    className="card-editorial cursor-pointer overflow-hidden hover:border-acl-gold-deep transition-colors"
                  >
                    <div className="w-full aspect-[4/5] bg-acl-line/40 overflow-hidden">
                      {imagemUrl ? (
                        <img
                          src={imagemUrl}
                          alt={atleta.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-acl-muted text-xs">
                          Imagem em pesquisa
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <span className="text-xs text-acl-gold-deep">
                        {categoriaLabel[atleta.categoria] ?? atleta.categoria}
                      </span>
                      <h2 className="font-serif text-lg text-acl-ink mt-1">
                        {atleta.nome}
                      </h2>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

    </main>
  )
}
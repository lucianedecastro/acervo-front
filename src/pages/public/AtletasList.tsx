import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
        <p className="text-lg font-black uppercase tracking-wide">Carregando trajetórias...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="text-xl font-black text-red-600 mb-6 uppercase">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-black text-white font-black uppercase border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  )

  return (
    <main className="bg-white min-h-screen">

      {/* Hero Section */}
      <section className="bg-black text-white py-16 px-6 border-b-6 border-[#D4A244]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 border-4 border-[#D4A244] rounded-md text-[#D4A244] font-black text-xs tracking-[0.3em] uppercase shadow-[4px_4px_0px_0px_rgba(212,162,68,1)]">
            Acervo Histórico
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6 text-white">
            Atletas
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto font-medium">
            Conheça as mulheres que transformaram o esporte brasileiro através de seus acervos pessoais.
          </p>
        </div>
      </section>

      {/* Grid de Atletas */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          {atletas.length === 0 ? (
            <p className="text-center text-gray-600 text-lg font-bold uppercase tracking-wide">
              O acervo está sendo atualizado. Volte em breve!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {atletas.map((atleta) => {
                /**
                 * REGRA DE IMAGEM (HOME)
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
                    className="bg-white border-6 border-black rounded-xl cursor-pointer shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-200 overflow-hidden"
                  >
                    {/* Imagem */}
                    <div className="w-full h-80 bg-gray-200 border-b-6 border-black overflow-hidden">
                      {imagemUrl ? (
                        <img
                          src={imagemUrl}
                          alt={atleta.nome}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-black text-xs uppercase tracking-wide">
                          Imagem em Pesquisa
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6">
                      <span className="inline-block mb-2 px-3 py-1 bg-[#D4A244] border-2 border-black rounded-md font-black text-xs uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {atleta.categoria}
                      </span>
                      <h2 className="text-2xl font-black uppercase tracking-tight">
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

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
        <p className="text-lg font-black uppercase tracking-wide">Carregando modalidades...</p>
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
            Categorias Esportivas
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6 text-white">
            Modalidades
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto font-medium">
            Explore as modalidades esportivas que compõem o acervo e entenda os contextos
            históricos da presença feminina em cada uma delas.
          </p>
        </div>
      </section>

      {/* Grid de Modalidades - CARDS COM BORDAS ARREDONDADAS */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          {modalidades.length === 0 ? (
            <p className="text-center text-gray-600 text-lg font-bold uppercase tracking-wide">
              Nenhuma modalidade disponível para visualização no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {modalidades.map((modalidade) => (
                <article
                  key={modalidade.id}
                  onClick={() => navigate(`/modalidades/${modalidade.slug}`)}
                  className="bg-white border-6 border-black rounded-xl cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 overflow-hidden"
                >
                  {/* Topo Dourado com Pictograma */}
                  <div className="w-full h-40 bg-[#D4A244] border-b-6 border-black flex items-center justify-center p-6">
                    {modalidade.pictogramaUrl ? (
                      <img
                        src={modalidade.pictogramaUrl}
                        alt={`Ícone de ${modalidade.nome}`}
                        className="w-24 h-24 object-contain"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-black rounded-lg"></div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6 text-center">
                    <h2 className="text-xl font-black uppercase mb-3 tracking-tight">
                      {modalidade.nome}
                    </h2>
                    <span className="text-xs font-black text-[#D4A244] uppercase tracking-wide">
                      Explorar História →
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

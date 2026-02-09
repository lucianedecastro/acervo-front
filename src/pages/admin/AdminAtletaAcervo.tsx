import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"
import { Plus, ArrowLeft, Upload, CheckCircle } from "lucide-react"

export default function AdminAtletaAcervo() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [itens, setItens] = useState<ItemAcervoResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function carregar() {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await itemAcervoService.listarPorAtleta(id)
      setItens(data)
    } catch {
      setError("Erro ao carregar itens de acervo desta atleta.")
    } finally {
      setLoading(false)
    }
  }

  async function publicarItem(itemId: string) {
    if (!window.confirm("Publicar este item no acervo público?")) return
    try {
      await itemAcervoService.publicar(itemId)
      carregar()
    } catch {
      alert("Erro ao publicar item.")
    }
  }

  useEffect(() => { carregar() }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-black uppercase">Carregando acervo…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/atletas")}
          className="p-2 border-4 border-black rounded-lg"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>

        <div>
          <h1 className="text-3xl font-black uppercase">Acervo da Atleta</h1>
          <p className="text-sm font-bold text-gray-600">
            Curadoria, publicação e gestão de imagens
          </p>
        </div>

        <div className="ml-auto">
          <button
            onClick={() => navigate(`/admin/acervo/novo?atletaId=${id}`)}
            className="px-5 py-3 bg-black text-white font-black uppercase text-xs border-4 border-black flex items-center gap-2"
          >
            <Plus size={16} />
            Novo Item
          </button>
        </div>
      </div>

      {error && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-black">
          {error}
        </div>
      )}

      {itens.length === 0 ? (
        <div className="border-4 border-black p-6 font-black text-center">
          Nenhum item cadastrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itens.map(item => (
            <div
              key={item.id}
              className="border-4 border-black bg-white p-4 space-y-3"
            >
              <h3 className="font-black uppercase text-lg">
                {item.titulo}
              </h3>

              <span className="inline-block px-3 py-1 border-2 border-black font-black text-xs uppercase">
                {item.status}
              </span>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigate(`/admin/acervo/editar/${item.id}`)}
                  className="flex-1 px-3 py-2 border-4 border-black font-black uppercase text-xs"
                >
                  Editar
                </button>

                {item.status === "RASCUNHO" && (
                  <button
                    onClick={() => publicarItem(item.id)}
                    className="flex-1 px-3 py-2 bg-green-500 border-4 border-black font-black uppercase text-xs flex items-center gap-1 justify-center"
                  >
                    <CheckCircle size={14} />
                    Publicar
                  </button>
                )}

                <button
                  onClick={() => navigate(`/admin/acervo/${item.id}/imagens`)}
                  className="px-3 py-2 bg-[#D4A244] border-4 border-black"
                >
                  <Upload size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

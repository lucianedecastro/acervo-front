import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { ItemAcervoResponseDTO, StatusItem } from "@/types/itemAcervo"
import { Plus, ArrowLeft } from "lucide-react"

export default function AdminAtletaAcervo() {
  const { id } = useParams<{ id: string }>() // id da atleta
  const navigate = useNavigate()

  const [itens, setItens] = useState<ItemAcervoResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function carregar() {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      /**
       * ADMIN:
       * - Lista todos os itens (inclui rascunhos)
       * - Filtra pelo vínculo com a atleta
       */
      const data = await itemAcervoService.listarAdmin()

      const filtrados = data.filter((item: any) =>
        Array.isArray(item.atletasIds) && item.atletasIds.includes(id)
      )

      setItens(filtrados)
    } catch {
      setError("Erro ao carregar itens de acervo desta atleta.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-black uppercase">Carregando acervo da atleta…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/atletas")}
          className="p-2 border-4 border-black rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>

        <div>
          <h1 className="text-3xl font-black uppercase">
            Acervo da Atleta
          </h1>
          <p className="text-sm font-bold text-gray-600">
            Gestão editorial dos itens vinculados
          </p>
        </div>

        <div className="ml-auto">
          <button
            onClick={() => navigate(`/admin/acervo/novo?atletaId=${id}`)}
            className="px-5 py-3 bg-black text-white font-black uppercase text-xs border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            Novo Item
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      {error && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-black">
          {error}
        </div>
      )}

      {itens.length === 0 ? (
        <div className="border-4 border-black p-6 font-black text-center">
          Nenhum item de acervo cadastrado para esta atleta.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itens.map((item) => (
            <div
              key={item.id}
              className="border-4 border-black bg-white p-4 space-y-3"
            >
              {/* Thumb */}
              {item.fotoPrincipalUrl && (
                <img
                  src={item.fotoPrincipalUrl}
                  alt={item.titulo}
                  className="w-full h-40 object-cover border-4 border-black"
                />
              )}

              {/* Título */}
              <h3 className="font-black uppercase text-lg">
                {item.titulo}
              </h3>

              {/* Status */}
              <span className="inline-block px-3 py-1 border-2 border-black font-black text-xs uppercase">
                {statusLabel(item.status)}
              </span>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigate(`/admin/acervo/editar/${item.id}`)}
                  className="flex-1 px-3 py-2 bg-white text-black font-black uppercase text-xs border-4 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==========================
   Helpers
   ========================== */

function statusLabel(status: StatusItem) {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho"
    case "PUBLICADO":
      return "Publicado"
    case "MEMORIAL":
      return "Memorial"
    case "ARQUIVADO":
      return "Arquivado"
    default:
      return status
  }
}

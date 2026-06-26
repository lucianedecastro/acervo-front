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
        <p className="text-sm text-acl-muted">Carregando acervo…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/atletas")}
          className="p-2 border border-acl-line rounded-sm hover:border-acl-gold-deep transition-colors"
        >
          <ArrowLeft size={18} className="text-acl-ink-soft" />
        </button>

        <div>
          <h1 className="font-serif text-2xl text-acl-ink">Acervo da atleta</h1>
          <p className="text-sm text-acl-muted">
            Curadoria, publicação e gestão de imagens
          </p>
        </div>

        <div className="ml-auto">
          <button
            onClick={() => navigate(`/admin/acervo/novo?atletaId=${id}`)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={15} />
            Novo item
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3">
          <p className="text-acl-wine text-sm">{error}</p>
        </div>
      )}

      {itens.length === 0 ? (
        <div className="card-editorial p-6 text-center text-sm text-acl-muted">
          Nenhum item cadastrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {itens.map(item => (
            <div
              key={item.id}
              className="card-editorial p-4 space-y-3"
            >
              <h3 className="font-serif text-base text-acl-ink">
                {item.titulo}
              </h3>

              <span className="inline-block px-2.5 py-1 border border-acl-line text-xs text-acl-ink-soft">
                {item.status}
              </span>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => navigate(`/admin/acervo/editar/${item.id}`)}
                  className="flex-1 px-3 py-2 border border-acl-line rounded-sm text-xs text-acl-ink-soft hover:border-acl-gold-deep transition-colors"
                >
                  Editar
                </button>

                {item.status === "RASCUNHO" && (
                  <button
                    onClick={() => publicarItem(item.id)}
                    className="flex-1 px-3 py-2 bg-acl-gold text-acl-ink rounded-sm text-xs flex items-center gap-1 justify-center hover:bg-acl-gold-deep transition-colors"
                  >
                    <CheckCircle size={13} />
                    Publicar
                  </button>
                )}

                <button
                  onClick={() => navigate(`/admin/acervo/imagens/${item.id}`)}
                  className="px-3 py-2 border border-acl-line rounded-sm hover:border-acl-gold-deep transition-colors"
                  title="Imagens"
                >
                  <Upload size={14} className="text-acl-ink-soft" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
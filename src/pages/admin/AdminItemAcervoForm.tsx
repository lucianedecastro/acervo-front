import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"
import { ItemAcervoCreateDTO, StatusItem, TipoItemAcervo } from "@/types/itemAcervo"
import { Save, ArrowLeft, ImagePlus, Trash2 } from "lucide-react"

export default function AdminItemAcervoForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const atletaIdDaUrl = searchParams.get("atletaId")

  const isEdit = Boolean(id)

  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [carregandoItem, setCarregandoItem] = useState(isEdit)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [salvoComSucesso, setSalvoComSucesso] = useState(false)
  const [novoItemId, setNovoItemId] = useState<string | null>(null)

  // Estados alinhados com ItemAcervoCreateDTO
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [local, setLocal] = useState("Não informado")
  const [procedencia, setProcedencia] = useState("Acervo pessoal da atleta")
  const [tipo, setTipo] = useState<TipoItemAcervo>("FOTO")
  const [status, setStatus] = useState<StatusItem>("PUBLICADO")
  const [modalidadeId, setModalidadeId] = useState("")
  const [dataAquisicao, setDataAquisicao] = useState("")
  const [itemHistorico, setItemHistorico] = useState(false)
  const [disponivelParaLicenciamento, setDisponivelParaLicenciamento] = useState(false)

  // Atletas vinculadas ao item — vem da URL na criação, vem do próprio
  // item na edição (não pode depender só da URL, ou some na edição)
  const [atletasIds, setAtletasIds] = useState<string[]>(
    atletaIdDaUrl ? [atletaIdDaUrl] : []
  )

  useEffect(() => {
    async function carregarModalidades() {
      try {
        const data = await modalidadeService.listarAdmin()
        setModalidades(data)
      } catch {
        setError("Erro ao carregar modalidades.")
      }
    }
    carregarModalidades()
  }, [])

  useEffect(() => {
    if (!id) return

    async function carregarItem(itemId: string) {
      try {
        setCarregandoItem(true)
        setError(null)
        const data = await itemAcervoService.obterPorIdAdmin(itemId)

        setTitulo(data.titulo || "")
        setDescricao(data.descricao || "")
        setLocal(data.local || "Não informado")
        setProcedencia(data.procedencia || "Acervo pessoal da atleta")
        setTipo(data.tipo as TipoItemAcervo)
        setStatus(data.status as StatusItem)
        setModalidadeId(data.modalidadeId || "")
        setDataAquisicao(data.dataOriginal || "")
        setItemHistorico(Boolean(data.itemHistorico))
        setDisponivelParaLicenciamento(Boolean(data.disponivelParaLicenciamento))
        setAtletasIds(data.atletasIds || [])
      } catch (err) {
        console.error("Erro ao carregar item para edição:", err)
        setError("Não foi possível carregar os dados deste item.")
      } finally {
        setCarregandoItem(false)
      }
    }

    carregarItem(id)
  }, [id])

  async function handleExcluir() {
    if (!id || !window.confirm("Deseja realmente excluir este registro do banco de dados?")) return;
    try {
      setLoading(true)
      await itemAcervoService.remover(id)
      navigate(-1)
    } catch {
      setError("Erro ao excluir o item.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (atletasIds.length === 0) {
      setError("Atleta não identificada.")
      return
    }

    // Payload seguindo estritamente a interface ItemAcervoCreateDTO
    const payload: ItemAcervoCreateDTO = {
      titulo,
      descricao,
      local,
      procedencia,
      tipo,
      status,
      dataOriginal: dataAquisicao || undefined,
      itemHistorico,
      disponivelParaLicenciamento,
      precoBaseLicenciamento: disponivelParaLicenciamento ? 250 : undefined,
      modalidadeId,
      atletasIds,
      fotos: [], // Fotos são adicionadas na etapa seguinte / endpoint próprio
      curadorResponsavel: "Curadoria Acervo Carmen Lydia"
    };

    try {
      setLoading(true)
      setError(null)

      if (isEdit && id) {
        await itemAcervoService.atualizar(id, payload)
        alert("Item atualizado com sucesso!")
        navigate(-1)
        return
      }

      const criado = await itemAcervoService.criar(payload)
      setSalvoComSucesso(true)
      setNovoItemId(criado.id)

      alert("Dados salvos com sucesso!")
      navigate(`/admin/acervo/imagens/${criado.id}`)
    } catch {
      setError(isEdit ? "Erro ao atualizar o item de acervo." : "Erro ao salvar o item de acervo.")
    } finally {
      setLoading(false)
    }
  }

  if (carregandoItem) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-acl-muted">Carregando item...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 border border-acl-line rounded-sm hover:border-acl-gold-deep transition-colors">
            <ArrowLeft size={18} className="text-acl-ink-soft" />
          </button>
          <div>
            <h1 className="font-serif text-2xl text-acl-ink">{isEdit ? "Editar registro" : "Novo item"}</h1>
            <p className="text-sm text-acl-muted">Gestão de catálogo e licenciamento</p>
          </div>
        </div>

        {isEdit && (
          <button onClick={handleExcluir} className="flex items-center gap-2 text-sm text-acl-wine hover:underline">
            <Trash2 size={16} /> Excluir registro
          </button>
        )}
      </div>

      {error && (
        <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3">
          <p className="text-acl-wine text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-editorial p-6 space-y-5">

        <div>
          <label className="block text-xs text-acl-muted mb-1.5">Título do item</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        <div>
          <label className="block text-xs text-acl-muted mb-1.5">Descrição curta</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={2}
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-acl-line">
          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Tipo (natureza)</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoItemAcervo)}
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
            >
              <option value="FOTO">Foto</option>
              <option value="VIDEO">Vídeo</option>
              <option value="DOCUMENTO">Documento</option>
              <option value="OBJETO">Objeto / item físico</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Local</label>
            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
            />
          </div>
          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Procedência</label>
            <input
              value={procedencia}
              onChange={(e) => setProcedencia(e.target.value)}
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs text-acl-muted mb-1.5">Modalidade</label>
            <select
              value={modalidadeId}
              onChange={(e) => setModalidadeId(e.target.value)}
              required
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
            >
              <option value="">Selecione...</option>
              {modalidades.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Status do item</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusItem)}
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
            >
              <option value="PUBLICADO">Publicado</option>
              <option value="RASCUNHO">Rascunho</option>
              <option value="MEMORIAL">Memorial</option>
              <option value="DISPONIVEL_LICENCIAMENTO">Licenciável</option>
              <option value="ARQUIVADO">Arquivado</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 p-4 bg-acl-cream rounded-sm">
          <label className="flex items-center gap-2.5 text-sm text-acl-ink-soft cursor-pointer">
            <input type="checkbox" checked={itemHistorico} onChange={(e) => setItemHistorico(e.target.checked)} className="w-4 h-4 accent-acl-gold-deep" />
            Item memorial
          </label>
          <label className="flex items-center gap-2.5 text-sm text-acl-ink-soft cursor-pointer">
            <input type="checkbox" checked={disponivelParaLicenciamento} onChange={(e) => setDisponivelParaLicenciamento(e.target.checked)} className="w-4 h-4 accent-acl-gold-deep" />
            Licenciável
          </label>
        </div>

        <div className="pt-2 space-y-3">
          {!salvoComSucesso ? (
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              <Save size={16} /> {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Salvar e ir para imagens"}
            </button>
          ) : (
            <button type="button" onClick={() => navigate(`/admin/acervo/imagens/${novoItemId}`)} className="btn-primary w-full flex items-center justify-center gap-2">
              <ImagePlus size={16} /> Adicionar imagens agora
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
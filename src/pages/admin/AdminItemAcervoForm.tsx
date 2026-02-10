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
  const atletaId = searchParams.get("atletaId")

  const isEdit = Boolean(id)

  const [modalidades, setModalidades] = useState<Modalidade[]>([])
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

  async function handleExcluir() {
    if (!id || !window.confirm("Deseja realmente excluir este registro do banco de dados?")) return;
    try {
      setLoading(true)
      await itemAcervoService.remover(id)
      navigate("/admin/acervo")
    } catch {
      setError("Erro ao excluir o item.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!atletaId && !isEdit) {
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
      atletasIds: atletaId ? [atletaId] : [],
      fotos: [], // Inicialmente vazio para o primeiro passo
      curadorResponsavel: "Curadoria Acervo Carmen Lydia"
    };

    try {
      setLoading(true)
      setError(null)

      const criado = await itemAcervoService.criar(payload)
      setSalvoComSucesso(true)
      setNovoItemId(criado.id)

      alert("Dados salvos com sucesso!")
      navigate(`/admin/acervo/imagens/${criado.id}`)
    } catch {
      setError("Erro ao salvar o item de acervo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 border-4 border-black rounded-lg">
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase">{isEdit ? "Editar Registro" : "Novo Item"}</h1>
            <p className="text-sm font-bold text-gray-600">Gestão de catálogo e licenciamento</p>
          </div>
        </div>

        {isEdit && (
          <button onClick={handleExcluir} className="flex items-center gap-2 bg-red-100 text-red-600 border-4 border-red-600 px-4 py-2 font-black uppercase">
            <Trash2 size={18} /> Excluir Registro
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 border-4 border-black p-6 rounded-xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <div>
          <label className="block font-black uppercase text-xs mb-2">Título do Item</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required className="w-full border-4 border-black p-3 font-bold" />
        </div>

        <div>
          <label className="block font-black uppercase text-xs mb-2">Descrição Curta</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={2} className="w-full border-4 border-black p-3 font-bold" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t-4 border-black border-dashed">
          <div>
            <label className="block font-black uppercase text-xs mb-2">Tipo (Natureza)</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoItemAcervo)} className="w-full border-4 border-black p-3 font-black">
              <option value="FOTO">FOTO</option>
              <option value="VIDEO">VÍDEO</option>
              <option value="DOCUMENTO">DOCUMENTO</option>
              <option value="OBJETO">OBJETO / ITEM FÍSICO</option>
            </select>
          </div>
          <div>
            <label className="block font-black uppercase text-xs mb-2">Local</label>
            <input value={local} onChange={(e) => setLocal(e.target.value)} className="w-full border-4 border-black p-3 font-bold" />
          </div>
          <div>
            <label className="block font-black uppercase text-xs mb-2">Procedência</label>
            <input value={procedencia} onChange={(e) => setProcedencia(e.target.value)} className="w-full border-4 border-black p-3 font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block font-black uppercase text-xs mb-2">Modalidade</label>
            <select value={modalidadeId} onChange={(e) => setModalidadeId(e.target.value)} required className="w-full border-4 border-black p-3 font-bold">
              <option value="">Selecione...</option>
              {modalidades.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-black uppercase text-xs mb-2">Status do Item</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as StatusItem)} className="w-full border-4 border-black p-3 font-black bg-yellow-50">
              <option value="PUBLICADO">PUBLICADO</option>
              <option value="RASCUNHO">RASCUNHO</option>
              <option value="MEMORIAL">MEMORIAL</option>
              <option value="DISPONIVEL_LICENCIAMENTO">LICENCIÁVEL</option>
              <option value="ARQUIVADO">ARQUIVADO</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 p-4 bg-gray-50 border-4 border-black border-dotted">
          <label className="flex items-center gap-3 font-black uppercase text-sm cursor-pointer">
            <input type="checkbox" checked={itemHistorico} onChange={(e) => setItemHistorico(e.target.checked)} className="w-5 h-5 border-4 border-black" />
            Item Memorial
          </label>
          <label className="flex items-center gap-3 font-black uppercase text-sm cursor-pointer">
            <input type="checkbox" checked={disponivelParaLicenciamento} onChange={(e) => setDisponivelParaLicenciamento(e.target.checked)} className="w-5 h-5 border-4 border-black" />
            Licenciável
          </label>
        </div>

        <div className="pt-4">
          {!salvoComSucesso ? (
            <button type="submit" disabled={loading} className="w-full bg-black text-white font-black uppercase p-4 flex items-center justify-center gap-2 hover:bg-yellow-500 hover:text-black transition-colors">
              <Save size={20} /> Salvar e Ir para Imagens
            </button>
          ) : (
            <button type="button" onClick={() => navigate(`/admin/acervo/imagens/${novoItemId}`)} className="w-full bg-yellow-500 text-black border-4 border-black font-black uppercase p-4 flex items-center justify-center gap-2">
              <ImagePlus size={20} /> Adicionar Imagens Agora
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
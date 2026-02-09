import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"
import { ItemAcervoCreateDTO } from "@/types/itemAcervo"
import { Save, ArrowLeft, ImagePlus } from "lucide-react"

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

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!atletaId && !isEdit) {
      setError("Atleta não vinculada. Volte e selecione uma atleta primeiro.")
      return
    }

    const payload: ItemAcervoCreateDTO = {
      titulo,
      descricao,
      local: "Não informado",
      dataOriginal: dataAquisicao || undefined,
      procedencia: "Acervo pessoal da atleta",
      tipo: "FOTO",
      status: itemHistorico ? "MEMORIAL" : "RASCUNHO",
      itemHistorico,
      disponivelParaLicenciamento,
      precoBaseLicenciamento: disponivelParaLicenciamento ? 250 : undefined,
      modalidadeId,
      atletasIds: atletaId ? [atletaId] : [],
      fotos: [], // O binário será enviado no próximo passo
      curadorResponsavel: "Curadoria Acervo Carmen Lydia"
    };

    try {
      setLoading(true)
      setError(null)

      const criado = await itemAcervoService.criar(payload)
      setSalvoComSucesso(true)
      setNovoItemId(criado.id)

      // Salto automático para a próxima etapa
      navigate(`/admin/acervo/imagens/${criado.id}`)
    } catch (err) {
      setError("Erro ao salvar dados básicos. Verifique os campos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 border-4 border-black rounded-lg">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <div>
          <h1 className="text-3xl font-black uppercase">
            {isEdit ? "Editar Item" : "Novo Cadastro"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 border-4 border-black p-6 rounded-xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <label className="block font-black uppercase text-sm mb-2">Título do Item</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full border-4 border-black p-3 font-bold"
          />
        </div>

        <div>
          <label className="block font-black uppercase text-sm mb-2">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="w-full border-4 border-black p-3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-black uppercase text-sm mb-2">Modalidade</label>
            <select
              value={modalidadeId}
              onChange={(e) => setModalidadeId(e.target.value)}
              required
              className="w-full border-4 border-black p-3 font-bold"
            >
              <option value="">Selecione...</option>
              {modalidades.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-black uppercase text-sm mb-2">Data</label>
            <input
              type="date"
              value={dataAquisicao}
              onChange={(e) => setDataAquisicao(e.target.value)}
              className="w-full border-4 border-black p-3 font-bold"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-black uppercase p-4 flex items-center justify-center gap-2 hover:bg-gray-800"
          >
            {loading ? "Salvando..." : <><Save size={20} /> Salvar e Ir para Fotos</>}
          </button>
        </div>
      </form>
    </div>
  )
}
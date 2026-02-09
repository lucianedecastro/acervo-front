import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"
import { ItemAcervoCreateDTO } from "@/types/itemAcervo"
import { Save, ArrowLeft } from "lucide-react"

export default function AdminItemAcervoForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>() // id do item (edição)
  const [searchParams] = useSearchParams()
  const atletaId = searchParams.get("atletaId")

  const isEdit = Boolean(id)

  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError("Atleta não identificada.")
      return
    }

    const payload: ItemAcervoCreateDTO = {
  /* ======================
     Conteúdo editorial
     ====================== */
  titulo,
  descricao,
  local: "Não informado",
  dataOriginal: dataAquisicao || undefined,
  procedencia: "Acervo pessoal da atleta",

  /* ======================
     Tipificação
     ====================== */
  tipo: "FOTO",
  status: itemHistorico ? "MEMORIAL" : "RASCUNHO",

  /* ======================
     Licenciamento
     ====================== */
  itemHistorico,
  disponivelParaLicenciamento,
  precoBaseLicenciamento: disponivelParaLicenciamento ? 250 : undefined,

  /* ======================
     Relacionamentos
     ====================== */
  modalidadeId,
  atletasIds: atletaId ? [atletaId] : [],

  /* ======================
     Curadoria
     ====================== */
  curadorResponsavel: "Curadoria Acervo Carmen Lydia"
};

    try {
      setLoading(true)
      setError(null)

      const criado = await itemAcervoService.criar(payload)

      alert("Item de acervo salvo com sucesso.")

      /**
       * Fluxo editorial:
       * Após criar o item, o próximo passo é a gestão de imagens
       * (upload com watermark e controle de visibilidade)
       */
      navigate(`/admin/acervo/editar/${criado.id}`)
    } catch {
      setError("Erro ao salvar o item de acervo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 border-4 border-black rounded-lg"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>

        <div>
          <h1 className="text-3xl font-black uppercase">
            {isEdit ? "Editar Item de Acervo" : "Novo Item de Acervo"}
          </h1>
          <p className="text-sm font-bold text-gray-600">
            Cadastro editorial do acervo da atleta
          </p>
        </div>
      </div>

      {error && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-black">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border-4 border-black p-6 rounded-xl bg-white"
      >
        {/* Aviso Editorial */}
        <div className="border-4 border-black bg-gray-100 p-4 text-sm font-bold">
          As imagens vinculadas a este item serão exibidas em baixa resolução,
          com marca d’água do Acervo Carmen Lydia.
          O uso comercial depende de autorização expressa e licenciamento.
        </div>

        {/* Título */}
        <div>
          <label className="block font-black uppercase text-sm mb-2">
            Título do Item
          </label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="Ex: Final do Campeonato Paulista de 1984"
            className="w-full border-4 border-black p-3 font-bold"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block font-black uppercase text-sm mb-2">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            placeholder="Contexto histórico, local, evento, pessoas envolvidas…"
            className="w-full border-4 border-black p-3"
          />
        </div>

        {/* Modalidade */}
        <div>
          <label className="block font-black uppercase text-sm mb-2">
            Modalidade
          </label>
          <select
            value={modalidadeId}
            onChange={(e) => setModalidadeId(e.target.value)}
            required
            className="w-full border-4 border-black p-3 font-bold"
          >
            <option value="">Selecione a modalidade</option>
            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div>
          <label className="block font-black uppercase text-sm mb-2">
            Data do Evento (opcional)
          </label>
          <input
            type="date"
            value={dataAquisicao}
            onChange={(e) => setDataAquisicao(e.target.value)}
            className="w-full border-4 border-black p-3 font-bold"
          />
        </div>

        {/* Flags */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 font-black uppercase text-sm">
            <input
              type="checkbox"
              checked={itemHistorico}
              onChange={(e) => setItemHistorico(e.target.checked)}
            />
            Item histórico / memorial
          </label>

          <label className="flex items-center gap-3 font-black uppercase text-sm">
            <input
              type="checkbox"
              checked={disponivelParaLicenciamento}
              onChange={(e) => setDisponivelParaLicenciamento(e.target.checked)}
            />
            Disponível para licenciamento
          </label>
        </div>

        {/* Ações */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white font-black uppercase p-3 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Salvar Item
          </button>
        </div>
      </form>
    </div>
  )
}

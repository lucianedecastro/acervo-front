import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade, ModalidadeDTO } from "@/types/modalidade"
import { Trophy, Save, X } from "lucide-react"

export default function ModalidadeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [nome, setNome] = useState("")
  const [historia, setHistoria] = useState("")
  const [pictogramaUrl, setPictogramaUrl] = useState("")
  const [fotoDestaquePublicId, setFotoDestaquePublicId] = useState("")
  const [ativa, setAtiva] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function carregar() {
      try {
        setLoading(true)
        setError(null)
        const data: Modalidade = await modalidadeService.buscarPorId(id as string)
        setNome(data.nome)
        setHistoria(data.historia || "")
        setPictogramaUrl(data.pictogramaUrl || "")
        setFotoDestaquePublicId(data.fotoDestaquePublicId || "")
        setAtiva(data.ativa !== false)
      } catch (err) {
        console.error("Erro ao carregar modalidade:", err)
        setError("Não foi possível carregar os dados desta modalidade.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload: ModalidadeDTO = {
      nome,
      historia,
      pictogramaUrl,
      fotoDestaquePublicId,
      ativa,
      fotos: [],
    }

    try {
      if (isEdit && id) {
        await modalidadeService.atualizar(id as string, payload)
        alert("Modalidade atualizada com sucesso!")
      } else {
        await modalidadeService.criar(payload)
        alert("Nova modalidade criada com sucesso!")
      }
      navigate("/admin/modalidades")
    } catch (err) {
      console.error("Erro ao salvar modalidade:", err)
      setError("Falha ao salvar a modalidade. Verifique os dados e o serviço.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Carregando dados...</p>
        </div>
      </div>
    )

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Trophy size={36} strokeWidth={3} className="sm:w-12 sm:h-12 flex-shrink-0" />
          <span className="leading-tight break-words">
            {isEdit ? `Editar: ${nome}` : "Cadastrar Nova Modalidade"}
          </span>
        </h1>
        <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-3"></div>
      </div>

      {error && (
        <div className="bg-red-500 border-4 sm:border-6 border-black rounded-xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-white font-black text-sm sm:text-base lg:text-lg uppercase">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6 sm:space-y-8">

        {/* Nome */}
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">
            Nome da Modalidade
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Natação, Atletismo..."
            required
            className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
          />
        </div>

        {/* URLs - Grid Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">
              URL do Pictograma
            </label>
            <input
              type="text"
              value={pictogramaUrl}
              onChange={(e) => setPictogramaUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">
              Foto de Destaque (Public ID)
            </label>
            <input
              type="text"
              value={fotoDestaquePublicId}
              onChange={(e) => setFotoDestaquePublicId(e.target.value)}
              placeholder="modalidades/foto_capa"
              className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            />
          </div>
        </div>

        {/* História */}
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">
            História da Modalidade
          </label>
          <textarea
            value={historia}
            onChange={(e) => setHistoria(e.target.value)}
            rows={6}
            placeholder="Descreva a trajetória desta modalidade..."
            className="w-full px-4 py-3 border-4 border-black rounded-lg font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244] resize-none"
          />
        </div>

        {/* Checkbox Ativa */}
        <div className="flex items-start sm:items-center gap-3">
          <input
            type="checkbox"
            id="ativa"
            checked={ativa}
            onChange={(e) => setAtiva(e.target.checked)}
            className="w-6 h-6 border-4 border-black rounded focus:ring-4 focus:ring-[#D4A244] flex-shrink-0 mt-0.5 sm:mt-0"
          />
          <label htmlFor="ativa" className="text-xs sm:text-sm font-black uppercase text-gray-700 cursor-pointer">
            Modalidade disponível para novos cadastros
          </label>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
            {loading ? "Gravando..." : "Salvar Modalidade"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/modalidades")}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 sm:gap-3"
          >
            <X size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

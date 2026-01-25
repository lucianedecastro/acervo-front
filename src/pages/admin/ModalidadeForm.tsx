import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade, ModalidadeDTO } from "@/types/modalidade"
import { Trophy, Save, X, Upload } from "lucide-react"

export default function ModalidadeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [nome, setNome] = useState("")
  const [historia, setHistoria] = useState("")
  const [pictogramaUrl, setPictogramaUrl] = useState("")
  const [fotoDestaquePublicId, setFotoDestaquePublicId] = useState("")

  // NOVO — arquivos para upload
  const [pictogramaFile, setPictogramaFile] = useState<File | null>(null)
  const [fotoDestaqueFile, setFotoDestaqueFile] = useState<File | null>(null)

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

    /**
     * IMPORTANTE
     * - O PUT continua apenas editorial
     * - Uploads ocorrem depois, em endpoints próprios
     */
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

        // Upload opcional do pictograma
        if (pictogramaFile) {
          await modalidadeService.uploadPictograma(id as string, pictogramaFile)
        }

        // Upload opcional da foto de destaque
        if (fotoDestaqueFile) {
          await modalidadeService.uploadFotoDestaque(id as string, fotoDestaqueFile)
        }

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
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">
            Carregando dados...
          </p>
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
        <div className="bg-red-500 border-4 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-white font-black uppercase">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border-4 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6"
      >
        {/* Nome */}
        <div>
          <label className="block text-xs font-black uppercase mb-2 text-gray-700">
            Nome da Modalidade
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold"
          />
        </div>

        {/* URLs + Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase mb-2">
              Pictograma (URL ou Upload)
            </label>
            <input
              type="text"
              value={pictogramaUrl}
              onChange={(e) => setPictogramaUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold mb-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPictogramaFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-2">
              Foto de Destaque (Upload)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFotoDestaqueFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
        </div>

        {/* História */}
        <div>
          <label className="block text-xs font-black uppercase mb-2">
            História da Modalidade
          </label>
          <textarea
            value={historia}
            onChange={(e) => setHistoria(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border-4 border-black rounded-lg"
          />
        </div>

        {/* Ativa */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={ativa}
            onChange={(e) => setAtiva(e.target.checked)}
            className="w-6 h-6 border-4 border-black"
          />
          <span className="font-black uppercase text-sm">
            Modalidade disponível para novos cadastros
          </span>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white font-black uppercase py-3 border-4 border-black rounded-lg flex items-center justify-center gap-2"
          >
            <Save size={20} strokeWidth={3} />
            {loading ? "Gravando..." : "Salvar"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/modalidades")}
            className="px-6 py-3 bg-white text-black font-black uppercase border-4 border-black rounded-lg flex items-center gap-2"
          >
            <X size={20} strokeWidth={3} />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

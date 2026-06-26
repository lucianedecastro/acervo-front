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

  // Uploads (fonte única da verdade)
  const [pictogramaFile, setPictogramaFile] = useState<File | null>(null)
  const [fotoDestaqueFile, setFotoDestaqueFile] = useState<File | null>(null)

  const [pictogramaPreview, setPictogramaPreview] = useState<string | null>(null)
  const [fotoDestaquePreview, setFotoDestaquePreview] = useState<string | null>(null)

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
        setError("Não foi possível carregar os dados desta modalidade.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    /**
     * IMPORTANTE
     * - PUT continua apenas editorial
     * - Uploads acontecem em endpoints próprios
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
        await modalidadeService.atualizar(id, payload)

        if (pictogramaFile) {
          await modalidadeService.uploadPictograma(id, pictogramaFile)
        }

        if (fotoDestaqueFile) {
          await modalidadeService.uploadFotoDestaque(id, fotoDestaqueFile)
        }

        alert("Modalidade atualizada com sucesso!")
      } else {
        await modalidadeService.criar(payload)
        alert("Nova modalidade criada com sucesso!")
      }

      navigate("/admin/modalidades")
    } catch {
      setError("Falha ao salvar a modalidade.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit && !nome) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-acl-muted">Carregando modalidade...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <h1 className="font-serif text-2xl text-acl-ink flex items-center gap-3">
        <Trophy size={22} className="text-acl-gold-deep" />
        {isEdit ? `Editar: ${nome}` : "Cadastrar modalidade"}
      </h1>

      {error && (
        <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3">
          <p className="text-acl-wine text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-editorial p-6 space-y-5">

        {/* Nome */}
        <div>
          <label className="block text-xs text-acl-muted mb-1.5">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Nome da modalidade"
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        {/* Pictograma */}
        <div className="space-y-2.5">
          <label className="block text-xs text-acl-muted">Pictograma</label>

          {(pictogramaPreview || pictogramaUrl) && (
            <div className="w-16 h-16 border border-acl-line rounded-sm flex items-center justify-center p-2 bg-white">
              <img
                src={pictogramaPreview || pictogramaUrl}
                alt="Pictograma atual"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-acl-ink-soft cursor-pointer">
            <Upload size={15} /> Enviar arquivo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setPictogramaFile(file)
                if (file) setPictogramaPreview(URL.createObjectURL(file))
              }}
            />
          </label>

          <input
            type="url"
            value={pictogramaUrl}
            onChange={(e) => setPictogramaUrl(e.target.value)}
            placeholder="ou cole a URL do Cloudinary manualmente"
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        {/* Foto de destaque */}
        <div className="space-y-2.5">
          <label className="block text-xs text-acl-muted">Foto de destaque</label>

          {fotoDestaquePreview && (
            <img
              src={fotoDestaquePreview}
              alt="Pré-visualização"
              className="w-full max-w-sm border border-acl-line rounded-sm"
            />
          )}

          <label className="flex items-center gap-2 text-sm text-acl-ink-soft cursor-pointer">
            <Upload size={15} /> Enviar arquivo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setFotoDestaqueFile(file)
                if (file) setFotoDestaquePreview(URL.createObjectURL(file))
              }}
            />
          </label>
        </div>

        {/* História */}
        <div>
          <label className="block text-xs text-acl-muted mb-1.5">História</label>
          <textarea
            value={historia}
            onChange={(e) => setHistoria(e.target.value)}
            rows={6}
            placeholder="História da modalidade"
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        <label className="flex items-center gap-3 text-sm text-acl-ink-soft cursor-pointer">
          <input
            type="checkbox"
            checked={ativa}
            onChange={(e) => setAtiva(e.target.checked)}
            className="w-4 h-4 accent-acl-gold-deep"
          />
          Modalidade ativa
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={16} /> {loading ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/modalidades")}
            className="btn-secondary-light flex items-center gap-2"
          >
            <X size={16} /> Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
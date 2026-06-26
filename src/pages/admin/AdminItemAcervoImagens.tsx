import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"

export default function AdminItemAcervoImagens() {

  const { itemId } = useParams<{ itemId: string }>()
  const navigate = useNavigate()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [ehDestaque, setEhDestaque] = useState(true)
  const [legenda, setLegenda] = useState("Imagem do acervo")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  async function handleUpload() {
    if (!file || !itemId) {
      setError("Item não identificado ou arquivo ausente.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      /**
       * O service adicionarFoto deve enviar o arquivo para o Cloudinary
       * e o JSON resultante para o seu endpoint Java.
       */
      await itemAcervoService.adicionarFoto(
        itemId,
        file,
        {
          // CONTRATO COMPLETO COM O BACKEND
          // Estes campos são nulos porque o Backend/Cloudinary os preencherá
          id: undefined,
          publicId: "",
          version: "",
          url: "",
          filename: file.name,

          legenda,
          ehDestaque,
          autorNomePublico: "Acervo Carmen Lydia",
          licenciamentoPermitido: true,
        }
      )

      alert("Imagem enviada e vinculada com sucesso!")
      navigate("/admin/atletas")
    } catch (err) {
      console.error("Erro no upload:", err)
      setError("Erro ao enviar imagem. Verifique a conexão com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 border border-acl-line rounded-sm hover:border-acl-gold-deep transition-colors"
        >
          <ArrowLeft size={18} className="text-acl-ink-soft" />
        </button>

        <div>
          <h1 className="font-serif text-2xl text-acl-ink">
            Imagens do item
          </h1>
          <p className="text-sm text-acl-muted">
            Upload protegido • ID do item: {itemId}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3">
          <p className="text-acl-wine text-sm">{error}</p>
        </div>
      )}

      <div className="card-editorial p-6 space-y-5">
        <div>
          <label className="block text-sm text-acl-ink-soft mb-2">
            Selecionar arquivo original (alta resolução)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-acl-ink-soft file:mr-4 file:py-2 file:px-4 file:border file:border-acl-line file:rounded-sm file:bg-white file:text-acl-ink-soft hover:file:border-acl-gold-deep cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm text-acl-ink-soft mb-2">
            Legenda
          </label>
          <input
            value={legenda}
            onChange={(e) => setLegenda(e.target.value)}
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        <label className="flex items-center gap-2.5 text-sm text-acl-ink-soft cursor-pointer">
          <input
            type="checkbox"
            checked={ehDestaque}
            onChange={(e) => setEhDestaque(e.target.checked)}
            className="w-4 h-4 accent-acl-gold-deep"
          />
          Marcar como foto de destaque deste item
        </label>

        {preview && (
          <div className="space-y-2 pt-4 border-t border-acl-line">
            <p className="text-xs text-acl-muted">
              Pré-visualização do arquivo
            </p>
            <div className="relative aspect-video border border-acl-line bg-acl-cream overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full btn-primary flex items-center justify-center gap-2 ${
              (loading || !file) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            {loading ? "Enviando para o acervo..." : "Confirmar e vincular imagem"}
          </button>
        </div>
      </div>

      <div className="bg-acl-gold/10 border border-acl-gold-deep rounded-sm p-4">
        <p className="text-xs text-acl-ink-soft">
          Nota: após o upload, o sistema gerará automaticamente as versões com marca d'água para visualização pública.
        </p>
      </div>
    </div>
  )
}
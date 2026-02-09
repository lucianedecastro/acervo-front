import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { Save, ArrowLeft, Upload } from "lucide-react"

interface FotoUploadResponse {
  publicId: string
  urlVisualizacao: string
}

export default function AdminItemAcervoImagens() {
  const { itemId } = useParams<{ itemId: string }>()
  const navigate = useNavigate()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  async function handleUpload() {
    if (!file || !itemId) return

    try {
      setLoading(true)
      setError(null)

      /**
       * 1️⃣ Upload da imagem do item
       * - Frontend envia o arquivo original
       * - Backend aplica watermark automaticamente
       * - Imagem já é persistida vinculada ao item
       */
      await itemAcervoService.adicionarFoto(
        itemId,
        file,
        {
          legenda: "Imagem do acervo",
          ehDestaque: true,
          autorNomePublico: "Acervo Carmen Lydia",
          licenciamentoPermitido: true,
        }
      )

      alert("Imagem enviada com sucesso (versão protegida).")
      navigate(-1)
    } catch {
      setError("Erro ao enviar imagem do item.")
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
            Imagens do Item de Acervo
          </h1>
          <p className="text-sm font-bold text-gray-600">
            Upload protegido com marca d’água automática
          </p>
        </div>
      </div>

      {error && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-black">
          {error}
        </div>
      )}

      <div className="border-4 border-black p-6 rounded-xl bg-white space-y-6">
        {/* Upload */}
        <div>
          <label className="block font-black uppercase text-sm mb-2">
            Selecionar imagem
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full font-bold"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-2">
            <p className="font-black uppercase text-xs">
              Pré-visualização (sem watermark)
            </p>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain border-4 border-black"
            />
            <p className="text-xs font-bold text-gray-600">
              A imagem final será publicada em baixa resolução e com marca d’água do acervo.
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="flex-1 bg-black text-white font-black uppercase p-3 flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            Enviar Imagem
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"

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

      await itemAcervoService.adicionarFoto(
        itemId,
        file,
        {
          // 🔒 CONTRATO COMPLETO COM O BACKEND
          id: null,
          publicId: null,
          version: null,
          url: null,
          filename: file.name,

          legenda: "Imagem do acervo",
          ehDestaque: true,
          autorNomePublico: "Acervo Carmen Lydia",
          licenciamentoPermitido: true,
        }
      )

      alert("Imagem enviada e vinculada com sucesso!")
      navigate("/admin/acervo")
    } catch (err) {
      console.error(err)
      setError("Erro ao enviar imagem do item.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 border-4 border-black rounded-lg"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>

        <div>
          <h1 className="text-3xl font-black uppercase">
            Imagens do Item
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
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="flex-1 bg-black text-white font-black uppercase p-3 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
            {loading ? "Processando..." : "Enviar Imagem"}
          </button>
        </div>
      </div>
    </div>
  )
}

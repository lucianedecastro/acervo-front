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

          legenda: "Imagem do acervo",
          ehDestaque: true,
          autorNomePublico: "Acervo Carmen Lydia",
          licenciamentoPermitido: true,
        }
      )

      alert("Imagem enviada e vinculada com sucesso!")
      // Redireciona para a lista geral ou para o detalhe do item recém criado
      navigate("/admin/atletas") 
    } catch (err) {
      console.error("Erro no upload:", err)
      setError("Erro ao enviar imagem. Verifique a conexão com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 border-4 border-black rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>

        <div>
          <h1 className="text-3xl font-black uppercase">
            Imagens do Item
          </h1>
          <p className="text-sm font-bold text-gray-600">
            Upload protegido • ID do Item: {itemId}
          </p>
        </div>
      </div>

      {error && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-black">
          {error}
        </div>
      )}

      <div className="border-4 border-black p-6 rounded-xl bg-white space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <label className="block font-black uppercase text-sm mb-2">
            Selecionar arquivo original (Alta Resolução)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full font-bold file:mr-4 file:py-2 file:px-4 file:border-4 file:border-black file:bg-yellow-400 file:font-black file:uppercase hover:file:bg-black hover:file:text-white cursor-pointer"
          />
        </div>

        {preview && (
          <div className="space-y-2 pt-4 border-t-4 border-black border-dashed">
            <p className="font-black uppercase text-xs text-gray-500">
              Pré-visualização do Arquivo
            </p>
            <div className="relative aspect-video border-4 border-black bg-gray-100 overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`flex-1 bg-black text-white font-black uppercase p-4 flex items-center justify-center gap-2 transition-transform active:scale-95 ${
              (loading || !file) ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-500 hover:text-black"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
            {loading ? "Enviando para o Acervo..." : "Confirmar e Vincular Imagem"}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border-4 border-blue-600 p-4">
        <p className="text-xs font-bold text-blue-800 uppercase">
          ℹ Nota: Após o upload, o sistema gerará automaticamente as versões com marca d'água para visualização pública.
        </p>
      </div>
    </div>
  )
}
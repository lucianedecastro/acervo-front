import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { itemAcervoService } from "@/services/itemAcervoService"
import { Save, ArrowLeft, Upload } from "lucide-react"

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
       * O backend recebe o arquivo e deve retornar o objeto da foto
       * com a URL e o publicId preenchidos.
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

      alert("Imagem enviada com sucesso! O sistema processou a versão protegida.")
      // Redireciona para o detalhe do item para validar o resultado
      navigate(`/acervo/item/${itemId}`)
    } catch (err) {
      console.error("Erro no upload:", err)
      setError("Erro ao enviar imagem. Verifique se o arquivo é muito grande ou se a conexão caiu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 border-4 border-black rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>

        <div>
          <h1 className="text-3xl font-black uppercase">
            Imagens do Item
          </h1>
          <p className="text-sm font-bold text-gray-600">
            A marca d'água será aplicada automaticamente no servidor.
          </p>
        </div>
      </div>

      {error && (
        <div className="border-4 border-black bg-red-500 text-white p-4 font-black uppercase">
          {error}
        </div>
      )}

      <div className="border-4 border-black p-6 rounded-xl bg-white space-y-6">
        <div>
          <label className="block font-black uppercase text-sm mb-2">
            Selecionar arquivo (JPG, PNG)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full font-bold file:mr-4 file:py-2 file:px-4 file:border-4 file:border-black file:bg-black file:text-white file:font-black file:uppercase"
          />
        </div>

        {preview && (
          <div className="space-y-2">
            <p className="font-black uppercase text-xs">Pré-visualização do Original</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain border-4 border-black bg-gray-50"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full bg-black text-white font-black uppercase p-4 flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Processando..." : (
            <>
              <Upload size={20} />
              Finalizar e Publicar
            </>
          )}
        </button>
      </div>
    </div>
  )
}
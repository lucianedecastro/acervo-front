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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-black uppercase flex items-center gap-4">
        <Trophy size={36} strokeWidth={3} />
        {isEdit ? `Editar: ${nome}` : "Cadastrar Modalidade"}
      </h1>

      {error && (
        <div className="bg-red-500 border-4 border-black p-4 rounded-xl text-white font-black">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 border-4 border-black p-6 rounded-xl bg-white">

        {/* Nome */}
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          placeholder="Nome da modalidade"
          className="w-full border-4 border-black p-3 font-bold"
        />

        {/* Upload Pictograma */}
        <div>
          <label className="font-black uppercase text-sm flex items-center gap-2">
            <Upload size={16} /> Upload do Pictograma
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPictogramaFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Upload Foto Destaque */}
        <div>
          <label className="font-black uppercase text-sm flex items-center gap-2">
            <Upload size={16} /> Foto de Destaque
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFotoDestaqueFile(e.target.files?.[0] || null)}
          />
        </div>

        <textarea
          value={historia}
          onChange={(e) => setHistoria(e.target.value)}
          rows={6}
          placeholder="História da modalidade"
          className="w-full border-4 border-black p-3"
        />

        <label className="flex items-center gap-3 font-black uppercase text-sm">
          <input type="checkbox" checked={ativa} onChange={(e) => setAtiva(e.target.checked)} />
          Modalidade ativa
        </label>

        <div className="flex gap-4">
          <button className="flex-1 bg-black text-white font-black uppercase p-3 flex items-center justify-center gap-2">
            <Save size={20} /> Salvar
          </button>
          <button type="button" onClick={() => navigate("/admin/modalidades")} className="border-4 border-black p-3 font-black uppercase">
            <X size={20} /> Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

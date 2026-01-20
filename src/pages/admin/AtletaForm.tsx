import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"

import { AtletaFormDTO, Foto } from "@/types/atleta"
import { Modalidade } from "@/types/modalidade"

export default function AtletaForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  /* ==========================
     STATES
     ========================== */
  const [nome, setNome] = useState("")
  const [biografia, setBiografia] = useState("")
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<string[]>([])
  const [modalidades, setModalidades] = useState<Modalidade[]>([])

  const [fotos, setFotos] = useState<Foto[]>([])
  const [fotoDestaqueId, setFotoDestaqueId] = useState<string | undefined>()
  const [fotosRemovidas, setFotosRemovidas] = useState<string[]>([])

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  /* ==========================
     LOAD MODALIDADES + ATLETA
     ========================== */
  useEffect(() => {
    modalidadeService
      .listar()
      .then(setModalidades)
      .catch((err) =>
        console.error("Erro ao carregar modalidades:", err)
      )

    if (isEditing && id) {
      atletaService.buscarPorId(id).then((data) => {
        setNome(data.nome)
        setBiografia(data.biografia)
        setModalidadesSelecionadas(data.modalidades || [])
        setFotos(data.fotos || [])

        const destaque = data.fotos?.find((f) => f.isDestaque)
        if (destaque) setFotoDestaqueId(destaque.id)
      })
    }
  }, [id, isEditing])

  /* ==========================
     UPLOAD DE FOTO
     ========================== */
  async function handleUploadFoto(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]
    if (!file || !id) return

    try {
      setIsUploading(true)

      const foto = await mediaService.upload(
        `/atletas/${id}/fotos`,
        file
      )

      setFotos((prev) => [...prev, foto])

      if (!fotoDestaqueId) {
        setFotoDestaqueId(foto.id)
      }
    } catch (err) {
      console.error("Erro no upload:", err)
      alert("Erro ao enviar imagem.")
    } finally {
      setIsUploading(false)
    }
  }

  /* ==========================
     REMOVER FOTO
     ========================== */
  function handleRemoverFoto(fotoId: string) {
    setFotos((prev) => prev.filter((f) => f.id !== fotoId))
    setFotosRemovidas((prev) => [...prev, fotoId])

    if (fotoDestaqueId === fotoId) {
      setFotoDestaqueId(undefined)
    }
  }

  /* ==========================
     SUBMIT
     ========================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    const dto: AtletaFormDTO = {
      nome,
      biografia,
      modalidades: modalidadesSelecionadas,
      fotos,
      fotoDestaqueId,
      fotosRemovidas,
    }

    try {
      if (isEditing && id) {
        await atletaService.atualizar(id, dto)
      } else {
        await atletaService.criar(dto)
      }

      navigate("/admin/atletas")
    } catch (err) {
      console.error("Erro ao salvar atleta:", err)
      alert("Erro ao salvar atleta.")
    } finally {
      setIsSaving(false)
    }
  }

  /* ==========================
     RENDER
     ========================== */
  return (
    <section>
      <h1>{isEditing ? "Editar Atleta" : "Nova Atleta"}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Biografia</label>
          <textarea
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            rows={5}
          />
        </div>

        <div>
          <label>Modalidades</label>
          <select
            multiple
            value={modalidadesSelecionadas}
            onChange={(e) =>
              setModalidadesSelecionadas(
                Array.from(e.target.selectedOptions).map(
                  (o) => o.value
                )
              )
            }
          >
            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        {isEditing && (
          <div>
            <label>Adicionar Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadFoto}
              disabled={isUploading}
            />
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {fotos.map((foto) => (
            <div key={foto.id}>
              <img
                src={foto.url}
                style={{ width: 120, height: 120, objectFit: "cover" }}
              />

              <div>
                <label>
                  <input
                    type="radio"
                    checked={fotoDestaqueId === foto.id}
                    onChange={() => setFotoDestaqueId(foto.id)}
                  />
                  Destaque
                </label>

                <button
                  type="button"
                  onClick={() => handleRemoverFoto(foto.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isSaving || isUploading}>
          {isSaving ? "Salvando..." : "Salvar"}
        </button>

        <button type="button" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </form>
    </section>
  )
}

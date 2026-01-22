import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"
import { Modalidade } from "@/types/modalidade"
import {
  AtletaUpdateDTO,
  CategoriaAtleta,
  StatusAtleta,
  TipoChavePix,
} from "@/types/atleta"

export default function AtletaForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [nome, setNome] = useState("")
  const [nomeSocial, setNomeSocial] = useState("")
  const [biografia, setBiografia] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("HISTORICA")
  const [statusAtleta, setStatusAtleta] = useState<StatusAtleta>("ATIVO")

  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")

  const [percentualRepasse, setPercentualRepasse] = useState<number>(0)
  const [comissaoPlataformaDiferenciada, setComissaoPlataformaDiferenciada] =
    useState<number>(0)

  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [tipoConta, setTipoConta] = useState("")
  const [tipoChavePix, setTipoChavePix] =
    useState<TipoChavePix>("CPF")
  const [chavePix, setChavePix] = useState("")

  const [contratoAssinado, setContratoAssinado] = useState(false)

  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<
    string[]
  >([])

  const [fotoDestaqueUrl, setFotoDestaqueUrl] = useState("")
  const [fotoDestaqueId, setFotoDestaqueId] = useState("")

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    modalidadeService.listarAdmin().then(setModalidades).catch(console.error)

    if (isEditing && id) {
      atletaService.buscarPorId(id).then((data) => {
        setNome(data.nome)
        setNomeSocial(data.nomeSocial || "")
        setBiografia(data.biografia)
        setCategoria(data.categoria)
        setStatusAtleta(data.statusAtleta)

        setPercentualRepasse((data.percentualRepasse ?? 0) * 100)
        setComissaoPlataformaDiferenciada(
          (data.comissaoPlataformaDiferenciada ?? 0) * 100
        )

        setBanco(data.banco || "")
        setAgencia(data.agencia || "")
        setConta(data.conta || "")
        setTipoConta(data.tipoConta || "")
        setTipoChavePix(data.tipoChavePix)
        setChavePix(data.chavePix || "")

        setContratoAssinado(data.contratoAssinado)

        setNomeRepresentante(data.nomeRepresentante || "")
        setCpfRepresentante(data.cpfRepresentante || "")
        setVinculoRepresentante(data.vinculoRepresentante || "")

        setModalidadesSelecionadas(data.modalidadesIds || [])
        setFotoDestaqueUrl(data.fotoDestaqueUrl || "")
      })
    }
  }, [id, isEditing])

  async function handleUploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const data = await mediaService.upload(file, "/acervo/upload")
      setFotoDestaqueId(data.id)
      setFotoDestaqueUrl(data.url)
    } finally {
      setIsUploading(false)
    }
  }

  const safeNumber = (value: number) =>
    Number.isFinite(value) ? value : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    const payload: AtletaUpdateDTO = {
      nome,
      nomeSocial: nomeSocial || undefined,
      biografia,
      categoria,
      statusAtleta,

      nomeRepresentante:
        categoria === "ESPOLIO" ? nomeRepresentante : undefined,
      cpfRepresentante:
        categoria === "ESPOLIO" ? cpfRepresentante : undefined,
      vinculoRepresentante:
        categoria === "ESPOLIO" ? vinculoRepresentante : undefined,

      contratoAssinado,

      percentualRepasse: safeNumber(percentualRepasse) / 100,
      comissaoPlataformaDiferenciada:
        safeNumber(comissaoPlataformaDiferenciada) / 100,

      banco,
      agencia,
      conta,
      tipoConta,

      tipoChavePix,
      chavePix: tipoChavePix === "NENHUM" ? "N/A" : chavePix,

      modalidadesIds:
        modalidadesSelecionadas.length > 0
          ? modalidadesSelecionadas
          : undefined,

      fotoDestaqueId: fotoDestaqueId || undefined,
    }

    try {
      if (isEditing && id) {
        await atletaService.atualizar(id, payload)
        alert("Atleta atualizada com sucesso!")
      } else {
        await atletaService.criar(payload)
        alert("Atleta criada com sucesso!")
      }
      navigate("/admin/atletas")
    } catch {
      alert("Erro ao salvar atleta")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <h1>{isEditing ? `Editar: ${nome}` : "Nova Atleta"}</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" required />
        <textarea value={biografia} onChange={e => setBiografia(e.target.value)} placeholder="Biografia" />

        <input
          type="number"
          value={percentualRepasse}
          onChange={e =>
            setPercentualRepasse(
              e.target.value === "" ? 0 : parseFloat(e.target.value)
            )
          }
          placeholder="Repasse (%)"
        />

        <input
          type="number"
          value={comissaoPlataformaDiferenciada}
          onChange={e =>
            setComissaoPlataformaDiferenciada(
              e.target.value === "" ? 0 : parseFloat(e.target.value)
            )
          }
          placeholder="Comissão (%)"
        />

        <input type="file" onChange={handleUploadFoto} disabled={isUploading} />

        <button type="submit" disabled={isSaving || isUploading}>
          {isSaving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </section>
  )
}

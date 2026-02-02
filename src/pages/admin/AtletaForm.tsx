import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"
import {
  CategoriaAtleta,
  StatusAtleta,
  StatusVerificacao,
  TipoChavePix,
} from "@/types/atleta"
import { UserPlus, Save, X, Upload } from "lucide-react"

export default function AtletaForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  /* =====================
     ESTADOS BASE
     ===================== */

  const [nome, setNome] = useState("")
  const [nomeSocial, setNomeSocial] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("")
  const [biografia, setBiografia] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("HISTORICA")

  /* =====================
     MODALIDADES
     ===================== */

  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<string[]>([])

  /* =====================
     CURADORIA
     ===================== */

  const [statusAtleta, setStatusAtleta] = useState<StatusAtleta>("ATIVO")
  const [statusVerificacao, setStatusVerificacao] =
    useState<StatusVerificacao>("PENDENTE")
  const [observacoesAdmin, setObservacoesAdmin] = useState("")

  /* =====================
     REPRESENTAÇÃO
     ===================== */

  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")

  /* =====================
     FINANCEIRO
     ===================== */

  const [tipoChavePix, setTipoChavePix] = useState<TipoChavePix>("CPF")
  const [chavePix, setChavePix] = useState("")
  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [tipoConta, setTipoConta] = useState("")
  const [comissaoPlataformaDiferenciada, setComissaoPlataformaDiferenciada] =
    useState(0)
  const [contratoAssinado, setContratoAssinado] = useState(false)
  const [linkContratoDigital, setLinkContratoDigital] = useState("")
  const [dadosContato, setDadosContato] = useState("")

  /* =====================
     MÍDIA (NOVO FLUXO)
     ===================== */

  const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null)
  const [fotoDestaqueFile, setFotoDestaqueFile] = useState<File | null>(null)

  const [fotoPerfilPreview, setFotoPerfilPreview] = useState<string | null>(null)
  const [fotoDestaquePreview, setFotoDestaquePreview] = useState<string | null>(null)

  /* =====================
     UI
     ===================== */

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  /* =====================
     INIT
     ===================== */

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)

        const mods = await modalidadeService.listarAdmin()
        setModalidades(mods)

        if (isEditing && id) {
          const data = await atletaService.buscarPorId(id)

          setNome(data.nome || "")
          setNomeSocial(data.nomeSocial || "")
          setEmail(data.email || "")
          setCpf(data.cpf || "")
          setBiografia(data.biografia || "")
          setCategoria(data.categoria || "HISTORICA")
          setModalidadesSelecionadas(data.modalidadesIds || [])
          setStatusAtleta(data.statusAtleta || "ATIVO")
          setStatusVerificacao(data.statusVerificacao || "PENDENTE")
          setObservacoesAdmin(data.observacoesAdmin || "")
          setNomeRepresentante(data.nomeRepresentante || "")
          setCpfRepresentante(data.cpfRepresentante || "")
          setVinculoRepresentante(data.vinculoRepresentante || "")
          setTipoChavePix(data.tipoChavePix || "CPF")
          setChavePix(data.chavePix || "")
          setBanco(data.banco || "")
          setAgencia(data.agencia || "")
          setConta(data.conta || "")
          setTipoConta(data.tipoConta || "")
          setComissaoPlataformaDiferenciada(
            (data.comissaoPlataformaDiferenciada ?? 0) * 100
          )
          setContratoAssinado(data.contratoAssinado || false)
          setLinkContratoDigital(data.linkContratoDigital || "")
          setDadosContato(data.dadosContato || "")
        }
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [id, isEditing])

  /* =====================
     SUBMIT
     ===================== */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      nome,
      nomeSocial,
      cpf,
      email,
      senha: senha || "atleta123",
      modalidades: modalidadesSelecionadas,
      biografia,
      categoria,
      nomeRepresentante: categoria === "ESPOLIO" ? nomeRepresentante : "",
      cpfRepresentante: categoria === "ESPOLIO" ? cpfRepresentante : "",
      vinculoRepresentante: categoria === "ESPOLIO" ? vinculoRepresentante : "",
      contratoAssinado,
      linkContratoDigital,
      dadosContato,
      tipoChavePix,
      chavePix,
      banco,
      agencia,
      conta,
      tipoConta,
      comissaoPlataformaDiferenciada:
        Number(comissaoPlataformaDiferenciada) / 100,
      statusAtleta,
    }

    try {
      let atletaId = id

      if (isEditing && id) {
        await atletaService.atualizar(id, payload as any)
      } else {
        const nova = await atletaService.criar(payload as any)
        atletaId = nova.id
      }

      /**
       * UPLOADS — APÓS SALVAR
       */
      if (atletaId) {
        if (fotoPerfilFile) {
          await atletaService.uploadFotoPerfil(atletaId, fotoPerfilFile)
        }

        if (fotoDestaqueFile) {
          await atletaService.uploadFotoDestaque(atletaId, fotoDestaqueFile)
        }
      }

      navigate("/admin/atletas")
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar atleta.")
    } finally {
      setSaving(false)
    }
  }

  /* =====================
     UI
     ===================== */

  if (loading) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-black uppercase flex items-center gap-3">
        <UserPlus />
        {isEditing ? `Editar: ${nome}` : "Nova Inserção Curatorial"}
      </h1>

      {/* BIOGRAFIA */}
      <section className="bg-white border-4 border-black rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-black uppercase">Biografia</h2>
        <textarea
          value={biografia}
          onChange={(e) => setBiografia(e.target.value)}
          rows={6}
          className="w-full border-4 border-black p-3"
        />
      </section>

      {/* MÍDIA */}
      <section className="bg-white border-4 border-black rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-black uppercase">Imagens</h2>

        <label className="flex items-center gap-3 font-black cursor-pointer">
          <Upload /> Foto de Perfil
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setFotoPerfilFile(file)
              if (file) setFotoPerfilPreview(URL.createObjectURL(file))
            }}
          />
        </label>

        {fotoPerfilPreview && (
          <img src={fotoPerfilPreview} className="w-32 border-4 border-black" />
        )}

        <label className="flex items-center gap-3 font-black cursor-pointer">
          <Upload /> Foto de Destaque
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

        {fotoDestaquePreview && (
          <img src={fotoDestaquePreview} className="w-full max-w-md border-4 border-black" />
        )}
      </section>

      {/* BOTÕES */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-8 py-4 font-black uppercase flex items-center gap-2"
        >
          <Save /> Salvar
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/atletas")}
          className="border-4 border-black px-8 py-4 font-black uppercase flex items-center gap-2"
        >
          <X /> Cancelar
        </button>
      </div>
    </form>
  )
}

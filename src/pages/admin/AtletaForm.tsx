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
import RichTextEditor from "@/components/RichTextEditor"

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
     CURADORIA (ADMIN)
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
     MÍDIA
     ===================== */

  const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null)
  const [fotoDestaqueFile, setFotoDestaqueFile] = useState<File | null>(null)

  const [legendaFotoPerfil, setLegendaFotoPerfil] = useState("")
  const [legendaFotoDestaque, setLegendaFotoDestaque] = useState("")

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

      if (atletaId) {
        if (statusVerificacao) {
          await atletaService.verificarAtleta(
            atletaId,
            statusVerificacao,
            observacoesAdmin || undefined
          )
        }

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

  if (loading) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-medium flex items-center gap-3">
        <UserPlus />
        {isEditing ? `Editar: ${nome}` : "Nova Inserção Curatorial"}
      </h1>

      {/* DADOS PRINCIPAIS */}
      <section className="bg-white border border-acl-line rounded p-6 space-y-4">
        <h2 className="text-xl font-medium">Dados da Atleta</h2>

        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da atleta"
          className="w-full border border-acl-line p-3"
          required
        />

        <select
          value={categoria}
          aria-label="Categoria da atleta"
          onChange={(e) => setCategoria(e.target.value as CategoriaAtleta)}
          className="w-full border border-acl-line p-3"
        >
          <option value="ATIVA">ATIVA</option>
          <option value="HISTORICA">HISTÓRICA</option>
          <option value="ESPOLIO">ESPÓLIO</option>
        </select>

        <select
          value={statusVerificacao}
          aria-label="Situação da verificação"
          onChange={(e) => setStatusVerificacao(e.target.value as StatusVerificacao)}
          className="w-full border border-acl-line p-3"
        >
          <option value="PENDENTE">PENDENTE</option>
          <option value="VERIFICADO">VERIFICADO</option>
          <option value="REJEITADO">REJEITADO</option>
          <option value="MEMORIAL_PUBLICO">MEMORIAL PÚBLICO</option>
        </select>

        <select
          value={statusAtleta}
          aria-label="Status da atleta"
          onChange={(e) => setStatusAtleta(e.target.value as StatusAtleta)}
          className="w-full border border-acl-line p-3"
        >
          <option value="ATIVO">ATIVO</option>
          <option value="INATIVO">INATIVO</option>
          <option value="SUSPENSO">SUSPENSO</option>
        </select>
      </section>

      {/* MODALIDADES */}
      <section className="bg-white border border-acl-line rounded p-6 space-y-4">
        <h2 className="text-xl font-medium">Modalidades</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {modalidades.map((modalidade) => (
        <label
        key={modalidade.id}
        className="flex items-center gap-3 border border-acl-line p-3 cursor-pointer font-medium"
      >
        <input
          type="checkbox"
          checked={modalidadesSelecionadas.includes(modalidade.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setModalidadesSelecionadas((prev) => [
                ...prev,
                modalidade.id,
              ])
            } else {
              setModalidadesSelecionadas((prev) =>
                prev.filter((id) => id !== modalidade.id)
              )
            }
          }}
          className="w-5 h-5"
        />
        {modalidade.nome}
        </label>
    ))}
    </div>
    </section>


      {/* BIOGRAFIA */}
      <section className="card-editorial p-6 space-y-3">
        <h2 className="text-sm text-acl-ink-soft">Biografia</h2>
        <RichTextEditor
          value={biografia}
          onChange={setBiografia}
          placeholder="Conte a trajetória desta atleta no esporte brasileiro..."
          minHeight="220px"
        />
      </section>

      {/* IMAGENS */}
      <section className="card-editorial p-6 space-y-5">
        <h2 className="text-sm text-acl-ink-soft">Imagens</h2>

        {/* Foto de Perfil */}
        <div className="space-y-2.5">
          <label className="block text-xs text-acl-muted">Foto de perfil</label>

          {fotoPerfilPreview && (
            <img
              src={fotoPerfilPreview}
              className="w-28 border border-acl-line rounded-sm"
              alt="Pré-visualização foto de perfil"
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
                setFotoPerfilFile(file)
                if (file) setFotoPerfilPreview(URL.createObjectURL(file))
              }}
            />
          </label>

          <input
            type="text"
            value={legendaFotoPerfil}
            onChange={(e) => setLegendaFotoPerfil(e.target.value)}
            placeholder="Legenda da foto de perfil (opcional)"
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        {/* Foto de Destaque */}
        <div className="space-y-2.5 pt-4 border-t border-acl-line">
          <label className="block text-xs text-acl-muted">Foto de destaque</label>

          {fotoDestaquePreview && (
            <img
              src={fotoDestaquePreview}
              className="w-full max-w-md border border-acl-line rounded-sm"
              alt="Pré-visualização foto de destaque"
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

          <input
            type="text"
            value={legendaFotoDestaque}
            onChange={(e) => setLegendaFotoDestaque(e.target.value)}
            placeholder="Ex: Marta com a taça do Mundial sub-20, 2002"
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
          />
        </div>
      </section>

      {/* BOTÕES */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/atletas")}
          className="btn-secondary-light flex items-center gap-2"
        >
          <X size={16} /> Cancelar
        </button>
      </div>
    </form>
  )
}

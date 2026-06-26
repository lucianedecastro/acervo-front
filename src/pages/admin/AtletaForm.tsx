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
     CURADORIA (ADMIN)
     ===================== */

  const [statusAtleta, setStatusAtleta] = useState<StatusAtleta>("ATIVO")
  const [statusVerificacao, setStatusVerificacao] =
    useState<StatusVerificacao>("PENDENTE")
  const [observacoesAdmin, setObservacoesAdmin] = useState("")

  /* =====================
     REPRESENTAÇÃO
     (estado existe; sem campos no formulário ainda — ver observação)
     ===================== */

  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")

  /* =====================
     FINANCEIRO
     (estado existe; sem campos no formulário ainda — ver observação)
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-16">
      <h1 className="font-serif text-2xl text-acl-ink flex items-center gap-3">
        <UserPlus size={22} className="text-acl-gold-deep" />
        {isEditing ? `Editar: ${nome}` : "Nova inserção curatorial"}
      </h1>

      {/* DADOS PRINCIPAIS */}
      <section className="card-editorial p-6 space-y-4">
        <h2 className="text-sm text-acl-ink-soft">Dados da atleta</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da atleta"
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Nome social</label>
            <input
              value={nomeSocial}
              onChange={(e) => setNomeSocial(e.target.value)}
              placeholder="Opcional"
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
            />
          </div>

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">CPF</label>
            <input
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder={isEditing ? "Deixe em branco para manter a atual" : "Senha de acesso"}
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
            />
          </div>

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaAtleta)}
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
            >
              <option value="ATIVA">Ativa</option>
              <option value="HISTORICA">Histórica</option>
              <option value="ESPOLIO">Espólio</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Status de verificação</label>
            <select
              value={statusVerificacao}
              onChange={(e) => setStatusVerificacao(e.target.value as StatusVerificacao)}
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
            >
              <option value="PENDENTE">Pendente</option>
              <option value="VERIFICADO">Verificado</option>
              <option value="REJEITADO">Rejeitado</option>
              <option value="MEMORIAL_PUBLICO">Memorial público</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-acl-muted mb-1.5">Status</label>
            <select
              value={statusAtleta}
              onChange={(e) => setStatusAtleta(e.target.value as StatusAtleta)}
              className="w-full border border-acl-line rounded-sm p-2.5 text-sm bg-white focus:outline-none focus:border-acl-gold-deep"
            >
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="SUSPENSO">Suspenso</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-acl-muted mb-1.5">Observações administrativas</label>
          <textarea
            value={observacoesAdmin}
            onChange={(e) => setObservacoesAdmin(e.target.value)}
            rows={2}
            placeholder="Visível apenas internamente, registrada junto à verificação"
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep resize-none"
          />
        </div>
      </section>

      {/* MODALIDADES */}
      <section className="card-editorial p-6 space-y-4">
        <h2 className="text-sm text-acl-ink-soft">Modalidades</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {modalidades.map((modalidade) => (
            <label
              key={modalidade.id}
              className="flex items-center gap-3 border border-acl-line rounded-sm p-2.5 text-sm text-acl-ink-soft cursor-pointer hover:border-acl-gold-deep transition-colors"
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
                      prev.filter((mid) => mid !== modalidade.id)
                    )
                  }
                }}
                className="w-4 h-4 accent-acl-gold-deep"
              />
              {modalidade.nome}
            </label>
          ))}
        </div>
      </section>

      {/* BIOGRAFIA */}
      <section className="card-editorial p-6 space-y-3">
        <h2 className="text-sm text-acl-ink-soft">Biografia</h2>
        <textarea
          value={biografia}
          onChange={(e) => setBiografia(e.target.value)}
          rows={6}
          className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep"
        />
      </section>

      {/* IMAGENS */}
      <section className="card-editorial p-6 space-y-4">
        <h2 className="text-sm text-acl-ink-soft">Imagens</h2>

        <label className="flex items-center gap-2 text-sm text-acl-ink-soft cursor-pointer">
          <Upload size={15} /> Foto de perfil
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
          <img src={fotoPerfilPreview} className="w-28 border border-acl-line" />
        )}

        <label className="flex items-center gap-2 text-sm text-acl-ink-soft cursor-pointer">
          <Upload size={15} /> Foto de destaque
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
          <img
            src={fotoDestaquePreview}
            className="w-full max-w-md border border-acl-line"
          />
        )}
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
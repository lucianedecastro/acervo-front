import { useEffect, useState, createContext, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"
import { ModalidadePublicaDTO } from "@/types/modalidade"
import {
  CategoriaAtleta,
  TipoChavePix,
  StatusAtleta,
} from "@/types/atleta"
import {
  User,
  Mail,
  Lock,
  CreditCard,
  Trophy,
  Users,
  FileText,
  Building2,
  Upload,
  Save,
  ChevronDown,
  ChevronUp
} from "lucide-react"

/* =====================================================
   SEÇÃO RECOLHÍVEL
   Fica FORA do formulário: se fosse definida dentro, o React a recriaria
   a cada tecla digitada e o campo perderia o foco.
   ===================================================== */
const SecaoContext = createContext<{ secaoAberta: string; setSecaoAberta: (id: string) => void }>({
  secaoAberta: "",
  setSecaoAberta: () => {},
})

function SecaoCollapsible({
  id,
  titulo,
  icone,
  children,
}: {
  id: string
  titulo: string
  icone: React.ReactNode
  children: React.ReactNode
}) {
  const { secaoAberta, setSecaoAberta } = useContext(SecaoContext)
  const isAberta = secaoAberta === id

  return (
    <div className="bg-white border border-acl-line rounded overflow-hidden">
      <h2 className="text-lg sm:text-xl font-medium">
        <button
          type="button"
          id={`secao-${id}-botao`}
          aria-expanded={isAberta}
          aria-controls={`secao-${id}`}
          onClick={() => setSecaoAberta(isAberta ? "" : id)}
          className="w-full flex items-center justify-between p-4 sm:p-6 bg-acl-cream hover:bg-white transition-colors border-b border-acl-line text-left"
        >
          <span className="flex items-center gap-3">
            {icone}
            {titulo}
          </span>
          {isAberta
            ? <ChevronUp size={24} aria-hidden="true" />
            : <ChevronDown size={24} aria-hidden="true" />}
        </button>
      </h2>

      {isAberta && (
        <div id={`secao-${id}`} role="region" aria-labelledby={`secao-${id}-botao`} className="p-4 sm:p-6 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function AtletaCadastroForm() {
  const navigate = useNavigate()

  /* ======================= IDENTIFICAÇÃO ======================= */
  const [nome, setNome] = useState("")
  const [nomeSocial, setNomeSocial] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("")

  /* ======================= PERFIL ESPORTIVO ======================= */
  const [biografia, setBiografia] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("ATIVA")
  const [modalidades, setModalidades] = useState<ModalidadePublicaDTO[]>([])
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<string[]>([])

  /* ======================= REPRESENTAÇÃO (ESPÓLIO) ======================= */
  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")

  /* ======================= GOVERNANÇA / CONTATO ======================= */
  const [contratoAssinado, setContratoAssinado] = useState(false)
  const [linkContratoDigital, setLinkContratoDigital] = useState("")
  const [dadosContato, setDadosContato] = useState("")

  /* ======================= FINANCEIRO ======================= */
  const [tipoChavePix, setTipoChavePix] = useState<TipoChavePix>("CPF")
  const [chavePix, setChavePix] = useState("")
  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [tipoConta, setTipoConta] = useState("")
  const [comissaoPlataformaDiferenciada, setComissaoPlataformaDiferenciada] = useState<number>(0)

  /* ======================= MÍDIA ======================= */
  const [fotoDestaqueUrl, setFotoDestaqueUrl] = useState("")
  const [fotoDestaqueId, setFotoDestaqueId] = useState("")

  /* ======================= UI ======================= */
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [secaoAberta, setSecaoAberta] = useState<string>("identificacao")

  /* ======================= LOAD MODALIDADES ======================= */
  useEffect(() => {
    modalidadeService.listarPublico()
      .then(setModalidades)
      .finally(() => setLoading(false))
  }, [])

  async function handleUploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const data = await mediaService.upload(file, "/acervo/upload")
      setFotoDestaqueId(data.id)
      setFotoDestaqueUrl(data.url)
    } finally {
      setUploading(false)
    }
  }

  function toggleModalidade(id: string) {
    setModalidadesSelecionadas(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      nome,
      nomeSocial: nomeSocial || undefined,
      cpf,
      email,
      senha,
      modalidades: modalidadesSelecionadas,
      biografia,
      categoria,
      nomeRepresentante: categoria === "ESPOLIO" ? nomeRepresentante : undefined,
      cpfRepresentante: categoria === "ESPOLIO" ? cpfRepresentante : undefined,
      vinculoRepresentante: categoria === "ESPOLIO" ? vinculoRepresentante : undefined,
      contratoAssinado,
      linkContratoDigital: linkContratoDigital || undefined,
      dadosContato: dadosContato || undefined,
      tipoChavePix,
      chavePix: tipoChavePix === "NENHUM" ? "N/A" : chavePix,
      banco,
      agencia,
      conta,
      tipoConta,
      comissaoPlataformaDiferenciada: comissaoPlataformaDiferenciada > 0 ? comissaoPlataformaDiferenciada : undefined,
      fotoDestaqueId: fotoDestaqueId || undefined,
      statusAtleta: "ATIVO" as StatusAtleta,
    }

    try {
      await atletaService.completarCadastro(payload)
      alert("Cadastro enviado para verificação.")
      navigate("/admin/atletas")
    } catch {
      alert("Erro ao enviar cadastro.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-acl-gold border border-acl-line rounded mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-medium">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-2 text-acl-ink">
          Cadastro de Atleta
        </h1>
        <p className="text-acl-ink-soft font-medium text-sm sm:text-base mb-3">
          Preencha os dados para criar um novo perfil no acervo
        </p>
        <div className="w-24 sm:w-32 h-2 bg-acl-gold border border-acl-line rounded-full"></div>
      </div>

      <SecaoContext.Provider value={{ secaoAberta, setSecaoAberta }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SEÇÃO 1: IDENTIFICAÇÃO */}
        <SecaoCollapsible id="identificacao" titulo="Identificação" icone={<User size={24} strokeWidth={3} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="campo-1" className="block text-xs font-medium mb-2 text-acl-ink-soft">Nome Completo *</label>
              <input id="campo-1"
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome completo da atleta"
                required
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="campo-2" className="block text-xs font-medium mb-2 text-acl-ink-soft">Nome Social</label>
              <input id="campo-2"
                type="text"
                value={nomeSocial}
                onChange={e => setNomeSocial(e.target.value)}
                placeholder="Nome social (opcional)"
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="campo-3" className="block text-xs font-medium mb-2 text-acl-ink-soft">Email *</label>
              <input id="campo-3"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="campo-4" className="block text-xs font-medium mb-2 text-acl-ink-soft">CPF *</label>
              <input id="campo-4"
                type="text"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                required
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="campo-5" className="block text-xs font-medium mb-2 text-acl-ink-soft">Senha *</label>
              <input id="campo-5"
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Senha de acesso"
                required
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>
          </div>
        </SecaoCollapsible>

        {/* SEÇÃO 2: PERFIL ESPORTIVO */}
        <SecaoCollapsible id="perfil" titulo="Perfil Esportivo" icone={<Trophy size={24} strokeWidth={3} />}>
          <div className="space-y-4">
            <div>
              <label htmlFor="campo-6" className="block text-xs font-medium mb-2 text-acl-ink-soft">Categoria *</label>
              <select id="campo-6"
                value={categoria}
                onChange={e => setCategoria(e.target.value as CategoriaAtleta)}
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              >
                <option value="ATIVA">ATIVA</option>
                <option value="HISTORICA">HISTÓRICA</option>
                <option value="ESPOLIO">ESPÓLIO</option>
              </select>
            </div>

            <div>
              <label htmlFor="campo-7" className="block text-xs font-medium mb-2 text-acl-ink-soft">Biografia</label>
              <textarea id="campo-7"
                value={biografia}
                onChange={e => setBiografia(e.target.value)}
                placeholder="Conte a história da atleta..."
                rows={6}
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 text-acl-ink-soft">Modalidades</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {modalidades.map(mod => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => toggleModalidade(mod.id)}
                    className={`px-3 py-2 border border-acl-line rounded-sm font-medium text-xs transition-all ${modalidadesSelecionadas.includes(mod.id)
 ? "bg-acl-gold text-acl-ink "
 : "bg-white text-acl-ink-soft "
 }`}
                  >
                    {mod.nome}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SecaoCollapsible>

        {/* SEÇÃO 3: REPRESENTAÇÃO (apenas se ESPÓLIO) */}
        {categoria === "ESPOLIO" && (
          <SecaoCollapsible id="representacao" titulo="Representação Legal" icone={<Users size={24} strokeWidth={3} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="campo-9" className="block text-xs font-medium mb-2 text-acl-ink-soft">Nome do Representante</label>
                <input id="campo-9"
                  type="text"
                  value={nomeRepresentante}
                  onChange={e => setNomeRepresentante(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="campo-10" className="block text-xs font-medium mb-2 text-acl-ink-soft">CPF do Representante</label>
                <input id="campo-10"
                  type="text"
                  value={cpfRepresentante}
                  onChange={e => setCpfRepresentante(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="campo-11" className="block text-xs font-medium mb-2 text-acl-ink-soft">Vínculo</label>
                <input id="campo-11"
                  type="text"
                  value={vinculoRepresentante}
                  onChange={e => setVinculoRepresentante(e.target.value)}
                  placeholder="Ex: Filho, Cônjuge, Advogado"
                  className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
                />
              </div>
            </div>
          </SecaoCollapsible>
        )}

        {/* SEÇÃO 4: DADOS FINANCEIROS */}
        <SecaoCollapsible id="financeiro" titulo="Dados Financeiros" icone={<CreditCard size={24} strokeWidth={3} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="campo-12" className="block text-xs font-medium mb-2 text-acl-ink-soft">Tipo Chave PIX</label>
              <select id="campo-12"
                value={tipoChavePix}
                onChange={e => setTipoChavePix(e.target.value as TipoChavePix)}
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              >
                <option value="CPF">CPF</option>
                <option value="EMAIL">EMAIL</option>
                <option value="TELEFONE">TELEFONE</option>
                <option value="CHAVE_ALEATORIA">CHAVE ALEATÓRIA</option>
                <option value="NENHUM">NENHUM</option>
              </select>
            </div>

            <div>
              <label htmlFor="campo-13" className="block text-xs font-medium mb-2 text-acl-ink-soft">Chave PIX</label>
              <input id="campo-13"
                type="text"
                value={chavePix}
                onChange={e => setChavePix(e.target.value)}
                placeholder="Digite a chave PIX"
                disabled={tipoChavePix === "NENHUM"}
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none disabled:bg-acl-cream"
              />
            </div>

            <div>
              <label htmlFor="campo-14" className="block text-xs font-medium mb-2 text-acl-ink-soft">Banco</label>
              <input id="campo-14"
                type="text"
                value={banco}
                onChange={e => setBanco(e.target.value)}
                placeholder="Nome do banco"
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="campo-15" className="block text-xs font-medium mb-2 text-acl-ink-soft">Agência</label>
              <input id="campo-15"
                type="text"
                value={agencia}
                onChange={e => setAgencia(e.target.value)}
                placeholder="0000"
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="campo-16" className="block text-xs font-medium mb-2 text-acl-ink-soft">Conta</label>
              <input id="campo-16"
                type="text"
                value={conta}
                onChange={e => setConta(e.target.value)}
                placeholder="00000-0"
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="campo-17" className="block text-xs font-medium mb-2 text-acl-ink-soft">Tipo de Conta</label>
              <select id="campo-17"
                value={tipoConta}
                onChange={e => setTipoConta(e.target.value)}
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              >
                <option value="">Selecione</option>
                <option value="CORRENTE">Corrente</option>
                <option value="POUPANCA">Poupança</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="campo-18" className="block text-xs font-medium mb-2 text-acl-ink-soft">Comissão Diferenciada (%)</label>
              <input id="campo-18"
                type="number"
                value={comissaoPlataformaDiferenciada}
                onChange={e => setComissaoPlataformaDiferenciada(Number(e.target.value))}
                placeholder="0"
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>
          </div>
        </SecaoCollapsible>

        {/* SEÇÃO 5: GOVERNANÇA */}
        <SecaoCollapsible id="governanca" titulo="Governança e Contrato" icone={<FileText size={24} strokeWidth={3} />}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-acl-cream border-2 border-acl-line rounded-sm">
              <input
                type="checkbox"
                id="contrato"
                checked={contratoAssinado}
                onChange={e => setContratoAssinado(e.target.checked)}
                className="w-6 h-6 border border-acl-line rounded accent-acl-gold-deep"
              />
              <label htmlFor="contrato" className="text-sm font-medium cursor-pointer">
                Contrato assinado e verificado
              </label>
            </div>

            <div>
              <label htmlFor="campo-20" className="block text-xs font-medium mb-2 text-acl-ink-soft">Link do Contrato Digital</label>
              <input id="campo-20"
                type="url"
                value={linkContratoDigital}
                onChange={e => setLinkContratoDigital(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="campo-21" className="block text-xs font-medium mb-2 text-acl-ink-soft">Dados de Contato</label>
              <textarea id="campo-21"
                value={dadosContato}
                onChange={e => setDadosContato(e.target.value)}
                placeholder="Telefone, endereço, etc."
                rows={3}
                className="w-full px-4 py-3 border border-acl-line rounded-sm font-medium text-sm focus:outline-none resize-none"
              />
            </div>
          </div>
        </SecaoCollapsible>

        {/* SEÇÃO 6: FOTO */}
        <SecaoCollapsible id="foto" titulo="Foto de Destaque" icone={<Upload size={24} strokeWidth={3} />}>
          <div className="space-y-4">
            {fotoDestaqueUrl && (
              <div className="flex justify-center">
                <img
                  src={fotoDestaqueUrl}
                  alt="Preview"
                  className="max-w-xs w-full h-64 object-cover border border-acl-line rounded"
                />
              </div>
            )}

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-acl-line rounded cursor-pointer bg-acl-cream hover:bg-acl-cream transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload size={40} strokeWidth={2} className="text-acl-muted mb-3" />
                  <p className="mb-2 text-sm font-medium text-acl-muted">
                    {uploading ? "Enviando..." : "Clique para fazer upload"}
                  </p>
                  <p className="text-xs text-acl-muted font-medium">PNG, JPG ou WEBP</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadFoto}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </SecaoCollapsible>

        {/* BOTÃO SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-4 bg-acl-ink text-acl-cream font-medium text-sm border border-acl-line rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={18} strokeWidth={3} />
            {saving ? "Salvando..." : "Finalizar Cadastro"}
          </button>
        </div>
      </form>
      </SecaoContext.Provider>
    </div>
  )
}

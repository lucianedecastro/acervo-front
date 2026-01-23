import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"
import { Modalidade } from "@/types/modalidade"
import { CategoriaAtleta, StatusAtleta, StatusVerificacao, TipoChavePix } from "@/types/atleta"
import { UserPlus, Save, X, Upload } from "lucide-react"

export default function AtletaForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  // Estados Base
  const [nome, setNome] = useState("")
  const [nomeSocial, setNomeSocial] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("")
  const [biografia, setBiografia] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("HISTORICA")

  // Modalidades
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<string[]>([])

  // Curadoria
  const [statusAtleta, setStatusAtleta] = useState<StatusAtleta>("ATIVO")
  const [statusVerificacao, setStatusVerificacao] = useState<StatusVerificacao>("PENDENTE")
  const [observacoesAdmin, setObservacoesAdmin] = useState("")

  // Representação
  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")

  // Financeiro
  const [tipoChavePix, setTipoChavePix] = useState<TipoChavePix>("CPF")
  const [chavePix, setChavePix] = useState("")
  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [tipoConta, setTipoConta] = useState("")
  const [comissaoPlataformaDiferenciada, setComissaoPlataformaDiferenciada] = useState(0)
  const [contratoAssinado, setContratoAssinado] = useState(false)
  const [linkContratoDigital, setLinkContratoDigital] = useState("")
  const [dadosContato, setDadosContato] = useState("")

  // Mídia
  const [fotoDestaqueUrl, setFotoDestaqueUrl] = useState("")
  const [fotoDestaqueId, setFotoDestaqueId] = useState("")

  // UI
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

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
          setComissaoPlataformaDiferenciada((data.comissaoPlataformaDiferenciada ?? 0) * 100)
          setContratoAssinado(data.contratoAssinado || false)
          setLinkContratoDigital(data.linkContratoDigital || "")
          setDadosContato(data.dadosContato || "")
          setFotoDestaqueUrl(data.fotoDestaqueUrl || "")
          setFotoDestaqueId(data.fotoDestaqueId || "")
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id, isEditing])

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      nome,
      nomeSocial: nomeSocial || "",
      cpf: cpf.replace(/D/g, ""),
      email,
      senha: senha || "atleta123",
      modalidades: modalidadesSelecionadas,
      biografia,
      categoria,
      nomeRepresentante: categoria === "ESPOLIO" ? nomeRepresentante : "",
      cpfRepresentante: categoria === "ESPOLIO" ? cpfRepresentante.replace(/D/g, "") : "",
      vinculoRepresentante: categoria === "ESPOLIO" ? vinculoRepresentante : "",
      contratoAssinado,
      linkContratoDigital: linkContratoDigital || "",
      dadosContato: dadosContato || "",
      tipoChavePix,
      chavePix: chavePix || "",
      banco: banco || "",
      agencia: agencia || "",
      conta: conta || "",
      tipoConta: tipoConta || "",
      comissaoPlataformaDiferenciada: Number(comissaoPlataformaDiferenciada) / 100,
      fotoDestaqueId: fotoDestaqueId || "",
      statusAtleta: statusAtleta || "ATIVO",
    }

    try {
      if (isEditing && id) await atletaService.atualizar(id, payload as any)
      else await atletaService.criar(payload as any)
      navigate("/admin/atletas")
    } catch {
      alert("Erro ao salvar. Verifique o console do navegador.")
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Carregando formulário...</p>
        </div>
      </div>
    )

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <UserPlus size={36} strokeWidth={3} className="sm:w-12 sm:h-12 flex-shrink-0" />
          <span className="leading-tight break-words">
            {isEditing ? `Editar: ${nome}` : "Nova Inserção Curatorial"}
          </span>
        </h1>
        <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-3"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* IDENTIFICAÇÃO */}
        <section className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-4 border-gray-200">
            Identificação e Acesso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                Nome Completo
              </label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                required
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                Nome Social
              </label>
              <input
                value={nomeSocial}
                onChange={(e) => setNomeSocial(e.target.value)}
                placeholder="Nome social (opcional)"
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                E-mail
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
                disabled={isEditing}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244] disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                CPF
              </label>
              <input
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF (apenas números)"
                required
                disabled={isEditing}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244] disabled:bg-gray-100"
              />
            </div>
            {!isEditing && (
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Defina uma senha"
                  required
                  className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
                />
              </div>
            )}
          </div>
        </section>

        {/* PERFIL ESPORTIVO */}
        <section className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-4 border-gray-200">
            Perfil Esportivo
          </h2>

          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaAtleta)}
              className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
            >
              <option value="ATIVA">ATIVA</option>
              <option value="HISTORICA">HISTÓRICA</option>
              <option value="ESPOLIO">ESPÓLIO</option>
            </select>
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
              Biografia
            </label>
            <textarea
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              placeholder="Biografia completa da atleta"
              rows={4}
              className="w-full px-4 py-3 border-4 border-black rounded-lg font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
              Modalidades
            </label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {modalidades.map((m) => (
                <label
                  key={m.id}
                  className={`px-3 sm:px-4 py-2 border-4 rounded-lg font-bold text-xs sm:text-sm cursor-pointer transition-all ${modalidadesSelecionadas.includes(m.id)
                    ? "bg-[#D4A244] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white border-gray-300 hover:border-black"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={modalidadesSelecionadas.includes(m.id)}
                    onChange={(e) => {
                      if (e.target.checked) setModalidadesSelecionadas([...modalidadesSelecionadas, m.id])
                      else setModalidadesSelecionadas(modalidadesSelecionadas.filter((mid) => mid !== m.id))
                    }}
                    className="sr-only"
                  />
                  {m.nome}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* ESPÓLIO */}
        {categoria === "ESPOLIO" && (
          <section className="bg-orange-50 border-4 sm:border-6 border-orange-500 rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] sm:shadow-[8px_8px_0px_0px_rgba(249,115,22,1)]">
            <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-4 border-orange-200">
              Representante Legal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                  Nome do Responsável
                </label>
                <input
                  value={nomeRepresentante}
                  onChange={(e) => setNomeRepresentante(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 border-4 border-orange-600 rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                  CPF do Responsável
                </label>
                <input
                  value={cpfRepresentante}
                  onChange={(e) => setCpfRepresentante(e.target.value)}
                  placeholder="Apenas números"
                  className="w-full px-4 py-3 border-4 border-orange-600 rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                  Vínculo
                </label>
                <input
                  value={vinculoRepresentante}
                  onChange={(e) => setVinculoRepresentante(e.target.value)}
                  placeholder="Ex: Inventariante"
                  className="w-full px-4 py-3 border-4 border-orange-600 rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-orange-400"
                />
              </div>
            </div>
          </section>
        )}

        {/* CURADORIA */}
        <section className="bg-blue-50 border-4 sm:border-6 border-blue-500 rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] sm:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-4 border-blue-200">
            Painel de Curadoria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                Status de Verificação
              </label>
              <select
                value={statusVerificacao}
                onChange={(e) => setStatusVerificacao(e.target.value as StatusVerificacao)}
                className="w-full px-4 py-3 border-4 border-blue-600 rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-400"
              >
                <option value="PENDENTE">PENDENTE</option>
                <option value="VERIFICADO">VERIFICADO</option>
                <option value="REJEITADO">REJEITADO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                Status da Atleta
              </label>
              <select
                value={statusAtleta}
                onChange={(e) => setStatusAtleta(e.target.value as StatusAtleta)}
                className="w-full px-4 py-3 border-4 border-blue-600 rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-400"
              >
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
                <option value="SUSPENSO">SUSPENSO</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
              Observações Internas
            </label>
            <textarea
              value={observacoesAdmin}
              onChange={(e) => setObservacoesAdmin(e.target.value)}
              placeholder="Notas administrativas..."
              rows={4}
              className="w-full px-4 py-3 border-4 border-blue-600 rounded-lg font-medium text-sm focus:outline-none focus:ring-4 focus:ring-blue-400 resize-none"
            />
          </div>
        </section>

        {/* FINANCEIRO */}
        <section className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-4 border-gray-200">
            Configuração Financeira
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                Comissão (%)
              </label>
              <input
                type="number"
                value={comissaoPlataformaDiferenciada}
                onChange={(e) => setComissaoPlataformaDiferenciada(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                Tipo Chave PIX
              </label>
              <select
                value={tipoChavePix}
                onChange={(e) => setTipoChavePix(e.target.value as TipoChavePix)}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              >
                <option value="CPF">CPF</option>
                <option value="EMAIL">E-MAIL</option>
                <option value="TELEFONE">TELEFONE</option>
                <option value="ALEATORIA">CHAVE ALEATÓRIA</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase mb-2 sm:mb-3 text-gray-700">
                Chave PIX
              </label>
              <input
                value={chavePix}
                onChange={(e) => setChavePix(e.target.value)}
                placeholder="Chave PIX"
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>
          </div>
        </section>

        {/* MÍDIA */}
        <section className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-4 border-gray-200">
            Foto de Destaque
          </h2>
          {fotoDestaqueUrl && (
            <img
              src={fotoDestaqueUrl}
              alt="Preview"
              className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-lg border-4 border-black mb-4 sm:mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            />
          )}
          <label className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-[#D4A244] text-black font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
            <Upload size={18} strokeWidth={3} className="sm:w-5 sm:h-5" />
            {uploading ? "Enviando..." : "Escolher Imagem"}
            <input type="file" onChange={handleUploadFoto} disabled={uploading} className="sr-only" />
          </label>
        </section>

        {/* BOTÕES */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50"
          >
            <Save size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
            {saving ? "Gravando..." : "Salvar Alterações"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/atletas")}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 sm:gap-3"
          >
            <X size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
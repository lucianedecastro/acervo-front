import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"
import { Modalidade } from "@/types/modalidade"
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
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
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
    modalidadeService.listarAdmin()
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
          <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
          <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  const SecaoCollapsible = ({
    id,
    titulo,
    icone,
    children
  }: {
    id: string;
    titulo: string;
    icone: React.ReactNode;
    children: React.ReactNode
  }) => {
    const isAberta = secaoAberta === id
    return (
      <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <button
          type="button"
          onClick={() => setSecaoAberta(isAberta ? "" : id)}
          className="w-full flex items-center justify-between p-4 sm:p-6 bg-gray-50 hover:bg-gray-100 transition-colors border-b-4 border-black"
        >
          <div className="flex items-center gap-3">
            {icone}
            <h3 className="text-lg sm:text-xl font-black uppercase">{titulo}</h3>
          </div>
          {isAberta ? <ChevronUp size={24} strokeWidth={3} /> : <ChevronDown size={24} strokeWidth={3} />}
        </button>

        {isAberta && (
          <div className="p-4 sm:p-6 space-y-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black">
          Cadastro de Atleta
        </h1>
        <p className="text-gray-600 font-bold text-sm sm:text-base mb-3">
          Preencha os dados para criar um novo perfil no acervo
        </p>
        <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SEÇÃO 1: IDENTIFICAÇÃO */}
        <SecaoCollapsible id="identificacao" titulo="Identificação" icone={<User size={24} strokeWidth={3} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Nome Completo *</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome completo da atleta"
                required
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Nome Social</label>
              <input
                type="text"
                value={nomeSocial}
                onChange={e => setNomeSocial(e.target.value)}
                placeholder="Nome social (opcional)"
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">CPF *</label>
              <input
                type="text"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                required
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Senha *</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Senha de acesso"
                required
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>
          </div>
        </SecaoCollapsible>

        {/* SEÇÃO 2: PERFIL ESPORTIVO */}
        <SecaoCollapsible id="perfil" titulo="Perfil Esportivo" icone={<Trophy size={24} strokeWidth={3} />}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Categoria *</label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value as CategoriaAtleta)}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              >
                <option value="ATIVA">ATIVA</option>
                <option value="HISTORICA">HISTÓRICA</option>
                <option value="ESPOLIO">ESPÓLIO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Biografia</label>
              <textarea
                value={biografia}
                onChange={e => setBiografia(e.target.value)}
                placeholder="Conte a história da atleta..."
                rows={6}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Modalidades</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {modalidades.map(mod => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => toggleModalidade(mod.id)}
                    className={`px-3 py-2 border-4 border-black rounded-lg font-black text-xs uppercase transition-all ${modalidadesSelecionadas.includes(mod.id)
                        ? "bg-[#D4A244] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-white text-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5"
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
                <label className="block text-xs font-black uppercase mb-2 text-gray-700">Nome do Representante</label>
                <input
                  type="text"
                  value={nomeRepresentante}
                  onChange={e => setNomeRepresentante(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-2 text-gray-700">CPF do Representante</label>
                <input
                  type="text"
                  value={cpfRepresentante}
                  onChange={e => setCpfRepresentante(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase mb-2 text-gray-700">Vínculo</label>
                <input
                  type="text"
                  value={vinculoRepresentante}
                  onChange={e => setVinculoRepresentante(e.target.value)}
                  placeholder="Ex: Filho, Cônjuge, Advogado"
                  className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
                />
              </div>
            </div>
          </SecaoCollapsible>
        )}

        {/* SEÇÃO 4: DADOS FINANCEIROS */}
        <SecaoCollapsible id="financeiro" titulo="Dados Financeiros" icone={<CreditCard size={24} strokeWidth={3} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Tipo Chave PIX</label>
              <select
                value={tipoChavePix}
                onChange={e => setTipoChavePix(e.target.value as TipoChavePix)}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              >
                <option value="CPF">CPF</option>
                <option value="EMAIL">EMAIL</option>
                <option value="TELEFONE">TELEFONE</option>
                <option value="CHAVE_ALEATORIA">CHAVE ALEATÓRIA</option>
                <option value="NENHUM">NENHUM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Chave PIX</label>
              <input
                type="text"
                value={chavePix}
                onChange={e => setChavePix(e.target.value)}
                placeholder="Digite a chave PIX"
                disabled={tipoChavePix === "NENHUM"}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244] disabled:bg-gray-200"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Banco</label>
              <input
                type="text"
                value={banco}
                onChange={e => setBanco(e.target.value)}
                placeholder="Nome do banco"
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Agência</label>
              <input
                type="text"
                value={agencia}
                onChange={e => setAgencia(e.target.value)}
                placeholder="0000"
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Conta</label>
              <input
                type="text"
                value={conta}
                onChange={e => setConta(e.target.value)}
                placeholder="00000-0"
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Tipo de Conta</label>
              <select
                value={tipoConta}
                onChange={e => setTipoConta(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              >
                <option value="">Selecione</option>
                <option value="CORRENTE">Corrente</option>
                <option value="POUPANCA">Poupança</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Comissão Diferenciada (%)</label>
              <input
                type="number"
                value={comissaoPlataformaDiferenciada}
                onChange={e => setComissaoPlataformaDiferenciada(Number(e.target.value))}
                placeholder="0"
                min="0"
                max="100"
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>
          </div>
        </SecaoCollapsible>

        {/* SEÇÃO 5: GOVERNANÇA */}
        <SecaoCollapsible id="governanca" titulo="Governança e Contrato" icone={<FileText size={24} strokeWidth={3} />}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="contrato"
                checked={contratoAssinado}
                onChange={e => setContratoAssinado(e.target.checked)}
                className="w-6 h-6 border-4 border-black rounded accent-[#D4A244]"
              />
              <label htmlFor="contrato" className="text-sm font-bold cursor-pointer">
                Contrato assinado e verificado
              </label>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Link do Contrato Digital</label>
              <input
                type="url"
                value={linkContratoDigital}
                onChange={e => setLinkContratoDigital(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-2 text-gray-700">Dados de Contato</label>
              <textarea
                value={dadosContato}
                onChange={e => setDadosContato(e.target.value)}
                placeholder="Telefone, endereço, etc."
                rows={3}
                className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244] resize-none"
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
                  className="max-w-xs w-full h-64 object-cover border-6 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            )}

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-black rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload size={40} strokeWidth={2} className="text-gray-400 mb-3" />
                  <p className="mb-2 text-sm font-black uppercase text-gray-500">
                    {uploading ? "Enviando..." : "Clique para fazer upload"}
                  </p>
                  <p className="text-xs text-gray-400 font-bold">PNG, JPG ou WEBP</p>
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
            className="px-8 py-4 bg-black text-white font-black uppercase text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={18} strokeWidth={3} />
            {saving ? "Salvando..." : "Finalizar Cadastro"}
          </button>
        </div>
      </form>
    </div>
  )
}

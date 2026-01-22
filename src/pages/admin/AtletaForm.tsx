import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"
import { Modalidade } from "@/types/modalidade"
import {
  CategoriaAtleta,
  StatusAtleta,
  StatusVerificacao,
  TipoChavePix,
} from "@/types/atleta"

/* =====================================================
   FORMULÁRIO ADMIN — ATLETA
   Sincronizado com AtletaFormDTO.java e AtletaController.java
   ===================================================== */

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

  // Representação (Espólio)
  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")

  // Financeiro e Governança
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
      } catch (e) { console.error(e) } finally { setLoading(false) }
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
    } finally { setUploading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      nome,
      nomeSocial: nomeSocial || "",
      cpf: cpf.replace(/\D/g, ""),
      email,
      senha: senha || "atleta123",
      modalidades: modalidadesSelecionadas,
      biografia,
      categoria,
      nomeRepresentante: categoria === "ESPOLIO" ? nomeRepresentante : "",
      cpfRepresentante: categoria === "ESPOLIO" ? cpfRepresentante.replace(/\D/g, "") : "",
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
      statusAtleta: statusAtleta || "ATIVO"
    }

    try {
      if (isEditing && id) await atletaService.atualizar(id, payload as any)
      else await atletaService.criar(payload as any)
      navigate("/admin/atletas")
    } catch { alert("Erro ao salvar. Verifique o console do navegador.") }
    finally { setSaving(false) }
  }

  if (loading) return <div style={{ padding: "2rem" }}>Carregando formulário...</div>

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "1px solid #eee", marginBottom: "2rem", paddingBottom: "1rem" }}>
        <h1>{isEditing ? `Editar: ${nome}` : "Nova Inserção Curatorial"}</h1>
      </header>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* IDENTIFICAÇÃO */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Identificação e Acesso</legend>
          <div style={gridStyle}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" required style={inputStyle} />
            <input value={nomeSocial} onChange={e => setNomeSocial(e.target.value)} placeholder="Nome social" style={inputStyle} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" required disabled={isEditing} style={inputStyle} />
            <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="CPF (apenas números)" required disabled={isEditing} style={inputStyle} />
            {!isEditing && <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Defina uma senha" required style={inputStyle} />}
          </div>
        </fieldset>

        {/* PERFIL E CATEGORIA */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Perfil Esportivo</legend>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <select value={categoria} onChange={e => setCategoria(e.target.value as CategoriaAtleta)} style={inputStyle}>
              <option value="ATIVA">ATIVA</option>
              <option value="HISTORICA">HISTÓRICA</option>
              <option value="ESPOLIO">ESPÓLIO</option>
            </select>
          </div>
          <textarea value={biografia} onChange={e => setBiografia(e.target.value)} placeholder="Biografia completa da atleta" style={{ ...inputStyle, width: "100%", minHeight: "120px" }} />
          
          <div style={{ marginTop: "1rem" }}>
            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Selecione as modalidades:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {modalidades.map(m => (
                <label key={m.id} style={badgeStyle}>
                  <input
                    type="checkbox"
                    checked={modalidadesSelecionadas.includes(m.id)}
                    onChange={e => {
                      if (e.target.checked) setModalidadesSelecionadas([...modalidadesSelecionadas, m.id])
                      else setModalidadesSelecionadas(modalidadesSelecionadas.filter(mid => mid !== m.id))
                    }}
                  /> {m.nome}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* ESPÓLIO */}
        {categoria === "ESPOLIO" && (
          <fieldset style={{ ...fieldsetStyle, border: "1px solid #fbd38d", background: "#fffaf0" }}>
            <legend style={legendStyle}>Representante Legal</legend>
            <div style={gridStyle}>
              <input value={nomeRepresentante} onChange={e => setNomeRepresentante(e.target.value)} placeholder="Nome do Responsável" style={inputStyle} />
              <input value={cpfRepresentante} onChange={e => setCpfRepresentante(e.target.value)} placeholder="CPF do Responsável" style={inputStyle} />
              <input value={vinculoRepresentante} onChange={e => setVinculoRepresentante(e.target.value)} placeholder="Vínculo (Ex: Inventariante)" style={inputStyle} />
            </div>
          </fieldset>
        )}

        {/* CURADORIA */}
        <fieldset style={{ ...fieldsetStyle, background: "#f0f7ff", border: "1px solid #90cdf4" }}>
          <legend style={legendStyle}>Painel de Curadoria</legend>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <select value={statusVerificacao} onChange={e => setStatusVerificacao(e.target.value as StatusVerificacao)} style={inputStyle}>
              <option value="PENDENTE">PENDENTE (Aguardando)</option>
              <option value="VERIFICADO">VERIFICADO (Aprovado)</option>
              <option value="REJEITADO">REJEITADO (Recusar)</option>
            </select>
            <select value={statusAtleta} onChange={e => setStatusAtleta(e.target.value as StatusAtleta)} style={inputStyle}>
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
              <option value="SUSPENSO">SUSPENSO</option>
            </select>
          </div>
          <textarea value={observacoesAdmin} onChange={e => setObservacoesAdmin(e.target.value)} placeholder="Observações internas para a curadoria..." style={{ ...inputStyle, width: "100%" }} />
        </fieldset>

        {/* FINANCEIRO */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Configuração Financeira</legend>
          <div style={gridStyle}>
            <input type="number" value={comissaoPlataformaDiferenciada} onChange={e => setComissaoPlataformaDiferenciada(Number(e.target.value))} placeholder="Comissão Plataforma (%)" style={inputStyle} />
            <select value={tipoChavePix} onChange={e => setTipoChavePix(e.target.value as TipoChavePix)} style={inputStyle}>
              <option value="CPF">CPF</option>
              <option value="EMAIL">E-MAIL</option>
              <option value="TELEFONE">TELEFONE</option>
              <option value="ALEATORIA">CHAVE ALEATÓRIA</option>
            </select>
            <input value={chavePix} onChange={e => setChavePix(e.target.value)} placeholder="Chave PIX" style={inputStyle} />
          </div>
        </fieldset>

        {/* MÍDIA */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Imagens</legend>
          {fotoDestaqueUrl && <img src={fotoDestaqueUrl} alt="Preview" style={{ maxWidth: 200, borderRadius: "8px", marginBottom: "1rem" }} />}
          <input type="file" onChange={handleUploadFoto} disabled={uploading} />
        </fieldset>

        <footer style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <button type="submit" disabled={saving || uploading} style={btnSaveStyle}>
            {saving ? "Gravando no Java..." : "Salvar Alterações"}
          </button>
          <button type="button" onClick={() => navigate("/admin/atletas")} style={btnCancelStyle}>Cancelar</button>
        </footer>
      </form>
    </section>
  )
}

// Estilos
const fieldsetStyle: React.CSSProperties = { border: "1px solid #ddd", borderRadius: "10px", padding: "1.5rem" }
const legendStyle: React.CSSProperties = { padding: "0 0.5rem", fontWeight: "bold", fontSize: "0.9rem", color: "#2d3748" }
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }
const inputStyle: React.CSSProperties = { padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.95rem" }
const badgeStyle: React.CSSProperties = { background: "#edf2f7", padding: "0.4rem 0.8rem", borderRadius: "20px", fontSize: "0.85rem", cursor: "pointer", border: "1px solid #cbd5e0" }
const btnSaveStyle: React.CSSProperties = { flex: 1, padding: "1rem", backgroundColor: "#3182ce", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }
const btnCancelStyle: React.CSSProperties = { padding: "1rem", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer" }
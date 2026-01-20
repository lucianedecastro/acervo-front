/* =====================================================
   FORMULÁRIO DE GESTÃO DE ATLETA (ADMIN)
   Status: Corrigido - Tipagem e Upload Sincronizados
   ===================================================== */

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"
import { Modalidade } from "@/types/modalidade"
import { AtletaUpdateDTO, CategoriaAtleta, StatusVerificacao, StatusAtleta, TipoChavePix } from "@/types/atleta"

export default function AtletaForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [nome, setNome] = useState("")
  const [nomeSocial, setNomeSocial] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("") 
  const [biografia, setBiografia] = useState("")
  const [categoria, setCategoria] = useState<CategoriaAtleta>("HISTORICA")
  const [statusAtleta, setStatusAtleta] = useState<StatusAtleta>("ATIVO")
  const [statusVerificacao, setStatusVerificacao] = useState<StatusVerificacao>("PENDENTE")
  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")
  const [percentualRepasse, setPercentualRepasse] = useState(0)
  const [comissaoPlataformaDiferenciada, setComissaoPlataformaDiferenciada] = useState(0)
  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [tipoConta, setTipoConta] = useState("")
  const [chavePix, setChavePix] = useState("")
  const [tipoChavePix, setTipoChavePix] = useState<TipoChavePix>("CPF")
  const [contratoAssinado, setContratoAssinado] = useState(false)
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<string[]>([])
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [fotoDestaqueUrl, setFotoDestaqueUrl] = useState("")
  const [fotoDestaqueId, setFotoDestaqueId] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    modalidadeService.listarAdmin().then(setModalidades).catch(console.error)
    if (isEditing && id) {
      atletaService.buscarPorId(id).then((data) => {
        setNome(data.nome); setNomeSocial(data.nomeSocial || ""); setEmail(data.email); setCpf(data.cpf)
        setBiografia(data.biografia); setCategoria(data.categoria); setStatusAtleta(data.statusAtleta)
        setStatusVerificacao(data.statusVerificacao); setPercentualRepasse(data.percentualRepasse * 100)
        setComissaoPlataformaDiferenciada(data.comissaoPlataformaDiferenciada * 100)
        setBanco(data.banco || ""); setAgencia(data.agencia || ""); setConta(data.conta || "")
        setTipoConta(data.tipoConta || ""); setChavePix(data.chavePix || ""); setTipoChavePix(data.tipoChavePix)
        setContratoAssinado(data.contratoAssinado); setNomeRepresentante(data.nomeRepresentante || "")
        setCpfRepresentante(data.cpfRepresentante || ""); setVinculoRepresentante(data.vinculoRepresentante || "")
        setModalidadesSelecionadas(data.modalidadesIds || []); setFotoDestaqueUrl(data.fotoDestaqueUrl || "")
      })
    }
  }, [id, isEditing])

  async function handleUploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    try {
      setIsUploading(true)
      // CORREÇÃO: Enviando o endpoint conforme mediaService
      const data = await mediaService.upload(file, "/acervo/upload")
      setFotoDestaqueId(data.id); setFotoDestaqueUrl(data.url)
    } catch (err) { alert("Erro no upload da foto") } finally { setIsUploading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setIsSaving(true)
    // CORREÇÃO: Trocando null por undefined para satisfazer AtletaUpdateDTO
    const payload: AtletaUpdateDTO = {
      nome,
      nomeSocial: nomeSocial || undefined,
      email,
      cpf,
      senha: senha || undefined,
      biografia,
      categoria,
      statusAtleta,
      statusVerificacao,
      nomeRepresentante: categoria === "ESPOLIO" ? nomeRepresentante : undefined,
      cpfRepresentante: categoria === "ESPOLIO" ? cpfRepresentante : undefined,
      vinculoRepresentante: categoria === "ESPOLIO" ? vinculoRepresentante : undefined,
      contratoAssinado,
      percentualRepasse: Number(percentualRepasse) / 100,
      comissaoPlataformaDiferenciada: Number(comissaoPlataformaDiferenciada) / 100,
      banco, agencia, conta, tipoConta, chavePix, tipoChavePix,
      modalidadesIds: modalidadesSelecionadas,
      fotoDestaqueId: fotoDestaqueId || undefined
    }

    try {
      if (isEditing && id) { await atletaService.atualizar(id, payload); alert("Atleta atualizada!") }
      else { await atletaService.criar(payload); alert("Atleta criada!") }
      navigate("/admin/atletas")
    } catch (err) { alert("Erro ao salvar") } finally { setIsSaving(false) }
  }

  return (
    <section style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}><h1>{isEditing ? `Editar: ${nome}` : "Nova Atleta"}</h1></header>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.5rem" }}>
          <legend style={{ fontWeight: "bold", padding: "0 10px" }}>Identificação e Foto</legend>
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <div style={{ width: "150px", height: "150px", border: "1px dashed #ccc", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {fotoDestaqueUrl ? <img src={fotoDestaqueUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>Sem Foto</span>}
            </div>
            <input type="file" onChange={handleUploadFoto} disabled={isUploading} />
          </div>
          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label>Nome Completo</label>
              <input value={nome} onChange={e => setNome(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Categoria</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value as CategoriaAtleta)} style={inputStyle}>
                <option value="HISTORICA">Histórica</option>
                <option value="ATIVA">Ativa</option>
                <option value="ESPOLIO">Espólio</option>
              </select>
            </div>
          </div>
        </fieldset>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" disabled={isSaving || isUploading} style={saveButtonStyle}>{isSaving ? "Processando..." : "Salvar Atleta"}</button>
          <button type="button" onClick={() => navigate("/admin/atletas")} style={cancelButtonStyle}>Cancelar</button>
        </div>
      </form>
    </section>
  )
}

const inputStyle = { width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #cbd5e0", marginTop: "0.4rem" };
const saveButtonStyle = { backgroundColor: "#1a1a1a", color: "white", padding: "1rem 2rem", border: "none", borderRadius: "6px", cursor: "pointer" };
const cancelButtonStyle = { backgroundColor: "transparent", border: "1px solid #cbd5e0", padding: "1rem 2rem", borderRadius: "6px", cursor: "pointer" };
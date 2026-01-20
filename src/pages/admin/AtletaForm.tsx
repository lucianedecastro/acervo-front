/* =====================================================
   FORMULÁRIO DE GESTÃO DE ATLETA (ADMIN)
   Funcionalidade: Criação e Edição Completa de Atletas
   Status: Corrigido - Upload e DTO Sincronizados
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

  /* ESTADOS DO FORMULÁRIO */
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

  /* CARGA DE DADOS INICIAIS */
  useEffect(() => {
    modalidadeService.listarAdmin().then(setModalidades).catch(console.error)

    if (isEditing && id) {
      atletaService.buscarPorId(id).then((data) => {
        setNome(data.nome)
        setNomeSocial(data.nomeSocial || "")
        setEmail(data.email)
        setCpf(data.cpf)
        setBiografia(data.biografia)
        setCategoria(data.categoria)
        setStatusAtleta(data.statusAtleta)
        setStatusVerificacao(data.statusVerificacao)
        setPercentualRepasse(data.percentualRepasse * 100)
        setComissaoPlataformaDiferenciada(data.comissaoPlataformaDiferenciada * 100)
        setBanco(data.banco || "")
        setAgencia(data.agencia || "")
        setConta(data.conta || "")
        setTipoConta(data.tipoConta || "")
        setChavePix(data.chavePix || "")
        setTipoChavePix(data.tipoChavePix)
        setContratoAssinado(data.contratoAssinado)
        setNomeRepresentante(data.nomeRepresentante || "")
        setCpfRepresentante(data.cpfRepresentante || "")
        setVinculoRepresentante(data.vinculoRepresentante || "")
        setModalidadesSelecionadas(data.modalidadesIds || [])
        setFotoDestaqueUrl(data.fotoDestaqueUrl || "")
      })
    }
  }, [id, isEditing])

  /* LÓGICA DE UPLOAD */
  async function handleUploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      // CORREÇÃO: Chamada simplificada para o novo mediaService
      const data = await mediaService.upload(file)
      setFotoDestaqueId(data.id)
      setFotoDestaqueUrl(data.url)
    } catch (err) {
      console.error("Erro no upload:", err)
      alert("Erro no upload da foto de perfil.")
    } finally {
      setIsUploading(false)
    }
  }

  /* SALVAMENTO DOS DADOS */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    // CORREÇÃO: Uso de undefined para campos nulos para satisfazer o DTO
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
      banco,
      agencia,
      conta,
      tipoConta,
      chavePix,
      tipoChavePix, // Resolve anotação ts(2322)
      modalidadesIds: modalidadesSelecionadas,
      fotoDestaqueId: fotoDestaqueId || undefined
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
    } catch (err) {
      console.error("Erro ao salvar:", err)
      alert("Erro ao salvar os dados. Verifique a conexão com o servidor.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section style={containerStyle}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>{isEditing ? `Gestão: ${nome}` : "Novo Cadastro de Atleta"}</h1>
      </header>

      <form onSubmit={handleSubmit} style={formGridStyle}>
        {/* SEÇÃO DE FOTO */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Foto de Destaque</legend>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={previewBoxStyle}>
              {fotoDestaqueUrl ? (
                <img src={fotoDestaqueUrl} alt="Preview" style={previewImgStyle} />
              ) : (
                <span style={{ color: "#999" }}>Sem Foto</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleUploadFoto} disabled={isUploading} />
            {isUploading && <p style={{ fontSize: "0.8rem", color: "#3182ce" }}>Enviando imagem...</p>}
          </div>
        </fieldset>

        {/* DADOS IDENTITÁRIOS */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Dados Identitários</legend>
          <div style={inputRowStyle}>
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
                <option value="REVELACAO">Revelação</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* CAMPOS CONDICIONAIS DE ESPÓLIO */}
        {categoria === "ESPOLIO" && (
          <fieldset style={{ ...fieldsetStyle, backgroundColor: "#fffaf0" }}>
            <legend style={legendStyle}>Representante Legal (Espólio)</legend>
            <div style={inputRowStyle}>
              <div style={{ flex: 1 }}>
                <label>Nome do Representante</label>
                <input value={nomeRepresentante} onChange={e => setNomeRepresentante(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label>CPF do Representante</label>
                <input value={cpfRepresentante} onChange={e => setCpfRepresentante(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </fieldset>
        )}

        <div style={actionRowStyle}>
          <button type="submit" disabled={isSaving || isUploading} style={saveButtonStyle}>
            {isSaving ? "Processando..." : "Salvar Atleta"}
          </button>
          <button type="button" onClick={() => navigate("/admin/atletas")} style={cancelButtonStyle}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  )
}

/* ESTILOS */
const containerStyle: React.CSSProperties = { maxWidth: "900px", margin: "0 auto", padding: "2rem" }
const formGridStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "1.5rem" }
const fieldsetStyle: React.CSSProperties = { border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.5rem" }
const legendStyle: React.CSSProperties = { fontWeight: "bold", padding: "0 10px", color: "#2d3748" }
const inputRowStyle: React.CSSProperties = { display: "flex", gap: "1.5rem", marginBottom: "1rem" }
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #cbd5e0", marginTop: "0.4rem" }
const actionRowStyle: React.CSSProperties = { display: "flex", gap: "1rem" }
const saveButtonStyle: React.CSSProperties = { backgroundColor: "#1a1a1a", color: "white", padding: "1rem 2rem", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }
const cancelButtonStyle: React.CSSProperties = { backgroundColor: "transparent", border: "1px solid #cbd5e0", padding: "1rem 2rem", borderRadius: "6px", cursor: "pointer" }
const previewBoxStyle: React.CSSProperties = { width: "150px", height: "150px", border: "1px dashed #ccc", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#f9f9f9" }
const previewImgStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" }
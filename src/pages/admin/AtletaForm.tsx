/* =====================================================
   FORMULÁRIO DE GESTÃO DE ATLETA (ADMIN)
   Funcionalidade: Criação e Edição Completa de Atletas
   Sincronizado com: AtletaFormDTO (Imagem ad3063)
   ===================================================== */

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { atletaService } from "@/services/atletaService"
import { modalidadeService } from "@/services/modalidadeService"
import { mediaService } from "@/services/mediaService"

import { Modalidade } from "@/types/modalidade"
// Tipos estritos baseados no DTO da Imagem ad3063
import { AtletaUpdateDTO, CategoriaAtleta, StatusVerificacao, StatusAtleta } from "@/types/atleta"

export default function AtletaForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  /* ==========================
      ESTADOS TIPADOS (DTO ad3063)
     ========================== */
  const [nome, setNome] = useState("")
  const [nomeSocial, setNomeSocial] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("") // Campo presente no DTO (ad3063)
  const [biografia, setBiografia] = useState("")
  
  // Categorias atualizadas: HISTORICA, ATIVA ou ESPOLIO
  const [categoria, setCategoria] = useState<CategoriaAtleta>("HISTORICA")
  const [statusAtleta, setStatusAtleta] = useState<StatusAtleta>("ATIVO")
  const [statusVerificacao, setStatusVerificacao] = useState<StatusVerificacao>("PENDENTE")
  
  // Representante Legal (ad3063)
  const [nomeRepresentante, setNomeRepresentante] = useState("")
  const [cpfRepresentante, setCpfRepresentante] = useState("")
  const [vinculoRepresentante, setVinculoRepresentante] = useState("")

  // Financeiro e Repasse
  const [percentualRepasse, setPercentualRepasse] = useState(0)
  const [comissaoPlataformaDiferenciada, setComissaoPlataformaDiferenciada] = useState(0)
  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [tipoConta, setTipoConta] = useState("")
  const [chavePix, setChavePix] = useState("")
  const [tipoChavePix, setTipoChavePix] = useState("CPF")
  const [contratoAssinado, setContratoAssinado] = useState(false)

  // Modalidades e Mídia
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState<string[]>([])
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [fotoDestaqueUrl, setFotoDestaqueUrl] = useState("")
  const [fotoDestaqueId, setFotoDestaqueId] = useState("")

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  /* ==========================
      CARGA DE DADOS
     ========================== */
  useEffect(() => {
    modalidadeService.listarAdmin()
      .then(setModalidades)
      .catch(console.error)

    if (isEditing && id) {
      atletaService.buscarPorId(id).then((data) => {
        setNome(data.nome)
        setNomeSocial(data.nomeSocial || "")
        setEmail(data.email)
        setCpf(data.cpf)
        setBiografia(data.biografia)
        setCategoria(data.categoria as CategoriaAtleta)
        setStatusAtleta(data.statusAtleta as StatusAtleta)
        setStatusVerificacao(data.statusVerificacao as StatusVerificacao)
        setPercentualRepasse(data.percentualRepasse * 100)
        setComissaoPlataformaDiferenciada(data.comissaoPlataformaDiferenciada * 100)
        setBanco(data.banco || "")
        setAgencia(data.agencia || "")
        setConta(data.conta || "")
        setTipoConta(data.tipoConta || "")
        setChavePix(data.chavePix || "")
        setTipoChavePix(data.tipoChavePix || "CPF")
        setContratoAssinado(data.contratoAssinado)
        setNomeRepresentante(data.nomeRepresentante || "")
        setCpfRepresentante(data.cpfRepresentante || "")
        setVinculoRepresentante(data.vinculoRepresentante || "")
        setModalidadesSelecionadas(data.modalidadesIds || [])
        setFotoDestaqueUrl(data.fotoDestaqueUrl || "")
      })
    }
  }, [id, isEditing])

  /* ==========================
      SUBMIT (CORRIGE ERRO ad2900)
     ========================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    // Payload construído exatamente como o AtletaFormDTO da imagem ad3063
    const payload: any = {
      nome,
      nomeSocial,
      email,
      cpf,
      senha: senha || undefined,
      biografia,
      categoria, // Resolve erro de tipagem estrita
      statusAtleta,
      statusVerificacao,
      nomeRepresentante,
      cpfRepresentante,
      vinculoRepresentante,
      contratoAssinado,
      percentualRepasse: percentualRepasse / 100,
      comissaoPlataformaDiferenciada: comissaoPlataformaDiferenciada / 100,
      banco,
      agencia,
      conta,
      tipoConta,
      chavePix,
      tipoChavePix,
      modalidadesIds: modalidadesSelecionadas,
      fotoDestaqueId: fotoDestaqueId || undefined
    }

    try {
      if (isEditing && id) {
        await atletaService.atualizar(id, payload)
        alert("Perfil atualizado com sucesso!")
      } else {
        await atletaService.criar(payload)
        alert("Cadastro realizado com sucesso!")
      }
      navigate("/admin/atletas")
    } catch (err) {
      console.error("Erro ao salvar:", err)
      alert("Erro ao processar a solicitação.")
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
        {/* IDENTIFICAÇÃO */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Dados Identitários</legend>
          <div style={inputRowStyle}>
            <div style={{ flex: 1 }}>
              <label>Nome Completo</label>
              <input value={nome} onChange={e => setNome(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Nome Social (Opcional)</label>
              <input value={nomeSocial} onChange={e => setNomeSocial(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={inputRowStyle}>
            <div style={{ flex: 1 }}>
              <label>Categoria (DTO ad3063)</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value as CategoriaAtleta)} style={inputStyle}>
                <option value="HISTORICA">Histórica</option>
                <option value="ATIVA">Ativa</option>
                <option value="ESPOLIO">Espólio</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Status Sistema</label>
              <select value={statusAtleta} onChange={e => setStatusAtleta(e.target.value as StatusAtleta)} style={inputStyle}>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* FINANCEIRO (PIX Enum ad3063) */}
        <fieldset style={{ ...fieldsetStyle, backgroundColor: "#f8fafc" }}>
          <legend style={legendStyle}>Dados Bancários e Chave PIX</legend>
          <div style={inputRowStyle}>
            <div style={{ flex: 1 }}>
              <label>Tipo Chave PIX</label>
              <select value={tipoChavePix} onChange={e => setTipoChavePix(e.target.value)} style={inputStyle}>
                <option value="CPF">CPF</option>
                <option value="EMAIL">E-mail</option>
                <option value="TELEFONE">Telefone</option>
                <option value="ALEATORIA">Aleatória</option>
                <option value="NENHUM">Nenhum</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Chave PIX</label>
              <input value={chavePix} onChange={e => setChavePix(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </fieldset>

        <div style={actionRowStyle}>
          <button type="submit" disabled={isSaving} style={saveButtonStyle}>
            {isSaving ? "Gravando..." : "Salvar Cadastro"}
          </button>
          <button type="button" onClick={() => navigate("/admin/atletas")} style={cancelButtonStyle}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  )
}

/* ==========================
    ESTILOS (MANTIDOS)
   ========================== */
const containerStyle: React.CSSProperties = { maxWidth: "900px", margin: "0 auto", padding: "2rem" }
const formGridStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "1.5rem" }
const fieldsetStyle: React.CSSProperties = { border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.5rem" }
const legendStyle: React.CSSProperties = { fontWeight: "bold", padding: "0 10px", color: "#2d3748" }
const inputRowStyle: React.CSSProperties = { display: "flex", gap: "1.5rem", marginBottom: "1rem" }
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #cbd5e0", marginTop: "0.4rem" }
const actionRowStyle: React.CSSProperties = { display: "flex", gap: "1rem", marginTop: "1rem" }
const saveButtonStyle: React.CSSProperties = { backgroundColor: "#1a1a1a", color: "white", padding: "1rem 2rem", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }
const cancelButtonStyle: React.CSSProperties = { backgroundColor: "transparent", border: "1px solid #cbd5e0", padding: "1rem 2rem", borderRadius: "6px", cursor: "pointer" }
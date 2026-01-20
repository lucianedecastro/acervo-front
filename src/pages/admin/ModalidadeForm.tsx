/* =====================================================
   FORMULÁRIO DE GESTÃO DE MODALIDADE (ADMIN)
   Funcionalidade: Criação e Edição de Categorias Esportivas
   Alinhado ao Swagger: POST /modalidades e PUT /modalidades/{id}
   ===================================================== */

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade, ModalidadeDTO } from "@/types/modalidade"

export default function ModalidadeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  /* ==========================
      ESTADOS DO FORMULÁRIO (Schema ad3fa4)
     ========================== */
  const [nome, setNome] = useState("")
  const [historia, setHistoria] = useState("")
  const [pictogramaUrl, setPictogramaUrl] = useState("")
  const [fotoDestaquePublicId, setFotoDestaquePublicId] = useState("")
  const [ativa, setAtiva] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
      CARREGAR DADOS (EDIÇÃO)
     ========================== */
  useEffect(() => {
    if (!id) return

    async function carregar() {
      try {
        setLoading(true)
        setError(null)

        // Busca dados detalhados da modalidade (Alinhado ao GET /modalidades/{id})
        const data: Modalidade = await modalidadeService.buscarPorId(id as string)

        setNome(data.nome)
        setHistoria(data.historia || "")
        setPictogramaUrl(data.pictogramaUrl || "")
        setFotoDestaquePublicId(data.fotoDestaquePublicId || "")
        setAtiva(data.ativa !== false)
      } catch (err) {
        console.error("Erro ao carregar modalidade:", err)
        setError("Não foi possível carregar os dados desta modalidade.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [id])

  /* ==========================
      SUBMIT (POST ou PUT)
     ========================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Payload construído exatamente como o ModalidadeDTO da imagem ad3fa4
    const payload: ModalidadeDTO = {
      nome,
      historia,
      pictogramaUrl,
      fotoDestaquePublicId,
      ativa,
      fotos: [] // Inicialmente vazio, preenchido via upload se necessário
    }

    try {
      if (isEdit && id) {
        // Alinhado ao PUT /modalidades/{id} (Imagem ad91df)
        await modalidadeService.atualizar(id as string, payload)
        alert("Modalidade atualizada com sucesso!")
      } else {
        // Alinhado ao POST /modalidades (Imagem ad9241)
        await modalidadeService.criar(payload)
        alert("Nova modalidade criada com sucesso!")
      }

      navigate("/admin/modalidades")
    } catch (err) {
      console.error("Erro ao salvar modalidade:", err)
      setError("Falha ao salvar a modalidade. Verifique os dados e o serviço.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) return <p style={{ padding: "2rem", textAlign: "center" }}>Carregando dados...</p>

  return (
    <section style={containerStyle}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1a1a1a" }}>
          {isEdit ? `Editar Modalidade: ${nome}` : "Cadastrar Nova Modalidade"}
        </h1>
      </header>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#fff5f5", color: "#c53030", borderRadius: "6px", marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Nome da Modalidade</label>
          <input
            type="text"
            style={inputStyle}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Natação, Atletismo..."
            required
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ ...inputGroupStyle, flex: 1 }}>
            <label style={labelStyle}>URL do Pictograma (Ícone)</label>
            <input
              type="text"
              style={inputStyle}
              value={pictogramaUrl}
              onChange={(e) => setPictogramaUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
            />
          </div>
          <div style={{ ...inputGroupStyle, flex: 1 }}>
            <label style={labelStyle}>Foto de Destaque (Public ID)</label>
            <input
              type="text"
              style={inputStyle}
              value={fotoDestaquePublicId}
              onChange={(e) => setFotoDestaquePublicId(e.target.value)}
              placeholder="modalidades/foto_capa"
            />
          </div>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>História da Modalidade no Brasil</label>
          <textarea
            style={{ ...inputStyle, fontFamily: "inherit" }}
            value={historia}
            onChange={(e) => setHistoria(e.target.value)}
            rows={8}
            placeholder="Descreva a trajetória desta modalidade..."
          />
        </div>

        <div style={{ ...inputGroupStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            id="ativa"
            checked={ativa}
            onChange={(e) => setAtiva(e.target.checked)}
            style={{ width: "18px", height: "18px" }}
          />
          <label htmlFor="ativa" style={{ fontWeight: "600", color: "#4a5568", cursor: "pointer" }}>
            Modalidade disponível para novos cadastros de atletas
          </label>
        </div>

        <div style={actionRowStyle}>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...saveButtonStyle,
              backgroundColor: loading ? "#ccc" : "#1a1a1a"
            }}
          >
            {loading ? "Gravando..." : "Salvar Modalidade"}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate("/admin/modalidades")}
            style={cancelButtonStyle}
          >
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
const containerStyle: React.CSSProperties = { maxWidth: "800px", margin: "0 auto", padding: "1rem" }
const formStyle: React.CSSProperties = { backgroundColor: "white", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }
const inputGroupStyle: React.CSSProperties = { marginBottom: "1.5rem" }
const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.85rem", color: "#4a5568" }
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "1rem" }
const actionRowStyle: React.CSSProperties = { display: "flex", gap: "1rem", marginTop: "2rem" }
const saveButtonStyle: React.CSSProperties = { flex: 2, padding: "1rem", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }
const cancelButtonStyle: React.CSSProperties = { flex: 1, padding: "1rem", backgroundColor: "white", border: "1px solid #cbd5e0", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }
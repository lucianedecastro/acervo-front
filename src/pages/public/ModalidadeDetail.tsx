import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"

export default function ModalidadeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [modalidade, setModalidade] = useState<Modalidade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("ID da modalidade não informado.")
      setLoading(false)
      return
    }

    modalidadeService
      .buscarPorId(id)
      .then((data) => {
        setModalidade(data)
      })
      .catch((err) => {
        console.error("Erro ao buscar modalidade:", err)
        setError("Modalidade não encontrada ou erro na conexão.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p>Carregando modalidade...</p>
      </div>
    )
  }

  if (error || !modalidade) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p style={{ color: "#d93025", marginBottom: "1rem" }}>
          {error || "Modalidade não encontrada."}
        </p>
        <button onClick={() => navigate("/modalidades")} style={backButtonStyle}>
          Voltar para a lista
        </button>
      </div>
    )
  }

  return (
    <main style={containerStyle}>
      <button onClick={() => navigate("/modalidades")} style={backButtonStyle}>
        ← Voltar para modalidades
      </button>

      <article style={articleStyle}>
        <header style={headerStyle}>
          {modalidade.pictogramaUrl && (
            <div style={iconContainerStyle}>
              <img
                src={modalidade.pictogramaUrl}
                alt={`Ícone de ${modalidade.nome}`}
                style={iconStyle}
              />
            </div>
          )}
          <h1 style={titleStyle}>{modalidade.nome}</h1>
        </header>

        <section style={contentSectionStyle}>
          <h2 style={subtitleStyle}>História e Contexto</h2>
          {modalidade.historia ? (
            <p style={textStyle}>{modalidade.historia}</p>
          ) : (
            <p style={{ ...textStyle, fontStyle: "italic", color: "#999" }}>
              Nenhuma descrição histórica disponível no momento.
            </p>
          )}
        </section>
      </article>
    </main>
  )
}

/* =========================
   ESTILOS (CSS-IN-JS)
   ========================= */

const containerStyle: React.CSSProperties = {
  maxWidth: "960px",
  margin: "0 auto",
  padding: "3rem 2rem",
}

const backButtonStyle: React.CSSProperties = {
  marginBottom: "2rem",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "1px solid #ddd",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  fontSize: "0.9rem",
  color: "#555",
  transition: "all 0.2s",
}

const articleStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "12px",
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  marginBottom: "3rem",
  gap: "1.5rem",
}

const iconContainerStyle: React.CSSProperties = {
  width: "120px",
  height: "120px",
  backgroundColor: "#f9f9f9",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  border: "1px solid #f0f0f0",
}

const iconStyle: React.CSSProperties = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
}

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(2rem, 5vw, 3rem)",
  color: "#111",
  margin: 0,
}

const contentSectionStyle: React.CSSProperties = {
  borderTop: "1px solid #eee",
  paddingTop: "2.5rem",
}

const subtitleStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "1.2rem",
  color: "#111",
}

const textStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  lineHeight: "1.8",
  color: "#333",
  whiteSpace: "pre-wrap",
}
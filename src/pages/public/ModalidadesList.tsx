import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { modalidadeService } from "@/services/modalidadeService"
import { Modalidade } from "@/types/modalidade"

export default function ModalidadesList() {
  const navigate = useNavigate()
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    modalidadeService
      .listar()
      .then(setModalidades)
      .catch((err) => {
        console.error("Erro ao carregar modalidades:", err)
        setError("Não foi possível carregar as modalidades no momento.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p style={{ color: "#666" }}>Carregando modalidades...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p style={{ color: "#d93025" }}>{error}</p>
      </div>
    )
  }

  return (
    <main style={containerStyle}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={titleStyle}>Modalidades</h1>
        <p style={subtitleStyle}>
          Explore as modalidades esportivas que compõem o acervo e entenda os 
          contextos históricos da presença feminina em cada uma delas.
        </p>
      </header>

      {modalidades.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
          Nenhuma modalidade cadastrada no momento.
        </p>
      ) : (
        <div style={gridStyle}>
          {modalidades.map((modalidade) => (
            <article
              key={modalidade.id}
              onClick={() => navigate(`/modalidades/${modalidade.id}`)}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.borderColor = "#c5a059"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.borderColor = "#eee"
              }}
            >
              <div style={iconWrapperStyle}>
                {modalidade.pictogramaUrl ? (
                  <img
                    src={modalidade.pictogramaUrl}
                    alt={modalidade.nome}
                    style={iconStyle}
                  />
                ) : (
                  <div style={placeholderStyle}>Símbolo</div>
                )}
              </div>

              <div style={cardContentStyle}>
                <strong style={nameStyle}>{modalidade.nome}</strong>
                <span style={viewMoreStyle}>Ver detalhes →</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

/* =========================
   ESTILOS (CSS-IN-JS)
   ========================= */

const containerStyle: React.CSSProperties = {
  padding: "3rem 1.5rem",
  maxWidth: "960px",
  margin: "0 auto",
}

const titleStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  marginBottom: "1rem",
  color: "#111",
}

const subtitleStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  color: "#555",
  lineHeight: "1.6",
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "1.5rem",
  marginTop: "1rem",
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #eee",
  borderRadius: "12px",
  padding: "1.5rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
}

const iconWrapperStyle: React.CSSProperties = {
  width: "80px",
  height: "80px",
  backgroundColor: "#f9f9f9",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "1rem",
  padding: "15px",
}

const iconStyle: React.CSSProperties = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
}

const placeholderStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#ccc",
  textTransform: "uppercase",
}

const cardContentStyle: React.CSSProperties = {
  marginTop: "0.5rem",
}

const nameStyle: React.CSSProperties = {
  display: "block",
  fontSize: "1.15rem",
  color: "#111",
  marginBottom: "0.5rem",
}

const viewMoreStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#c5a059",
  fontWeight: "600",
}
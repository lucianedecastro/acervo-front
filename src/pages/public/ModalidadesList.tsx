/* =====================================================
   LISTAGEM DE MODALIDADES (PÚBLICO)
   Funcionalidade: Vitrine de categorias esportivas
   Alinhado ao Swagger: Consumo de modalidades ativas
   ===================================================== */

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
    // CORREÇÃO: Utilizando o fluxo de listagem configurado no service
    modalidadeService
      .listarAdmin() // Pode ser substituído por listarPublico() se houver filtro de 'ativas' no backend
      .then((data) => {
        // Filtramos apenas as modalidades ativas para a vitrine pública
        setModalidades(data.filter(m => m.ativa))
      })
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
        <button 
          onClick={() => window.location.reload()} 
          style={{ marginTop: '1rem', cursor: 'pointer' }}
        >
          Tentar novamente
        </button>
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
          Nenhuma modalidade disponível para visualização no momento.
        </p>
      ) : (
        <div style={gridStyle}>
          {modalidades.map((modalidade) => (
            <article
              key={modalidade.id}
              // CORREÇÃO: Navegação agora utiliza o SLUG para SEO (Imagem ad927c)
              onClick={() => navigate(`/modalidades/${modalidade.slug}`)}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.borderColor = "#c5a059"
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.borderColor = "#eee"
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)"
              }}
            >
              <div style={iconWrapperStyle}>
                {modalidade.pictogramaUrl ? (
                  <img
                    src={modalidade.pictogramaUrl}
                    alt={`Ícone de ${modalidade.nome}`}
                    style={iconStyle}
                  />
                ) : (
                  <div style={placeholderStyle}>Símbolo</div>
                )}
              </div>

              <div style={cardContentStyle}>
                <strong style={nameStyle}>{modalidade.nome}</strong>
                <span style={viewMoreStyle}>Explorar História →</span>
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
  padding: "4rem 1.5rem",
  maxWidth: "1100px",
  margin: "0 auto",
}

const titleStyle: React.CSSProperties = {
  fontSize: "3rem",
  marginBottom: "1rem",
  color: "#1a1a1a",
  fontWeight: "800",
}

const subtitleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#666",
  lineHeight: "1.6",
  maxWidth: "700px",
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "2rem",
  marginTop: "2rem",
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #eee",
  borderRadius: "8px",
  padding: "2rem",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
}

const iconWrapperStyle: React.CSSProperties = {
  width: "100px",
  height: "100px",
  backgroundColor: "#fcfcfc",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "1.5rem",
  padding: "20px",
  border: "1px solid #f5f5f5"
}

const iconStyle: React.CSSProperties = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
}

const placeholderStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#bbb",
  textTransform: "uppercase",
  letterSpacing: "1px"
}

const cardContentStyle: React.CSSProperties = {
  marginTop: "0.5rem",
}

const nameStyle: React.CSSProperties = {
  display: "block",
  fontSize: "1.25rem",
  color: "#111",
  marginBottom: "0.75rem",
  fontWeight: "700"
}

const viewMoreStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#c5a059",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
}
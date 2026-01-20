/* =====================================================
   LISTAGEM DE ATLETAS (PÚBLICO)
   Funcionalidade: Vitrine principal do acervo
   Alinhado ao Swagger: GET /atletas
   ===================================================== */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { atletaService } from "@/services/atletaService"
// CORREÇÃO: Utilizando o tipo oficial 'Atleta' conforme o arquivo types/atleta.ts
import { Atleta } from "@/types/atleta"

export default function AtletasList() {
  const navigate = useNavigate()

  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Alinhado ao Swagger: GET /atletas
    atletaService
      .listarPublico()
      .then(setAtletas)
      .catch((err) => {
        console.error("Erro ao carregar vitrine de atletas:", err)
        setError("Não foi possível carregar o acervo de atletas no momento.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <p style={{ color: "#666" }}>Carregando trajetórias históricas...</p>
    </div>
  )

  if (error) return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <p style={{ color: "#d93025" }}>{error}</p>
      <button onClick={() => window.location.reload()} style={retryButtonStyle}>
        Tentar novamente
      </button>
    </div>
  )

  return (
    <main style={containerStyle}>
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={titleStyle}>Atletas</h1>
        <p style={subtitleStyle}>
          Conheça as mulheres que transformaram o esporte brasileiro através de seus acervos pessoais.
        </p>
      </header>

      {atletas.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", padding: "4rem" }}>
          O acervo está sendo atualizado. Volte em breve!
        </p>
      ) : (
        <div style={gridStyle}>
          {atletas.map((atleta) => (
            <article
              key={atleta.id}
              onClick={() => navigate(`/atleta/${atleta.slug}`)}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)"
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.02)"
              }}
            >
              <div style={imageContainerStyle}>
                {atleta.fotoDestaqueUrl ? (
                  <img
                    src={atleta.fotoDestaqueUrl}
                    alt={atleta.nome}
                    style={imageStyle}
                  />
                ) : (
                  <div style={placeholderStyle}>Imagem em pesquisa</div>
                )}
              </div>
              <div style={cardContentStyle}>
                <span style={categoryLabelStyle}>{atleta.categoria}</span>
                <strong style={nameStyle}>{atleta.nome}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

/* ==========================
    ESTILOS (CSS-IN-JS)
   ========================== */
const retryButtonStyle: React.CSSProperties = { 
  marginTop: "1rem", 
  cursor: "pointer", 
  padding: "0.5rem 1rem",
  backgroundColor: "transparent",
  border: "1px solid #ddd",
  borderRadius: "4px"
}

const containerStyle: React.CSSProperties = { 
  padding: "4rem 1.5rem", 
  maxWidth: "1100px", 
  margin: "0 auto" 
}

const titleStyle: React.CSSProperties = { 
  fontSize: "3rem", 
  marginBottom: "1rem", 
  color: "#1a1a1a", 
  fontWeight: "800" 
}

const subtitleStyle: React.CSSProperties = { 
  fontSize: "1.2rem", 
  color: "#666", 
  lineHeight: "1.6", 
  maxWidth: "600px", 
  margin: "0 auto" 
}

const gridStyle: React.CSSProperties = { 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
  gap: "2.5rem", 
  marginTop: "2rem" 
}

const cardStyle: React.CSSProperties = { 
  backgroundColor: "#fff", 
  borderRadius: "4px", 
  overflow: "hidden", 
  cursor: "pointer", 
  border: "1px solid #f0f0f0",
  transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
  boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
}

const imageContainerStyle: React.CSSProperties = { 
  width: "100%", 
  height: "320px", 
  backgroundColor: "#f5f5f5", 
  overflow: "hidden" 
}

const imageStyle: React.CSSProperties = { 
  width: "100%", 
  height: "100%", 
  objectFit: "cover" 
}

const placeholderStyle: React.CSSProperties = { 
  width: "100%", 
  height: "100%", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  color: "#aaa",
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "1px"
}

const cardContentStyle: React.CSSProperties = { 
  padding: "1.5rem", 
  textAlign: "left" 
}

const categoryLabelStyle: React.CSSProperties = { 
  fontSize: "0.7rem", 
  color: "#999", 
  fontWeight: "700", 
  textTransform: "uppercase", 
  display: "block", 
  marginBottom: "0.5rem" 
}

const nameStyle: React.CSSProperties = { 
  display: "block", 
  fontSize: "1.25rem", 
  color: "#1a1a1a", 
  lineHeight: "1.2" 
}
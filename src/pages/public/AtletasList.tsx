import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"

export default function AtletasList() {
  const navigate = useNavigate()

  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    atletaService
      .listarTodas()
      .then(setAtletas)
      .catch((err) => {
        console.error("Erro ao carregar atletas:", err)
        setError("Não foi possível carregar o acervo de atletas no momento.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p style={{ color: "#666" }}>Carregando acervo de atletas...</p>
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
        <h1 style={titleStyle}>Atletas</h1>
        <p style={subtitleStyle}>
          Conheça as trajetórias das mulheres que transformaram o esporte brasileiro através de seus acervos pessoais.
        </p>
      </header>

      {atletas.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
          Nenhuma atleta cadastrada no momento.
        </p>
      ) : (
        <div style={gridStyle}>
          {atletas.map((atleta) => {
            const fotoDestaque =
              atleta.fotos?.find((f) => f.isDestaque)?.url ||
              atleta.fotos?.[0]?.url

            return (
              <article
                key={atleta.id}
                onClick={() => navigate(`/atletas/${atleta.id}`)}
                style={cardStyle}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={imageContainerStyle}>
                  {fotoDestaque ? (
                    <img
                      src={fotoDestaque}
                      alt={`Foto de ${atleta.nome}`}
                      style={imageStyle}
                    />
                  ) : (
                    <div style={placeholderStyle}>Sem imagem</div>
                  )}
                </div>

                <div style={cardContentStyle}>
                  <strong style={nameStyle}>{atleta.nome}</strong>
                  {atleta.modalidades?.length > 0 && (
                    <span style={modalidadeStyle}>
                      {atleta.modalidades.join(" · ")}
                    </span>
                  )}
                </div>
              </article>
            )
          })}
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
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "2rem",
  marginTop: "1rem",
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #eee",
  borderRadius: "12px",
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
}

const imageContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "240px",
  backgroundColor: "#f9f9f9",
  overflow: "hidden",
}

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
}

const placeholderStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#999",
  fontSize: "0.9rem",
}

const cardContentStyle: React.CSSProperties = {
  padding: "1.2rem",
  textAlign: "center",
}

const nameStyle: React.CSSProperties = {
  display: "block",
  fontSize: "1.1rem",
  color: "#111",
  marginBottom: "0.4rem",
}

const modalidadeStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#c5a059",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}
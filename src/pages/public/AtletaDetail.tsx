import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { atletaService } from "@/services/atletaService"
import { itemAcervoService } from "@/services/itemAcervoService"

import { Atleta, Foto } from "@/types/atleta"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

export default function AtletaDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [itensAcervo, setItensAcervo] = useState<ItemAcervoResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
      CARREGAR DADOS
      ========================== */
  useEffect(() => {
    if (!id) return

    async function carregar() {
      try {
        setLoading(true)

        const [dadosAtleta, itens] = await Promise.all([
          atletaService.buscarPorId(id as string),
          itemAcervoService.listarPorAtleta(id as string),
        ])

        // Normaliza fotos para evitar undefined
        setAtleta({
          ...dadosAtleta,
          fotos: dadosAtleta.fotos ?? [],
        })

        setItensAcervo(itens)
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError("Atleta não encontrada ou erro na conexão.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [id])

  /* ==========================
      STATES DE ERRO / LOADING
      ========================== */
  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p>Carregando perfil e acervo...</p>
      </div>
    )
  }

  if (error || !atleta) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p style={{ color: "#d93025", marginBottom: "1rem" }}>
          {error || "Atleta não encontrada."}
        </p>
        <button onClick={() => navigate("/atletas")} style={backButtonStyle}>
          Voltar para a lista
        </button>
      </div>
    )
  }

  const fotos: Foto[] = atleta.fotos ?? []
  const fotoDestaque = fotos.find((f) => f.isDestaque) || fotos[0] || null

  return (
    <main style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>
        ← Voltar
      </button>

      <article>
        <header style={headerGridStyle}>
          <div style={photoContainerStyle}>
            {fotoDestaque && (
              <img
                src={fotoDestaque.url}
                alt={atleta.nome}
                style={photoStyle}
              />
            )}
          </div>

          <div style={infoContainerStyle}>
            <h1 style={nameStyle}>{atleta.nome}</h1>

            {atleta.modalidades.length > 0 && (
              <h3 style={modalidadeLabelStyle}>
                {atleta.modalidades.join(" · ")}
              </h3>
            )}
          </div>
        </header>

        {/* ===== BIOGRAFIA ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Biografia e Trajetória</h2>
          <div style={bioTextStyle}>
            {atleta.biografia}
          </div>
        </section>

        {/* ===== ITENS DO ACERVO ===== */}
        {itensAcervo.length > 0 && (
          <section style={acervoContainerStyle}>
            <h2 style={sectionTitleStyle}>Itens do Acervo Histórico</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              Objetos, medalhas e documentos que fazem parte da história desta atleta.
            </p>

            <div style={itemsGridStyle}>
              {itensAcervo.map((item) => (
                <div key={item.id} style={itemCardStyle}>
                  {item.fotoPrincipalUrl && (
                    <img
                      src={item.fotoPrincipalUrl}
                      alt={item.titulo}
                      style={itemImageStyle}
                    />
                  )}
                  <h4 style={{ marginTop: "1rem", color: "#111" }}>
                    {item.titulo}
                  </h4>
                  <p style={itemDescriptionStyle}>
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== GALERIA ===== */}
        {fotos.length > 1 && (
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Galeria de Imagens</h2>
            <div style={galleryGridStyle}>
              {fotos.map((foto) => (
                <a
                  key={foto.id}
                  href={foto.url}
                  target="_blank"
                  rel="noreferrer"
                  style={galleryItemStyle}
                >
                  <img
                    src={foto.url}
                    alt="Acervo fotográfico"
                    style={galleryImageStyle}
                  />
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}

/* =========================
   ESTILOS (CSS-IN-JS)
   ========================= */

const containerStyle: React.CSSProperties = {
  padding: "2rem 1.5rem",
  maxWidth: "960px",
  margin: "0 auto",
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

const headerGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "2.5rem",
  marginBottom: "4rem",
  alignItems: "center",
}

const photoContainerStyle: React.CSSProperties = {
  textAlign: "center",
}

const photoStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "350px",
  borderRadius: "12px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  objectFit: "cover",
}

const infoContainerStyle: React.CSSProperties = {
  textAlign: "left",
}

const nameStyle: React.CSSProperties = {
  fontSize: "clamp(2rem, 5vw, 3rem)",
  marginBottom: "0.75rem",
  color: "#111",
  lineHeight: "1.1",
}

const modalidadeLabelStyle: React.CSSProperties = {
  color: "#c5a059",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  fontSize: "0.9rem",
  fontWeight: "600",
}

const sectionStyle: React.CSSProperties = {
  marginBottom: "4rem",
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "1.5rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "10px",
  color: "#111",
}

const bioTextStyle: React.CSSProperties = {
  lineHeight: "1.8",
  whiteSpace: "pre-wrap",
  color: "#444",
  fontSize: "1.1rem",
}

const acervoContainerStyle: React.CSSProperties = {
  marginBottom: "4rem",
  padding: "2rem",
  background: "#fdfdfd",
  border: "1px solid #f0f0f0",
  borderRadius: "12px",
}

const itemsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "2rem",
}

const itemCardStyle: React.CSSProperties = {
  background: "#fff",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  border: "1px solid #f5f5f5",
}

const itemImageStyle: React.CSSProperties = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "6px",
}

const itemDescriptionStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#666",
  marginTop: "0.5rem",
  lineHeight: "1.4",
}

const galleryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "1rem",
}

const galleryItemStyle: React.CSSProperties = {
  display: "block",
  transition: "opacity 0.2s",
}

const galleryImageStyle: React.CSSProperties = {
  width: "100%",
  height: "140px",
  objectFit: "cover",
  borderRadius: "6px",
}
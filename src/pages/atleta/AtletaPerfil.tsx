import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { atletaService } from "@/services/atletaService"
import { itemAcervoService } from "@/services/itemAcervoService"

import { Atleta, Foto } from "@/types/atleta"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

export default function AtletaPerfil() {
  const navigate = useNavigate()

  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [itensAcervo, setItensAcervo] = useState<ItemAcervoResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ==========================
      CARREGAR PERFIL (ME)
     ========================== */
  useEffect(() => {
    async function carregarPerfil() {
      try {
        setLoading(true)

        const dadosAtleta = await atletaService.buscarMeuPerfil()

        if (!dadosAtleta.id) {
          throw new Error("ID da atleta não encontrado")
        }

        const itens = await itemAcervoService.listarPorAtleta(dadosAtleta.id)

        setAtleta({
          ...dadosAtleta,
          fotos: dadosAtleta.fotos ?? [],
        })

        setItensAcervo(itens)
      } catch (err) {
        console.error("Erro ao carregar perfil da atleta:", err)
        setError("Não foi possível carregar seu perfil.")
      } finally {
        setLoading(false)
      }
    }

    carregarPerfil()
  }, [])

  /* ==========================
      ESTADOS (LOADING / ERROR)
     ========================== */
  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#666" }}>
        <p>Carregando seu perfil...</p>
      </div>
    )
  }

  if (error || !atleta) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p style={{ color: "#d93025", marginBottom: "1rem" }}>
          {error || "Perfil não encontrado."}
        </p>
        <button
          onClick={() => navigate("/dashboard/atleta")}
          style={backButtonStyle}
        >
          Voltar ao dashboard
        </button>
      </div>
    )
  }

  const fotos: Foto[] = atleta.fotos ?? []
  const fotoDestaque = fotos.find((f) => f.isDestaque) || fotos[0] || null

  return (
    <div style={containerStyle}>
      <header style={{ marginBottom: "2.5rem" }}>
        <button
          onClick={() => navigate("/dashboard/atleta")}
          style={backButtonStyle}
        >
          ← Voltar ao dashboard
        </button>
      </header>

      <article>
        {/* ===== HEADER DO PERFIL ===== */}
        <section style={headerGridStyle}>
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
        </section>

        {/* ===== BIOGRAFIA ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Minha Biografia</h2>
          <div style={bioTextStyle}>
            {atleta.biografia}
          </div>
        </section>

        {/* ===== MEUS ITENS DE ACERVO ===== */}
        {itensAcervo.length > 0 && (
          <section style={acervoContainerStyle}>
            <h2 style={sectionTitleStyle}>Meus Itens de Acervo</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              Estes são os itens vinculados à sua trajetória esportiva cadastrados no sistema.
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
                  <h4 style={{ marginTop: "1rem", color: "#111" }}>{item.titulo}</h4>
                  <p style={itemDescriptionStyle}>{item.descricao}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== GALERIA ===== */}
        {fotos.length > 1 && (
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Minha Galeria de Imagens</h2>
            <div style={galleryGridStyle}>
              {fotos.map((foto) => (
                <a
                  key={foto.id}
                  href={foto.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "block" }}
                >
                  <img
                    src={foto.url}
                    alt="Imagem do acervo pessoal"
                    style={galleryImageStyle}
                  />
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}

/* =========================
   ESTILOS (CSS-IN-JS)
   ========================= */

const containerStyle: React.CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
}

const backButtonStyle: React.CSSProperties = {
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
  maxWidth: "320px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  objectFit: "cover",
}

const infoContainerStyle: React.CSSProperties = {
  textAlign: "left",
}

const nameStyle: React.CSSProperties = {
  fontSize: "clamp(2rem, 5vw, 2.8rem)",
  marginBottom: "0.5rem",
  color: "#1a1a1a",
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
  color: "#1a1a1a",
}

const bioTextStyle: React.CSSProperties = {
  lineHeight: "1.8",
  whiteSpace: "pre-wrap",
  color: "#444",
  fontSize: "1.05rem",
}

const acervoContainerStyle: React.CSSProperties = {
  marginBottom: "4rem",
  padding: "2rem",
  background: "#f9f9f9",
  borderRadius: "16px",
  border: "1px solid #f0f0f0"
}

const itemsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "1.5rem",
}

const itemCardStyle: React.CSSProperties = {
  background: "#fff",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
}

const itemImageStyle: React.CSSProperties = {
  width: "100%",
  height: "160px",
  objectFit: "cover",
  borderRadius: "6px",
}

const itemDescriptionStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#666",
  marginTop: "0.5rem",
}

const galleryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: "1rem",
}

const galleryImageStyle: React.CSSProperties = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "8px",
}
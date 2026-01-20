import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { modalidadeService } from "@/services/modalidadeService"
import { ModalidadePublicaDTO } from "@/types/modalidade"

export default function ModalidadeDetail() {
  /* ==========================
     CAPTURANDO O SLUG (URL AMIGÁVEL)
     A URL no navegador é /modalidades/natacao
     Capturamos 'natacao' como slug.
     ========================== */
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const [modalidade, setModalidade] = useState<ModalidadePublicaDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Validamos se o slug foi capturado corretamente para evitar erros de busca
    if (!slug) {
      setError("Identificador da modalidade não informado.")
      setLoading(false)
      return
    }

    /* ==========================
       BUSCA PÚBLICA PELO SLUG
       Endpoint: GET /modalidades/slug/{slug}
       ========================== */
    modalidadeService
      .buscarPorSlug(slug)
      .then((data) => {
        setModalidade(data)
      })
      .catch((err) => {
        console.error("Erro ao buscar modalidade:", err)
        setError("Não foi possível carregar os detalhes desta modalidade.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <p>Carregando história e acervo...</p>
    </div>
  )

  if (error || !modalidade) return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <p style={{ color: "#d93025", marginBottom: "1rem" }}>{error}</p>
      <button onClick={() => navigate("/modalidades")} style={backButtonStyle}>
        Voltar para a lista
      </button>
    </div>
  )

  return (
    <main style={containerStyle}>
      <button onClick={() => navigate("/modalidades")} style={backButtonStyle}>
        ← Voltar para modalidades
      </button>

      <article style={articleStyle}>
        <header style={headerStyle}>
          {modalidade.pictogramaUrl && (
            <div style={iconContainerStyle}>
              <img src={modalidade.pictogramaUrl} alt={modalidade.nome} style={iconStyle} />
            </div>
          )}
          <h1 style={titleStyle}>{modalidade.nome}</h1>
        </header>

        <section style={contentSectionStyle}>
          <h2 style={subtitleStyle}>História e Contexto</h2>
          <p style={textStyle}>
            {modalidade.historia || "Nenhuma descrição histórica disponível no momento."}
          </p>
        </section>

        {/* GALERIA DE FOTOS (Alinhado ao Schema FotoAcervo) */}
        {modalidade.fotos && modalidade.fotos.length > 0 && (
          <section style={{ marginTop: "4rem" }}>
            <h2 style={subtitleStyle}>Acervo Fotográfico</h2>
            <div style={galleryGridStyle}>
              {modalidade.fotos.map((foto) => (
                <div key={foto.publicId} style={galleryItemStyle}>
                  <img src={foto.urlVisualizacao} alt={foto.legenda} style={galleryImageStyle} />
                  {foto.legenda && <p style={galleryCaptionStyle}>{foto.legenda}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}

/* =========================
   ESTILOS NECESSÁRIOS
   ========================= */
const galleryGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem", marginTop: "1.5rem" }
const galleryItemStyle: React.CSSProperties = { borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }
const galleryImageStyle: React.CSSProperties = { width: "100%", height: "200px", objectFit: "cover" }
const galleryCaptionStyle: React.CSSProperties = { padding: "1rem", fontSize: "0.9rem", color: "#666", backgroundColor: "#fcfcfc" }
const containerStyle: React.CSSProperties = { maxWidth: "960px", margin: "0 auto", padding: "3rem 2rem" }
const backButtonStyle: React.CSSProperties = { marginBottom: "2rem", cursor: "pointer", backgroundColor: "transparent", border: "1px solid #ddd", padding: "0.5rem 1rem", borderRadius: "4px", fontSize: "0.9rem", color: "#555" }
const articleStyle: React.CSSProperties = { backgroundColor: "#fff", borderRadius: "12px" }
const headerStyle: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "3rem", gap: "1.5rem" }
const iconContainerStyle: React.CSSProperties = { width: "120px", height: "120px", backgroundColor: "#f9f9f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", border: "1px solid #f0f0f0" }
const iconStyle: React.CSSProperties = { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }
const titleStyle: React.CSSProperties = { fontSize: "clamp(2rem, 5vw, 3rem)", color: "#111", margin: 0 }
const contentSectionStyle: React.CSSProperties = { borderTop: "1px solid #eee", paddingTop: "2.5rem" }
const subtitleStyle: React.CSSProperties = { fontSize: "1.5rem", marginBottom: "1.2rem", color: "#111" }
const textStyle: React.CSSProperties = { fontSize: "1.1rem", lineHeight: "1.8", color: "#333", whiteSpace: "pre-wrap" }
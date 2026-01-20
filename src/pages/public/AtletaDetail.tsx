/* =====================================================
   DETALHE DA ATLETA (PÚBLICO)
   Alinhado ao Swagger: GET /atletas/perfil/{slug}
   ===================================================== */

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

export default function AtletaDetail() {
  const { slug } = useParams<{ slug: string }>() 
  const navigate = useNavigate()

  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [itensAcervo, setItensAcervo] = useState<ItemAcervoResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function carregar() {
      try {
        setLoading(true)
        setError(null)

        // CORREÇÃO: Chamada unificada conforme Swagger (Imagem afe015)
        const data = await atletaService.buscarPerfilPublico(slug as string)

        setAtleta(data.atleta)
        setItensAcervo(data.itens)
      } catch (err) {
        console.error("Erro ao carregar perfil público:", err)
        setError("Perfil não encontrado ou temporariamente indisponível.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [slug])

  if (loading) return (
    <div style={{ padding: "5rem", textAlign: "center", color: "#666" }}>
      <p>Carregando história e conquistas...</p>
    </div>
  )

  if (error || !atleta) return (
    <div style={{ padding: "5rem", textAlign: "center" }}>
      <p style={{ color: "#d93025", marginBottom: "1.5rem" }}>{error}</p>
      <button onClick={() => navigate("/atletas")} style={backButtonStyle}>
        Voltar para a Galeria
      </button>
    </div>
  )

  return (
    <main style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>← Voltar</button>
      <article>
        <header style={headerGridStyle}>
          <div style={photoContainerStyle}>
            {atleta.fotoDestaqueUrl ? (
              <img src={atleta.fotoDestaqueUrl} alt={atleta.nome} style={photoStyle} />
            ) : (
              <div style={photoPlaceholderStyle}>Imagem em pesquisa</div>
            )}
          </div>
          <div style={infoContainerStyle}>
            <span style={categoryBadgeStyle}>{atleta.categoria}</span>
            <h1 style={nameStyle}>{atleta.nome}</h1>
          </div>
        </header>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Biografia e Trajetória</h2>
          <div style={bioTextStyle}>{atleta.biografia || "Biografia em fase de pesquisa."}</div>
        </section>

        {itensAcervo.length > 0 && (
          <section style={acervoContainerStyle}>
            <h2 style={sectionTitleStyle}>Itens do Acervo Histórico</h2>
            <div style={itemsGridStyle}>
              {itensAcervo.map((item) => (
                <div key={item.id} style={itemCardStyle}>
                  {item.fotoPrincipalUrl && <img src={item.fotoPrincipalUrl} alt={item.titulo} style={itemImageStyle} />}
                  <div style={{ padding: "1rem" }}>
                    <h4 style={{ margin: "0 0 0.5rem 0" }}>{item.titulo}</h4>
                    <p style={itemDescriptionStyle}>{item.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}

const containerStyle: React.CSSProperties = { padding: "2rem 1.5rem", maxWidth: "1000px", margin: "0 auto" }
const backButtonStyle: React.CSSProperties = { marginBottom: "2rem", cursor: "pointer", backgroundColor: "transparent", border: "1px solid #ddd", padding: "0.5rem 1.2rem", borderRadius: "20px" }
const headerGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", marginBottom: "4rem", alignItems: "center" }
const photoContainerStyle: React.CSSProperties = { textAlign: "center" }
const photoStyle: React.CSSProperties = { width: "100%", maxWidth: "400px", borderRadius: "4px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }
const infoContainerStyle: React.CSSProperties = { textAlign: "left" }
const nameStyle: React.CSSProperties = { fontSize: "clamp(2.5rem, 6vw, 3.5rem)", color: "#1a1a1a", fontWeight: "800" }
const categoryBadgeStyle: React.CSSProperties = { display: "inline-block", backgroundColor: "#f0f0f0", padding: "4px 12px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold" }
const sectionStyle: React.CSSProperties = { marginBottom: "5rem" }
const sectionTitleStyle: React.CSSProperties = { fontSize: "1.25rem", fontWeight: "700", textTransform: "uppercase", borderBottom: "2px solid #1a1a1a", paddingBottom: "5px" }
const bioTextStyle: React.CSSProperties = { lineHeight: "1.9", whiteSpace: "pre-wrap", color: "#333", fontSize: "1.15rem" }
const acervoContainerStyle: React.CSSProperties = { marginBottom: "5rem", padding: "3rem", background: "#f9f9f9", borderRadius: "16px" }
const itemsGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2.5rem" }
const itemCardStyle: React.CSSProperties = { background: "#fff", borderRadius: "8px", overflow: "hidden" }
const itemImageStyle: React.CSSProperties = { width: "100%", height: "250px", objectFit: "cover" }
const itemDescriptionStyle: React.CSSProperties = { fontSize: "0.9rem", color: "#666" }
const photoPlaceholderStyle: React.CSSProperties = { width: "100%", height: "400px", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }
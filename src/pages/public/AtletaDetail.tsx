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
    return <p style={{ padding: "2rem" }}>Carregando perfil e acervo...</p>
  }

  if (error || !atleta) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>
          {error || "Atleta não encontrada."}
        </p>
        <button onClick={() => navigate("/atletas")}>
          Voltar para a lista
        </button>
      </div>
    )
  }

  /* ==========================
     FOTO DE DESTAQUE
     ========================== */
  const fotos: Foto[] = atleta.fotos ?? []

  const fotoDestaque =
    fotos.find((f) => f.isDestaque) || fotos[0] || null

  /* ==========================
     RENDER
     ========================== */
  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "2rem", cursor: "pointer" }}
      >
        ← Voltar
      </button>

      <article>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            {fotoDestaque && (
              <img
                src={fotoDestaque.url}
                alt={atleta.nome}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
            )}
          </div>

          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              {atleta.nome}
            </h1>

            {atleta.modalidades.length > 0 && (
              <h3
                style={{
                  color: "#c5a059",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {atleta.modalidades.join(" · ")}
              </h3>
            )}
          </div>
        </header>

        {/* ===== BIOGRAFIA ===== */}
        <section style={{ marginBottom: "3rem" }}>
          <h2>Biografia e Trajetória</h2>
          <div
            style={{
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              marginTop: "1rem",
            }}
          >
            {atleta.biografia}
          </div>
        </section>

        {/* ===== ITENS DO ACERVO ===== */}
        {itensAcervo.length > 0 && (
          <section
            style={{
              marginBottom: "3rem",
              padding: "1.5rem",
              background: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <h2>Itens do Acervo Histórico</h2>
            <p>
              Objetos, medalhas e documentos que fazem parte da história
              desta atleta.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginTop: "1.5rem",
              }}
            >
              {itensAcervo.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#fff",
                    padding: "1rem",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  {item.fotoPrincipalUrl && (
                    <img
                      src={item.fotoPrincipalUrl}
                      alt={item.titulo}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}

                  <h4 style={{ marginTop: "1rem" }}>
                    {item.titulo}
                  </h4>

                  <p style={{ fontSize: "0.9rem", color: "#666" }}>
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== GALERIA ===== */}
        {fotos.length > 1 && (
          <section>
            <h2>Galeria de Imagens</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              {fotos.map((foto) => (
                <a
                  key={foto.id}
                  href={foto.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={foto.url}
                    alt="Acervo fotográfico"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
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

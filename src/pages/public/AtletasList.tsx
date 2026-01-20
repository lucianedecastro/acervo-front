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
        setError("Não foi possível carregar o acervo de atletas.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p style={{ padding: "2rem" }}>Carregando acervo de atletas...</p>
  }

  if (error) {
    return (
      <p style={{ padding: "2rem", color: "red" }}>
        {error}
      </p>
    )
  }

  if (atletas.length === 0) {
    return (
      <p style={{ padding: "2rem" }}>
        Nenhuma atleta cadastrada no momento.
      </p>
    )
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>Atletas</h1>
      <p>
        Conheça as trajetórias das mulheres que transformaram o esporte brasileiro.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {atletas.map((atleta) => {
          const fotoDestaque =
            atleta.fotos?.find((f) => f.isDestaque)?.url ||
            atleta.fotos?.[0]?.url

          return (
            <article
              key={atleta.id}
              onClick={() => navigate(`/atletas/${atleta.id}`)}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                cursor: "pointer",
                textAlign: "center",
                borderRadius: "6px",
              }}
            >
              {fotoDestaque ? (
                <img
                  src={fotoDestaque}
                  alt={`Foto de ${atleta.nome}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    background: "#eee",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                    fontSize: "0.9rem",
                  }}
                >
                  Sem imagem
                </div>
              )}

              <strong style={{ display: "block" }}>
                {atleta.nome}
              </strong>

              {atleta.modalidades?.length > 0 && (
                <small style={{ color: "#666" }}>
                  {atleta.modalidades.join(", ")}
                </small>
              )}
            </article>
          )
        })}
      </div>
    </main>
  )
}

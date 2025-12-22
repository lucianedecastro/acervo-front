import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { atletaService } from "@/services/atletaService"
import { Atleta } from "@/types/atleta"

export default function AtletasList() {
  const navigate = useNavigate()
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    atletaService.listarTodas()
      .then(setAtletas)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando acervo de atletas...</p>

  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>Atletas</h1>
      <p>Conheça as trajetórias das mulheres que transformaram o esporte brasileiro.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
        {atletas.map(atleta => (
          <div 
            key={atleta.id} 
            onClick={() => navigate(`/atletas/${atleta.id}`)}
            style={{ 
              border: "1px solid #ddd", 
              padding: "1rem", 
              cursor: "pointer",
              textAlign: "center" 
            }}
          >
            {/* Exibe a foto marcada como destaque ou a primeira da lista */}
            <img 
              src={atleta.fotos.find(f => f.isDestaque)?.url || (atleta.fotos[0]?.url)} 
              alt={atleta.nome} 
              style={{ width: "100%", height: "200px", objectFit: "cover", marginBottom: "1rem" }}
            />
            <strong style={{ display: "block" }}>{atleta.nome}</strong>
            <small style={{ color: "#666" }}>{atleta.modalidade}</small>
          </div>
        ))}
      </div>
    </main>
  )
}
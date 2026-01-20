import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { atletaService } from "@/services/atletaService"
import { itemAcervoService } from "@/services/itemAcervoService"

import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

export default function AtletaPerfil() {
  const navigate = useNavigate()

  // Usamos 'any' para o estado inicial para acomodar a riqueza de campos do Swagger sem quebras de tipo imediatas
  const [atleta, setAtleta] = useState<any | null>(null)
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
        setError(null)

        // Busca os dados da atleta logada (Endpoint /atletas/me do Swagger)
        const dadosAtleta = await atletaService.buscarMeuPerfil()

        if (!dadosAtleta || !dadosAtleta.id) {
          throw new Error("Identificação da atleta não encontrada.")
        }

        // Busca itens do acervo vinculados a esta atleta
        const itens = await itemAcervoService.listarPorAtleta(dadosAtleta.id)

        setAtleta(dadosAtleta)
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
        <p>Sincronizando seus dados...</p>
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
            {/* Alinhado ao campo 'fotoDestaqueUrl' do Swagger */}
            {atleta.fotoDestaqueUrl ? (
              <img
                src={atleta.fotoDestaqueUrl}
                alt={atleta.nome}
                style={photoStyle}
              />
            ) : (
              <div style={placeholderPhotoStyle}>
                Sem Foto
              </div>
            )}
          </div>

          <div style={infoContainerStyle}>
            <h1 style={nameStyle}>{atleta.nome}</h1>
            <p style={{ color: "#666", marginBottom: "1rem" }}>{atleta.email}</p>
            
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span style={badgeStyle}>{atleta.categoria}</span>
              <span style={{ ...badgeStyle, backgroundColor: atleta.statusVerificacao === 'VERIFICADO' ? '#e6fffa' : '#fffaf0', color: atleta.statusVerificacao === 'VERIFICADO' ? '#2c7a7b' : '#9c4221' }}>
                {atleta.statusVerificacao}
              </span>
            </div>
          </div>
        </section>

        {/* ===== BIOGRAFIA ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Minha Biografia</h2>
          <div style={bioTextStyle}>
            {atleta.biografia || "Nenhuma biografia cadastrada até o momento."}
          </div>
        </section>

        {/* ===== DADOS DE PAGAMENTO (PRIVADO) ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Dados para Repasse Financeiro</h2>
          <div style={infoBoxStyle}>
            <p><strong>Banco:</strong> {atleta.banco || "Não informado"}</p>
            <p><strong>Agência:</strong> {atleta.agencia || "-"} | <strong>Conta:</strong> {atleta.conta || "-"}</p>
            <p><strong>Chave PIX ({atleta.tipoChavePix}):</strong> {atleta.chavePix || "Não informada"}</p>
            <p><strong>Status do Contrato:</strong> {atleta.contratoAssinado ? "✅ Assinado" : "❌ Pendente"}</p>
          </div>
        </section>

        {/* ===== MEUS ITENS DE ACERVO ===== */}
        {itensAcervo.length > 0 && (
          <section style={acervoContainerStyle}>
            <h2 style={sectionTitleStyle}>Meus Itens de Acervo</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              Itens vinculados à sua trajetória e disponíveis para licenciamento.
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
  maxWidth: "280px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  objectFit: "cover",
}

const placeholderPhotoStyle: React.CSSProperties = {
  width: "280px",
  height: "280px",
  backgroundColor: "#eee",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#999",
  margin: "0 auto"
}

const infoContainerStyle: React.CSSProperties = {
  textAlign: "left",
}

const nameStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  marginBottom: "0.5rem",
  color: "#1a1a1a",
}

const badgeStyle: React.CSSProperties = {
  backgroundColor: "#f0f0f0",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "0.8rem",
  fontWeight: "bold",
  color: "#555",
  textTransform: "uppercase"
}

const sectionStyle: React.CSSProperties = {
  marginBottom: "4rem",
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.4rem",
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

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  lineHeight: "2",
  color: "#4a5568"
}

const acervoContainerStyle: React.CSSProperties = {
  marginBottom: "4rem",
  padding: "2rem",
  background: "#f8fafc",
  borderRadius: "16px",
  border: "1px solid #edf2f7"
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
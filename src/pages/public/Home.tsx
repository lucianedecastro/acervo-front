import { Link } from "react-router-dom"

export default function Home() {
  return (
    <main style={mainContainerStyle}>
      {/* =========================
          HERO / APRESENTAÇÃO
          ========================= */}
      <header style={{ marginBottom: "4rem", textAlign: "center" }}>
        <h1 style={titleStyle}>
          Acervo “Carmen Lydia” da Mulher Brasileira no Esporte
        </h1>

        <p style={descriptionStyle}>
          Plataforma digital dedicada à preservação, pesquisa e valorização dos
          acervos pessoais de atletas brasileiras, reconhecendo sua
          titularidade sobre a memória produzida a partir de suas trajetórias
          esportivas.
        </p>
      </header>

      {/* =========================
          O QUE É O ACERVO
          ========================= */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>O que é este acervo?</h2>
        <p style={pStyle}>
          O Acervo “Carmen Lydia” é um espaço institucional onde atletas podem
          reunir, organizar e preservar seus próprios registros históricos —
          imagens, documentos, objetos e narrativas — de forma estruturada,
          segura e sob sua própria governança.
        </p>
        <p style={pStyle}>
          A memória esportiva é tratada aqui como patrimônio cultural vivo,
          carregado de valor simbólico, histórico e social, produzido pelas
          próprias atletas ao longo de suas trajetórias.
        </p>
      </section>

      {/* =========================
          PRESERVAÇÃO E JUSTIÇA
          ========================= */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Preservação e justiça histórica</h2>
        <p style={pStyle}>
          Historicamente, imagens e registros de atletas mulheres circularam
          amplamente sem reconhecimento ou controle. Este projeto propõe que 
          as atletas sejam as titulares legítimas de seus acervos, decidindo as 
          condições de uso de seus materiais.
        </p>
      </section>

      {/* =========================
          GRID DE NAVEGAÇÃO
          ========================= */}
      <section style={gridStyle}>
        <Link to="/atletas" style={cardStyle}>
          <h3 style={cardTitleStyle}>Atletas</h3>
          <p style={cardTextStyle}>
            Conheça as trajetórias e os acervos que compõem a memória do esporte.
          </p>
        </Link>

        <Link to="/modalidades" style={cardStyle}>
          <h3 style={cardTitleStyle}>Modalidades</h3>
          <p style={cardTextStyle}>
            Explore as modalidades esportivas e seus contextos históricos.
          </p>
        </Link>

        <Link to="/sobre" style={cardStyle}>
          <h3 style={cardTitleStyle}>Sobre o Acervo</h3>
          <p style={cardTextStyle}>
            Conheça o propósito e os princípios éticos do projeto.
          </p>
        </Link>

        <Link to="/arquitetura" style={cardStyle}>
          <h3 style={cardTitleStyle}>Arquitetura</h3>
          <p style={cardTextStyle}>
            Entenda a estrutura técnica e institucional da plataforma.
          </p>
        </Link>
      </section>
    </main>
  )
}

/* =========================
   ESTILOS (CSS-IN-JS)
   ========================= */

const mainContainerStyle: React.CSSProperties = {
  padding: "3rem 1.5rem",
  maxWidth: "960px",
  margin: "0 auto",
}

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
  marginBottom: "1.5rem",
  lineHeight: "1.2",
  color: "#111",
}

const descriptionStyle: React.CSSProperties = {
  fontSize: "1.15rem",
  lineHeight: "1.6",
  color: "#555",
  maxWidth: "800px",
  margin: "0 auto",
}

const sectionStyle: React.CSSProperties = {
  marginBottom: "4rem",
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "1rem",
  borderBottom: "2px solid #111",
  display: "inline-block",
  paddingBottom: "4px",
}

const pStyle: React.CSSProperties = {
  lineHeight: "1.7",
  marginTop: "1rem",
  color: "#333",
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  marginTop: "2rem",
}

const cardStyle: React.CSSProperties = {
  padding: "1.5rem",
  border: "1px solid #eee",
  borderRadius: "12px",
  textDecoration: "none",
  color: "inherit",
  transition: "all 0.2s ease-in-out",
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  marginBottom: "0.5rem",
  color: "#111",
}

const cardTextStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#666",
  lineHeight: "1.4",
}
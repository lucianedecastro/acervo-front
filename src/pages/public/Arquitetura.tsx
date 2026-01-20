import React from "react"

export default function Arquitetura() {
  return (
    <main style={containerStyle}>
      <h1 style={titleStyle}>Arquitetura da Plataforma</h1>

      <section style={sectionStyle}>
        <p style={pStyle}>
          A arquitetura do Acervo “Carmen Lydia” da Mulher Brasileira no Esporte
          foi concebida com foco em robustez, escalabilidade, segurança e
          transparência, atendendo tanto às necessidades de pesquisa quanto às
          exigências de governança dos acervos digitais.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subtitleStyle}>Visão Geral</h2>
        <p style={pStyle}>
          A plataforma está organizada em três camadas principais de acesso:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <strong>Público:</strong> consulta ao acervo, perfis de atletas,
            modalidades e itens publicados.
          </li>
          <li style={liStyle}>
            <strong>Atleta:</strong> gestão do próprio perfil, visualização do
            acervo pessoal e acompanhamento de dados financeiros.
          </li>
          <li style={liStyle}>
            <strong>Administração:</strong> curadoria, gestão de atletas,
            modalidades e controle institucional da plataforma.
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={subtitleStyle}>Frontend</h2>
        <p style={pStyle}>
          O frontend foi desenvolvido como uma aplicação de página única (SPA),
          utilizando tecnologias modernas que garantem desempenho, tipagem forte
          e manutenibilidade:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>React com TypeScript</li>
          <li style={liStyle}>Vite como bundler</li>
          <li style={liStyle}>React Router para navegação</li>
          <li style={liStyle}>Arquitetura modular por domínio</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={subtitleStyle}>Backend</h2>
        <p style={pStyle}>
          O backend é estruturado como uma API reativa, documentada e segura:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>Spring WebFlux</li>
          <li style={liStyle}>API REST documentada via Swagger</li>
          <li style={liStyle}>Autenticação e autorização com JWT</li>
          <li style={liStyle}>Controle de acesso por papéis (Admin e Atleta)</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={subtitleStyle}>Segurança e Governança</h2>
        <p style={pStyle}>
          O sistema adota práticas de segurança alinhadas a ambientes de
          produção, garantindo separação clara de responsabilidades, proteção de
          dados sensíveis e controle rigoroso de acesso aos recursos.
        </p>
        <p style={pStyle}>
          A governança dos dados respeita a titularidade das atletas sobre seus
          acervos pessoais, assegurando que decisões sobre publicação,
          licenciamento e uso dos materiais sejam sempre orientadas pela
          autonomia das detentoras dos direitos.
        </p>
      </section>
    </main>
  )
}

/* =========================
   ESTILOS (CSS-IN-JS)
   ========================= */

const containerStyle: React.CSSProperties = {
  maxWidth: "960px",
  margin: "0 auto",
  padding: "3rem 2rem",
  lineHeight: "1.7",
}

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
  marginBottom: "2.5rem",
  color: "#111",
  lineHeight: "1.2",
}

const subtitleStyle: React.CSSProperties = {
  fontSize: "1.6rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  color: "#222",
  borderBottom: "1px solid #eee",
  paddingBottom: "8px",
}

const sectionStyle: React.CSSProperties = {
  marginBottom: "2.5rem",
}

const pStyle: React.CSSProperties = {
  marginBottom: "1rem",
  color: "#333",
  fontSize: "1.05rem",
}

const ulStyle: React.CSSProperties = {
  marginTop: "0.5rem",
  paddingLeft: "1.5rem",
}

const liStyle: React.CSSProperties = {
  marginBottom: "0.5rem",
  color: "#444",
}
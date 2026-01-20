import React from "react"

export default function Sobre() {
  return (
    <main style={containerStyle}>
      <h1 style={titleStyle}>
        Sobre o Acervo “Carmen Lydia” da Mulher Brasileira no Esporte
      </h1>

      <section style={sectionStyle}>
        <p style={pStyle}>
          O <strong>Acervo “Carmen Lydia” da Mulher Brasileira no Esporte</strong>{" "}
          é uma plataforma digital dedicada à preservação, pesquisa e valorização
          dos acervos pessoais de atletas brasileiras, com especial atenção às
          trajetórias pioneiras historicamente invisibilizadas no esporte
          nacional.
        </p>

        <p style={pStyle}>
          O projeto nasce da compreensão de que a memória esportiva não é apenas
          um conjunto de registros históricos, mas um patrimônio cultural,
          simbólico e afetivo, produzido pelas próprias atletas ao longo de suas
          trajetórias.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subtitleStyle}>Propósito</h2>
        <p style={pStyle}>
          O diferencial central do acervo está na proposição de um modelo que
          articula preservação da memória e justa remuneração. Ao contrário de
          bancos de imagens tradicionais — nos quais os direitos econômicos
          recaem majoritariamente sobre fotógrafos ou veículos de mídia — esta
          iniciativa reconhece as atletas como titulares legítimas da memória
          produida a partir de suas próprias trajetórias.
        </p>

        <p style={pStyle}>
          As atletas participantes mantêm autonomia sobre seus acervos pessoais,
          podendo decidir se, como e em quais condições seus materiais poderão
          ser disponibilizados para pesquisa, uso institucional ou licenciamento
          comercial, sempre com retorno financeiro direto às detentoras dos
          direitos.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subtitleStyle}>Pesquisa e Memória</h2>
        <p style={pStyle}>
          A plataforma foi concebida para atender pesquisadoras e pesquisadores,
          jornistas, estudantes, produtoras culturais e instituições
          acadêmicas, oferecendo um ambiente estruturado para consulta, análise
          e contextualização da memória esportiva feminina no Brasil.
        </p>

        <p style={pStyle}>
          O acervo organiza informações por atleta, modalidade e item histórico,
          promovendo rastreabilidade, curadoria responsável e respeito aos
          contextos históricos e sociais nos quais esses materiais foram
          produzidos.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={subtitleStyle}>Compromissos Éticos</h2>
        <p style={pStyle}>
          O Acervo “Carmen Lydia” é orientado por princípios de justiça histórica,
          sustentabilidade cultural, transparência e respeito à autonomia das
          atletas, rejeitando modelos predatórios de exploração da memória
          esportiva.
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
  marginBottom: "1.2rem",
  color: "#333",
  fontSize: "1.05rem",
}
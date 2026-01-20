import { Link } from "react-router-dom"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <main style={{ padding: "3rem", maxWidth: "960px", margin: "0 auto" }}>
        {/* =========================
            HERO / APRESENTAÇÃO
           ========================= */}
        <header style={{ marginBottom: "3.5rem" }}>
          <h1 style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>
            Acervo “Carmen Lydia” da Mulher Brasileira no Esporte
          </h1>

          <p style={{ fontSize: "1.15rem", lineHeight: "1.7", color: "#444" }}>
            Plataforma digital dedicada à preservação, pesquisa e valorização dos
            acervos pessoais de atletas brasileiras, reconhecendo sua
            titularidade sobre a memória produzida a partir de suas trajetórias
            esportivas.
          </p>

          {/* ===== CTA LOGIN ===== */}
          <div style={{ marginTop: "2rem" }}>
            <Link
              to="/login"
              style={{
                display: "inline-block",
                padding: "0.9rem 1.6rem",
                backgroundColor: "#111",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              Acessar área restrita (Login)
            </Link>

            <p
              style={{
                marginTop: "0.8rem",
                fontSize: "0.85rem",
                color: "#666",
              }}
            >
              * O acesso é restrito a atletas e administradores previamente
              cadastrados.
            </p>
          </div>
        </header>

        {/* =========================
            O QUE É O ACERVO
           ========================= */}
        <section style={{ marginBottom: "3rem" }}>
          <h2>O que é este acervo?</h2>

          <p style={{ lineHeight: "1.7", marginTop: "1rem" }}>
            O Acervo “Carmen Lydia” é um espaço institucional onde atletas podem
            reunir, organizar e preservar seus próprios registros históricos —
            imagens, documentos, objetos e narrativas — de forma estruturada,
            segura e sob sua própria governança.
          </p>

          <p style={{ lineHeight: "1.7", marginTop: "1rem" }}>
            A memória esportiva é tratada aqui como patrimônio cultural vivo,
            carregado de valor simbólico, histórico e social, produzido pelas
            próprias atletas ao longo de suas trajetórias.
          </p>
        </section>

        {/* =========================
            PRESERVAÇÃO E JUSTIÇA
           ========================= */}
        <section style={{ marginBottom: "3rem" }}>
          <h2>Preservação associada à justiça histórica</h2>

          <p style={{ lineHeight: "1.7", marginTop: "1rem" }}>
            Historicamente, imagens e registros de atletas mulheres circularam
            amplamente sem reconhecimento, controle ou retorno financeiro às suas
            protagonistas.
          </p>

          <p style={{ lineHeight: "1.7", marginTop: "1rem" }}>
            Este projeto propõe um modelo alternativo: as atletas são
            reconhecidas como titulares legítimas de seus acervos pessoais,
            podendo decidir se, como e em quais condições seus materiais poderão
            ser utilizados para fins editoriais, educativos, culturais ou
            institucionais.
          </p>
        </section>

        {/* =========================
            COMO FUNCIONA
           ========================= */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2>Como funciona</h2>

          <ul
            style={{
              marginTop: "1.5rem",
              lineHeight: "1.8",
              paddingLeft: "1.2rem",
            }}
          >
            <li>
              As atletas organizam seus acervos pessoais em perfis estruturados.
            </li>
            <li>
              Cada item reúne imagens, metadados históricos e contexto esportivo.
            </li>
            <li>
              Os materiais podem ser mantidos em rascunho ou publicados para
              consulta pública.
            </li>
            <li>
              O uso dos acervos ocorre por meio de licenciamento ético e
              transparente.
            </li>
            <li>
              O retorno financeiro, quando existente, é direcionado às
              detentoras dos direitos.
            </li>
          </ul>
        </section>

        {/* =========================
            NAVEGAÇÃO INSTITUCIONAL
           ========================= */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2rem",
          }}
        >
          <Link to="/atletas" style={cardStyle}>
            <h3>Atletas</h3>
            <p>
              Conheça as atletas, suas trajetórias e os acervos que compõem a
              memória do esporte brasileiro.
            </p>
          </Link>

          <Link to="/modalidades" style={cardStyle}>
            <h3>Modalidades</h3>
            <p>
              Explore as modalidades esportivas presentes no acervo e seus
              contextos históricos.
            </p>
          </Link>

          <Link to="/sobre" style={cardStyle}>
            <h3>Sobre o Acervo</h3>
            <p>
              Conheça o propósito, os princípios éticos e a concepção do
              projeto.
            </p>
          </Link>

          <Link to="/arquitetura" style={cardStyle}>
            <h3>Arquitetura da Plataforma</h3>
            <p>
              Entenda como o projeto foi estruturado do ponto de vista técnico
              e institucional.
            </p>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  )
}

const cardStyle = {
  padding: "1.5rem",
  border: "1px solid #ddd",
  borderRadius: "8px",
  textDecoration: "none",
  color: "inherit",
}

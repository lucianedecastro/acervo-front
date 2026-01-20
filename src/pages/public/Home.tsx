import { Link } from "react-router-dom"

export default function Home() {
  return (
    <main style={{ padding: "3rem", maxWidth: "960px", margin: "0 auto" }}>
      {/* =========================
          HERO / APRESENTAÇÃO
         ========================= */}
      <header style={{ marginBottom: "3.5rem" }}>
        <h1 style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>
          Carmen Lydia da Mulher Brasileira no Esporte
        </h1>

        <p style={{ fontSize: "1.15rem", lineHeight: "1.7", color: "#444" }}>
          Uma plataforma de preservação, gestão e licenciamento ético de acervos
          pessoais de atletas mulheres do esporte brasileiro.
        </p>
      </header>

      {/* =========================
          O QUE É O ACERVO
         ========================= */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>O que é este acervo?</h2>

        <p style={{ lineHeight: "1.7", marginTop: "1rem" }}>
          Este acervo é um espaço onde atletas podem reunir, organizar e preservar
          seus próprios registros históricos — imagens, documentos, objetos e
          memórias — de forma segura, estruturada e sob sua própria governança.
        </p>

        <p style={{ lineHeight: "1.7", marginTop: "1rem" }}>
          Diferente de plataformas apenas expositivas, aqui o acervo é entendido
          como patrimônio cultural vivo, com valor simbólico, histórico e também
          econômico.
        </p>
      </section>

      {/* =========================
          JUSTIÇA FINANCEIRA
         ========================= */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Preservação com justiça financeira</h2>

        <p style={{ lineHeight: "1.7", marginTop: "1rem" }}>
          A plataforma foi pensada para enfrentar um problema histórico:
          atletas mulheres tiveram suas imagens amplamente utilizadas ao longo
          do tempo, sem reconhecimento, controle ou remuneração.
        </p>

        <p style={{ lineHeight: "1.7", marginTop: "1rem" }}>
          Aqui, as atletas mantêm a titularidade de seus acervos e podem autorizar
          usos específicos — editoriais, educativos, culturais ou institucionais —
          com retorno financeiro direto, transparente e ético.
        </p>
      </section>

      {/* =========================
          COMO FUNCIONA
         ========================= */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2>Como funciona</h2>

        <ul style={{ marginTop: "1.5rem", lineHeight: "1.8", paddingLeft: "1.2rem" }}>
          <li>
            As atletas cadastram seus acervos pessoais de forma estruturada.
          </li>
          <li>
            Cada item pode conter imagens, metadados históricos e contexto esportivo.
          </li>
          <li>
            Os itens podem ser publicados para consulta pública ou mantidos em
            rascunho.
          </li>
          <li>
            O uso de imagens e materiais ocorre por meio de licenciamento, respeitando
            critérios éticos e direitos autorais.
          </li>
          <li>
            Parte do valor gerado retorna diretamente às atletas.
          </li>
        </ul>
      </section>

      {/* =========================
          NAVEGAÇÃO PRINCIPAL
         ========================= */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "2rem",
        }}
      >
        <Link
          to="/atletas"
          style={{
            padding: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <h3>Atletas</h3>
          <p>
            Conheça as atletas, suas trajetórias e os acervos que constroem a
            memória do esporte brasileiro.
          </p>
        </Link>

        <Link
          to="/modalidades"
          style={{
            padding: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <h3>Modalidades</h3>
          <p>
            Explore as modalidades esportivas presentes no acervo e seus
            contextos históricos.
          </p>
        </Link>
      </section>

      {/* =========================
          RODAPÉ CONCEITUAL
         ========================= */}
      <footer
        style={{
              marginTop: "4rem",
              paddingTop: "2rem",
              borderTop: "1px solid #eee",
              color: "#777",
              fontSize: "0.9rem",
        }}
>
        <p>
          Projeto interdisciplinar voltado à preservação cultural, memória esportiva,
          sustentabilidade e justiça econômica no esporte.
        </p>

        <p style={{ marginTop: "1rem" }}>
          Desenvolvido por <strong>Luciane de Castro</strong><br />
          Registro no INPI: <strong>BR512025005170-0</strong>
        </p>
      </footer>
    </main>
  )
}

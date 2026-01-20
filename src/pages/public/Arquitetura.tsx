import Footer from "@/components/Footer"

export default function Arquitetura() {
  return (
    <>
      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "3rem 2rem",
          lineHeight: "1.7",
        }}
      >
        <h1 style={{ marginBottom: "2rem" }}>
          Arquitetura da Plataforma
        </h1>

        <p>
          A arquitetura do Acervo “Carmen Lydia” da Mulher Brasileira no Esporte
          foi concebida com foco em robustez, escalabilidade, segurança e
          transparência, atendendo tanto às necessidades de pesquisa quanto às
          exigências de governança dos acervos digitais.
        </p>

        <h2 style={{ marginTop: "2.5rem" }}>Visão Geral</h2>

        <p>
          A plataforma está organizada em três camadas principais de acesso:
        </p>

        <ul>
          <li>
            <strong>Público:</strong> consulta ao acervo, perfis de atletas,
            modalidades e itens publicados.
          </li>
          <li>
            <strong>Atleta:</strong> gestão do próprio perfil, visualização do
            acervo pessoal e acompanhamento de dados financeiros.
          </li>
          <li>
            <strong>Administração:</strong> curadoria, gestão de atletas,
            modalidades e controle institucional da plataforma.
          </li>
        </ul>

        <h2 style={{ marginTop: "2.5rem" }}>Frontend</h2>

        <p>
          O frontend foi desenvolvido como uma aplicação de página única (SPA),
          utilizando tecnologias modernas que garantem desempenho, tipagem forte
          e manutenibilidade:
        </p>

        <ul>
          <li>React com TypeScript</li>
          <li>Vite como bundler</li>
          <li>React Router para navegação</li>
          <li>Arquitetura modular por domínio</li>
        </ul>

        <h2 style={{ marginTop: "2.5rem" }}>Backend</h2>

        <p>
          O backend é estruturado como uma API reativa, documentada e segura:
        </p>

        <ul>
          <li>Spring WebFlux</li>
          <li>API REST documentada via Swagger</li>
          <li>Autenticação e autorização com JWT</li>
          <li>Controle de acesso por papéis (Admin e Atleta)</li>
        </ul>

        <h2 style={{ marginTop: "2.5rem" }}>Segurança e Governança</h2>

        <p>
          O sistema adota práticas de segurança alinhadas a ambientes de
          produção, garantindo separação clara de responsabilidades, proteção de
          dados sensíveis e controle rigoroso de acesso aos recursos.
        </p>

        <p>
          A governança dos dados respeita a titularidade das atletas sobre seus
          acervos pessoais, assegurando que decisões sobre publicação,
          licenciamento e uso dos materiais sejam sempre orientadas pela
          autonomia das detentoras dos direitos.
        </p>
      </main>

      <Footer />
    </>
  )
}

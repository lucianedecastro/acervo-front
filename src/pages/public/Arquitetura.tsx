export default function Arquitetura() {
  return (
    <main className="bg-acl-cream min-h-screen">

      {/* Hero */}
      <section className="bg-acl-ink py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow text-acl-gold mb-5">Estrutura técnica</p>
          <h1 className="font-serif text-3xl md:text-5xl text-acl-cream mb-6">
            Arquitetura da plataforma
          </h1>
          <p className="text-acl-cream/70 leading-relaxed max-w-2xl">
            A arquitetura do Acervo "Carmen Lydia" da Mulher Brasileira no Esporte
            foi concebida com foco em robustez, escalabilidade, segurança e transparência,
            atendendo tanto às necessidades de pesquisa quanto às exigências de governança
            dos acervos digitais.
          </p>
        </div>
      </section>

      {/* Visão Geral */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-3">Visão geral</h2>
          <div className="w-12 h-px bg-acl-gold-deep mb-10" />

          <p className="text-acl-ink-soft mb-8 leading-relaxed">
            A plataforma está organizada em três camadas principais de acesso:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card-editorial p-6">
              <h3 className="font-serif text-base text-acl-ink mb-2">Público</h3>
              <p className="text-sm text-acl-muted leading-relaxed">
                Consulta ao acervo, perfis de atletas, modalidades e itens publicados.
              </p>
            </div>

            <div className="card-editorial p-6">
              <h3 className="font-serif text-base text-acl-ink mb-2">Atleta</h3>
              <p className="text-sm text-acl-muted leading-relaxed">
                Gestão do próprio perfil, visualização do acervo pessoal e acompanhamento de dados financeiros.
              </p>
            </div>

            <div className="bg-acl-ink p-6 rounded">
              <h3 className="font-serif text-base text-acl-gold mb-2">Administração</h3>
              <p className="text-sm text-acl-cream/70 leading-relaxed">
                Curadoria, gestão de atletas, modalidades e controle institucional da plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frontend */}
      <section className="py-16 px-6 bg-white border-t border-acl-line">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-3">Frontend</h2>
          <div className="w-12 h-px bg-acl-gold-deep mb-8" />

          <p className="text-acl-ink-soft mb-8 leading-relaxed">
            O frontend foi desenvolvido como uma aplicação de página única (SPA),
            utilizando tecnologias modernas que garantem desempenho, tipagem forte e manutenibilidade:
          </p>

          <ul className="space-y-3">
            {[
              "React com TypeScript",
              "Vite como bundler",
              "React Router para navegação",
              "Arquitetura modular por domínio",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-acl-gold-deep mt-2 flex-shrink-0" />
                <span className="text-sm text-acl-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Backend */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-3">Backend</h2>
          <div className="w-12 h-px bg-acl-gold-deep mb-8" />

          <p className="text-acl-ink-soft mb-8 leading-relaxed">
            O backend é estruturado como uma API reativa, documentada e segura:
          </p>

          <ul className="space-y-3">
            {[
              "Spring WebFlux",
              "API REST documentada via Swagger",
              "Autenticação e autorização com JWT",
              "Controle de acesso por papéis (Admin e Atleta)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-acl-ink-soft mt-2 flex-shrink-0" />
                <span className="text-sm text-acl-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Segurança e Governança */}
      <section className="py-16 px-6 bg-acl-ink">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-acl-gold mb-3">Segurança e governança</h2>
          <div className="w-12 h-px bg-acl-gold mb-8" />

          <p className="text-acl-cream/70 leading-relaxed mb-5">
            O sistema adota práticas de segurança alinhadas a ambientes de produção,
            garantindo separação clara de responsabilidades, proteção de dados sensíveis
            e controle rigoroso de acesso aos recursos.
          </p>

          <p className="text-acl-cream/70 leading-relaxed">
            A governança dos dados respeita a titularidade das atletas sobre seus acervos pessoais,
            assegurando que decisões sobre publicação, licenciamento e uso dos materiais sejam sempre
            orientadas pela autonomia das detentoras dos direitos.
          </p>
        </div>
      </section>

    </main>
  )
}
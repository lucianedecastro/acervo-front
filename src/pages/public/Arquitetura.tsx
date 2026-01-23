export default function Arquitetura() {
  return (
    <main className="bg-white min-h-screen">

      {/* Hero Section - Neobrutalist */}
      <section className="bg-black text-white py-20 px-6 border-b-6 border-[#D4A244]">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block mb-6 px-6 py-2 border-4 border-[#D4A244] rounded-md text-[#D4A244] font-black text-xs tracking-[0.3em] uppercase shadow-[4px_4px_0px_0px_rgba(212,162,68,1)]">
            Estrutura Técnica
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6 text-white">
            Arquitetura da Plataforma
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl font-medium">
            A arquitetura do Acervo "Carmen Lydia" da Mulher Brasileira no Esporte
            foi concebida com foco em robustez, escalabilidade, segurança e transparência,
            atendendo tanto às necessidades de pesquisa quanto às exigências de governança
            dos acervos digitais.
          </p>
        </div>
      </section>

      {/* Visão Geral - Cards Neobrutalist COM BORDAS ARREDONDADAS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight">
            Visão Geral
          </h2>
          <div className="w-24 h-2 bg-[#D4A244] mb-12 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>

          <p className="text-lg text-gray-700 mb-10 leading-relaxed font-medium">
            A plataforma está organizada em três camadas principais de acesso:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Público */}
            <div className="bg-white border-6 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-12 h-12 bg-[#D4A244] border-4 border-black rounded-lg mb-4"></div>
              <h3 className="text-xl font-black uppercase mb-3 tracking-tight">Público</h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                Consulta ao acervo, perfis de atletas, modalidades e itens publicados.
              </p>
            </div>

            {/* Card 2 - Atleta */}
            <div className="bg-[#D4A244] border-6 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-12 h-12 bg-black border-4 border-black rounded-lg mb-4"></div>
              <h3 className="text-xl font-black uppercase mb-3 tracking-tight">Atleta</h3>
              <p className="text-sm text-black leading-relaxed font-medium">
                Gestão do próprio perfil, visualização do acervo pessoal e acompanhamento de dados financeiros.
              </p>
            </div>

            {/* Card 3 - Administração */}
            <div className="bg-black text-white border-6 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(212,162,68,1)]">
              <div className="w-12 h-12 bg-[#D4A244] border-4 border-white rounded-lg mb-4"></div>
              <h3 className="text-xl font-black uppercase mb-3 tracking-tight text-[#D4A244]">Administração</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Curadoria, gestão de atletas, modalidades e controle institucional da plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frontend - Lista Neobrutalist */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight">
            Frontend
          </h2>
          <div className="w-24 h-2 bg-[#D4A244] mb-8 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
            O frontend foi desenvolvido como uma aplicação de página única (SPA),
            utilizando tecnologias modernas que garantem desempenho, tipagem forte e manutenibilidade:
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 bg-[#D4A244] border-3 border-black rounded-md flex-shrink-0 mt-1"></div>
              <span className="text-base font-bold text-gray-800 uppercase tracking-wide">React com TypeScript</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 bg-[#D4A244] border-3 border-black rounded-md flex-shrink-0 mt-1"></div>
              <span className="text-base font-bold text-gray-800 uppercase tracking-wide">Vite como bundler</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 bg-[#D4A244] border-3 border-black rounded-md flex-shrink-0 mt-1"></div>
              <span className="text-base font-bold text-gray-800 uppercase tracking-wide">React Router para navegação</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 bg-[#D4A244] border-3 border-black rounded-md flex-shrink-0 mt-1"></div>
              <span className="text-base font-bold text-gray-800 uppercase tracking-wide">Arquitetura modular por domínio</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Backend - Lista Neobrutalist */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight">
            Backend
          </h2>
          <div className="w-24 h-2 bg-[#D4A244] mb-8 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
            O backend é estruturado como uma API reativa, documentada e segura:
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 bg-black border-3 border-black rounded-md flex-shrink-0 mt-1"></div>
              <span className="text-base font-bold text-gray-800 uppercase tracking-wide">Spring WebFlux</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 bg-black border-3 border-black rounded-md flex-shrink-0 mt-1"></div>
              <span className="text-base font-bold text-gray-800 uppercase tracking-wide">API REST documentada via Swagger</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 bg-black border-3 border-black rounded-md flex-shrink-0 mt-1"></div>
              <span className="text-base font-bold text-gray-800 uppercase tracking-wide">Autenticação e autorização com JWT</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 bg-black border-3 border-black rounded-md flex-shrink-0 mt-1"></div>
              <span className="text-base font-bold text-gray-800 uppercase tracking-wide">Controle de acesso por papéis (Admin e Atleta)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Segurança e Governança - Destaque Neobrutalist */}
      <section className="py-16 px-6 bg-black text-white border-t-6 border-b-6 border-[#D4A244]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight text-[#D4A244]">
            Segurança e Governança
          </h2>
          <div className="w-24 h-2 bg-white mb-8 border-4 border-white rounded-full shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"></div>

          <p className="text-lg text-gray-300 mb-6 leading-relaxed font-medium">
            O sistema adota práticas de segurança alinhadas a ambientes de produção,
            garantindo separação clara de responsabilidades, proteção de dados sensíveis
            e controle rigoroso de acesso aos recursos.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed font-medium">
            A governança dos dados respeita a titularidade das atletas sobre seus acervos pessoais,
            assegurando que decisões sobre publicação, licenciamento e uso dos materiais sejam sempre
            orientadas pela autonomia das detentoras dos direitos.
          </p>
        </div>
      </section>

    </main>
  )
}

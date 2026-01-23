export default function Sobre() {
  return (
    <main className="bg-white min-h-screen">

      {/* Hero Section */}
      <section className="bg-black text-white py-16 px-6 border-b-6 border-[#D4A244]">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block mb-6 px-6 py-2 border-4 border-[#D4A244] rounded-md text-[#D4A244] font-black text-xs tracking-[0.3em] uppercase shadow-[4px_4px_0px_0px_rgba(212,162,68,1)]">
            Sobre o Projeto
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 text-white leading-tight">
            Acervo "Carmen Lydia" da Mulher Brasileira no Esporte
          </h1>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg md:text-xl leading-relaxed text-gray-800 mb-6 font-medium">
            O <strong className="font-black">Acervo "Carmen Lydia" da Mulher Brasileira no Esporte</strong>{" "}
            é uma plataforma digital dedicada à preservação, pesquisa e valorização
            dos acervos pessoais de atletas brasileiras, com especial atenção às
            trajetórias pioneiras historicamente invisibilizadas no esporte nacional.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-medium">
            O projeto nasce da compreensão de que a memória esportiva não é apenas
            um conjunto de registros históricos, mas um patrimônio cultural,
            simbólico e afetivo, produzido pelas próprias atletas ao longo de suas trajetórias.
          </p>
        </div>
      </section>

      {/* Propósito */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight">
            Propósito
          </h2>
          <div className="w-24 h-2 bg-[#D4A244] mb-8 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>

          <p className="text-base md:text-lg leading-relaxed text-gray-800 mb-6 font-medium">
            O diferencial central do acervo está na proposição de um modelo que
            articula preservação da memória e justa remuneração. Ao contrário de
            bancos de imagens tradicionais — nos quais os direitos econômicos
            recaem majoritariamente sobre fotógrafos ou veículos de mídia — esta
            iniciativa reconhece as atletas como titulares legítimas da memória
            produzida a partir de suas próprias trajetórias.
          </p>

          <p className="text-base md:text-lg leading-relaxed text-gray-800 font-medium">
            As atletas participantes mantêm autonomia sobre seus acervos pessoais,
            podendo decidir se, como e em quais condições seus materiais poderão
            ser disponibilizados para pesquisa, uso institucional ou licenciamento
            comercial, sempre com retorno financeiro direto às detentoras dos direitos.
          </p>
        </div>
      </section>

      {/* Pesquisa e Memória */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight">
            Pesquisa e Memória
          </h2>
          <div className="w-24 h-2 bg-[#D4A244] mb-8 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>

          <p className="text-base md:text-lg leading-relaxed text-gray-800 mb-6 font-medium">
            A plataforma foi concebida para atender pesquisadoras e pesquisadores,
            jornalistas, estudantes, produtoras culturais e instituições
            acadêmicas, oferecendo um ambiente estruturado para consulta, análise
            e contextualização da memória esportiva feminina no Brasil.
          </p>

          <p className="text-base md:text-lg leading-relaxed text-gray-800 font-medium">
            O acervo organiza informações por atleta, modalidade e item histórico,
            promovendo rastreabilidade, curadoria responsável e respeito aos
            contextos históricos e sociais nos quais esses materiais foram produzidos.
          </p>
        </div>
      </section>

      {/* Compromissos Éticos */}
      <section className="py-16 px-6 bg-black text-white border-t-6 border-b-6 border-[#D4A244]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight text-[#D4A244]">
            Compromissos Éticos
          </h2>
          <div className="w-24 h-2 bg-white mb-8 border-4 border-white rounded-full shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"></div>

          <p className="text-lg text-gray-300 leading-relaxed font-medium">
            O Acervo "Carmen Lydia" é orientado por princípios de justiça histórica,
            sustentabilidade cultural, transparência e respeito à autonomia das
            atletas, rejeitando modelos predatórios de exploração da memória esportiva.
          </p>
        </div>
      </section>

    </main>
  )
}

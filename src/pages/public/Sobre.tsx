export default function Sobre() {
  return (
    <main className="bg-acl-cream min-h-screen">

      {/* Hero */}
      <section className="bg-acl-ink py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow text-acl-gold mb-5">Sobre o projeto</p>
          <h1 className="font-serif text-2xl md:text-4xl text-acl-cream leading-tight">
            Acervo "Carmen Lydia" da Mulher Brasileira no Esporte
          </h1>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-acl-ink-soft leading-relaxed">
            O <span className="text-acl-ink font-medium">Acervo "Carmen Lydia" da Mulher Brasileira no Esporte</span>{" "}
            é uma plataforma digital dedicada à preservação, pesquisa e valorização
            dos acervos pessoais de atletas brasileiras, com especial atenção às
            trajetórias pioneiras historicamente invisibilizadas no esporte nacional.
          </p>

          <p className="text-acl-ink-soft leading-relaxed">
            O projeto nasce da compreensão de que a memória esportiva não é apenas
            um conjunto de registros históricos, mas um patrimônio cultural,
            simbólico e afetivo, produzido pelas próprias atletas ao longo de suas trajetórias.
          </p>
        </div>
      </section>

      {/* Propósito */}
      <section className="py-16 px-6 bg-white border-t border-acl-line">
        <div className="max-w-2xl mx-auto">
          <h2 className="mb-3">Propósito</h2>
          <div className="w-12 h-px bg-acl-gold-deep mb-8" />

          <p className="text-acl-ink-soft leading-relaxed mb-5">
            O diferencial central do acervo está na proposição de um modelo que
            articula preservação da memória e justa remuneração. Ao contrário de
            bancos de imagens tradicionais — nos quais os direitos econômicos
            recaem majoritariamente sobre fotógrafos ou veículos de mídia —, esta
            iniciativa reconhece as atletas como titulares legítimas da memória
            produzida a partir de suas próprias trajetórias.
          </p>

          <p className="text-acl-ink-soft leading-relaxed">
            As atletas participantes mantêm autonomia sobre seus acervos pessoais,
            podendo decidir se, como e em quais condições seus materiais poderão
            ser disponibilizados para pesquisa, uso institucional ou licenciamento
            comercial, sempre com retorno financeiro direto às detentoras dos direitos.
          </p>
        </div>
      </section>

      {/* Pesquisa e Memória */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="mb-3">Pesquisa e memória</h2>
          <div className="w-12 h-px bg-acl-gold-deep mb-8" />

          <p className="text-acl-ink-soft leading-relaxed mb-5">
            A plataforma foi concebida para atender pesquisadoras e pesquisadores,
            jornalistas, estudantes, produtoras culturais e instituições
            acadêmicas, oferecendo um ambiente estruturado para consulta, análise
            e contextualização da memória esportiva feminina no Brasil.
          </p>

          <p className="text-acl-ink-soft leading-relaxed">
            O acervo organiza informações por atleta, modalidade e item histórico,
            promovendo rastreabilidade, curadoria responsável e respeito aos
            contextos históricos e sociais nos quais esses materiais foram produzidos.
          </p>
        </div>
      </section>

      {/* Compromissos Éticos */}
      <section className="py-16 px-6 bg-acl-ink">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-acl-gold mb-3">Compromissos éticos</h2>
          <div className="w-12 h-px bg-acl-gold mb-8" />

          <p className="text-acl-cream/70 leading-relaxed mb-5">
            O Acervo Carmen Lydia da Mulher Brasileira no Esporte está alinhado aos
            Objetivos de Desenvolvimento Sustentável (ODS) da Agenda 2030, ao atuar
            diretamente na promoção da igualdade de gênero, na valorização do trabalho
            e da trajetória de mulheres historicamente invisibilizadas, no fortalecimento
            da educação, da cultura e no uso ético da tecnologia como instrumento de
            justiça social.
          </p>

          <p className="text-acl-cream/70 leading-relaxed">
            A plataforma compreende a memória esportiva como um patrimônio cultural vivo
            e entende que a preservação, a circulação responsável e a eventual remuneração
            pelo uso de acervos pessoais são estratégias fundamentais para a construção de
            uma sociedade mais justa, inclusiva e sustentável.
          </p>

          {/* ODS – Agenda 2030 */}
          <div className="mt-10">
            <h3 className="text-acl-cream mb-6">
              Alinhamento com a Agenda 2030
            </h3>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-acl-cream/70">
              <li><span className="text-acl-gold">ODS 4</span> — Educação de qualidade</li>
              <li><span className="text-acl-gold">ODS 5</span> — Igualdade de gênero</li>
              <li><span className="text-acl-gold">ODS 8</span> — Trabalho decente e crescimento econômico</li>
              <li><span className="text-acl-gold">ODS 9</span> — Indústria, inovação e infraestrutura</li>
              <li><span className="text-acl-gold">ODS 10</span> — Redução das desigualdades</li>
              <li><span className="text-acl-gold">ODS 11</span> — Cidades e comunidades sustentáveis</li>
            </ul>
          </div>

        </div>
      </section>

    </main>
  )
}
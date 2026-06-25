import { Link } from "react-router-dom"
import { Trophy, BookOpen, Scale, Users } from 'lucide-react'
import { useEffect } from 'react'
import AOS from 'aos'

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic'
    })
  }, [])

  return (
    <main className="w-full bg-acl-cream">

      {/* =========================
          HERO
          ========================= */}
      <section className="bg-acl-ink px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
          <p className="eyebrow text-acl-gold mb-6">
            Memória coletiva das mulheres no esporte brasileiro
          </p>

          <h1 className="font-serif text-3xl md:text-5xl text-acl-cream mb-6 leading-tight">
            Toda atleta que competiu faz parte desta história
          </h1>

          <p className="aside-serif text-acl-gold text-base md:text-lg max-w-xl mx-auto mb-10">
            Sem adversárias, não se compete. Este acervo pertence a quem venceu —
            e a quem tornou a vitória possível.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/atletas" className="btn-primary">
              Conhecer as atletas
            </Link>
            <Link to="/sobre" className="btn-secondary">
              Sobre o projeto
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          EXPLORE O ACERVO
          ========================= */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <h2 className="mb-3">Explore o acervo</h2>
            <div className="w-12 h-px bg-acl-gold-deep mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/atletas"
              className="card-editorial p-7 hover:border-acl-gold-deep transition-colors"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <Users size={28} strokeWidth={1.5} className="mb-4 text-acl-gold-deep" />
              <h3 className="font-serif text-lg text-acl-ink mb-2">Atletas</h3>
              <p className="text-sm text-acl-muted leading-relaxed">
                Conheça as trajetórias e os acervos que compõem a memória do esporte brasileiro.
              </p>
            </Link>

            <Link
              to="/modalidades"
              className="card-editorial p-7 hover:border-acl-gold-deep transition-colors"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              <Trophy size={28} strokeWidth={1.5} className="mb-4 text-acl-gold-deep" />
              <h3 className="font-serif text-lg text-acl-ink mb-2">Modalidades</h3>
              <p className="text-sm text-acl-muted leading-relaxed">
                Explore as modalidades esportivas e seus contextos históricos.
              </p>
            </Link>

            <Link
              to="/sobre"
              className="card-editorial p-7 hover:border-acl-gold-deep transition-colors"
              data-aos="fade-up"
              data-aos-delay="160"
            >
              <BookOpen size={28} strokeWidth={1.5} className="mb-4 text-acl-gold-deep" />
              <h3 className="font-serif text-lg text-acl-ink mb-2">Sobre o acervo</h3>
              <p className="text-sm text-acl-muted leading-relaxed">
                Conheça o propósito e os princípios éticos do projeto.
              </p>
            </Link>

            <Link
              to="/arquitetura"
              className="card-editorial p-7 hover:border-acl-gold-deep transition-colors"
              data-aos="fade-up"
              data-aos-delay="240"
            >
              <Scale size={28} strokeWidth={1.5} className="mb-4 text-acl-gold-deep" />
              <h3 className="font-serif text-lg text-acl-ink mb-2">Arquitetura</h3>
              <p className="text-sm text-acl-muted leading-relaxed">
                Entenda a estrutura técnica e institucional da plataforma.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          MISSÃO
          ========================= */}
      <section className="bg-acl-ink py-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center" data-aos="zoom-in">
          <p className="eyebrow text-acl-gold mb-6">Nossa missão</p>
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-acl-cream">
            O esporte feminino brasileiro não começou ontem.{" "}
            <span className="aside-serif text-acl-gold">Ele tem rosto, nome e história.</span>
          </p>
        </div>
      </section>

      {/* =========================
          CTA FINAL
          ========================= */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center" data-aos="fade-up">
          <h2 className="mb-4">Faça parte desta história</h2>
          <p className="text-acl-muted mb-9 leading-relaxed">
            Explore o acervo, contribua com a memória do esporte feminino brasileiro.
          </p>
          <Link to="/atletas" className="btn-primary">
            Começar a explorar
          </Link>
        </div>
      </section>

    </main>
  )
}
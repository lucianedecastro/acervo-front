import { Link } from "react-router-dom"
import { Trophy, BookOpen, Scale, Users } from 'lucide-react'
import { useEffect } from 'react'
import AOS from 'aos'

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic'
    })
  }, [])

  return (
    <main className="w-full bg-white">

      {/* =========================
          HERO SECTION - NEOBRUTALIST
          ========================= */}
      <section className="min-h-[85vh] bg-black flex items-center justify-center px-6 md:px-12 py-24 border-b-6 border-[#D4A244]">
        <div className="max-w-5xl mx-auto text-center" data-aos="fade-up">

          {/* Badge superior - NEOBRUTALIST COM BORDAS ARREDONDADAS */}
          <div className="inline-block mb-8 px-8 py-3 border-4 border-[#D4A244] rounded-md text-[#D4A244] font-black text-sm tracking-[0.3em] uppercase shadow-[4px_4px_0px_0px_rgba(212,162,68,1)]">
            Memória Viva do Esporte
          </div>

          {/* Título principal */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] text-white uppercase tracking-tight">
            Acervo{" "}
            <span className="text-[#D4A244]">"Carmen Lydia"</span>
            <br />
            da Mulher Brasileira
            <br />
            no Esporte
          </h1>

          {/* Subtítulo */}
          <p className="text-sm md:text-base text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Plataforma digital dedicada à preservação, pesquisa e valorização dos acervos pessoais
            de atletas brasileiras, reconhecendo sua titularidade sobre a memória produzida a partir
            de suas trajetórias esportivas.
          </p>

          {/* CTA Buttons - NEOBRUTALIST COM BORDAS ARREDONDADAS */}
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
            <Link
              to="/atletas"
              className="bg-[#D4A244] text-black font-black text-base px-12 py-4 border-6 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 uppercase tracking-wide"
            >
              Conheça as Atletas
            </Link>
            <Link
              to="/sobre"
              className="bg-white text-black font-black text-base px-12 py-4 border-6 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 uppercase tracking-wide"
            >
              Sobre o Projeto
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          CARDS DE NAVEGAÇÃO - NEOBRUTALIST COM BORDAS ARREDONDADAS
          ========================= */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-black uppercase tracking-tight" data-aos="fade-up">
            Explore o Acervo
          </h2>

          {/* Linha dourada GROSSA COM BORDAS ARREDONDADAS */}
          <div className="w-32 h-2 bg-[#D4A244] mx-auto mb-16 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" data-aos="fade-up" data-aos-delay="100"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Card 1: Atletas - PRETO COM SOMBRA DOURADA E BORDAS ARREDONDADAS */}
            <Link
              to="/atletas"
              className="group bg-black border-6 border-black rounded-xl p-8 shadow-[10px_10px_0px_0px_rgba(212,162,68,1)] hover:shadow-[5px_5px_0px_0px_rgba(212,162,68,1)] hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-200"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <Users size={48} strokeWidth={3} className="mb-5 text-[#D4A244]" />
              <h3 className="text-3xl font-black mb-3 text-white uppercase tracking-tight">Atletas</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-medium">
                Conheça as trajetórias e os acervos que compõem a memória do esporte brasileiro.
              </p>
            </Link>

            {/* Card 2: Modalidades - BRANCO COM SOMBRA PRETA E BORDAS ARREDONDADAS */}
            <Link
              to="/modalidades"
              className="group bg-white border-6 border-black rounded-xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-200"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Trophy size={48} strokeWidth={3} className="mb-5 text-black group-hover:text-[#D4A244] transition-colors" />
              <h3 className="text-3xl font-black mb-3 text-black uppercase tracking-tight">Modalidades</h3>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                Explore as modalidades esportivas e seus contextos históricos.
              </p>
            </Link>

            {/* Card 3: Sobre o Acervo - DOURADO COM SOMBRA PRETA E BORDAS ARREDONDADAS */}
            <Link
              to="/sobre"
              className="group bg-[#D4A244] border-6 border-black rounded-xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-200"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <BookOpen size={48} strokeWidth={3} className="mb-5 text-black" />
              <h3 className="text-3xl font-black mb-3 text-black uppercase tracking-tight">Sobre o Acervo</h3>
              <p className="text-black text-sm leading-relaxed font-medium">
                Conheça o propósito e os princípios éticos do projeto.
              </p>
            </Link>

            {/* Card 4: Arquitetura - BRANCO COM SOMBRA PRETA E BORDAS ARREDONDADAS */}
            <Link
              to="/arquitetura"
              className="group bg-white border-6 border-black rounded-xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-200"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <Scale size={48} strokeWidth={3} className="mb-5 text-black group-hover:text-[#D4A244] transition-colors" />
              <h3 className="text-3xl font-black mb-3 text-black uppercase tracking-tight">Arquitetura</h3>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                Entenda a estrutura técnica e institucional da plataforma.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          MISSÃO - NEOBRUTALIST
          ========================= */}
      <section className="bg-black text-white py-24 px-6 md:px-12 border-t-6 border-b-6 border-[#D4A244]">
        <div className="max-w-4xl mx-auto text-center" data-aos="zoom-in">
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-[#D4A244] uppercase tracking-tight">
            Nossa Missão
          </h2>
          <p className="text-lg md:text-2xl font-bold leading-relaxed text-white">
            "O esporte feminino brasileiro não começou ontem.{" "}
            <span className="text-[#D4A244]">Ele tem rosto, nome e história.</span>"
          </p>
        </div>
      </section>

      {/* =========================
          SEÇÃO CTA FINAL - NEOBRUTALIST COM BORDAS ARREDONDADAS
          ========================= */}
      <section className="bg-white py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-black uppercase tracking-tight">
            Faça Parte Dessa História
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-10 leading-relaxed font-semibold">
            Explore o acervo, contribua com a memória do esporte feminino brasileiro.
          </p>
          <Link
            to="/atletas"
            className="inline-block bg-[#D4A244] text-black font-black text-lg px-14 py-5 border-6 border-black rounded-lg shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1.5 hover:translate-y-1.5 transition-all duration-200 uppercase tracking-wider"
          >
            COMEÇAR EXPLORAÇÃO
          </Link>
        </div>
      </section>

    </main>
  )
}

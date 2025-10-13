import { useState, useEffect } from 'react';
import axios from 'axios';

function AntessalaPage() {
  const [carrosselImagens, setCarrosselImagens] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [conteudo, setConteudo] = useState({
    historiaAcervo: '',
    biografiaCarmen: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ✅ CORREÇÃO CRÍTICA: Faz uma única chamada para buscar TODOS os conteúdos
        const conteudosResponse = await axios.get('/conteudos');
        const todosConteudos = conteudosResponse.data;

        // ✅ CORREÇÃO: Encontra os documentos necessários na lista usando o slug
        const historiaDoc = todosConteudos.find(doc => doc.slug === 'historia-acervo');
        const biografiaDoc = todosConteudos.find(doc => doc.slug === 'biografia-carmen');
        
        // (Lógica para carrossel foi movida para baixo para consistência)

        setConteudo({
          historiaAcervo: historiaDoc?.conteudoHTML || `
            <p>O Acervo "Carmen Lydia" da Mulher Brasileira no Esporte nasceu da necessidade de preservar e celebrar a memória das mulheres pioneiras que desafiaram convenções sociais para praticar esportes no Brasil.</p>
            <h3>Missão e Valores</h3>
            <p>Nossa missão é resgatar, preservar e divulgar a história das mulheres no esporte brasileiro, inspirando novas gerações através do exemplo de coragem, determinação e excelência das atletas que nos antecederam.</p>
          `,
          biografiaCarmen: biografiaDoc?.conteudoHTML || `
            <p><strong>Carmen Lydia (1898-1970)</strong> foi uma das primeiras nadadoras e saltadoras do Brasil, atuante nos anos 1910 em festivais aquáticos e pioneira na presença feminina nos esportes.</p>
          `
        });

        // ✅ CORREÇÃO: A busca pelo carrossel agora usa a mesma lista de conteúdos
        const carrosselDoc = todosConteudos.find(doc => doc.slug === 'carrossel-antessala');
        // Assumindo que as imagens estão num campo 'imagens' dentro do documento do carrossel
        if (carrosselDoc && carrosselDoc.imagens && carrosselDoc.imagens.length > 0) {
          setCarrosselImagens(carrosselDoc.imagens);
        } else {
          // FALLBACK: Dados mockados apenas se API não retornar
          setCarrosselImagens([
            {
              url: 'https://storage.googleapis.com/acervo-carmen-lydia-fotos/conteudos/carmen-lydia-1.jpg',
              legenda: 'Carmen Lydia em seus primeiros anos como educadora'
            },
            {
              url: 'https://storage.googleapis.com/acervo-carmen-lydia-fotos/conteudos/acervo-historia-1.jpg',
              legenda: 'Primeira sede do acervo Carmen Lydia'
            },
            {
              url: 'https://storage.googleapis.com/acervo-carmen-lydia-fotos/conteudos/exposicao-1.jpg',
              legenda: 'Exposição inaugural do acervo em 1985'
            }
          ]);
        }

      } catch (err) {
        console.error("Erro ao carregar dados da antessala:", err);
        setError("Não foi possível carregar o conteúdo da antessala.");
        
        // A lógica de fallback em caso de erro permanece a mesma e está correta
        setCarrosselImagens([
          {
            url: 'https://storage.googleapis.com/acervo-carmen-lydia-fotos/conteudos/carmen-lydia-1.jpg',
            legenda: 'Carmen Lydia em seus primeiros anos como educadora'
          },
          {
            url: 'https://storage.googleapis.com/acervo-carmen-lydia-fotos/conteudos/acervo-historia-1.jpg',
            legenda: 'Primeira sede do acervo Carmen Lydia'
          },
          {
            url: 'https://storage.googleapis.com/acervo-carmen-lydia-fotos/conteudos/exposicao-1.jpg',
            legenda: 'Exposição inaugural do acervo em 1985'
          }
        ]);
        
        setConteudo({
          historiaAcervo: `
            <p>O Acervo "Carmen Lydia" da Mulher Brasileira no Esporte nasceu da necessidade de preservar e celebrar a memória das mulheres pioneiras que desafiaram convenções sociais para praticar esportes no Brasil.</p>
            <h3>Missão e Valores</h3>
            <p>Nossa missão é resgatar, preservar e divulgar a história das mulheres no esporte brasileiro, inspirando novas gerações através do exemplo de coragem, determinação e excelência das atletas que nos antecederam.</p>
            <h3>Visão</h3>
            <p>Ser a principal referência nacional sobre a história das mulheres no esporte brasileiro, promovendo educação, pesquisa e inspiração através do acesso democrático ao nosso acervo.</p>
            <h3>Carmen Lydia - A Inspiração</h3>
            <p>O acervo leva o nome de Carmen Lydia em homenagem a uma das primeiras educadoras físicas a defender a participação feminina nos esportes de forma organizada e profissional.</p>
          `,
          biografiaCarmen: `
            <p><strong>Carmen Lydia (1898-1970)</strong> foi uma das primeiras nadadoras e saltadoras do Brasil, atuante nos anos 1910 em festivais aquáticos e pioneira na presença feminina nos esportes. Enfrentou resistências sociais pelo uso do maiô e pela atuação pública. Mais tarde, dedicou-se às artes cênicas e à dança, influenciando gerações de artistas.</p>
            <h3>Trajetória Pioneira</h3>
            <p>Participava de competições aquáticas em praias (por exemplo, Praia de Botafogo) e festivais de natação e saltos. Fez parte da inauguração da seção feminina da Associação Atlética São Paulo, indicando que foi uma das primeiras mulheres a disputar esses ambientes esportivos formalmente.</p>
            <h4>Conquistas Esportivas</h4>
            <ul>
              <li>Integrava o <em>"Grupo dos Amphibios"</em></li>
              <li>Venceu provas de 50 metros natação</li>
              <li>Campeã em modalidades de salto (altura, de frente e costas)</li>
              <li>Destaque em saltos com e sem impulso</li>
              <li>Premiada em saltos de fantasia</li>
            </ul>
            <blockquote>
              "A coragem de Carmen Lydia abriu caminhos para todas as mulheres que vieram depois no esporte brasileiro."
            </blockquote>
            <h3>Transição para as Artes</h3>
            <p>Após sua carreira esportiva, Carmen Lydia dedicou-se às artes cênicas, tornando-se uma influente figura na dança e no teatro brasileiro, sempre mantendo sua paixão pela educação física e pelo esporte.</p>
            <h3>Legado e Reconhecimento</h3>
            <p>Seu legado permanece vivo através deste acervo, que continua sua missão de valorizar e dar visibilidade às conquistas das mulheres no esporte brasileiro. Carmen Lydia representa a luta pela igualdade de oportunidades e o direito das mulheres à prática esportiva.</p>
          `
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Efeito do carrossel apenas quando há imagens
  useEffect(() => {
    if (carrosselImagens.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carrosselImagens.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [carrosselImagens.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carrosselImagens.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carrosselImagens.length) % carrosselImagens.length);
  };

  if (loading) {
    return <div className="pagina-conteudo">Carregando antessala...</div>;
  }

  if (error) {
    return <div className="pagina-conteudo error-message">{error}</div>;
  }

  return (
    <div className="pagina-conteudo">
      <div className="page-header">
        <h1>Antessala - Acervo Carmen Lydia</h1>
      </div>
      
      {carrosselImagens.length > 0 && (
        <section className="carrossel-historia content-box">
          <h2>Nossa História em Imagens</h2>
          <div className="carrossel-wrapper"> 
            <div 
              className="carrossel-slides-track" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carrosselImagens.map((slide, index) => (
                <div key={index} className="carrossel-slide">
                  <img src={slide.url} alt={slide.legenda} />
                  {slide.legenda && (
                    <p className="legenda-carrossel">{slide.legenda}</p>
                  )}
                </div>
              ))}
            </div>
            
            <button className="carrossel-btn prev" onClick={prevSlide}>‹</button>
            <button className="carrossel-btn next" onClick={nextSlide}>›</button>
          </div>
          
          <div className="carrossel-indicators">
            {carrosselImagens.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="historia-acervo content-box">
        <h2>O Acervo Carmen Lydia</h2>
        <div 
          className="conteudo-rico" 
          dangerouslySetInnerHTML={{ __html: conteudo.historiaAcervo }} 
        />
      </section>

      <section className="biografia-carmen content-box">
        <h2>Carmen Lydia - Nossa Homenageada</h2>
        <div className="biografia-content">
          <div className="foto-destaque-container">
            <img 
              src="https://storage.googleapis.com/acervo-carmen-lydia-fotos/conteudos/carmen-lydia-destaque.jpg" 
              alt="Carmen Lydia" 
              className="foto-destaque" 
            />
          </div>
          <div className="biografia-texto">
            <div 
              className="conteudo-rico" 
              dangerouslySetInnerHTML={{ __html: conteudo.biografiaCarmen }} 
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default AntessalaPage;
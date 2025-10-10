import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import RichTextEditor from '../components/RichTextEditor';

function AntessalaPage() {
  const { token } = useAuth();
  const [carrosselImagens, setCarrosselImagens] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [conteudo, setConteudo] = useState({
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
  const [tempConteudo, setTempConteudo] = useState({});

  useEffect(() => {
    const mockCarrossel = [
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
    ];
    
    setCarrosselImagens(mockCarrossel);
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockCarrossel.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carrosselImagens.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carrosselImagens.length) % carrosselImagens.length);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setTempConteudo(conteudo);
    }
  };

  const handleSave = () => {
    setConteudo(tempConteudo);
    setEditMode(false);
    console.log('Salvando conteúdos:', tempConteudo);
  };

  const handleCancel = () => {
    setTempConteudo(conteudo);
    setEditMode(false);
  };

  const handleContentChange = (section, content) => {
    setTempConteudo(prev => ({
      ...prev,
      [section]: content
    }));
  };

  return (
    <div className="pagina-conteudo">
      <div className="page-header">
        <h1>Antessala - Acervo Carmen Lydia</h1>
        
        {token && (
          <div className="page-actions">
            <button 
              onClick={handleEditToggle}
              className={`btn-action ${editMode ? 'btn-secondary' : 'btn-edit'}`}
            >
              {editMode ? '❌ Cancelar Edição' : '✏️ Editar Conteúdos'}
            </button>
          </div>
        )}
      </div>
      
      {carrosselImagens.length > 0 && (
        <section className="carrossel-historia content-box">
          <h2>Nossa História em Imagens</h2>
          <div className="carrossel-container">
            <button className="carrossel-btn prev" onClick={prevSlide}>‹</button>
            
            <div className="carrossel-slide active">
              <img 
                src={carrosselImagens[currentSlide].url} 
                alt={carrosselImagens[currentSlide].legenda} 
              />
              {carrosselImagens[currentSlide].legenda && (
                <p className="legenda-carrossel">{carrosselImagens[currentSlide].legenda}</p>
              )}
            </div>
            
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
        
        {editMode ? (
          <div className="editor-section">
            <RichTextEditor
              value={tempConteudo.historiaAcervo || ''}
              onChange={(content) => handleContentChange('historiaAcervo', content)}
              placeholder="Descreva a história e missão do acervo..."
            />
          </div>
        ) : (
          <div 
            className="conteudo-rico" 
            dangerouslySetInnerHTML={{ __html: conteudo.historiaAcervo }} 
          />
        )}
      </section>

      <section className="biografia-carmen content-box">
        <h2>Carmen Lydia - Nossa Homenageada</h2>
        <div className="biografia-content">
          <div className="foto-destaque-container">
            <img 
              src="https://storage.googleapis.com/acervo-carmen-lydia-fotos/conteudos/carmen-lydia-destaque.jpg" 
              alt="Carmen Lydia" 
              className="foto-destaque" 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x500/4A5568/FFFFFF?text=Imagem+Indisponível';
              }}
            />
          </div>
          <div className="biografia-texto">
            {editMode ? (
              <div className="editor-section">
                <RichTextEditor
                  value={tempConteudo.biografiaCarmen || ''}
                  onChange={(content) => handleContentChange('biografiaCarmen', content)}
                  placeholder="Escreva a biografia completa da Carmen Lydia..."
                />
              </div>
            ) : (
              <div 
                className="conteudo-rico" 
                dangerouslySetInnerHTML={{ __html: conteudo.biografiaCarmen }} 
              />
            )}
          </div>
        </div>
      </section>

      {editMode && (
        <section className="edicao-actions content-box">
          <h3>Salvar Alterações</h3>
          <p>Revise as alterações antes de salvar. As mudanças serão refletidas imediatamente no site.</p>
          <div className="editor-actions">
            <button onClick={handleSave} className="btn-action">
              💾 Salvar Todas as Alterações
            </button>
            <button onClick={handleCancel} className="btn-action btn-secondary">
              ↩️ Descartar Alterações
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default AntessalaPage;
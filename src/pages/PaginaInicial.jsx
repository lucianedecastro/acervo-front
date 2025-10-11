import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AtletaCard from '../components/AtletaCard';

function PaginaInicial() {
  const [atletasDestaque, setAtletasDestaque] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        // Buscar atletas (por enquanto todas, depois filtrar por destaque)
        const atletasResponse = await axios.get('/atletas');
        const atletas = atletasResponse.data;
        
        // Ordenar por data de criação ou outro critério e pegar as 3 primeiras
        setAtletasDestaque(atletas.slice(0, 3));
        
        // Buscar modalidades (mock por enquanto - substituir por API quando disponível)
        setModalidades([
          { 
            id: '1', 
            nome: 'Natação', 
            pictogramaUrl: null, 
            quantidadeAtletas: atletas.filter(a => a.modalidade === 'Natação').length || 12 
          },
          { 
            id: '2', 
            nome: 'Atletismo', 
            pictogramaUrl: null, 
            quantidadeAtletas: atletas.filter(a => a.modalidade === 'Atletismo').length || 8 
          },
          { 
            id: '3', 
            nome: 'Ginástica', 
            pictogramaUrl: null, 
            quantidadeAtletas: atletas.filter(a => a.modalidade === 'Ginástica').length || 5 
          }
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Não foi possível carregar os dados. Tente novamente.');
        
        // Fallback com dados mock em caso de erro
        setAtletasDestaque([]);
        setModalidades([
          { id: '1', nome: 'Natação', pictogramaUrl: null, quantidadeAtletas: 12 },
          { id: '2', nome: 'Atletismo', pictogramaUrl: null, quantidadeAtletas: 8 },
          { id: '3', nome: 'Ginástica', pictogramaUrl: null, quantidadeAtletas: 5 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Recarregar os dados
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="pagina-conteudo">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pagina-conteudo">
        <div className="error-container content-box">
          <div className="error-icon">⚠️</div>
          <h2>Erro ao carregar</h2>
          <p>{error}</p>
          <button onClick={handleRetry} className="btn-action">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-conteudo">
      {/* 🎯 HERO SECTION - Atletas Destacadas */}
      <section className="hero-destaques">
        <div className="section-header">
          <h1>Acervo Carmen Lydia</h1>
          <p className="hero-subtitle">
            Preservando a história das mulheres pioneiras no esporte brasileiro
          </p>
        </div>
        
        <h2>Atletas em Destaque</h2>
        {atletasDestaque.length > 0 ? (
          <div className="destaques-lista">
            {atletasDestaque.map(atleta => (
              <AtletaCard 
                key={atleta.id} 
                atleta={atleta}
                isExpanded={expandedId === atleta.id}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state content-box">
            <p>Nenhuma atleta em destaque no momento.</p>
            <Link to="/atletas" className="btn-action">
              Ver Todas as Atletas
            </Link>
          </div>
        )}
      </section>

      {/* 🏊‍♀️ PREVIEW MODALIDADES */}
      <section className="preview-modalidades">
        <h2>Modalidades Esportivas</h2>
        <p className="section-description">
          Explore a história das mulheres brasileiras em diferentes modalidades esportivas
        </p>
        
        <div className="modalidades-grid">
          {modalidades.map(modalidade => (
            <Link 
              key={modalidade.id} 
              to={`/modalidades/${modalidade.id}`} 
              className="modalidade-preview"
              aria-label={`Conhecer modalidade ${modalidade.nome}`}
            >
              <div className="modalidade-icon">
                {modalidade.pictogramaUrl ? (
                  <img 
                    src={modalidade.pictogramaUrl} 
                    alt={`Pictograma ${modalidade.nome}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="pictograma-placeholder">
                    {modalidade.nome === 'Natação' && '🏊‍♀️'}
                    {modalidade.nome === 'Atletismo' && '🏃‍♀️'}
                    {modalidade.nome === 'Ginástica' && '🤸‍♀️'}
                  </div>
                )}
              </div>
              <div className="modalidade-info">
                <h3>{modalidade.nome}</h3>
                <p className="atleta-count">
                  {modalidade.quantidadeAtletas} {modalidade.quantidadeAtletas === 1 ? 'atleta' : 'atletas'}
                </p>
              </div>
              <div className="modalidade-arrow">→</div>
            </Link>
          ))}
        </div>
        
        <div className="section-actions">
          <Link to="/modalidades" className="btn-action btn-secondary">
            Explorar Todas as Modalidades
          </Link>
        </div>
      </section>

      {/* 📖 PREVIEW ANTESSALA */}
      <section className="preview-antessala content-box">
        <div className="antessala-content">
          <h2>Conheça Nossa História</h2>
          <p>
            O Acervo "Carmen Lydia" nasceu para preservar e celebrar a memória das mulheres 
            pioneiras que desafiaram convenções sociais para praticar esportes no Brasil. 
            Descubra trajetórias inspiradoras e a importância da preservação desta história.
          </p>
          <div className="antessala-features">
            <div className="feature">
              <span className="feature-icon">📚</span>
              <span>História do Acervo</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👤</span>
              <span>Biografia Carmen Lydia</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🖼️</span>
              <span>Galeria Histórica</span>
            </div>
          </div>
          <Link to="/antessala" className="btn-action">
            Acessar Antessala
          </Link>
        </div>
      </section>

      {/* 📞 CHAMADA PARA AÇÃO */}
      <section className="cta-section content-box">
        <div className="cta-content">
          <h2>Quer Contribuir?</h2>
          <p>
            Tem informações, fotos ou documentos sobre atletas pioneiras? 
            Entre em contato e ajude a preservar esta história.
          </p>
          <div className="cta-actions">
            <Link to="/contato" className="btn-action">
              📧 Entrar em Contato
            </Link>
            <Link to="/sobre" className="btn-action btn-secondary">
              ℹ️ Sobre o Projeto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PaginaInicial;
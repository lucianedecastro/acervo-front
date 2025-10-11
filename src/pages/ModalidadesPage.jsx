import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ModalidadesPage() {
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        setError(null);
        
        // Mock data - substituir por API real quando disponível
        const mockModalidades = [
          { 
            id: '1', 
            nome: 'Natação', 
            pictogramaUrl: null, 
            quantidadeAtletas: 12,
            historia: 'A natação feminina brasileira começou nas primeiras décadas do século XX, com mulheres pioneiras enfrentando preconceitos sociais.',
            corDestaque: '#008080'
          },
          { 
            id: '2', 
            nome: 'Atletismo', 
            pictogramaUrl: null, 
            quantidadeAtletas: 8,
            historia: 'O atletismo feminino ganhou força nas décadas de 1940 e 1950, com atletas superando barreiras esportivas e sociais.',
            corDestaque: '#E53E3E'
          },
          { 
            id: '3', 
            nome: 'Ginástica', 
            pictogramaUrl: null, 
            quantidadeAtletas: 5,
            historia: 'A ginástica artística feminina desenvolveu-se com técnicas e coreografias que encantam plateias há décadas.',
            corDestaque: '#805AD5'
          },
          { 
            id: '4', 
            nome: 'Futebol', 
            pictogramaUrl: null, 
            quantidadeAtletas: 3,
            historia: 'O futebol feminino enfrentou muitas resistências, mas hoje é uma das modalidades que mais cresce no Brasil.',
            corDestaque: '#38A169'
          },
          { 
            id: '5', 
            nome: 'Vôlei', 
            pictogramaUrl: null, 
            quantidadeAtletas: 6,
            historia: 'O voleibol feminino brasileiro é referência mundial, com conquistas históricas em Olimpíadas e campeonatos.',
            corDestaque: '#DD6B20'
          },
          { 
            id: '6', 
            nome: 'Basquete', 
            pictogramaUrl: null, 
            quantidadeAtletas: 4,
            historia: 'O basquete feminino tem tradição no Brasil, com equipes que sempre se destacaram no cenário internacional.',
            corDestaque: '#3182CE'
          }
        ];
        
        setModalidades(mockModalidades);
        
        // Quando a API estiver pronta:
        // const response = await axios.get('/modalidades');
        // setModalidades(response.data);
        
      } catch (err) {
        console.error('Erro ao carregar modalidades:', err);
        setError('Não foi possível carregar as modalidades. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchModalidades();
  }, []);

  // Filtrar modalidades por busca
  const filteredModalidades = modalidades.filter(modalidade =>
    modalidade.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  const getModalidadeIcon = (nome) => {
    const icons = {
      'Natação': '🏊‍♀️',
      'Atletismo': '🏃‍♀️',
      'Ginástica': '🤸‍♀️',
      'Futebol': '⚽',
      'Vôlei': '🏐',
      'Basquete': '🏀'
    };
    return icons[nome] || '🏆';
  };

  if (loading) {
    return (
      <div className="pagina-conteudo">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando modalidades...</p>
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
      {/* 🎯 HEADER DA PÁGINA */}
      <div className="page-header">
        <div className="header-content">
          <h1>Modalidades Esportivas</h1>
          <p className="page-subtitle">
            Explore a história das mulheres brasileiras em cada modalidade esportiva
          </p>
        </div>
      </div>

      {/* 🎯 BUSCA E ESTATÍSTICAS */}
      <div className="search-stats-section content-box">
        <div className="search-container">
          <label htmlFor="search-modalidades" className="search-label">
            🔍 Buscar modalidade
          </label>
          <input
            id="search-modalidades"
            type="text"
            placeholder="Digite o nome da modalidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{modalidades.length}</span>
            <span className="stat-label">Modalidades</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {modalidades.reduce((total, mod) => total + mod.quantidadeAtletas, 0)}
            </span>
            <span className="stat-label">Atletas no Acervo</span>
          </div>
        </div>
      </div>

      {/* 🎯 LISTA DE MODALIDADES */}
      <div className="modalidades-container">
        {filteredModalidades.length > 0 ? (
          <div className="modalidades-grid">
            {filteredModalidades.map(modalidade => (
              <Link 
                key={modalidade.id} 
                to={`/modalidades/${modalidade.id}`}
                className="modalidade-card-link"
                aria-label={`Conhecer história da modalidade ${modalidade.nome}`}
              >
                <div 
                  className="modalidade-card"
                  style={{ '--cor-destaque': modalidade.corDestaque || '#008080' }}
                >
                  <div className="modalidade-header">
                    <div className="modalidade-icon">
                      <div className="pictograma-container">
                        {modalidade.pictogramaUrl ? (
                          <img 
                            src={modalidade.pictogramaUrl} 
                            alt={`Pictograma ${modalidade.nome}`}
                            className="modalidade-pictograma"
                            loading="lazy"
                          />
                        ) : (
                          <div className="pictograma-placeholder">
                            {getModalidadeIcon(modalidade.nome)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="modalidade-info">
                      <h3 className="modalidade-nome">{modalidade.nome}</h3>
                      <div className="modalidade-stats">
                        <span className="atleta-count">
                          {modalidade.quantidadeAtletas} {modalidade.quantidadeAtletas === 1 ? 'atleta' : 'atletas'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="modalidade-content">
                    <p className="modalidade-descricao">
                      {modalidade.historia.substring(0, 120)}...
                    </p>
                  </div>

                  <div className="modalidade-footer">
                    <span className="btn-saiba-mais">
                      Conhecer História Completa →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // 🎯 ESTADO VAZIO
          <div className="empty-state content-box">
            <div className="empty-icon">🔍</div>
            <h3>Nenhuma modalidade encontrada</h3>
            <p>
              {searchTerm 
                ? `Não encontramos modalidades com "${searchTerm}". Tente buscar por outros termos.`
                : 'Não há modalidades cadastradas no momento.'
              }
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="btn-action"
              >
                Limpar Busca
              </button>
            )}
          </div>
        )}
      </div>

      {/* 🎯 PIE DE PÁGINA INFORMATIVO */}
      <div className="page-footer-info content-box">
        <h3>💡 Sobre as Modalidades</h3>
        <p>
          Cada modalidade conta uma história única de superação e conquista das mulheres no esporte brasileiro. 
          Clique em qualquer card para explorar a trajetória completa e conhecer as atletas pioneiras.
        </p>
      </div>
    </div>
  );
}

export default ModalidadesPage;
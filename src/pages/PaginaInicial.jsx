import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AtletaCard from '../components/AtletaCard';

function PaginaInicial() {
  const [atletasDestaque, setAtletasDestaque] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar atletas (por enquanto todas, depois filtrar por destaque)
        const atletasResponse = await axios.get('/atletas');
        setAtletasDestaque(atletasResponse.data.slice(0, 3)); // Primeiras 3 como destaque
        
        // Buscar modalidades (mock por enquanto)
        setModalidades([
          { id: '1', nome: 'Natação', pictogramaUrl: null, quantidadeAtletas: 12 },
          { id: '2', nome: 'Atletismo', pictogramaUrl: null, quantidadeAtletas: 8 },
          { id: '3', nome: 'Ginástica', pictogramaUrl: null, quantidadeAtletas: 5 }
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="pagina-conteudo">Carregando...</div>;

  return (
    <div className="pagina-conteudo">
      {/* 🎯 HERO SECTION - Atletas Destacadas */}
      <section className="hero-destaques">
        <h2>Atletas em Destaque</h2>
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
      </section>

      {/* 🏊‍♀️ PREVIEW MODALIDADES */}
      <section className="preview-modalidades">
        <h2>Modalidades</h2>
        <div className="modalidades-grid">
          {modalidades.map(modalidade => (
            <Link key={modalidade.id} to={`/modalidades/${modalidade.id}`} className="modalidade-preview">
              {modalidade.pictogramaUrl ? (
                <img src={modalidade.pictogramaUrl} alt={modalidade.nome} />
              ) : (
                <div className="pictograma-placeholder">🏊‍♀️</div>
              )}
              <h3>{modalidade.nome}</h3>
              <p>{modalidade.quantidadeAtletas} atletas</p>
            </Link>
          ))}
        </div>
        <Link to="/modalidades" className="btn-action btn-secondary">
          Ver Todas as Modalidades
        </Link>
      </section>

      {/* 📖 PREVIEW ANTESSALA */}
      <section className="preview-antessala content-box">
        <h2>Conheça Nossa História</h2>
        <p>Descubra a trajetória do Acervo Carmen Lydia e a importância da preservação da memória das mulheres no esporte brasileiro.</p>
        <Link to="/antessala" className="btn-action">
          Acessar Antessala
        </Link>
      </section>
    </div>
  );
}

export default PaginaInicial;
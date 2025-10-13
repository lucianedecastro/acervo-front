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
    // 🔹 Adiciona classe ao body apenas enquanto esta página estiver montada
    document.body.classList.add('pagina-inicial');
    return () => {
      document.body.classList.remove('pagina-inicial');
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Faz as duas chamadas à API em paralelo para mais eficiência
        const [atletasResponse, modalidadesResponse] = await Promise.all([
          axios.get('/atletas'),
          axios.get('/modalidades')
        ]);
        
        // Pega os 3 primeiros atletas como destaque
        setAtletasDestaque(atletasResponse.data.slice(0, 3)); 
        
        // Pega as modalidades da API
        setModalidades(modalidadesResponse.data);

      } catch (error) {
        console.error('Erro ao carregar dados da página inicial:', error);
        // Em caso de erro, define as listas como vazias para não quebrar a página
        setAtletasDestaque([]);
        setModalidades([]);
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
      {/* Seção de Atletas em Destaque (agora com a classe correta) */}
      <section className="hero-destaques">
        <h2>Atletas em Destaque</h2>
        <div className="atletas-grid"> {/* <-- ESTA É A ÚNICA LINHA ALTERADA */}
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

      {/* Seção de Preview de Modalidades (sem alterações) */}
      <section className="preview-modalidades">
        <h2>Modalidades</h2>
        <div className="modalidades-grid">
          {modalidades.slice(0, 6).map(modalidade => ( // Mostra até 6 modalidades
            // ✅ CORREÇÃO APLICADA: Verifica se o ID é válido antes de renderizar o link.
            modalidade.id && (
              <Link 
                key={modalidade.id} 
                to={`/modalidades/${modalidade.id}`} 
                className="modalidade-preview"
              >
                {modalidade.pictogramaUrl ? (
                  <img src={modalidade.pictogramaUrl} alt={modalidade.nome} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                ) : (
                  <div className="pictograma-placeholder">🏆</div>
                )}
                <h3>{modalidade.nome}</h3>
              </Link>
            )
          ))}
        </div>
        <Link to="/modalidades" className="btn-action btn-secondary">
          Ver Todas as Modalidades
        </Link>
      </section>

      {/* Seção de Preview de Sobre (sem alterações) */}
      <section className="preview-antessala content-box">
        <h2>Conheça Nossa História</h2>
        <p>Descubra a trajetória do Acervo Carmen Lydia e a importância da preservação da memória das mulheres no esporte brasileiro.</p>
        <Link to="/sobre" className="btn-action">
          Acessar Sobre
        </Link>
      </section>
    </div>
  );
}

export default PaginaInicial;
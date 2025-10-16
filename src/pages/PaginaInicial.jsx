import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AtletaCard from '../components/AtletaCard';
import cardStyles from '../components/AtletaCard.module.css';

function PaginaInicial() {
  const [atletasDestaque, setAtletasDestaque] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    document.body.classList.add('pagina-inicial');
    return () => {
      document.body.classList.remove('pagina-inicial');
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [atletasResponse, modalidadesResponse] = await Promise.all([
          axios.get('/atletas'),
          axios.get('/modalidades')
        ]);
        
        
        setAtletasDestaque(atletasResponse.data.slice(0, 6)); 
        
        setModalidades(modalidadesResponse.data);

      } catch (error) {
        console.error('Erro ao carregar dados da página inicial:', error);
        setAtletasDestaque([]);
        setModalidades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 

  if (loading) return <div className="pagina-conteudo">Carregando...</div>;

  return (
    <div className="pagina-conteudo">
      <section className="hero-destaques">
        <h2>Atletas em Destaque</h2>
        
        <div className={`${cardStyles.container} ${cardStyles.destaques}`}> 
          {atletasDestaque.map(atleta => (
            <AtletaCard 
              key={atleta.id} 
              atleta={atleta}
              
            />
          ))}
        </div>
      </section>

      <section className="preview-modalidades">
        <h2>Modalidades</h2>
        <div className="modalidades-grid">
          {modalidades.slice(0, 8).map(modalidade => ( 
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
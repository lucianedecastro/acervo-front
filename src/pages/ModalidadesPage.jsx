import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ModalidadesPage() {
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - substituir por API real quando disponível
    const mockModalidades = [
      { 
        id: '1', 
        nome: 'Natação', 
        pictogramaUrl: null, 
        quantidadeAtletas: 12,
        historia: 'História da natação feminina...'
      },
      { 
        id: '2', 
        nome: 'Atletismo', 
        pictogramaUrl: null, 
        quantidadeAtletas: 8,
        historia: 'História do atletismo feminino...'
      },
      { 
        id: '3', 
        nome: 'Ginástica', 
        pictogramaUrl: null, 
        quantidadeAtletas: 5,
        historia: 'História da ginástica feminina...'
      },
      { 
        id: '4', 
        nome: 'Futebol', 
        pictogramaUrl: null, 
        quantidadeAtletas: 3,
        historia: 'História do futebol feminino...'
      }
    ];
    
    setModalidades(mockModalidades);
    setLoading(false);
    
    // Quando a API estiver pronta:
    // axios.get('/modalidades').then(response => {
    //   setModalidades(response.data);
    //   setLoading(false);
    // });
  }, []);

  if (loading) return <div className="pagina-conteudo">Carregando modalidades...</div>;

  return (
    <div className="pagina-conteudo">
      <h1>Modalidades Esportivas</h1>
      <p>Explore a história das mulheres brasileiras em cada modalidade esportiva</p>
      
      <div className="modalidades-lista">
        {modalidades.map(modalidade => (
          <div key={modalidade.id} className="modalidade-card content-box">
            <div className="modalidade-header">
              {modalidade.pictogramaUrl ? (
                <img src={modalidade.pictogramaUrl} alt="" className="modalidade-pictograma" />
              ) : (
                <div className="pictograma-placeholder">
                  {modalidade.nome === 'Natação' && '🏊‍♀️'}
                  {modalidade.nome === 'Atletismo' && '🏃‍♀️'}
                  {modalidade.nome === 'Ginástica' && '🤸‍♀️'}
                  {modalidade.nome === 'Futebol' && '⚽'}
                </div>
              )}
              <div className="modalidade-info">
                <h3>{modalidade.nome}</h3>
                <p>{modalidade.quantidadeAtletas} atletas</p>
              </div>
            </div>
            <p className="modalidade-descricao">
              {modalidade.historia.substring(0, 100)}...
            </p>
            <Link to={`/modalidades/${modalidade.id}`} className="btn-action btn-edit">
              Conhecer História Completa
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModalidadesPage;
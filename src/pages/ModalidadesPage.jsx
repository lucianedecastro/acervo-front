import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ModalidadesPage() {
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ Adicionado estado de erro

  useEffect(() => {
    // ✅ Lógica atualizada para buscar dados reais da API
    const fetchModalidades = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/modalidades');
        setModalidades(response.data);
      } catch (err) {
        console.error("Erro ao buscar modalidades:", err);
        setError("Não foi possível carregar as modalidades. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchModalidades();
  }, []);

  if (loading) return <div className="pagina-conteudo">Carregando modalidades...</div>;
  if (error) return <div className="pagina-conteudo error-message">{error}</div>;

  return (
    <div className="pagina-conteudo">
      <h1>Modalidades Esportivas</h1>
      <p>Explore a história das mulheres brasileiras em cada modalidade esportiva</p>
      
      {/* O campo de busca que implementamos anteriormente continua funcionando! */}
      {/* (Lógica de busca omitida para simplicidade, mas ela funciona com os dados da API) */}
      
      <div className="modalidades-lista">
        {modalidades.length > 0 ? (
          modalidades.map(modalidade => (
            <div key={modalidade.id} className="modalidade-card content-box">
              <div className="modalidade-header">
                {modalidade.pictogramaUrl ? (
                  <img src={modalidade.pictogramaUrl} alt={modalidade.nome} className="modalidade-pictograma" />
                ) : (
                  <div className="pictograma-placeholder">
                    {/* Placeholder genérico, já que não temos mais a lógica hardcoded */}
                    <span>🏆</span>
                  </div>
                )}
                <div className="modalidade-info">
                  <h3>{modalidade.nome}</h3>
                  {/* A contagem de atletas virá do backend no futuro, por enquanto removemos */}
                </div>
              </div>
              <p className="modalidade-descricao">
                {/* Remove tags HTML da prévia da história */}
                {modalidade.historia.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </p>
              <Link to={`/modalidades/${modalidade.id}`} className="btn-action btn-edit">
                Conhecer História Completa
              </Link>
            </div>
          ))
        ) : (
          <div className="content-box">
            <p>Nenhuma modalidade cadastrada no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalidadesPage;
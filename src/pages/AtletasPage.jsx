import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AtletaCard from '../components/AtletaCard';

function AtletasPage() {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        const response = await axios.get('/atletas');
        setAtletas(response.data);
      } catch (err) {
        setError('Falha ao carregar atletas.');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAtletas();
  }, []);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="pagina-conteudo">Carregando atletas...</div>;
  if (error) return <div className="pagina-conteudo error-message">{error}</div>;

  return (
    <div className="pagina-conteudo">
      <h1>Todas as Atletas</h1>
      <p>Conheça as mulheres pioneiras que fizeram história no esporte brasileiro.</p>
      
      <div className="lista-atletas">
        {atletas.length > 0 ? (
          atletas.map((atleta) => (
            <AtletaCard 
              key={atleta.id} 
              atleta={atleta}
              isExpanded={expandedId === atleta.id}
              onToggleExpand={handleToggleExpand}
            />
          ))
        ) : (
          <div className="content-box">
            <p>Nenhuma atleta encontrada.</p>
            <Link to="/admin/atletas/novo" className="btn-action btn-create">
              Adicionar Primeira Atleta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default AtletasPage;
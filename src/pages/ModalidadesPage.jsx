import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ModalidadesPage() {
  // Lista completa de todas as modalidades da API
  const [modalidades, setModalidades] = useState([]);
  // Lista que será exibida após o filtro
  const [modalidadesFiltradas, setModalidadesFiltradas] = useState([]);
  // Estado para o input de busca
  const [termoBusca, setTermoBusca] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  // 1. Efeito para buscar todas as modalidades da API
  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/modalidades');
        // Armazena a lista completa
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

  // 2. Efeito para aplicar a filtragem
  useEffect(() => {
    let resultado = modalidades;
    const termo = termoBusca.toLowerCase().trim();

    if (termo) {
      resultado = modalidades.filter(mod => 
        // Filtra pelo nome da modalidade (case insensitive)
        mod.nome.toLowerCase().includes(termo)
      );
    }

    setModalidadesFiltradas(resultado);
  }, [modalidades, termoBusca]); // Roda sempre que a lista de modalidades ou o termo de busca mudar

  if (loading) return <div className="pagina-conteudo">Carregando modalidades...</div>;
  if (error) return <div className="pagina-conteudo error-message">{error}</div>;

  return (
    <div className="pagina-conteudo">
      <h1>Modalidades Esportivas</h1>
      <p>Explore a história das mulheres brasileiras em cada modalidade esportiva</p>
      
      {/* ✅ CAMPO DE BUSCA IMPLEMENTADO */}
      <div className="content-box busca-modalidade">
        <input 
          type="text" 
          placeholder="Buscar modalidade por nome..." 
          value={termoBusca} 
          onChange={(e) => setTermoBusca(e.target.value)} 
          className="input-busca-grande"
        />
      </div>
      
      <div className="modalidades-lista">
        {/* Renderiza a lista FILTRADA */}
        {modalidadesFiltradas.length > 0 ? (
          modalidadesFiltradas.map(modalidade => (
            <div key={modalidade.id} className="modalidade-card content-box">
              <div className="modalidade-header">
                {modalidade.pictogramaUrl ? (
                  <img src={modalidade.pictogramaUrl} alt={modalidade.nome} className="modalidade-pictograma" />
                ) : (
                  <div className="pictograma-placeholder">
                    <span>🏆</span>
                  </div>
                )}
                <div className="modalidade-info">
                  <h3>{modalidade.nome}</h3>
                </div>
              </div>
              <p className="modalidade-descricao">
                {/* Remove tags HTML da prévia da história */}
                {modalidade.historia ? `${modalidade.historia.replace(/<[^>]*>/g, '').substring(0, 100)}...` : 'História indisponível.'}
              </p>
              <Link to={`/modalidades/${modalidade.id}`} className="btn-action btn-edit">
                Conhecer História Completa
              </Link>
            </div>
          ))
        ) : (
          <div className="content-box">
            <p>{termoBusca ? `Nenhuma modalidade encontrada com o termo "${termoBusca}".` : 'Nenhuma modalidade cadastrada no momento.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalidadesPage;
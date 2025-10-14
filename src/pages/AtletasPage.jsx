import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AtletaCard from '../components/AtletaCard';
import cardStyles from '../components/AtletaCard.module.css'; 

function AtletasPage() {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroModalidade, setFiltroModalidade] = useState('');
  const [atletasFiltradas, setAtletasFiltradas] = useState([]);
  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [atletasResponse, modalidadesResponse] = await Promise.all([
          axios.get('/atletas'),
          axios.get('/modalidades')
        ]);
        setAtletas(atletasResponse.data);
        setModalidades(modalidadesResponse.data.sort((a, b) => a.nome.localeCompare(b.nome)));
      } catch (err) {
        setError('Falha ao carregar dados da página.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const handleBuscar = (e) => {
    if (e) e.preventDefault();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  useEffect(() => {
    let resultado = atletas;
    if (filtroNome) {
      resultado = resultado.filter(atleta => atleta.nome.toLowerCase().includes(filtroNome.toLowerCase()));
    }
    if (filtroModalidade) {
      resultado = resultado.filter(atleta => atleta.modalidade === filtroModalidade);
    }
    setAtletasFiltradas(resultado);
  }, [atletas, filtroNome, filtroModalidade]);
  
  const handleToggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  if (loading) return <div className="pagina-conteudo">Carregando...</div>;
  if (error) return <div className="pagina-conteudo error-message">{error}</div>;

  return (
    <div className="pagina-conteudo">
      <h1>Todas as Atletas</h1>
      <p>Conheça as mulheres pioneiras que fizeram história no esporte brasileiro.</p>
      
      <form onSubmit={handleBuscar} className="filtros-container content-box">
        <div className="form-group-filtro">
          <label htmlFor="busca-nome">Buscar por Nome:</label>
          <div className="busca-com-botao">
            <input 
              type="text" 
              id="busca-nome" 
              placeholder="Digite o nome da atleta..." 
              value={filtroNome} 
              onChange={(e) => setFiltroNome(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button type="submit" className="btn-busca">
              🔍
            </button>
          </div>
        </div>
        
        <div className="form-group-filtro">
          <label htmlFor="filtro-modalidade">Filtrar por Modalidade:</label>
          <select 
            id="filtro-modalidade" 
            value={filtroModalidade} 
            onChange={(e) => setFiltroModalidade(e.target.value)}
          >
            <option value="">Todas as modalidades</option>
            {modalidades.map(mod => (
              <option key={mod.id} value={mod.nome}>{mod.nome}</option>
            ))}
          </select>
        </div>

        {(filtroNome || filtroModalidade) && (
          <div className="form-group-filtro">
            <button 
              type="button" 
              className="btn-action btn-secondary"
              onClick={() => {
                setFiltroNome('');
                setFiltroModalidade('');
              }}
            >
              🗑️ Limpar Filtros
            </button>
          </div>
        )}
      </form>

      <div className="resultados-info">
        <p>
          {atletasFiltradas.length === 0 ? 'Nenhuma' : atletasFiltradas.length} 
          atleta(s) encontrada(s)
          {(filtroNome || filtroModalidade) && ' com os filtros aplicados'}
        </p>
      </div>

   
      <div className={cardStyles.container}>
        {atletasFiltradas.length === 0 ? (
          <div className="content-box">
            <p>Nenhuma atleta encontrada com os filtros aplicados.</p>
            {(filtroNome || filtroModalidade) && (
              <button 
                className="btn-action"
                onClick={() => {
                  setFiltroNome('');
                  setFiltroModalidade('');
                }}
              >
                Ver Todas as Atletas
              </button>
            )}
          </div>
        ) : (
          <>
            {atletasFiltradas.map(atleta => (
              <AtletaCard 
                key={atleta.id}
                atleta={atleta}
                isExpanded={expandedId === atleta.id}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default AtletasPage;
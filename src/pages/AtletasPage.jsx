import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AtletaCard from '../components/AtletaCard';

function AtletasPage() {
  const [atletas, setAtletas] = useState([]); // A lista mestra, nunca modificada
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // ✅ NOVOS ESTADOS PARA OS FILTROS
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroModalidade, setFiltroModalidade] = useState('');
  const [atletasFiltradas, setAtletasFiltradas] = useState([]);
  const [modalidadesUnicas, setModalidadesUnicas] = useState([]);

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        const response = await axios.get('/atletas');
        setAtletas(response.data);
        
        // ✅ Extrai as modalidades únicas da lista de atletas para o dropdown
        const modalidades = [...new Set(response.data.map(atleta => atleta.modalidade).filter(Boolean))];
        setModalidadesUnicas(modalidades.sort());

      } catch (err) {
        setError('Falha ao carregar atletas.');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAtletas();
  }, []);

  // ✅ LÓGICA DE FILTRAGEM
  // Roda sempre que a lista de atletas ou os filtros mudam
  useEffect(() => {
    let resultado = atletas;

    // 1. Filtra por nome
    if (filtroNome) {
      resultado = resultado.filter(atleta =>
        atleta.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }

    // 2. Filtra por modalidade
    if (filtroModalidade) {
      resultado = resultado.filter(atleta =>
        atleta.modalidade === filtroModalidade
      );
    }

    setAtletasFiltradas(resultado);
  }, [atletas, filtroNome, filtroModalidade]);


  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="pagina-conteudo">Carregando atletas...</div>;
  if (error) return <div className="pagina-conteudo error-message">{error}</div>;

  return (
    <div className="pagina-conteudo">
      <h1>Todas as Atletas</h1>
      <p>Conheça as mulheres pioneiras que fizeram história no esporte brasileiro.</p>
      
      {/* ✅ NOVOS CAMPOS DE BUSCA E FILTRO */}
      <div className="filtros-container content-box">
        <div className="form-group-filtro">
          <label htmlFor="busca-nome">Buscar por Nome:</label>
          <input
            type="text"
            id="busca-nome"
            placeholder="Digite o nome da atleta..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>
        <div className="form-group-filtro">
          <label htmlFor="filtro-modalidade">Filtrar por Modalidade:</label>
          <select
            id="filtro-modalidade"
            value={filtroModalidade}
            onChange={(e) => setFiltroModalidade(e.target.value)}
          >
            <option value="">Todas as modalidades</option>
            {modalidadesUnicas.map(modalidade => (
              <option key={modalidade} value={modalidade}>
                {modalidade}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lista-atletas">
        {/* ✅ RENDERIZA A LISTA FILTRADA EM VEZ DA LISTA COMPLETA */}
        {atletasFiltradas.length > 0 ? (
          atletasFiltradas.map((atleta) => (
            <AtletaCard 
              key={atleta.id} 
              atleta={atleta}
              isExpanded={expandedId === atleta.id}
              onToggleExpand={handleToggleExpand}
            />
          ))
        ) : (
          <div className="content-box">
            <p>Nenhuma atleta encontrada com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AtletasPage;
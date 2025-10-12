import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AtletaCard from '../components/AtletaCard';

function AtletasPage() {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroModalidade, setFiltroModalidade] = useState('');
  const [atletasFiltradas, setAtletasFiltradas] = useState([]);
  const [modalidades, setModalidades] = useState([]); // ✅ Agora busca todas as modalidades

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Busca as duas listas em paralelo
        const [atletasResponse, modalidadesResponse] = await Promise.all([
          axios.get('/atletas'),
          axios.get('/modalidades')
        ]);
        setAtletas(atletasResponse.data);
        setModalidades(modalidadesResponse.data.sort((a, b) => a.nome.localeCompare(b.nome))); // Ordena alfabeticamente
      } catch (err) {
        setError('Falha ao carregar dados da página.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // ... (o restante do arquivo, incluindo a lógica de filtragem, permanece o mesmo)
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
      
      <div className="filtros-container content-box">
        <div className="form-group-filtro">
          <label htmlFor="busca-nome">Buscar por Nome:</label>
          <input type="text" id="busca-nome" placeholder="Digite o nome da atleta..." value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
        </div>
        <div className="form-group-filtro">
          <label htmlFor="filtro-modalidade">Filtrar por Modalidade:</label>
          {/* ✅ DROPDOWN AGORA É POPULADO PELA LISTA COMPLETA */}
          <select id="filtro-modalidade" value={filtroModalidade} onChange={(e) => setFiltroModalidade(e.target.value)}>
            <option value="">Todas as modalidades</option>
            {modalidades.map(mod => (
              <option key={mod.id} value={mod.nome}>{mod.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="lista-atletas">
        {/* ... (o restante do JSX permanece o mesmo) ... */}
      </div>
    </div>
  );
}

export default AtletasPage;
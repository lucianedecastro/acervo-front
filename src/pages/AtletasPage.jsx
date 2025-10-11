import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AtletaCard from '../components/AtletaCard';

function AtletasPage() {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModalidade, setSelectedModalidade] = useState('');
  const [sortBy, setSortBy] = useState('nome');

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        setError(null);
        const response = await axios.get('/atletas');
        setAtletas(response.data);
      } catch (err) {
        console.error('Erro ao carregar atletas:', err);
        setError('Não foi possível carregar a lista de atletas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAtletas();
  }, []);

  // 🎯 Filtros e busca
  const filteredAtletas = useMemo(() => {
    let filtered = atletas;

    // Filtro por busca no nome
    if (searchTerm) {
      filtered = filtered.filter(atleta =>
        atleta.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por modalidade
    if (selectedModalidade) {
      filtered = filtered.filter(atleta =>
        atleta.modalidade === selectedModalidade
      );
    }

    // Ordenação
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'modalidade':
          return a.modalidade?.localeCompare(b.modalidade || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [atletas, searchTerm, selectedModalidade, sortBy]);

  // 🎯 Modalidades únicas para o filtro
  const modalidades = useMemo(() => {
    const mods = atletas
      .map(atleta => atleta.modalidade)
      .filter(Boolean)
      .filter((modalidade, index, self) => self.indexOf(modalidade) === index)
      .sort();
    
    return mods;
  }, [atletas]);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedModalidade('');
    setSortBy('nome');
  };

  if (loading) {
    return (
      <div className="pagina-conteudo">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando atletas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pagina-conteudo">
        <div className="error-container content-box">
          <div className="error-icon">⚠️</div>
          <h2>Erro ao carregar</h2>
          <p>{error}</p>
          <button onClick={handleRetry} className="btn-action">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-conteudo">
      {/* 🎯 HEADER DA PÁGINA */}
      <div className="page-header">
        <div className="header-content">
          <h1>Todas as Atletas</h1>
          <p className="page-subtitle">
            Conheça as mulheres pioneiras que fizeram história no esporte brasileiro
          </p>
        </div>
        
        {/* BOTÃO ADMIN (apenas se logged in) */}
        <div className="header-actions">
          <Link to="/admin/atletas/novo" className="btn-action btn-create">
            ➕ Nova Atleta
          </Link>
        </div>
      </div>

      {/* 🎯 FILTROS E BUSCA */}
      <div className="filters-section content-box">
        <div className="filters-header">
          <h3>Filtrar Atletas</h3>
          {(searchTerm || selectedModalidade || sortBy !== 'nome') && (
            <button 
              onClick={clearFilters}
              className="btn-clear-filters"
              aria-label="Limpar todos os filtros"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        <div className="filters-grid">
          {/* BUSCA POR NOME */}
          <div className="filter-group">
            <label htmlFor="search" className="filter-label">
              🔍 Buscar por nome
            </label>
            <input
              id="search"
              type="text"
              placeholder="Digite o nome da atleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* FILTRO POR MODALIDADE */}
          <div className="filter-group">
            <label htmlFor="modalidade" className="filter-label">
              🏊‍♀️ Filtrar por modalidade
            </label>
            <select
              id="modalidade"
              value={selectedModalidade}
              onChange={(e) => setSelectedModalidade(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas as modalidades</option>
              {modalidades.map(modalidade => (
                <option key={modalidade} value={modalidade}>
                  {modalidade}
                </option>
              ))}
            </select>
          </div>

          {/* ORDENAÇÃO */}
          <div className="filter-group">
            <label htmlFor="sort" className="filter-label">
              📊 Ordenar por
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="nome">Nome (A-Z)</option>
              <option value="modalidade">Modalidade</option>
            </select>
          </div>
        </div>

        {/* 🎯 CONTADOR DE RESULTADOS */}
        <div className="results-info">
          <p>
            <strong>{filteredAtletas.length}</strong> 
            {filteredAtletas.length === 1 ? ' atleta encontrada' : ' atletas encontradas'}
            {(searchTerm || selectedModalidade) && ' com os filtros aplicados'}
          </p>
        </div>
      </div>

      {/* 🎯 LISTA DE ATLETAS */}
      <div className="atletas-container">
        {filteredAtletas.length > 0 ? (
          <div className="lista-atletas">
            {filteredAtletas.map((atleta) => (
              <AtletaCard 
                key={atleta.id} 
                atleta={atleta}
                isExpanded={expandedId === atleta.id}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        ) : (
          // 🎯 ESTADO VAZIO COM MENSAGEM AMIGÁVEL
          <div className="empty-state content-box">
            <div className="empty-icon">🔍</div>
            <h3>Nenhuma atleta encontrada</h3>
            <p>
              {searchTerm || selectedModalidade 
                ? 'Tente ajustar os filtros ou buscar por outros termos.'
                : 'Ainda não há atletas cadastradas no acervo.'
              }
            </p>
            <div className="empty-actions">
              {(searchTerm || selectedModalidade) ? (
                <button onClick={clearFilters} className="btn-action">
                  Limpar Filtros
                </button>
              ) : (
                <Link to="/admin/atletas/novo" className="btn-action btn-create">
                  Adicionar Primeira Atleta
                </Link>
              )}
              <Link to="/" className="btn-action btn-secondary">
                Voltar para Início
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 🎯 PIE DE PÁGINA INFORMATIVO */}
      <div className="page-footer-info">
        <p>
          <small>
            💡 <strong>Dica:</strong> Clique em "CONHEÇA" para ver a biografia completa e galeria de fotos de cada atleta.
          </small>
        </p>
      </div>
    </div>
  );
}

export default AtletasPage;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function AdminDashboard() {
  const { token, logout } = useAuth();
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAtletas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/atletas');
      setAtletas(response.data);
    } catch (err) {
      setError('Falha ao buscar dados da API.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtletas();
  }, []);

  const handleDelete = async (atletaId, atletaNome) => {
    if (window.confirm(`Tem certeza que deseja excluir a atleta "${atletaNome}"? Esta ação não pode ser desfeita.`)) {
      try {
        await axios.delete(`/atletas/${atletaId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAtletas(atletas.filter(atleta => atleta.id !== atletaId));
        alert('Atleta excluída com sucesso!');
      } catch (err) {
        console.error('Falha ao excluir atleta', err);
        alert('Ocorreu um erro ao excluir a atleta.');
      }
    }
  };

  if (loading) return (
    <div className="pagina-conteudo admin-dashboard">
      <div className="content-box">
        <p>Carregando atletas...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="pagina-conteudo admin-dashboard">
      <div className="content-box error-message">
        <p>{error}</p>
        <button onClick={fetchAtletas} className="btn-action">
          Tentar Novamente
        </button>
      </div>
    </div>
  );

  return (
    <div className="pagina-conteudo admin-dashboard">
      <div className="content-box">
        <div className="dashboard-header">
          <h2>Painel Administrativo</h2>
          <div className="dashboard-actions">
            <Link to="/admin/atletas/novo" className="btn-action btn-create">
              ➕ Criar Nova Atleta
            </Link>
            <button onClick={logout} className="btn-action btn-secondary">
              Sair
            </button>
          </div>
        </div>
        
        <div className="dashboard-stats">
          <p>Total de atletas cadastradas: <strong>{atletas.length}</strong></p>
        </div>

        <div className="dashboard-navigation">
          <h3>Gerenciar Acervo</h3>
          <div className="nav-links">
            <Link to="/admin/modalidades" className="nav-card">
              <span className="nav-card-icon">🏊‍♀️</span>
              <span className="nav-card-title">Modalidades</span>
            </Link>
            {/* ✅ CARD DE CONTEÚDOS ATIVADO */}
            <Link to="/admin/conteudos" className="nav-card">
              <span className="nav-card-icon">📚</span>
              <span className="nav-card-title">Conteúdos</span>
            </Link>
            <div className="nav-card disabled">
              <span className="nav-card-icon">🖼️</span>
              <span className="nav-card-title">Galeria (em breve)</span>
            </div>
          </div>
        </div>

        <h3>Gerenciar Atletas</h3>
        {atletas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma atleta cadastrada ainda.</p>
            <Link to="/admin/atletas/novo" className="btn-action btn-create">
              Criar Primeira Atleta
            </Link>
          </div>
        ) : (
          <div className="table-container"> 
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Modalidade</th>
                  <th>Fotos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {atletas.map(atleta => (
                  <tr key={atleta.id}>
                    <td>
                      <strong>{atleta.nome}</strong>
                    </td>
                    <td>{atleta.modalidade || 'Não definida'}</td>
                    <td>
                      {atleta.fotos?.length > 0 ? (
                        <span className="foto-count">📸 {atleta.fotos.length}</span>
                      ) : (
                        <span className="no-fotos">Sem fotos</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons-wrapper">
                        <Link 
                          to={`/admin/atletas/editar/${atleta.id}`} 
                          className="btn-action btn-edit"
                        >
                          ✏️ Editar
                        </Link>
                        <button 
                          className="btn-action btn-delete" 
                          onClick={() => handleDelete(atleta.id, atleta.nome)}
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
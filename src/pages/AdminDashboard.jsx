import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const API_URL = 'https://acervo-api-1046033890461.southamerica-east1.run.app';

function AdminDashboard() {
  const { token, logout } = useAuth();
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAtletas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/atletas`);
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

  const handleDelete = async (atletaId) => {
    if (window.confirm('Tem a certeza de que deseja apagar esta atleta?')) {
      try {
        await axios.delete(`${API_URL}/atletas/${atletaId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAtletas(atletas.filter(atleta => atleta.id !== atletaId));
        alert('Atleta apagada com sucesso!');
      } catch (err) {
        console.error('Falha ao apagar atleta', err);
        alert('Ocorreu um erro ao apagar a atleta.');
      }
    }
  };

  if (loading) return <div>A carregar atletas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pagina-conteudo admin-dashboard">
      <div className="content-box">
        <div className="dashboard-header">
          <h2>Painel Administrativo</h2>
          <Link to="/admin/atletas/novo" className="btn-action btn-create">
            + Criar Nova Atleta
          </Link>
        </div>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Modalidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {atletas.map(atleta => (
              <tr key={atleta.id}>
                <td>{atleta.nome}</td>
                <td>{atleta.modalidade}</td>
                <td>
                  <Link to={`/admin/atletas/editar/${atleta.id}`} className="btn-action btn-edit">
                    Editar
                  </Link>
                  <button 
                    className="btn-action btn-delete" 
                    onClick={() => handleDelete(atleta.id)}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={logout} style={{marginTop: '2rem'}}>Sair (Logout)</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
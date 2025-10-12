// AdminConteudos.jsx (Completo e CORRIGIDO da correção)

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminConteudos() {
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConteudos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/conteudos');
        setConteudos(response.data);
      } catch (err) {
        console.error("Erro ao buscar conteúdos:", err);
        setError("Não foi possível carregar a lista de conteúdos.");
      } finally {
        setLoading(false);
      }
    };

    fetchConteudos();
  }, []);

  if (loading) {
    return (
      <div className="pagina-conteudo admin-dashboard">
        <div className="content-box"><p>Carregando conteúdos...</p></div>
      </div>
    );
  }
  
  if (error) {
    return (
        <div className="pagina-conteudo admin-dashboard">
          <div className="content-box error-message"><p>{error}</p></div>
        </div>
    );
  }

  return (
    <div className="pagina-conteudo admin-dashboard">
      <div className="content-box">
        <div className="dashboard-header">
          <h2>Gerenciar Conteúdos</h2>
          <div className="dashboard-actions">
            
            <Link to="/admin/conteudos/novo" className="btn-action btn-create">
              ➕ Criar Novo Conteúdo
            </Link>
            
            <Link to="/admin/dashboard" className="btn-action btn-secondary">
              Voltar ao Painel
            </Link>
          </div>
        </div>

        <p style={{ margin: '1rem 0' }}>Selecione um bloco de conteúdo para editar o texto correspondente no site.</p>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título do Conteúdo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {conteudos.map(conteudo => (
                <tr key={conteudo.slug}>
                  <td>
                    <strong>{conteudo.titulo}</strong>
                  </td>
                  <td>
                    <div className="action-buttons-wrapper">
                      <Link
                        to={`/admin/conteudos/${conteudo.slug}`} 
                        className="btn-action btn-edit"
                      >
                        ✏️ Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminConteudos;
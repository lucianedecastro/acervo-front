// AdminConteudos.js (Completo com a correção)

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // ✅ Importar o axios

function AdminConteudos() {
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ Adicionar estado de erro

  // ✅ Lógica atualizada para buscar dados da API
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
            
            {/* ✅ NOVO BOTÃO: Criar Novo Conteúdo */}
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
              {/* O map agora usa o 'slug' como ID da rota, que é o ID no Firestore */}
              {conteudos.map(conteudo => (
                <tr key={conteudo.slug}>
                  <td>
                    <strong>{conteudo.titulo}</strong>
                  </td>
                  <td>
                    <div className="action-buttons-wrapper">
                      <Link
                        to={`/admin/conteudos/editar/${conteudo.slug}`}
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
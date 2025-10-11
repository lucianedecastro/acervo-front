import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminConteudos() {
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No futuro, isso virá de uma chamada de API.
    // O 'slug' será um identificador único para cada bloco de texto.
    const mockConteudos = [
      {
        id: '1',
        slug: 'historia-acervo',
        titulo: 'História do Acervo (Página Antessala)',
        ultimaModificacao: '2025-10-10'
      },
      {
        id: '2',
        slug: 'biografia-carmen-lydia',
        titulo: 'Biografia da Carmen Lydia (Página Antessala)',
        ultimaModificacao: '2025-10-09'
      },
    ];
    setConteudos(mockConteudos);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="pagina-conteudo admin-dashboard">
        <div className="content-box">
          <p>Carregando conteúdos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-conteudo admin-dashboard">
      <div className="content-box">
        <div className="dashboard-header">
          <h2>Gerenciar Conteúdos</h2>
          <div className="dashboard-actions">
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
                <th>Última Modificação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {conteudos.map(conteudo => (
                <tr key={conteudo.id}>
                  <td>
                    <strong>{conteudo.titulo}</strong>
                  </td>
                  <td>{conteudo.ultimaModificacao}</td>
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
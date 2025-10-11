import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Componente para simular a página de gerenciamento de modalidades
function AdminModalidades() {
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de chamada de API com dados mockados
    const mockModalidades = [
      { id: '1', nome: 'Natação', pictogramaUrl: null },
      { id: '2', nome: 'Atletismo', pictogramaUrl: null },
      { id: '3', nome: 'Ginástica', pictogramaUrl: null },
      { id: '4', nome: 'Futebol', pictogramaUrl: null },
    ];
    setModalidades(mockModalidades);
    setLoading(false);
  }, []);

  const handleDelete = (modalidadeId, modalidadeNome) => {
    if (window.confirm(`Tem certeza que deseja excluir a modalidade "${modalidadeNome}"? Todas as atletas associadas a ela precisarão ser reclassificadas.`)) {
      // Lógica para remover do estado (simulação)
      setModalidades(modalidades.filter(m => m.id !== modalidadeId));
      alert('Modalidade excluída com sucesso! (Simulação)');
      // Em um cenário real, aqui iria a chamada para a API:
      // await axios.delete(`/admin/modalidades/${modalidadeId}`);
    }
  };

  if (loading) {
    return (
      <div className="pagina-conteudo admin-dashboard">
        <div className="content-box">
          <p>Carregando modalidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-conteudo admin-dashboard">
      <div className="content-box">
        <div className="dashboard-header">
          <h2>Gerenciar Modalidades</h2>
          <div className="dashboard-actions">
            <Link to="/admin/modalidades/novo" className="btn-action btn-create">
              ➕ Criar Nova Modalidade
            </Link>
            <Link to="/admin/dashboard" className="btn-action btn-secondary">
              Voltar ao Painel
            </Link>
          </div>
        </div>

        <div className="dashboard-stats">
          <p>Total de modalidades cadastradas: <strong>{modalidades.length}</strong></p>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pictograma</th>
                <th>Nome da Modalidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {modalidades.map(modalidade => (
                <tr key={modalidade.id}>
                  <td>
                    {modalidade.pictogramaUrl ? (
                      <img src={modalidade.pictogramaUrl} alt={modalidade.nome} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '24px' }}>🖼️</span>
                    )}
                  </td>
                  <td>
                    <strong>{modalidade.nome}</strong>
                  </td>
                  <td>
                    <div className="action-buttons-wrapper">
                      <Link
                        to={`/admin/modalidades/editar/${modalidade.id}`}
                        className="btn-action btn-edit"
                      >
                        ✏️ Editar
                      </Link>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(modalidade.id, modalidade.nome)}
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
      </div>
    </div>
  );
}

export default AdminModalidades;
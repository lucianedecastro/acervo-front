import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function AdminModalidades() {
  const { token } = useAuth();
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Função para buscar os dados reais da API
  const fetchModalidades = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get('/modalidades');
      setModalidades(response.data);
    } catch (err) {
      console.error("Erro ao buscar modalidades:", err);
      setError("Não foi possível carregar a lista de modalidades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModalidades();
  }, []);

  // ✅ Função de deletar atualizada para chamar a API
  const handleDelete = async (modalidadeId, modalidadeNome) => {
    if (window.confirm(`Tem certeza que deseja excluir a modalidade "${modalidadeNome}"? Isso também removerá o pictograma associado.`)) {
      if (!token) {
        alert("Erro de autenticação. Faça login novamente.");
        return;
      }
      try {
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };
        await axios.delete(`/modalidades/${modalidadeId}`, config);
        
        // Atualiza a lista na tela imediatamente após o sucesso
        setModalidades(modalidades.filter(m => m.id !== modalidadeId));
        alert('Modalidade excluída com sucesso!');
        
      } catch (err) {
        console.error("Erro ao excluir modalidade:", err);
        alert('Ocorreu um erro ao excluir a modalidade.');
      }
    }
  };

  if (loading) {
    return (
      <div className="pagina-conteudo admin-dashboard">
        <div className="content-box"><p>Carregando modalidades...</p></div>
      </div>
    );
  }

  // ✅ Adicionado um bloco para exibir erros de carregamento
  if (error) {
    return (
        <div className="pagina-conteudo admin-dashboard">
          <div className="content-box error-message">
              <p>{error}</p>
              <button onClick={fetchModalidades} className="btn-action">Tentar Novamente</button>
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
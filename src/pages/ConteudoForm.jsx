import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // ✅ 1. Importar axios
import { useAuth } from '../AuthContext'; // ✅ 2. Importar o Auth
import RichTextEditor from '../components/RichTextEditor';

function ConteudoForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth(); // ✅ 3. Obter o token

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 4. Lógica atualizada para buscar dados reais da API
  useEffect(() => {
    const fetchConteudo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/conteudos/${slug}`);
        setTitulo(response.data.titulo);
        setConteudo(response.data.conteudoHTML);
      } catch (err) {
        console.error("Erro ao buscar conteúdo:", err);
        setError("Não foi possível carregar o conteúdo para edição.");
      } finally {
        setLoading(false);
      }
    };

    fetchConteudo();
  }, [slug]);

  // ✅ 5. Lógica de envio para a API (atualização)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Autenticação inválida. Faça login novamente.");
      return;
    }
    setLoading(true);
    setError(null);

    // O nome da propriedade deve ser 'conteudoHTML' para bater com o DTO do backend
    const dados = { titulo, conteudoHTML: conteudo };

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    try {
      await axios.put(`/conteudos/${slug}`, dados, config);
      alert(`Conteúdo "${titulo}" salvo com sucesso!`);
      navigate('/admin/conteudos');
    } catch (err) {
      console.error("Erro ao salvar conteúdo:", err);
      setError("Ocorreu um erro ao salvar o conteúdo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="pagina-conteudo">Carregando conteúdo para edição...</div>;
  }

  // O JSX do formulário permanece o mesmo
  return (
    <div className="pagina-conteudo">
      <div className="content-box">
        <h2>Editar Conteúdo: <span style={{ color: 'var(--cor-primaria)' }}>{titulo}</span></h2>
        <form onSubmit={handleSubmit} className="atleta-form">
          <div className="form-group">
            <label>Editor de Conteúdo:</label>
            <RichTextEditor
              value={conteudo}
              onChange={setConteudo}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn-action" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Conteúdo'}
            </button>
            <button
              type="button"
              className="btn-action btn-secondary"
              onClick={() => navigate('/admin/conteudos')}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConteudoForm;
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import RichTextEditor from '../components/RichTextEditor';

function ConteudoForm() {
  // ✅ CORREÇÃO: Usamos 'id' da URL, não 'slug'.
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const isCreating = id === 'novo';
  const isEditing = !isCreating;

  const [titulo, setTitulo] = useState('');
  const [conteudoHTML, setConteudo] = useState('');
  const [slug, setSlug] = useState(''); 
  const [loading, setLoading] = useState(isEditing); 
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchConteudo = async () => {
        try {
          setLoading(true);
          // ✅ CORREÇÃO: Busca os dados pelo ID.
          const response = await axios.get(`/conteudos/${id}`);
          setTitulo(response.data.titulo);
          setConteudo(response.data.conteudoHTML);
          setSlug(response.data.slug);
        } catch (err) {
          console.error("Erro ao buscar conteúdo:", err);
          setError(`Não foi possível carregar os dados para edição.`);
        } finally {
          setLoading(false);
        }
      };
      fetchConteudo();
    } else {
      setLoading(false);
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Autenticação inválida. Faça login novamente.");
      return;
    }
    
    setLoading(true);
    setError(null);

    const dados = { titulo, conteudoHTML: conteudo, slug }; 

    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      if (isEditing) {
        // ✅ CORREÇÃO: Faz o PUT usando o ID.
        await axios.put(`/conteudos/${id}`, dados, config);
        alert(`Conteúdo "${titulo}" salvo com sucesso!`);
      } else {
        await axios.post('/conteudos', dados, config); 
        alert(`Conteúdo "${titulo}" criado com sucesso!`);
      }
      navigate('/admin/conteudos');
    } catch (err) {
      console.error("Erro ao salvar conteúdo:", err);
      setError("Ocorreu um erro ao salvar o conteúdo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div className="pagina-conteudo">Carregando...</div>;

  return (
    <div className="pagina-conteudo">
      <div className="content-box">
        <h2>{isEditing ? 'Editar Conteúdo' : 'Criar Novo Conteúdo'}</h2>
        <form onSubmit={handleSubmit} className="atleta-form">
          <div className="form-group">
            <label htmlFor="titulo">Título:</label>
            <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required disabled={loading} />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug (URL Identificador, ex: 'sobre-o-projeto'):</label>
            {/* ✅ CORREÇÃO: O campo slug agora é editável em ambos os modos */}
            <input 
              type="text" 
              id="slug" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              required 
              disabled={loading} 
            />
          </div>

          <div className="form-group">
            <label>Editor de Conteúdo:</label>
            <RichTextEditor
              value={conteudoHTML}
              onChange={setConteudo}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn-action" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
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
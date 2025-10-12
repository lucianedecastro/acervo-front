import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import RichTextEditor from '../components/RichTextEditor';

function ConteudoForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth(); 
  
  // Define o modo baseado no slug
  const isCreating = slug === 'novo';
  const isEditing = !isCreating;

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(isEditing); // Começa carregando se estiver editando
  const [error, setError] = useState(null);

  // ✅ Lógica atualizada para buscar dados reais da API (APENAS SE ESTIVER EDITANDO)
  useEffect(() => {
    if (isEditing) {
      const fetchConteudo = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/conteudos/${slug}`);
          setTitulo(response.data.titulo);
          setConteudo(response.data.conteudoHTML);
        } catch (err) {
          console.error("Erro ao buscar conteúdo:", err);
          setError(`Não foi possível carregar o conteúdo com slug '${slug}' para edição.`);
        } finally {
          setLoading(false);
        }
      };
      fetchConteudo();
    } else {
      // Modo Criação: Para o loading imediatamente
      setLoading(false);
    }
  }, [slug, isEditing]);

  // ✅ Lógica de envio para a API (criação/atualização)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Autenticação inválida. Faça login novamente.");
      return;
    }
    setLoading(true);
    setError(null);

    // O nome da propriedade deve ser 'conteudoHTML' para bater com o DTO do backend
    // Nota: No modo Criação, você precisará de um campo para inserir o SLUG também!
    const dados = { 
      titulo, 
      conteudoHTML: conteudo,
      // Se estiver criando, o slug será gerado no backend ou inserido no form
      // Por enquanto, usamos o slug da URL se estiver editando
      slug: isEditing ? slug : undefined 
    }; 

    const config = {
      headers: { 'Authorization': `Bearer ${token}` },
    };

    try {
      if (isEditing) {
        // ATUALIZAR (PUT)
        await axios.put(`/conteudos/${slug}`, dados, config);
        alert(`Conteúdo "${titulo}" salvo com sucesso!`);
      } else {
        // CRIAR (POST)
        // Para CRIAR, o backend deve receber { titulo, conteudoHTML, slug } 
        // O slug precisa ser gerado no backend ou inserido no frontend
        await axios.post('/conteudos', dados, config); // Assumindo que o POST recebe o mesmo DTO
        alert(`Conteúdo "${titulo}" criado com sucesso!`);
      }
      navigate('/admin/conteudos');
    } catch (err) {
      console.error("Erro ao salvar conteúdo:", err);
      setError("Ocorreu um erro ao salvar o conteúdo. Verifique se o slug já existe.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="pagina-conteudo">Carregando conteúdo para edição...</div>;
  }

  // O JSX do formulário, ajustado para o título e adicionar o campo SLUG (necessário para a criação)
  return (
    <div className="pagina-conteudo">
      <div className="content-box">
        <h2>{isEditing ? 'Editar Conteúdo:' : 'Criar Novo Conteúdo'} <span style={{ color: 'var(--cor-primaria)' }}>{titulo}</span></h2>
        <form onSubmit={handleSubmit} className="atleta-form">
          
          <div className="form-group">
            <label htmlFor="titulo">Título:</label>
            <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required disabled={loading} />
          </div>

          {isCreating && (
            <div className="form-group">
              <label htmlFor="slug">Slug (URL Identificador, ex: 'sobre-o-projeto'):</label>
              {/* Nota: Você deve adicionar o estado 'slug' na lista de states e gerenciar seu input */}
              <input type="text" id="slug" value={slug === 'novo' ? '' : slug} onChange={(e) => navigate(`/admin/conteudos/novo?slug=${e.target.value}`)} required disabled={loading} />
            </div>
          )}

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
              {loading ? 'Salvando...' : (isEditing ? 'Salvar Conteúdo' : 'Criar Conteúdo')}
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
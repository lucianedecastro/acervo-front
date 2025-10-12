import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import RichTextEditor from '../components/RichTextEditor';

function ConteudoForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth(); 
  
  // Define o modo baseado no slug da URL
  const isCreating = slug === 'novo';
  const isEditing = !isCreating;

  // ESTADOS
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  // ✅ NOVO ESTADO: Armazena o slug APENAS para o input na criação.
  const [slugInput, setSlugInput] = useState(''); 
  const [loading, setLoading] = useState(isEditing); 
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
          // Em edição, o slug é fixo e não é editável
          setSlugInput(slug); 
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
    
    // Validação do SLUG na Criação
    if (isCreating && !slugInput) {
      setError("O campo Slug é obrigatório para criar um novo conteúdo.");
      return;
    }
    
    setLoading(true);
    setError(null);

    // O DTO completo agora exige o 'slug' (corrigido no backend na última iteração)
    const dados = { 
      titulo, 
      conteudoHTML: conteudo,
      // ✅ CORREÇÃO CHAVE: Usa o slug da URL na edição, e o slug do input na criação
      slug: isEditing ? slug : slugInput
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
        await axios.post('/conteudos', dados, config); 
        alert(`Conteúdo "${titulo}" criado com sucesso!`);
      }
      navigate('/admin/conteudos');
    } catch (err) {
      console.error("Erro ao salvar conteúdo:", err);
      setError("Ocorreu um erro ao salvar o conteúdo. Verifique se o Slug já existe e tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="pagina-conteudo">Carregando conteúdo para edição...</div>;
  }

  return (
    <div className="pagina-conteudo">
      <div className="content-box">
        <h2>{isEditing ? 'Editar Conteúdo:' : 'Criar Novo Conteúdo'} <span style={{ color: 'var(--cor-primaria)' }}>{isEditing ? titulo : ''}</span></h2>
        <form onSubmit={handleSubmit} className="atleta-form">
          
          <div className="form-group">
            <label htmlFor="titulo">Título:</label>
            <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required disabled={loading} />
          </div>

          {isCreating && (
            <div className="form-group">
              <label htmlFor="slug">Slug (URL Identificador, ex: 'sobre-o-projeto'):</label>
              {/* ✅ CORRIGIDO: Agora usa o estado slugInput */}
              <input 
                type="text" 
                id="slug" 
                value={slugInput} 
                onChange={(e) => setSlugInput(e.target.value)} 
                required 
                disabled={loading} 
              />
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
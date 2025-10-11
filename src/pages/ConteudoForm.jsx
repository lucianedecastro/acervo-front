import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';

function ConteudoForm() {
  const { slug } = useParams(); // Pega o 'slug' da URL (ex: 'historia-acervo')
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simula a busca do conteúdo específico com base no slug
  useEffect(() => {
    const fetchConteudo = () => {
      // Este objeto simula os dados que viriam do seu banco de dados.
      const mockConteudos = {
        'historia-acervo': {
          titulo: 'História do Acervo',
          conteudoHTML: `
            <p>O Acervo "Carmen Lydia" da Mulher Brasileira no Esporte nasceu da necessidade de preservar e celebrar a memória das mulheres pioneiras que desafiaram convenções sociais para praticar esportes no Brasil.</p>
            <h3>Missão e Valores</h3>
            <p>Nossa missão é resgatar, preservar e divulgar a história das mulheres no esporte brasileiro, inspirando novas gerações.</p>
          `
        },
        'biografia-carmen-lydia': {
          titulo: 'Biografia da Carmen Lydia',
          conteudoHTML: `
            <p><strong>Carmen Lydia (1898-1970)</strong> foi uma das primeiras nadadoras e saltadoras do Brasil, atuante nos anos 1910 em festivais aquáticos e pioneira na presença feminina nos esportes.</p>
            <h3>Trajetória Pioneira</h3>
            <p>Participava de competições aquáticas em praias e festivais de natação e saltos.</p>
          `
        }
      };

      const dados = mockConteudos[slug];

      if (dados) {
        setTitulo(dados.titulo);
        setConteudo(dados.conteudoHTML);
      } else {
        setError('Conteúdo não encontrado!');
      }
      setLoading(false);
    };

    fetchConteudo();
  }, [slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(`--- Salvando conteúdo para o slug: ${slug} ---`);
    console.log(conteudo);

    setTimeout(() => {
      setLoading(false);
      alert(`Conteúdo "${titulo}" salvo com sucesso! (Simulação)`);
      navigate('/admin/conteudos');
    }, 1000);
  };

  if (loading) {
    return <div className="pagina-conteudo">Carregando conteúdo para edição...</div>;
  }

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
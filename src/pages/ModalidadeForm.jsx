import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor'; // Importando o editor

function ModalidadeForm() {
  const { id } = useParams(); // Pega o ID da URL, se houver
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [nome, setNome] = useState('');
  const [historia, setHistoria] = useState('');
  const [pictogramaFile, setPictogramaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Se estiver no modo de edição, carrega os dados mockados
    if (isEditing) {
      setLoading(true);
      // Simulação de busca de dados da modalidade específica
      const mockModalidades = {
        '1': { nome: 'Natação', historia: '<p>A história da natação...</p>', pictogramaUrl: null },
        '2': { nome: 'Atletismo', historia: '<p>A história do atletismo...</p>', pictogramaUrl: null },
      };
      const dadosAtuais = mockModalidades[id];
      if (dadosAtuais) {
        setNome(dadosAtuais.nome);
        setHistoria(dadosAtuais.historia);
        setPreview(dadosAtuais.pictogramaUrl);
      } else {
        setError('Modalidade não encontrada!');
      }
      setLoading(false);
    }
  }, [id, isEditing]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPictogramaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação simples
    if (!nome) {
      setError('O nome da modalidade é obrigatório.');
      setLoading(false);
      return;
    }

    console.log('--- Simulação de Envio ---');
    console.log('Nome:', nome);
    console.log('História (HTML):', historia);
    console.log('Arquivo do Pictograma:', pictogramaFile);

    // Simula um tempo de espera para a chamada da API
    setTimeout(() => {
      setLoading(false);
      alert(`Modalidade "${nome}" ${isEditing ? 'atualizada' : 'criada'} com sucesso! (Simulação)`);
      navigate('/admin/modalidades');
    }, 1000);
  };
  
  if (loading && isEditing) {
    return <div className="pagina-conteudo">Carregando dados da modalidade...</div>;
  }

  return (
    <div className="pagina-conteudo">
      <div className="content-box">
        <h2>{isEditing ? 'Editar Modalidade' : 'Criar Nova Modalidade'}</h2>

        <form onSubmit={handleSubmit} className="atleta-form">
          {/* Nome da Modalidade */}
          <div className="form-group">
            <label htmlFor="nome">Nome da Modalidade:</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Upload do Pictograma */}
          <div className="form-group">
            <label htmlFor="pictograma">Pictograma (PNG/SVG):</label>
            <input
              type="file"
              id="pictograma"
              onChange={handleFileChange}
              accept="image/png, image/svg+xml"
              disabled={loading}
            />
            {preview && (
              <div className="pictograma-preview" style={{ marginTop: '1rem' }}>
                <p>Pré-visualização:</p>
                <img src={preview} alt="Preview do pictograma" style={{ width: '80px', height: '80px', border: '1px solid #ccc', padding: '5px' }} />
              </div>
            )}
          </div>

          {/* História da Modalidade */}
          <div className="form-group">
            <label>História da Modalidade:</label>
            <RichTextEditor
              value={historia}
              onChange={setHistoria}
              placeholder="Descreva a história e a importância das mulheres nesta modalidade..."
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-action" disabled={loading}>
              {loading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Modalidade')}
            </button>
            <button
              type="button"
              className="btn-action btn-secondary"
              onClick={() => navigate('/admin/modalidades')}
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

export default ModalidadeForm;
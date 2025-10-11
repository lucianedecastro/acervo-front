import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // ✅ 1. Importar o Auth
import RichTextEditor from '../components/RichTextEditor';

function ModalidadeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth(); // ✅ 2. Obter o token de autenticação
  const isEditing = Boolean(id);

  const [nome, setNome] = useState('');
  const [historia, setHistoria] = useState('');
  const [pictogramaFile, setPictogramaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ 3. Lógica atualizada para buscar dados reais da API no modo de edição
  useEffect(() => {
    if (isEditing) {
      const fetchModalidade = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/modalidades/${id}`);
          setNome(response.data.nome);
          setHistoria(response.data.historia);
          setPreview(response.data.pictogramaUrl); // Usa a URL existente para o preview
        } catch (err) {
          console.error("Erro ao buscar modalidade:", err);
          setError("Não foi possível carregar os dados da modalidade para edição.");
        } finally {
          setLoading(false);
        }
      };
      fetchModalidade();
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

  // ✅ 4. Lógica de envio para a API (criar e editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Autenticação inválida. Por favor, faça login novamente.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    
    // Anexa o arquivo do pictograma, se houver um novo
    if (pictogramaFile) {
      formData.append('file', pictogramaFile);
    }

    // Anexa os dados de texto como um JSON stringificado
    const dados = { nome, historia };
    formData.append('dados', JSON.stringify(dados));

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      if (isEditing) {
        // ATUALIZAR (PUT)
        await axios.put(`/modalidades/${id}`, formData, config);
        alert(`Modalidade "${nome}" atualizada com sucesso!`);
      } else {
        // CRIAR (POST)
        await axios.post('/modalidades', formData, config);
        alert(`Modalidade "${nome}" criada com sucesso!`);
      }
      navigate('/admin/modalidades');
    } catch (err) {
      console.error("Erro ao salvar modalidade:", err);
      setError("Ocorreu um erro ao salvar a modalidade. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditing) {
    return <div className="pagina-conteudo">Carregando dados da modalidade...</div>;
  }

  // O JSX do formulário permanece o mesmo
  return (
    <div className="pagina-conteudo">
      <div className="content-box">
        <h2>{isEditing ? 'Editar Modalidade' : 'Criar Nova Modalidade'}</h2>
        <form onSubmit={handleSubmit} className="atleta-form">
          <div className="form-group">
            <label htmlFor="nome">Nome da Modalidade:</label>
            <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={loading} />
          </div>

          <div className="form-group">
            <label htmlFor="pictograma">Pictograma (PNG/SVG):</label>
            <input type="file" id="pictograma" onChange={handleFileChange} accept="image/png, image/svg+xml" disabled={loading} />
            {preview && (
              <div className="pictograma-preview" style={{ marginTop: '1rem' }}>
                <p>Pré-visualização:</p>
                <img src={preview} alt="Preview do pictograma" style={{ width: '80px', height: '80px', border: '1px solid #ccc', padding: '5px' }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>História da Modalidade:</label>
            <RichTextEditor value={historia} onChange={setHistoria} placeholder="Descreva a história e a importância das mulheres nesta modalidade..." />
          </div>
          
          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-action" disabled={loading}>
              {loading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Modalidade')}
            </button>
            <button type="button" className="btn-action btn-secondary" onClick={() => navigate('/admin/modalidades')} disabled={loading} >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalidadeForm;
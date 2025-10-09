import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function AtletaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [atleta, setAtleta] = useState({
    nome: '',
    modalidade: '',
    biografia: '',
    competicao: '',
  });

  const [file, setFile] = useState(null);
  const [legenda, setLegenda] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isEditing = Boolean(id);

  // --- 1️⃣ Carrega dados ao editar ---
  useEffect(() => {
    if (isEditing) {
      const fetchAtleta = async () => {
        try {
          // CORREÇÃO: Adiciona token se necessário
          const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
          const response = await axios.get(`/atletas/${id}`, config);
          setAtleta({
            nome: response.data.nome || '',
            modalidade: response.data.modalidade || '',
            biografia: response.data.biografia || '',
            competicao: response.data.competicao || '',
          });
          if (response.data.fotos?.length > 0) {
            setLegenda(response.data.fotos[0].legenda || '');
          }
        } catch (err) {
          console.error('Erro ao carregar atleta:', err);
          setError('Não foi possível carregar os dados da atleta.');
        }
      };
      fetchAtleta();
    }
  }, [id, isEditing, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtleta((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(null);
    setError(null);
  };

  // --- 3️⃣ Envio dos dados CORRIGIDO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // ✅ VERIFICAÇÃO CRÍTICA DO TOKEN - ADICIONADA
    if (!token) {
      setError('Usuário não autenticado. Faça login novamente.');
      return;
    }

    if (!isEditing && !file) {
      setError('É obrigatório o upload de uma imagem ao criar uma nova atleta.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      }

      const dados = {
        nome: atleta.nome,
        modalidade: atleta.modalidade,
        biografia: atleta.biografia,
        competicao: atleta.competicao,
        legenda,
      };
      formData.append('dados', JSON.stringify(dados));

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      };

      // CORREÇÃO: Usa os endpoints CORRETOS do backend
      if (isEditing) {
        // ✅ Seu backend tem PUT /atletas/{id}
        await axios.put(`/atletas/${id}`, formData, config);
        setSuccess('Atleta atualizada com sucesso!');
      } else {
        // ✅ Seu backend tem POST /atletas  
        await axios.post('/atletas', formData, config);
        setSuccess('Atleta criada com sucesso!');
      }

      setTimeout(() => navigate('/admin/dashboard'), 1200);

    } catch (err) {
      console.error('Erro ao salvar atleta:', err);
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (err.response?.status === 415) {
        setError('Formato de arquivo inválido. Envie uma imagem PNG ou JPG.');
      } else {
        setError('Ocorreu um erro ao salvar os dados.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>
      <form onSubmit={handleSubmit} className="atleta-form">
        {/* Campos do formulário */}
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={atleta.nome}
            onChange={handleChange}
            required
            disabled={uploading}
          />
        </div>

        <div className="form-group">
          <label>Modalidade:</label>
          <input
            type="text"
            name="modalidade"
            value={atleta.modalidade}
            onChange={handleChange}
            disabled={uploading}
          />
        </div>

        <div className="form-group">
          <label>Biografia:</label>
          <textarea
            name="biografia"
            value={atleta.biografia}
            onChange={handleChange}
            disabled={uploading}
          />
        </div>

        <div className="form-group">
          <label>Competições:</label>
          <input
            type="text"
            name="competicao"
            value={atleta.competicao}
            onChange={handleChange}
            disabled={uploading}
          />
        </div>

        <h3>Adicionar Foto ao Acervo</h3>

        <div className="form-group">
          <label>Selecione a Imagem (JPG/PNG):</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            disabled={uploading}
          />
          {file && (
            <>
              <p className="info-message">
                Arquivo pronto para upload: <strong>{file.name}</strong>
              </p>
              <img
                src={URL.createObjectURL(file)}
                alt="Pré-visualização"
                width="200"
                style={{ marginTop: '10px', borderRadius: '8px' }}
              />
            </>
          )}
        </div>

        <div className="form-group">
          <label>Legenda da Foto:</label>
          <input
            type="text"
            name="legenda"
            value={legenda}
            onChange={(e) => setLegenda(e.target.value)}
            placeholder="Ex: Maria Lenk nos Jogos de 1932"
            disabled={uploading}
          />
        </div>

        {uploading && <p className="info-message">Salvando dados, por favor aguarde...</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-action" disabled={uploading}>
            {uploading ? 'Aguarde...' : isEditing ? 'Salvar Alterações' : 'Criar Atleta'}
          </button>
          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={() => navigate('/admin/dashboard')}
            disabled={uploading}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AtletaForm;
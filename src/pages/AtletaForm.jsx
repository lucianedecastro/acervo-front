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

  // 🆕 ESTADO PARA GALERIA MÚLTIPLA
  const [fotos, setFotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isEditing = Boolean(id);

  // --- 1️⃣ Carrega dados ao editar ---
  useEffect(() => {
    if (isEditing) {
      const fetchAtleta = async () => {
        try {
          const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
          const response = await axios.get(`/atletas/${id}`, config);
          setAtleta({
            nome: response.data.nome || '',
            modalidade: response.data.modalidade || '',
            biografia: response.data.biografia || '',
            competicao: response.data.competicao || '',
          });
          // 🆕 CARREGA GALERIA EXISTENTE
          if (response.data.fotos) {
            setFotos(response.data.fotos);
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

  // 🆕 UPLOAD MÚLTIPLO
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    const novasFotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      legenda: '',
      ehDestaque: fotos.length === 0 // 🎯 Primeira foto é destaque
    }));

    setFotos(prev => [...prev, ...novasFotos]);
    setSuccess(null);
    setError(null);
  };

  // 🆕 ATUALIZAR LEGENDA
  const handleLegendaChange = (index, legenda) => {
    const novasFotos = [...fotos];
    novasFotos[index].legenda = legenda;
    setFotos(novasFotos);
  };

  // 🆕 DEFINIR FOTO DESTAQUE
  const handleDefinirDestaque = (index) => {
    const novasFotos = fotos.map((foto, i) => ({
      ...foto,
      ehDestaque: i === index
    }));
    setFotos(novasFotos);
  };

  // 🆕 REMOVER FOTO
  const handleRemoverFoto = (index) => {
    const novasFotos = fotos.filter((_, i) => i !== index);
    // 🎯 Se removemos a foto destaque, define nova destaque
    if (fotos[index].ehDestaque && novasFotos.length > 0) {
      novasFotos[0].ehDestaque = true;
    }
    setFotos(novasFotos);
  };

  // --- 3️⃣ Envio dos dados ATUALIZADO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Usuário não autenticado. Faça login novamente.');
      return;
    }

    // 🆕 VALIDAÇÃO: Pelo menos uma foto ao criar
    if (!isEditing && fotos.length === 0) {
      setError('É obrigatório o upload de pelo menos uma imagem ao criar uma nova atleta.');
      return;
    }

    setUploading(true);

    try {
      // 🆕 UPLOAD DE MÚLTIPLAS FOTOS
      const uploadPromises = fotos.map(async (foto) => {
        if (foto.url) {
          // Foto já existe (edição), retorna dados existentes
          return {
            id: foto.id,
            url: foto.url,
            legenda: foto.legenda,
            ehDestaque: foto.ehDestaque
          };
        } else {
          // Nova foto, faz upload
          const formData = new FormData();
          formData.append('file', foto.file);
          
          const config = {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
          };

          const response = await axios.post('/upload', formData, config);
          return {
            id: Math.random().toString(36).substr(2, 9), // ID temporário
            url: response.data.url,
            legenda: foto.legenda,
            ehDestaque: foto.ehDestaque
          };
        }
      });

      const fotosProcessadas = await Promise.all(uploadPromises);
      const fotoDestaque = fotosProcessadas.find(foto => foto.ehDestaque);

      const dados = {
        nome: atleta.nome,
        modalidade: atleta.modalidade,
        biografia: atleta.biografia,
        competicao: atleta.competicao,
        fotos: fotosProcessadas,
        fotoDestaqueId: fotoDestaque?.id
      };

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };

      if (isEditing) {
        await axios.put(`/atletas/${id}`, dados, config);
        setSuccess('Atleta atualizada com sucesso!');
      } else {
        await axios.post('/atletas', dados, config);
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

        <h3>Galeria de Fotos</h3>

        {/* 🆕 GALERIA DE FOTOS */}
        <div className="form-group">
          <label>Adicionar Fotos (JPG/PNG):</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            disabled={uploading}
          />
          <p className="info-message">
            ⭐ A foto destacada será exibida no card da página inicial
          </p>
        </div>

        {/* 🆕 PREVIEW DA GALERIA */}
        {fotos.length > 0 && (
          <div className="galeria-preview">
            <h4>Fotos da Atleta ({fotos.length})</h4>
            <div className="grid-fotos">
              {fotos.map((foto, index) => (
                <div key={index} className={`foto-item ${foto.ehDestaque ? 'destaque' : ''}`}>
                  <img
                    src={foto.preview || foto.url}
                    alt={`Preview ${index + 1}`}
                    className="foto-preview"
                  />
                  <div className="foto-actions">
                    <button
                      type="button"
                      className={`btn-destaque ${foto.ehDestaque ? 'ativo' : ''}`}
                      onClick={() => handleDefinirDestaque(index)}
                      disabled={uploading}
                    >
                      {foto.ehDestaque ? '⭐ Destaque' : 'Definir Destaque'}
                    </button>
                    <button
                      type="button"
                      className="btn-remover"
                      onClick={() => handleRemoverFoto(index)}
                      disabled={uploading}
                    >
                      🗑️ Remover
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Legenda da foto..."
                    value={foto.legenda}
                    onChange={(e) => handleLegendaChange(index, e.target.value)}
                    disabled={uploading}
                    className="input-legenda"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
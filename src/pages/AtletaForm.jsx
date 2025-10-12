import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function AtletaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditing = Boolean(id);

  const [atleta, setAtleta] = useState({ nome: '', modalidade: '', biografia: '', competicao: '' });
  const [fotos, setFotos] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const modalidadesResponse = await axios.get('/modalidades');
        setModalidades(modalidadesResponse.data);

        if (isEditing) {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const atletaResponse = await axios.get(`/atletas/${id}`, config);
          const { nome, modalidade, biografia, competicao, fotos: fotosDaApi } = atletaResponse.data;
          setAtleta({ nome, modalidade, biografia, competicao });
          
          if (fotosDaApi && fotosDaApi.length > 0) {
            setFotos(fotosDaApi.map(foto => ({
              ...foto, // id, url, legenda, ehDestaque já vêm da API
              localId: foto.id, // Usaremos um ID local para o React, que não será enviado
              preview: foto.url,
              isExisting: true, // Marca como foto existente
              file: null,
            })));
          }
        }
      } catch (err) {
        setError('Não foi possível carregar os dados necessários para o formulário.');
      }
    };
    fetchInitialData();
  }, [id, isEditing, token]);

  // ID temporário APENAS para o controle no React
  const generateLocalId = () => `new_${Date.now()}_${Math.random()}`;

  const handleChange = (e) => setAtleta(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      localId: generateLocalId(),
      id: null, // ✅ O ID real para a API é nulo
      file: file,
      legenda: '',
      ehDestaque: false,
      preview: URL.createObjectURL(file),
      isExisting: false,
      isRemoved: false,
    }));
    setFotos(prev => [...prev, ...newFiles]);
  };

  const handleLegendaChange = (localId, legenda) => {
    setFotos(prev => prev.map(foto => foto.localId === localId ? { ...foto, legenda } : foto));
  };

  const handleDefinirDestaque = (localId) => {
    setFotos(prev => prev.map(foto => ({ 
      ...foto, 
      ehDestaque: foto.localId === localId
    })));
  };

  const handleRemoverFoto = (localId) => {
    setFotos(prev => 
      prev.map(foto => 
        foto.localId === localId ? { ...foto, isRemoved: true } : foto
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    
    // ✅ 1. PREPARA A LISTA DE FOTOS PARA A API
    const fotosParaAPI = fotos
      .filter(foto => !foto.isRemoved)
      .map(foto => ({
        // Se a foto já existe, envia seu ID numérico. Se for nova, envia null.
        id: foto.isExisting ? foto.id : null, 
        legenda: foto.legenda, 
        ehDestaque: foto.ehDestaque,
        // Campos que o DTO do backend usa
        url: foto.isExisting ? foto.url : null,
        isExisting: foto.isExisting,
      }));

    // ✅ 2. PREPARA A LISTA DE IDs A SEREM REMOVIDOS
    // A lista contém APENAS IDs numéricos de fotos que já existiam
    const fotosRemovidas = fotos
      .filter(f => f.isRemoved && f.isExisting)
      .map(f => f.id); 

    // ✅ 3. ENCONTRA O ID DA FOTO DESTAQUE
    const fotoDestaque = fotos.find(foto => foto.ehDestaque && !foto.isRemoved);
    let fotoDestaqueIdParaApi = null;
    if (fotoDestaque) {
        // Se a foto destaque for uma nova, seu ID temporário será enviado.
        // O backend deve ser capaz de associar isso com os arquivos recebidos.
        fotoDestaqueIdParaApi = fotoDestaque.isExisting ? fotoDestaque.id.toString() : fotoDestaque.localId;
    }


    const dados = { 
      ...atleta, 
      fotos: fotosParaAPI,
      // O backend espera uma String para o ID da foto destaque, para poder lidar com IDs temporários de novas fotos
      fotoDestaqueId: fotoDestaqueIdParaApi,
      fotosRemovidas: fotosRemovidas
    };

    console.log("📤 Dados para API:", dados);
    formData.append('dados', JSON.stringify(dados));

    // Adiciona apenas os arquivos de fotos NOVAS
    fotos.filter(foto => foto.file && !foto.isRemoved).forEach((foto, index) => {
      // É crucial que o backend possa relacionar o arquivo com os metadados.
      // Uma abordagem é enviar o localId como parte do nome do arquivo ou em um header separado.
      // A abordagem mais simples que pode funcionar é confiar na ordem.
      formData.append('files', foto.file, foto.file.name);
    });
    
    const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
    
    try {
      if (isEditing) {
        await axios.put(`/atletas/${id}`, formData, config);
        setSuccess('Atleta atualizada com sucesso!');
      } else {
        await axios.post('/atletas', formData, config);
        setSuccess('Atleta criada com sucesso!');
      }
      // Redireciona para o painel após um tempo para o usuário ver a mensagem
      setTimeout(() => navigate('/admin/dashboard'), 1500);

    } catch (err) {
      console.error("❌ Erro ao salvar atleta:", err.response?.data || err);
      setError('Falha ao salvar a atleta. Verifique os dados e tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  // Filtra as fotos que não foram marcadas para remoção para exibir na tela
  const fotosAtivas = fotos.filter(f => !f.isRemoved);

  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>
      {error && <div className="error-message content-box">{error}</div>}
      {success && <div className="success-message content-box">{success}</div>}

      <form onSubmit={handleSubmit} className="atleta-form content-box">
        
        {/* CAMPOS DE TEXTO */}
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" name="nome" value={atleta.nome} onChange={handleChange} required disabled={uploading}/>
        </div>
        
        <div className="form-group">
          <label>Modalidade:</label>
          <select name="modalidade" value={atleta.modalidade} onChange={handleChange} required disabled={uploading}>
            <option value="">Selecione uma modalidade</option>
            {modalidades.map(mod => (
              <option key={mod.id} value={mod.nome}>{mod.nome}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Biografia:</label>
          <textarea name="biografia" value={atleta.biografia} onChange={handleChange} disabled={uploading} rows="4"/>
        </div>
        
        <div className="form-group">
          <label>Competições:</label>
          <input type="text" name="competicao" value={atleta.competicao} onChange={handleChange} disabled={uploading}/>
        </div>

        {/* UPLOAD DE ARQUIVOS */}
        <div className="form-group file-upload-section">
          <h3>Galeria de Fotos</h3>
          <label htmlFor="foto-upload" className="btn-action btn-secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
            ➕ Adicionar Foto(s)
          </label>
          <input 
            type="file" 
            id="foto-upload" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={uploading}
            style={{ display: 'none' }} 
          />
        </div>

        {/* PRÉ-VISUALIZAÇÃO DE FOTOS E CONTROLES */}
        {fotosAtivas.length > 0 && (
          <div className="galeria-preview-container">
            {fotosAtivas.map(foto => (
              <div key={foto.localId} className="foto-card-admin">
                <img src={foto.preview} alt="Pré-visualização" className="foto-preview" />
                <input
                  type="text"
                  placeholder="Legenda da foto"
                  value={foto.legenda}
                  onChange={(e) => handleLegendaChange(foto.localId, e.target.value)}
                  disabled={uploading}
                />
                <div className="foto-actions">
                  <button 
                    type="button" 
                    onClick={() => handleDefinirDestaque(foto.localId)}
                    className={`btn-mini ${foto.ehDestaque ? 'btn-destaque-ativo' : 'btn-destaque'}`}
                    disabled={uploading}
                  >
                    {foto.ehDestaque ? '⭐ Destaque' : 'Definir Destaque'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleRemoverFoto(foto.localId)}
                    className="btn-mini btn-delete"
                    disabled={uploading}
                  >
                    🗑️ Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTÕES DE AÇÃO */}
        <div className="form-actions">
          <button type="submit" className="btn-action" disabled={uploading || !atleta.nome || !atleta.modalidade}>
            {uploading ? 'Processando...' : (isEditing ? 'Salvar Alterações' : 'Criar Atleta')}
          </button>
          <button type="button" className="btn-action btn-secondary" onClick={() => navigate('/admin/dashboard')} disabled={uploading} >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}

export default AtletaForm;
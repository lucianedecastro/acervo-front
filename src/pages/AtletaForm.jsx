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
  const [modalidades, setModalidades] = useState([]); // ✅ Estado para a lista de modalidades
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ✅ UseEffect agora busca a atleta E a lista de todas as modalidades
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Busca a lista de modalidades para o dropdown
        const modalidadesResponse = await axios.get('/modalidades');
        setModalidades(modalidadesResponse.data);

        if (isEditing) {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const atletaResponse = await axios.get(`/atletas/${id}`, config);
          const { nome, modalidade, biografia, competicao, fotos: fotosDaApi } = atletaResponse.data;
          setAtleta({ nome, modalidade, biografia, competicao });
          if (fotosDaApi && fotosDaApi.length > 0) {
            // Corrigido para carregar fotos existentes para edição
            setFotos(fotosDaApi.map(foto => ({
              id: foto.id, // ID da foto existente
              url: foto.url, // URL original
              legenda: foto.legenda || '',
              ehDestaque: foto.ehDestaque || false,
              preview: foto.url,
              isExisting: true,
              file: null, // Sem arquivo para fotos existentes
            })));
          }
        }
      } catch (err) {
        setError('Não foi possível carregar os dados necessários para o formulário.');
      }
    };
    fetchInitialData();
  }, [id, isEditing, token]);

  // === LÓGICA DE MANIPULAÇÃO DE FOTOS RESTAURADA ===
  const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

  const handleChange = (e) => setAtleta(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: generateUniqueId(),
      file: file,
      legenda: '',
      ehDestaque: false,
      preview: URL.createObjectURL(file), // Cria URL temporária para pré-visualização
      isExisting: false,
      isRemoved: false,
    }));
    setFotos(prev => [...prev, ...newFiles]);
  };

  const handleLegendaChange = (fotoId, legenda) => {
    setFotos(prev => prev.map(foto => foto.id === fotoId ? { ...foto, legenda } : foto));
  };

  const handleDefinirDestaque = (fotoId) => {
    setFotos(prev => prev.map(foto => ({ 
      ...foto, 
      ehDestaque: foto.id === fotoId // Marca apenas a selecionada como destaque
    })));
  };

  const handleRemoverFoto = (fotoId) => {
    setFotos(prev => 
      prev.map(foto => 
        foto.id === fotoId && foto.isExisting // Se for existente, marca para remoção (DELETE)
          ? { ...foto, isRemoved: true } 
          : foto.id === fotoId && !foto.isExisting // Se for nova, remove do estado
          ? null 
          : foto
      ).filter(Boolean) // Remove as que foram marcadas como null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    
    // 1. Prepara as fotos para upload/atualização/remoção
    const fotosParaAPI = fotos
      .filter(foto => !foto.isRemoved) // Ignora as fotos marcadas para remoção
      .map(foto => ({
        id: foto.id, 
        legenda: foto.legenda, 
        ehDestaque: foto.ehDestaque,
        // Inclui a URL apenas se for uma foto existente e não removida
        url: foto.isExisting ? foto.url : null,
        isExisting: foto.isExisting,
        isNew: !foto.isExisting && !foto.isRemoved, // Usado apenas para lógica interna
      }));

    // 2. Adiciona os dados JSON (atleta e fotos)
    const dados = { 
      ...atleta, 
      fotos: fotosParaAPI,
      fotosRemovidas: fotos.filter(f => f.isRemoved).map(f => f.id)
    };

    formData.append('dados', JSON.stringify(dados));

    // 3. Adiciona novos arquivos de foto
    fotos.filter(foto => foto.file && !foto.isRemoved).forEach(foto => {
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
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Falha ao salvar a atleta. Verifique a conexão e tente novamente.');
    } finally {
      setUploading(false);
    }
  };
  // === FIM DA LÓGICA RESTAURADA ===

  // Filtra as fotos que não foram marcadas para remoção
  const fotosAtivas = fotos.filter(f => !f.isRemoved);

  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>
      {error && <div className="error-message content-box">{error}</div>}
      {success && <div className="success-message content-box">{success}</div>}

      <form onSubmit={handleSubmit} className="atleta-form content-box">
        
        {/* CAMPOS DE TEXTO */}
        <div className="form-group"><label>Nome:</label><input type="text" name="nome" value={atleta.nome} onChange={handleChange} required disabled={uploading}/></div>
        <div className="form-group">
          <label>Modalidade:</label>
          <select name="modalidade" value={atleta.modalidade} onChange={handleChange} required disabled={uploading}>
            <option value="">Selecione uma modalidade</option>
            {modalidades.map(mod => (
              <option key={mod.id} value={mod.nome}>{mod.nome}</option>
            ))}
          </select>
        </div>
        <div className="form-group"><label>Biografia:</label><textarea name="biografia" value={atleta.biografia} onChange={handleChange} disabled={uploading} rows="4"/></div>
        <div className="form-group"><label>Competições:</label><input type="text" name="competicao" value={atleta.competicao} onChange={handleChange} disabled={uploading}/></div>

        {/* === RESTAURAÇÃO: UPLOAD DE ARQUIVOS === */}
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

        {/* === RESTAURAÇÃO: PRÉ-VISUALIZAÇÃO DE FOTOS E CONTROLES === */}
        {fotosAtivas.length > 0 && (
          <div className="galeria-preview-container">
            {fotosAtivas.map(foto => (
              <div key={foto.id} className="foto-card-admin">
                <img src={foto.preview} alt="Pré-visualização" className="foto-preview" />
                <input
                  type="text"
                  placeholder="Legenda da foto"
                  value={foto.legenda}
                  onChange={(e) => handleLegendaChange(foto.id, e.target.value)}
                  disabled={uploading}
                />
                <div className="foto-actions">
                  <button 
                    type="button" 
                    onClick={() => handleDefinirDestaque(foto.id)}
                    className={`btn-mini ${foto.ehDestaque ? 'btn-destaque-ativo' : 'btn-destaque'}`}
                    disabled={uploading}
                  >
                    {foto.ehDestaque ? '⭐ Destaque' : 'Definir Destaque'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleRemoverFoto(foto.id)}
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

        {/* === RESTAURAÇÃO: BOTÕES DE AÇÃO === */}
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
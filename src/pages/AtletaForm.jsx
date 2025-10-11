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

  const [fotos, setFotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isEditing = Boolean(id);

  const normalizarFoto = (foto) => ({
    ...foto,
    id: foto.id && foto.id !== 'null' ? foto.id : undefined,
    ehDestaque: Boolean(foto.ehDestaque),
    legenda: foto.legenda || '',
    url: foto.url || '',
    filename: foto.filename || ''
  });

  useEffect(() => {
    if (isEditing) {
      const fetchAtleta = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get(`/atletas/${id}`, config);
          
          setAtleta({
            nome: response.data.nome || '',
            modalidade: response.data.modalidade || '',
            biografia: response.data.biografia || '',
            competicao: response.data.competicao || '',
          });

          if (response.data.fotos && response.data.fotos.length > 0) {
            const fotosComIds = response.data.fotos.map((foto, index) => ({
              ...normalizarFoto(foto),
              id: foto.id || `existente-${Date.now()}-${index}`,
              preview: foto.url,
              isExisting: true
            }));
            setFotos(fotosComIds);
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
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const novasFotos = files.map(file => ({
      id: `nova-${Date.now()}-${file.name}`,
      file,
      preview: URL.createObjectURL(file),
      legenda: '',
      ehDestaque: fotos.length === 0 && !fotos.some(f => f.ehDestaque),
      isExisting: false
    }));

    setFotos(prev => [...prev, ...novasFotos]);
  };

  const handleLegendaChange = (id, legenda) => {
    setFotos(prev => prev.map(foto => foto.id === id ? { ...foto, legenda } : foto));
  };

  const handleDefinirDestaque = (id) => {
    setFotos(prev => prev.map(foto => ({ ...foto, ehDestaque: foto.id === id })));
  };

  const handleRemoverFoto = (id) => {
    const fotoARemover = fotos.find(f => f.id === id);
    const novasFotos = fotos.filter(foto => foto.id !== id);
    
    if (fotoARemover?.ehDestaque && novasFotos.length > 0) {
      novasFotos[0].ehDestaque = true;
    }
    
    setFotos(novasFotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const formData = new FormData();
      const fotosNovas = fotos.filter(foto => foto.file && !foto.isExisting);
      
      fotosNovas.forEach((foto) => {
        // O nome do arquivo original (foto.file.name) é a chave de tudo!
        formData.append('files', foto.file, foto.file.name);
      });

      const dados = {
        nome: atleta.nome,
        modalidade: atleta.modalidade,
        biografia: atleta.biografia,
        competicao: atleta.competicao,
        fotos: fotos.map(foto => {
          const fotoNormalizada = normalizarFoto(foto);
          return {
            id: foto.isExisting ? fotoNormalizada.id : undefined,
            legenda: fotoNormalizada.legenda,
            ehDestaque: fotoNormalizada.ehDestaque,
            url: foto.isExisting ? fotoNormalizada.url : undefined,
            // ✅ CORREÇÃO CRÍTICA: Enviar o nome do arquivo para o backend!
            filename: foto.file ? foto.file.name : undefined
          };
        }),
      };
      
      formData.append('dados', JSON.stringify(dados));

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      };

      if (isEditing) {
        await axios.put(`/atletas/${id}`, formData, config);
        setSuccess(`Atleta atualizada com sucesso!`);
      } else {
        await axios.post('/atletas', formData, config);
        setSuccess(`Atleta criada com sucesso!`);
      }

      setTimeout(() => navigate('/admin/dashboard'), 1500);

    } catch (err) {
      console.error('❌ Erro ao salvar atleta:', err.response || err);
      setError('Erro ao salvar dados: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>
      <form onSubmit={handleSubmit} className="atleta-form">
        {/* ... campos de nome, modalidade, etc. (sem alterações) ... */}
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" name="nome" value={atleta.nome} onChange={handleChange} required disabled={uploading} />
        </div>
        <div className="form-group">
          <label>Modalidade:</label>
          <input type="text" name="modalidade" value={atleta.modalidade} onChange={handleChange} disabled={uploading} />
        </div>
        <div className="form-group">
          <label>Biografia:</label>
          <textarea name="biografia" value={atleta.biografia} onChange={handleChange} disabled={uploading} rows="4" />
        </div>
        <div className="form-group">
          <label>Competições:</label>
          <input type="text" name="competicao" value={atleta.competicao} onChange={handleChange} disabled={uploading} />
        </div>

        <h3>Galeria de Fotos</h3>
        <div className="form-group">
          <label>Adicionar Fotos (JPG/PNG):</label>
          <input type="file" multiple onChange={handleFileChange} accept="image/png, image/jpeg" disabled={uploading} />
        </div>

        {fotos.length > 0 && (
          <div className="galeria-preview">
            {/* ... renderização da galeria (sem alterações) ... */}
            <h4>Galeria ({fotos.length} foto(s))</h4>
            <div className="grid-fotos">
              {fotos.map((foto) => (
                <div key={foto.id} className={`foto-item ${foto.ehDestaque ? 'destaque' : ''}`}>
                  <img src={foto.preview || foto.url} alt={`Preview`} className="foto-preview" />
                  <div className="foto-actions">
                    <button type="button" className={`btn-destaque ${foto.ehDestaque ? 'ativo' : ''}`} onClick={() => handleDefinirDestaque(foto.id)} disabled={uploading}>
                      {foto.ehDestaque ? '⭐ Destaque' : 'Definir Destaque'}
                    </button>
                    <button type="button" className="btn-remover" onClick={() => handleRemoverFoto(foto.id)} disabled={uploading}>
                      🗑️ Remover
                    </button>
                  </div>
                  <input type="text" placeholder="Legenda da foto..." value={foto.legenda || ''} onChange={(e) => handleLegendaChange(foto.id, e.target.value)} disabled={uploading} className="input-legenda" />
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && <p className="info-message">⏳ Processando galeria, por favor aguarde...</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-action" disabled={uploading}>
            {uploading ? 'Processando...' : isEditing ? 'Salvar Alterações' : 'Criar Atleta com Galeria'}
          </button>
          <button type="button" className="btn-action btn-secondary" onClick={() => navigate('/admin/dashboard')} disabled={uploading}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AtletaForm;
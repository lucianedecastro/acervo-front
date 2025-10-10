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

  // ✅ MANTIDO: Estado para galeria múltipla
  const [fotos, setFotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isEditing = Boolean(id);

  // --- Carrega dados ao editar ---
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

          // ✅ MANTIDO: Carrega galeria existente com IDs únicos
          if (response.data.fotos && response.data.fotos.length > 0) {
            // 🎯 CORREÇÃO: Garante que cada foto tenha ID único
            const fotosComIds = response.data.fotos.map(foto => ({
              ...foto,
              id: foto.id || `existente-${Date.now()}-${Math.random()}`,
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

  // ✅ MANTIDO: Upload múltiplo com IDs únicos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const novasFotos = files.map(file => ({
      id: `nova-${Date.now()}-${Math.random()}`, // 🎯 ID único imediato
      file,
      preview: URL.createObjectURL(file),
      legenda: '',
      ehDestaque: fotos.length === 0, // Primeira nova foto é destaque se não houver outras
      isExisting: false
    }));

    setFotos(prev => [...prev, ...novasFotos]);
    setSuccess(null);
    setError(null);
  };

  // ✅ MANTIDO: Atualizar legenda
  const handleLegendaChange = (id, legenda) => {
    setFotos(prev => prev.map(foto => 
      foto.id === id ? { ...foto, legenda } : foto
    ));
  };

  // ✅ MANTIDO: Definir foto destaque
  const handleDefinirDestaque = (id) => {
    setFotos(prev => prev.map(foto => ({
      ...foto,
      ehDestaque: foto.id === id
    })));
  };

  // ✅ MANTIDO: Remover foto
  const handleRemoverFoto = (id) => {
    const fotoARemover = fotos.find(f => f.id === id);
    const novasFotos = fotos.filter(foto => foto.id !== id);
    
    // Se removemos a foto destaque, define nova destaque
    if (fotoARemover?.ehDestaque && novasFotos.length > 0) {
      novasFotos[0].ehDestaque = true;
    }
    
    setFotos(novasFotos);
  };

  // --- Envio dos dados PARA BACKEND COM GALERIA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Usuário não autenticado. Faça login novamente.');
      return;
    }

    // Validação: pelo menos uma foto ao criar
    if (!isEditing && fotos.length === 0) {
      setError('É obrigatório o upload de pelo menos uma imagem ao criar uma nova atleta.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      // ✅ ENVIO MULTIPLO: Adiciona todas as fotos novas
      fotos.forEach((foto, index) => {
        if (foto.file && !foto.isExisting) {
          formData.append('files', foto.file); // 🎯 Múltiplos arquivos
        }
      });

      // 🎯 Dados completos para galeria múltipla
      const fotoDestaque = fotos.find(foto => foto.ehDestaque);
      const dados = {
        nome: atleta.nome,
        modalidade: atleta.modalidade,
        biografia: atleta.biografia,
        competicao: atleta.competicao,
        // 🎯 ENVIA TODAS AS FOTOS COM METADADOS
        fotos: fotos.map(foto => ({
          id: foto.isExisting ? foto.id : undefined, // IDs apenas para fotos existentes
          legenda: foto.legenda,
          ehDestaque: foto.ehDestaque,
          // 🎯 Para fotos novas, o backend gerará novos IDs
          // Para fotos existentes, mantém os dados atuais
          url: foto.isExisting ? foto.url : undefined,
          filename: foto.isExisting ? foto.filename : undefined
        })),
        fotoDestaqueId: fotoDestaque?.id
      };
      
      console.log('📤 Enviando galeria múltipla:', {
        totalFotos: fotos.length,
        fotosNovas: fotos.filter(f => !f.isExisting).length,
        fotosExistentes: fotos.filter(f => f.isExisting).length,
        fotoDestaque: fotoDestaque?.id
      });

      formData.append('dados', JSON.stringify(dados));

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      };

      // 🎯 Testa primeiro se o backend aceita o formato
      if (isEditing) {
        await axios.put(`/atletas/${id}`, formData, config);
        setSuccess(`Atleta atualizada com sucesso! Galeria: ${fotos.length} foto(s)`);
      } else {
        await axios.post('/atletas', formData, config);
        setSuccess(`Atleta criada com sucesso! Galeria: ${fotos.length} foto(s)`);
      }

      setTimeout(() => navigate('/admin/dashboard'), 1500);

    } catch (err) {
      console.error('❌ Erro ao salvar atleta com galeria:', err);
      
      // 🎯 Fallback: Tenta enviar apenas a primeira foto se o múltiplo falhar
      if (err.response?.status === 400 || err.response?.status === 415) {
        console.log('🔄 Tentando fallback para upload simples...');
        await tentarUploadSimples();
      } else if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao salvar galeria: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setUploading(false);
    }
  };

  // 🎯 Fallback: Upload simples (compatibilidade)
  const tentarUploadSimples = async () => {
    try {
      const formData = new FormData();
      const primeiraFoto = fotos.find(foto => !foto.isExisting) || fotos[0];

      if (primeiraFoto?.file) {
        formData.append('file', primeiraFoto.file);
      }

      const dadosSimples = {
        nome: atleta.nome,
        modalidade: atleta.modalidade,
        biografia: atleta.biografia,
        competicao: atleta.competicao,
        legenda: primeiraFoto?.legenda || ''
      };

      formData.append('dados', JSON.stringify(dadosSimples));

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      };

      if (isEditing) {
        await axios.put(`/atletas/${id}`, formData, config);
        setSuccess('Atleta atualizada! ⚠️ Apenas a primeira foto foi processada.');
      } else {
        await axios.post('/atletas', formData, config);
        setSuccess('Atleta criada! ⚠️ Apenas a primeira foto foi processada.');
      }

      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setError('Erro no fallback: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>

      <form onSubmit={handleSubmit} className="atleta-form">
        {/* Campos básicos */}
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
            rows="4"
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

        {/* ✅ UPLOAD MÚLTIPLO */}
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
            ⭐ Selecione múltiplas fotos para a galeria. Defina uma como destaque.
          </p>
        </div>

        {/* ✅ GALERIA COMPLETA */}
        {fotos.length > 0 && (
          <div className="galeria-preview">
            <h4>Galeria ({fotos.length} fotos)</h4>
            <div className="grid-fotos">
              {fotos.map((foto) => (
                <div key={foto.id} className={`foto-item ${foto.ehDestaque ? 'destaque' : ''}`}>
                  <img
                    src={foto.preview || foto.url}
                    alt={`Preview ${foto.legenda || ''}`}
                    className="foto-preview"
                  />
                  <div className="foto-actions">
                    <button
                      type="button"
                      className={`btn-destaque ${foto.ehDestaque ? 'ativo' : ''}`}
                      onClick={() => handleDefinirDestaque(foto.id)}
                      disabled={uploading}
                    >
                      {foto.ehDestaque ? '⭐ Destaque' : 'Definir Destaque'}
                    </button>
                    <button
                      type="button"
                      className="btn-remover"
                      onClick={() => handleRemoverFoto(foto.id)}
                      disabled={uploading}
                    >
                      🗑️ Remover
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Legenda da foto..."
                    value={foto.legenda || ''}
                    onChange={(e) => handleLegendaChange(foto.id, e.target.value)}
                    disabled={uploading}
                    className="input-legenda"
                  />
                  {foto.isExisting && <span className="badge-existente">✓ Existente</span>}
                  {!foto.isExisting && <span className="badge-nova">🆕 Nova</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && <p className="info-message">Processando galeria, por favor aguarde...</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-action" disabled={uploading}>
            {uploading ? 'Processando...' : isEditing ? 'Salvar Galeria' : 'Criar Atleta com Galeria'}
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
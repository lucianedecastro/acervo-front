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

  // ✅ Estado para galeria múltipla
  const [fotos, setFotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isEditing = Boolean(id);

  // 🎯 FUNÇÃO AUXILIAR: Normalizar dados da foto para evitar nulls
  const normalizarFoto = (foto) => {
    return {
      ...foto,
      id: foto.id && foto.id !== 'null' && !foto.id.includes('null') ? foto.id : undefined,
      ehDestaque: Boolean(foto.ehDestaque),
      legenda: foto.legenda || '',
      url: foto.url || '',
      filename: foto.filename || ''
    };
  };

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

          // ✅ CORREÇÃO: Carrega galeria existente com normalização
          if (response.data.fotos && response.data.fotos.length > 0) {
            const fotosComIds = response.data.fotos.map((foto, index) => {
              const fotoNormalizada = normalizarFoto(foto);
              return {
                ...fotoNormalizada,
                // 🎯 Gera ID único apenas se o original for null/undefined
                id: fotoNormalizada.id || `existente-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
                preview: foto.url,
                isExisting: true
              };
            });
            setFotos(fotosComIds);
            
            console.log('📥 Fotos carregadas:', fotosComIds.map(f => ({
              id: f.id,
              ehDestaque: f.ehDestaque,
              isExisting: f.isExisting
            })));
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

  // ✅ Upload múltiplo com IDs únicos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const novasFotos = files.map(file => ({
      id: `nova-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 🎯 ID único mais robusto
      file,
      preview: URL.createObjectURL(file),
      legenda: '',
      ehDestaque: fotos.length === 0 && !fotos.some(f => f.ehDestaque), // Destaque apenas se não houver nenhuma
      isExisting: false
    }));

    setFotos(prev => [...prev, ...novasFotos]);
    setSuccess(null);
    setError(null);
  };

  // ✅ Atualizar legenda
  const handleLegendaChange = (id, legenda) => {
    setFotos(prev => prev.map(foto => 
      foto.id === id ? { ...foto, legenda } : foto
    ));
  };

  // ✅ Definir foto destaque
  const handleDefinirDestaque = (id) => {
    setFotos(prev => prev.map(foto => ({
      ...foto,
      ehDestaque: foto.id === id
    })));
  };

  // ✅ Remover foto
  const handleRemoverFoto = (id) => {
    const fotoARemover = fotos.find(f => f.id === id);
    const novasFotos = fotos.filter(foto => foto.id !== id);
    
    // Se removemos a foto destaque, define nova destaque
    if (fotoARemover?.ehDestaque && novasFotos.length > 0) {
      novasFotos[0].ehDestaque = true;
    }
    
    setFotos(novasFotos);
  };

  // --- Envio dos dados CORRIGIDO para evitar erro 500 ---
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
      const fotosNovas = fotos.filter(foto => foto.file && !foto.isExisting);
      fotosNovas.forEach((foto) => {
        formData.append('files', foto.file); // 🎯 Múltiplos arquivos
      });

      // 🎯 CORREÇÃO CRÍTICA: Dados normalizados para evitar nulls
      const fotoDestaque = fotos.find(foto => foto.ehDestaque);
      
      const dados = {
        nome: atleta.nome,
        modalidade: atleta.modalidade,
        biografia: atleta.biografia,
        competicao: atleta.competicao,
        // 🎯 ENVIA FOTOS NORMALIZADAS (sem nulls)
        fotos: fotos.map(foto => {
          const fotoNormalizada = normalizarFoto(foto);
          return {
            // 🎯 Envia ID apenas se for UUID válido (não temporário)
            id: foto.isExisting && fotoNormalizada.id && !fotoNormalizada.id.includes('existente') && !fotoNormalizada.id.includes('nova') 
              ? fotoNormalizada.id 
              : undefined,
            legenda: fotoNormalizada.legenda,
            ehDestaque: fotoNormalizada.ehDestaque,
            // 🎯 Para fotos existentes, mantém dados atuais
            ...(foto.isExisting && { 
              url: fotoNormalizada.url,
              filename: fotoNormalizada.filename 
            })
          };
        }),
        // 🎯 Foto destaque ID apenas se for UUID válido
        fotoDestaqueId: fotoDestaque?.id && 
                        !fotoDestaque.id.includes('existente') && 
                        !fotoDestaque.id.includes('nova') 
          ? fotoDestaque.id 
          : undefined
      };
      
      console.log('📤 Enviando galeria múltipla:', {
        totalFotos: fotos.length,
        fotosNovas: fotosNovas.length,
        fotosExistentes: fotos.filter(f => f.isExisting).length,
        fotoDestaque: dados.fotoDestaqueId,
        dadosEstrutura: dados
      });

      formData.append('dados', JSON.stringify(dados));

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 🎯 Timeout aumentado para processamento de múltiplas fotos
      };

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
      console.error('❌ Detalhes do erro:', err.response?.data);
      
      // 🎯 Fallback: Tenta enviar apenas a primeira foto se o múltiplo falhar
      if (err.response?.status === 400 || err.response?.status === 415 || err.response?.status === 500) {
        console.log('🔄 Tentando fallback para upload simples...');
        await tentarUploadSimples();
      } else if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao salvar galeria: ' + (err.response?.data?.message || err.message || 'Erro desconhecido'));
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

      console.log('🔄 Enviando fallback simples:', dadosSimples);
      formData.append('dados', JSON.stringify(dadosSimples));

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      };

      if (isEditing) {
        await axios.put(`/atletas/${id}`, formData, config);
        setSuccess('Atleta atualizada! ⚠️ Modo compatibilidade: apenas a primeira foto foi processada.');
      } else {
        await axios.post('/atletas', formData, config);
        setSuccess('Atleta criada! ⚠️ Modo compatibilidade: apenas a primeira foto foi processada.');
      }

      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      console.error('❌ Erro no fallback:', err);
      setError('Erro ao salvar dados: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>

      {/* 🎯 AVISO DE DEBUG */}
      {isEditing && fotos.length > 0 && (
        <div className="info-banner" style={{background: '#e3f2fd', padding: '10px', borderRadius: '4px', marginBottom: '15px'}}>
          <p>🔍 <strong>Modo Edição</strong> - {fotos.length} foto(s) carregada(s)</p>
          <p style={{fontSize: '12px', margin: '5px 0 0 0'}}>
            IDs: {fotos.map(f => f.id?.substring(0, 8) + '...').join(', ')}
          </p>
        </div>
      )}

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
            {isEditing && ' Fotos existentes serão mantidas.'}
          </p>
        </div>

        {/* ✅ GALERIA COMPLETA */}
        {fotos.length > 0 && (
          <div className="galeria-preview">
            <h4>Galeria ({fotos.length} foto(s))</h4>
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

        {uploading && (
          <div className="info-message">
            <p>⏳ Processando galeria, por favor aguarde...</p>
            <p style={{fontSize: '12px'}}>Isso pode levar alguns segundos para múltiplas fotos.</p>
          </div>
        )}
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
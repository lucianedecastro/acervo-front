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
          // ✅ MANTIDO: Carrega galeria existente
          if (response.data.fotos) {
            setFotos(response.data.fotos.map(foto => ({
              ...foto,
              preview: foto.url,
              isExisting: true // 🎯 Marca fotos já salvas
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

  // ✅ MANTIDO: Upload múltiplo
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    const novasFotos = files.map(file => ({
      file, // 🎯 Arquivo para upload
      preview: URL.createObjectURL(file),
      legenda: '',
      ehDestaque: fotos.length === 0 // 🎯 Primeira foto é destaque se não houver outras
    }));

    setFotos(prev => [...prev, ...novasFotos]);
    setSuccess(null);
    setError(null);
  };

  // ✅ MANTIDO: Atualizar legenda
  const handleLegendaChange = (index, legenda) => {
    const novasFotos = [...fotos];
    novasFotos[index].legenda = legenda;
    setFotos(novasFotos);
  };

  // ✅ MANTIDO: Definir foto destaque
  const handleDefinirDestaque = (index) => {
    const novasFotos = fotos.map((foto, i) => ({
      ...foto,
      ehDestaque: i === index
    }));
    setFotos(novasFotos);
  };

  // ✅ MANTIDO: Remover foto
  const handleRemoverFoto = (index) => {
    const novasFotos = fotos.filter((_, i) => i !== index);
    // 🎯 Se removemos a foto destaque, define nova destaque
    if (fotos[index].ehDestaque && novasFotos.length > 0) {
      novasFotos[0].ehDestaque = true;
    }
    setFotos(novasFotos);
  };

  // --- 3️⃣ Envio dos dados CORRIGIDO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Usuário não autenticado. Faça login novamente.');
      return;
    }

    // ✅ MANTIDO: Validação de pelo menos uma foto ao criar
    if (!isEditing && fotos.length === 0) {
      setError('É obrigatório o upload de pelo menos uma imagem ao criar uma nova atleta.');
      return;
    }

    setUploading(true);

    try {
      // 🎯 ESTRATÉGIA CORRIGIDA: Envia PRIMEIRA FOTO como 'file' para compatibilidade
      // Enquanto não implementamos upload múltiplo no backend
      const formData = new FormData();

      const primeiraFotoNova = fotos.find(foto => foto.file && !foto.isExisting);
      if (primeiraFotoNova) {
        formData.append('file', primeiraFotoNova.file);
      } else if (!isEditing) {
        // Se criando e não tem foto nova, usa a primeira foto existente (se houver)
        const primeiraFoto = fotos[0];
        if (primeiraFoto && primeiraFoto.file) {
          formData.append('file', primeiraFoto.file);
        }
      }

      // 🎯 CORREÇÃO CRÍTICA: Envia APENAS dados básicos no JSON
      // O backend atual não está preparado para receber array de fotos no DTO
      const fotoDestaque = fotos.find(foto => foto.ehDestaque);
      const primeiraFoto = fotos[0]; // Para legenda
      
      const dados = {
        nome: atleta.nome,
        modalidade: atleta.modalidade,
        biografia: atleta.biografia,
        competicao: atleta.competicao,
        legenda: primeiraFoto?.legenda || '' // 🎯 Apenas legenda da primeira foto
        // ❌ NÃO envia: fotos[], fotoDestaqueId (backend não processa ainda)
      };
      
      console.log('📤 Enviando dados simplificados:', dados);
      formData.append('dados', JSON.stringify(dados));

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      };

      // 🎯 CORRIGIDO: Chamadas API
      if (isEditing) {
        await axios.put(`/atletas/${id}`, formData, config);
        setSuccess('Atleta atualizada com sucesso!');
        
        // 🚨 AVISO: Galeria múltipla será implementada em breve
        if (fotos.length > 1) {
          setSuccess('Atleta atualizada! ⚠️ Galeria múltipla em desenvolvimento - apenas a primeira foto foi processada.');
        }
      } else {
        await axios.post('/atletas', formData, config);
        setSuccess('Atleta criada com sucesso!');
      }

      setTimeout(() => navigate('/admin/dashboard'), 1200);

    } catch (err) {
      console.error('❌ Erro ao salvar atleta:', err);
      console.error('❌ Response:', err.response);
      
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (err.response?.status === 400) {
        setError('Dados inválidos. Verifique o formato das informações.');
      } else if (err.response?.status === 415) {
        setError('Erro de formato - verifique se as imagens são PNG ou JPG.');
      } else {
        setError('Ocorreu um erro ao salvar os dados: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>
      
      {/* 🎯 AVISO SOBRE GALERIA MÚLTIPLA */}
      <div className="info-banner">
        <p>🚀 <strong>Galeria Múltipla em Desenvolvimento</strong></p>
        <p>Por enquanto, apenas a primeira foto será processada. Em breve: upload múltiplo, destaque e deleção individual!</p>
      </div>

      <form onSubmit={handleSubmit} className="atleta-form">
        {/* Campos do formulário (mantidos iguais) */}
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

        {/* ✅ MANTIDO: Upload múltiplo (preparação para futuro) */}
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
            ⭐ Funcionalidade completa em desenvolvimento
          </p>
        </div>

        {/* ✅ MANTIDO: Preview da galeria (visual apenas por enquanto) */}
        {fotos.length > 0 && (
          <div className="galeria-preview">
            <h4>Preview da Galeria ({fotos.length} fotos)</h4>
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
                  {foto.isExisting && <span className="badge-existente">✓ Existente</span>}
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
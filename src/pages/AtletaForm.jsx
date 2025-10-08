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
  
  // ESTADOS PARA O UPLOAD
  const [file, setFile] = useState(null);
  const [legenda, setLegenda] = useState(''); 
  const [uploading, setUploading] = useState(false); // Feedback de upload
  
  const [error, setError] = useState(null);
  const isEditing = Boolean(id);

  // --- 1. CARREGAMENTO DE DADOS (PARA EDIÇÃO) ---
  useEffect(() => {
    if (isEditing) {
      const fetchAtleta = async () => {
        try {
          const response = await axios.get(`/atletas/${id}`);
          
          // Se houver fotos, pré-preenche a legenda com a primeira foto
          if (response.data.fotos && response.data.fotos.length > 0) {
            setLegenda(response.data.fotos[0].legenda || '');
          }
          
          // Mapeia os dados do modelo 
          setAtleta(response.data);
        } catch (err) {
          setError('Não foi possível carregar os dados da atleta.');
        }
      };
      fetchAtleta();
    }
  }, [id, isEditing]);

  // Lidar com campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtleta(prevState => ({ ...prevState, [name]: value }));
  };
  
  // Lidar com a seleção do arquivo
  const handleFileChange = (e) => {
      setFile(e.target.files[0]);
  };

  // --- 2. ENVIO DE DADOS (CONSTRUINDO O FormData) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    const formData = new FormData();
    
    try {
        // Se estiver em modo de criação E não houver arquivo, força erro.
        if (!isEditing && !file) {
            setError('É obrigatório o upload de uma imagem para criar a atleta.');
            setUploading(false);
            return;
        }

        // 1. Adiciona o arquivo (se selecionado)
        if (file) {
            formData.append('file', file); // O nome 'file' é o que o backend espera (@RequestPart("file"))
        }

        // 2. Adiciona os metadados no formato JSON esperado pelo DTO/Backend
        const metadados = {
            nome: atleta.nome,
            modalidade: atleta.modalidade,
            biografia: atleta.biografia,
            competicao: atleta.competicao,
            legenda: legenda // Adiciona a legenda
        };

        // CORREÇÃO CRUCIAL: Remove o Blob e envia o JSON como STRING.
        // O backend (Java) será corrigido em seguida para ler esta string.
        formData.append('dados', JSON.stringify(metadados)); 
        
        // 3. Configuração da Requisição
        const config = {
            headers: { 
                Authorization: `Bearer ${token}`,
                // 'Content-Type': 'multipart/form-data' é omitido, o browser o define.
            }
        };

        if (isEditing) {
            // Modo Edição: PUT
            await axios.put(`/atletas/${id}`, formData, config);
            alert('Atleta atualizada com sucesso! (Nova foto, se houver, adicionada à galeria)');
        } else {
            // Modo Criação: POST
            await axios.post('/atletas', formData, config);
            alert('Atleta criada com sucesso!');
        }
        
        setUploading(false);
        navigate('/admin/dashboard'); 

    } catch (err) {
        setUploading(false);
        setError('Ocorreu um erro ao salvar ou fazer o upload. Verifique as credenciais.');
        console.error(err);
    }
  };

  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>
      <form onSubmit={handleSubmit} className="atleta-form">
        
        {/* CAMPOS DE TEXTO PRINCIPAIS */}
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input type="text" name="nome" value={atleta.nome} onChange={handleChange} required disabled={uploading} />
        </div>
        <div className="form-group">
          <label htmlFor="modalidade">Modalidade:</label>
          <input type="text" name="modalidade" value={atleta.modalidade} onChange={handleChange} disabled={uploading} />
        </div>
        <div className="form-group">
          <label htmlFor="biografia">Biografia:</label>
          <textarea name="biografia" value={atleta.biografia} onChange={handleChange} disabled={uploading}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="competicao">Competições:</label>
          <input type="text" name="competicao" value={atleta.competicao} onChange={handleChange} disabled={uploading} />
        </div>

        {/* --- NOVOS CAMPOS DE UPLOAD DE ARQUIVO --- */}
        <h3>Adicionar Foto ao Acervo</h3>
        
        {/* CAMPO UPLOAD DE ARQUIVO */}
        <div className="form-group">
          <label htmlFor="file-upload">Selecione a Imagem (JPG/PNG):</label>
          <input 
            type="file" 
            id="file-upload" 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg" 
            disabled={uploading}
          />
          {file && <p className="info-message">Arquivo pronto para upload: <strong>{file.name}</strong></p>}
        </div>
        
        {/* CAMPO LEGENDA */}
        <div className="form-group">
          <label htmlFor="legenda">Legenda para esta Foto:</label>
          <input 
            type="text" 
            name="legenda" 
            value={legenda} 
            onChange={(e) => setLegenda(e.target.value)} 
            placeholder="Ex: Maria Lenk nos Jogos de 1932"
            disabled={uploading}
          />
        </div>
        {/* --- FIM DOS NOVOS CAMPOS --- */}

        {uploading && <p className="info-message">A carregar imagem e salvar dados... Por favor, aguarde.</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
            <button type="submit" className="btn-action" disabled={uploading}>
                {uploading ? 'Aguarde...' : isEditing ? 'Salvar Alterações' : 'Criar Atleta'}
            </button>
            <button type="button" className="btn-action btn-secondary" onClick={() => navigate('/admin/dashboard')} disabled={uploading}>Voltar</button>
        </div>
      </form>
    </div>
  );
}

export default AtletaForm;
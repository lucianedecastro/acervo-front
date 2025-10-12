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
            setFotos(fotosDaApi.map(foto => ({
              ...foto,
              preview: foto.url,
              isExisting: true,
              file: null
            })));
          }
        }
      } catch (err) {
        setError('Não foi possível carregar os dados necessários para o formulário.');
      }
    };
    fetchInitialData();
  }, [id, isEditing, token]);

  // ... (o restante das funções handle... permanecem as mesmas)
  const handleChange = (e) => setAtleta(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => { /* ...código sem alteração... */ };
  const handleLegendaChange = (id, legenda) => { /* ...código sem alteração... */ };
  const handleDefinirDestaque = (id) => { /* ...código sem alteração... */ };
  const handleRemoverFoto = (id) => { /* ...código sem alteração... */ };
  const handleSubmit = async (e) => { /* ...código sem alteração... */ };


  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>
      <form onSubmit={handleSubmit} className="atleta-form">
        <div className="form-group"><label>Nome:</label><input type="text" name="nome" value={atleta.nome} onChange={handleChange} required disabled={uploading}/></div>
        
        {/* ✅ CAMPO DE MODALIDADE AGORA É UM DROPDOWN */}
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
        
        {/* ... (o restante do JSX para galeria, botões, etc. permanece o mesmo) ... */}
      </form>
    </div>
  );
}

export default AtletaForm;
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

function AtletaForm() {
  const { id } = useParams(); // Pega o 'id' da URL, se for uma edição
  const navigate = useNavigate();
  const { token } = useAuth();

  const [atleta, setAtleta] = useState({
    nome: '',
    modalidade: '',
    biografia: '',
    competicao: '',
    imagemUrl: ''
  });
  const [error, setError] = useState(null);

  const isEditing = Boolean(id); // Verifica se estamos no modo de edição

  useEffect(() => {
    if (isEditing) {
      // Se estiver a editar, busca os dados da atleta para preencher o formulário
      const fetchAtleta = async () => {
        try {
          const response = await axios.get(`${API_URL}/atletas/${id}`);
          setAtleta(response.data);
        } catch (err) {
          setError('Não foi possível carregar os dados da atleta.');
        }
      };
      fetchAtleta();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtleta(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      if (isEditing) {
        // Modo Edição: usa o método PUT
        await axios.put(`${API_URL}/atletas/${id}`, atleta, config);
        alert('Atleta atualizada com sucesso!');
      } else {
        // Modo Criação: usa o método POST
        await axios.post(`${API_URL}/atletas`, atleta, config);
        alert('Atleta criada com sucesso!');
      }
      navigate('/admin/dashboard'); // Volta para o painel após o sucesso
    } catch (err) {
      setError('Ocorreu um erro ao salvar. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="pagina-conteudo">
      <h2>{isEditing ? 'Editar Atleta' : 'Criar Nova Atleta'}</h2>
      <form onSubmit={handleSubmit} className="atleta-form">
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input type="text" name="nome" value={atleta.nome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="modalidade">Modalidade:</label>
          <input type="text" name="modalidade" value={atleta.modalidade} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="biografia">Biografia:</label>
          <textarea name="biografia" value={atleta.biografia} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="competicao">Competições:</label>
          <input type="text" name="competicao" value={atleta.competicao} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="imagemUrl">URL da Imagem:</label>
          <input type="text" name="imagemUrl" value={atleta.imagemUrl} onChange={handleChange} />
        </div>
        
        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
            <button type="submit" className="btn-action">{isEditing ? 'Salvar Alterações' : 'Criar Atleta'}</button>
            <button type="button" className="btn-action btn-secondary" onClick={() => navigate('/admin/dashboard')}>Voltar</button>
        </div>
      </form>
    </div>
  );
}

export default AtletaForm;
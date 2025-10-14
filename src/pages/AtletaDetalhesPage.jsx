// src/pages/AtletaDetalhesPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function AtletaDetalhesPage() {
  // useParams() é a ferramenta mágica que lê o ID diretamente da URL do navegador.
  const { id } = useParams(); 
  
  const [atleta, setAtleta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAtleta = async () => {
      try {
        setLoading(true);
        // Usamos o ID da URL para pedir à API os dados de UMA SÓ atleta.
        const response = await axios.get(`/atletas/${id}`);
        setAtleta(response.data);
      } catch (err) {
        setError('Não foi possível carregar os dados da atleta. Tente novamente.');
        console.error("Erro ao buscar detalhes da atleta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAtleta();
  }, [id]); // Este [id] garante que se o ID mudar, a busca acontece de novo.

  // Estas verificações evitam a tela branca!
  if (loading) {
    return <div className="pagina-conteudo">Carregando informações...</div>;
  }

  if (error) {
    return <div className="pagina-conteudo error-message">{error}</div>;
  }

  if (!atleta) {
    return (
      <div className="pagina-conteudo">
        <h2>Atleta não encontrada</h2>
        <Link to="/atletas" className="btn-action">Voltar para a lista</Link>
      </div>
    );
  }

  // Se tudo deu certo, mostramos a página completa.
  return (
    <div className="pagina-conteudo content-box">
      <img 
        src={atleta.fotoDestaqueUrl || atleta.fotos?.[0]?.url} 
        alt={`Foto de ${atleta.nome}`} 
        style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }} 
      />
      <h1>{atleta.nome}</h1>
      <p style={{ marginTop: '-1rem', color: 'var(--cor-primaria)', fontWeight: 'bold' }}>{atleta.modalidade}</p>
      
      <section>
        <h3>Biografia</h3>
        <p>{atleta.biografia || "Biografia não disponível."}</p>
      </section>
      
      <section>
        <h3>Competições e Títulos</h3>
        <p>{atleta.competicao || "Informações não disponíveis."}</p>
      </section>
      
      {/* Aqui você pode adicionar a galeria de fotos completa no futuro */}
      
      <Link to="/atletas" className="btn-action btn-secondary" style={{ marginTop: '2rem' }}>
        &larr; Voltar para todas as atletas
      </Link>
    </div>
  );
}

export default AtletaDetalhesPage;
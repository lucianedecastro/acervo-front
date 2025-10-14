import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AtletaCard from '../components/AtletaCard';

function ModalidadeDetailPage() {
  const { id } = useParams();
  const [modalidade, setModalidade] = useState(null);
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [modalidadeResponse, atletasResponse] = await Promise.all([
          axios.get(`/modalidades/${id}`),
          axios.get('/atletas')
        ]);
        setModalidade(modalidadeResponse.data);
        const atletasFiltradas = atletasResponse.data.filter(
          atleta => atleta.modalidade === modalidadeResponse.data.nome
        );
        setAtletas(atletasFiltradas);
      } catch (err) {
        console.error('Erro ao carregar dados da modalidade:', err);
        setError("Modalidade não encontrada ou falha ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="pagina-conteudo">Carregando...</div>;
  if (error) return <div className="pagina-conteudo error-message">{error}</div>;
  if (!modalidade) return <div className="pagina-conteudo">Modalidade não encontrada.</div>;

  return (
    <div className="pagina-conteudo">
      <div className="modalidade-hero content-box">
        <div className="modalidade-header">
          {modalidade.pictogramaUrl ? (
            <img src={modalidade.pictogramaUrl} alt={modalidade.nome} className="pictograma-detalhe" />
          ) : (
            <div className="pictograma-placeholder">🏆</div>
          )}
          <div className="modalidade-info">
            <h1>{modalidade.nome}</h1>
            <p>{atletas.length} atleta(s) nesta modalidade</p>
          </div>
        </div>
      </div>
      <section className="historia-modalidade content-box">
        <h2>História da Modalidade</h2>
        <div className="conteudo-rico" dangerouslySetInnerHTML={{ __html: modalidade.historia }} />
      </section>
      <section className="atletas-modalidade">
        <h2>Atletas Destacadas</h2>
        {atletas.length > 0 ? (
          <div className="lista-atletas">
            {atletas.map(atleta => <AtletaCard key={atleta.id} atleta={atleta} />)}
          </div>
        ) : (
          <div className="content-box"><p>Nenhuma atleta cadastrada nesta modalidade ainda.</p></div>
        )}
      </section>
      <div className="navigation-links" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/modalidades" className="btn-action btn-secondary">← Voltar para Todas as Modalidades</Link>
      </div>
    </div>
  );
}

export default ModalidadeDetailPage;
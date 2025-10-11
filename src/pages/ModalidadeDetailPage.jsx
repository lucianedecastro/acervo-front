import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AtletaCard from '../components/AtletaCard';
// REMOVIDO: RichTextEditor e useAuth não são mais necessários nesta página.

function ModalidadeDetailPage() {
  const { id } = useParams();
  const [modalidade, setModalidade] = useState(null);
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  // REMOVIDO: 'editMode' e 'tempHistoria' foram removidos.

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mantemos os dados mockados por enquanto. No futuro, isso será uma chamada de API.
        const mockModalidades = {
          '1': { 
            id: '1', 
            nome: 'Natação', 
            pictogramaUrl: null, 
            historia: `
              <h3>As Pioneiras da Natação Feminina Brasileira</h3>
              <p>A participação das mulheres brasileiras na natação começou nas primeiras décadas do século XX, enfrentando preconceitos e limitações sociais. As primeiras competições femininas foram organizadas nos anos 1920, mas apenas em 1932 as nadadoras brasileiras tiveram sua primeira oportunidade olímpica.</p>
              <h3>Maria Lenk - A Trailblazer</h3>
              <p>Maria Lenk tornou-se não apenas a primeira nadadora brasileira a competir em Olimpíadas, mas também a primeira mulher da América do Sul a participar dos Jogos Olímpicos. Sua participação em Los Angeles 1932 marcou o início de uma nova era para o esporte feminino no país.</p>
            `
          },
          '2': { id: '2', nome: 'Atletismo', historia: `<h3>As Pioneiras do Atletismo Feminino</h3><p>O atletismo feminino no Brasil começou a ganhar força nas décadas de 1940 e 1950.</p>` },
          '3': { id: '3', nome: 'Ginástica', historia: '<p>História da ginástica feminina no Brasil...</p>' },
          '4': { id: '4', nome: 'Futebol', historia: '<p>História do futebol feminino no Brasil...</p>' }
        };

        const modalidadeData = mockModalidades[id];
        setModalidade(modalidadeData);
        
        const mockAtletas = [
          {
            id: '1',
            nome: 'Maria Lenk',
            modalidade: 'Natação',
            biografia: 'Pioneira da natação brasileira...',
            competicao: 'Jogos Olímpicos de 1932 (Los Angeles)',
            fotos: [{ url: 'https://storage.googleapis.com/acervo-carmen-lydia-fotos/atletas_imagens/maria-lenk.jpg', legenda: 'Maria Lenk em competição' }]
          }
        ];
        // Filtra as atletas para mostrar apenas as da modalidade atual
        const atletasFiltradas = mockAtletas.filter(atleta => atleta.modalidade === modalidadeData.nome);
        setAtletas(atletasFiltradas);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  
  // REMOVIDO: Funções de handleEditToggle, handleSave e handleCancel.

  if (loading) return <div className="pagina-conteudo">Carregando...</div>;
  if (!modalidade) return <div className="pagina-conteudo">Modalidade não encontrada.</div>;

  return (
    <div className="pagina-conteudo">
      <div className="modalidade-hero content-box">
        <div className="modalidade-header">
          {modalidade.pictogramaUrl ? (
            <img src={modalidade.pictogramaUrl} alt={modalidade.nome} className="hero-pictograma" />
          ) : (
            <div className="pictograma-placeholder hero">
              {modalidade.nome === 'Natação' && '🏊‍♀️'}
              {modalidade.nome === 'Atletismo' && '🏃‍♀️'}
              {modalidade.nome === 'Ginástica' && '🤸‍♀️'}
              {modalidade.nome === 'Futebol' && '⚽'}
            </div>
          )}
          <div className="modalidade-info">
            <h1>{modalidade.nome}</h1>
            <p>{atletas.length} atleta(s) nesta modalidade</p>
          </div>
        </div>
        {/* REMOVIDO: Botão de "Editar História" */}
      </div>

      <section className="historia-modalidade content-box">
        <h2>História da Modalidade</h2>
        {/* LÓGICA SIMPLIFICADA: Apenas exibe o conteúdo */}
        <div 
          className="conteudo-rico" 
          dangerouslySetInnerHTML={{ __html: modalidade.historia }} 
        />
      </section>

      <section className="atletas-modalidade">
        <h2>Atletas Destacadas</h2>
        {atletas.length > 0 ? (
          <div className="lista-atletas">
            {atletas.map(atleta => (
              <AtletaCard key={atleta.id} atleta={atleta} />
            ))}
          </div>
        ) : (
          <div className="content-box">
            <p>Nenhuma atleta cadastrada nesta modalidade ainda.</p>
          </div>
        )}
      </section>

      <div className="navigation-links" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/modalidades" className="btn-action btn-secondary">
          ← Voltar para Todas as Modalidades
        </Link>
      </div>
    </div>
  );
}

export default ModalidadeDetailPage;
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import AtletaCard from '../components/AtletaCard';
import RichTextEditor from '../components/RichTextEditor';

function ModalidadeDetailPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const [modalidade, setModalidade] = useState(null);
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [tempHistoria, setTempHistoria] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
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
              
              <h3>Conquistas Históricas</h3>
              <p>Nas décadas seguintes, atletas como <strong>Piedade Coutinho</strong> e <strong>Sônia Olímpia</strong> continuaram abrindo caminho para as gerações futuras, estabelecendo recordes e demonstrando a força das mulheres na natação competitiva.</p>
              
              <h4>Principais Conquistas</h4>
              <ul>
                <li>1932 - Primeira participação olímpica feminina</li>
                <li>1950 - Primeiros recordes sul-americanos</li>
                <li>1970 - Consolidação no cenário internacional</li>
              </ul>
              
              <blockquote>
                "A natação feminina brasileira sempre foi marcada pela coragem de mulheres que desafiaram seu tempo."
              </blockquote>
            `
          },
          '2': { 
            id: '2', 
            nome: 'Atletismo', 
            pictogramaUrl: null, 
            historia: `
              <h3>As Pioneiras do Atletismo Feminino</h3>
              <p>O atletismo feminino no Brasil começou a ganhar força nas décadas de 1940 e 1950, com atletas que superaram barreiras sociais e esportivas.</p>
              
              <h4>Modalidades Iniciais</h4>
              <ul>
                <li>Corridas de velocidade</li>
                <li>Saltos em distância</li>
                <li>Arremesso de peso</li>
              </ul>
            ` 
          },
          '3': { 
            id: '3', 
            nome: 'Ginástica', 
            pictogramaUrl: null, 
            historia: '<p>História da ginástica feminina no Brasil...</p>' 
          },
          '4': { 
            id: '4', 
            nome: 'Futebol', 
            pictogramaUrl: null, 
            historia: '<p>História do futebol feminino no Brasil...</p>' 
          }
        };

        const modalidadeData = mockModalidades[id];
        setModalidade(modalidadeData);
        setTempHistoria(modalidadeData.historia);
        
        const mockAtletas = [
          {
            id: '1',
            nome: 'Maria Lenk',
            modalidade: 'Natação',
            biografia: 'Pioneira da natação brasileira, primeira mulher sul-americana a competir em Olimpíadas. Nascida em 1915, começou a nadar aos 10 anos e rapidamente se destacou nas competições nacionais.',
            competicao: 'Jogos Olímpicos de 1932 (Los Angeles)',
            fotos: [{ url: 'https://storage.googleapis.com/acervo-carmen-lydia-fotos/atletas_imagens/maria-lenk.jpg', legenda: 'Maria Lenk em competição' }]
          }
        ];
        setAtletas(mockAtletas);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setTempHistoria(modalidade.historia);
    }
  };

  const handleSave = () => {
    setModalidade({ ...modalidade, historia: tempHistoria });
    setEditMode(false);
    console.log('Salvando história:', tempHistoria);
  };

  const handleCancel = () => {
    setTempHistoria(modalidade.historia);
    setEditMode(false);
  };

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
            <p>{atletas.length} atletas nesta modalidade</p>
          </div>
        </div>
        
        {token && (
          <div className="modalidade-actions">
            <button 
              onClick={handleEditToggle}
              className={`btn-action ${editMode ? 'btn-secondary' : 'btn-edit'}`}
            >
              {editMode ? '❌ Cancelar Edição' : '✏️ Editar História'}
            </button>
          </div>
        )}
      </div>

      <section className="historia-modalidade content-box">
        <h2>História da Modalidade</h2>
        
        {editMode ? (
          <div className="editor-container">
            <RichTextEditor
              value={tempHistoria}
              onChange={setTempHistoria}
              placeholder="Conte a história das primeiras participações femininas nesta modalidade..."
            />
            <div className="editor-actions">
              <button onClick={handleSave} className="btn-action">
                💾 Salvar Alterações
              </button>
              <button onClick={handleCancel} className="btn-action btn-secondary">
                ↩️ Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="conteudo-rico" 
            dangerouslySetInnerHTML={{ __html: modalidade.historia }} 
          />
        )}
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
            <Link to="/admin/atletas/novo" className="btn-action btn-create">
              Adicionar Primeira Atleta
            </Link>
          </div>
        )}
      </section>

      <div className="navigation-links">
        <Link to="/modalidades" className="btn-action btn-secondary">
          ← Voltar para Modalidades
        </Link>
      </div>
    </div>
  );
}

export default ModalidadeDetailPage;
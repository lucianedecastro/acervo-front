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
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempHistoria, setTempHistoria] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        // Mock data - substituir por API real quando disponível
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
                <li><strong>1932</strong> - Primeira participação olímpica feminina</li>
                <li><strong>1950</strong> - Primeiros recordes sul-americanos</li>
                <li><strong>1970</strong> - Consolidação no cenário internacional</li>
                <li><strong>1980</strong> - Primeiras medalhas em Pan-Americanos</li>
              </ul>
              
              <blockquote>
                "A natação feminina brasileira sempre foi marcada pela coragem de mulheres que desafiaram seu tempo."
              </blockquote>
              
              <h3>Impacto Social</h3>
              <p>A trajetória das nadadoras pioneiras não apenas abriu caminhos no esporte, mas também contribuiu para a discussão sobre o papel da mulher na sociedade brasileira, inspirando gerações futuras.</p>
            `,
            corDestaque: '#008080'
          },
          '2': { 
            id: '2', 
            nome: 'Atletismo', 
            pictogramaUrl: null, 
            historia: `
              <h3>As Pioneiras do Atletismo Feminino</h3>
              <p>O atletismo feminino no Brasil começou a ganhar força nas décadas de 1940 e 1950, com atletas que superaram barreiras sociais e esportivas para competir em provas de pista e campo.</p>
              
              <h4>Modalidades Iniciais</h4>
              <ul>
                <li><strong>Corridas de velocidade</strong> - 100m, 200m</li>
                <li><strong>Saltos em distância</strong> - Salto em distância, salto triplo</li>
                <li><strong>Arremesso de peso</strong> e lançamento de dardo</li>
                <li><strong>Corridas com barreiras</strong> - 100m com barreiras</li>
              </ul>
              
              <h3>Destaques Históricos</h3>
              <p>Atletas como Aída dos Santos foram fundamentais para consolidar a presença feminina no atletismo nacional e internacional.</p>
            `,
            corDestaque: '#E53E3E'
          },
          '3': { 
            id: '3', 
            nome: 'Ginástica', 
            pictogramaUrl: null, 
            historia: `
              <h3>A Ginástica Artística Feminina no Brasil</h3>
              <p>A ginástica artística feminina desenvolveu-se no Brasil com atletas que combinaram força, graça e técnica em performances memoráveis.</p>
              
              <h4>Aparelhos Tradicionais</h4>
              <ul>
                <li><strong>Solo</strong> - Coreografias com música</li>
                <li><strong>Trave</strong> - Equilíbrio e precisão</li>
                <li><strong>Barras assimétricas</strong> - Força e coordenação</li>
                <li><strong>Salto sobre a mesa</strong> - Potência e altura</li>
              </ul>
              
              <blockquote>
                "A ginástica é a arte de transformar força em beleza."
              </blockquote>
            `,
            corDestaque: '#805AD5'
          },
          '4': { 
            id: '4', 
            nome: 'Futebol', 
            pictogramaUrl: null, 
            historia: `
              <h3>O Futebol Feminino Brasileiro</h3>
              <p>O futebol feminino enfrentou muitas resistências no Brasil, mas hoje é uma das modalidades que mais cresce e conquista espaço no cenário esportivo nacional.</p>
              
              <h4>Marcos Importantes</h4>
              <ul>
                <li><strong>Década de 1980</strong> - Primeiras competições organizadas</li>
                <li><strong>1991</strong> - Primeira Copa do Mundo Feminina</li>
                <li><strong>1996</strong> - Estreia em Olimpíadas</li>
                <li><strong>2007</strong> - Vice-campeonato mundial</li>
              </ul>
              
              <h3>Lendas do Futebol Feminino</h3>
              <p>Jogadoras como Marta, Formiga e Cristiane tornaram-se referências mundiais e inspiração para milhões de meninas.</p>
            `,
            corDestaque: '#38A169'
          }
        };

        const modalidadeData = mockModalidades[id];
        
        if (!modalidadeData) {
          throw new Error('Modalidade não encontrada');
        }
        
        setModalidade(modalidadeData);
        setTempHistoria(modalidadeData.historia);
        
        // Buscar atletas desta modalidade (mock - substituir por API)
        const mockAtletas = [
          {
            id: '1',
            nome: 'Maria Lenk',
            modalidade: 'Natação',
            biografia: 'Pioneira da natação brasileira, primeira mulher sul-americana a competir em Olimpíadas. Nascida em 1915, começou a nadar aos 10 anos e rapidamente se destacou nas competições nacionais. Participou dos Jogos Olímpicos de Los Angeles em 1932, marcando o início da participação feminina brasileira em Olimpíadas.',
            competicao: 'Jogos Olímpicos de 1932 (Los Angeles)',
            fotos: [{ 
              url: 'https://storage.googleapis.com/acervo-carmen-lydia-fotos/atletas_imagens/maria-lenk.jpg', 
              legenda: 'Maria Lenk em competição nos anos 1930',
              ehDestaque: true
            }]
          },
          {
            id: '2',
            nome: 'Piedade Coutinho',
            modalidade: 'Natação',
            biografia: 'Nadadora brasileira que se destacou nas décadas de 1940 e 1950, sendo uma das principais representantes do país em competições internacionais.',
            competicao: 'Jogos Pan-Americanos, Campeonatos Sul-Americanos',
            fotos: [{ 
              url: 'https://via.placeholder.com/300x200/4A5568/FFFFFF?text=Piedade+Coutinho', 
              legenda: 'Piedade Coutinho em treinamento'
            }]
          }
        ].filter(atleta => atleta.modalidade === modalidadeData.nome);
        
        setAtletas(mockAtletas);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Não foi possível carregar os dados da modalidade. Tente novamente.');
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
    // Aqui você faria a chamada API para salvar no backend
    console.log('Salvando história:', tempHistoria);
  };

  const handleCancel = () => {
    setTempHistoria(modalidade.historia);
    setEditMode(false);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  const getModalidadeIcon = (nome) => {
    const icons = {
      'Natação': '🏊‍♀️',
      'Atletismo': '🏃‍♀️',
      'Ginástica': '🤸‍♀️',
      'Futebol': '⚽',
      'Vôlei': '🏐',
      'Basquete': '🏀'
    };
    return icons[nome] || '🏆';
  };

  if (loading) {
    return (
      <div className="pagina-conteudo">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando modalidade...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pagina-conteudo">
        <div className="error-container content-box">
          <div className="error-icon">⚠️</div>
          <h2>Modalidade não encontrada</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="btn-action">
              Tentar Novamente
            </button>
            <Link to="/modalidades" className="btn-action btn-secondary">
              Voltar para Modalidades
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!modalidade) {
    return (
      <div className="pagina-conteudo">
        <div className="error-container content-box">
          <div className="error-icon">❓</div>
          <h2>Modalidade não encontrada</h2>
          <p>A modalidade que você está procurando não existe ou foi removida.</p>
          <Link to="/modalidades" className="btn-action">
            Explorar Modalidades
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-conteudo">
      {/* 🎯 HEADER DA MODALIDADE */}
      <div 
        className="modalidade-hero"
        style={{ '--cor-destaque': modalidade.corDestaque || '#008080' }}
      >
        <div className="modalidade-hero-content content-box">
          <div className="modalidade-header">
            <div className="modalidade-icon-large">
              <div className="pictograma-container-large">
                {modalidade.pictogramaUrl ? (
                  <img 
                    src={modalidade.pictogramaUrl} 
                    alt={`Pictograma ${modalidade.nome}`}
                    className="modalidade-pictograma-large"
                  />
                ) : (
                  <div className="pictograma-placeholder-large">
                    {getModalidadeIcon(modalidade.nome)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modalidade-info">
              <h1 className="modalidade-titulo">{modalidade.nome}</h1>
              <div className="modalidade-meta">
                <span className="atleta-count-badge">
                  {atletas.length} {atletas.length === 1 ? 'atleta' : 'atletas'} no acervo
                </span>
                <span className="modalidade-category">Esporte Olímpico</span>
              </div>
              <p className="modalidade-intro">
                Descubra a história das mulheres pioneiras que marcaram esta modalidade no Brasil.
              </p>
            </div>
          </div>
          
          {/* 🎯 AÇÕES DO ADMIN */}
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
      </div>

      {/* 🎯 HISTÓRIA DA MODALIDADE */}
      <section className="historia-modalidade content-box">
        <div className="section-header">
          <h2>História da Modalidade</h2>
          <p className="section-subtitle">
            A trajetória das mulheres no {modalidade.nome.toLowerCase()} brasileiro
          </p>
        </div>
        
        {editMode ? (
          <div className="editor-container">
            <RichTextEditor
              value={tempHistoria}
              onChange={setTempHistoria}
              placeholder={`Conte a história das primeiras participações femininas no ${modalidade.nome.toLowerCase()}...`}
            />
            <div className="editor-actions">
              <button onClick={handleSave} className="btn-action">
                💾 Salvar Alterações
              </button>
              <button onClick={handleCancel} className="btn-action btn-secondary">
                ↩️ Descartar Alterações
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

      {/* 🎯 ATLETAS DESTA MODALIDADE */}
      <section className="atletas-modalidade">
        <div className="section-header">
          <h2>Atletas Destacadas</h2>
          <p className="section-subtitle">
            Conheça as mulheres que fizeram história no {modalidade.nome.toLowerCase()}
          </p>
        </div>

        {atletas.length > 0 ? (
          <div className="atletas-grid">
            {atletas.map(atleta => (
              <AtletaCard 
                key={atleta.id} 
                atleta={atleta}
                compact={true}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state content-box">
            <div className="empty-icon">👥</div>
            <h3>Nenhuma atleta cadastrada</h3>
            <p>
              Ainda não há atletas cadastradas para a modalidade de {modalidade.nome.toLowerCase()}.
              {token && ' Você pode adicionar a primeira atleta usando o botão abaixo.'}
            </p>
            {token && (
              <div className="empty-actions">
                <Link to="/admin/atletas/novo" className="btn-action btn-create">
                  ➕ Adicionar Primeira Atleta
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 🎯 NAVEGAÇÃO */}
      <div className="page-navigation">
        <Link to="/modalidades" className="btn-action btn-secondary btn-large">
          ← Voltar para Todas as Modalidades
        </Link>
        
        {atletas.length > 0 && (
          <Link to="/atletas" className="btn-action btn-large">
            Explorar Todas as Atletas →
          </Link>
        )}
      </div>

      {/* 🎯 PIE DE PÁGINA INFORMATIVO */}
      <div className="page-footer-info content-box">
        <h3>💡 Mais sobre o {modalidade.nome}</h3>
        <p>
          Esta página faz parte do Acervo Carmen Lydia, dedicado a preservar a memória 
          das mulheres pioneiras no esporte brasileiro. 
          {token && ' Como administrador, você pode editar este conteúdo usando o botão "Editar História".'}
        </p>
      </div>
    </div>
  );
}

export default ModalidadeDetailPage;
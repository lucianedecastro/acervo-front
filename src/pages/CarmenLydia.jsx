import React from 'react';
import { useNavigate } from 'react-router-dom';

function CarmenLydia() {
  const navigate = useNavigate();

  return (
    <div className="pagina-conteudo">
      <div className="content-box">
        <h2>Quem Foi Carmen Lydia?</h2>
        <p>
          No início do século XX, numa época em que a participação feminina nos esportes era rara e frequentemente criticada, uma jovem chamada <strong>Carmen Lydia</strong> se destacou nos cenários da alta sociedade do Rio de Janeiro e São Paulo. Ela não era apenas uma talentosa dançarina, mas também uma ávida nadadora e saltadora.
        </p>
        
        <h3>Pioneirismo nas Águas e nas Artes</h3>
        <p>
          A imprensa da década de 1910 acompanhava de perto suas atividades, registrando tanto suas apresentações de dança nos salões quanto suas performances na Praia de Botafogo. Carmen Lydia tornou-se notícia em jornais e até em publicações infantis como "O Tico Tico", sendo reconhecida por suas habilidades e por desafiar as convenções sociais da época, especialmente pelo uso do maiô para a prática de esportes, o que gerava tanto repúdio quanto aprovação.
        </p>

        <h3>Resistência e Legado</h3>
        <p>
          Apesar de seu talento e da visibilidade na mídia, Carmen Lydia enfrentou barreiras. Seu pedido para competir oficialmente em natação nos Jogos Olímpicos da Antuérpia, em 1920, foi negado, um reflexo dos desafios enfrentados pelas mulheres no esporte naquela época. Após seu casamento, seu nome desapareceu da vida pública por quase vinte anos.
        </p>
        <p>
          O nome deste acervo é uma homenagem a Carmen Lydia e a todas as mulheres como ela: pioneiras que abriram caminho, muitas vezes sem o reconhecimento devido, e cuja história de arte, esporte e resistência merece ser preservada e celebrada.
        </p>

        <button className="btn-action btn-secondary" onClick={() => navigate(-1)} style={{ marginTop: '2rem' }}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default CarmenLydia;
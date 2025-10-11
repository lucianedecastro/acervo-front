import React from 'react';
import { Link } from 'react-router-dom';

function Sobre() {
  return (
    <div className="pagina-conteudo">
      <div className="content-box">
        <h2>Sobre o Acervo</h2>
        <p><strong>Este projeto é um protótipo em desenvolvimento.</strong></p>
        
        <h3>Propósito</h3>
        <p>
          O propósito do Acervo <Link to="/carmen-lydia">"Carmen Lydia"</Link> da Mulher Brasileira no Esporte é visibilizar as mulheres do esporte brasileiro para além das atletas icônicas, abrindo espaço para as atletas que participaram de eventos esportivos desde o fim do século XIX e cujos nomes não são valorizados como se deve.
        </p>

        <h3>Um Espaço de Pesquisa e Colaboração</h3>
        <p>
          Este é um espaço de pesquisa para todos os públicos interessados no tema. Além disso, damos a oportunidade de mulheres ou seus herdeiros e herdeiras, enviarem suas histórias (desde que participantes de competições oficiais) para análise da nossa curadoria, enriquecendo continuamente o nosso banco de dados.
        </p>

        <h3>Diferenciais</h3>
        <ul>
          <li>Ser um banco de dados inédito sobre as mulheres do esporte brasileiro com recorte a partir de 1900.</li>
          <li>Ser uma futura referência como fonte de pesquisa para estudantes, jornalistas e pesquisadores.</li>
        </ul>
      </div>
    </div>
  );
}

export default Sobre;
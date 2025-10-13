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

        {/* ======================================================= */}
        {/* ✅ SUA HISTÓRIA INSERIDA AQUI ✅                      */}
        {/* ======================================================= */}
        <h3>Como nasce a ideia do Acervo</h3>
        <p>
          Em 2020, a partir de uma pesquisa para um trabalho específico, me debrucei sobre os jornais do início do século XX. Por lá, encontrei notas sobre as primeiras competições femininas na natação e muitos nomes que jamais ouvi falar. Prossegui na pesquisa e me deparei com contemporâneas de Maria Lenk, mulheres que, com certeza, auxiliaram nossa icônica nadadora a galgar sua espetacular trajetória.
        </p>
        <p>
          A pergunta que me fiz, imediatamente: <em>para que atletas como Maria Lenk, Maria Esther Bueno, Aida dos Santos, entre tantas outras de destaque, pudessem alcançar seus feitos, elas precisaram de adversárias brasileiras. Quem foram, quem são e onde estão essas mulheres na memória coletiva do esporte nacional?</em>
        </p>
        <p>
          Como pesquisadora e como curadora de exposições desde 2015, me fiz mais uma pergunta: <em>como fazer com que as pesquisas e seus produtos finais, alcancem mais pessoas e fiquem disponíveis por mais tempo?</em>
        </p>
        <p>
          A resposta: <strong>um acervo digital!</strong>
        </p>
        <p>
          Apresentei a ideia ao grande parceiro Sesc SP, que não se limitou a gostar da ideia, mas fez um primeiro investimento na minha ideia. Com a enormidade do trabalho - o recorte de tempo do Acervo é 1900 - não foi possível prosseguir com o Sesc SP, mas a ideia de colocar o Acervo 'Carmen Lydia' da Mulher Brasileira no Esporte de pé, jamais me abandonou.
        </p>
        <p>
          Hoje, com muito suor, lágrimas e muitos bugs resolvidos, o protótipo está no ar. Ainda em construção, pois o trabalho é gigante, <strong>mas no ar!</strong>
        </p>
        <p>
          A história das mulheres no esporte brasileiro é profunda e importante. Não pode se limitar aos ícones e recordes, pois sem as adversárias, grandes nomes não existiriam.
        </p>
        <p style={{ marginTop: '2rem', textAlign: 'right' }}>
          <em>Com muito respeito,</em><br />
          <strong>Lu Castro</strong><br />
          2025
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
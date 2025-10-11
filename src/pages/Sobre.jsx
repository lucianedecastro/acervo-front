import React from 'react';
import { Link } from 'react-router-dom';

function Sobre() {
  return (
    <div className="pagina-conteudo">
      {/* 🎯 HEADER DA PÁGINA */}
      <div className="page-header">
        <div className="header-content">
          <h1>Sobre o Acervo</h1>
          <p className="page-subtitle">
            Conheça a missão, propósito e diferenciais do Acervo Carmen Lydia da Mulher Brasileira no Esporte
          </p>
        </div>
      </div>

      {/* 🎯 CONTEÚDO PRINCIPAL */}
      <div className="sobre-container">
        {/* 🎯 ALERTA DE PROTÓTIPO */}
        <div className="prototype-alert content-box">
          <div className="alert-header">
            <span className="alert-icon">🚧</span>
            <h3>Projeto em Desenvolvimento</h3>
          </div>
          <p>
            <strong>Este é um protótipo em fase de desenvolvimento.</strong> Estamos trabalhando para 
            expandir o acervo e melhorar continuamente a plataforma.
          </p>
        </div>

        {/* 🎯 SEÇÃO DE PROPÓSITO */}
        <section className="sobre-section content-box">
          <div className="section-header">
            <h2>🎯 Propósito</h2>
            <p className="section-subtitle">
              Nossa missão de visibilização histórica
            </p>
          </div>
          
          <div className="text-content">
            <p>
              O propósito do Acervo <strong>"Carmen Lydia"</strong> da Mulher Brasileira no Esporte é visibilizar as mulheres do esporte brasileiro para além das atletas icônicas, abrindo espaço para as atletas que participaram de eventos esportivos desde o fim do século XIX e cujos nomes não são valorizados como se deve.
            </p>
          </div>
        </section>

        {/* 🎯 SEÇÃO DE PESQUISA E COLABORAÇÃO */}
        <section className="sobre-section content-box">
          <div className="section-header">
            <h2>🔍 Pesquisa & Colaboração</h2>
            <p className="section-subtitle">
              Um espaço coletivo de construção histórica
            </p>
          </div>
          
          <div className="text-content">
            <p>
              Este é um espaço de pesquisa para todos os públicos interessados no tema. Além disso, damos a oportunidade de mulheres ou seus herdeiros e herdeiras, enviarem suas histórias (desde que participantes de competições oficiais) para análise da nossa curadoria, enriquecendo continuamente o nosso banco de dados.
            </p>
          </div>

          <div className="collaboration-cta">
            <h4>💡 Quer colaborar?</h4>
            <p>
              Se você tem informações sobre atletas pioneiras ou deseja contribuir com o acervo, 
              entre em contato conosco através da nossa <Link to="/contato" className="inline-link">página de contato</Link>.
            </p>
          </div>
        </section>

        {/* 🎯 SEÇÃO DE DIFERENCIAIS */}
        <section className="sobre-section content-box">
          <div className="section-header">
            <h2>⭐ Diferenciais</h2>
            <p className="section-subtitle">
              O que torna nosso acervo único
            </p>
          </div>
          
          <div className="diferenciais-grid">
            <div className="diferencial-card">
              <div className="diferencial-icon">📊</div>
              <div className="diferencial-content">
                <h4>Banco de Dados Inédito</h4>
                <p>
                  Ser um banco de dados inédito sobre as mulheres do esporte brasileiro com recorte a partir de 1900.
                </p>
              </div>
            </div>

            <div className="diferencial-card">
              <div className="diferencial-icon">🎓</div>
              <div className="diferencial-content">
                <h4>Fonte de Referência</h4>
                <p>
                  Ser uma futura referência como fonte de pesquisa para estudantes, jornalistas e pesquisadores.
                </p>
              </div>
            </div>

            <div className="diferencial-card">
              <div className="diferencial-icon">👥</div>
              <div className="diferencial-content">
                <h4>Curadoria Coletiva</h4>
                <p>
                  Sistema colaborativo que permite a contribuição de familiares, pesquisadores e comunidade.
                </p>
              </div>
            </div>

            <div className="diferencial-card">
              <div className="diferencial-icon">🕰️</div>
              <div className="diferencial-content">
                <h4>Resgate Histórico</h4>
                <p>
                  Preservação da memória de atletas pioneiras que foram essenciais para o esporte brasileiro.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🎯 SEÇÃO DE VALORES */}
        <section className="sobre-section content-box">
          <div className="section-header">
            <h2>❤️ Nossos Valores</h2>
            <p className="section-subtitle">
              Princípios que guiam nosso trabalho
            </p>
          </div>
          
          <div className="valores-list">
            <div className="valor-item">
              <strong>📚 Transparência:</strong> Todas as informações são verificadas e documentadas
            </div>
            <div className="valor-item">
              <strong>🤝 Colaboração:</strong> Acreditamos no conhecimento construído coletivamente
            </div>
            <div className="valor-item">
              <strong>⚡ Inovação:</strong> Utilizamos tecnologia para preservar e divulgar histórias
            </div>
            <div className="valor-item">
              <strong>🎯 Precisão:</strong> Compromisso com a veracidade histórica dos dados
            </div>
          </div>
        </section>

        {/* 🎯 CALL TO ACTION */}
        <div className="cta-section content-box">
          <div className="cta-content">
            <h3>🚀 Faça Parte Desta História</h3>
            <p>
              Explore o acervo, conheça as trajetórias inspiradoras e contribua para preservar 
              a memória das mulheres que fizeram história no esporte brasileiro.
            </p>
            <div className="cta-actions">
              <Link to="/atletas" className="btn-action">
                👥 Conhecer as Atletas
              </Link>
              <Link to="/modalidades" className="btn-action btn-secondary">
                🏆 Explorar Modalidades
              </Link>
              <Link to="/contato" className="btn-action btn-edit">
                💬 Contribuir com o Acervo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 FOOTER INFORMATIVO */}
      <div className="page-footer-info content-box">
        <h3>💭 Sabia que?</h3>
        <p>
          O acervo leva o nome de <strong>Carmen Lydia</strong>, uma pioneira importante 
          no esporte brasileiro. Conheça mais sobre a história do projeto e nossa homenageada 
          na <Link to="/antessala" className="inline-link">página da Antessala</Link>.
        </p>
      </div>
    </div>
  );
}

export default Sobre;
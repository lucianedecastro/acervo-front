import { useState } from 'react';

function ContatoPage() {
  const [formData, setFormData] = useState({ 
    nome: '', 
    email: '', 
    assunto: '',
    mensagem: '' 
  });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    
    // Simular envio do formulário com delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Formulário enviado:', formData);
    setEnviado(true);
    setEnviando(false);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setEnviado(false);
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  return (
    <div className="pagina-conteudo">
      {/* 🎯 HEADER DA PÁGINA */}
      <div className="page-header">
        <div className="header-content">
          <h1>Contato</h1>
          <p className="page-subtitle">
            Tem dúvidas, sugestões ou quer colaborar com o acervo? Entre em contato conosco!
          </p>
        </div>
      </div>

      <div className="contact-container">
        {/* 🎯 FORMULÁRIO DE CONTATO */}
        <div className="contact-form-section content-box">
          <div className="section-header">
            <h2>Envie sua Mensagem</h2>
            <p className="section-subtitle">
              Preencha o formulário abaixo e retornaremos em breve
            </p>
          </div>
          
          {enviado ? (
            <div className="success-state">
              <div className="success-icon">✅</div>
              <h3>Mensagem Enviada!</h3>
              <p>Sua mensagem foi enviada com sucesso. Retornaremos em até 48 horas.</p>
              <div className="success-actions">
                <button 
                  onClick={() => {
                    setEnviado(false);
                    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
                  }}
                  className="btn-action"
                >
                  ✏️ Enviar Nova Mensagem
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nome" className="form-label">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="seu@email.com"
                    inputMode="email"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="assunto" className="form-label">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Qual o assunto da sua mensagem?"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="mensagem" className="form-label">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows="6"
                    required
                    className="form-textarea"
                    placeholder="Descreva sua dúvida, sugestão ou proposta de colaboração..."
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="btn-action btn-secondary"
                  disabled={enviando}
                >
                  🔄 Limpar
                </button>
                <button 
                  type="submit" 
                  className="btn-action"
                  disabled={enviando}
                >
                  {enviando ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Enviando...
                    </>
                  ) : (
                    '📤 Enviar Mensagem'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 🎯 INFORMAÇÕES DE CONTATO */}
        <div className="contact-info-section content-box">
          <div className="section-header">
            <h2>Outras Formas de Contato</h2>
            <p className="section-subtitle">
              Você também pode nos encontrar através destes canais
            </p>
          </div>
          
          <div className="contact-info-grid">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <h4>Email</h4>
                <p>luciane.castro@gmail.com</p>
                <small>Resposta em até 48h</small>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h4>Telefone/WhatsApp</h4>
                <p>(12) 98127-8043</p>
                <small>Segunda a Sexta, 9h-18h</small>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">💬</div>
              <div className="contact-details">
                <h4>Colaborações</h4>
                <p>luciane.castro@gmail.com</p>
                <small>Para propostas de parceria</small>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">🏛️</div>
              <div className="contact-details">
                <h4>Acervo Carmen Lydia</h4>
                <p>Projeto de preservação histórica</p>
                <small>Mulheres no esporte brasileiro</small>
              </div>
            </div>
          </div>

          {/* 🎯 INFORMAÇÕES ADICIONAIS */}
          <div className="additional-info">
            <h4>📋 Informações Importantes</h4>
            <ul className="info-list">
              <li>⏰ Horário de atendimento: Segunda a Sexta, 9h às 18h</li>
              <li>📅 Finais de semana e feriados: resposta na próxima segunda</li>
              <li>🔒 Seus dados estão protegidos pela LGPD</li>
              <li>🤝 Propostas de colaboração são muito bem-vindas!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 🎯 FOOTER INFORMATIVO */}
      <div className="page-footer-info content-box">
        <h3>💭 Precisa de ajuda imediata?</h3>
        <p>
          Se sua dúvida for urgente, recomendamos o contato por telefone. 
          Para questões sobre o acervo e colaborações, utilize o email específico de colaborações.
        </p>
      </div>
    </div>
  );
}

export default ContatoPage;
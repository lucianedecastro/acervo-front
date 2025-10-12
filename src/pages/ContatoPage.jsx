// ContatoPage.js

// Componente totalmente estático, sem necessidade de useState ou useEffect
function ContatoPage() {

  return (
    <div className="pagina-conteudo">
      <h1>Contato</h1>
      
      <div className="contact-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="info-contato content-box" style={{ textAlign: 'center' }}>
          <h2>Fale Conosco</h2>
          <p>Para dúvidas, sugestões ou informações sobre colaboração, entre em contato exclusivamente pelo e-mail:</p>

          {/* O NOVO E-MAIL */}
          <div className="contato-item" style={{ margin: '30px 0' }}>
            <strong>📧 E-mail:</strong>
            <h3 style={{ margin: '5px 0' }}>
              <a 
                href="mailto:mulherbrasileiranoesporte@gmail.com" 
                className="btn-link" 
                style={{ color: 'var(--cor-principal)', textDecoration: 'underline' }}
              >
                mulherbrasileiranoesporte@gmail.com
              </a>
            </h3>
          </div>
          
          <p>Sua mensagem será respondida o mais brevemente possível.</p>
        </div>
      </div>
    </div>
  );
}

export default ContatoPage;
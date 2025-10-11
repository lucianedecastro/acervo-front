import { useState } from 'react';

function ContatoPage() {
  const [formData, setFormData] = useState({ 
    nome: '', 
    email: '', 
    assunto: '',
    mensagem: '' 
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envio do formulário
    console.log('Formulário enviado:', formData);
    setEnviado(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setEnviado(false);
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="pagina-conteudo">
      <h1>Contato</h1>
      
      <div className="contact-container">
        <div className="content-box">
          <h2>Entre em Contato</h2>
          <p>Tem dúvidas, sugestões ou quer colaborar com o acervo? Entre em contato conosco!</p>
          
          {enviado ? (
            <div className="success-message">
              <p>✅ Mensagem enviada com sucesso! Retornaremos em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="nome">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="assunto">Assunto:</label>
                <input
                  type="text"
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="mensagem">Mensagem:</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>
              
              <button type="submit" className="btn-action">
                Enviar Mensagem
              </button>
            </form>
          )}
        </div>

        <div className="info-contato content-box">
          <h3>Outras Formas de Contato</h3>
          <div className="contato-item">
            <strong>📧 Email:</strong>
            <p>luciane.castro@gmail.com</p>
          </div>
          <div className="contato-item">
            <strong>📞 Telefone:</strong>
            <p>(12) 98127-8043</p>
          </div>
         </div>
      </div>
    </div>
  );
}

export default ContatoPage;
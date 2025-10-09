import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/admin/login', { email, senha });
      
      // ✅ CORREÇÃO SIMPLIFICADA
      console.log('🔐 Resposta do login:', response.data);
      
      // A API retorna o token JWT diretamente como string
      const token = response.data;
      
      // DEBUG: Verifica o token
      console.log('🔐 Token recebido:', {
        token: token,
        type: typeof token,
        length: token?.length,
        hasDots: token?.includes('.')
      });

      if (!token || typeof token !== 'string') {
        throw new Error('Token inválido recebido da API');
      }

      login(token);
      navigate('/admin/dashboard');
      
    } catch (err) {
      console.error('Erro no login:', err);
      console.error('Detalhes do erro:', err.response);
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="pagina-conteudo">
      <h2>Login Administrativo</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="senha">Senha:</label>
          <input 
            type="password" 
            id="senha" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required 
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginPage;
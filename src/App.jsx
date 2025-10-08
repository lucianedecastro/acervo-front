import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // <<--- ESTA LINHA É A CHAVE

import Sobre from './pages/Sobre';
import CarmenLydia from './pages/CarmenLydia';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AtletaForm from './pages/AtletaForm';
import AtletaCard from './components/AtletaCard';

// 1. LÊ A VARIÁVEL DE AMBIENTE
const API_URL = import.meta.env.VITE_API_URL;

// 2. CORREÇÃO CRUCIAL: CONFIGURA O AXIOS GLOBALMENTE
// Isso garante que todas as chamadas como axios.get('/atletas')
// usem a URL do Cloud Run como prefixo.
if (API_URL) {
  axios.defaults.baseURL = API_URL.endsWith('/')
    ? API_URL
    : `${API_URL}/`;
  console.log('API Base URL configurada como:', axios.defaults.baseURL);
}

// --- Componentes de Layout ---

function Layout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="app-header">
        <h1>Acervo "Carmen Lydia" da Mulher Brasileira no Esporte</h1>
        <nav>
          <Link to="/">Página Inicial</Link>
          <Link to="/sobre">Sobre</Link>
          
          {token ? (
            <>
              <Link to="/admin/dashboard">Painel Admin</Link>
              <button onClick={handleLogout} className="logout-button">Sair</button>
            </>
          ) : null}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>© 2025 Acervo Carmen Lydia - Todos os direitos reservados.</p>
        {!token && <Link to="/login">Área Administrativa</Link>}
      </footer>
    </>
  );
}

// --- Componente da Página Inicial ---
function PaginaInicial() {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        // CORREÇÃO: Usa apenas o caminho relativo. axios.defaults.baseURL fará o resto.
        const response = await axios.get('/atletas');
        setAtletas(response.data);
      } catch (err) {
        setError('Falha ao buscar dados da API.');
      } finally {
        setLoading(false);
      }
    };
    fetchAtletas();
  }, []);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pagina-conteudo">
      <h2>Atletas em Destaque</h2>
      {atletas.length > 0 ? (
        atletas.map((atleta) => (
          <AtletaCard 
            key={atleta.id} 
            atleta={atleta}
            isExpanded={expandedId === atleta.id}
            onToggleExpand={handleToggleExpand}
          />
        ))
      ) : (
        <p>Nenhuma atleta encontrada.</p>
      )}
    </div>
  );
}


// --- Componente Principal da Aplicação ---
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PaginaInicial />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="carmen-lydia" element={<CarmenLydia />} />
            <Route path="login" element={<LoginPage />} />
            
            <Route 
              path="admin/dashboard" 
              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="admin/atletas/novo" 
              element={<ProtectedRoute><AtletaForm /></ProtectedRoute>} 
            />
            <Route 
              path="admin/atletas/editar/:id" 
              element={<ProtectedRoute><AtletaForm /></ProtectedRoute>} 
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
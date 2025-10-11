import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Páginas existentes
import Sobre from './pages/Sobre';
import CarmenLydia from './pages/CarmenLydia';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AtletaForm from './pages/AtletaForm';

// Novas páginas
import PaginaInicial from './pages/PaginaInicial';
import ModalidadesPage from './pages/ModalidadesPage';
import ModalidadeDetailPage from './pages/ModalidadeDetailPage';
import AntessalaPage from './pages/AntessalaPage';
import ContatoPage from './pages/ContatoPage';
import AtletasPage from './pages/AtletasPage';

// Componentes
import AtletaCard from './components/AtletaCard';

const API_URL = import.meta.env.VITE_API_URL;

if (API_URL) {
  axios.defaults.baseURL = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
  console.log('API Base URL configurada como:', axios.defaults.baseURL);
}

// --- COMPONENTE LAYOUT ATUALIZADO ---
function Layout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          <h1>Acervo "Carmen Lydia" da Mulher Brasileira no Esporte</h1>
          
          {/* Menu Hamburger para Mobile */}
          <button 
            className="nav-mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <nav className={isMobileMenuOpen ? 'nav-open' : ''}>
          <Link to="/" onClick={handleNavClick}>Página Inicial</Link>
          <Link to="/atletas" onClick={handleNavClick}>Atletas</Link>
          <Link to="/modalidades" onClick={handleNavClick}>Modalidades</Link>
          <Link to="/antessala" onClick={handleNavClick}>Antessala</Link>
          <Link to="/contato" onClick={handleNavClick}>Contato</Link>
          <Link to="/sobre" onClick={handleNavClick}>Sobre</Link>
          
          {token ? (
            <>
              <Link to="/admin/dashboard" onClick={handleNavClick}>Painel Admin</Link>
              <button onClick={handleLogout} className="logout-button">Sair</button>
            </>
          ) : (
            <Link to="/login" onClick={handleNavClick} className="login-link">Área Admin</Link>
          )}
        </nav>

        {/* Overlay para fechar menu ao clicar fora */}
        {isMobileMenuOpen && (
          <div 
            className="nav-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2025 Acervo Carmen Lydia - Todos os direitos reservados.</p>
          <div className="mde-lab-logo">
            <p>Desenvolvido com apoio do MDE Lab</p>
          </div>
          <div className="footer-links">
            <Link to="/sobre">Sobre o Projeto</Link>
            <Link to="/contato">Contato</Link>
            <Link to="/antessala">Nossa História</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

// --- COMPONENTE PRINCIPAL ---
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Rotas Públicas */}
            <Route index element={<PaginaInicial />} />
            <Route path="atletas" element={<AtletasPage />} />
            <Route path="modalidades" element={<ModalidadesPage />} />
            <Route path="modalidades/:id" element={<ModalidadeDetailPage />} />
            <Route path="antessala" element={<AntessalaPage />} />
            <Route path="contato" element={<ContatoPage />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="carmen-lydia" element={<CarmenLydia />} />
            <Route path="login" element={<LoginPage />} />
            
            {/* Rotas Protegidas - Admin */}
            <Route 
              path="admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/atletas/novo" 
              element={
                <ProtectedRoute>
                  <AtletaForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/atletas/editar/:id" 
              element={
                <ProtectedRoute>
                  <AtletaForm />
                </ProtectedRoute>
              } 
            />

            {/* Rota 404 - Página Não Encontrada */}
            <Route 
              path="*" 
              element={
                <div className="pagina-conteudo">
                  <div className="error-container content-box">
                    <div className="error-icon">🔍</div>
                    <h2>Página Não Encontrada</h2>
                    <p>A página que você está procurando não existe ou foi movida.</p>
                    <div className="error-actions">
                      <Link to="/" className="btn-action">
                        🏠 Voltar para Home
                      </Link>
                    </div>
                  </div>
                </div>
              } 
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
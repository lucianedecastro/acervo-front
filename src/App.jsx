import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { useState } from 'react';
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
// ✅ AÇÃO: Import da Antessala REMOVIDO para consertar o build
// import AntessalaPage from './pages/AntessalaPage'; 
import ContatoPage from './pages/ContatoPage';
import AtletasPage from './pages/AtletasPage';
import AdminModalidades from './pages/AdminModalidades';
import ModalidadeForm from './pages/ModalidadeForm';
// Imports de Conteúdo já estavam comentados, o que está correto
// import AdminConteudos from './pages/AdminConteudos';
// import ConteudoForm from './pages/ConteudoForm';

const API_URL = import.meta.env.VITE_API_URL;

if (API_URL) {
  axios.defaults.baseURL = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
  console.log('API Base URL configurada como:', axios.defaults.baseURL);
}

function Layout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const toggleMenu = () => { setIsMenuOpen(!isMenuOpen); };
  const closeMenu = () => { setIsMenuOpen(false); };

  return (
    <>
      <header className="app-header">
        <h1>Acervo "Carmen Lydia" da Mulher Brasileira no Esporte</h1>
        <button className="nav-toggle" onClick={toggleMenu} aria-label="Abrir menu">
          {isMenuOpen ? '✕' : '☰'}
        </button>
        <nav className={isMenuOpen ? 'nav-open' : ''}>
          <Link to="/" onClick={closeMenu}>Página Inicial</Link>
          <Link to="/atletas" onClick={closeMenu}>Atletas</Link>
          <Link to="/modalidades" onClick={closeMenu}>Modalidades</Link>
          <Link to="/contato" onClick={closeMenu}>Contato</Link>
          <Link to="/sobre" onClick={closeMenu}>Sobre</Link>
          {token && <Link to="/admin/dashboard" onClick={closeMenu}>Painel Admin</Link>}
          {token && <button onClick={handleLogout} className="logout-button">Sair</button>}
        </nav>
      </header>
      <main><Outlet /></main>
      <footer className="app-footer">
        <p>© 2025 Acervo Carmen Lydia - Todos os direitos reservados.</p>
        <p>Desenvolvido com apoio do MDE Lab</p>
        {!token && <Link to="/login">Área Administrativa</Link>}
      </footer>
    </>
  );
}

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
            
            {/* Rota da Antessala já estava comentada, o que está correto */}
            {/* <Route path="antessala" element={<AntessalaPage />} /> */}
            
            <Route path="contato" element={<ContatoPage />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="carmen-lydia" element={<CarmenLydia />} />
            <Route path="login" element={<LoginPage />} />
            
            {/* Rotas de Admin Protegidas */}
            <Route path="admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            
            <Route path="admin/atletas/novo" element={<ProtectedRoute><AtletaForm /></ProtectedRoute>} />
            <Route path="admin/atletas/editar/:id" element={<ProtectedRoute><AtletaForm /></ProtectedRoute>} />
            
            <Route path="admin/modalidades" element={<ProtectedRoute><AdminModalidades /></ProtectedRoute>} />
            <Route path="admin/modalidades/novo" element={<ProtectedRoute><ModalidadeForm /></ProtectedRoute>} />
            <Route path="admin/modalidades/editar/:id" element={<ProtectedRoute><ModalidadeForm /></ProtectedRoute>} />

            {/* Rotas para Conteúdos já estavam comentadas, o que está correto */}
            {/*
            <Route path="admin/conteudos" element={<ProtectedRoute><AdminConteudos /></ProtectedRoute>} />
            <Route path="admin/conteudos/editar/:id" element={<ProtectedRoute><ConteudoForm /></ProtectedRoute>} />
            */}
            
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
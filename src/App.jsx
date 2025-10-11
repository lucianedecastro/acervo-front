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
          <Link to="/atletas">Atletas</Link>
          <Link to="/modalidades">Modalidades</Link>
          <Link to="/antessala">Antessala</Link>
          <Link to="/contato">Contato</Link>
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
        <div className="mde-lab-logo">
          <p>Desenvolvido com apoio do MDE Lab</p>
        </div>
        {!token && <Link to="/login">Área Administrativa</Link>}
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
            <Route index element={<PaginaInicial />} />
            <Route path="atletas" element={<AtletasPage />} />
            <Route path="modalidades" element={<ModalidadesPage />} />
            <Route path="modalidades/:id" element={<ModalidadeDetailPage />} />
            <Route path="antessala" element={<AntessalaPage />} />
            <Route path="contato" element={<ContatoPage />} />
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
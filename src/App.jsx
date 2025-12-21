import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import { useState } from 'react'
import axios from 'axios'
import './App.css'

/* Páginas públicas */
import PaginaInicial from './pages/PaginaInicial'
import Sobre from './pages/Sobre'
import CarmenLydia from './pages/CarmenLydia'
import ContatoPage from './pages/ContatoPage'
import LoginPage from './pages/Login'

/* Atletas */
import AtletasPage from './pages/AtletasPage'
import AtletaDetalhesPage from './pages/AtletaDetalhesPage'
import AtletaForm from './pages/AtletaForm'

/* Modalidades (nova estrutura) */
import { ModalidadesList } from './pages/modalidades/ModalidadesList'
import { ModalidadeDetail } from './pages/modalidades/ModalidadeDetail'
import { ModalidadeForm } from './pages/modalidades/ModalidadeForm'

/* Admin */
import AdminDashboard from './pages/AdminDashboard'
import AdminModalidades from './pages/AdminModalidades'

/* =========================
   Configuração da API
   ========================= */
const API_URL = import.meta.env.VITE_API_URL

if (API_URL) {
  axios.defaults.baseURL = API_URL.endsWith('/')
    ? API_URL
    : `${API_URL}/`

  console.log('API Base URL configurada como:', axios.defaults.baseURL)
}

/* =========================
   Layout
   ========================= */
function Layout() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header className="app-header">
        <h1>Acervo "Carmen Lydia" da Mulher Brasileira no Esporte</h1>

        <button
          className="nav-toggle"
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={isMenuOpen ? 'nav-open' : ''}>
          <Link to="/" onClick={closeMenu}>Página Inicial</Link>
          <Link to="/atletas" onClick={closeMenu}>Atletas</Link>
          <Link to="/modalidades" onClick={closeMenu}>Modalidades</Link>
          <Link to="/contato" onClick={closeMenu}>Contato</Link>
          <Link to="/sobre" onClick={closeMenu}>Sobre</Link>

          {token && (
            <Link to="/admin/dashboard" onClick={closeMenu}>
              Painel Admin
            </Link>
          )}

          {token && (
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>
          Software Acervo Carmen Lydia - Registrado no INPI sob o nº
          BR512025005170-0.
        </p>
        <p>© 2025 Acervo Carmen Lydia - Todos os direitos reservados.</p>
        <p>Desenvolvido com apoio do MDE Lab</p>

        {!token && <Link to="/login">Área Administrativa</Link>}
      </footer>
    </>
  )
}

/* =========================
   App
   ========================= */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>

            {/* Rotas públicas */}
            <Route index element={<PaginaInicial />} />

            <Route path="atletas" element={<AtletasPage />} />
            <Route path="atletas/:id" element={<AtletaDetalhesPage />} />

            <Route path="modalidades" element={<ModalidadesList />} />
            <Route path="modalidades/:id" element={<ModalidadeDetail />} />

            <Route path="contato" element={<ContatoPage />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="carmen-lydia" element={<CarmenLydia />} />
            <Route path="login" element={<LoginPage />} />

            {/* Rotas protegidas (Admin) */}
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

            <Route
              path="admin/modalidades"
              element={
                <ProtectedRoute>
                  <AdminModalidades />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/modalidades/novo"
              element={
                <ProtectedRoute>
                  <ModalidadeForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/modalidades/editar/:id"
              element={
                <ProtectedRoute>
                  <ModalidadeForm />
                </ProtectedRoute>
              }
            />

          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

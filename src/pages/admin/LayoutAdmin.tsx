import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import {
  LayoutDashboard,
  Trophy,
  Users,
  DollarSign,
  FileText,
  Calculator,
  Scale,
  Eye,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react"
import { useState, useEffect } from "react"

export default function LayoutAdmin() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setMobileOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm transition-colors mb-1 border-l-2 ${
      collapsed && !isMobile ? "justify-center" : ""
    } ${
      isActive
        ? "bg-acl-gold/15 text-acl-gold-text border-acl-gold-deep"
        : "text-acl-ink-soft border-transparent hover:bg-white hover:text-acl-ink"
    }`

  const sidebarWidth = collapsed && !isMobile ? "w-20" : "w-64"
  const showLabels = !collapsed || isMobile

  return (
    <div className="min-h-screen flex bg-acl-cream overflow-x-hidden">
      {/* OVERLAY MOBILE */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-acl-ink/40 z-30 transition-opacity"
          aria-hidden="true"
          onClick={closeMobileSidebar}
        />
      )}

      {/* TOP BAR MOBILE */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-acl-cream/95 backdrop-blur-sm border-b border-acl-line flex items-center justify-between px-4 z-20">
          <p className="font-serif text-base text-acl-ink">
            Admin <span className="text-acl-gold-text">Acervo</span>
          </p>
          <button
            onClick={toggleSidebar}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="menu"
            className="w-10 h-10 border border-acl-line rounded-sm flex items-center justify-center text-acl-ink hover:border-acl-gold-deep transition-colors"
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </header>
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          ${sidebarWidth}
          bg-white border-r border-acl-line flex flex-col h-screen transition-all duration-300 ease-in-out
          ${isMobile
            ? `fixed top-0 left-0 z-40 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed'
          }
        `}
      >
        {/* Header Sidebar */}
        <div className="p-4 border-b border-acl-line relative flex items-center justify-between">
          {showLabels && (
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="text-left font-serif text-lg text-acl-ink leading-tight hover:text-acl-gold-text transition-colors"
            >
              Admin
              <br />
              <span className="text-acl-gold-text text-base">Acervo Carmen Lydia</span>
            </button>
          )}

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
              aria-expanded={!collapsed}
              aria-controls="menu"
              className="w-9 h-9 border border-acl-line rounded-sm flex items-center justify-center text-acl-ink-soft hover:border-acl-gold-deep hover:text-acl-gold-text transition-colors flex-shrink-0"
            >
              {collapsed ? <Menu size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
            </button>
          )}

          {isMobile && (
            <button
              onClick={closeMobileSidebar}
              aria-label="Fechar menu"
              className="w-9 h-9 border border-acl-line rounded-sm flex items-center justify-center text-acl-ink-soft hover:border-acl-gold-deep transition-colors"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Perfil */}
        <div className={`p-4 border-b border-acl-line bg-acl-cream ${collapsed && !isMobile ? "flex justify-center" : ""}`}>
          <div className={`flex items-center ${collapsed && !isMobile ? "flex-col gap-2" : "gap-3"}`}>
            <div className="w-10 h-10 bg-white border border-acl-line rounded-full flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-acl-gold-text" />
            </div>
            {showLabels && (
              <div>
                <p className="text-sm text-acl-ink">Administrador</p>
                <p className="text-xs text-acl-muted">Acesso total</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav id="menu" aria-label="Menu do painel administrativo" className="flex-1 p-3 overflow-y-auto">
          <NavLink to="/admin" end className={navLinkClass} title="Dashboard" onClick={closeMobileSidebar}>
            <LayoutDashboard size={17} aria-hidden="true" />
            {showLabels && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/admin/modalidades" className={navLinkClass} title="Modalidades" onClick={closeMobileSidebar}>
            <Trophy size={17} />
            {showLabels && <span>Modalidades</span>}
          </NavLink>

          <NavLink to="/admin/atletas" className={navLinkClass} title="Atletas" onClick={closeMobileSidebar}>
            <Users size={17} />
            {showLabels && <span>Atletas</span>}
          </NavLink>

          <NavLink to="/admin/licenciamentos" end className={navLinkClass} title="Vendas" onClick={closeMobileSidebar}>
            <DollarSign size={17} />
            {showLabels && <span>Vendas</span>}
          </NavLink>

          <NavLink to="/admin/licenciamentos/simulacao" className={navLinkClass} title="Simulação" onClick={closeMobileSidebar}>
            <Calculator size={17} />
            {showLabels && <span>Simulação</span>}
          </NavLink>

          <NavLink to="/admin/licenciamentos/extratos" className={navLinkClass} title="Extratos" onClick={closeMobileSidebar}>
            <FileText size={17} />
            {showLabels && <span>Extratos</span>}
          </NavLink>

          <NavLink to="/admin/configuracao-fiscal" className={navLinkClass} title="Fiscal" onClick={closeMobileSidebar}>
            <Scale size={17} />
            {showLabels && <span>Fiscal</span>}
          </NavLink>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-3 border-t border-acl-line space-y-2">
          <NavLink
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-2.5 btn-secondary-light text-sm"
            title="Ver site"
            onClick={closeMobileSidebar}
          >
            <Eye size={16} aria-hidden="true" />
            {showLabels && <span>Ver site</span>}
          </NavLink>

          <button
            onClick={() => {
              closeMobileSidebar()
              handleLogout()
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-acl-muted hover:text-acl-wine transition-colors"
            title="Sair"
          >
            <LogOut size={16} aria-hidden="true" />
            {showLabels && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isMobile ? 'ml-0 pt-16' : `${collapsed ? 'ml-20' : 'ml-64'}`}
        `}
      >
        <main id="conteudo" tabIndex={-1} className="flex-1 p-4 md:p-6 focus:outline-none">
          <Outlet />
        </main>

        {/* Footer */}
        <footer id="rodape" className="border-t border-acl-line mt-auto">
          <div className="px-4 md:px-6 py-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-acl-muted">
              <p className="text-center md:text-left">
                © 2026 Acervo Carmen Lydia • Desenvolvido por{" "}
                <span className="text-acl-ink-soft">Luciane de Castro</span>
              </p>
              <p className="text-center">
                Registro INPI: <span className="text-acl-ink-soft">BR512025005170-0</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
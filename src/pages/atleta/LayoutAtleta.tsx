import { useState } from "react"
import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { LayoutDashboard, User, FileText, Eye, LogOut, Menu, X } from "lucide-react"

export default function LayoutAtleta() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2.5 text-sm rounded-sm border transition-colors ${
      isActive
        ? "bg-acl-gold/15 text-acl-gold-text border-acl-gold-deep"
        : "text-acl-ink-soft border-transparent hover:bg-white hover:text-acl-ink"
    }`

  const links = (
    <>
      <NavLink to="/dashboard/atleta" end className={navLinkClass} onClick={() => setMenuAberto(false)}>
        <LayoutDashboard size={16} aria-hidden="true" /> Painel
      </NavLink>
      <NavLink to="/dashboard/perfil" className={navLinkClass} onClick={() => setMenuAberto(false)}>
        <User size={16} aria-hidden="true" /> Perfil
      </NavLink>
      <NavLink to="/dashboard/extrato" className={navLinkClass} onClick={() => setMenuAberto(false)}>
        <FileText size={16} aria-hidden="true" /> Extrato
      </NavLink>
      <NavLink to="/" className={navLinkClass} onClick={() => setMenuAberto(false)}>
        <Eye size={16} aria-hidden="true" /> Ver site
      </NavLink>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-acl-ink-soft hover:text-acl-wine transition-colors text-left"
      >
        <LogOut size={16} aria-hidden="true" /> Sair
      </button>
    </>
  )

  return (
    <div className="min-h-screen flex flex-col bg-acl-cream">
      <nav
        id="menu"
        aria-label="Menu da área da atleta"
        className="sticky top-0 z-50 bg-acl-cream/95 backdrop-blur-sm border-b border-acl-line"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate("/dashboard/atleta")}
              className="font-serif text-xl md:text-2xl text-acl-ink tracking-tight"
            >
              Acervo <span className="text-acl-gold-text">Carmen Lydia</span>
            </button>

            <div className="hidden md:flex items-center gap-1">{links}</div>

            <button
              type="button"
              onClick={() => setMenuAberto(a => !a)}
              className="md:hidden p-2.5 border border-acl-line rounded-sm text-acl-ink hover:border-acl-gold-deep transition-colors"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
              aria-controls="menu-atleta-mobile"
            >
              {menuAberto ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>

          {menuAberto && (
            <div
              id="menu-atleta-mobile"
              className="md:hidden mt-4 border border-acl-line rounded-sm bg-acl-cream flex flex-col p-2"
            >
              {links}
            </div>
          )}
        </div>
      </nav>

      <main id="conteudo" tabIndex={-1} className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-10 py-8 focus:outline-none">
        <Outlet />
      </main>

      <footer id="rodape" className="border-t border-acl-line mt-auto">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-acl-muted">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Acervo Carmen Lydia • Desenvolvido por{" "}
              <span className="text-acl-ink-soft">Luciane de Castro</span>
            </p>
            <p className="text-center">
              Registro INPI: <span className="text-acl-ink-soft">BR512025005170-0</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

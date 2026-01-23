import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import {
  LayoutDashboard,
  Trophy,
  Users,
  DollarSign,
  FileText,
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
    `flex items-center gap-3 px-4 py-3 font-black uppercase text-xs border-4 border-black rounded-xl transition-all mb-2 ${collapsed && !isMobile ? "justify-center" : ""
    } ${isActive
      ? "bg-[#D4A244] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      : "bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1"
    }`

  const sidebarWidth = collapsed && !isMobile ? "w-20" : "w-64"
  const showLabels = !collapsed || isMobile

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-x-hidden">
      {/* OVERLAY MOBILE */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      {/* TOP BAR MOBILE */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b-4 border-black flex items-center justify-between px-4 z-20 shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-lg font-black uppercase">
            <span className="text-[#D4A244]">Admin</span> Acervo
          </h1>
          <button
            onClick={toggleSidebar}
            className="w-12 h-12 bg-[#D4A244] text-black border-4 border-black rounded-lg flex items-center justify-center hover:bg-black hover:text-[#D4A244] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            {mobileOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
        </div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          ${sidebarWidth}
          bg-white border-r-4 border-black flex flex-col h-screen transition-all duration-300 ease-in-out
          ${isMobile
            ? `fixed top-0 left-0 z-40 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed'
          }
        `}
      >
        {/* Header Sidebar */}
        <div className="p-4 border-b-4 border-black bg-gray-50 relative flex items-center justify-between">
          {showLabels && (
            <h1
              onClick={() => navigate("/admin")}
              className="text-xl font-black uppercase cursor-pointer leading-tight hover:text-[#D4A244] transition-colors"
            >
              ADMIN
              <br />
              <span className="text-[#D4A244]">Acervo Atleta</span>
            </h1>
          )}

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 bg-[#D4A244] text-black border-4 border-black rounded-lg flex items-center justify-center hover:bg-black hover:text-[#D4A244] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex-shrink-0"
            >
              {collapsed ? <Menu size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
            </button>
          )}

          {isMobile && (
            <button
              onClick={closeMobileSidebar}
              className="w-10 h-10 bg-black text-white border-4 border-black rounded-lg flex items-center justify-center hover:bg-[#D4A244] hover:text-black transition-all"
            >
              <X size={20} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Perfil */}
        <div className={`p-4 border-b-4 border-black bg-[#D4A244]/10 ${collapsed && !isMobile ? "flex justify-center" : ""}`}>
          <div className={`flex items-center ${collapsed && !isMobile ? "flex-col gap-2" : "gap-3"}`}>
            <div className="w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center flex-shrink-0">
              <User size={24} strokeWidth={3} className="text-[#D4A244]" />
            </div>
            {showLabels && (
              <div>
                <p className="font-black text-xs uppercase">Administrador</p>
                <p className="text-[10px] text-gray-600 font-medium">Acesso Total</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <NavLink to="/admin" end className={navLinkClass} title="Dashboard" onClick={closeMobileSidebar}>
            <LayoutDashboard size={18} strokeWidth={3} />
            {showLabels && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/admin/modalidades" className={navLinkClass} title="Modalidades" onClick={closeMobileSidebar}>
            <Trophy size={18} strokeWidth={3} />
            {showLabels && <span>Modalidades</span>}
          </NavLink>

          <NavLink to="/admin/atletas" className={navLinkClass} title="Atletas" onClick={closeMobileSidebar}>
            <Users size={18} strokeWidth={3} />
            {showLabels && <span>Atletas</span>}
          </NavLink>

          <NavLink to="/admin/licenciamentos" end className={navLinkClass} title="Vendas" onClick={closeMobileSidebar}>
            <DollarSign size={18} strokeWidth={3} />
            {showLabels && <span>Vendas</span>}
          </NavLink>

          <NavLink to="/admin/licenciamentos/extratos" className={navLinkClass} title="Extratos" onClick={closeMobileSidebar}>
            <FileText size={18} strokeWidth={3} />
            {showLabels && <span>Extratos</span>}
          </NavLink>

          <NavLink to="/admin/configuracao-fiscal" className={navLinkClass} title="Fiscal" onClick={closeMobileSidebar}>
            <Scale size={18} strokeWidth={3} />
            {showLabels && <span>Fiscal</span>}
          </NavLink>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t-4 border-black bg-gray-50 space-y-2">
          <NavLink
            to="/"
            className={`flex items-center ${collapsed && !isMobile ? "justify-center" : "justify-center gap-2"} px-4 py-3 bg-[#D4A244] text-black font-black uppercase text-xs border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
            title="Ver Site"
            onClick={closeMobileSidebar}
          >
            <Eye size={18} strokeWidth={3} />
            {showLabels && <span>Site</span>}
          </NavLink>

          <button
            onClick={() => {
              closeMobileSidebar()
              handleLogout()
            }}
            className={`w-full flex items-center ${collapsed && !isMobile ? "justify-center" : "justify-center gap-2"} px-4 py-3 bg-black text-white font-black uppercase text-xs border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
            title="Sair"
          >
            <LogOut size={18} strokeWidth={3} />
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
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t-2 border-gray-200 mt-auto">
          <div className="px-4 md:px-6 py-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
              <p className="font-medium text-center md:text-left">
                © 2026 Acervo Carmen Lydia • Desenvolvido por{" "}
                <span className="text-black font-bold">Luciane de Castro</span>
              </p>
              <p className="font-medium text-center">
                Registro INPI: <span className="text-black font-bold">BR512025005170-0</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

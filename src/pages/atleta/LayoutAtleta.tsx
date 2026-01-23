import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { LayoutDashboard, User, FileText, Eye, LogOut } from "lucide-react"

export default function LayoutAtleta() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 font-black uppercase text-xs border-4 border-black rounded-lg transition-all ${isActive
      ? "bg-[#D4A244] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      : "bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5"
    }`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Navigation */}
      <nav className="bg-black border-b-6 border-black shadow-[0_6px_0px_0px_rgba(212,162,68,1)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* Logo */}
            <button
              onClick={() => navigate("/dashboard/atleta")}
              className="text-xl font-black uppercase text-[#D4A244] hover:text-white transition-colors"
            >
              Acervo da Atleta Brasileira
            </button>

            {/* Nav Links */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <NavLink to="/dashboard/atleta" className={navLinkClass}>
                <LayoutDashboard size={14} strokeWidth={3} className="inline mr-1" />
                Dashboard
              </NavLink>

              <NavLink to="/dashboard/perfil" className={navLinkClass}>
                <User size={14} strokeWidth={3} className="inline mr-1" />
                Perfil
              </NavLink>

              <NavLink to="/dashboard/extrato" className={navLinkClass}>
                <FileText size={14} strokeWidth={3} className="inline mr-1" />
                Extrato
              </NavLink>

              <NavLink to="/" className={navLinkClass}>
                <Eye size={14} strokeWidth={3} className="inline mr-1" />
                Site
              </NavLink>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white font-black uppercase text-xs border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1"
              >
                <LogOut size={14} strokeWidth={3} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t-2 border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3">
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
  )
}

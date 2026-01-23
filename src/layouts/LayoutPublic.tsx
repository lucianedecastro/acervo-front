import { useState } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { Menu, X } from "lucide-react"

export default function LayoutPublic() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout, role } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  function handleLogout() {
    logout()
    setIsMenuOpen(false)
    navigate("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* =========================
          NAVBAR - NEOBRUTALIST COM BORDAS ARREDONDADAS
          ========================= */}
      <nav className="sticky top-0 z-50 bg-white border-b-6 border-black shadow-[0_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <Link
              to="/"
              className="text-2xl md:text-3xl font-black uppercase hover:text-[#D4A244] transition-colors tracking-tight"
            >
              Acervo <span className="text-[#D4A244]">Carmen Lydia</span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/modalidades"
                className="px-4 py-2 font-black text-black hover:text-[#D4A244] transition-colors uppercase text-sm tracking-wide"
              >
                Modalidades
              </Link>
              <Link
                to="/atletas"
                className="px-4 py-2 font-black text-black hover:text-[#D4A244] transition-colors uppercase text-sm tracking-wide"
              >
                Atletas
              </Link>
              <Link
                to="/sobre"
                className="px-4 py-2 font-black text-black hover:text-[#D4A244] transition-colors uppercase text-sm tracking-wide"
              >
                Sobre
              </Link>
              <Link
                to="/arquitetura"
                className="px-4 py-2 font-black text-black hover:text-[#D4A244] transition-colors uppercase text-sm tracking-wide"
              >
                Arquitetura
              </Link>

              {/* Botão Login/Área - NEOBRUTALIST COM BORDAS ARREDONDADAS */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="ml-4 px-8 py-3 bg-[#D4A244] text-black font-black uppercase border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all text-sm tracking-wide whitespace-nowrap"
                >
                  LOGIN
                </Link>
              ) : (
                <div className="ml-4 flex items-center gap-3">
                  <Link
                    to={role === "ROLE_ADMIN" ? "/admin" : "/dashboard/atleta"}
                    className="px-8 py-3 bg-[#D4A244] text-black font-black uppercase border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all text-sm tracking-wide whitespace-nowrap"
                  >
                    PAINEL
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-8 py-3 bg-black text-white font-black uppercase border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-1 hover:translate-y-1 transition-all text-sm tracking-wide whitespace-nowrap"
                  >
                    SAIR
                  </button>
                </div>
              )}
            </div>

            {/* Menu Mobile (Hamburger) - NEOBRUTALIST COM BORDAS ARREDONDADAS */}
            <button
              onClick={toggleMenu}
              className="md:hidden bg-[#D4A244] p-3 border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
            </button>
          </div>

          {/* Dropdown Mobile - NEOBRUTALIST COM BORDAS ARREDONDADAS */}
          {isMenuOpen && (
            <div className="md:hidden mt-6 border-6 border-black rounded-xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="flex flex-col">
                <Link
                  to="/"
                  className="px-6 py-4 font-black text-base border-b-4 border-black hover:bg-[#D4A244] transition-colors uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Página Inicial
                </Link>
                <Link
                  to="/modalidades"
                  className="px-6 py-4 font-black text-base border-b-4 border-black hover:bg-[#D4A244] transition-colors uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Modalidades
                </Link>
                <Link
                  to="/atletas"
                  className="px-6 py-4 font-black text-base border-b-4 border-black hover:bg-[#D4A244] transition-colors uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Atletas
                </Link>
                <Link
                  to="/sobre"
                  className="px-6 py-4 font-black text-base border-b-4 border-black hover:bg-[#D4A244] transition-colors uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  to="/arquitetura"
                  className="px-6 py-4 font-black text-base border-b-4 border-black hover:bg-[#D4A244] transition-colors uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Arquitetura
                </Link>

                {/* Área autenticada mobile */}
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="px-6 py-4 font-black text-base bg-[#D4A244] text-black text-center hover:bg-black hover:text-[#D4A244] transition-colors uppercase"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ACESSAR
                  </Link>
                ) : (
                  <>
                    <Link
                      to={role === "ROLE_ADMIN" ? "/admin" : "/dashboard/atleta"}
                      className="px-6 py-4 font-black text-base border-b-4 border-black bg-[#D4A244] hover:bg-black hover:text-[#D4A244] transition-colors uppercase"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      PAINEL
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-4 font-black text-base bg-black text-white hover:bg-[#D4A244] hover:text-black transition-colors text-left uppercase"
                    >
                      SAIR
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* =========================
          CONTEÚDO DINÂMICO
          ========================= */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* =========================
          FOOTER - NEOBRUTALIST
          ========================= */}
      <footer className="bg-black text-white border-t-6 border-[#D4A244] py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">

            {/* Coluna 1: Sobre */}
            <div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
                <span className="text-[#D4A244]">Acervo</span>{" "}
                <span className="text-white">Carmen Lydia</span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed font-medium">
                Plataforma digital dedicada à preservação, pesquisa e valorização dos acervos
                pessoais de atletas brasileiras, promovendo memória esportiva, sustentabilidade
                cultural e justiça financeira por meio de licenciamento ético.
              </p>
            </div>

            {/* Coluna 2: Navegação */}
            <div>
              <h4 className="text-lg font-black mb-4 text-[#D4A244] uppercase tracking-wide">Navegação</h4>
              <div className="space-y-2">
                <Link to="/modalidades" className="block text-gray-300 hover:text-[#D4A244] font-bold transition-colors text-sm uppercase">
                  Modalidades
                </Link>
                <Link to="/atletas" className="block text-gray-300 hover:text-[#D4A244] font-bold transition-colors text-sm uppercase">
                  Atletas
                </Link>
                <Link to="/sobre" className="block text-gray-300 hover:text-[#D4A244] font-bold transition-colors text-sm uppercase">
                  Sobre o Acervo
                </Link>
                <Link to="/arquitetura" className="block text-gray-300 hover:text-[#D4A244] font-bold transition-colors text-sm uppercase">
                  Arquitetura
                </Link>
              </div>
            </div>

            {/* Coluna 3: Informações + INPI */}
            <div>
              <h4 className="text-lg font-black mb-4 text-[#D4A244] uppercase tracking-wide">Informações</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-3 font-medium">
                Desenvolvido por <strong className="text-white font-black">Luciane de Castro</strong>
              </p>
              <p className="text-gray-300 text-sm font-medium">
                Registro no INPI: <strong className="text-white font-black">BR512025005170-0</strong>
              </p>
            </div>
          </div>

          {/* Linha divisória dourada + Copyright */}
          <div className="border-t-4 border-[#D4A244] pt-6 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">
              © {new Date().getFullYear()} Acervo Carmen Lydia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

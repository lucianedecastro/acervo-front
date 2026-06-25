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

  const navLinks = [
    { to: "/modalidades", label: "Modalidades" },
    { to: "/atletas", label: "Atletas" },
    { to: "/sobre", label: "Sobre" },
    { to: "/arquitetura", label: "Arquitetura" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-acl-cream">

      {/* =========================
          NAVBAR
          ========================= */}
      <nav className="sticky top-0 z-50 bg-acl-cream/95 backdrop-blur-sm border-b border-acl-line">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <Link
              to="/"
              className="font-serif text-xl md:text-2xl text-acl-ink tracking-tight"
            >
              Acervo <span className="text-acl-gold-deep">Carmen Lydia</span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-acl-ink-soft hover:text-acl-gold-deep transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated ? (
                <Link to="/login" className="btn-primary ml-2">
                  Entrar
                </Link>
              ) : (
                <div className="ml-2 flex items-center gap-3">
                  <Link
                    to={role === "ROLE_ADMIN" ? "/admin" : "/dashboard/atleta"}
                    className="btn-primary"
                  >
                    Painel
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary-light">
                    Sair
                  </button>
                </div>
              )}
            </div>

            {/* Menu Mobile (Hamburger) */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2.5 border border-acl-line rounded-sm text-acl-ink hover:border-acl-gold-deep transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Dropdown Mobile */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 border border-acl-line rounded-sm bg-acl-cream overflow-hidden">
              <div className="flex flex-col">
                <Link
                  to="/"
                  className="px-5 py-3.5 text-sm text-acl-ink-soft border-b border-acl-line hover:bg-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Página inicial
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-5 py-3.5 text-sm text-acl-ink-soft border-b border-acl-line hover:bg-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="px-5 py-3.5 text-sm text-center bg-acl-gold text-acl-ink"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                ) : (
                  <>
                    <Link
                      to={role === "ROLE_ADMIN" ? "/admin" : "/dashboard/atleta"}
                      className="px-5 py-3.5 text-sm text-center bg-acl-gold text-acl-ink border-b border-acl-line"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Painel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-3.5 text-sm text-left text-acl-ink-soft hover:bg-white transition-colors"
                    >
                      Sair
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
          FOOTER
          ========================= */}
      <footer className="bg-acl-ink text-acl-cream py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            {/* Coluna 1: Sobre */}
            <div>
              <h3 className="font-serif text-xl mb-3">
                Acervo <span className="text-acl-gold">Carmen Lydia</span>
              </h3>
              <p className="text-sm text-acl-cream/70 leading-relaxed">
                Plataforma digital dedicada à preservação, pesquisa e valorização dos acervos
                pessoais de atletas brasileiras, promovendo memória esportiva, sustentabilidade
                cultural e justiça financeira por meio de licenciamento ético.
              </p>
            </div>

            {/* Coluna 2: Navegação */}
            <div>
              <h4 className="eyebrow text-acl-gold mb-4">Navegação</h4>
              <div className="space-y-2.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block text-sm text-acl-cream/70 hover:text-acl-gold transition-colors"
                  >
                    {link.label === "Sobre" ? "Sobre o acervo" : link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Coluna 3: Informações + INPI */}
            <div>
              <h4 className="eyebrow text-acl-gold mb-4">Informações</h4>
              <p className="text-sm text-acl-cream/70 leading-relaxed mb-3">
                Desenvolvido por <span className="text-acl-cream">Luciane de Castro</span>
              </p>
              <p className="text-sm text-acl-cream/70">
                Registro no INPI: <span className="text-acl-cream">BR512025005170-0</span>
              </p>
            </div>
          </div>

          {/* Linha divisória + Copyright */}
          <div className="border-t border-acl-ink-soft pt-6 text-center">
            <p className="text-xs text-acl-cream/50">
              © {new Date().getFullYear()} Acervo Carmen Lydia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
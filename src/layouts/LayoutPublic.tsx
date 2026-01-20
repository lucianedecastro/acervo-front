import { useState } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import Footer from "@/components/Footer"

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* =========================
          CABEÇALHO GLOBAL (NAVBAR)
          ========================= */}
      <nav style={navStyle}>
        <div style={navContainerStyle}>
          {/* Logo que retorna para a Home */}
          <Link to="/" style={logoLinkStyle}>
            <strong>Acervo Carmen Lydia</strong>
          </Link>
          
          <div style={{ position: "relative" }}>
            <button onClick={toggleMenu} style={menuButtonStyle}>
              Menu {isMenuOpen ? "▲" : "▼"}
            </button>

            {/* Menu Suspenso (Dropdown) */}
            {isMenuOpen && (
              <div style={dropdownStyle}>
                <Link to="/" style={menuItemStyle} onClick={() => setIsMenuOpen(false)}>Página Inicial</Link>
                <Link to="/sobre" style={menuItemStyle} onClick={() => setIsMenuOpen(false)}>Sobre o Acervo</Link>
                <Link to="/arquitetura" style={menuItemStyle} onClick={() => setIsMenuOpen(false)}>Arquitetura</Link>
                <Link to="/modalidades" style={menuItemStyle} onClick={() => setIsMenuOpen(false)}>Modalidades</Link>
                <Link to="/atletas" style={menuItemStyle} onClick={() => setIsMenuOpen(false)}>Atletas</Link>
                
                <hr style={hrStyle} />
                
                {!isAuthenticated ? (
                  <Link to="/login" style={loginLinkStyle} onClick={() => setIsMenuOpen(false)}>
                    Acessar (Login)
                  </Link>
                ) : (
                  <>
                    <Link 
                      to={role === "ROLE_ADMIN" ? "/admin" : "/dashboard/atleta"} 
                      style={menuItemStyle} 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Minha Área
                    </Link>
                    <button onClick={handleLogout} style={logoutButtonStyle}>
                      Sair
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* =========================
          CONTEÚDO DINÂMICO
          ========================= */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* =========================
          RODAPÉ GLOBAL
          ========================= */}
      <Footer />
    </div>
  )
}

/* =========================
   ESTILOS DO LAYOUT
   ========================= */

const navStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: "1rem 0",
  position: "sticky",
  top: 0,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(5px)",
  zIndex: 100,
}

const navContainerStyle: React.CSSProperties = {
  maxWidth: "960px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 2rem",
}

const logoLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#111",
  fontSize: "1.1rem",
}

const menuButtonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  backgroundColor: "#f4f4f4",
  border: "1px solid #ddd",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: 500,
}

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  right: 0,
  top: "120%",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  width: "220px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}

const menuItemStyle: React.CSSProperties = {
  padding: "0.8rem 1.2rem",
  textDecoration: "none",
  color: "#333",
  fontSize: "0.95rem",
  borderBottom: "1px solid #f9f9f9",
}

const loginLinkStyle: React.CSSProperties = {
  ...menuItemStyle,
  backgroundColor: "#111",
  color: "#fff",
  textAlign: "center",
  fontWeight: "bold",
}

const logoutButtonStyle: React.CSSProperties = {
  padding: "0.8rem 1.2rem",
  border: "none",
  backgroundColor: "transparent",
  color: "#d93025",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "0.95rem",
  width: "100%",
}

const hrStyle: React.CSSProperties = {
  margin: 0,
  border: 0,
  borderTop: "1px solid #eee",
}
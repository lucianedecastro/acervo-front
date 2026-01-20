/* =====================================================
   LAYOUT ADMINISTRATIVO (ADMIN)
   Funcionalidade: Menu global de gestão e container de rotas
   ===================================================== */

import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import Footer from "@/components/Footer"

export default function LayoutAdmin() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  // Estilos base para os links de navegação
  const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    textDecoration: "none",
    color: isActive ? "#fff" : "#a0aec0",
    fontWeight: isActive ? "bold" : "500",
    fontSize: "0.9rem",
    padding: "0.5rem 0.8rem",
    borderRadius: "4px",
    backgroundColor: isActive ? "#2d3748" : "transparent",
    transition: "all 0.2s ease"
  })

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      {/* HEADER / NAVBAR ADMIN */}
      <header
        style={{
          background: "#1a202c", // Tom de azul marinho escuro para diferenciar da atleta
          color: "#fff",
          padding: "0.75rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <strong
            style={{ cursor: "pointer", fontSize: "1.1rem", letterSpacing: "0.5px" }}
            onClick={() => navigate("/admin")}
          >
            ADMIN | Acervo Atleta
          </strong>

          <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <NavLink to="/admin" end style={navLinkStyle}>Dashboard</NavLink>
            
            <div style={separatorStyle} />
            
            <NavLink to="/admin/modalidades" style={navLinkStyle}>Modalidades</NavLink>
            <NavLink to="/admin/atletas" style={navLinkStyle}>Atletas</NavLink>
            
            <div style={separatorStyle} />
            
            <NavLink to="/admin/licenciamentos" end style={navLinkStyle}>Vendas</NavLink>
            <NavLink to="/admin/licenciamentos/extratos" style={navLinkStyle}>Extratos</NavLink>
            <NavLink to="/admin/configuracao-fiscal" style={navLinkStyle}>Fiscal</NavLink>
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <NavLink to="/" style={{ color: "#cbd5e0", fontSize: "0.85rem", textDecoration: "none" }}>
            Ver Site Público
          </NavLink>
          
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: "#e53e3e",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem"
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO */}
      <main style={{ flex: 1, padding: "2.5rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        <Outlet />
      </main>

      {/* RODAPÉ COMPARTILHADO */}
      <Footer />
    </div>
  )
}

/* ==========================
    ESTILOS AUXILIARES
   ========================== */

const separatorStyle: React.CSSProperties = {
  width: "1px",
  height: "20px",
  backgroundColor: "#4a5568",
  margin: "0 0.5rem"
}
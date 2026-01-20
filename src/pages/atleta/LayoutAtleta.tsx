import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import Footer from "@/components/Footer"

export default function LayoutAtleta() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const linkStyle = {
    textDecoration: "none",
    color: "#ccc",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "color 0.2s"
  }

  const activeLinkStyle = {
    ...linkStyle,
    color: "#fff",
    fontWeight: "bold" as const,
    borderBottom: "2px solid #fff",
    paddingBottom: "4px"
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fdfdfd" }}>
      <nav
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}
      >
        <strong 
          onClick={() => navigate("/dashboard/atleta")} 
          style={{ cursor: "pointer", fontSize: "1.1rem" }}
        >
          Acervo da Atleta Brasileira
        </strong>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <NavLink 
            to="/dashboard/atleta" 
            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
          >
            Dashboard
          </NavLink>

          <NavLink 
            to="/dashboard/perfil" 
            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
          >
            Meu Perfil
          </NavLink>

          <NavLink 
            to="/dashboard/extrato" 
            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
          >
            Extrato
          </NavLink>

          <NavLink 
            to="/" 
            style={linkStyle}
          >
            Site Público
          </NavLink>

          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: "#d93025",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
              marginLeft: "0.5rem"
            }}
          >
            Sair
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
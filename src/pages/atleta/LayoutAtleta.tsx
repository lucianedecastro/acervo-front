import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"

export default function LayoutAtleta() {
  const navigate = useNavigate()
  const { logout, role, isAuthenticated } = useAuth()

  // Proteção extra: apenas atleta
  if (!isAuthenticated || role !== "ROLE_ATLETA") {
    navigate("/")
    return null
  }

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ======================
          Navbar da Atleta
         ====================== */}
      <nav
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{ fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer" }}
          onClick={() => navigate("/dashboard/atleta")}
        >
          Acervo da Atleta Brasileira
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </nav>

      {/* ======================
          Conteúdo
         ====================== */}
      <main
        style={{
          flex: 1,
          backgroundColor: "#f4f7f6",
          padding: "2rem",
        }}
      >
        <Outlet />
      </main>

      {/* ======================
          Rodapé
         ====================== */}
      <footer
        style={{
          padding: "1rem",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#666",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      >
        © 2026 Acervo da Atleta Brasileira — Painel da Atleta
      </footer>
    </div>
  )
}

import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"

export default function LayoutAtleta() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <strong onClick={() => navigate("/dashboard/atleta")}>
          Acervo da Atleta Brasileira
        </strong>

        <div style={{ display: "flex", gap: "1rem" }}>
          <span onClick={() => navigate("/dashboard/atleta")}>Dashboard</span>
          <span onClick={() => navigate("/atleta/perfil")}>Meu Perfil</span>
          <span onClick={() => navigate("/atleta/extrato")}>Extrato</span>
          <span onClick={() => navigate("/")}>Site Público</span>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  )
}

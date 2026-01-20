import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"

export default function LayoutAdmin() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header
        style={{
          background: "#111",
          color: "#fff",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong
          style={{ cursor: "pointer", fontSize: "1.2rem" }}
          onClick={() => navigate("/admin")}
        >
          Acervo da Atleta Brasileira
        </strong>

        <nav style={{ display: "flex", gap: "1rem" }}>
          <span onClick={() => navigate("/admin")}>Dashboard</span>
          <span onClick={() => navigate("/admin/modalidades")}>Modalidades</span>
          <span onClick={() => navigate("/admin/atletas")}>Atletas</span>
          <span onClick={() => navigate("/admin/licenciamentos")}>
            Licenciamentos
          </span>
          <span onClick={() => navigate("/admin/licenciamentos/extratos")}>
            Extratos
          </span>
          <span onClick={() => navigate("/admin/configuracao-fiscal")}>
            Configuração Fiscal
          </span>
          <span onClick={() => navigate("/")}>Site Público</span>
        </nav>

        <button onClick={handleLogout}>Sair</button>
      </header>

      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  )
}

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
      {/* ======================
          Header Admin
         ====================== */}
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
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {/* Marca → Dashboard */}
          <strong
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
            onClick={() => navigate("/admin")}
          >
            Acervo da Atleta Brasileira
          </strong>

          {/* Menu Admin */}
          <nav style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
            <span
              style={{ cursor: "pointer", opacity: 0.9 }}
              onClick={() => navigate("/admin")}
            >
              Dashboard
            </span>

            <span
              style={{ cursor: "pointer", opacity: 0.85 }}
              onClick={() => navigate("/admin/modalidades")}
            >
              Modalidades
            </span>

            <span
              style={{ cursor: "pointer", opacity: 0.85 }}
              onClick={() => navigate("/admin/atletas")}
            >
              Atletas
            </span>

            {/* ===== LICENCIAMENTOS ===== */}
            <span
              style={{ cursor: "pointer", opacity: 0.85 }}
              onClick={() => navigate("/admin/licenciamentos")}
            >
              Licenciamentos
            </span>

            <span
              style={{ cursor: "pointer", opacity: 0.7, fontSize: "0.9rem" }}
              onClick={() => navigate("/admin/licenciamentos/simulacao")}
            >
              ↳ Simulação
            </span>

            <span
              style={{ cursor: "pointer", opacity: 0.7, fontSize: "0.9rem" }}
              onClick={() => navigate("/admin/licenciamentos/extratos")}
            >
              ↳ Extratos
            </span>

            {/* ===== CONFIGURAÇÃO FISCAL ===== */}
            <span
              style={{ cursor: "pointer", opacity: 0.85 }}
              onClick={() => navigate("/admin/configuracao-fiscal")}
            >
              Configuração Fiscal
            </span>

            {/* ===== SITE PÚBLICO ===== */}
            <span
              style={{ cursor: "pointer", opacity: 0.7 }}
              onClick={() => navigate("/")}
            >
              Site Público
            </span>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #fff",
            color: "#fff",
            padding: "0.4rem 0.8rem",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </header>

      {/* ======================
          Conteúdo
         ====================== */}
      <main
        style={{
          padding: "2rem",
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#fff",
          minHeight: "80vh",
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}

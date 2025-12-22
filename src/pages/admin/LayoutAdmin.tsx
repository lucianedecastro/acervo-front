import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "@/auth/AuthContext"

interface LayoutAdminProps {
  children: ReactNode
}

export default function LayoutAdmin({ children }: LayoutAdminProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* ===== Header Admin ===== */}
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
        <strong style={{ cursor: "pointer" }} onClick={() => navigate("/admin/modalidades")}>
          Painel Administrativo
        </strong>

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

      {/* ===== Conteúdo ===== */}
      <main
        style={{
          padding: "2rem",
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#fff",
        }}
      >
        {children}
      </main>
    </div>
  )
}
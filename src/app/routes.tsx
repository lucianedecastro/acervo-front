import { Routes, Route } from "react-router-dom"

import { ProtectedRoute } from "@/auth/ProtectedRoute"

/* ===== Páginas públicas ===== */
import Home from "@/pages/public/Home"
import ModalidadesList from "@/pages/public/ModalidadesList"
import ModalidadeDetail from "@/pages/public/ModalidadeDetail"

/* ===== Admin ===== */
import Login from "@/pages/admin/Login"
import AdminModalidades from "@/pages/admin/AdminModalidades"
import ModalidadeForm from "@/pages/admin/ModalidadeForm"

export function AppRoutes() {
  return (
    <Routes>
      {/* ======================
          ROTAS PÚBLICAS
         ====================== */}
      <Route path="/" element={<Home />} />

      <Route path="/modalidades" element={<ModalidadesList />} />
      <Route path="/modalidades/:id" element={<ModalidadeDetail />} />

      <Route path="/login" element={<Login />} />

      {/* ======================
          ROTAS ADMIN (PROTEGIDAS)
         ====================== */}
      <Route
        path="/admin/modalidades"
        element={
          <ProtectedRoute>
            <AdminModalidades />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/modalidades/nova"
        element={
          <ProtectedRoute>
            <ModalidadeForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/modalidades/editar/:id"
        element={
          <ProtectedRoute>
            <ModalidadeForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

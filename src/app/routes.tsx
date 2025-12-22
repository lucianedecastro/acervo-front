import { Routes, Route } from "react-router-dom"

import { ProtectedRoute } from "@/auth/ProtectedRoute"

/* ===== Páginas públicas ===== */
import Home from "@/pages/public/Home"
import ModalidadesList from "@/pages/public/ModalidadesList"
import ModalidadeDetail from "@/pages/public/ModalidadeDetail"
import AtletasList from "@/pages/public/AtletasList"
import AtletaDetail from "@/pages/public/AtletaDetail"

/* ===== Admin ===== */
import Login from "@/pages/admin/Login"
import AdminModalidades from "@/pages/admin/AdminModalidades"
import ModalidadeForm from "@/pages/admin/ModalidadeForm"
import LayoutAdmin from "@/pages/admin/LayoutAdmin"
import AtletaForm from "@/pages/admin/AtletaForm"
import AdminAtletas from "@/pages/admin/AdminAtletas"

export function AppRoutes() {
  return (
    <Routes>
      {/* ======================
          ROTAS PÚBLICAS
         ====================== */}
      <Route path="/" element={<Home />} />

      <Route path="/modalidades" element={<ModalidadesList />} />
      <Route path="/modalidades/:id" element={<ModalidadeDetail />} />

      <Route path="/atletas" element={<AtletasList />} />
      <Route path="/atletas/:id" element={<AtletaDetail />} />

      <Route path="/login" element={<Login />} />

      {/* ======================
          ROTAS ADMIN (PROTEGIDAS)
         ====================== */}
      
      {/* --- Modalidades --- */}
      <Route
        path="/admin/modalidades"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <AdminModalidades />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/modalidades/nova"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <ModalidadeForm />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/modalidades/editar/:id"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <ModalidadeForm />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />

      {/* --- Atletas --- */}
      <Route
        path="/admin/atletas"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <AdminAtletas />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/atletas/nova"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <AtletaForm />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/atletas/editar/:id"
        element={
          <ProtectedRoute>
            <LayoutAdmin>
              <AtletaForm />
            </LayoutAdmin>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
import { Routes, Route, Navigate } from "react-router-dom"

import { ProtectedRoute } from "@/auth/ProtectedRoute"

/* ======================
   Layouts
   ====================== */
import LayoutPublic from "@/layouts/LayoutPublic"
import LayoutAdmin from "@/pages/admin/LayoutAdmin"
import LayoutAtleta from "@/pages/atleta/LayoutAtleta"

/* ======================
   Páginas públicas
   ====================== */
import Home from "@/pages/public/Home"
import ModalidadesList from "@/pages/public/ModalidadesList"
import ModalidadeDetail from "@/pages/public/ModalidadeDetail"
import AtletasList from "@/pages/public/AtletasList"
import AtletaDetail from "@/pages/public/AtletaDetail"

/* ======================
   Admin
   ====================== */
import Login from "@/pages/admin/Login"
import AdminModalidades from "@/pages/admin/AdminModalidades"
import ModalidadeForm from "@/pages/admin/ModalidadeForm"
import AtletaForm from "@/pages/admin/AtletaForm"
import AdminAtletas from "@/pages/admin/AdminAtletas"

/* ======================
   Atleta
   ====================== */
import AtletaDashboard from "@/pages/atleta/AtletaDashboard"

export function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          ROTAS PÚBLICAS
         ===================================================== */}
      <Route element={<LayoutPublic />}>
        <Route path="/" element={<Home />} />

        <Route path="/modalidades" element={<ModalidadesList />} />
        <Route path="/modalidades/:id" element={<ModalidadeDetail />} />

        <Route path="/atletas" element={<AtletasList />} />
        <Route path="/atletas/:id" element={<AtletaDetail />} />

        <Route path="/login" element={<Login />} />
      </Route>

      {/* =====================================================
          ROTAS DA ATLETA
         ===================================================== */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["ROLE_ATLETA"]}>
            <LayoutAtleta />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/atleta" replace />} />
        <Route path="/dashboard/atleta" element={<AtletaDashboard />} />
      </Route>

      {/* =====================================================
          ROTAS ADMIN
         ===================================================== */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <LayoutAdmin />
          </ProtectedRoute>
        }
      >
        {/* Modalidades */}
        <Route path="/admin/modalidades" element={<AdminModalidades />} />
        <Route path="/admin/modalidades/nova" element={<ModalidadeForm />} />
        <Route
          path="/admin/modalidades/editar/:id"
          element={<ModalidadeForm />}
        />

        {/* Atletas */}
        <Route path="/admin/atletas" element={<AdminAtletas />} />
        <Route path="/admin/atletas/nova" element={<AtletaForm />} />
        <Route path="/admin/atletas/editar/:id" element={<AtletaForm />} />
      </Route>

      {/* =====================================================
          FALLBACK
         ===================================================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

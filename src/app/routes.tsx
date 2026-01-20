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
   ===================== */
import Login from "@/pages/admin/Login"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminModalidades from "@/pages/admin/AdminModalidades"
import ModalidadeForm from "@/pages/admin/ModalidadeForm"
import AtletaForm from "@/pages/admin/AtletaForm"
import AdminAtletas from "@/pages/admin/AdminAtletas"
import AdminConfiguracaoFiscal from "@/pages/admin/AdminConfiguracaoFiscal"
import AdminLicenciamentos from "@/pages/admin/AdminLicenciamentos"
import AdminSimulacaoLicenciamento from "@/pages/admin/AdminSimulacaoLicenciamento"
import AdminExtratoAtleta from "@/pages/admin/AdminExtratoAtleta"

/* ======================
   Atleta
   ====================== */
import AtletaDashboard from "@/pages/atleta/AtletaDashboard"
import AtletaPerfil from "@/pages/atleta/AtletaPerfil"
import AtletaExtrato from "@/pages/atleta/AtletaExtrato"

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
          ROTAS DA ATLETA (PROTEGIDAS)
          Prefixadas com /dashboard para evitar conflitos
          ===================================================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ATLETA"]}>
            <LayoutAtleta />
          </ProtectedRoute>
        }
      >
        {/* Redireciona /dashboard para /dashboard/atleta */}
        <Route index element={<Navigate to="/dashboard/atleta" replace />} />
        <Route path="atleta" element={<AtletaDashboard />} />
        <Route path="perfil" element={<AtletaPerfil />} />
        <Route path="extrato" element={<AtletaExtrato />} />
      </Route>

      {/* =====================================================
          ROTAS ADMIN (PROTEGIDAS)
          Prefixadas explicitamente com /admin
          ===================================================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <LayoutAdmin />
          </ProtectedRoute>
        }
      >
        {/* 🔹 ADMIN DASHBOARD - Acessado via /admin */}
        <Route index element={<AdminDashboard />} />

        {/* 🔹 ADMIN – LICENCIAMENTOS & FINANCEIRO */}
        <Route path="licenciamentos" element={<AdminLicenciamentos />} />
        <Route
          path="licenciamentos/simulacao"
          element={<AdminSimulacaoLicenciamento />}
        />
        <Route
          path="licenciamentos/extratos"
          element={<AdminExtratoAtleta />}
        />

        {/* 🔹 ADMIN – MODALIDADES */}
        <Route path="modalidades" element={<AdminModalidades />} />
        <Route path="modalidades/nova" element={<ModalidadeForm />} />
        <Route
          path="modalidades/editar/:id"
          element={<ModalidadeForm />}
        />

        {/* 🔹 ADMIN – ATLETAS */}
        <Route path="atletas" element={<AdminAtletas />} />
        <Route path="atletas/nova" element={<AtletaForm />} />
        <Route path="atletas/editar/:id" element={<AtletaForm />} />

        {/* 🔹 ADMIN – CONFIGURAÇÃO FISCAL */}
        <Route
          path="configuracao-fiscal"
          element={<AdminConfiguracaoFiscal />}
        />
      </Route>

      {/* =====================================================
          FALLBACK
          ===================================================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
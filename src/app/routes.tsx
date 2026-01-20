/* =====================================================
   CONFIGURAÇÃO CENTRAL DE ROTAS
   Funcionalidade: Gerenciamento de acessos e layouts
   Alinhado a: Slug-based URLs (Público) e ID-based (Admin)
   ===================================================== */

import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/auth/ProtectedRoute"

/* ======================
    Layouts
   ====================== */
import LayoutPublic from "@/layouts/LayoutPublic"
import LayoutAdmin from "@/pages/admin/LayoutAdmin"
import LayoutAtleta from "@/pages/atleta/LayoutAtleta"

/* ======================
    Páginas Públicas
   ====================== */
import Home from "@/pages/public/Home"
import ModalidadesList from "@/pages/public/ModalidadesList"
import ModalidadeDetail from "@/pages/public/ModalidadeDetail"
import AtletasList from "@/pages/public/AtletasList"
import AtletaDetail from "@/pages/public/AtletaDetail"
import Sobre from "@/pages/public/Sobre"
import Arquitetura from "@/pages/public/Arquitetura"

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
          ROTAS PÚBLICAS (Visitantes)
          ===================================================== */}
      <Route element={<LayoutPublic />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/arquitetura" element={<Arquitetura />} />
        
        <Route path="/modalidades" element={<ModalidadesList />} />
        {/* CORREÇÃO: Usando :slug para URLs amigáveis */}
        <Route path="/modalidades/:slug" element={<ModalidadeDetail />} />
        
        <Route path="/atletas" element={<AtletasList />} />
        {/* CORREÇÃO: Usando :slug para bater com buscarPorSlug() */}
        <Route path="/atleta/:slug" element={<AtletaDetail />} />
        
        <Route path="/login" element={<Login />} />
      </Route>

      {/* =====================================================
          ROTAS DA ATLETA (Protegidas: ROLE_ATLETA)
          ===================================================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ATLETA"]}>
            <LayoutAtleta />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/atleta" replace />} />
        <Route path="atleta" element={<AtletaDashboard />} />
        <Route path="perfil" element={<AtletaPerfil />} />
        <Route path="extrato" element={<AtletaExtrato />} />
      </Route>

      {/* =====================================================
          ROTAS ADMIN (Protegidas: ROLE_ADMIN)
          ===================================================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <LayoutAdmin />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        
        {/* Licenciamentos e Auditoria */}
        <Route path="licenciamentos" element={<AdminLicenciamentos />} />
        <Route path="licenciamentos/simulacao" element={<AdminSimulacaoLicenciamento />} />
        <Route path="licenciamentos/extratos" element={<AdminExtratoAtleta />} />
        
        {/* Gestão de Modalidades (Usa ID para edição técnica) */}
        <Route path="modalidades" element={<AdminModalidades />} />
        <Route path="modalidades/nova" element={<ModalidadeForm />} />
        <Route path="modalidades/editar/:id" element={<ModalidadeForm />} />
        
        {/* Gestão de Atletas (Usa ID para edição técnica) */}
        <Route path="atletas" element={<AdminAtletas />} />
        <Route path="atletas/nova" element={<AtletaForm />} />
        <Route path="atletas/editar/:id" element={<AtletaForm />} />
        
        {/* Parâmetros Globais */}
        <Route path="configuracao-fiscal" element={<AdminConfiguracaoFiscal />} />
      </Route>

      {/* Fallback para rotas inexistentes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
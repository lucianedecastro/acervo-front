/* =====================================================
   CONFIGURAÇÃO CENTRAL DE ROTAS
   - Público (slug)
   - Atleta (registro, cadastro, dashboard)
   - Admin (curadoria e criação histórica)
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
   Público
   ====================== */
import Home from "@/pages/public/Home"
import Sobre from "@/pages/public/Sobre"
import Arquitetura from "@/pages/public/Arquitetura"
import ModalidadesList from "@/pages/public/ModalidadesList"
import ModalidadeDetail from "@/pages/public/ModalidadeDetail"
import AtletasList from "@/pages/public/AtletasList"
import AtletaDetail from "@/pages/public/AtletaDetail"
import ItemAcervoDetail from "@/pages/public/ItemAcervoDetail"
import Login from "@/pages/admin/Login"

/* ======================
   Atleta – Acesso Livre
   ====================== */
import AtletaRegistroForm from "@/pages/atleta/AtletaRegistroForm"

/* ======================
   Atleta – Protegido
   ====================== */
import AtletaCadastroForm from "@/pages/atleta/AtletaCadastroForm"
import AtletaDashboard from "@/pages/atleta/AtletaDashboard"
import AtletaPerfil from "@/pages/atleta/AtletaPerfil"
import AtletaExtrato from "@/pages/atleta/AtletaExtrato"

/* ======================
   Admin
   ====================== */
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminModalidades from "@/pages/admin/AdminModalidades"
import ModalidadeForm from "@/pages/admin/ModalidadeForm"
import AdminAtletas from "@/pages/admin/AdminAtletas"
import AtletaForm from "@/pages/admin/AtletaForm"
import AdminConfiguracaoFiscal from "@/pages/admin/AdminConfiguracaoFiscal"
import AdminVendas from "@/pages/admin/AdminVendas"
import AdminSimulacaoLicenciamento from "@/pages/admin/AdminSimulacaoLicenciamento"
import AdminExtratoAtleta from "@/pages/admin/AdminExtratoAtleta"

/* ======================
   Admin – Acervo
   ====================== */
import AdminAtletaAcervo from "@/pages/admin/AdminAtletaAcervo"
import AdminItemAcervoForm from "@/pages/admin/AdminItemAcervoForm"
import AdminItemAcervoImagens from "@/pages/admin/AdminItemAcervoImagens"

export function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          PÚBLICO
         ===================================================== */}
      <Route element={<LayoutPublic />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/arquitetura" element={<Arquitetura />} />

        <Route path="/modalidades" element={<ModalidadesList />} />
        <Route path="/modalidades/:slug" element={<ModalidadeDetail />} />

        <Route path="/atletas" element={<AtletasList />} />
        <Route path="/atleta/:slug" element={<AtletaDetail />} />

        {/* Detalhe do Item do Acervo */}
        <Route path="/acervo/item/:id" element={<ItemAcervoDetail />} />

        {/* Registro inicial da atleta */}
        <Route path="/atleta/registro" element={<AtletaRegistroForm />} />

        <Route path="/login" element={<Login />} />
      </Route>

      {/* =====================================================
          ATLETA (ROLE_ATLETA)
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

        {/* Dashboard */}
        <Route path="atleta" element={<AtletaDashboard />} />

        {/* Completar cadastro após login */}
        <Route path="cadastro" element={<AtletaCadastroForm />} />

        {/* Perfil e financeiro */}
        <Route path="perfil" element={<AtletaPerfil />} />
        <Route path="extrato" element={<AtletaExtrato />} />
      </Route>

      {/* =====================================================
          ADMIN (ROLE_ADMIN)
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

        {/* Atletas */}
        <Route path="atletas" element={<AdminAtletas />} />
        <Route path="atletas/nova" element={<AtletaForm />} />
        <Route path="atletas/editar/:id" element={<AtletaForm />} />

        {/* Acervo por atleta */}
        <Route
          path="atletas/:id/acervo"
          element={<AdminAtletaAcervo />}
        />

        {/* Itens de acervo */}
        <Route
          path="acervo/novo"
          element={<AdminItemAcervoForm />}
        />
        <Route
          path="acervo/editar/:id"
          element={<AdminItemAcervoForm />}
        />
        <Route
          path="acervo/imagens/:itemId"
          element={<AdminItemAcervoImagens />}
        />

        {/* Modalidades */}
        <Route path="modalidades" element={<AdminModalidades />} />
        <Route path="modalidades/nova" element={<ModalidadeForm />} />
        <Route path="modalidades/editar/:id" element={<ModalidadeForm />} />

        {/* Licenciamento */}
        <Route path="licenciamentos" element={<AdminVendas />} />
        <Route
          path="licenciamentos/simulacao"
          element={<AdminSimulacaoLicenciamento />}
        />
        <Route
          path="licenciamentos/extratos"
          element={<AdminExtratoAtleta />}
        />

        {/* Fiscal */}
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
/* =====================================================
   COMPONENTE PRINCIPAL (ROOT)
   Funcionalidade: Ponto de entrada e Provedores Globais
   Configuração: React Router + Auth Context
   ===================================================== */

import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "@/auth/AuthContext"
import { AppRoutes } from "./routes"

import "@/App.css"

export default function App() {
  return (
    <BrowserRouter>
      {/* O AuthProvider deve estar dentro do Router para usar hooks de navegação */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
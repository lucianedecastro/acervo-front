/* =====================================================
   COMPONENTE PRINCIPAL (ROOT)
   Funcionalidade: Ponto de entrada e Provedores Globais
   Configuração: React Router + Auth Context
   ===================================================== */

import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "@/auth/AuthContext"
import { AppRoutes } from "./routes"
import { AcessibilidadeProvider } from "@/components/acessibilidade/AcessibilidadeContext"
import BarraAcessibilidade from "@/components/acessibilidade/BarraAcessibilidade"
import LinksDeSalto from "@/components/acessibilidade/LinksDeSalto"
import AnunciadorDeRota from "@/components/acessibilidade/AnunciadorDeRota"
import VLibras from "@/components/acessibilidade/VLibras"

import "@/App.css"

export default function App() {
  return (
    <BrowserRouter>
      {/* O AuthProvider deve estar dentro do Router para usar hooks de navegação */}
      <AcessibilidadeProvider>
        <LinksDeSalto />
        <AuthProvider>
          <AnunciadorDeRota />
          <AppRoutes />
        </AuthProvider>
        <BarraAcessibilidade />
        <VLibras />
      </AcessibilidadeProvider>
    </BrowserRouter>
  )
}
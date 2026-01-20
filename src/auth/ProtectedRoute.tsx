/* =====================================================
   GUARDA DE ROTAS (PROTECTED ROUTE)
   Funcionalidade: Controle de Acesso por Autenticação e Role
   Alinhado a: AuthContext e AppRoutes
   ===================================================== */

import { Navigate, useLocation } from "react-router-dom"
import { ReactNode } from "react"
import { useAuth } from "./AuthContext"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, role, isLoading } = useAuth()
  const location = useLocation()

  /* ==========================
      1. ESTADO DE CARREGAMENTO
      Impede redirecionamentos incorretos enquanto
      o token está sendo validado no localStorage.
     ========================== */
  if (isLoading) {
    return (
      <div style={{ padding: "5rem", textAlign: "center", color: "#666" }}>
        <p>Validando credenciais de acesso...</p>
      </div>
    )
  }

  /* ==========================
      2. BARREIRA DE AUTENTICAÇÃO
      Se não houver token válido, envia para o login.
      Guardamos a 'location' original para retornar
      após o login bem-sucedido.
     ========================== */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  /* ==========================
      3. BARREIRA DE PERMISSÃO (ROLE)
      Verifica se a role do usuário (ex: ROLE_ADMIN)
      está na lista de permitidas da rota.
     ========================== */
  if (allowedRoles && role) {
    const hasPermission = allowedRoles.some(r => r.toUpperCase() === role.toUpperCase())
    
    if (!hasPermission) {
      console.warn(`[Acesso Negado] Usuário ${role} tentou acessar rota de ${allowedRoles}`)
      // Redireciona para o portal público ou para o dashboard específico da role
      return <Navigate to="/" replace />
    }
  }

  /* ==========================
      4. ACERVO LIBERADO
     ========================== */
  return <>{children}</>
}
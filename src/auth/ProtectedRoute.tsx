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
     ⏳ Aguarda AuthContext
     ========================== */
  if (isLoading) {
    return null
  }

  /* ==========================
     🔐 Não autenticado
     ========================== */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  /* ==========================
     🚫 Role não autorizada
     ========================== */
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/" replace />
  }

  /* ==========================
     ✅ Autorizado
     ========================== */
  return <>{children}</>
}

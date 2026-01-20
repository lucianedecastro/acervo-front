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
  const { isAuthenticated, role, logout } = useAuth()
  const location = useLocation()

  // 🔐 Não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // 🚫 Role não autorizada
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  // ⚠️ Token inválido (logado sem role)
  if (allowedRoles && !role) {
    logout()
    return <Navigate to="/login" replace />
  }

  // ✅ Autorizado
  return <>{children}</>
}

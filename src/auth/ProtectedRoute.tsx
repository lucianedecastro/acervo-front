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
  const { token, role, logout } = useAuth()
  const location = useLocation()

  // 🔐 Não autenticado (SEM token)
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // ⏳ Token existe, mas role ainda não foi resolvida
  // → evita redirect prematuro
  if (allowedRoles && !role) {
    return null
  }

  // 🚫 Role não autorizada
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  // ✅ Autenticado e autorizado
  return <>{children}</>
}

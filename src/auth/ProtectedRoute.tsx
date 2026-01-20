import { Navigate, useLocation } from "react-router-dom"
import { ReactNode } from "react"
import { useAuth } from "./AuthContext"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, isLoading, logout } = useAuth()
  const location = useLocation()

  if (isLoading) return null // ⏳ aguarda contexto

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !role) {
    logout()
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

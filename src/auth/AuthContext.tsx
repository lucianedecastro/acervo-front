import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react"
import { jwtDecode } from "jwt-decode"

interface TokenPayload {
  sub: string
  role?: string
  roles?: string[]
  scope?: string
}

interface AuthContextData {
  token: string | null
  role: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  )
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem("authToken")
    setToken(null)
    setRole(null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!token) {
      setRole(null)
      setIsLoading(false)
      return
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token)
      const resolvedRole =
        decoded.role ||
        decoded.roles?.[0] ||
        decoded.scope?.split(" ")?.[0] ||
        null

      setRole(resolvedRole)
    } catch {
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [token, logout])

  function login(newToken: string) {
    localStorage.setItem("authToken", newToken)
    setToken(newToken)
    setIsLoading(true)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}

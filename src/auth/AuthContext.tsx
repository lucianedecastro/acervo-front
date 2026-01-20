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
  exp?: number
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
    async function validateToken() {
      if (!token) {
        setRole(null)
        setIsLoading(false)
        return
      }

      try {
        const decoded = jwtDecode<TokenPayload>(token)

        // ⛔ TOKEN EXPIRADO
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn("⛔ Token expirado")
          logout()
          return
        }

        const resolvedRole =
          decoded.role ||
          decoded.roles?.[0] ||
          decoded.scope?.split(" ")?.[0] ||
          null

        if (!resolvedRole) {
          logout()
          return
        }

        setRole(resolvedRole)
      } catch {
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    validateToken()
  }, [token, logout])

  function login(newToken: string) {
    localStorage.setItem("authToken", newToken)
    setToken(newToken)
    setIsLoading(true) // Força o estado de carregamento para processar o novo token
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        // Só é considerado autenticado se tiver token E o role já foi processado
        isAuthenticated: Boolean(token && role),
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
  if (!ctx) throw new Error("useAuth fora do provider")
  return ctx
}
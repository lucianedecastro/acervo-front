import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react"
import { jwtDecode } from "jwt-decode"

/* ==========================
   JWT PAYLOAD
   ========================== */
interface TokenPayload {
  sub: string
  role?: string
  roles?: string[]
  scope?: string
}

/* ==========================
   CONTEXTO
   ========================== */
interface AuthContextData {
  token: string | null
  role: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

/* ==========================
   PROVIDER
   ========================== */
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  )
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /* ==========================
     LOGOUT
     ========================== */
  const logout = useCallback(() => {
    localStorage.removeItem("authToken")
    setToken(null)
    setRole(null)
    setIsLoading(false)
  }, [])

  /* ==========================
     DECODIFICA TOKEN
     ========================== */
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
    } catch (err) {
      console.error("Token inválido ou corrompido:", err)
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [token, logout])

  /* ==========================
     LOGIN
     ========================== */
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

/* ==========================
   HOOK
   ========================== */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}

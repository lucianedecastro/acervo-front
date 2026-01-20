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
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  )
  const [role, setRole] = useState<string | null>(null)

  /* ==========================
     LOGOUT (memoizado)
     ========================== */
  const logout = useCallback(() => {
    localStorage.removeItem("authToken")
    setToken(null)
    setRole(null)
  }, [])

  /* ==========================
     DECODE JWT
     ========================== */
  useEffect(() => {
    if (!token) {
      setRole(null)
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
    }
  }, [token, logout])

  /* ==========================
     LOGIN
     ========================== */
  function login(newToken: string) {
    localStorage.setItem("authToken", newToken)
    setToken(newToken)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated: Boolean(token && role),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}

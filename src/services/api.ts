// src/services/api.ts
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios"

/**
 * Base URL da API
 * Prioridade:
 * 1) VITE_API_URL (Vercel / local)
 * 2) Fallback seguro (Render)
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://acervo-api.onrender.com"

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    "⚠️ VITE_API_URL não definida. Usando fallback:",
    API_BASE_URL
  )
}

/**
 * Instância principal do Axios
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

/**
 * ==========================
 * REQUEST INTERCEPTOR
 * Injeta JWT automaticamente
 * ==========================
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

/**
 * ==========================
 * RESPONSE INTERCEPTOR
 * Trata 401 SEM navegar
 * ==========================
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 Unauthorized — token inválido ou expirado")
      // 👉 apenas limpa o token
      localStorage.removeItem("authToken")
    }

    return Promise.reject(error)
  }
)

export default api

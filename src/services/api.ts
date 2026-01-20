// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

/**
 * Base URL da API
 * Prioridade:
 * 1) VITE_API_URL
 * 2) Swagger (fallback seguro)
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://acervo-api.onrender.com"

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    "⚠️ VITE_API_URL não definida. Usando fallback do Swagger:",
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
 * Interceptor de REQUEST
 * Injeta automaticamente o JWT (se existir)
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
 * Interceptor de RESPONSE
 * Centraliza tratamento de erro
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 Unauthorized — token inválido ou expirado")

      localStorage.removeItem("authToken")

      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api

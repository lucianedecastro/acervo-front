/* =====================================================
   CONFIGURAÇÃO DA API (AXIOS)
   Funcionalidade: Comunicação centralizada com o backend
   ===================================================== */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

// Define a URL base priorizando variáveis de ambiente para deploy seguro
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://acervo-api.onrender.com"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos de limite para uploads de mídia pesados
  headers: {
    "Content-Type": "application/json",
  },
})

/* ==========================
    INTERCEPTOR: REQUEST
    ========================== */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Busca o token salvo pelo AuthContext no momento do login
    const token = localStorage.getItem("authToken")

    if (token && config.headers) {
      // Aplica o token em todas as chamadas privadas (Atleta e Admin)
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* ==========================
    INTERCEPTOR: RESPONSE
    ========================== */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Gerenciamento de erro de autenticação (401)
    if (error.response?.status === 401) {
      console.warn("⚠️ Sessão expirada ou acesso não autorizado.")

      // NÃO remove token aqui
      // Deixe o AuthContext decidir o que fazer
    }

    // Tratamento genérico de erros para facilitar o debug no console
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response?.data || error.message)
    }

    return Promise.reject(error)
  }
)

export default api
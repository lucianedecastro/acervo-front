// src/services/api.ts
import axios from 'axios'

/**
 * Base URL da API
 * Vem do .env (VITE_API_URL)
 */
const API_BASE_URL = import.meta.env.VITE_API_URL

if (!API_BASE_URL) {
  console.error('❌ VITE_API_URL não está definida no .env')
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
  (config) => {
    const token = localStorage.getItem('authToken')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Interceptor de RESPONSE
 * Centraliza tratamento de erro
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status

      if (status === 401) {
        console.warn('⚠️ 401 Unauthorized — token inválido ou expirado')

        // limpa sessão
        localStorage.removeItem('authToken')

        // evita loop se já estiver no login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api

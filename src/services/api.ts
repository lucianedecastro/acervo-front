import axios from "axios"

/**
 * Base URL da API
 * Vem do .env (VITE_API_URL)
 */
const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

/**
 * Interceptor para injetar JWT automaticamente
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api

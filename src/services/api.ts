// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://acervo-api.onrender.com"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

/* ==========================
   REQUEST
   ========================== */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* ==========================
   RESPONSE
   ========================== */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 Unauthorized")

      // 🔴 NÃO REDIRECIONAR AQUI
      // 🔴 NÃO window.location
      // 🔴 NÃO forçar login global

      localStorage.removeItem("authToken")
    }

    return Promise.reject(error)
  }
)

export default api

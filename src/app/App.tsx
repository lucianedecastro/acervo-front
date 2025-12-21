import { BrowserRouter } from "react-router-dom"

import { AuthProvider } from "@/auth/AuthContext"
import { AppRoutes } from "@/app/routes"

import "@/App.css"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

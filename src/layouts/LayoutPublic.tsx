import { Outlet } from "react-router-dom"
import Footer from "@/components/Footer"

export default function LayoutPublic() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}

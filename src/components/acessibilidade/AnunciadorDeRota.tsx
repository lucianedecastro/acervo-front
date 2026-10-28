import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

const NOME_DO_SITE = "Acervo Carmen Lydia"

/**
 * Em um site de página única o leitor de tela não percebe a troca de página.
 * A cada navegação: atualiza o título da aba (WCAG 2.4.2), avisa por região
 * "aria-live" e leva o foco ao conteúdo principal.
 */
export default function AnunciadorDeRota() {
  const { pathname } = useLocation()
  const primeiraCarga = useRef(true)
  const [aviso, setAviso] = useState("")

  useEffect(() => {
    // Espera a página montar para ler o título (h1) dela
    const espera = window.setTimeout(() => {
      const h1 = document.querySelector("#conteudo h1")?.textContent?.trim()
      const titulo = h1 || NOME_DO_SITE
      document.title = h1 ? `${h1} | ${NOME_DO_SITE}` : NOME_DO_SITE

      if (!primeiraCarga.current) {
        setAviso(`Página carregada: ${titulo}`)
        document.getElementById("conteudo")?.focus({ preventScroll: true })
      }
      primeiraCarga.current = false
    }, 400)

    return () => window.clearTimeout(espera)
  }, [pathname])

  return <div role="status" aria-live="polite" className="sr-only">{aviso}</div>
}

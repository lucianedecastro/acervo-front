import { useEffect } from "react"

/**
 * VLibras — tradução do conteúdo para Libras (widget oficial do governo federal).
 * Carrega o script uma única vez e fica disponível em todas as páginas.
 */
declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown }
    __vlibrasIniciado?: boolean
  }
}

const SCRIPT_URL = "https://vlibras.gov.br/app/vlibras-plugin.js"
const APP_URL = "https://vlibras.gov.br/app"

// Atributos próprios do widget (sem tipagem no React)
const atributoVw = { vw: "" } as Record<string, string>
const atributoBotao = { "vw-access-button": "" } as Record<string, string>
const atributoPlugin = { "vw-plugin-wrapper": "" } as Record<string, string>

export default function VLibras() {
  useEffect(() => {
    if (window.__vlibrasIniciado) return
    window.__vlibrasIniciado = true

    const iniciar = () => {
      try {
        new window.VLibras!.Widget(APP_URL)
      } catch (erro) {
        console.warn("Não foi possível iniciar o VLibras", erro)
      }
    }

    if (window.VLibras) {
      iniciar()
      return
    }

    const script = document.createElement("script")
    script.src = SCRIPT_URL
    script.async = true
    script.onload = iniciar
    document.body.appendChild(script)
  }, [])

  return (
    <div {...atributoVw} className="enabled">
      <div {...atributoBotao} className="active" />
      <div {...atributoPlugin}>
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  )
}

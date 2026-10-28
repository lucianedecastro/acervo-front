import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react"

/** Passos de tamanho do texto, aplicados como escala sobre o tamanho base (rem). */
export const ESCALAS_FONTE = [1, 1.15, 1.3, 1.5] as const

export interface OpcoesAcessibilidade {
  /** Índice em ESCALAS_FONTE */
  escala: number
  contraste: boolean
  links: boolean
  fonteLegivel: boolean
  espacamento: boolean
  semAnimacao: boolean
}

const PADRAO: OpcoesAcessibilidade = {
  escala: 0,
  contraste: false,
  links: false,
  fonteLegivel: false,
  espacamento: false,
  semAnimacao: false,
}

const CHAVE = "acl-acessibilidade"

function carregar(): OpcoesAcessibilidade {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return PADRAO
    const lido = JSON.parse(bruto) as Partial<OpcoesAcessibilidade>
    const escala = Number.isInteger(lido.escala) ? Math.min(Math.max(lido.escala as number, 0), ESCALAS_FONTE.length - 1) : 0
    return {
      escala,
      contraste: lido.contraste === true,
      links: lido.links === true,
      fonteLegivel: lido.fonteLegivel === true,
      espacamento: lido.espacamento === true,
      semAnimacao: lido.semAnimacao === true,
    }
  } catch {
    return PADRAO
  }
}

interface Contexto {
  opcoes: OpcoesAcessibilidade
  aumentarFonte: () => void
  diminuirFonte: () => void
  alternar: (chave: Exclude<keyof OpcoesAcessibilidade, "escala">) => void
  restaurar: () => void
  /** Há alguma opção diferente do padrão? */
  alterado: boolean
}

const AcessibilidadeContext = createContext<Contexto | null>(null)

export function AcessibilidadeProvider({ children }: { children: ReactNode }) {
  const [opcoes, setOpcoes] = useState<OpcoesAcessibilidade>(carregar)

  // Aplica no <html> e guarda a preferência
  useEffect(() => {
    const html = document.documentElement
    html.style.setProperty("--a11y-escala", String(ESCALAS_FONTE[opcoes.escala]))
    html.classList.toggle("a11y-contraste", opcoes.contraste)
    html.classList.toggle("a11y-links", opcoes.links)
    html.classList.toggle("a11y-fonte-legivel", opcoes.fonteLegivel)
    html.classList.toggle("a11y-espacamento", opcoes.espacamento)
    html.classList.toggle("a11y-sem-animacao", opcoes.semAnimacao)

    try {
      localStorage.setItem(CHAVE, JSON.stringify(opcoes))
    } catch {
      /* navegação privada ou armazenamento bloqueado: a opção vale só nesta visita */
    }
  }, [opcoes])

  const aumentarFonte = useCallback(
    () => setOpcoes(o => ({ ...o, escala: Math.min(o.escala + 1, ESCALAS_FONTE.length - 1) })), [])
  const diminuirFonte = useCallback(
    () => setOpcoes(o => ({ ...o, escala: Math.max(o.escala - 1, 0) })), [])
  const alternar = useCallback(
    (chave: Exclude<keyof OpcoesAcessibilidade, "escala">) => setOpcoes(o => ({ ...o, [chave]: !o[chave] })), [])
  const restaurar = useCallback(() => setOpcoes(PADRAO), [])

  const valor = useMemo<Contexto>(() => ({
    opcoes, aumentarFonte, diminuirFonte, alternar, restaurar,
    alterado: JSON.stringify(opcoes) !== JSON.stringify(PADRAO),
  }), [opcoes, aumentarFonte, diminuirFonte, alternar, restaurar])

  return <AcessibilidadeContext.Provider value={valor}>{children}</AcessibilidadeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAcessibilidade(): Contexto {
  const ctx = useContext(AcessibilidadeContext)
  if (!ctx) throw new Error("useAcessibilidade deve ser usado dentro de AcessibilidadeProvider")
  return ctx
}

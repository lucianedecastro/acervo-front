import { useEffect, useRef, useState } from "react"
import { Accessibility, Minus, Plus, RotateCcw, X } from "lucide-react"
import { ESCALAS_FONTE, OpcoesAcessibilidade, useAcessibilidade } from "./AcessibilidadeContext"

type Alternavel = Exclude<keyof OpcoesAcessibilidade, "escala">

const RECURSOS: { chave: Alternavel; titulo: string; descricao: string }[] = [
  { chave: "contraste", titulo: "Alto contraste", descricao: "Fundo preto com texto claro" },
  { chave: "links", titulo: "Sublinhar links", descricao: "Destaca todos os links" },
  { chave: "fonteLegivel", titulo: "Fonte mais legível", descricao: "Troca por uma fonte sem serifa" },
  { chave: "espacamento", titulo: "Espaçamento do texto", descricao: "Mais espaço entre linhas e letras" },
  { chave: "semAnimacao", titulo: "Reduzir animações", descricao: "Remove movimentos e transições" },
]

export default function BarraAcessibilidade() {
  const { opcoes, aumentarFonte, diminuirFonte, alternar, restaurar, alterado } = useAcessibilidade()
  const [aberta, setAberta] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const fecharRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (aberta) fecharRef.current?.focus()
  }, [aberta])

  function fechar() {
    setAberta(false)
    botaoRef.current?.focus()
  }

  const percentual = Math.round(ESCALAS_FONTE[opcoes.escala] * 100)

  return (
    <div
      className="fixed left-4 bottom-4 z-[60]"
      onKeyDown={e => { if (e.key === "Escape" && aberta) fechar() }}
    >
      {aberta && (
        <section
          id="painel-acessibilidade"
          aria-label="Opções de acessibilidade"
          className="mb-3 w-[calc(100vw-2rem)] max-w-xs bg-white border-2 border-acl-ink rounded p-4 shadow-lg max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-acl-ink">Acessibilidade</h2>
            <button
              ref={fecharRef}
              type="button"
              onClick={fechar}
              aria-label="Fechar opções de acessibilidade"
              className="p-1.5 border border-acl-field rounded-sm text-acl-ink hover:border-acl-gold-deep"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Tamanho do texto */}
          <div className="mb-4">
            <p className="text-sm text-acl-ink mb-2" id="rotulo-tamanho-texto">Tamanho do texto</p>
            <div className="flex items-center gap-2" role="group" aria-labelledby="rotulo-tamanho-texto">
              <button
                type="button"
                onClick={diminuirFonte}
                disabled={opcoes.escala === 0}
                aria-label="Diminuir texto"
                className="p-2 border border-acl-field rounded-sm text-acl-ink hover:border-acl-gold-deep disabled:opacity-40"
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span className="flex-1 text-center text-sm text-acl-ink" role="status" aria-live="polite">
                {percentual}%
              </span>
              <button
                type="button"
                onClick={aumentarFonte}
                disabled={opcoes.escala === ESCALAS_FONTE.length - 1}
                aria-label="Aumentar texto"
                className="p-2 border border-acl-field rounded-sm text-acl-ink hover:border-acl-gold-deep disabled:opacity-40"
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Opções liga/desliga */}
          <ul className="space-y-2">
            {RECURSOS.map(r => {
              const ligado = opcoes[r.chave]
              return (
                <li key={r.chave}>
                  <button
                    type="button"
                    onClick={() => alternar(r.chave)}
                    aria-pressed={ligado}
                    className="w-full flex items-center justify-between gap-3 text-left p-3 border border-acl-field rounded-sm hover:border-acl-gold-deep"
                  >
                    <span>
                      <span className="block text-sm text-acl-ink">{r.titulo}</span>
                      <span className="block text-xs text-acl-muted">{r.descricao}</span>
                    </span>
                    <span className={`shrink-0 text-xs px-2 py-1 rounded-sm border ${ligado ? "bg-acl-gold text-acl-ink border-acl-gold" : "border-acl-field text-acl-muted"}`}>
                      {ligado ? "Ligado" : "Desligado"}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            onClick={restaurar}
            disabled={!alterado}
            className="mt-4 w-full flex items-center justify-center gap-2 p-2.5 text-sm border border-acl-field rounded-sm text-acl-ink hover:border-acl-gold-deep disabled:opacity-40"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Restaurar padrões
          </button>

          <p className="mt-4 text-xs text-acl-muted">
            Tradução em Libras disponível no botão do VLibras.{" "}
            <a href="/acessibilidade" className="underline text-acl-gold-text">Saiba mais sobre a acessibilidade do site</a>.
          </p>
        </section>
      )}

      <button
        ref={botaoRef}
        type="button"
        onClick={() => setAberta(a => !a)}
        aria-expanded={aberta}
        aria-controls="painel-acessibilidade"
        aria-label="Opções de acessibilidade"
        className="flex items-center gap-2 px-4 py-3 bg-acl-ink text-acl-cream rounded-sm shadow-lg border-2 border-acl-cream hover:bg-acl-gold hover:text-acl-ink transition-colors"
      >
        <Accessibility size={22} aria-hidden="true" />
        <span className="text-sm font-medium">Acessibilidade</span>
      </button>
    </div>
  )
}

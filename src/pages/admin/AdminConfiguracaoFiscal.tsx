import { useEffect, useState } from "react"
import { configuracaoFiscalService } from "@/services/configuracaoFiscalService"
import { ConfiguracaoFiscal, ConfiguracaoFiscalDTO } from "@/types/configuracaoFiscal"
import { Settings, Save } from "lucide-react"

export default function AdminConfiguracaoFiscal() {
  const [config, setConfig] = useState<ConfiguracaoFiscal | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [repasseAtleta, setRepasseAtleta] = useState(0)
  const [comissaoPlataforma, setComissaoPlataforma] = useState(0)
  const [observacaoLegal, setObservacaoLegal] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        setError(null)
        const data = await configuracaoFiscalService.buscar()
        setConfig(data)
        setRepasseAtleta(data.percentualRepasseAtleta * 100)
        setComissaoPlataforma(data.percentualComissaoPlataforma * 100)
        setObservacaoLegal(data.observacaoLegal || "")
      } catch (err) {
        console.error("Erro ao carregar configurações fiscais:", err)
        setError("Não foi possível carregar as regras fiscais atuais.")
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (repasseAtleta + comissaoPlataforma !== 100) {
      alert("A soma do repasse e da comissão deve ser exatamente 100%.")
      return
    }

    setSaving(true)

    const payload: ConfiguracaoFiscalDTO = {
      percentualRepasseAtleta: repasseAtleta / 100,
      percentualComissaoPlataforma: comissaoPlataforma / 100,
      observacaoLegal,
    }

    try {
      const atualizado = await configuracaoFiscalService.atualizar(payload)
      setConfig(atualizado)
      alert("Configuração fiscal global atualizada com sucesso!")
    } catch (err) {
      console.error("Erro ao salvar configuração fiscal:", err)
      alert("Erro ao salvar as novas taxas.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-10 h-10 bg-acl-gold rounded-sm mx-auto mb-4 animate-fade-pulse" />
        <p className="text-sm text-acl-muted">Carregando regras fiscais...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <p className="text-acl-wine text-sm text-center">{error}</p>
    </div>
  )

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink flex items-center gap-3 mb-2">
          <Settings size={24} className="text-acl-gold-deep" />
          Configuração fiscal do acervo
        </h1>
        <p className="text-acl-muted text-sm">
          Defina as taxas padrão para todos os licenciamentos da plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-editorial p-6 space-y-5">

        <div>
          <label className="block text-xs text-acl-muted mb-1.5">
            % Repasse para atleta
          </label>
          <input
            type="number"
            step="0.01"
            value={repasseAtleta}
            onChange={(e) => setRepasseAtleta(Number(e.target.value))}
            required
            className="w-full border border-acl-line rounded-sm p-2.5 text-base focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        <div>
          <label className="block text-xs text-acl-muted mb-1.5">
            % Comissão da plataforma
          </label>
          <input
            type="number"
            step="0.01"
            value={comissaoPlataforma}
            onChange={(e) => setComissaoPlataforma(Number(e.target.value))}
            required
            className="w-full border border-acl-line rounded-sm p-2.5 text-base focus:outline-none focus:border-acl-gold-deep"
          />
        </div>

        <div>
          <label className="block text-xs text-acl-muted mb-1.5">
            Observação legal (exibida em contratos/faturas)
          </label>
          <textarea
            rows={4}
            value={observacaoLegal}
            onChange={(e) => setObservacaoLegal(e.target.value)}
            className="w-full border border-acl-line rounded-sm p-2.5 text-sm focus:outline-none focus:border-acl-gold-deep resize-none"
          />
        </div>

        <div className="bg-acl-cream rounded-sm p-4">
          <p className="text-xs text-acl-muted mb-2">Informações do sistema</p>
          <p className="text-xs text-acl-ink-soft">
            Última atualização: {config?.atualizadoEm ? new Date(config.atualizadoEm).toLocaleString("pt-BR") : "N/A"}
          </p>
          <p className="text-xs text-acl-ink-soft">
            Por: {config?.atualizadoPor || "Sistema"}
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Processando..." : "Salvar configuração"}
        </button>
      </form>
    </div>
  )
}
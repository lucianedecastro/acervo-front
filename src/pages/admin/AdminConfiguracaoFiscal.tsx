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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#D4A244] border-6 border-black rounded-xl mx-auto mb-4 animate-pulse"></div>
        <p className="text-sm sm:text-lg font-black uppercase tracking-wide">Carregando regras fiscais...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <p className="text-lg sm:text-xl font-black text-red-600 uppercase text-center">{error}</p>
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2 text-black flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Settings size={36} strokeWidth={3} className="sm:w-12 sm:h-12" />
          <span className="leading-tight">Configuração Fiscal do Acervo</span>
        </h1>
        <p className="text-gray-600 font-bold text-sm sm:text-base lg:text-lg mt-3">
          Defina as taxas padrão para todos os licenciamentos da plataforma.
        </p>
        <div className="w-24 sm:w-32 h-2 bg-[#D4A244] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-3"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-4 sm:border-6 border-black rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">

        <div>
          <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">
            % Repasse para Atleta
          </label>
          <input
            type="number"
            step="0.01"
            value={repasseAtleta}
            onChange={(e) => setRepasseAtleta(Number(e.target.value))}
            required
            className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">
            % Comissão da Plataforma
          </label>
          <input
            type="number"
            step="0.01"
            value={comissaoPlataforma}
            onChange={(e) => setComissaoPlataforma(Number(e.target.value))}
            required
            className="w-full px-4 py-3 border-4 border-black rounded-lg font-bold text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[#D4A244]"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-black uppercase mb-3 text-gray-700">
            Observação Legal (Exibida em contratos/faturas)
          </label>
          <textarea
            rows={4}
            value={observacaoLegal}
            onChange={(e) => setObservacaoLegal(e.target.value)}
            className="w-full px-4 py-3 border-4 border-black rounded-lg font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[#D4A244] resize-none"
          />
        </div>

        <div className="bg-gray-50 border-4 border-gray-300 rounded-lg p-4">
          <p className="text-xs font-bold uppercase text-gray-600 mb-2">Informações do Sistema</p>
          <p className="text-xs sm:text-sm text-gray-700">
            <strong>Última atualização:</strong> {config?.atualizadoEm ? new Date(config.atualizadoEm).toLocaleString("pt-BR") : "N/A"}
          </p>
          <p className="text-xs sm:text-sm text-gray-700">
            <strong>Por:</strong> {config?.atualizadoPor || "Sistema"}
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-black uppercase text-xs sm:text-sm border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
          {saving ? "Processando..." : "Salvar Configuração"}
        </button>
      </form>
    </div>
  )
}

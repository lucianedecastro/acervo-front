import { useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { ExtratoLicenciamentoDTO } from "@/types/licenciamento"
import { Search, FileText } from "lucide-react"

export default function AdminExtratoAtleta() {
  const [atletaId, setAtletaId] = useState("")
  const [extrato, setExtrato] = useState<ExtratoLicenciamentoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleBuscar() {
    const id = atletaId.trim()

    if (!id) {
      setError("Por favor, informe o ID da atleta para consulta.")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await licenciamentoService.buscarExtratoConsolidado(id)
      setExtrato(data)
    } catch (err) {
      console.error("Erro ao buscar extrato administrativo:", err)
      setError("Não foi possível localizar o extrato para o ID informado.")
      setExtrato(null)
    } finally {
      setLoading(false)
    }
  }

  const volumeBruto = extrato?.transacoes.reduce((acc, t) => acc + t.valorTotal, 0) ?? 0

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-acl-ink flex items-center gap-3 mb-1">
          <FileText size={24} className="text-acl-gold-deep" />
          Auditoria de extratos
        </h1>
        <p className="text-acl-muted text-sm">
          Consulta consolidada de saldos e histórico por atleta.
        </p>
      </div>

      {/* Busca */}
      <div className="card-editorial p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={atletaId}
            onChange={(e) => setAtletaId(e.target.value)}
            placeholder="ID da atleta"
            className="flex-1 px-4 py-3 border border-acl-line rounded-sm text-sm focus:outline-none focus:border-acl-gold-deep"
          />
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search size={16} />
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-acl-wine/10 border border-acl-wine rounded-sm p-3">
          <p className="text-acl-wine text-sm">{error}</p>
        </div>
      )}

      {extrato && (
        <div className="card-editorial p-6">
          <h2 className="font-serif text-xl text-acl-ink mb-6 pb-4 border-b border-acl-line">
            {extrato.nomeAtleta}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-acl-cream rounded-sm p-5">
              <p className="text-xs text-acl-muted mb-2">Saldo total</p>
              <p className="text-2xl font-serif text-acl-gold-deep">
                {extrato.saldoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>

            <div className="bg-acl-cream rounded-sm p-5">
              <p className="text-xs text-acl-muted mb-2">Volume bruto</p>
              <p className="text-2xl font-serif text-acl-ink">
                {volumeBruto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
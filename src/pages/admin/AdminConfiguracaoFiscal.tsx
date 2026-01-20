import { useEffect, useState } from "react"
import { configuracaoFiscalService } from "@/services/configuracaoFiscalService"
import {
  ConfiguracaoFiscal,
  ConfiguracaoFiscalDTO,
} from "@/types/configuracaoFiscal"

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
        const data = await configuracaoFiscalService.buscar()

        setConfig(data)
        setRepasseAtleta(data.percentualRepasseAtleta)
        setComissaoPlataforma(data.percentualComissaoPlataforma)
        setObservacaoLegal(data.observacaoLegal || "")
      } catch (err) {
        console.error(err)
        setError("Erro ao carregar configuração fiscal.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload: ConfiguracaoFiscalDTO = {
      percentualRepasseAtleta: repasseAtleta,
      percentualComissaoPlataforma: comissaoPlataforma,
      observacaoLegal,
    }

    try {
      const atualizado = await configuracaoFiscalService.atualizar(payload)
      setConfig(atualizado)
      alert("Configuração fiscal atualizada com sucesso.")
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar configuração fiscal.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Carregando configuração fiscal...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <section>
      <h1>Configuração Fiscal do Acervo</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "480px" }}>
        <div>
          <label>% Repasse para Atleta</label>
          <input
            type="number"
            value={repasseAtleta}
            onChange={(e) => setRepasseAtleta(Number(e.target.value))}
          />
        </div>

        <div>
          <label>% Comissão da Plataforma</label>
          <input
            type="number"
            value={comissaoPlataforma}
            onChange={(e) =>
              setComissaoPlataforma(Number(e.target.value))
            }
          />
        </div>

        <div>
          <label>Observação Legal</label>
          <textarea
            rows={4}
            value={observacaoLegal}
            onChange={(e) => setObservacaoLegal(e.target.value)}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configuração"}
        </button>
      </form>
    </section>
  )
}

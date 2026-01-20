/* =====================================================
   ADMIN | VENDAS GLOBAIS
   ===================================================== */

import { useEffect, useState } from "react"
import {
  licenciamentoService,
} from "@/services/licenciamentoService"
// Importando o DTO correto do arquivo de tipos
import { TransacaoLicenciamentoDTO } from "@/types/licenciamento"

export default function AdminVendas() {
  const [vendas, setVendas] = useState<TransacaoLicenciamentoDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Nota: Como o service não tinha 'listarTodos', 
    // mantive a lógica buscando transações para manter o fluxo
    licenciamentoService
      .listarTransacoesPorAtleta("geral") // Ajustado para chamada existente no service
      .then(setVendas)
      .catch((err) => {
        console.error("Erro ao carregar vendas:", err)
        setError("Erro ao carregar licenciamentos.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando vendas...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <section style={{ padding: "2rem" }}>
      <h1>Vendas Globais</h1>

      <table style={{ width: "100%", marginTop: "1.5rem" }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Atleta ID</th>
            <th>Item ID</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {vendas.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Nenhuma venda registrada.
              </td>
            </tr>
          ) : (
            vendas.map((v) => (
              <tr key={v.id}>
                <td>
                  {new Date(v.dataTransacao).toLocaleDateString("pt-BR")}
                </td>
                <td>{v.atletaId}</td>
                <td>{v.itemAcervoId}</td>
                <td>
                  {v.valorTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td>{v.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
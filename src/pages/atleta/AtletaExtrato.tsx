/* =====================================================
   ATLETA | MEU EXTRATO
   ===================================================== */

import { useEffect, useState } from "react"
import { licenciamentoService } from "@/services/licenciamentoService"
import { atletaService } from "@/services/atletaService"
// Importando o DTO correto do arquivo de tipos
import { TransacaoLicenciamentoDTO } from "@/types/licenciamento"

export default function AtletaExtrato() {
  const [transacoes, setTransacoes] = useState<TransacaoLicenciamentoDTO[]>([])
  const [nomeAtleta, setNomeAtleta] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        const atleta = await atletaService.buscarMeuPerfil()
        setNomeAtleta(atleta.nome)

        const data =
          await licenciamentoService.buscarExtratoPorAtleta(atleta.id)
        setTransacoes(data)
      } catch (err) {
        console.error(err)
        setError("Erro ao carregar extrato.")
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  const saldo = transacoes.reduce(
    (acc, t) => acc + t.valorRepasseAtleta,
    0
  )

  if (loading) return <p>Carregando extrato...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <section style={{ padding: "2rem" }}>
      <h1>Meu Extrato</h1>
      <p>Atleta: {nomeAtleta}</p>

      <h2>
        Saldo Total:{" "}
        {saldo.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </h2>

      <table style={{ width: "100%", marginTop: "1.5rem" }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Item ID</th>
            <th>Licença</th>
            <th>Valor Total</th>
            <th>Repasse</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr key={t.id}>
              <td>
                {new Date(t.dataTransacao).toLocaleDateString("pt-BR")}
              </td>
              <td>{t.itemAcervoId}</td>
              <td>{t.tipoLicenca}</td>
              <td>
                {t.valorTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>
                {t.valorRepasseAtleta.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
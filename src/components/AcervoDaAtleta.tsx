import { useEffect, useState } from "react"
import { itemAcervoService } from "@/services/itemAcervoService"
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"
import CardItemAcervo from "@/components/CardItemAcervo"

interface AcervoDaAtletaProps {
  atletaId: string
}

export default function AcervoDaAtleta({ atletaId }: AcervoDaAtletaProps) {
  const [itens, setItens] = useState<ItemAcervoResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!atletaId) return

    async function carregarAcervo() {
      try {
        setLoading(true)
        setError(null)

        const data = await itemAcervoService.listarPorAtleta(atletaId)
        setItens(data)
      } catch (err) {
        setError("Não foi possível carregar o acervo desta atleta.")
      } finally {
        setLoading(false)
      }
    }

    carregarAcervo()
  }, [atletaId])

  if (loading) {
    return (
      <div className="border-4 border-black p-6 text-center font-bold">
        Carregando acervo...
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-4 border-black bg-red-500 text-white p-6 font-bold">
        {error}
      </div>
    )
  }

  if (itens.length === 0) {
    return (
      <div className="border-4 border-black p-6 font-bold text-center">
        Esta atleta ainda não possui itens de acervo publicados.
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-black uppercase">
        Acervo
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {itens.map((item) => (
          <CardItemAcervo
            key={item.id}
            item={item}
          />
        ))}
    </div>
    </section>
  )
}
import { ItemAcervoResponseDTO } from "@/types/itemAcervo"

interface CardItemAcervoProps {
  item: ItemAcervoResponseDTO
}

export default function CardItemAcervo({ item }: CardItemAcervoProps) {
  /**
   * Resolução da imagem pública:
   * - Prioriza foto marcada como destaque
   * - Fallback para a primeira foto disponível
   * - Sempre versão protegida (baixa resolução + watermark)
   */
  const fotoPublica =
    item.fotos?.find((f) => f.ehDestaque)?.url ||
    item.fotos?.[0]?.url

  return (
    <div className="border-4 border-black bg-white p-4 space-y-3">
      {/* Imagem pública protegida */}
      {fotoPublica && (
        <img
          src={fotoPublica}
          alt={item.titulo}
          className="w-full h-48 object-cover border-4 border-black"
        />
      )}

      {/* Título */}
      <h3 className="font-black uppercase text-lg">
        {item.titulo}
      </h3>

      {/* Status editorial */}
      <span className="inline-block border-2 border-black px-3 py-1 text-xs font-black uppercase">
        {item.status === "MEMORIAL"
          ? "Item memorial / pesquisa"
          : "Item do acervo"}
      </span>

      {/* Aviso jurídico */}
      <p className="text-xs font-bold">
        Imagem protegida • Uso mediante autorização expressa
      </p>
    </div>
  )
}

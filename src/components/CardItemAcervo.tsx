import { ItemAcervoResponseDTO } from "@/types/itemAcervo"
import { Link } from "react-router-dom"
import { cloudinaryImage } from "@/utils/cloudinary"

interface CardItemAcervoProps {
  item: ItemAcervoResponseDTO
}

export default function CardItemAcervo({ item }: CardItemAcervoProps) {
  /**
   * Resolução da imagem pública:
   * - Prioriza foto marcada como destaque
   * - Fallback para a primeira foto disponível
   * - Aplica marca d'água via helper centralizado do Cloudinary
   * - Mantém fallback de segurança para a imagem original
   */
  const fotoObj = item.fotos?.find((f) => f.ehDestaque) || item.fotos?.[0]

  /**
   * URL protegida com marca d'água:
   * - Gerada exclusivamente pelo helper cloudinaryImage
   * - Version precisa ser prefixada com "v" (ex: v1770640528)
   */
  const urlProtegida =
    fotoObj?.publicId && fotoObj?.version
      ? cloudinaryImage({
          publicId: fotoObj.publicId,
          version: fotoObj.version,
          contexto: "card-atleta",
        })
      : null

  /**
   * Imagem pública final:
   * - Prioriza versão protegida
   * - Fallback para URL original persistida no backend
   */
  const fotoPublica = urlProtegida || fotoObj?.url

  return (
    <Link
      to={`/acervo/item/${item.id}`}
      className="group block border-4 border-black bg-white p-4 space-y-3 transition-transform hover:-translate-y-1 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      {/* Imagem pública protegida */}
      <div className="relative w-full h-48 bg-gray-200 border-4 border-black overflow-hidden">
        {fotoPublica ? (
          <img
            src={fotoPublica}
            alt={item.titulo}
            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
            onError={(e) => {
              /**
               * Fallback de segurança:
               * - Caso a URL protegida falhe (Cloudinary, cache, etc)
               * - Reverte para a imagem original salva no backend
               */
              if (fotoObj?.url && e.currentTarget.src !== fotoObj.url) {
                e.currentTarget.src = fotoObj.url
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-black uppercase text-xs text-gray-500">
            Sem imagem disponível
          </div>
        )}
      </div>

      {/* Título */}
      <h3 className="font-black uppercase text-lg group-hover:text-yellow-600 transition-colors truncate">
        {item.titulo}
      </h3>

      {/* Status editorial */}
      <span className="inline-block border-2 border-black px-3 py-1 text-xs font-black uppercase bg-gray-50">
        {item.status === "MEMORIAL"
          ? "Item memorial / pesquisa"
          : "Item do acervo"}
      </span>

      {/* Aviso jurídico */}
      <p className="text-xs font-bold text-gray-600">
        Imagem protegida • Uso mediante autorização expressa
      </p>
    </Link>
  )
}

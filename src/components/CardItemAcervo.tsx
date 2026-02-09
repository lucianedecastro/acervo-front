import { ItemAcervoResponseDTO } from "@/types/itemAcervo"
import { Link } from "react-router-dom"

interface CardItemAcervoProps {
  item: ItemAcervoResponseDTO
}

export default function CardItemAcervo({ item }: CardItemAcervoProps) {
  const fotoObj = item.fotos?.find((f) => f.ehDestaque) || item.fotos?.[0]
  const cloudName = "dcet9fpu0"
  const publicId = fotoObj?.publicId

  /**
   * SINTAXE DE OVERLAY CORRIGIDA:
   * A largura da imagem base (w_600) vem primeiro.
   * Depois a layer (l_watermark_acervo).
   * Depois as transformações DA LAYER (c_scale,w_0.8,fl_relative).
   * E por fim a opacidade (o_30).
   */
  const urlProtegida = publicId 
    ? `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_600/l_watermark_acervo/c_scale,w_0.8,fl_relative/o_30/v1/${publicId}`
    : null

  const fotoPublica = urlProtegida || fotoObj?.url

  return (
    <Link 
      to={`/acervo/item/${item.id}`} 
      className="group block border-4 border-black bg-white p-4 space-y-3 transition-transform hover:-translate-y-1 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      {/* Imagem pública protegida */}
      {fotoPublica ? (
        <img
          src={fotoPublica}
          alt={item.titulo}
          className="w-full h-48 object-cover border-4 border-black transition-opacity group-hover:opacity-90"
          onError={(e) => {
            if (fotoObj?.url && e.currentTarget.src !== fotoObj.url) {
              e.currentTarget.src = fotoObj.url;
            }
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 border-4 border-black flex items-center justify-center font-black uppercase text-xs text-gray-500">
          Sem imagem disponível
        </div>
      )}

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
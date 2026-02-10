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
   */
  const fotoObj = item.fotos?.find((f) => f.ehDestaque) || item.fotos?.[0]

  /**
   * URL protegida com marca d'água:
   * - Só tenta gerar se publicId e version existirem
   * - Se falhar, o fallback será a URL original ou placeholder
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
   * - Se não houver urlProtegida nem fotoObj.url, usamos um placeholder cinza
   * para evitar o ícone de imagem quebrada do navegador.
   */
  const fotoPublica = urlProtegida || fotoObj?.url || null

  return (
    <Link
      to={`/acervo/item/${item.id}`}
      className="group block border-4 border-black bg-white p-4 space-y-3 transition-transform hover:-translate-y-1 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      {/* Container da Imagem */}
      <div className="relative w-full h-48 bg-gray-100 border-4 border-black overflow-hidden flex items-center justify-center">
        {fotoPublica ? (
          <img
            src={fotoPublica}
            alt={item.titulo}
            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
            loading="lazy"
            onError={(e) => {
              /**
               * Se a URL protegida falhar, tenta a original. 
               * Se a original falhar, remove o src para mostrar o fallback visual do container.
               */
              const target = e.currentTarget;
              if (fotoObj?.url && target.src !== fotoObj.url) {
                target.src = fotoObj.url;
              } else {
                target.style.display = 'none'; // Esconde a imagem quebrada
              }
            }}
          />
        ) : (
          <div className="text-center p-4">
            <p className="font-black uppercase text-[10px] text-gray-400">
              Arquivo em Processamento
            </p>
          </div>
        )}
      </div>

      {/* Título */}
      <h3 className="font-black uppercase text-lg group-hover:text-yellow-600 transition-colors truncate">
        {item.titulo}
      </h3>

      {/* Status editorial */}
      <div className="flex items-center gap-2">
        <span className="inline-block border-2 border-black px-3 py-1 text-[10px] font-black uppercase bg-gray-50">
          {item.status === "MEMORIAL"
            ? "Item memorial"
            : "Acervo Ativo"}
        </span>
      </div>

      {/* Aviso jurídico */}
      <p className="text-[10px] font-bold text-gray-500 leading-tight">
        IMAGEM PROTEGIDA • ACERVO CARMEN LYDIA
      </p>
    </Link>
  )
}
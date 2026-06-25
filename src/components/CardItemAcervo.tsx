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
   * - A URL é sempre derivada no frontend
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
   * - Se não houver URL derivada, exibimos apenas o placeholder visual
   * - Não utilizamos URL persistida como fallback técnico
   */
  const fotoPublica = urlProtegida || null

  return (
    <Link
      to={`/acervo/item/${item.id}`}
      className="group block bg-white border border-acl-line p-4 space-y-3 overflow-hidden hover:border-acl-gold-deep transition-colors"
    >
      {/* Container da Imagem */}
      <div className="relative w-full h-48 bg-acl-line/30 overflow-hidden flex items-center justify-center">
        {fotoPublica ? (
          <img
            src={fotoPublica}
            alt={item.titulo}
            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
            loading="lazy"
            onError={(e) => {
              /**
               * Em caso de erro na imagem derivada:
               * - removemos o src para manter apenas o fallback visual
               * - não tentamos trocar a URL em runtime
               */
              e.currentTarget.style.display = "none"
            }}
          />
        ) : (
          <div className="text-center p-4">
            <p className="text-xs text-acl-muted">
              Arquivo em processamento
            </p>
          </div>
        )}
      </div>

      {/* Título */}
      <h3 className="font-serif text-base text-acl-ink group-hover:text-acl-gold-deep transition-colors truncate">
        {item.titulo}
      </h3>

      {/* Status editorial */}
      <div className="flex items-center gap-2">
        <span className="inline-block border border-acl-line px-2.5 py-1 text-[11px] text-acl-ink-soft bg-acl-cream">
          {item.status === "MEMORIAL"
            ? "Item memorial"
            : "Acervo ativo"}
        </span>
      </div>

      {/* Aviso jurídico */}
      <p className="text-[11px] text-acl-muted leading-tight">
        Imagem protegida • Acervo Carmen Lydia
      </p>
    </Link>
  )
}
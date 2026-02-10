// src/utils/cloudinary.ts

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/dcet9fpu0/image/upload"

/**
 * Public ID do watermark no Cloudinary
 * Ajustado para o caminho exato da pasta e sufixo
 */
const WATERMARK_PUBLIC_ID = "acervo:watermark_acervo_d81v5z"

export type CloudinaryContexto =
  | "card-atleta"
  | "detalhe-item"
  | "original"

interface CloudinaryImageParams {
  publicId: string
  version: number | string
  contexto: CloudinaryContexto
}

/**
 * Monta URLs públicas do Cloudinary a partir de:
 * - publicId persistido no backend
 * - version (obrigatória para cache safety)
 * - contexto de exibição
 *
 * IMPORTANTE:
 * - Nenhum publicId é hardcoded
 * - Backend não monta URL final
 */
export function cloudinaryImage({
  publicId,
  version,
  contexto,
}: CloudinaryImageParams): string {
  if (!publicId || !version) return ""

  const v = `v${version}`

  // Original (sem marca d'água) — uso restrito
  if (contexto === "original") {
    return `${CLOUDINARY_BASE}/${v}/${publicId}.jpg`
  }

  // Card de listagem (miniatura protegida)
  // f_auto adicionado para garantir o formato correto da imagem
  if (contexto === "card-atleta") {
    return `${CLOUDINARY_BASE}/c_fill,w_400,h_260/l_${WATERMARK_PUBLIC_ID},o_20,g_south_east,x_10,y_10/f_auto/${v}/${publicId}.jpg`
  }

  // Detalhe do item do acervo (visualização protegida)
  // l_${WATERMARK_PUBLIC_ID} utiliza o ID corrigido com a pasta
  return `${CLOUDINARY_BASE}/c_limit,w_1200/l_${WATERMARK_PUBLIC_ID},o_30,g_center/f_auto/${v}/${publicId}.jpg`
}
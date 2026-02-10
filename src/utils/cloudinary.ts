// src/utils/cloudinary.ts

const CLOUDINARY_BASE = "https://res.cloudinary.com/dcet9fpu0/image/upload";

/**
 * Public ID da marca d'água. 
 * Mantemos os dois pontos (:) para indicar a pasta 'acervo' no overlay.
 */
const WATERMARK_PUBLIC_ID = "acervo:watermark_acervo_d81v5z";

export type CloudinaryContexto = "card-atleta" | "detalhe-item" | "original";

interface CloudinaryImageParams {
  publicId: string;
  version: number | string;
  contexto: CloudinaryContexto;
}

/**
 * Monta URLs do Cloudinary tratando caminhos complexos (com barras) e overlays de proteção.
 */
export function cloudinaryImage({
  publicId,
  version,
  contexto,
}: CloudinaryImageParams): string {
  if (!publicId || !version) return "";

  /**
   * 1. Limpeza do ID: 
   * Remove extensões que podem vir do banco (ex: .jpg) para evitar URLs inválidas 
   * como "imagem.jpg.jpg", que causam erro 400.
   */
  const cleanId = publicId.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  /**
   * 2. Tratamento da Versão:
   * Garante que o prefixo 'v' exista para evitar problemas de cache.
   */
  const v = version.toString().startsWith("v") ? version : `v${version}`;

  // 3. Caso para imagem original (Uso administrativo ou download)
  if (contexto === "original") {
    return `${CLOUDINARY_BASE}/${v}/${cleanId}.jpg`;
  }

  // 4. Caso para Miniatura (Card da Atleta)
  // Adicionamos g_auto para garantir que o recorte foque no conteúdo principal.
  if (contexto === "card-atleta") {
    return `${CLOUDINARY_BASE}/c_fill,g_auto,w_400,h_260/l_${WATERMARK_PUBLIC_ID},o_20,g_south_east,w_100/${v}/${cleanId}.jpg`;
  }

  // 5. Caso para Detalhe do Item (Visualização com marca d'água centralizada)
  // c_limit impede que a imagem perca qualidade se for menor que 1200px.
  // o_30 define a transparência da marca d'água no centro.
  return `${CLOUDINARY_BASE}/c_limit,w_1200/l_${WATERMARK_PUBLIC_ID},o_30,g_center,w_600/${v}/${cleanId}.jpg`;
}
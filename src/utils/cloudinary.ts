// src/utils/cloudinary.ts

const CLOUDINARY_BASE = "https://res.cloudinary.com/dcet9fpu0/image/upload";

/**
 * Public ID da marca d'água. 
 * Usamos dois pontos (:) para indicar a pasta 'acervo' no overlay.
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
   * Remove extensões (ex: .jpg) para evitar "imagem.jpg.jpg".
   */
  const cleanId = publicId.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  /**
   * 2. Tratamento da Versão:
   * Garante o prefixo 'v'.
   */
  const v = version.toString().startsWith("v") ? version : `v${version}`;

  // 3. Caso para imagem original (Uso administrativo ou download)
  if (contexto === "original") {
    return `${CLOUDINARY_BASE}/${v}/${cleanId}.jpg`;
  }

  // 4. Caso para Miniatura (Card da Atleta)
  // AJUSTE: Movemos o formato .jpg para dentro da transformação e removemos o escapedId.
  if (contexto === "card-atleta") {
    return `${CLOUDINARY_BASE}/c_fill,g_auto,w_400,h_260,f_jpg/l_${WATERMARK_PUBLIC_ID},o_20,g_south_east,w_100/${v}/${cleanId}`;
  }

  // 6. Caso para Detalhe do Item (Visualização com marca d'água centralizada)
  // AJUSTE: f_jpg adicionado para estabilizar o processamento de camadas.
  return `${CLOUDINARY_BASE}/c_limit,w_1200,f_jpg/l_${WATERMARK_PUBLIC_ID},o_30,g_center,w_600/${v}/${cleanId}`;
}
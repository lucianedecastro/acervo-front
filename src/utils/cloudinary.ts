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
   * Remove extensões para evitar duplicação (ex: foto.jpg.jpg).
   */
  const cleanId = publicId.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  /**
   * 2. Tratamento da Versão:
   * Garante o prefixo 'v' obrigatório para assets em pastas.
   */
  const v = version.toString().startsWith("v") ? version : `v${version}`;

  // 3. Caso para imagem original
  if (contexto === "original") {
    return `${CLOUDINARY_BASE}/${v}/${cleanId}.jpg`;
  }

  // 4. Caso para Miniatura (Card da Atleta)
  // Sintaxe limpa: transformações / overlay / versão / caminho.extensao
  if (contexto === "card-atleta") {
    return `${CLOUDINARY_BASE}/c_fill,g_auto,w_400,h_260/l_${WATERMARK_PUBLIC_ID},o_20,g_south_east,w_100/${v}/${cleanId}.jpg`;
  }

  // 5. Caso para Detalhe do Item
  return `${CLOUDINARY_BASE}/c_limit,w_1200/l_${WATERMARK_PUBLIC_ID},o_30,g_center,w_600/${v}/${cleanId}.jpg`;
}
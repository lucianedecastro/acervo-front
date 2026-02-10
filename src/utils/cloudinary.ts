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
   * 2. O Pulo do Gato (Escapamento de Barras):
   * Para transformações com overlay (l_), o Cloudinary exige que as barras 
   * do publicId sejam trocadas por dois pontos (:).
   * Ex: "acervo/itens/foto" vira "acervo:itens:foto"
   */
  const escapedId = cleanId.replace(/\//g, ":");

  /**
   * 3. Tratamento da Versão:
   * Garante o prefixo 'v'.
   */
  const v = version.toString().startsWith("v") ? version : `v${version}`;

  // 4. Caso para imagem original (Uso administrativo ou download)
  // Aqui usamos o cleanId NORMAL (com barras), pois não há overlay.
  if (contexto === "original") {
    return `${CLOUDINARY_BASE}/${v}/${cleanId}.jpg`;
  }

  // 5. Caso para Miniatura (Card da Atleta)
  // Usamos o escapedId (com :) para evitar o Erro 400.
  if (contexto === "card-atleta") {
    return `${CLOUDINARY_BASE}/c_fill,g_auto,w_400,h_260/l_${WATERMARK_PUBLIC_ID},o_20,g_south_east,w_100/${v}/${escapedId}.jpg`;
  }

  // 6. Caso para Detalhe do Item (Visualização com marca d'água centralizada)
  // Usamos o escapedId (com :) para evitar o Erro 400.
  return `${CLOUDINARY_BASE}/c_limit,w_1200/l_${WATERMARK_PUBLIC_ID},o_30,g_center,w_600/${v}/${escapedId}.jpg`;
}
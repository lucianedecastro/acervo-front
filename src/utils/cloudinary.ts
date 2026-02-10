// src/utils/cloudinary.ts

const CLOUDINARY_BASE = "https://res.cloudinary.com/dcet9fpu0/image/upload";

// ID da marca d'água com a sintaxe de pasta do Cloudinary usando :
const WATERMARK_PUBLIC_ID = "acervo:watermark_acervo_d81v5z";

export type CloudinaryContexto = "card-atleta" | "detalhe-item" | "original";

// Definindo a interface para resolver o erro do VS Code
interface CloudinaryImageParams {
  publicId: string;
  version: number | string;
  contexto: CloudinaryContexto;
}

/**
 * Monta URLs do Cloudinary tratando caminhos complexos e overlays
 */
export function cloudinaryImage({
  publicId,
  version,
  contexto,
}: CloudinaryImageParams): string {
  if (!publicId || !version) return "";

  // 1. Limpeza do ID: remove extensão .jpg/.png se ela vier do banco
  // para evitar erros de sintaxe na transformação
  const cleanId = publicId.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  // 2. Garante que a versão tenha o prefixo 'v'
  const v = version.toString().startsWith("v") ? version : `v${version}`;

  // 3. Caso para imagem original (sem proteção)
  if (contexto === "original") {
    return `${CLOUDINARY_BASE}/${v}/${cleanId}.jpg`;
  }

  // 4. Caso para Miniatura (Card da Atleta)
  if (contexto === "card-atleta") {
    // c_fill: corta no tamanho exato | l_: adiciona overlay | o_20: opacidade 20%
    return `${CLOUDINARY_BASE}/c_fill,w_400,h_260/l_${WATERMARK_PUBLIC_ID},o_20,g_south_east,w_100/${v}/${cleanId}.jpg`;
  }

  // 5. Caso para Detalhe do Item (Visualização Protegida)
  // c_limit: respeita o tamanho original se for menor que 1200px
  return `${CLOUDINARY_BASE}/c_limit,w_1200/l_${WATERMARK_PUBLIC_ID},o_30,g_center,w_600/${v}/${cleanId}.jpg`;
}
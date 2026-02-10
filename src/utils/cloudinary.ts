// src/utils/cloudinary.ts

/**
 * Base oficial do Cloudinary para delivery de imagens.
 * Mantida centralizada para evitar hardcode espalhado no front.
 */
const CLOUDINARY_BASE = "https://res.cloudinary.com/dcet9fpu0/image/upload";

/**
 * Public ID da marca d'água.
 * ⚠️ ATUALMENTE NÃO UTILIZADO NO DELIVERY
 *
 * MOTIVO:
 * - A sintaxe de overlay do Cloudinary é sensível
 * - Durante a fase de apresentação, priorizamos estabilidade visual
 * - A estratégia de watermark será retomada após a demo
 *
 * TODO (pós-apresentação):
 * - Reavaliar aplicação de watermark via:
 *   a) overlay correto em camada separada
 *   b) eager transformations no upload
 *   c) signed URLs
 */
const WATERMARK_PUBLIC_ID = "acervo:watermark_acervo_d81v5z";

/**
 * Contextos de uso da imagem no frontend.
 * Cada contexto define transformações próprias.
 */
export type CloudinaryContexto = "card-atleta" | "detalhe-item" | "original";

interface CloudinaryImageParams {
  publicId: string;
  version: number | string;
  contexto: CloudinaryContexto;
}

/**
 * Helper centralizado para construção de URLs do Cloudinary.
 *
 * RESPONSABILIDADES:
 * - Garantir uso consistente de publicId e version
 * - Evitar duplicação de lógica no frontend
 * - Permitir evolução futura (watermark, proteção, signed URLs)
 *
 * OBS:
 * - Watermark temporariamente desativada por estabilidade
 * - Nenhuma decisão arquitetural foi descartada
 */
export function cloudinaryImage({
  publicId,
  version,
  contexto,
}: CloudinaryImageParams): string {
  if (!publicId || !version) return "";

  /**
   * 1. Limpeza do publicId
   * Remove extensão caso venha do backend com .jpg/.png
   * Evita duplicação: foto.jpg.jpg
   */
  const cleanId = publicId.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  /**
   * 2. Tratamento da versão
   * Cloudinary exige prefixo "v" para assets versionados
   */
  const v = version.toString().startsWith("v") ? version : `v${version}`;

  /**
   * 3. Imagem original (sem transformações)
   * Usada apenas para fallback técnico ou contextos internos
   */
  if (contexto === "original") {
    return `${CLOUDINARY_BASE}/${v}/${cleanId}.jpg`;
  }

  /**
   * 4. Miniatura — Card do Item / Atleta
   *
   * Transformações aplicadas:
   * - crop fill
   * - ajuste automático de foco
   * - dimensões fixas para layout
   *
   * ⚠️ Watermark desativada temporariamente
   */
  if (contexto === "card-atleta") {
    return `${CLOUDINARY_BASE}/c_fill,g_auto,w_400,h_260/${v}/${cleanId}.jpg`;
  }

  /**
   * 5. Detalhe do Item
   *
   * Transformações aplicadas:
   * - limite de largura para visualização confortável
   *
   * ⚠️ Watermark desativada temporariamente
   */
  return `${CLOUDINARY_BASE}/c_limit,w_1200/${v}/${cleanId}.jpg`;

  /**
   * ============================
   * WATERMARK (RETOMAR DEPOIS)
   * ============================
   *
   * Exemplos de tentativa (NÃO USAR AGORA):
   *
   * /l_${WATERMARK_PUBLIC_ID},o_30,g_center,w_600/fl_layer_apply
   *
   * Motivo da pausa:
   * - Erros 400 no Cloudinary
   * - Sintaxe rígida e fácil de quebrar
   * - Não crítica para apresentação
   */
}

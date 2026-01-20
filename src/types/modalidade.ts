/* =====================================================
   TIPOS: MODALIDADE (Sincronizado com Swagger)
   ===================================================== */

export interface FotoAcervo {
  publicId: string;
  urlVisualizacao: string;
  urlAltaResolucao: string;
  legenda: string;
  nomeArquivo: string;
  destaque: boolean;
}

export interface Modalidade {
  id: string;
  nome: string;
  slug: string;
  pictogramaUrl?: string;
  historia?: string;
  fotos: FotoAcervo[];
  fotoDestaquePublicId?: string;
  ativa: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

/** * DTO para rotas públicas e listagens 
 * Alinhado ao ModalidadePublicaDTO do Swagger
 */
export interface ModalidadePublicaDTO extends Omit<Modalidade, 'ativa' | 'criadoEm' | 'atualizadoEm'> {}

/** * DTO para cadastro e edição (POST/PUT)
 * Alinhado ao ModalidadeDTO do Swagger
 */
export interface ModalidadeDTO {
  nome: string;
  historia?: string;
  pictogramaUrl?: string;
  ativa: boolean;
  fotos: FotoAcervo[];
  fotoDestaquePublicId: string;
}
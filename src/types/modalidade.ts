/* =====================================================
   Tipo Modalidade (Sincronizado com Swagger ad3fa4)
   ===================================================== */

/**
 * Interface para fotos históricas associadas à modalidade
 * Alinhado ao Schema FotoAcervo (Imagem ad4002)
 */
export interface FotoAcervo {
  publicId: string;
  urlVisualizacao: string;
  urlAltaResolucao: string;
  legenda: string;
  nomeArquivo: string;
  destaque: boolean;
}

export interface Modalidade {
  /** ID único gerado pelo banco */
  id: string;

  /** Nome oficial do esporte */
  nome: string;

  /** URL amigável para SEO (gerada no backend) */
  slug: string;

  /** Breve histórico da modalidade no Brasil */
  historia?: string;

  /** Ícone/pictograma (URL do Cloudinary) */
  pictogramaUrl?: string;

  /** Lista de fotos da galeria histórica */
  fotos: FotoAcervo[];

  /** Referência da imagem principal no Cloudinary */
  fotoDestaquePublicId: string;

  /** Controle de visibilidade no portal público */
  ativa: boolean;

  /** Metadados de auditoria */
  criadoEm: string;
  atualizadoEm: string;
}

/**
 * DTO Unificado para Criação e Edição (Schema ModalidadeDTO ad3fa4)
 */
export interface ModalidadeDTO {
  nome: string;
  historia?: string;
  pictogramaUrl?: string;
  ativa: boolean;
  fotos: FotoAcervo[];
  fotoDestaquePublicId: string;
}
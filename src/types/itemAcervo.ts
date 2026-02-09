/* =====================================================
   Tipos relacionados ao ITEM DE ACERVO
   Alinhado com Swagger (/acervo)
   ===================================================== */

import { FotoAcervo } from "./modalidade";

/* ==========================
   Status do item
   ========================== */
export type StatusItem =
  | "RASCUNHO"
  | "PUBLICADO"
  | "ARQUIVADO"
  | "MEMORIAL";

/* ==========================
   Item de Acervo (ADMIN / ATLETA)
   ========================== */
export interface ItemAcervo {
  id: string;
  titulo: string;
  descricao: string;

  /**
   * ISO string
   */
  dataAquisicao?: string;
  status: StatusItem;

  /**
   * Relacionamentos
   */
  atletaId: string;
  modalidadeId: string;

  /**
   * Galeria (Sincronizado com FotoAcervo do Swagger)
   */
  fotos?: FotoAcervo[];
}

/* ==========================
   DTO de criação / edição (POST / PUT)
   ========================== */
export interface ItemAcervoCreateDTO {
  /* ==========================
     Conteúdo editorial
     ========================== */
  titulo: string;
  descricao: string;
  local?: string;
  dataOriginal?: string;
  procedencia?: string;

  /* ==========================
     Licenciamento e memorial
     ========================== */
  itemHistorico: boolean;
  disponivelParaLicenciamento: boolean;
  precoBaseLicenciamento?: number;

  /* ==========================
     Relacionamentos
     ========================== */
  modalidadeId: string;

  /**
   * Permite vincular um item a uma ou mais atletas
   * (curadoria histórica e itens coletivos)
   */
  atletasIds: string[];

  /* ==========================
     Curadoria
     ========================== */
  curadorResponsavel?: string;
}

/* ==========================
   DTO público / listagem
   ========================== */
export interface ItemAcervoResponseDTO {
  id: string;
  titulo: string;
  descricao: string;
  status: StatusItem;

  /**
   * Dados resolvidos pelo backend
   */
  atletaNome: string;
  modalidadeNome: string;

  /**
   * Thumb principal para vitrines
   */
  fotoPrincipalUrl?: string;
}

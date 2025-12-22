import { Foto } from "./atleta";

export type StatusItem = "RASCUNHO" | "PUBLICADO";

export interface ItemAcervo {
  id: string;
  titulo: string;
  descricao: string;
  dataAquisicao?: string;
  status: StatusItem;
  atletaId: string;
  modalidadeId: string;
  fotos: Foto[];
}

export interface ItemAcervoCreateDTO {
  titulo: string;
  descricao: string;
  atletaId: string;
  modalidadeId: string;
  dataAquisicao?: string;
}

export interface ItemAcervoResponseDTO {
  id: string;
  titulo: string;
  descricao: string;
  status: StatusItem;
  atletaNome: string;
  modalidadeNome: string;
  fotoPrincipalUrl?: string;
}
export interface Foto {
  id: string;
  url: string;
  isDestaque: boolean;
}

export interface Atleta {
  id?: string;
  nome: string;
  modalidade: string;
  biografia: string;
  competicao: string;
  fotos: Foto[];
}

export interface AtletaFormDTO {
  nome: string;
  modalidade: string;
  biografia: string;
  competicao: string;
  fotos: Foto[]; // Fotos existentes ou novas referências
  fotoDestaqueId: string;
  fotosRemovidas: string[]; // Lista de IDs para limpeza no backend
}
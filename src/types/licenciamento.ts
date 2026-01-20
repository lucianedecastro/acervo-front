/* =====================================================
   Tipos de Licenciamento e Transações
   Totalmente Alinhado ao Swagger (Imagens 5, 6, 9, 10)
   ===================================================== */

export interface SimulacaoLicenciamentoDTO {
  itemAcervoId: string;
  atletaId: string;
  tipoUso: string;
  prazoMeses: number;
}

export interface ResultadoSimulacaoDTO {
  itemTitulo: string;
  valorTotal: number;
  repasseAtleta: number;
  comissaoPlataforma: number;
  chavePixAtleta: string;
}

export interface EfetivarLicenciamentoDTO {
  itemAcervoId: string;
  atletaId: string;
  tipoUso: string;
  prazoMeses: number;
}

export interface TransacaoLicenciamento {
  id: string;
  itemAcervoId: string;
  atletaId: string;
  valorTotal: number; // Alinhado ao Swagger (Imagens 5, 9)
  valorRepasseAtleta: number; // Alinhado ao Swagger (Imagens 5, 9)
  dataTransacao: string; // Alinhado ao Swagger (Imagens 5, 9)
  status: string;
  tipoLicenca: string;
}

export interface ExtratoLicenciamentoDTO {
  nomeAtleta: string; // Presente no consolidado (Imagem 5)
  saldoTotal: number; // Presente no consolidado (Imagem 5)
  transacoes: TransacaoLicenciamento[];
}
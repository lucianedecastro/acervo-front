/* =====================================================
   Tipos para Gestão Fiscal (Exclusivo Admin)
   Alinhado ao Swagger (Imagens 13 e 14)
   ===================================================== */

export interface ConfiguracaoFiscal {
  id: string;
  percentualRepasseAtleta: number;      // Ex: 0.85 (Imagem 13)
  percentualComissaoPlataforma: number; // Ex: 0.15 (Imagem 13)
  observacaoLegal: string;
  atualizadoEm: string;                 // Data ISO (Imagem 13)
  atualizadoPor: string;
}

export interface ConfiguracaoFiscalDTO {
  percentualRepasseAtleta: number;
  percentualComissaoPlataforma: number;
  observacaoLegal: string;
}
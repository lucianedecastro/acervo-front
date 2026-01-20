/* =====================================================
   Tipos para Atleta (Sincronizado com Swagger ad3063)
   ===================================================== */

// Atualizado: Adicionado ESPOLIO conforme Imagem ad3063
export type CategoriaAtleta = "HISTORICA" | "ATIVA" | "REVELACAO" | "ESPOLIO"; 

export type StatusVerificacao = "PENDENTE" | "VERIFICADO" | "REJEITADO";

// Atualizado: Alinhado com as opções de status do DTO ad3063
export type StatusAtleta = "ATIVO" | "INATIVO" | "SUSPENSO";

// Atualizado: Adicionado NENHUM conforme Imagem ad3063
export type TipoChavePix = "CPF" | "EMAIL" | "TELEFONE" | "ALEATORIA" | "NENHUM";

export interface Atleta {
  id: string;
  nome: string;
  nomeSocial?: string;
  slug: string;
  cpf: string;
  email: string;
  senha?: string; // Adicionado: AtletaFormDTO prevê campo senha (ad3063)
  role: string;
  // Ajustado: Permitindo null ou undefined para evitar erro de leitura de length
  modalidadesIds?: string[] | null;
  biografia: string;
  categoria: CategoriaAtleta;
  
  // Gestão de Contrato e Verificação (ad3063)
  contratoAssinado: boolean;
  linkContratoDigital?: string;
  dataAssinaturaContrato?: string;
  statusVerificacao: StatusVerificacao;
  observacoesAdmin?: string;
  dataVerificacao?: string;

  // Representante Legal (ad3063)
  nomeRepresentante?: string;
  cpfRepresentante?: string;
  vinculoRepresentante?: string;
  
  // Financeiro e Repasse (ad3063)
  dadosContato?: string;
  tipoChavePix: TipoChavePix;
  chavePix: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
  percentualRepasse: number;
  comissaoPlataformaDiferenciada: number;

  // Mídia e Status (ad3063)
  fotoDestaqueUrl?: string;
  fotoDestaqueId?: string; // Adicionado para gerenciar o upload/vínculo de mídia
  statusAtleta: StatusAtleta;
  criadoEm: string;
  atualizadoEm: string;
}

/**
 * DTO para Criação/Edição (Request Body do PUT/POST)
 * Omitimos campos gerados pelo servidor para evitar erros de envio
 */
export interface AtletaUpdateDTO extends Partial<Omit<Atleta, 'id' | 'criadoEm' | 'atualizadoEm' | 'slug' | 'role'>> {
  // Garantimos que a senha possa ser enviada opcionalmente na atualização
  senha?: string;
}

export interface DashboardAtletaDTO {
  totalMeusItens: number;
  itensPublicados: number;
  itensEmRascunho: number;
  itensNoMemorial: number;
  totalLicenciamentosVendidos: number;
  saldoTotalAtleta: number;
}
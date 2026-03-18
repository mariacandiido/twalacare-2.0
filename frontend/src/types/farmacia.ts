// types/farmacia.ts
export type CategoriaMedicamento = 
  | 'analgesico'
  | 'antibiotico'
  | 'antiinflamatorio'
  | 'antialergico'
  | 'antidepressivo'
  | 'ansiolitico'
  | 'cardiovascular'
  | 'dermatologico'
  | 'gastrointestinal'
  | 'respiratorio'
  | 'vitaminas'
  | 'outros';

export type StatusMedicamento = 'disponivel' | 'indisponivel' | 'pre_venda';

export interface Medicamento {
  id: string;
  codigoBarras: string;
  nome: string;
  nomeGenerico?: string;
  principioAtivo: string;
  categoria: CategoriaMedicamento;
  apresentacao: string; // ex: "Caixa com 30 comprimidos"
  dosagem: string; // ex: "500mg"
  laboratorio: string;
  generico: boolean;
  controlado: boolean;
  precisaReceita: boolean;
  tipoReceita?: 'branca' | 'azul' | 'amarela' | 'b2';
  preco: number;
  precoCusto?: number;
  margemLucro?: number;
  estoque: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  validade: string;
  lote: string;
  registroAnvisa: string;
  localizacao?: string; // prateleira, gaveta
  imagens: string[];
  descricao: string;
  bula?: string;
  status: StatusMedicamento;
  dataCadastro: string;
  dataAtualizacao: string;
  ultimaCompra?: string;
  vendasMes?: number;
}

export interface Farmacia {
  id: string;
  nome: string;
  cnpj: string;
  razaoSocial: string;
  responsavel: string;
  email: string;
  telefone: string;
  celular: string;
  logo?: string;
  endereco: EnderecoFarmacia;
  horarioFuncionamento: HorarioFuncionamento[];
  entrega: ConfiguracaoEntrega;
  medicamentos: Medicamento[];
  estatisticas: EstatisticasFarmacia;
}

export interface EnderecoFarmacia {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  latitude?: number;
  longitude?: number;
}

export interface HorarioFuncionamento {
  dia: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  aberto: boolean;
  abertura?: string;
  fechamento?: string;
  intervalo?: {
    inicio: string;
    fim: string;
  };
}

export interface ConfiguracaoEntrega {
  fazEntrega: boolean;
  taxaEntrega: number;
  entregaGratisApartir?: number;
  tempoMedioEntrega: number; // minutos
  areaEntrega: AreaEntrega[];
}

export interface AreaEntrega {
  bairro: string;
  cidade: string;
  estado: string;
  taxaAdicional?: number;
}

export interface EstatisticasFarmacia {
  totalVendas: number;
  totalClientes: number;
  ticketMedio: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  medicamentosBaixoEstoque: number;
  medicamentosVencidos: number;
}

export interface FiltrosMedicamento {
  busca?: string;
  categoria?: CategoriaMedicamento;
  controlado?: boolean;
  generico?: boolean;
  status?: StatusMedicamento;
  estoqueBaixo?: boolean;
  validadeProxima?: boolean;
  ordenarPor?: 'nome' | 'preco' | 'estoque' | 'validade' | 'vendas';
  ordem?: 'asc' | 'desc';
}
// Tipos específicos do painel do Entregador

export type StatusEntregaType =
  | 'indo-farmacia'
  | 'pegando-pedido'
  | 'a-caminho-cliente'
  | 'entregue';

export type TipoVeiculo = 'moto' | 'bicicleta' | 'carro' | 'a-pe';

export interface EntregaDisponivel {
  id: string;
  farmacia: string;
  farmaciaEndereco: string;
  cliente: string;
  clienteEndereco: string;
  clienteTelefone: string;
  distancia: string;
  valor: number;
  itens: string[];
  criadoEm: string;
  tempoEstimado: string;
}

export interface EntregaAtiva {
  id: string;
  farmacia: string;
  farmaciaEndereco: string;
  cliente: string;
  clienteEndereco: string;
  clienteTelefone: string;
  status: StatusEntregaType;
  valor: number;
  aceitoEm: string;
  distancia: string;
  tempoEstimado: string;
}

export interface EntregaConcluida {
  id: string;
  farmacia: string;
  farmaciaEndereco: string;
  cliente: string;
  clienteEndereco: string;
  data: string;
  valor: number;
  status: 'entregue';
  duracao: string;
  avaliacao: number;
}

export interface PerfilEntregador {
  nome: string;
  email: string;
  telefone: string;
  veiculo: TipoVeiculo;
  placaVeiculo: string;
  provincia: string;
  municipio: string;
  disponivel: boolean;
  avaliacao: number;
  ganhosMes: number;
  totalEntregas: number;
}

// Tipos específicos do módulo Farmácia

export type StatusPedidoFarmacia =
  | "pendente"
  | "em-preparacao"
  | "pronto-entrega"
  | "recusado";

export type StatusEntregaFarmacia =
  | "aguardando-entregador"
  | "em-transporte"
  | "entregue";

export type StatusReceita = "pendente" | "aprovada" | "rejeitada";

export interface ProdutoFarmacia {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  imagem: string;
  precisaReceita: boolean;
  estoque: number;
  categoria: string;
}

export interface ItemPedidoFarmacia {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface PedidoFarmacia {
  id: string;
  nomeCliente: string;
  telefoneCliente: string;
  enderecoEntrega: string;
  itens: ItemPedidoFarmacia[];
  total: number;
  status: StatusPedidoFarmacia;
  dataPedido: string;
  metodoPagamento: string;
}

export interface ReceitaFarmacia {
  id: string;
  nomeCliente: string;
  nomeMedicamento: string;
  imagemReceita: string;
  status: StatusReceita;
  dataEnvio: string;
  pedidoId?: string;
}

export interface EntregadorDisponivel {
  id: string;
  nome: string;
  telefone: string;
  veiculo: string;
  avaliacao: number;
  disponivel: boolean;
}

export interface EntregaFarmacia {
  id: string;
  pedidoId: string;
  nomeCliente: string;
  enderecoEntrega: string;
  total: number;
  status: StatusEntregaFarmacia;
  entregadorId?: string;
  nomeEntregador?: string;
  dataAtribuicao?: string;
}

export interface PerfilFarmacia {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  nif: string;
  horarioAbertura: string;
  horarioFechamento: string;
  provincia: string;
  municipio: string;
}

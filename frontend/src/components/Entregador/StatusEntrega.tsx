import type { StatusEntregaType } from '../../types/entregador.types';

interface StatusEntregaProps {
  status: StatusEntregaType | 'entregue' | string;
  tamanho?: 'sm' | 'md';
}

const statusConfig: Record<
  string,
  { label: string; classe: string; ponto: string }
> = {
  'indo-farmacia': {
    label: 'Indo para farmácia',
    classe: 'bg-blue-100 text-blue-700',
    ponto: 'bg-blue-500',
  },
  'pegando-pedido': {
    label: 'Pegando pedido',
    classe: 'bg-orange-100 text-orange-700',
    ponto: 'bg-orange-500',
  },
  'a-caminho-cliente': {
    label: 'A caminho do cliente',
    classe: 'bg-purple-100 text-purple-700',
    ponto: 'bg-purple-500',
  },
  'em_transito': {
    label: 'Em trânsito',
    classe: 'bg-indigo-100 text-indigo-700',
    ponto: 'bg-indigo-500',
  },
  'aceito': {
    label: 'Aceite',
    classe: 'bg-blue-100 text-blue-700',
    ponto: 'bg-blue-500',
  },
  'pendente': {
    label: 'Pendente',
    classe: 'bg-gray-100 text-gray-700',
    ponto: 'bg-gray-500',
  },
  'disponivel': {
    label: 'Disponível',
    classe: 'bg-blue-50 text-blue-600',
    ponto: 'bg-blue-400',
  },
  'entregue': {
    label: 'Entregue',
    classe: 'bg-green-100 text-green-700',
    ponto: 'bg-green-500',
  },
};

export function StatusEntrega({ status, tamanho = 'md' }: StatusEntregaProps) {
  const s = status?.toLowerCase() || 'pendente';
  const config = statusConfig[s] ?? statusConfig['pendente'];
  const padding = tamanho === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.classe} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.ponto}`} />
      {config.label}
    </span>
  );
}

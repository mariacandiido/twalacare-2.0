import type { StatusEntregaType } from '../../types/entregador.types';

interface StatusEntregaProps {
  status: StatusEntregaType | 'entregue';
  tamanho?: 'sm' | 'md';
}

const statusConfig: Record<
  StatusEntregaType | 'entregue',
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
  entregue: {
    label: 'Entregue',
    classe: 'bg-green-100 text-green-700',
    ponto: 'bg-green-500',
  },
};

export function StatusEntrega({ status, tamanho = 'md' }: StatusEntregaProps) {
  const config = statusConfig[status] ?? statusConfig['indo-farmacia'];
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

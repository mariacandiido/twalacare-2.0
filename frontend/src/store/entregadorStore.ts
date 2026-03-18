import { create } from 'zustand';
import type {
  EntregaDisponivel,
  EntregaAtiva,
  EntregaConcluida,
  PerfilEntregador,
  StatusEntregaType,
} from '../types/entregador.types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockEntregasDisponiveis: EntregaDisponivel[] = [
  {
    id: 'ed-001',
    farmacia: 'Farmácia Saúde Viva',
    farmaciaEndereco: 'Rua Direita, 45 – Maianga, Luanda',
    cliente: 'Ana Beatriz Santos',
    clienteEndereco: 'Av. Lenine, Bloco 5 Ap. 12 – Ingombota',
    clienteTelefone: '+244 923 456 789',
    distancia: '2.3 km',
    valor: 1500,
    itens: ['Paracetamol 500mg × 2', 'Vitamina C × 1'],
    criadoEm: '14:32',
    tempoEstimado: '15 min',
  },
  {
    id: 'ed-002',
    farmacia: 'Farmácia Nova Vida',
    farmaciaEndereco: 'Av. 4 de Fevereiro, 120 – Ilha de Luanda',
    cliente: 'Carlos Mendes Ferreira',
    clienteEndereco: 'Rua da Missão, 78 – Sambizanga',
    clienteTelefone: '+244 912 345 678',
    distancia: '4.7 km',
    valor: 2000,
    itens: ['Amoxicilina 875mg × 1', 'Ibuprofeno 400mg × 2'],
    criadoEm: '14:20',
    tempoEstimado: '25 min',
  },
  {
    id: 'ed-003',
    farmacia: 'Farmácia Central',
    farmaciaEndereco: 'Rua Amilcar Cabral, 33 – Alvalade',
    cliente: 'Maria Fernanda Lopes',
    clienteEndereco: 'Rua Joaquim Kapango, 15 – Bairro Azul',
    clienteTelefone: '+244 935 123 456',
    distancia: '1.8 km',
    valor: 1200,
    itens: ['Omeprazol 20mg × 1'],
    criadoEm: '14:15',
    tempoEstimado: '10 min',
  },
  {
    id: 'ed-004',
    farmacia: 'Farmácia Bem Estar',
    farmaciaEndereco: 'Av. Hoji Ya Henda, 200 – Rangel',
    cliente: 'António Joaquim Teixeira',
    clienteEndereco: 'Rua das Acácias, 9 – Golfe',
    clienteTelefone: '+244 944 678 901',
    distancia: '5.2 km',
    valor: 2500,
    itens: ['Metformina 850mg × 2', 'Aspirina 100mg × 1', 'Losartana 50mg × 1'],
    criadoEm: '14:05',
    tempoEstimado: '30 min',
  },
];

const mockEntregasAtivas: EntregaAtiva[] = [
  {
    id: 'ea-001',
    farmacia: 'Farmácia Saúde Total',
    farmaciaEndereco: 'Rua da Liberdade, 67 – Rangel',
    cliente: 'Pedro Augusto Silva',
    clienteEndereco: 'Av. Brasil, Bloco 12 – Patriota',
    clienteTelefone: '+244 942 789 123',
    status: 'a-caminho-cliente',
    valor: 1800,
    aceitoEm: '13:45',
    distancia: '3.1 km',
    tempoEstimado: '8 min',
  },
];

const mockHistorico: EntregaConcluida[] = [
  {
    id: 'ec-001',
    farmacia: 'Farmácia Saúde Total',
    farmaciaEndereco: 'Rua da Liberdade, 67 – Rangel',
    cliente: 'João Paulo Rodrigues',
    clienteEndereco: 'Rua da Praia, 34 – Miramar',
    data: '08/03/2026 – 12:30',
    valor: 1500,
    status: 'entregue',
    duracao: '22 min',
    avaliacao: 5,
  },
  {
    id: 'ec-002',
    farmacia: 'Farmácia Nova Esperança',
    farmaciaEndereco: 'Rua Amilcar Cabral, 99 – Alvalade',
    cliente: 'Luísa Maria Gonçalves',
    clienteEndereco: 'Av. Deolinda Rodrigues, 18 – Palanca',
    data: '08/03/2026 – 11:10',
    valor: 2200,
    status: 'entregue',
    duracao: '31 min',
    avaliacao: 5,
  },
  {
    id: 'ec-003',
    farmacia: 'Farmácia Saúde Viva',
    farmaciaEndereco: 'Rua Direita, 45 – Maianga, Luanda',
    cliente: 'Roberto Carlos Neto',
    clienteEndereco: 'Rua dos Coqueiros, 7 – Rocha Pinto',
    data: '07/03/2026 – 17:45',
    valor: 1800,
    status: 'entregue',
    duracao: '19 min',
    avaliacao: 4,
  },
  {
    id: 'ec-004',
    farmacia: 'Farmácia Central',
    farmaciaEndereco: 'Rua Amilcar Cabral, 33 – Alvalade',
    cliente: 'Fernanda Baptista Costa',
    clienteEndereco: 'Bairro Golfe, Rua 5 – Talatona',
    data: '07/03/2026 – 14:20',
    valor: 1200,
    status: 'entregue',
    duracao: '25 min',
    avaliacao: 5,
  },
  {
    id: 'ec-005',
    farmacia: 'Farmácia Bem Estar',
    farmaciaEndereco: 'Av. Hoji Ya Henda, 200 – Rangel',
    cliente: 'Simão Pedro Afonso',
    clienteEndereco: 'Rua Kwame Nkrumah, 45 – Maculusso',
    data: '06/03/2026 – 09:15',
    valor: 3000,
    status: 'entregue',
    duracao: '28 min',
    avaliacao: 4,
  },
];

const mockPerfil: PerfilEntregador = {
  nome: 'Carlos Entregador',
  email: 'entregador@gmail.com',
  telefone: '+244 900 000 003',
  veiculo: 'moto',
  placaVeiculo: 'LD-12345-AX',
  provincia: 'Luanda',
  municipio: 'Viana',
  disponivel: true,
  avaliacao: 4.8,
  ganhosMes: 45000,
  totalEntregas: 127,
};

// ─── Store ────────────────────────────────────────────────────────────────────

interface EntregadorState {
  disponivel: boolean;
  entregasDisponiveis: EntregaDisponivel[];
  entregasAtivas: EntregaAtiva[];
  historico: EntregaConcluida[];
  perfil: PerfilEntregador;

  // Ações
  toggleDisponivel: () => void;
  aceitarEntrega: (id: string) => void;
  rejeitarEntrega: (id: string) => void;
  atualizarStatus: (id: string, novoStatus: StatusEntregaType) => void;
  atualizarPerfil: (dados: Partial<PerfilEntregador>) => void;
}

export const useEntregadorStore = create<EntregadorState>((set, get) => ({
  disponivel: true,
  entregasDisponiveis: mockEntregasDisponiveis,
  entregasAtivas: mockEntregasAtivas,
  historico: mockHistorico,
  perfil: mockPerfil,

  toggleDisponivel: () =>
    set((state) => ({ disponivel: !state.disponivel })),

  aceitarEntrega: (id: string) => {
    const { entregasDisponiveis } = get();
    const entrega = entregasDisponiveis.find((e) => e.id === id);
    if (!entrega) return;

    const agora = new Date();
    const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

    const novaAtiva: EntregaAtiva = {
      id: entrega.id,
      farmacia: entrega.farmacia,
      farmaciaEndereco: entrega.farmaciaEndereco,
      cliente: entrega.cliente,
      clienteEndereco: entrega.clienteEndereco,
      clienteTelefone: entrega.clienteTelefone,
      status: 'indo-farmacia',
      valor: entrega.valor,
      aceitoEm: hora,
      distancia: entrega.distancia,
      tempoEstimado: entrega.tempoEstimado,
    };

    set((state) => ({
      entregasDisponiveis: state.entregasDisponiveis.filter((e) => e.id !== id),
      entregasAtivas: [...state.entregasAtivas, novaAtiva],
    }));
  },

  rejeitarEntrega: (id: string) => {
    set((state) => ({
      entregasDisponiveis: state.entregasDisponiveis.filter((e) => e.id !== id),
    }));
  },

  atualizarStatus: (id: string, novoStatus: StatusEntregaType) => {
    if (novoStatus === 'entregue') {
      const { entregasAtivas } = get();
      const entrega = entregasAtivas.find((e) => e.id === id);
      if (!entrega) return;

      const agora = new Date();
      const dataFormatada = agora.toLocaleDateString('pt-AO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

      const concluida: EntregaConcluida = {
        id: entrega.id,
        farmacia: entrega.farmacia,
        farmaciaEndereco: entrega.farmaciaEndereco,
        cliente: entrega.cliente,
        clienteEndereco: entrega.clienteEndereco,
        data: `${dataFormatada} – ${hora}`,
        valor: entrega.valor,
        status: 'entregue',
        duracao: '–',
        avaliacao: 5,
      };

      set((state) => ({
        entregasAtivas: state.entregasAtivas.filter((e) => e.id !== id),
        historico: [concluida, ...state.historico],
      }));
    } else {
      set((state) => ({
        entregasAtivas: state.entregasAtivas.map((e) =>
          e.id === id ? { ...e, status: novoStatus } : e
        ),
      }));
    }
  },

  atualizarPerfil: (dados: Partial<PerfilEntregador>) => {
    set((state) => ({
      perfil: { ...state.perfil, ...dados },
    }));
  },
}));

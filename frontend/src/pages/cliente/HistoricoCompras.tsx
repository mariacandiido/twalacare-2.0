// Página de Histórico de Compras do Cliente
// Mostra todas as compras realizadas pelo cliente autenticado,
// com filtros por texto e estado de entrega.

import { useState, useMemo } from "react";
import {
  ShoppingBag,   // ícone de saco de compras
  Building2,     // ícone de farmácia
  Calendar,      // ícone de data
  Search,        // ícone de pesquisa
  Package,       // ícone de produto/embalagem
  CheckCircle2,  // ícone de entregue
  Clock,         // ícone de pendente
  Truck,         // ícone de em trânsito
  XCircle,       // ícone de cancelado
  TrendingUp,    // ícone de total gasto
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useAdminStore } from "../../store/adminStore";

// -------------------------------------------------------
// TIPOS LOCAIS
// -------------------------------------------------------

// Define os estados possíveis de uma entrega
type StatusEntrega =
  | "entregue"
  | "em-transito"
  | "em-preparacao"
  | "pendente"
  | "cancelado";

// Representa um produto dentro de uma compra
interface ItemCompra {
  nome: string;        // nome do medicamento
  quantidade: number;  // quantidade comprada
  preco: number;       // preço unitário em Kz
}

// Representa uma compra completa feita pelo cliente
interface Compra {
  id: string;                    // identificador único da compra
  farmacia: string;              // nome da farmácia onde foi feita a compra
  itens: ItemCompra[];           // lista de medicamentos comprados
  dataCompra: string;            // data no formato "AAAA-MM-DD"
  total: number;                 // valor total da compra em Kz
  statusEntrega: StatusEntrega;  // estado atual da entrega
}

// Mapeia status do pedido (admin store) para status de entrega da UI
function toStatusEntrega(status: string): StatusEntrega {
  if (status === "entregue") return "entregue";
  if (status === "em-transito") return "em-transito";
  if (status === "em-preparacao" || status === "pronto") return "em-preparacao";
  if (status === "cancelado") return "cancelado";
  return "pendente";
}

// Converte itens em string (ex: "Paracetamol × 2, Vitamina C × 1") em ItemCompra[]
function parseItens(itensStr: string, total: number): ItemCompra[] {
  if (!itensStr.trim()) return [{ nome: "—", quantidade: 1, preco: total }];
  return itensStr.split(",").map((parte) => {
    const match = parte.trim().match(/^(.+?)\s*×\s*(\d+)$/);
    const nome = match ? match[1].trim() : parte.trim();
    const quantidade = match ? parseInt(match[2], 10) : 1;
    return { nome, quantidade, preco: 0 };
  });
}

// -------------------------------------------------------
// CONFIGURAÇÃO DE BADGES DE ESTADO
// Cada estado tem: texto, ícone e classes de cor
// -------------------------------------------------------
const STATUS_CONFIG: Record<
  StatusEntrega,
  { label: string; icon: React.FC<{ className?: string }>; classes: string }
> = {
  entregue: {
    label: "Entregue",
    icon: CheckCircle2,
    classes: "bg-green-100 text-green-700",
  },
  "em-transito": {
    label: "Em Trânsito",
    icon: Truck,
    classes: "bg-blue-100 text-blue-700",
  },
  "em-preparacao": {
    label: "Em Preparação",
    icon: Package,
    classes: "bg-amber-100 text-amber-700",
  },
  pendente: {
    label: "Pendente",
    icon: Clock,
    classes: "bg-gray-100 text-gray-600",
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    classes: "bg-red-100 text-red-600",
  },
};

// -------------------------------------------------------
// COMPONENTE BadgeStatus
// Exibe a etiqueta colorida com ícone para o estado da entrega
// -------------------------------------------------------
function BadgeStatus({ status }: { status: StatusEntrega }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${cfg.classes}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL — HistoricoCompras
// -------------------------------------------------------
export function HistoricoCompras() {
  const { user } = useAuth();
  const pedidos = useAdminStore((s) => s.pedidos);

  // Compras do cliente a partir do store partilhado com admin/farmácia
  const compras: Compra[] = useMemo(() => {
    const clienteId = user?.id ?? "";
    return pedidos
      .filter((p) => p.clienteId === clienteId)
      .map((p) => ({
        id: p.id,
        farmacia: p.farmacia,
        itens: parseItens(p.itens, p.total),
        dataCompra: p.dataPedido,
        total: p.total,
        statusEntrega: toStatusEntrega(p.status),
      }));
  }, [pedidos, user?.id]);

  // Estado do campo de pesquisa livre (por farmácia, medicamento ou data)
  const [busca, setBusca] = useState("");

  // Estado do filtro de estado de entrega (padrão: mostrar todos)
  const [filtroStatus, setFiltroStatus] = useState<StatusEntrega | "todos">("todos");

  // Filtra as compras com base no texto de pesquisa e no estado selecionado
  const comprasFiltradas = compras.filter((c) => {
    const termoBusca = busca.toLowerCase();

    // Verifica se algum campo da compra contém o termo pesquisado
    const matchBusca =
      c.farmacia.toLowerCase().includes(termoBusca) ||
      c.itens.some((i) => i.nome.toLowerCase().includes(termoBusca)) ||
      c.dataCompra.includes(termoBusca);

    // Verifica se o estado corresponde ao filtro selecionado
    const matchStatus =
      filtroStatus === "todos" || c.statusEntrega === filtroStatus;

    return matchBusca && matchStatus;
  });

  // Calcula o total gasto em todas as compras (independente do filtro)
  const totalGasto = compras.reduce((acc, c) => acc + c.total, 0);

  // Conta quantas compras já foram entregues
  const totalEntregues = compras.filter(
    (c) => c.statusEntrega === "entregue"
  ).length;

  // Formata a data para o formato angolano: "10 de fevereiro de 2025"
  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="twala-page-enter min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#faf7f2" }}>
      <div className="max-w-5xl mx-auto space-y-6">

        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#2c3e2c", marginBottom: 4 }}>
            Histórico de Compras
          </h1>
          <div style={{ width: 60, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 14 }}>
            Todas as suas compras realizadas no TwalaCare
          </p>
        </div>

        {/* Cards estatísticos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShoppingBag, value: compras.length, label: "Total de Compras", bg: "rgba(44,85,48,0.08)", color: "#2c5530" },
            { icon: CheckCircle2, value: totalEntregues, label: "Entregues", bg: "rgba(74,120,86,0.1)", color: "#4a7856" },
            { icon: TrendingUp, value: `${totalGasto.toLocaleString()} Kz`, label: "Total Gasto", bg: "rgba(199,162,82,0.12)", color: "#a07a2a" },
          ].map((stat, i) => (
            <div key={i} className="twala-card p-5 flex items-center gap-4">
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <stat.icon style={{ width: 24, height: 24, color: stat.color }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: "#2c3e2c", margin: 0 }}>{stat.value}</p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888", margin: 0 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
            <input
              type="text"
              placeholder="Pesquisar por medicamento, farmácia ou data..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="twala-input w-full"
              style={{ paddingLeft: 44 }}
            />
          </div>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as StatusEntrega | "todos")}
            className="twala-input"
            style={{ minWidth: 180 }}
          >
            <option value="todos">Todos os estados</option>
            <option value="pendente">Pendente</option>
            <option value="em-preparacao">Em Preparação</option>
            <option value="em-transito">Em Trânsito</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {comprasFiltradas.length === 0 ? (
          <div className="twala-card flex flex-col items-center justify-center py-16 text-center">
            <div style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: "rgba(44,85,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <ShoppingBag style={{ width: 36, height: 36, color: "#4a7856" }} />
            </div>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: "#4a7856", margin: 0 }}>Nenhuma compra encontrada</p>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#888", marginTop: 6 }}>
              {busca || filtroStatus !== "todos" ? "Tente ajustar os filtros de pesquisa." : "As suas compras aparecerão aqui."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comprasFiltradas.map((compra) => (
              <div key={compra.id} className="twala-card overflow-hidden">
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(44,85,48,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Building2 style={{ width: 20, height: 20, color: "#2c5530" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, color: "#2c3e2c", margin: 0 }}>
                        {compra.farmacia}
                      </p>
                      <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
                        <Calendar style={{ width: 12, height: 12, color: "#888" }} />
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888" }}>{formatarData(compra.dataCompra)}</span>
                        <span style={{ color: "#ccc" }}>·</span>
                        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#888" }}>#{compra.id}</span>
                      </div>
                    </div>
                  </div>
                  <BadgeStatus status={compra.statusEntrega} />
                </div>

                <div style={{ padding: "12px 20px" }} className="space-y-2">
                  {compra.itens.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package style={{ width: 14, height: 14, color: "#4a7856", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#2c3e2c" }}>{item.nome}</span>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888" }}>× {item.quantidade}</span>
                      </div>
                      <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, fontSize: 14, color: "#2c3e2c" }}>
                        {(item.preco * item.quantidade).toLocaleString()} Kz
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="flex justify-between items-center"
                  style={{ padding: "10px 20px", backgroundColor: "rgba(44,85,48,0.04)", borderTop: "1px solid #f0f0f0" }}
                >
                  <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888" }}>
                    {compra.itens.length} produto(s)
                  </span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 14, color: "#2c5530" }}>
                    Total: {compra.total.toLocaleString()} Kz
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

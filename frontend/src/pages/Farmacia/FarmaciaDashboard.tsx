import { Package, ShoppingBag, Clock, Truck, TrendingUp, Star } from "lucide-react";
import { FarmaciaLayout } from "../../layouts/FarmaciaLayout";

const GREEN = "#2c5530";
const GOLD  = "#c7a252";

const statsCards = [
  {
    label: "Produtos Cadastrados",
    value: "48",
    descricao: "produtos ativos no catálogo",
    icon: Package,
    bg: "rgba(44,85,48,0.06)",
    iconColor: "#2c5530",
    trend: "+3 este mês",
    trendColor: "#2c5530",
    borderColor: "#2c5530",
  },
  {
    label: "Pedidos Recebidos",
    value: "127",
    descricao: "pedidos no total",
    icon: ShoppingBag,
    bg: "rgba(199,162,82,0.08)",
    iconColor: "#8a6e25",
    trend: "+12 esta semana",
    trendColor: "#8a6e25",
    borderColor: GOLD,
  },
  {
    label: "Pedidos Pendentes",
    value: "8",
    descricao: "aguardando confirmação",
    icon: Clock,
    bg: "rgba(212,160,50,0.08)",
    iconColor: "#b07a1a",
    trend: "2 urgentes",
    trendColor: "#b07a1a",
    borderColor: "#e0a040",
  },
  {
    label: "Entregas em Andamento",
    value: "5",
    descricao: "a caminho dos clientes",
    icon: Truck,
    bg: "rgba(74,120,86,0.08)",
    iconColor: "#3a6b50",
    trend: "estimativa: 30 min",
    trendColor: "#3a6b50",
    borderColor: "#4a7856",
  },
];

const recentOrders = [
  { id: "#TC-0045", cliente: "Ana Beatriz",    medicamento: "Paracetamol 500mg × 2", total: 1200, status: "pendente",       hora: "14:23" },
  { id: "#TC-0044", cliente: "Carlos Mendes",  medicamento: "Amoxicilina 875mg × 1",  total: 3500, status: "em-preparacao", hora: "13:55" },
  { id: "#TC-0043", cliente: "Maria Fernanda", medicamento: "Ibuprofeno 400mg × 3",   total: 2100, status: "pronto-entrega", hora: "13:10" },
  { id: "#TC-0042", cliente: "João Pedro",     medicamento: "Omeprazol 20mg × 2",     total: 1800, status: "em-preparacao", hora: "12:48" },
];

const statusConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
  pendente:         { label: "Pendente",      bg: "rgba(212,160,50,0.1)",  color: "#8a6e25",  border: "rgba(212,160,50,0.3)"  },
  "em-preparacao":  { label: "Em preparação", bg: "rgba(44,85,48,0.08)",   color: "#2c5530",  border: "rgba(44,85,48,0.2)"    },
  "pronto-entrega": { label: "Pronto",        bg: "rgba(74,120,86,0.1)",   color: "#3a7050",  border: "rgba(74,120,86,0.25)"  },
  recusado:         { label: "Recusado",      bg: "rgba(212,90,90,0.08)",  color: "#a03030",  border: "rgba(212,90,90,0.25)"  },
};

export function FarmaciaDashboard() {
  return (
    <FarmaciaLayout>
      <div
        className="p-6 lg:p-8 space-y-8 twala-page-enter"
        style={{ backgroundColor: "#faf7f2", minHeight: "100%" }}
      >
        {/* ── CABEÇALHO ── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2">
              <span className="twala-seal" style={{ fontSize: 11 }}>Painel de Controlo</span>
            </div>
            <h1
              className="mt-3"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: "clamp(22px,3vw,28px)" }}
            >
              Painel da Farmácia
            </h1>
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 14, marginTop: 4 }}>
              Visão geral das operações de hoje
            </p>
          </div>
          <div
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ backgroundColor: "rgba(44,85,48,0.06)", border: "1px solid rgba(44,85,48,0.12)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#4ade80", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: GREEN, fontWeight: 500 }}>
              Farmácia Online
            </span>
          </div>
        </div>

        {/* ── CARDS DE ESTATÍSTICAS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-300"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(44,85,48,0.08)",
                  borderLeft: `4px solid ${card.borderColor}`,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(44,85,48,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.04)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: card.bg }}
                  >
                    <Icon style={{ width: 20, height: 20, color: card.iconColor }} />
                  </div>
                  <TrendingUp style={{ width: 16, height: 16, color: "rgba(44,85,48,0.2)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 30, color: "#2c3e2c" }}>
                    {card.value}
                  </p>
                  <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#5a6b5a", marginTop: 2 }}>
                    {card.descricao}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 13, color: "#2c3e2c" }}>
                    {card.label}
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: 500,
                      color: card.trendColor,
                      backgroundColor: `${card.bg}`,
                    }}
                  >
                    {card.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CONTEÚDO PRINCIPAL ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Pedidos recentes */}
          <div
            className="xl:col-span-2 rounded-xl p-6"
            style={{ backgroundColor: "#ffffff", border: "1px solid rgba(44,85,48,0.08)", boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 17 }}
                >
                  Pedidos Recentes
                </h2>
                <div
                  className="mt-1"
                  style={{ height: 2, width: 40, background: `linear-gradient(90deg, ${GREEN}, transparent)`, borderRadius: 1 }}
                />
              </div>
              <a
                href="/farmacia/pedidos"
                className="twala-link text-sm"
                style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, color: GREEN, fontSize: 13 }}
              >
                Ver todos →
              </a>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => {
                const config = statusConfig[order.status];
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                    style={{
                      border: "1px solid rgba(44,85,48,0.06)",
                      backgroundColor: "#faf7f2",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = GOLD;
                      (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(199,162,82,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,85,48,0.06)";
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#faf7f2";
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(44,85,48,0.08)" }}
                      >
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13, color: GREEN }}>
                          {order.cliente.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 13, color: "#2c3e2c", lineHeight: 1.3 }}>
                          {order.cliente}
                        </p>
                        <p className="truncate" style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#5a6b5a" }}>
                          {order.medicamento}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontWeight: 500,
                          backgroundColor: config.bg,
                          color: config.color,
                          border: `1px solid ${config.border}`,
                        }}
                      >
                        {config.label}
                      </span>
                      <div className="text-right">
                        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 13, color: "#2c3e2c" }}>
                          {order.total.toLocaleString()} Kz
                        </p>
                        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "#7a8a7a" }}>
                          {order.hora}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desempenho */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "#ffffff", border: "1px solid rgba(44,85,48,0.08)", boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}
          >
            <h2
              className="mb-1"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 17 }}
            >
              Desempenho Mensal
            </h2>
            <div
              className="mb-5"
              style={{ height: 2, width: 40, background: `linear-gradient(90deg, ${GOLD}, transparent)`, borderRadius: 1 }}
            />

            <div className="space-y-4">
              {[
                {
                  label: "Receita do Mês", value: "128.500 Kz", trend: "+18% vs mês anterior",
                  icon: TrendingUp, bg: "rgba(44,85,48,0.06)", color: GREEN, trendColor: GREEN,
                },
                {
                  label: "Pedidos Concluídos", value: "114", trend: "de 127 pedidos recebidos",
                  icon: ShoppingBag, bg: "rgba(199,162,82,0.08)", color: "#8a6e25", trendColor: "#8a6e25",
                },
                {
                  label: "Avaliação Média", value: "4.7 ★", trend: "baseado em 89 avaliações",
                  icon: Star, bg: "rgba(212,160,50,0.08)", color: "#b07a1a", trendColor: "#b07a1a",
                },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.label}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: m.bg }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#5a6b5a" }}>{m.label}</p>
                      <Icon style={{ width: 14, height: 14, color: m.color }} />
                    </div>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: m.color }}>
                      {m.value}
                    </p>
                    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: m.trendColor, marginTop: 2 }}>
                      {m.trend}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Mini gráfico */}
            <div className="mt-6">
              <p
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: 10, fontWeight: 600, color: "#7a8a7a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}
              >
                Pedidos por dia (última semana)
              </p>
              <div className="flex items-end gap-1 h-14">
                {[6, 9, 5, 12, 8, 14, 10].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full rounded-t transition-colors duration-200 cursor-pointer"
                      style={{
                        height: `${(val / 14) * 100}%`,
                        background: `linear-gradient(to top, ${GREEN}, #4a7856)`,
                        minHeight: 4,
                      }}
                      title={`${val} pedidos`}
                    />
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 9, color: "#9aab9a", marginTop: 3 }}>
                      {["S","T","Q","Q","S","S","D"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FarmaciaLayout>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, CheckCircle2, AlertCircle, Info, Package, Truck, Clock,
  XCircle, Settings, CheckCheck, Trash2, Mail, ShieldAlert,
  Calendar, Star, MessageSquare, X, ArrowLeft,
} from "lucide-react";

const GREEN = "#2c5530";
const GOLD  = "#c7a252";

type NotificationType = "sucesso" | "alerta" | "informacao" | "entrega" | "promocao" | "pedido" | "seguranca";
type Filter = "all" | "unread" | "sucesso" | "alerta" | "entrega";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
  date: string;
  actionUrl?: string;
}

const INITIAL: Notification[] = [
  { id: "1",  title: "Pedido Confirmado",          message: "Seu pedido #TW202400123 foi confirmado e está sendo preparado.",                   type: "sucesso",    time: "Há 5 minutos",  read: false, date: "Hoje",   actionUrl: "/pedidos/TW202400123" },
  { id: "2",  title: "Entrega em Andamento",        message: "Seu pedido saiu para entrega. Previsão de chegada: 20–30 minutos.",              type: "entrega",    time: "Há 30 minutos", read: false, date: "Hoje",   actionUrl: "/cliente/acompanhar-entrega" },
  { id: "3",  title: "Medicamento em Promoção",     message: "Paracetamol 500mg com 20% de desconto por tempo limitado!",                     type: "promocao",   time: "Há 2 horas",    read: true,  date: "Hoje",   actionUrl: "/farmacos" },
  { id: "4",  title: "Receita Médica Pendente",     message: "A receita do seu pedido #TW202400122 precisa ser validada.",                     type: "alerta",     time: "Há 1 dia",      read: false, date: "Ontem",  actionUrl: "/cliente/receitas-enviadas" },
  { id: "5",  title: "Atualização do Sistema",      message: "Novos recursos disponíveis na plataforma TwalaCare.",                           type: "informacao", time: "Há 2 dias",     read: true,  date: "15 Mar", actionUrl: "/" },
  { id: "6",  title: "Entrega Concluída",           message: "Seu pedido #TW202400121 foi entregue com sucesso!",                             type: "sucesso",    time: "Há 3 dias",     read: true,  date: "14 Mar", actionUrl: "/cliente/historico-compras" },
  { id: "7",  title: "Lembrete de Reabastecimento", message: "O seu medicamento de uso contínuo está a acabar. Deseja reabastecer?",          type: "alerta",     time: "Há 4 dias",     read: true,  date: "13 Mar", actionUrl: "/farmacos" },
  { id: "8",  title: "Pedido Cancelado",            message: "O pedido #TW202400120 foi cancelado conforme solicitado.",                      type: "sucesso",    time: "Há 5 dias",     read: true,  date: "12 Mar", actionUrl: "/cliente/historico-compras" },
  { id: "9",  title: "Alerta de Segurança",         message: "Detectámos um novo acesso à sua conta. Foi você?",                             type: "seguranca",  time: "Há 1 semana",   read: true,  date: "10 Mar", actionUrl: "/" },
  { id: "10", title: "Consulta Agendada",           message: "A sua consulta com o farmacêutico está agendada para amanhã às 14h.",           type: "informacao", time: "Há 1 semana",   read: true,  date: "9 Mar",  actionUrl: "/" },
  { id: "11", title: "Avaliação Pendente",          message: "Como foi a sua experiência com a última compra? Conte-nos!",                    type: "pedido",     time: "Há 2 semanas",  read: true,  date: "5 Mar",  actionUrl: "/cliente/historico-compras" },
  { id: "12", title: "Newsletter TwalaCare",        message: "Confira as novidades de Março sobre saúde e bem-estar.",                        type: "informacao", time: "Há 2 semanas",  read: true,  date: "1 Mar",  actionUrl: "/" },
];

// ─── Configuração visual de cada tipo ────────────────────────────────────────
const TYPE_CONFIG: Record<NotificationType, { icon: typeof Bell; bg: string; color: string; label: string }> = {
  sucesso:    { icon: CheckCircle2,   bg: "rgba(44,85,48,0.1)",    color: GREEN,     label: "Sucesso"     },
  alerta:     { icon: AlertCircle,    bg: "rgba(199,162,82,0.15)", color: "#a07a2a", label: "Alerta"      },
  informacao: { icon: Info,           bg: "rgba(74,120,200,0.1)",  color: "#3a60b0", label: "Informação"  },
  entrega:    { icon: Truck,          bg: "rgba(44,85,48,0.08)",   color: "#4a7856", label: "Entrega"     },
  promocao:   { icon: Star,           bg: "rgba(199,162,82,0.18)", color: "#8a6010", label: "Promoção"    },
  pedido:     { icon: Package,        bg: "rgba(120,80,180,0.1)",  color: "#7050b0", label: "Pedido"      },
  seguranca:  { icon: ShieldAlert,    bg: "rgba(212,90,90,0.1)",   color: "#d45a5a", label: "Segurança"   },
};

// ─── Toggle switch reutilizável ───────────────────────────────────────────────
function Toggle({ defaultChecked = true }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
      style={{ backgroundColor: on ? GREEN : "rgba(44,85,48,0.2)" }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const [filter, setFilter]               = useState<Filter>("all");
  const [showSettings, setShowSettings]   = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const todayCount  = notifications.filter((n) => n.date === "Hoje").length;
  const last7Count  = notifications.filter((n) =>
    ["Hoje","Ontem","15 Mar","14 Mar","13 Mar","12 Mar","11 Mar"].includes(n.date)
  ).length;

  const filtered = notifications.filter((n) => {
    if (filter === "all")    return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const byDate = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    (acc[n.date] ??= []).push(n);
    return acc;
  }, {});

  const markAsRead    = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = ()            => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const deleteOne     = (id: string) => setNotifications((p) => p.filter((n) => n.id !== id));
  const deleteRead    = ()            => setNotifications((p) => p.filter((n) => !n.read));

  const FILTERS: { key: Filter; label: string; icon?: typeof Bell }[] = [
    { key: "all",     label: `Todas (${notifications.length})` },
    { key: "unread",  label: `Não Lidas (${unreadCount})` },
    { key: "sucesso", label: "Sucesso",  icon: CheckCircle2 },
    { key: "alerta",  label: "Alertas",  icon: AlertCircle },
    { key: "entrega", label: "Entregas", icon: Truck },
  ];

  return (
    <div className="twala-page-enter" style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}>

      {/* ── Cabeçalho da página ── */}
      <div className="sticky top-0 z-20"
        style={{ backgroundColor: "#fff", borderBottom: "1px solid rgba(44,85,48,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          {/* Esquerda */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(44,85,48,0.1)" }}>
                <Bell style={{ width: 20, height: 20, color: GREEN }} />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: "#d45a5a", fontSize: 10, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 18, color: "#2c3e2c" }}>
                Notificações
              </h1>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#5a6b5a" }}>
                {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}` : "Tudo em dia"}
              </p>
            </div>
          </div>

          {/* Direita */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: showSettings ? "rgba(44,85,48,0.1)" : "transparent", color: GREEN }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(44,85,48,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = showSettings ? "rgba(44,85,48,0.1)" : "transparent")}
            >
              <Settings style={{ width: 18, height: 18 }} />
            </button>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors"
              style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, fontWeight: 500, color: GREEN, border: "1px solid rgba(44,85,48,0.2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(44,85,48,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              Voltar
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-6 space-y-5">

        {/* ── Painel de Configurações ── */}
        {showSettings && (
          <div className="rounded-2xl p-5 twala-page-enter"
            style={{ backgroundColor: "#fff", border: "1px solid rgba(44,85,48,0.12)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Settings style={{ width: 16, height: 16, color: GREEN }} />
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c" }}>
                  Configurações de Notificações
                </h3>
              </div>
              <button onClick={() => setShowSettings(false)} style={{ color: "#9aab9a" }} className="hover:text-red-400 transition-colors">
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Notificações por Email",       desc: "Receba cópias das notificações por email" },
                { label: "Notificações de Promoções",    desc: "Alertas sobre descontos e ofertas" },
                { label: "Lembretes de Medicamentos",    desc: "Alertas para reabastecimento" },
                { label: "Actualizações de Entregas",    desc: "Estado em tempo real das suas encomendas" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 py-3"
                  style={{ borderBottom: "1px solid rgba(44,85,48,0.08)" }}>
                  <div>
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: 14, color: "#2c3e2c" }}>{item.label}</p>
                    <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#9aab9a", marginTop: 2 }}>{item.desc}</p>
                  </div>
                  <Toggle />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Estatísticas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Bell,         value: todayCount,  label: "Notificações Hoje",   bg: "rgba(44,85,48,0.08)",    color: GREEN     },
            { icon: AlertCircle,  value: unreadCount, label: "Não Lidas",           bg: "rgba(199,162,82,0.12)",  color: "#a07a2a" },
            { icon: Calendar,     value: last7Count,  label: "Últimos 7 dias",      bg: "rgba(74,120,86,0.1)",    color: "#4a7856" },
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

        {/* ── Filtros + Ações ── */}
        <div className="rounded-2xl p-4"
          style={{ backgroundColor: "#fff", border: "1px solid rgba(44,85,48,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(({ key, label, icon: Icon }) => {
                const active = filter === key;
                return (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200"
                    style={{
                      fontFamily: "'Roboto',sans-serif", fontSize: 13, fontWeight: active ? 600 : 400,
                      backgroundColor: active ? GREEN : "transparent",
                      color: active ? "#fff" : "#5a6b5a",
                      border: active ? `1.5px solid ${GREEN}` : "1.5px solid rgba(44,85,48,0.15)",
                    }}
                  >
                    {Icon && <Icon style={{ width: 13, height: 13 }} />}
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, fontWeight: 500, color: GREEN, backgroundColor: "rgba(44,85,48,0.07)", border: "1px solid rgba(44,85,48,0.15)" }}
              >
                <CheckCheck style={{ width: 13, height: 13 }} />
                Marcar todas
              </button>
              <button
                onClick={deleteRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200"
                style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, fontWeight: 500, color: "#d45a5a", backgroundColor: "rgba(212,90,90,0.06)", border: "1px solid rgba(212,90,90,0.2)" }}
              >
                <Trash2 style={{ width: 13, height: 13 }} />
                Limpar lidas
              </button>
            </div>
          </div>
        </div>

        {/* ── Lista de Notificações ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "#fff", border: "1px solid rgba(44,85,48,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>

          {Object.keys(byDate).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(44,85,48,0.08)" }}>
                <Bell style={{ width: 30, height: 30, color: "#9aab9a" }} />
              </div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: 15, color: "#5a6b5a" }}>
                {filter === "unread" ? "Nenhuma notificação não lida" : "Nenhuma notificação encontrada"}
              </p>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#9aab9a", marginTop: 4 }}>
                {filter === "unread" ? "Tudo em dia! Volte mais tarde." : "Tente mudar o filtro."}
              </p>
            </div>
          ) : (
            Object.entries(byDate).map(([date, items], gi) => (
              <div key={date}>
                {/* Separador de data */}
                <div className="px-5 py-2.5 flex items-center gap-3"
                  style={{ backgroundColor: "rgba(44,85,48,0.03)", borderTop: gi === 0 ? "none" : "1px solid rgba(44,85,48,0.07)" }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    {date}
                  </span>
                  <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#9aab9a" }}>
                    · {items.length} notificação{items.length > 1 ? "ões" : ""}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(44,85,48,0.1)" }} />
                </div>

                {/* Itens */}
                {items.map((n, i) => {
                  const cfg = TYPE_CONFIG[n.type];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={n.id}
                      className="px-5 py-4 flex items-start gap-4 transition-colors duration-150"
                      style={{
                        backgroundColor: n.read ? "transparent" : "rgba(44,85,48,0.03)",
                        borderTop: i === 0 ? "none" : "1px solid rgba(44,85,48,0.06)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(44,85,48,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = n.read ? "transparent" : "rgba(44,85,48,0.03)")}
                    >
                      {/* Ícone do tipo */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: cfg.bg }}>
                        <Icon style={{ width: 18, height: 18, color: cfg.color }} />
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span style={{
                                fontFamily: "'Poppins',sans-serif",
                                fontWeight: n.read ? 500 : 600,
                                fontSize: 14,
                                color: n.read ? "#5a6b5a" : "#2c3e2c",
                              }}>
                                {n.title}
                              </span>
                              {/* Ponto não lido */}
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: GREEN }} />
                              )}
                              {/* Badge tipo */}
                              <span className="px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ fontFamily: "'Roboto',sans-serif", fontSize: 10, fontWeight: 600, backgroundColor: cfg.bg, color: cfg.color }}>
                                {cfg.label}
                              </span>
                            </div>
                            <p className="mt-1" style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#5a6b5a", lineHeight: 1.5 }}>
                              {n.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#9aab9a" }}>{n.time}</span>
                              {n.actionUrl && (
                                <Link to={n.actionUrl}
                                  onClick={() => markAsRead(n.id)}
                                  style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: GREEN, fontWeight: 500 }}
                                  className="hover:opacity-75 transition-opacity">
                                  Ver detalhes →
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Botões de ação */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!n.read && (
                              <button onClick={() => markAsRead(n.id)}
                                title="Marcar como lida"
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                                style={{ color: "#9aab9a" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(44,85,48,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = GREEN; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#9aab9a"; }}>
                                <CheckCircle2 style={{ width: 15, height: 15 }} />
                              </button>
                            )}
                            <button onClick={() => deleteOne(n.id)}
                              title="Eliminar"
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                              style={{ color: "#9aab9a" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(212,90,90,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#d45a5a"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#9aab9a"; }}>
                              <Trash2 style={{ width: 15, height: 15 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* ── Dica informativa ── */}
        <div className="rounded-2xl p-5 flex items-start gap-4"
          style={{ backgroundColor: "rgba(44,85,48,0.04)", border: "1px solid rgba(44,85,48,0.12)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(44,85,48,0.1)" }}>
            <Info style={{ width: 17, height: 17, color: GREEN }} />
          </div>
          <div>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: GREEN, marginBottom: 6 }}>
              Sobre as notificações
            </p>
            <ul className="space-y-1.5">
              {[
                "Notificações não lidas aparecem com ponto verde e fundo destacado.",
                "Clique em «Ver detalhes» para aceder directamente à informação.",
                "Configure as suas preferências no ícone de engrenagem no topo.",
                "Notificações com mais de 30 dias são arquivadas automaticamente.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2"
                  style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#4a7856" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: GOLD }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

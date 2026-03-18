import { Link } from 'react-router-dom';
import {
  PackageOpen,
  Truck,
  CheckCircle2,
  Banknote,
  TrendingUp,
  Star,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';
import { EntregadorLayout } from '../../layouts/EntregadorLayout';
import { DashboardCard } from '../../components/Entregador/DashboardCard';
import { StatusEntrega } from '../../components/Entregador/StatusEntrega';
import { useEntregadorStore } from '../../store/entregadorStore';
import { useAuth } from '../../hooks/useAuth';

export function EntregadorDashboard() {
  const { user } = useAuth();
  const { disponivel, toggleDisponivel, entregasDisponiveis, entregasAtivas, historico, perfil } =
    useEntregadorStore();

  const ganhosDia = entregasAtivas.reduce((acc, e) => acc + e.valor, 0) +
    historico
      .filter((e) => e.data.startsWith('08/03/2026'))
      .reduce((acc, e) => acc + e.valor, 0);

  const cards = [
    {
      titulo: 'Entregas Disponíveis',
      valor: entregasDisponiveis.length,
      descricao: 'aguardando para serem aceites',
      icon: PackageOpen,
      corIcone: 'text-blue-600',
      fundoIcone: 'bg-blue-50',
      rodape: 'Ver entregas →',
      corRodape: 'text-blue-500',
    },
    {
      titulo: 'Entregas em Andamento',
      valor: entregasAtivas.length,
      descricao: 'entregas em curso agora',
      icon: Truck,
      corIcone: 'text-purple-600',
      fundoIcone: 'bg-purple-50',
      rodape: entregasAtivas.length > 0 ? 'Em andamento' : 'Nenhuma activa',
      corRodape: entregasAtivas.length > 0 ? 'text-purple-500' : 'text-gray-400',
    },
    {
      titulo: 'Entregas Concluídas',
      valor: historico.length,
      descricao: 'total de entregas finalizadas',
      icon: CheckCircle2,
      corIcone: 'text-green-600',
      fundoIcone: 'bg-green-50',
      rodape: `${historico.length} no total`,
      corRodape: 'text-green-500',
    },
    {
      titulo: 'Ganhos do Dia',
      valor: `${ganhosDia.toLocaleString()} Kz`,
      descricao: 'valor acumulado hoje',
      icon: Banknote,
      corIcone: 'text-amber-600',
      fundoIcone: 'bg-amber-50',
      rodape: `Mês: ${perfil.ganhosMes.toLocaleString()} Kz`,
      corRodape: 'text-amber-500',
    },
  ];

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <EntregadorLayout disponivel={disponivel} onToggleDisponivel={toggleDisponivel}>
      <div className="twala-page-enter p-6 lg:p-8 space-y-8" style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}>
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                color: "#2c3e2c",
                marginBottom: 4,
              }}
            >
              {saudacao}, {user?.nome?.split(' ')[0] ?? 'Entregador'}!
            </h1>
            <div style={{ width: 50, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 13 }}>
              Visão geral das suas actividades de hoje
            </p>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 20,
              border: `2px solid ${disponivel ? "#c7a252" : "#e0e0e0"}`,
              backgroundColor: disponivel ? "rgba(199,162,82,0.08)" : "#f5f5f5",
              fontFamily: "'Roboto', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: disponivel ? "#2c5530" : "#888",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: disponivel ? "#2c5530" : "#bbb",
                animation: disponivel ? "pulse 2s infinite" : "none",
              }}
            />
            {disponivel ? 'Online — Disponível' : 'Offline'}
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {cards.map((card) => (
            <DashboardCard key={card.titulo} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Entregas em andamento */}
          <div className="twala-card xl:col-span-2 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 17, color: "#2c3e2c" }}>
                Entregas Activas
              </h2>
              <Link
                to="/entregador/minhas-entregas"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  color: "#4a7856",
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#2c5530"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#4a7856"; }}
              >
                Ver todas <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            {entregasAtivas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    backgroundColor: "rgba(44,85,48,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Truck style={{ width: 32, height: 32, color: "#4a7856" }} />
                </div>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, color: "#4a7856", fontSize: 14 }}>
                  Nenhuma entrega em andamento
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888", marginTop: 4 }}>
                  Aceite uma entrega disponível para começar
                </p>
                <Link
                  to="/entregador/entregas-disponiveis"
                  className="twala-btn-primary"
                  style={{ marginTop: 16, display: "inline-block", fontSize: 13 }}
                >
                  Ver Entregas Disponíveis
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {entregasAtivas.map((entrega) => (
                  <div
                    key={entrega.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 16,
                      borderRadius: 10,
                      border: "1px solid #e8f0e9",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#c7a252";
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(199,162,82,0.04)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#e8f0e9";
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                    }}
                    className="sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "rgba(44,85,48,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Truck style={{ width: 20, height: 20, color: "#2c5530" }} />
                      </div>
                      <div className="min-w-0">
                        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, color: "#2c3e2c" }}>
                          {entrega.cliente}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin style={{ width: 12, height: 12, color: "#4a7856" }} />
                          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#4a7856" }}>{entrega.clienteEndereco}</p>
                        </div>
                        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888", marginTop: 2 }}>
                          via {entrega.farmacia}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 mt-2 sm:mt-0">
                      <StatusEntrega status={entrega.status} />
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 14, color: "#2c5530" }}>
                        {entrega.valor.toLocaleString()} Kz
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Painel de desempenho */}
          <div className="twala-card p-6 space-y-4">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 17, color: "#2c3e2c" }}>
              Desempenho
            </h2>

            {[
              { label: "Ganhos do Mês", value: `${perfil.ganhosMes.toLocaleString()} Kz`, sub: "+12% vs mês anterior", icon: TrendingUp, bg: "rgba(44,85,48,0.07)", color: "#2c5530" },
              { label: "Total de Entregas", value: perfil.totalEntregas, sub: "desde o início", icon: CheckCircle2, bg: "rgba(74,120,86,0.08)", color: "#4a7856" },
              { label: "Avaliação Média", value: `${perfil.avaliacao} ★`, sub: "baseado em avaliações", icon: Star, bg: "rgba(199,162,82,0.12)", color: "#a07a2a" },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: stat.bg, borderRadius: 10, padding: 16 }}>
                <div className="flex items-center justify-between mb-1">
                  <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#666" }}>{stat.label}</p>
                  <stat.icon style={{ width: 16, height: 16, color: stat.color }} />
                </div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: stat.color, margin: 0 }}>
                  {stat.value}
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: stat.color, marginTop: 2, opacity: 0.8 }}>
                  {stat.sub}
                </p>
              </div>
            ))}

            {/* Mini gráfico */}
            <div className="pt-2">
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Entregas por dia (última semana)
              </p>
              <div className="flex items-end gap-1" style={{ height: 64 }}>
                {[5, 8, 4, 11, 7, 13, 9].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "#2c5530",
                        borderRadius: "3px 3px 0 0",
                        height: `${(val / 13) * 100}%`,
                        transition: "background-color 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#c7a252"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#2c5530"; }}
                      title={`${val} entregas`}
                    />
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 9, color: "#888", marginTop: 4 }}>
                      {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Entregas disponíveis (prévia) */}
        {entregasDisponiveis.length > 0 && (
          <div className="twala-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 17, color: "#2c3e2c", margin: 0 }}>
                  Entregas Disponíveis
                </h2>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856", marginTop: 2 }}>
                  {entregasDisponiveis.length} entrega(s) perto de você
                </p>
              </div>
              <Link
                to="/entregador/entregas-disponiveis"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  color: "#4a7856",
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#2c5530"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#4a7856"; }}
              >
                Ver todas <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {entregasDisponiveis.slice(0, 3).map((entrega) => (
                <div
                  key={entrega.id}
                  style={{
                    border: "1px solid #e8f0e9",
                    borderRadius: 10,
                    padding: 16,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#c7a252";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(44,85,48,0.1)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#e8f0e9";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, color: "#2c3e2c" }}>
                      {entrega.farmacia}
                    </span>
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "#888" }}>
                      {entrega.criadoEm}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin style={{ width: 12, height: 12, color: "#4a7856" }} />
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#4a7856" }}>{entrega.clienteEndereco}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Clock style={{ width: 12, height: 12, color: "#c7a252" }} />
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888" }}>
                      {entrega.distancia} · {entrega.tempoEstimado}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, color: "#2c5530" }}>
                      {entrega.valor.toLocaleString()} Kz
                    </span>
                    <Link
                      to="/entregador/entregas-disponiveis"
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: 12,
                        color: "#4a7856",
                        textDecoration: "none",
                        fontWeight: 500,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#c7a252"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#4a7856"; }}
                    >
                      Ver detalhes →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </EntregadorLayout>
  );
}

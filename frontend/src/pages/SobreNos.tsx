import { CheckCircle, Users, Heart, Shield } from "lucide-react";
import { FloatingChat } from "../components/layout/FloatingChat";
import { Link } from "react-router-dom";

const GREEN = "#2c5530";
const GOLD  = "#c7a252";

const valores = [
  { icon: CheckCircle, title: "Qualidade",       desc: "Garantimos medicamentos autênticos de farmácias certificadas",           color: GREEN },
  { icon: Users,       title: "Acessibilidade",  desc: "Tornamos os cuidados de saúde acessíveis a todos os angolanos",          color: "#3a6b50" },
  { icon: Heart,       title: "Cuidado",         desc: "Tratamos cada cliente com atenção e profissionalismo",                   color: "#4a7856" },
  { icon: Shield,      title: "Segurança",       desc: "Protegemos seus dados e garantimos entregas seguras",                    color: GOLD },
];

const stats = [
  { num: "150+",  label: "Farmácias Parceiras" },
  { num: "50k+",  label: "Clientes Ativos" },
  { num: "200k+", label: "Entregas Realizadas" },
  { num: "4.8★",  label: "Avaliação Média" },
];

export function SobreNos() {
  return (
    <div className="min-h-screen twala-page-enter" style={{ backgroundColor: "#faf7f2" }}>

      {/* ── HERO ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${GREEN} 0%, #3a6b40 60%, #2c5530 100%)` }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: GOLD, transform: "translate(30%, -30%)" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6 flex justify-center">
            <span className="twala-seal">Sobre Nós</span>
          </div>
          <h1
            className="mb-6"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: "clamp(32px,5vw,52px)" }}
          >
            Sobre a TwalaCare
          </h1>
          <p
            className="max-w-3xl mx-auto"
            style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.85)", fontSize: 18, lineHeight: 1.7 }}
          >
            Revolucionando o acesso a medicamentos e serviços farmacêuticos em Angola
          </p>
        </div>
      </section>

      {/* ── NOSSA HISTÓRIA ── */}
      <section className="py-16" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="twala-seal" style={{ fontSize: 11 }}>Nossa Jornada</span>
              </div>
              <h2
                className="mb-6 twala-title-underline"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: "clamp(24px,3.5vw,36px)" }}
              >
                Nossa História
              </h2>
              {[
                "A TwalaCare nasceu da necessidade de facilitar o acesso a medicamentos de qualidade em Angola. Percebemos que muitas pessoas enfrentavam dificuldades para encontrar medicamentos específicos, comparar preços e receber orientação farmacêutica adequada.",
                "Em 2025, lançamos nossa plataforma com a missão de conectar farmácias certificadas a clientes em todo o país, oferecendo conveniência, transparência e rapidez na entrega.",
                "Hoje, somos a maior rede de farmácias online de Angola, servindo milhares de clientes e trabalhando com centenas de farmácias parceiras.",
              ].map((text, i) => (
                <p key={i} style={{ fontFamily: "'Roboto', sans-serif", color: "#4a5a4a", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
                  {text}
                </p>
              ))}
            </div>
            <div className="relative">
              <div className="absolute -top-3 -right-3 w-full h-full rounded-2xl" style={{ backgroundColor: "rgba(199,162,82,0.08)" }} />
              <img
                src="https://images.unsplash.com/photo-1638366170204-d5b084f93872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMHRlYW0lMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2OTE2MzkwMHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Equipe TwalaCare"
                className="rounded-2xl shadow-xl w-full object-cover relative z-10"
                style={{ height: 400, border: "2px solid rgba(199,162,82,0.2)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── NOSSOS VALORES ── */}
      <section className="py-16 twala-section-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: "clamp(24px,3.5vw,36px)", marginBottom: 12 }}
            >
              Nossos Valores
            </h2>
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 16 }}>
              Princípios que guiam nosso trabalho diário
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="rounded-xl p-6 text-center transition-all duration-300"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid rgba(44,85,48,0.08)",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
                  borderTop: `3px solid ${color}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(44,85,48,0.12)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.04)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${color}12` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 17, marginBottom: 8 }}
                >
                  {title}
                </h3>
                <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 14, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSÃO & VISÃO ── */}
      <section className="py-16" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute -bottom-3 -left-3 w-full h-full rounded-2xl" style={{ backgroundColor: "rgba(199,162,82,0.06)" }} />
              <img
                src="https://images.unsplash.com/photo-1576091358783-a212ec293ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjaXN0JTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc2OTE0NjkxNHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Atendimento farmacêutico"
                className="rounded-2xl shadow-xl w-full object-cover relative z-10"
                style={{ height: 400, border: "2px solid rgba(199,162,82,0.2)" }}
              />
            </div>
            <div className="order-1 md:order-2">
              <h2
                className="mb-4 twala-title-underline"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: "clamp(22px,3vw,32px)" }}
              >
                Nossa Missão
              </h2>
              <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a5a4a", fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
                Facilitar o acesso a medicamentos de qualidade e serviços farmacêuticos 
                profissionais para todos os angolanos, através de uma plataforma digital 
                moderna, segura e conveniente.
              </p>
              <div style={{ height: 2, background: `linear-gradient(90deg, ${GOLD}, transparent)`, width: 80, borderRadius: 2, marginBottom: 24 }} />
              <h2
                className="mb-4"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: "clamp(22px,3vw,32px)" }}
              >
                Nossa Visão
              </h2>
              <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a5a4a", fontSize: 16, lineHeight: 1.8 }}>
                Ser a plataforma de saúde digital mais confiável e abrangente de Angola, 
                expandindo nossos serviços para cobrir todas as necessidades de saúde dos 
                nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ESTATÍSTICAS ── */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #3a6b40 100%)` }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: GOLD, transform: "translate(40%, -40%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(32px,5vw,48px)", color: GOLD, lineHeight: 1 }}>
                  {s.num}
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 8 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 flex justify-center">
            <span className="twala-seal">Junte-se a Nós</span>
          </div>
          <h2
            className="mb-4 mt-4"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: "clamp(24px,3.5vw,36px)" }}
          >
            Junte-se à TwalaCare
          </h2>
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Seja você cliente, farmácia ou entregador, temos um lugar para você
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="twala-btn-primary inline-flex items-center gap-2" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Criar Conta
            </Link>
            <Link to="/farmacos" className="twala-btn-outline inline-flex items-center gap-2" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Explorar Medicamentos
            </Link>
          </div>
        </div>
      </section>

      <FloatingChat />
    </div>
  );
}

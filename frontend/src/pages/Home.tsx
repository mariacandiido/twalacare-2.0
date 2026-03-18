import { Link } from "react-router-dom";
import { Pill, Truck, PhoneCall, Star, MapPin, Clock } from "lucide-react";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FloatingChat } from "../components/layout/FloatingChat";

/* ── DADOS DO CARROSSEL ── */
const carouselImages = [
  { id: "0", image: "src/images/b16.jpg",    alt: "Equipe TwalaCare - Profissionais qualificados" },
  { id: "1", image: "src/images/b10.jpg",    alt: "Medicamentos de qualidade na TwalaCare" },
  { id: "2", image: "src/images/b14.jpg",    alt: "Entrega rápida em Angola" },
  { id: "3", image: "src/images/b8.jpg",     alt: "Farmácias certificadas" },
  { id: "4", image: "src/images/b9.jpg",     alt: "Atendimento farmacêutico online" },
  { id: "5", image: "src/images/b10.jpg",    alt: "Promoções especiais" },
  { id: "6", image: "src/images/b11.jpg",    alt: "Saúde e bem-estar" },
];

import { useEffect, useState } from "react";
import { useFarmaciasStore } from "../store/farmaciasStore";

/* ─── ESTILOS INLINE GLOBAIS ─── */
const GREEN  = "#2c5530";
const GOLD   = "#c7a252";
const BG     = "#faf7f2";
const TEXT   = "#2c3e2c";

export function Home() {
  const { farmacias, fetchFarmacias } = useFarmaciasStore();
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchFarmacias();
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/public/medicamentos`);
        const data = await res.json();
        if (data.success) {
          setMedicamentos(data.data.slice(0, 8)); // Top 8
        }
      } catch (err) {
        console.error("Erro ao carregar medicamentos", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchFarmacias]);

  return (
    <div className="twala-page-enter">

      {/* ══════════════════════════════════════════════════════
          HERO SECTION — Institucional
      ══════════════════════════════════════════════════════ */}
      <section className="twala-hero-section py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Texto à esquerda */}
            <div>
              {/* Selo de confiança */}
              <div className="mb-6">
                <span className="twala-seal">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Farmácia de Confiança · Angola
                </span>
              </div>

              <h1
                className="mb-6 twala-title-underline"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: GREEN }}
              >
                Sua Saúde, Nossa Prioridade
              </h1>

              <p
                className="mb-8 leading-relaxed"
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: 18, color: "#4a5a4a", fontWeight: 400 }}
              >
                Bem-vindo à TwalaCare, a plataforma líder em farmácias online em
                Angola. Oferecemos medicamentos de qualidade, entrega rápida e
                atendimento farmacêutico profissional, tudo ao alcance de um
                clique.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/farmacos"
                  className="twala-btn-primary inline-flex items-center gap-2"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  <Pill className="w-4 h-4" />
                  Explorar Medicamentos
                </Link>
                <Link
                  to="/farmacias"
                  className="twala-btn-outline inline-flex items-center gap-2"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  <MapPin className="w-4 h-4" />
                  Ver Farmácias
                </Link>
              </div>

              {/* Estatísticas rápidas */}
              <div
                className="mt-10 flex flex-wrap gap-6 pt-8"
                style={{ borderTop: "1px solid rgba(44,85,48,0.12)" }}
              >
                {[
                  { num: "50+",    label: "Farmácias parceiras" },
                  { num: "5.000+", label: "Medicamentos" },
                  { num: "30 min", label: "Entrega média" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="font-semibold"
                      style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, color: GREEN }}
                    >
                      {stat.num}
                    </p>
                    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#5a6b5a" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Imagem da equipe à direita */}
            <div className="relative">
              <div
                className="absolute -top-4 -right-4 w-full h-full rounded-2xl"
                style={{ backgroundColor: "rgba(199,162,82,0.1)", zIndex: 0 }}
              />
              <img
                src="src/images/equipaTwala.png"
                alt="Equipe TwalaCare"
                className="rounded-2xl shadow-2xl w-full object-cover relative z-10"
                style={{ height: 420, border: "2px solid rgba(199,162,82,0.25)" }}
              />
              {/* Badge flutuante */}
              <div
                className="absolute bottom-4 left-4 z-20 px-4 py-2 rounded-xl shadow-lg"
                style={{ backgroundColor: "rgba(44,85,48,0.92)", backdropFilter: "blur(8px)" }}
              >
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, color: GOLD, fontWeight: 600 }}>
                  ★ 4.9/5.0
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                  Avaliação dos clientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CARROSSEL DE BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          speed={800}
          className="main-carousel w-full"
        >
          {carouselImages.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style>{`
          .main-carousel { width: 100%; height: 450px; }
          @media (min-width: 768px) { .main-carousel { height: 550px; } }
          .main-carousel .swiper-slide img { width:100%;height:100%;object-fit:cover;object-position:center; }
          .main-carousel .swiper-button-next { right:20px; }
          .main-carousel .swiper-button-prev { left:20px; }
          .main-carousel .swiper-pagination { bottom:20px !important; }
          .main-carousel .swiper-button-next,
          .main-carousel .swiper-button-prev {
            background:rgba(255,255,255,0.9);width:40px;height:40px;
            border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.2);
            color:#2c5530;transition:all 0.3s ease;
          }
          .main-carousel .swiper-button-next:after,
          .main-carousel .swiper-button-prev:after { font-size:16px;font-weight:bold; }
          .main-carousel .swiper-button-next:hover,
          .main-carousel .swiper-button-prev:hover { background:#2c5530;color:white;transform:scale(1.1); }
          .main-carousel .swiper-pagination-bullet { background:#c7a252;opacity:0.5;width:10px;height:10px; }
          .main-carousel .swiper-pagination-bullet-active { background:#2c5530;opacity:1;width:30px;border-radius:5px; }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATÁLOGO DE PRODUTOS (CARROSSEL)
      ══════════════════════════════════════════════════════ */}
      <section className="py-14" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2
                className="mb-2 twala-title-underline"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: TEXT }}
              >
                Catálogo de Produtos
              </h2>
              <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 16, marginTop: 12 }}>
                Descubra nossa variedade de medicamentos
              </p>
            </div>
            <Link to="/farmacos" className="twala-link font-medium" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
              Ver todos →
            </Link>
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              breakpoints={{
                640:  { slidesPerView: 2, spaceBetween: 20 },
                768:  { slidesPerView: 3, spaceBetween: 24 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              loop={true}
              className="catalogo-swiper"
            >
              {medicamentos.map((produto) => (
                <SwiperSlide key={produto.id}>
                  <MedicamentoCard produto={produto} />
                </SwiperSlide>
              ))}
            </Swiper>

            <style>{`
              .catalogo-swiper { width:100%;padding:10px 0 40px 0; }
              .catalogo-swiper .swiper-slide { height:auto; }
              .catalogo-swiper .swiper-button-next,
              .catalogo-swiper .swiper-button-prev {
                background:white;width:36px;height:36px;border-radius:50%;
                box-shadow:0 2px 8px rgba(0,0,0,0.15);color:#2c5530;transition:all 0.3s ease;top:45%;
              }
              .catalogo-swiper .swiper-button-next:after,
              .catalogo-swiper .swiper-button-prev:after { font-size:13px;font-weight:bold; }
              .catalogo-swiper .swiper-button-next:hover,
              .catalogo-swiper .swiper-button-prev:hover { background:#2c5530;color:white;transform:scale(1.1); }
              .line-clamp-2 {display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
            `}</style>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SERVIÇOS
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 twala-section-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: TEXT }}
            >
              Nossos Serviços
            </h2>
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 16 }}>
              Tudo o que você precisa para cuidar da sua saúde
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                to: "/farmacos", icon: Pill,
                title: "Medicamentos com e sem receita",
                desc: "Ampla variedade de medicamentos disponíveis. Compare preços e escolha a melhor opção para você.",
              },
              {
                to: "/entrega", icon: Truck,
                title: "Entrega em até 30 minutos",
                desc: "Entregadores profissionais TwalaCare garantem rapidez e segurança na entrega dos seus medicamentos.",
              },
              {
                to: "/", icon: PhoneCall,
                title: "Atendimento farmacêutico online",
                desc: "Tire suas dúvidas com farmacêuticos qualificados através de chat.",
              },
            ].map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.title}
                  to={svc.to}
                  className="group block rounded-xl p-6 transition-all duration-300"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1.5px solid rgba(44,85,48,0.1)",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = GOLD;
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(44,85,48,0.12)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,85,48,0.1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.04)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "linear-gradient(135deg, rgba(44,85,48,0.1), rgba(199,162,82,0.1))" }}
                  >
                    <Icon className="w-7 h-7" style={{ color: GREEN }} />
                  </div>
                  <h3
                    className="mb-3"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: TEXT, fontSize: 18 }}
                  >
                    {svc.title}
                  </h3>
                  <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 14, lineHeight: 1.7 }}>
                    {svc.desc}
                  </p>
                  {/* Linha decorativa dourada */}
                  <div
                    className="mt-5 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                    style={{ backgroundColor: GOLD }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FÁRMACOS MAIS VENDIDOS
      ══════════════════════════════════════════════════════ */}
      <section className="py-14" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2
                className="twala-title-underline mb-2"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: TEXT }}
              >
                Fármacos Mais Vendidos
              </h2>
              <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", marginTop: 12 }}>
                Os produtos preferidos dos nossos clientes
              </p>
            </div>
            <Link to="/farmacos" className="twala-link font-medium" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {medicamentos.slice(0, 4).map((med) => (
              <MedicamentoCard key={med.id} produto={med} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FARMÁCIAS MAIS ATIVAS
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 twala-section-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2
                className="twala-title-underline mb-2"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: TEXT }}
              >
                Farmácias Mais Ativas
              </h2>
              <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", marginTop: 12 }}>
                Parceiros de confiança com melhor avaliação
              </p>
            </div>
            <Link to="/farmacias" className="twala-link font-medium" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
              Ver todas →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {farmacias.slice(0, 3).map((farmacia) => (
              <div
                key={farmacia.id}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid rgba(44,85,48,0.1)",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = GOLD;
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(44,85,48,0.12)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,85,48,0.1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.04)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div className="h-40 overflow-hidden">
                  <ImageWithFallback
                    src={farmacia.image}
                    alt={farmacia.nome}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3
                    className="mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: TEXT, fontSize: 17 }}
                  >
                    {farmacia.nome}
                  </h3>
                  <div className="flex items-center gap-2 mb-3" style={{ color: "#5a6b5a" }}>
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: GREEN }} />
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13 }}>{farmacia.provincia}, {farmacia.municipio}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" style={{ color: GOLD }} />
                      <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 14, color: TEXT }}>
                        {farmacia.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: "#5a6b5a" }}>
                      <Clock className="w-4 h-4" />
                      <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13 }}>{farmacia.deliveryTime}</span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#5a6b5a", marginBottom: 16 }}>
                    {farmacia.products.toLocaleString()} produtos disponíveis
                  </p>
                  <Link
                    to="/farmacias"
                    className="twala-btn-primary w-full text-center block text-sm"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Visitar Farmácia
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SOBRE NÓS (Resumido)
      ══════════════════════════════════════════════════════ */}
      <section className="py-14" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="twala-seal">Sobre Nós</span>
              </div>
              <h2
                className="mb-5 twala-title-underline"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: TEXT }}
              >
                Sobre a TwalaCare
              </h2>
              <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a5a4a", lineHeight: 1.8, marginBottom: 16 }}>
                Somos uma plataforma angolana dedicada a facilitar o acesso a
                medicamentos e serviços farmacêuticos de qualidade. Conectamos
                farmácias certificadas a clientes em todo o país.
              </p>
              <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a5a4a", lineHeight: 1.8, marginBottom: 28 }}>
                Nossa missão é tornar os cuidados de saúde mais acessíveis,
                convenientes e seguros para todos os angolanos.
              </p>
              <Link
                to="/sobre-nos"
                className="twala-btn-primary inline-flex items-center gap-2"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Saiba Mais
              </Link>
            </div>
            <div className="relative">
              <div
                className="absolute -bottom-4 -left-4 w-full h-full rounded-2xl"
                style={{ backgroundColor: "rgba(199,162,82,0.08)" }}
              />
              <img
                src="https://images.unsplash.com/photo-1576091358783-a212ec293ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjaXN0JTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc2OTE0NjkxNHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Atendimento farmacêutico"
                className="rounded-2xl shadow-xl w-full object-cover relative z-10"
                style={{ height: 350, border: "2px solid rgba(199,162,82,0.2)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ PREVIEW
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 twala-section-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: TEXT }}
            >
              Perguntas Frequentes
            </h2>
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a" }}>
              Respostas para as dúvidas mais comuns
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Como faço para comprar medicamentos?",
                a: "É simples! Pesquise o medicamento desejado, adicione ao carrinho, faça upload da receita (se necessário) e finalize a compra.",
              },
              {
                q: "Qual é o prazo de entrega?",
                a: "A maioria das entregas é realizada em até 30 minutos, dependendo da sua localização e da farmácia escolhida.",
              },
              {
                q: "As farmácias são certificadas?",
                a: "Sim! Todas as farmácias parceiras são devidamente certificadas e regulamentadas pelas autoridades angolanas.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl p-5"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(44,85,48,0.08)",
                  borderLeft: `3px solid ${GREEN}`,
                }}
              >
                <h3
                  className="mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: TEXT, fontSize: 16 }}
                >
                  {faq.q}
                </h3>
                <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 14, lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/faq" className="twala-link font-medium" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
              Ver todas as perguntas →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #3a6b40 100%)` }}
      >
        {/* Decoração de fundo */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: GOLD, transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: GOLD, transform: "translate(-30%, 30%)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="twala-seal mb-6 inline-flex" style={{ backgroundColor: "rgba(199,162,82,0.2)", border: "1px solid rgba(199,162,82,0.5)" }}>
            Comece Hoje
          </span>
          <h2
            className="mb-4 mt-4"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: "clamp(24px,3.5vw,36px)" }}
          >
            Pronto para começar?
          </h2>
          <p
            className="mb-8 max-w-xl mx-auto"
            style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.7 }}
          >
            Crie sua conta e tenha acesso a centenas de medicamentos com entrega
            rápida em todo Angola.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-xl"
            style={{
              backgroundColor: "#ffffff",
              color: GREEN,
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 600,
              fontSize: 15,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = GOLD;
              (e.currentTarget as HTMLElement).style.color = "#ffffff";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff";
              (e.currentTarget as HTMLElement).style.color = GREEN;
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Criar Conta Grátis
          </Link>
        </div>
      </section>

      <FloatingChat />
    </div>
  );
}

/* ── COMPONENTE CARD DE MEDICAMENTO ── */
function MedicamentoCard({ produto }: { produto: any }) {
  return (
    <div
      className="rounded-xl overflow-hidden h-full transition-all duration-300 flex flex-col"
      style={{
        backgroundColor: "#ffffff",
        border: "1.5px solid rgba(44,85,48,0.08)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#c7a252";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(44,85,48,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,85,48,0.08)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <div className="h-40 overflow-hidden">
        <ImageWithFallback
          src={produto.image}
          alt={produto.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="mb-1 line-clamp-2"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: "#2c3e2c", fontSize: 14 }}
        >
          {produto.name}
        </h3>
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#5a6b5a", marginBottom: 8 }}>
          {produto.farmacia}
        </p>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 16, color: "#2c5530" }}>
            {produto.price.toLocaleString()} Kz
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#c7a252" }} />
            <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 13 }}>{produto.rating}</span>
          </div>
        </div>
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#7a8a7a", marginBottom: 12 }}>
          Em stock: {produto.stock}
        </p>
        <Link
          to="/farmacos"
          className="twala-btn-primary w-full text-center block mt-auto"
          style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13 }}
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}

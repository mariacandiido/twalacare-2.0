import { useState } from "react";
import { Search, Star, MapPin, Clock, Phone, Building2 } from "lucide-react";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { FloatingChat } from "../components/layout/FloatingChat";
import { useFarmaciasStore } from "../store/farmaciasStore";

const provincias = ["Todas", "Luanda", "Benguela", "Huíla", "Huambo", "Cabinda"];

export function Farmacias() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("Todas");
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);

  // Apenas farmácias aprovadas pelo admin são visíveis ao público
  const { obterAprovadas } = useFarmaciasStore();
  const farmaciasAprovadas = obterAprovadas();

  const filteredFarmacias = farmaciasAprovadas.filter((farm) => {
    const matchesSearch = farm.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvincia = selectedProvincia === "Todas" || farm.provincia === selectedProvincia;
    const matchesOpen = !showOnlyOpen || farm.isOpen;
    return matchesSearch && matchesProvincia && matchesOpen;
  });

  return (
    <div className="twala-page-enter min-h-screen" style={{ backgroundColor: "#faf7f2" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #2c5530 0%, #4a7856 100%)" }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "rgba(199,162,82,0.2)",
                border: "2px solid rgba(199,162,82,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 style={{ color: "#c7a252", width: 26, height: 26 }} />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                Farmácias Parceiras
              </h1>
              <p style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.8)", margin: 0 }}>
                Encontre farmácias certificadas perto de você
              </p>
            </div>
          </div>
          <div style={{ width: 80, height: 3, background: "linear-gradient(90deg, transparent, #c7a252, transparent)" }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filtros */}
        <div
          className="twala-card p-6 mb-8"
          style={{ borderBottom: "3px solid #c7a252" }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#4a7856",
                  width: 18,
                  height: 18,
                }}
              />
              <input
                type="text"
                placeholder="Pesquisar farmácia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="twala-input"
                style={{ paddingLeft: 44 }}
              />
            </div>
            <select
              value={selectedProvincia}
              onChange={(e) => setSelectedProvincia(e.target.value)}
              className="twala-input"
              style={{ minWidth: 160 }}
            >
              {provincias.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyOpen}
              onChange={(e) => setShowOnlyOpen(e.target.checked)}
              className="twala-checkbox"
            />
            <span style={{ fontFamily: "'Roboto', sans-serif", color: "#2c3e2c", fontSize: 14 }}>
              Mostrar apenas farmácias abertas
            </span>
          </label>
        </div>

        {/* Contagem */}
        <div className="mb-6 flex items-center justify-between">
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 14 }}>
            <span style={{ fontWeight: 600, color: "#2c5530" }}>{filteredFarmacias.length}</span> farmácia(s) encontrada(s)
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmacias.map((farm) => (
            <div
              key={farm.id}
              className="twala-card overflow-hidden"
              style={{ transition: "all 0.3s ease" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = "0 12px 24px rgba(44,85,48,0.15)";
                el.style.borderBottom = "3px solid #c7a252";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
                el.style.borderBottom = "1px solid rgba(0,0,0,0.06)";
              }}
            >
              <div className="relative">
                <ImageWithFallback
                  src={farm.image}
                  alt={farm.nome}
                  className="w-full h-48 object-cover"
                />
                {farm.isOpen ? (
                  <span style={{ position: "absolute", top: 10, right: 10, backgroundColor: "#2c5530", color: "#ffffff", fontSize: 12, padding: "3px 10px", borderRadius: 20, fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
                    Aberta
                  </span>
                ) : (
                  <span style={{ position: "absolute", top: 10, right: 10, backgroundColor: "#d45a5a", color: "#ffffff", fontSize: 12, padding: "3px 10px", borderRadius: 20, fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
                    Fechada
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 18, color: "#2c3e2c", marginBottom: 12 }}>
                  {farm.nome}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2" style={{ color: "#4a7856" }}>
                    <MapPin style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14 }}>{farm.provincia}, {farm.municipio}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: "#4a7856" }}>
                    <Clock style={{ width: 16, height: 16, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14 }}>{farm.horarioAbertura} - {farm.horarioFechamento}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: "#4a7856" }}>
                    <Phone style={{ width: 16, height: 16, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14 }}>{farm.telefone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: "1px solid #e5e5e5" }}>
                  <div className="flex items-center gap-1">
                    <Star style={{ width: 18, height: 18, color: "#c7a252", fill: "#c7a252" }} />
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 15 }}>
                      {farm.rating > 0 ? farm.rating.toFixed(1) : "Novo"}
                    </span>
                  </div>
                  <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856" }}>
                    Entrega: {farm.deliveryTime}
                  </span>
                </div>

                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856", marginBottom: 16 }}>
                  {farm.products > 0 ? `${farm.products} produtos disponíveis` : "Produtos a ser registados"}
                </p>

                <button
                  disabled={!farm.isOpen}
                  className="w-full twala-btn-primary"
                  style={!farm.isOpen ? { backgroundColor: "#e0e0e0", borderColor: "#e0e0e0", color: "#999", cursor: "not-allowed" } : {}}
                >
                  Visitar Farmácia
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFarmacias.length === 0 && (
          <div className="text-center py-16">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "rgba(44,85,48,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Building2 style={{ color: "#4a7856", width: 32, height: 32 }} />
            </div>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, color: "#4a7856", fontWeight: 500 }}>
              Nenhuma farmácia encontrada com os filtros selecionados.
            </p>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#888", marginTop: 8 }}>
              Tente ajustar os filtros de pesquisa.
            </p>
          </div>
        )}
      </div>

      <FloatingChat />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Star, ShoppingCart, Pill } from "lucide-react";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { useCartStore } from "../store/cartStore";
import { useAuth } from "../hooks/useAuth";
import { FloatingChat } from "../components/layout/FloatingChat";
import { medicamentoService } from "../services/medicamentoService";
import type { Medicamento } from "../types";

const categorias = ["Todos", "Analgésicos", "Antibióticos", "Vitaminas", "Antialérgicos", "Digestivos"];
const provincias = ["Todas", "Luanda", "Benguela", "Huíla", "Huambo"];
const farmacias = ["Todas", "Farmácia Central", "Farmácia Saúde", "Farmácia Vida", "Farmácia Bem-Estar"];

export function Farmacos() {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("Todos");
  const [selectedProvincia, setSelectedProvincia] = useState("Todas");
  const [selectedFarmacia, setSelectedFarmacia] = useState("Todas");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    medicamentoService.getAll().then((res) => {
      if (res.success && res.data) {
        setMedicamentos(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  const filteredMedicamentos = medicamentos.filter((med) => {
    const matchesSearch = med.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === "Todos" || med.categoria === selectedCategoria;
    const matchesProvincia = selectedProvincia === "Todas" || med.provincia === selectedProvincia;
    const matchesFarmacia = selectedFarmacia === "Todas" || med.farmacia === selectedFarmacia;
    return matchesSearch && matchesCategoria && matchesProvincia && matchesFarmacia;
  });

  const handleAddToCart = (med: Medicamento) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addItem({
      id: `${med.farmacia}-${med.id}`,
      name: med.nome,
      price: med.price,
      quantity: 1,
      farmacia: med.farmacia,
      image: med.image,
      requiresPrescription: med.requiresPrescription,
    });
  };

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
              <Pill style={{ color: "#c7a252", width: 26, height: 26 }} />
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
                Catálogo de Fármacos
              </h1>
              <p style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.8)", margin: 0 }}>
                Encontre os medicamentos que você precisa
              </p>
            </div>
          </div>
          <div style={{ width: 80, height: 3, background: "linear-gradient(90deg, transparent, #c7a252, transparent)" }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Barra de pesquisa */}
        <div className="twala-card p-6 mb-8" style={{ borderBottom: "3px solid #c7a252" }}>
          <div className="flex flex-col md:flex-row gap-4">
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
                placeholder="Pesquisar medicamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="twala-input"
                style={{ paddingLeft: 44 }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="twala-btn-outline flex items-center gap-2"
              style={showFilters ? { backgroundColor: "#2c5530", color: "#ffffff", borderColor: "#2c5530" } : {}}
            >
              <Filter style={{ width: 16, height: 16 }} />
              Filtros {showFilters ? "▲" : "▼"}
            </button>
          </div>

          {showFilters && (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 mt-5"
              style={{ borderTop: "1px solid #e5e5e5" }}
            >
              <div>
                <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, color: "#2c3e2c", fontSize: 13, display: "block", marginBottom: 8 }}>
                  Categoria
                </label>
                <select value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)} className="twala-input w-full">
                  {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, color: "#2c3e2c", fontSize: 13, display: "block", marginBottom: 8 }}>
                  Província
                </label>
                <select value={selectedProvincia} onChange={(e) => setSelectedProvincia(e.target.value)} className="twala-input w-full">
                  {provincias.map((prov) => <option key={prov} value={prov}>{prov}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, color: "#2c3e2c", fontSize: 13, display: "block", marginBottom: 8 }}>
                  Farmácia
                </label>
                <select value={selectedFarmacia} onChange={(e) => setSelectedFarmacia(e.target.value)} className="twala-input w-full">
                  {farmacias.map((farm) => <option key={farm} value={farm}>{farm}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Contagem */}
        <div className="mb-6">
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 14 }}>
            <span style={{ fontWeight: 600, color: "#2c5530" }}>{filteredMedicamentos.length}</span> medicamento(s) encontrado(s)
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="twala-loading mx-auto mb-4" />
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856" }}>A carregar medicamentos...</p>
          </div>
        )}

        {/* Grid de medicamentos */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicamentos.map((med) => (
              <div
                key={med.id}
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
                    src={med.image}
                    alt={med.nome}
                    className="w-full h-44 object-cover"
                  />
                  {med.requiresPrescription && (
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "#d45a5a",
                        color: "#ffffff",
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 20,
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      Receita Obrigatória
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <span
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#4a7856",
                      backgroundColor: "rgba(74,120,86,0.1)",
                      padding: "2px 8px",
                      borderRadius: 12,
                      display: "inline-block",
                      marginBottom: 8,
                    }}
                  >
                    {med.categoria}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#2c3e2c",
                      marginBottom: 8,
                    }}
                  >
                    {med.name}
                  </h3>

                  <div className="space-y-1 mb-4">
                    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856" }}>{med.farmacia}</p>
                    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888" }}>{med.provincia}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 700,
                          fontSize: 18,
                          color: "#2c5530",
                        }}
                      >
                        {med.price.toLocaleString()} Kz
                      </span>
                      <div className="flex items-center gap-1">
                        <Star style={{ width: 14, height: 14, color: "#c7a252", fill: "#c7a252" }} />
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, fontWeight: 600, color: "#2c3e2c" }}>
                          {med.rating}
                        </span>
                      </div>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: 12,
                        color: med.stock > 0 ? "#4a7856" : "#d45a5a",
                        fontWeight: 500,
                      }}
                    >
                      {med.stock > 0 ? `Em stock: ${med.stock} un.` : "Esgotado"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(med)}
                    disabled={med.stock === 0}
                    className="w-full twala-btn-primary flex items-center justify-center gap-2"
                    style={
                      med.stock === 0
                        ? { backgroundColor: "#e0e0e0", borderColor: "#e0e0e0", color: "#999", cursor: "not-allowed" }
                        : {}
                    }
                  >
                    <ShoppingCart style={{ width: 15, height: 15 }} />
                    {med.stock === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredMedicamentos.length === 0 && (
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
              <Pill style={{ color: "#4a7856", width: 32, height: 32 }} />
            </div>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, color: "#4a7856", fontWeight: 500 }}>
              Nenhum medicamento encontrado.
            </p>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#888", marginTop: 8 }}>
              Tente ajustar os filtros ou pesquisar outro medicamento.
            </p>
          </div>
        )}
      </div>

      <FloatingChat />
    </div>
  );
}

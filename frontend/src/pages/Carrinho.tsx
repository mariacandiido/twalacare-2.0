import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore, DELIVERY_FEE } from "../store/cartStore";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";

export function Carrinho() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  /* Subtotal e total calculados diretamente a partir dos items da store (fonte única de verdade). */
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  /**
   * Altera a quantidade de um item no carrinho.
   * Usa getState() para ler a quantidade atual no momento do clique, evitando estado desatualizado.
   */
  const handleQuantityChange = (id: string, delta: number) => {
    const currentItems = useCartStore.getState().items;
    const current = currentItems.find((i) => i.id === id)?.quantity ?? 1;
    const newQuantity = current + delta;
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="twala-page-enter min-h-screen py-16" style={{ backgroundColor: "#faf7f2" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                backgroundColor: "rgba(44,85,48,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <ShoppingBag style={{ width: 48, height: 48, color: "#4a7856" }} />
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "#2c3e2c",
                marginBottom: 12,
              }}
            >
              O seu carrinho está vazio
            </h2>
            <div style={{ width: 60, height: 3, background: "linear-gradient(90deg, transparent, #c7a252, transparent)", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", marginBottom: 32 }}>
              Adicione medicamentos ao carrinho para continuar
            </p>
            <Link to="/farmacos" className="twala-btn-primary inline-block">
              Explorar Medicamentos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="twala-page-enter min-h-screen py-8" style={{ backgroundColor: "#faf7f2" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              color: "#2c3e2c",
              marginBottom: 4,
            }}
          >
            Carrinho de Compras
          </h1>
          <div style={{ width: 60, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2 }} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de produtos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="twala-card p-6 flex gap-6"
                style={{ transition: "all 0.2s ease" }}
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                  style={{ borderRadius: 8, flexShrink: 0 }}
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: 16,
                          color: "#2c3e2c",
                          marginBottom: 4,
                        }}
                      >
                        {item.name}
                      </h3>
                      <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856" }}>
                        {item.farmacia}
                      </p>
                      {item.requiresPrescription && (
                        <span
                          style={{
                            display: "inline-block",
                            marginTop: 6,
                            fontSize: 11,
                            backgroundColor: "rgba(212,90,90,0.1)",
                            color: "#d45a5a",
                            padding: "2px 8px",
                            borderRadius: 20,
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          Receita Obrigatória
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#d45a5a",
                        padding: 4,
                        borderRadius: 6,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.7"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                    >
                      <Trash2 style={{ width: 18, height: 18 }} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Área dos botões + / - : stopPropagation no contentor para o clique não sair do bloco */}
                    <div
                      className="flex items-center gap-3"
                      role="group"
                      aria-label="Quantidade"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        style={{
                          width: 32,
                          height: 32,
                          backgroundColor: "rgba(44,85,48,0.08)",
                          border: "1px solid rgba(44,85,48,0.15)",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          color: "#2c5530",
                          position: "relative",
                          zIndex: 1,
                          pointerEvents: "auto",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(44,85,48,0.15)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(44,85,48,0.08)"; }}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus style={{ width: 14, height: 14, pointerEvents: "none" }} />
                      </button>
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: 16,
                          color: "#2c3e2c",
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        style={{
                          width: 32,
                          height: 32,
                          backgroundColor: "rgba(44,85,48,0.08)",
                          border: "1px solid rgba(44,85,48,0.15)",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          color: "#2c5530",
                          position: "relative",
                          zIndex: 1,
                          pointerEvents: "auto",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(44,85,48,0.15)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(44,85,48,0.08)"; }}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus style={{ width: 14, height: 14, pointerEvents: "none" }} />
                      </button>
                    </div>

                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        fontSize: 20,
                        color: "#2c5530",
                      }}
                    >
                      {(item.price * item.quantity).toLocaleString()} Kz
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-1">
            <div className="twala-card p-6" style={{ position: "sticky", top: 96, borderBottom: "3px solid #c7a252" }}>
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#2c3e2c",
                  marginBottom: 20,
                }}
              >
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856" }}>Subtotal</span>
                  <span style={{ fontFamily: "'Roboto', sans-serif", color: "#2c3e2c", fontWeight: 500 }}>
                    {subtotal.toLocaleString()} Kz
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856" }}>Taxa de entrega</span>
                  <span style={{ fontFamily: "'Roboto', sans-serif", color: "#2c3e2c", fontWeight: 500 }}>{DELIVERY_FEE.toLocaleString()} Kz</span>
                </div>
                <div
                  className="flex justify-between pt-3"
                  style={{ borderTop: "2px solid #e5e5e5" }}
                >
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c" }}>Total</span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: "#2c5530" }}>
                    {total.toLocaleString()} Kz
                  </span>
                </div>
              </div>

              {items.some((item) => item.requiresPrescription) && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: 16,
                    backgroundColor: "rgba(199,162,82,0.1)",
                    border: "1px solid rgba(199,162,82,0.3)",
                    borderRadius: 8,
                  }}
                >
                  <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#8a6e2f" }}>
                    ⚠️ Alguns produtos requerem receita médica. Você precisará fazer upload no checkout.
                  </p>
                </div>
              )}

              <Link to="/checkout" className="twala-btn-primary block w-full text-center" style={{ marginBottom: 8 }}>
                Finalizar Compra
              </Link>

              <Link
                to="/farmacos"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  fontFamily: "'Roboto', sans-serif",
                  color: "#4a7856",
                  fontSize: 14,
                  padding: "10px 0",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#2c5530"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#4a7856"; }}
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
